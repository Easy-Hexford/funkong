import dayjs from 'dayjs'
import * as request from '../../services/index'
import { IActivityInfo, IGetUserResp, IInsuranceProduct, IUserInfo } from '../../services/index'
import { MockActivity, MockUser } from '../../utils/mock'
import { formatActivityTime } from '../../utils/util'

type IPopupContentType = 'Empty' | 'RegisterSuccess' | 'InsuranceForm' | 'SignUpSuccess' | 'PhoneAuthorize'

const app = getApp()

Component({
  properties: {},

  data: {
    User: <IUserInfo>{},
    Activity: <IActivityInfo>{},
    InsuranceProduct: <IInsuranceProduct>{},
    PhoneCode: '',

    loading: true,
    freeInsurance: false,
    beginTime: '',
    activityTime: '',
    visible: false,
    popupContent: <IPopupContentType>'',
    signUpSuccessTip: '',
    payFail: false,

    _lock: false,
  },

  lifetimes: {
    attached() {
      this.initData().then(resp => {
        const User = resp.User
        const Activity = resp.Activity
        const InsuranceProduct = Activity.ActivityRule.InsuranceProduct
        this.setData({
          loading: false,
          User,
          Activity,
          InsuranceProduct,
          freeInsurance: InsuranceProduct.InsuranceType === 'Free'
        })
        this.formatDate()
      })
    }
  },

  methods: {
    initData(): Promise<{ User: IUserInfo, Activity: IActivityInfo }> {
      return new Promise(resolve => {
        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel?.on) {
          eventChannel.on('initData', (data) => {
            resolve(data)
          })
        } else {
          resolve({
            User: MockUser,
            Activity: MockActivity,
          })
        }
      })
    },

    formatDate() {
      const LocationName = this.data.Activity.Location.Name
      const BeginTime = this.data.Activity.BeginTime
      const diffDay = dayjs(BeginTime).diff(dayjs(), 'day')
      this.setData({
        beginTime: formatActivityTime(BeginTime),
        activityTime: dayjs(BeginTime).format('MM月DD日'),
        signUpSuccessTip: diffDay > 0 ? `${diffDay}天后${LocationName}见` : ''
      })
    },

    getPhoneNumber(e: any) {
      const code = e.detail.code
      if (!code) {
        this.getPhoneNumberFail()
        return
      }
      request.updateUser({
        PhoneCode: code
      }).then(() => {
        this.showRegisterSuccess()
        this.refreshUserInfo()
        this.setData({
          PhoneCode: code
        })
      }, (e) => {
        wx.showToast({
          icon: 'error',
          title: e.message
        })
      })
    },

    getPhoneNumberFail() {
      const { visible, popupContent } = this.data
      if (visible && popupContent === 'PhoneAuthorize') {
        this.hidePopup()
      } else {
        this.showPhoneAuthorize()
      }
    },

    onRegisterSuccessUserTap(e: any) {
      const btn = e.detail.btn
      if (btn === 'fill') {
        wx.navigateTo({
          url: '../user-info/index'
        })
      }
      this.hidePopup()
    },

    onInsuranceFormSumit(e: any) {
      if (this.data._lock) return
      this.data._lock = true

      wx.showToast({
        icon: 'loading',
        title: '正在确认',
        duration: 10000
      })
      const insuranceData = e.detail.User
      request.updateUser({
        ...insuranceData
      }).then(() => {
        this.data._lock = false
        this.hidePopup()
        this.signUp()

        // 本地先同步
        const User = this.data.User
        Object.assign(User, insuranceData)
        this.setData({ User })
        this.refreshUserInfo()
      }, (e) => {
        wx.showToast({
          icon: 'error',
          title: e.message
        })
      }).finally(() => {
        this.data._lock = false
      })
    },

    refreshUserInfo(): Promise<void> {
      return app.getLatestUser()
        .then((resp: IGetUserResp) => {
          this.setData({
            User: resp.User
          })
        })
    },

    signUpFreeInsuranceActivity() {
      if (this.data._lock) return
      this.data._lock = true

      const Activity = this.data.Activity
      return request.createSignUpActivity({
        ActivityId: Activity.ActivityId
      }).then(() => {
        this.showSignUpSuccess()
      }, (e) => {
        wx.showToast({
          icon: 'error',
          title: e.message
        })
      }).finally(() => {
        this.data._lock = false
      })
    },

    signUpNormalActivity() {
      if (this.data._lock) return
      this.data._lock = true

      const Activity = this.data.Activity
      return request.createSignUpActivity({
        ActivityId: Activity.ActivityId
      }).then(resp => {
        const Payment = resp.Payment
        wx.requestPayment({
          timeStamp: Payment.timeStamp,
          nonceStr: Payment.nonceStr,
          package: Payment.package,
          signType: Payment.signType,
          paySign: Payment.paySign,
          success: () => {
            this.showSignUpSuccess()
          },
          fail: () => {
            wx.showToast({
              icon: 'error',
              title: '支付失败'
            })
            this.setData({
              payFail: true
            })
          },
        })
      }, (e) => {
        wx.showToast({
          icon: 'error',
          title: e.message
        })
      }).finally(() => {
        this.data._lock = false
      })
    },

    async signUp() {
      if (this.data.payFail) {
        await request.deleteSignUpActivity({
          ActivityId: this.data.Activity.ActivityId
        })
      }

      if (this.data.freeInsurance) {
        this.signUpFreeInsuranceActivity()
      } else if (this.checkInssurance()) {
        this.signUpNormalActivity()
      }
    },

    checkInssurance() {
      const IdCardNo = this.data.User.IdCardNo
      if (!IdCardNo) {
        this.showInsuranceForm()
        return false
      }
      return true
    },

    showRegisterSuccess() {
      this.setData({
        visible: true,
        popupContent: 'RegisterSuccess'
      })
    },

    showPhoneAuthorize() {
      this.setData({
        visible: true,
        popupContent: 'PhoneAuthorize'
      })
    },

    showInsuranceForm() {
      this.setData({
        visible: true,
        popupContent: 'InsuranceForm'
      })
    },

    showSignUpSuccess() {
      this.setData({
        visible: true,
        popupContent: 'SignUpSuccess'
      })
    },

    hidePopup() {
      this.setData({
        visible: false,
        popupContent: 'Empty'
      })
    },

    onVisibleChange(e: any) {
      this.setData({
        visible: e.detail.visible,
      });
    },

    authorize() {
      wx.openSetting({
        complete(res) {
          console.info(res)
        }
      })
    },

    goBack() {
      wx.navigateBack()
    }
  }
})