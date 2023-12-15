import { formatActivityTime } from '../../utils/util'
import { calcDistance, getLocation } from '../../utils/location'
import { IActivityInfo } from '../../services'
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

    auditStatus: ''
  },

  lifetimes: {
    attached() {
      this.formatDate()
      this.calcDistance()
    }
  },

  methods: {
    formatDate() {
      const BeginTime = this.data.activity.BeginTime
      this.setData({
        beginTime: formatActivityTime(BeginTime)
      })
    },

    

    calcDistance() {
      const Activity = this.data.activity as IActivityInfo
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