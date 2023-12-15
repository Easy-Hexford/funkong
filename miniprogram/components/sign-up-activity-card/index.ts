import { calcDistance, getLocation } from '../../utils/location'
import { IActivityInfo, ISignUpActicityInfo } from '../../services'
import dayjs from 'dayjs'

const app = getApp()

Component({
  properties: {
    signUpActivity: {
      type: Object,
      value: {}
    },
  },

  data: {
    distance: 0,
    beginTime: '',
    Activity: <IActivityInfo>{}
  },

  lifetimes: {
    attached() {
      const SignUpActivity = this.data.signUpActivity as ISignUpActicityInfo
      this.setData({
        Activity: SignUpActivity.Activity
      })
      this.formatDate()
      this.calcDistance()
    }
  },

  methods: {
    formatDate() {
      const BeginTime = this.data.Activity.BeginTime
      console.info('@@@ BeginTime', BeginTime, 'Activity', this.data.Activity)
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
  }
})