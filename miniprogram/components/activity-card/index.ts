import { formatActivityTime } from '../../utils/util'
import { calcDistance, getLocation } from '../../utils/location'
import { IActivityInfo } from '../../services'

const app = getApp()

Component({
  properties: {
    activity: {
      type: Object,
      value: {}
    }
  },

  data: {
    distance: 0,
    beginTime: '',
  },

  lifetimes: {
    attached() {
      this.formatDate()
      this.calcDistance()
    }
  },

  methods: {
    formatDate() {
      this.setData({
        beginTime: formatActivityTime(this.data.activity.BeginTime)
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