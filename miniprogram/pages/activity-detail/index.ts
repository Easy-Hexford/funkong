// pages/activity-detail/index.ts
import * as request from '../../services/index'
import type { IActivityAuditStatus, IActivityInfo, IGetUserResp, ISelfActivitySignup, ISimpleUserInfo, IUserInfo } from '../../services'
import { calcDistance, getLocation } from '../../utils/location'
import { WeekNames } from '../../utils/util'
import { getPosterQuery } from '../../utils/bind'
import dayjs from 'dayjs'
import { ActivitySignUpBlockTime } from '../../utils/constant'

const app = getApp()

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {
    ActivityId: {
      type: String,
      value: ''
    },

    scene: {
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

    hasSignedUp: false,
    canSignUp: false,
    signUpText: '',

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
        this.data.ActivityId = posterQuery.ActivityId
      }

      this.getUser()
      await this.refreshActivity()
      const pageStack = getCurrentPages()
      const firstPage = pageStack.length === 1
      this.setData({ loading: false, firstPage })
    }
  },

  methods: {
    async getUser() {
      app.getUser().then((resp: IGetUserResp) => {
        this.setData({
          User: resp.User
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
          canSignUp: true,
          signUpText: `¥${formatPrice} 走起`
        })
      }

      if (!SelfActivitySignUp) {
        // 活动时间和人数上是否可报名
        if (now > endTime) {
          this.setData({
            canSignUp: false,
            signUpText: '活动已结束'
          })
        } else if (startTime - now < ActivitySignUpBlockTime) {
          this.setData({
            canSignUp: false,
            signUpText: '报名截止'
          })
        } else if (Activity.SignUpNum === Activity.ActivityRule.MaxSignUpNumber) {
          this.setData({
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
      console.info('@@@ ActivitySignUpStatus')
      switch (ActivitySignUpStatus) {
        case 'ToPay': {
          this.setData({
            canSignUp: false,
            signUpText: `订单未完成`
          })
          break
        }
        case 'Refund':
        case 'PayTimeout': {
          signUp()
          break
        }
        case 'InsuranceCreated': {
          this.setData({
            hasSignedUp: true,
          })
          break
        }
        case 'InsuranceCreating':
        case 'InsuranceCreateFail': {
          this.setData({
            canSignUp: false,
            signUpText: '购买保险中'
          })
          break
        }
        case 'Refunding':
        case 'RefundError': {
          this.setData({
            canSignUp: false,
            signUpText: '退款中'
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
            User: this.data.User,
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
      const Activity = this.data.Activity
      return {
        title: Activity.Title,
        path: `pages/activity-detail/index?ActivityId=${Activity.ActivityId}`
      }
    },

    developingTip() {
      wx.showToast({
        icon: 'none',
        title: '新功能即将上线'
      })
    }
  }
})