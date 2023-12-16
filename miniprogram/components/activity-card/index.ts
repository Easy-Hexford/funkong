import { formatActivityTime } from '../../utils/util'
import { calcDistance, getLocation } from '../../utils/location'
import { IActivityInfo } from '../../services'
import { ActivitySignUpBlockTime } from '../../utils/constant'
import dayjs from 'dayjs'

const app = getApp()

Component({
  properties: {
    activity: {
      type: Object,
      value: {}
    },

    mode: {
      type: String,
      value: 'normal' // 'audit
    }
  },

  data: {
    distance: 0,
    beginTime: '',
    auditStatus: '',
    canSignUp: false,
    signUpText: '',
  },

  lifetimes: {
    attached() {
      this.formatDate()
      this.calcDistance()
      this.getSignUpText()
    }
  },

  methods: {
    getSignUpText() {
      const Activity = this.data.activity as IActivityInfo
      const diff = dayjs(Activity.BeginTime).unix() - dayjs().unix()
      if (diff < ActivitySignUpBlockTime) {
        this.setData({
          canSignUp: false,
          signUpText: '报名截止'
        })
      } else if (Activity.SignUpNum === Activity.ActivityRule.MaxSignUpNumber) {
        this.setData({
          canSignUp: false,
          signUpText: '已满员'
        })
      } else if (Activity.SignUpNum === 0) {
        this.setData({
          canSignUp: true,
          signUpText: '新活动'
        })
      } else {
        this.setData({
          canSignUp: true,
          signUpText: `已有${Activity.SignUpNum}人`
        })
      }
    },

    formatDate() {
      const BeginTime = this.data.activity.BeginTime
      this.setData({
        beginTime: formatActivityTime(BeginTime)
      })
    },

    calcDistance() {
      const Activity = this.data.activity
      getLocation()
        .then(from => {
          const to = Activity.Location.Point
          calcDistance(from, to)
            .then(resp => {
              this.setData({
                distance: resp.distance
              })
            })
        })
    },
  }
})