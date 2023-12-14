// pages/activity-detail/index.ts
import * as request from '../../services/index'
import type { IActivityInfo, ISimpleUserInfo, IUserInfo } from '../../services'
import { calcDistance, getLocation } from '../../utils/location'
import { formatActivityTime } from '../../utils/util'

Component({
  properties: {
    ActivityId: {
      type: String,
      value: ''
    },

    scene: {
      type: String,
    }
  },

  data: {
    distance: 0,
    beginTime: '',
    Activity: <IActivityInfo>{},
    ActivityMembers: <Array<ISimpleUserInfo>>[],
    OwnerUserId: '',
    User: <IUserInfo>{},
  },

  pageLifetimes: {
    show() {}
  },

  lifetimes: {
    attached() {
      console.info('@@@ scene: ', decodeURIComponent(this.data.scene))

      request.getUser()
        .then(resp => {
          this.setData({
            User: resp.User
          })
        })

      request.getActivity({
        ActivityId: this.data.ActivityId
      }).then(resp => {
        const Activity = resp.Activity
        const OwnerUser = Activity.OwnerUser
        const OtherMembers = resp.Activity.ActivitySignUpList.map(i => i.User)

        this.setData({
          Activity,
          OwnerUserId: Activity.UserId,
          ActivityMembers: [OwnerUser, ...OtherMembers],
        })
        this.formatDate()
        this.calcDistance()
      })

      wx.showShareMenu({
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  },

  methods: {
    onShareAppMessage(_: WechatMiniprogram.Page.IShareAppMessageOption): WechatMiniprogram.Page.ICustomShareContent {
      const Activity = this.data.Activity
      return {
        title: Activity.Title,
        path: `pages/activity-detail/index?ActivityId=${Activity.ActivityId}`
      }
    },

    formatDate() {
      this.setData({
        beginTime: formatActivityTime(this.data.Activity.BeginTime)
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

    sharePoster() {
      wx.navigateTo({
        url: '../activity-poster/index',
        success:(res) => {
          res.eventChannel.emit('initData', {
            Activity: this.data.Activity
          })
        }
      })
    },

    apply() {
      wx.navigateTo({
        url: '../apply/index',
        success:(res) => {
          res.eventChannel.emit('initData', {
            User: this.data.User,
            Activity: this.data.Activity
          })
        }
      })
    },

    openLocation() {
      const Location = this.data.Activity.Location
      wx.openLocation({
        latitude: Location.Point.lat,
        longitude: Location.Point.lon,
        name: Location.Name,
        address: Location.Address
      })
    }
  }
})