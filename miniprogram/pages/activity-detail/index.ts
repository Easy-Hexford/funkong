// pages/activity-detail/index.ts
import * as request from '../../services/index'
import type { IActivityAuditStatus, IActivityInfo, IClubInfo, IGetUserResp, ISelfActivitySignup, ISimpleUserInfo, IUserInfo } from '../../services'
import { calcDistance, getLocation } from '../../utils/location'
import { WeekNames } from '../../utils/util'
import { getPosterQuery } from '../../utils/bind'
import dayjs from 'dayjs'
import { ActivitySignUpBlockTime } from '../../utils/constant'
import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';

const app = getApp()

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {
    scene: {
      type: String,
    },

    ActivityId: {
      type: String,
      value: ''
    },

    RegisterClubId: {
      type: String,
    },

    mode: {
      type: String,
      value: 'normal' // audit
    }
  },

  data: {
    distance: 0,
    date: '',
    Activity: <IActivityInfo>{},
    SelfActivitySignUp: <ISelfActivitySignup | null>null,
    ActivityMembers: <Array<ISimpleUserInfo>>[],
    OwnerUserId: '',
    User: <IUserInfo>{},
    Club: <IClubInfo>{},

    hasSignedUp: false,
    canSignUp: false,
    signUpText: '',
    isActivityEnd: false,
    tipWraning: false,

    loading: true,
    firstPage: false,
    _reenter: false,
    auditResult: <IActivityAuditStatus>'',
  },

  pageLifetimes: {
    show() {
      if (this.data._reenter) {
        this.refreshActivity()
      }
      this.data._reenter = true
    }
  },

  lifetimes: {
    async attached() {
      if (this.data.scene) {
        const posterQuery = await getPosterQuery(this.data.scene)
        this.data.ActivityId = posterQuery.ActivityId!
        this.data.RegisterClubId = posterQuery.RegisterClubId ?? ''
      }

      if (!this.data.ActivityId) {
        console.error('ActivityId prop not found')
        return
      }

      console.info(`${this.route} ActivityId: ${this.data.ActivityId} RegisterClubId: ${this.data.RegisterClubId}`)

      await this.refreshActivity()
      await this.getUser()

      const pageStack = getCurrentPages()
      const firstPage = pageStack.length === 1
      this.setData({ loading: false, firstPage })

      // 用到 User 信息
      this.displayFireWorkIfNeeded()
    }
  },

  methods: {
    displayFireWorkIfNeeded() {
      const User: IUserInfo = app.globalData.User
      if (this.data.RegisterClubId) {
        if (app.globalData.DidRegisterClub || !User.RegisterType) {
          this.setData({
            showFireWork: true
          })
          app.globalData.DidRegisterClub = false
        }
      }
    },

    async getUser() {
      app.getUser().then((resp: IGetUserResp) => {
        this.setData({
          User: resp.User,
          Club: resp.Club,
        })
      })
    },

    async refreshActivity() {
      return request.getActivity({
        ActivityId: this.data.ActivityId
      }).then(resp => {
        const Activity = resp.Activity
        const OwnerUser = Activity.OwnerUser
        const OtherMembers = resp.Activity.ActivitySignUpList.map(i => i.User)

        this.setData({
          Activity,
          SelfActivitySignUp: resp.SelfActivitySignUp,
          OwnerUserId: Activity.UserId,
          ActivityMembers: [OwnerUser, ...OtherMembers],
        })

        this.formatDate()
        this.calcDistance()
        this.checkActivityEnd()
        this.getSignUpText()

        if (Activity.AuditStatus === 'AuditSucc') {
          wx.showShareMenu({
            menus: ['shareAppMessage']
          })
        }
      })
    },

    goSignUp() {
      if (!this.data.canSignUp) {
        return
      }
      wx.navigateTo({
        url: '../sign-up/index',
        success: (res) => {
          res.eventChannel.emit('initData', {
            User: this.data.User,
            Activity: this.data.Activity
          })
        }
      })
    },

    checkActivityEnd() {
      const EndTime = this.data.Activity.EndTime
      this.setData({
        isActivityEnd: dayjs().unix() > dayjs(EndTime).unix()
      })
    },

    getSignUpText() {
      const Activity = this.data.Activity
      const SelfActivitySignUp = this.data.SelfActivitySignUp
      const now = dayjs().unix()
      const startTime = dayjs(Activity.BeginTime).unix()
      const endTime = dayjs(Activity.EndTime).unix()

      const signUp = () => {
        const Price = Activity.ActivityRule.Price
        const formatPrice = (Price / 100).toFixed(2)
        this.setData({
          hasSignedUp: false,
          canSignUp: true,
          signUpText: `¥${formatPrice} 走起`
        })
      }
      this.setData({ tipWraning: false })

      if (!SelfActivitySignUp) {
        // 活动时间和人数上是否可报名
        if (now > endTime) {
          this.setData({
            hasSignedUp: false,
            canSignUp: false,
            signUpText: '活动已结束'
          })
        } else if (startTime - now < ActivitySignUpBlockTime) {
          this.setData({
            hasSignedUp: false,
            canSignUp: false,
            signUpText: '报名截止'
          })
        } else if (Activity.SignUpNum === Activity.ActivityRule.MaxSignUpNumber) {
          this.setData({
            hasSignedUp: false,
            canSignUp: false,
            signUpText: '已满员'
          })
        } else {
          signUp()
        }
        return
      }

      // 已经报名过
      const ActivitySignUpStatus = SelfActivitySignUp.ActivitySignUpStatus
      switch (ActivitySignUpStatus) {
        case 'ToPay': {
          this.setData({
            hasSignedUp: false,
            canSignUp: false,
            signUpText: `支付确认中`
          })
          break
        }
        case 'PayTimeout': {
          signUp()
          break
        }
        case 'InsuranceCreating':
        case 'InsuranceCreated': {
          this.setData({
            hasSignedUp: true,
          })
          break
        }
        case 'InsuranceCreateFail': {
          this.setData({
            hasSignedUp: false,
            canSignUp: false,
            signUpText: '保险未生效，请联系客服'
          })
          break
        }
        case 'Refund': {
          signUp()
          break
        }
        case 'Refunding': {
          this.setData({
            hasSignedUp: false,
            canSignUp: false,
            signUpText: '退款中'
          })
          break
        }
        case 'RefundError': {
          this.setData({
            hasSignedUp: false,
            canSignUp: false,
            signUpText: '无法退款，请联系客服',
            tipWraning: true
          })
          break
        }
      }
    },

    formatDate() {
      const { BeginTime, EndTime } = this.data.Activity
      const t1 = dayjs(BeginTime)
      const t2 = dayjs(EndTime)

      if (t1.day() === t2.day()) {
        const s = t1.format('HH:mm')
        const e = t2.format('HH:mm')
        const w = WeekNames[t1.day()]
        const d = t1.format('MM月DD日')
        this.setData({
          date: `${s}-${e} ${w} ${d}`
        })
      } else {
        const s = t1.format('HH:mm')
        const e = t2.format('HH:mm')
        const sw = WeekNames[t1.day()]
        const ew = WeekNames[t2.day()]
        const d = t1.format('MM月DD日')
        this.setData({
          date: `${s}${sw} - ${e}${ew} ${d}`
        })
      }

    },

    calcDistance() {
      getLocation()
        .then(from => {
          const to = this.data.Activity.Location.Point
          calcDistance(from, to)
            .then(resp => {
              this.setData({
                distance: resp.distance
              })
            })
        })
    },

    sharePoster() {
      wx.navigateTo({
        url: '../activity-poster/index',
        success: (res) => {
          res.eventChannel.emit('initData', {
            Club: this.data.Club,
            Activity: this.data.Activity,
          })
        }
      })
    },

    viewClub() {
      const ClubId = this.data.Activity.ClubId
      wx.navigateTo({
        url: `../club-profile/index?ClubId=${ClubId}`
      })
    },

    openLocation() {
      const Location = this.data.Activity.Location
      wx.openLocation({
        latitude: Location.Point.lat,
        longitude: Location.Point.lon,
        name: Location.Name,
        address: Location.Address
      })
    },

    audit(e: any) {
      const status = e.currentTarget.dataset.status
      request.updateActivity({
        ActivityId: this.data.ActivityId,
        AuditStatus: status
      }).then(() => {
        this.setData({
          auditResult: status
        })
      })
    },

    onBack() {
      wx.navigateBack();
    },

    onGoHome() {
      wx.reLaunch({
        url: '/pages/home/index',
      });
    },

    onShareAppMessage(_: WechatMiniprogram.Page.IShareAppMessageOption): WechatMiniprogram.Page.ICustomShareContent {
      const { Activity } = this.data
      const ActivityId = Activity.ActivityId
      const Club: IClubInfo = app.globalData.Club
      const RegisterClubId = Club.ClubId ?? ''

      return {
        title: Activity.Title,
        path: `pages/activity-detail/index?ActivityId=${ActivityId}&RegisterClubId=${RegisterClubId}`
      }
    },

    handleManageSelected(e: any) {
      const { index } = e.detail
      if (index === 0) {
        this.modityActivity()
      } else if (index === 1) {
        this.cacelActivity()
      }
    },

    manage() {
      ActionSheet.show({
        theme: ActionSheetTheme.List,
        selector: '#t-manage-action-sheet',
        context: this,
        items: [
          {
            label: '修改活动',
          },
          {
            label: '取消活动',
          },
        ],
      })
    },

    modityActivity() {
      const Activity = this.data.Activity
      if (Activity.SignUpNum > 0) {
        wx.showToast({
          icon: 'none',
          // title: '已有用户报名，无法修改活动信息',
          title: '暂不支持修改活动',
        })
      } else {
        wx.navigateTo({
          url: '../activity-create/index',
          success: (res) => {
            res.eventChannel.emit('initData', {
              Activity: JSON.parse(JSON.stringify(this.data.Activity)),
            })
          }
        })
      }
    },

    handleCancelConfirmSelected(e: any) {
      const Activity = this.data.Activity
      const { index } = e.detail
      // 主理人取消活动
      if (index === 0) {
        request.cancelActivity({
          ActivityId: Activity.ActivityId,
          AuditStatus: 'SelfCancel'
        })
      }
    },

    cacelActivity() {
      ActionSheet.show({
        theme: ActionSheetTheme.List,
        selector: '#t-cancel-confirm-action-sheet',
        context: this,
        description: '活动取消后，所有已上车的用户将会自动退出，活动费用也会自动退还。',
        items: [
          {
            label: '取消活动',
            color: '#FA5151'
          },
          {
            label: '稍后再说',
          },
        ],
      })
    },
  }
})