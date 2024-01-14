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

const EnumSignUpStatus = {
  Empty: 0,                    // 空
  ToPay: 1,                    // 支付确认中
  PayTimeout: 2,               // 支付超时
  Paid: 3,                     // 已付款
  InsuranceCreating: 4,        // 创建保险中
  InsuranceCreated: 5,         // 保险购买成功
  InsuranceCreateFail: 6,      // 保险购买失败
  InsuranceRetryNum1: 7,       // 需重新填写保单
  InsuranceRetryNum2: 8,       // 需联系客服
  Refunding: 9,                // 退款中
  Refund: 10,                  // 退款成功
  RefundError: 11,             // 退款失败
  End: 12,                     // 活动已结束
  Deadline: 13,                // 活动报名截止
  Full: 14,                    // 活动已满员
}

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

    isActivityEnd: false,
    EnumSignUpStatus,
    signUpStatus: EnumSignUpStatus.Empty,

    loading: true,
    firstPage: false,
    visible: false,
    _reenter: false,
    _lock: false,
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

        const signUpStatus = this.getSignUpStatus()
        this.setData({
          signUpStatus,
        })

        if (Activity.AuditStatus === 'AuditSucc') {
          wx.showShareMenu({
            menus: ['shareAppMessage']
          })
        }
      })
    },

    goSignUp() {
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

    getSignUpStatus() {
      const Activity = this.data.Activity
      const SelfActivitySignUp = this.data.SelfActivitySignUp
      const now = dayjs().unix()
      const startTime = dayjs(Activity.BeginTime).unix()
      const endTime = dayjs(Activity.EndTime).unix()
      const _getStatus = () => {
        if (now > endTime) {
          return EnumSignUpStatus.End
        } else if (startTime - now < ActivitySignUpBlockTime) {
          return EnumSignUpStatus.Deadline
        } else if (Activity.SignUpNum === Activity.ActivityRule.MaxSignUpNumber) {
          return EnumSignUpStatus.Full
        } else {
          return EnumSignUpStatus.Empty
        }
      }
      // 未报名过
      if (!SelfActivitySignUp) {
        return _getStatus()
      }

      // 已经报名过
      const ActivitySignUpStatus = SelfActivitySignUp.ActivitySignUpStatus
      const InsuranceRetryNum = SelfActivitySignUp.SignUpInfo.InsuranceRetryNum

      switch (ActivitySignUpStatus) {
        case 'ToPay': {
          return EnumSignUpStatus.ToPay
        }
        case 'PayTimeout': {
          return _getStatus()
        }
        case 'Paid': {
          return EnumSignUpStatus.Paid
        }
        case 'InsuranceCreating': {
          return EnumSignUpStatus.InsuranceCreating
        }
        case 'InsuranceCreated': {
          return EnumSignUpStatus.InsuranceCreated
        }
        case 'InsuranceCreateFail': {
          if (InsuranceRetryNum === 1) {
            return EnumSignUpStatus.InsuranceRetryNum1
          } else if (InsuranceRetryNum === 2) {
            return EnumSignUpStatus.InsuranceRetryNum2
          } else {
            return EnumSignUpStatus.InsuranceCreateFail
          }
        }
        case 'Refund': {
          return EnumSignUpStatus.Refund
        }
        case 'Refunding': {
          return EnumSignUpStatus.Refunding
        }
        case 'RefundError': {
          return EnumSignUpStatus.RefundError
        }
        default: {
          return EnumSignUpStatus.Empty
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

    showInsuranceForm() {
      this.setData({
        visible: true,
      })
    },

    hidePopup() {
      this.setData({
        visible: false,
      })
    },

    onVisibleChange(e: any) {
      this.setData({
        visible: e.detail.visible,
      });
    },

    async onInsuranceFormSumit(e: any) {
      if (this.data._lock) return
      this.data._lock = true

      const insuranceData = e.detail.User
      try {
        wx.showToast({
          icon: 'loading',
          title: '正在确认',
          duration: 10000
        })

        await request.updateUser({
          ...insuranceData
        })

        await request.createInsurance({
          ActivityId: this.data.Activity.ActivityId
        })

        this.hidePopup()
        this.refreshActivity()
        this.data._lock = false
        wx.showToast({
          icon: 'none',
          title: '已重新发起投保'
        })
      } catch (e: any) {
        wx.hideToast()
        this.hidePopup()
        this.data._lock = false
        wx.showModal({
          content: e.message,
          showCancel: false
        })
      }
    },

    contactCustomerService() {
      wx.navigateTo({
        url: '../customer-service/index'
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

    showOwnerCancelSheet() {
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
          title: '已有用户报名，无法修改活动信息',
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
      const { index } = e.detail
      // 主理人取消活动
      if (index === 0) {
        wx.showToast({
          icon: 'none',
          title: '该功能即将上线'
        })
        // const Activity = this.data.Activity
        // request.cancelActivity({
        //   ActivityId: Activity.ActivityId,
        //   AuditStatus: 'SelfCancel'
        // })
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

    showUserCancelSheet() {
      const signUpStatus = this.data.signUpStatus
      if (signUpStatus === EnumSignUpStatus.InsuranceRetryNum1) {
        ActionSheet.show({
          theme: ActionSheetTheme.List,
          selector: '#t-user-cancel-action-sheet',
          description: '',
          context: this,
          items: [
            {
              label: '退出活动',
              color: '#FA5151'
            },
            {
              label: '联系客服加入活动群',
            }
          ],
        })
        return
      }

      const Activity = this.data.Activity
      const now = dayjs()
      const startTime = dayjs(Activity.BeginTime)
      const Price = Activity.ActivityRule.Price / 100
      const diffHour = startTime.diff(now, 'h')
      let desc
      if (diffHour >= 24) {
        desc = `活动尚未开始准备，退出活动后将退款 ¥${Price.toFixed(2)}`
      } else if (diffHour >= 4) {
        desc = `活动已开始准备，退出活动仅退还 ¥${(Price / 2).toFixed(2)}`
      } else if (diffHour < 4) {
        desc = '距离活动开始不足4小时，退出活动将不会退款'
      }

      ActionSheet.show({
        theme: ActionSheetTheme.List,
        selector: '#t-user-cancel-action-sheet',
        context: this,
        description: desc,
        items: [
          {
            label: '退出活动',
            color: '#FA5151'
          }
        ],
      })
    },

    handleUserCancelSelected(e: any) {
      const Activity = this.data.Activity
      const { index } = e.detail
      if (index === 0) {
        request.deleteSignUpActivity({
          ActivityId: Activity.ActivityId
        }).then(() => {
          wx.showToast({
            icon: 'none',
            title: '已提交退出申请'
          })
          this.refreshActivity()
        }, () => {
          wx.showToast({
            icon: 'none',
            title: '退出活动失败，请稍后重试'
          })
        })
      }else if (index === 1) {
        this.contactCustomerService()
      }
    },
  }
})