// pages/activity-detail/index.ts
import { MockActivityList } from '../../utils/mock'

Component({

  properties: {

  },

  data: {
    Activity: MockActivityList.ActivityList[0],
  },

  methods: {
    share() {

    },

    sharePoster() {
      wx.navigateTo({
        url: '../activity-poster/index'
      })
    },

    openLocation() {
      const Activity = this.data.Activity
      wx.openLocation({
        latitude: Activity.Location.lat,
        longitude: Activity.Location.lon,
        name: Activity.LocationName,
        complete() {

        }
      })
    }
  }
})