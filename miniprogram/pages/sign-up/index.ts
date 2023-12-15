import dayjs from 'dayjs'
import * as request from '../../services/index'
import { IActivityInfo, IInsuranceProduct, IUserInfo } from '../../services/index'
import { MockActivity, MockUser } from '../../utils/mock'
import { formatActivityTime } from '../../utils/util'

type IPopupContentType = 'Empty' | 'RegisterSuccess' | 'InsuranceForm' | 'ApplySuccess' | 'PhoneAuthorize'

Component({
  properties: {},

  data: {
    User: <IUserInfo>{},
    Activity: <IActivityInfo>{},
    InsuranceProduct: <IInsuranceProduct>{},
    PhoneCode: '',

    beginTime: '',
    activityTime: '',
    visible: false,
    popupContent: <IPopupContentType>'',
  },

  lifetimes: {
    attached() {
      this.initData()
    }
  },

  methods: {
    initData() {
      const eventChannel = this.getOpenerEventChannel()
      if (eventChannel?.on) {
        eventChannel.on('initData', (data) => {
          const User = data.User as IUserInfo
          const Activity = data.Activity as IActivityInfo
          const InsuranceProduct = Activity.ActivityRule.InsuranceProduct
          this.setData({
            User,
            Activity,
            InsuranceProduct
          })
          this.formatDate()
        })
      } else {
        const InsuranceProduct = MockActivity.ActivityRule.InsuranceProduct
        this.setData({
          User: MockUser,
          Activity: MockActivity,
          InsuranceProduct,
        })
        this.formatDate()
      }
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
      if (this.checkInssurance()) {
        request.createSignUpActivity({
          ActivityId: this.data.Activity.ActivityId
        }).then(resp => {
          const Payment = resp.Payment
          wx.requestPayment({
            timeStamp: Payment.timeStamp,
            nonceStr: Payment.nonceStr,
            package: Payment.package,
            signType: Payment.signType,
            paySign: Payment.paySign,
            success: () => {
              this.showApplySuccess()
            },
            fail: (res) => {
              console.warn('createSignUpActivity fail: ', res)
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

    showApplySuccess() {
      this.setData({
        visible: true,
        popupContent: 'ApplySuccess'
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
    }
  }
})