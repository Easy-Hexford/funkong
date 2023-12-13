import { formatActivityTime, formatDistance } from '../../utils/util'
import { calcDistance } from '../../utils/location'
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
      const Loc = app.globalData.Loc as IPoint
      if (!Loc.lat) return

      const Activity = this.data.activity as IActivityInfo
      const from = Loc
      const to = Activity.Location.Point
      calcDistance(from, to)
        .then(resp => {
          this.setData({
            distance: formatDistance(resp.distance)
          })
        })
    },
  }
})