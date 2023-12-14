import dayjs from 'dayjs'
import * as request from '../../services/index'
import { IActivityInfo, IInsuranceProduct, IUserInfo } from '../../services/index'
import { MockActivity, MockUser } from '../../utils/mock'
import { formatActivityTime } from '../../utils/util'

Component({

  properties: {

  },

  data: {
    beginTime: '',
    activityTime: '',
    User: <IUserInfo>{},
    Activity: <IActivityInfo>{},
    InsuranceProduct: <IInsuranceProduct>{},
    visible: false,
    PhoneCode: ''
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
          this.setData({
            User,
            Activity,
            InsuranceProduct: Activity.ActivityRule.InsuranceProduct
          })
          this.formatDate()
        })
      } else {
        this.setData({
          User: MockUser,
          Activity: MockActivity,
          InsuranceProduct: MockActivity.ActivityRule.InsuranceProduct
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

    register() {
      this.setData({
        visible: true
      })
    },

    getPhoneNumber(e: any) {
      const code = e.detail.code
      request.updateUser({
        PhoneCode: code
      }).then(() => {
        this.setData({
          PhoneCode: code
        })
        this.refreshUserInfo()
      })
    },

    refreshUserInfo() {
      request.getUser()
        .then(resp => {
          console.info('@@@ User: ', resp.User)
          this.setData({
            User: resp.User
          })
        })
    },

    onVisibleChange(e: any) {
      this.setData({
        visible: e.detail.visible,
      });
    },

    pay() {
      this.setData({
        visible: true
      })
    }
  }
})