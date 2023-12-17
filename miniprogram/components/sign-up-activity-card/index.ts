import { calcDistance, getLocation } from '../../utils/location'
import { IActivityInfo, IActivitySignUpStatus, ISignUpActicityInfo, ISignUpInfo } from '../../services'
import * as request from '../../services/index'

import dayjs from 'dayjs'

const app = getApp()

Component({
  properties: {
    signUpActivity: {
      type: Object,
      value: {}
    },

    idx: {
      type: Number,
    }
  },

  data: {
    visible: false,
    distance: 0,
    beginTime: '',
    signUpText: '',
    ActivitySignUpStatus: <IActivitySignUpStatus>'',
    SignUpInfo: <ISignUpInfo>{},
    Activity: <IActivityInfo>{},
    avatarList: <Array<string>>[],
  },

  lifetimes: {
    attached() {
      const SignUpActivity = this.data.signUpActivity as ISignUpActicityInfo
      this.setData({
        Activity: SignUpActivity.Activity,
        ActivitySignUpStatus: SignUpActivity.ActivitySignUpStatus,
        SignUpInfo: SignUpActivity.SignUpInfo,
      })
      this.formatDate()
      this.calcDistance()
      this.getSignUpText()
    }
  },

  methods: {
    getSignUpText() {
      const Activity = this.data.Activity
      const ActivitySignUpStatus = this.data.ActivitySignUpStatus
      if (ActivitySignUpStatus === 'Refund') {
        this.setData({ 
          signUpText:'已退出活动'
        })
        return
      }

      const failStatus: Array<IActivitySignUpStatus> = [
        'ToPay',
        'PayTimeout',
        'Paid',
        'InsuranceCreateFail',
        'InsuranceCreating',
      ]

      if (failStatus.indexOf(ActivitySignUpStatus) >= 0) {
        this.setData({ 
          signUpText: '加入中'
        })
        return
      }

      const now = dayjs().unix()
      const startTime = dayjs(Activity.BeginTime).unix()
      const endTime = dayjs(Activity.EndTime).unix()
      
      if (now >= endTime) {
        this.setData({ 
          signUpText: '活动已结束'
        })
        return
      }

      if (now < startTime) {
        if (Activity.SignUpNum === 1) {
          this.setData({ 
            signUpText: '等待成团加入'
          })
          return
        }

        this.setData({ 
          avatarList: Activity.ActivitySignUpList.map(i => i.User.Icon),
          signUpText: `等${Activity.SignUpNum}个队员`
        })
        return
      }

      this.setData({ 
        signUpText: ''
      })
    },

    onUsertap() {
      this.triggerEvent('userTap', {
        area: 'body',
        idx: this.data.idx
      })
    },

    showInsuranceForm() {
      this.setData({
        visible: true,
      })
    },

    onVisibleChange(e: any) {
      this.setData({
        visible: e.detail.visible,
      });
    },

    async onInsuranceFormSumit(e: any) {
      if (this.data.ActivitySignUpStatus !== 'InsuranceCreateFail') {
        return
      }

      const insuranceData = e.detail.User
      try {
        await request.updateUser({
          ...insuranceData
        })

        await request.createInsurance({
          ActivityId: this.data.Activity.ActivityId
        })

        wx.showToast({
          icon: 'none',
          title: '已重新发起投保'
        })

      } catch (error) {
        wx.showToast({
          icon: 'none',
          title: '发起投保失败'
        })
      }
    },

    contactCustomerService() {
      wx.navigateTo({
        url: '../../pages/customer-service/index'
      })
    },

    showAction() {
      wx.showActionSheet({
        itemList: ['退出活动'],
        success(res) {
          if (res.tapIndex === 0) {
            wx.showToast({
              icon: 'none',
              title: '暂不支持线上退款，请联系客服退款'
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    },

    formatDate() {
      const BeginTime = this.data.Activity.BeginTime
      this.setData({
        beginTime: dayjs(BeginTime).format('MM月DD日 HH:mm'),
      })
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

    createInsurance() {
      request.createInsurance({
        ActivityId: this.data.Activity.ActivityId
      }).finally(() => {
        wx.showToast({
          icon: 'none',
          title: '已重新触发提交'
        })
      })
    }
  }
})