import { formatActivityTime, formatDistance } from '../../utils/util'
import { calcDistance, getLocation } from '../../utils/location'
import { IActivityInfo, IPoint } from '../../services'

const app = getApp()

Component({
  properties: {
    activity: {
      type: Object,
      value: {}
    }
  },

  data: {
    distance: '',
    formatBeginTime: '',
  },

  lifetimes: {
    attached() {
      const BeginTime = this.data.activity.BeginTime
      this.setData({
        formatBeginTime: formatActivityTime(BeginTime)
      })

      this.calcDistance()
    }
  },

  methods: {
    calcDistance() {
      const Activity = this.data.activity as IActivityInfo
      getLocation()
        .then(from => {
          const to = Activity.Location.Point
          calcDistance(from, to)
            .then(resp => {
              this.setData({
                distance: formatDistance(resp.distance)
              })
            })
        })
    },
  }
})