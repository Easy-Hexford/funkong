import dayjs from 'dayjs'
import * as request from '../../services/index'
import { IActivityInfo, IInsuranceProduct, IUserInfo } from '../../services/index'
import { MockActivity, MockUser } from '../../utils/mock'
import { formatActivityTime } from '../../utils/util'

type IPopupContentType = 'Empty' | 'RegisterSuccess' | 'InsuranceForm' | 'SignUpSuccess' | 'PhoneAuthorize'

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
      const BeginTime = this.data.Activity.BeginTime
      this.setData({
        beginTime: formatActivityTime(BeginTime),
        activityTime: dayjs(BeginTime).format('MM月DD日')
      })
    },

    getPhoneNumber(e: any) {
      const code = e.detail.code
      if (!code) {
        this.getPhoneNumberFail()
        return
      }

      this.setData({
        visible: true,
        popupContent: 'RegisterSuccess'
      })

      request.updateUser({
        PhoneCode: code
      }).then(() => {
        this.setData({
          PhoneCode: code
        })
        this.refreshUserInfo()
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
      const insuranceData = e.detail.User
      const User = this.data.User
      Object.assign(User, insuranceData)
      this.setData({ User })
      request.updateUser({
        ...insuranceData
      }).then(() => {
        this.signUp()
      })
    },

    refreshUserInfo() {
      request.getUser({
        UseCache: false
      })
        .then(resp => {
          this.setData({
            User: resp.User
          })
        })
    },

    signUp() {
      const Activity = this.data.Activity
      if (this.data.freeInsurance) {
        request.createSignUpActivity({
          ActivityId: Activity.ActivityId
        }).then(() => {
          this.showSignUpSuccess()
        }, () => {
          wx.showToast({
            icon: 'error',
            title: '报名失败'
          })
          this.hidePopup()
        })
        return
      }

      if (this.checkInssurance()) {
        request.createSignUpActivity({
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
            fail: (res) => {
              console.warn('createSignUpActivity fail: ', res)
              wx.showToast({
                icon: 'error',
                title: '报名失败'
              })
              this.hidePopup()
            }
          })
        })
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