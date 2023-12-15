// pages/activity-detail/index.ts
import * as request from '../../services/index'
import type { IActivityAuditStatus, IActivityInfo, ISimpleUserInfo, IUserInfo } from '../../services'
import { calcDistance, getLocation } from '../../utils/location'
import { formatActivityTime } from '../../utils/util'
import { getPosterQuery } from '../../utils/bind'

const app = getApp()

Component({
  properties: {
    ActivityId: {
      type: String,
      value: ''
    },

    scene: {
      type: String,
    },

    mode: {
      type: String,
      value: 'audit' // audit
    }
  },

  data: {
    distance: 0,
    beginTime: '',
    Activity: <IActivityInfo>{},
    ActivityMembers: <Array<ISimpleUserInfo>>[],
    OwnerUserId: '',
    User: <IUserInfo>{},

    auditResult: <IActivityAuditStatus>''
  },

  pageLifetimes: {
    show() { }
  },

  lifetimes: {
    async attached() {
      if (this.data.scene) {
        const posterQuery = await getPosterQuery(this.data.scene)
        this.data.ActivityId = posterQuery.ActivityId
      }

      this.refreshActivity()
      const User = await app.getUser()
      this.setData({ User })

      wx.showShareMenu({
        menus: ['shareAppMessage']
      })
    }
  },

  methods: {
    refreshActivity() {
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
    },

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
        success: (res) => {
          res.eventChannel.emit('initData', {
            User: this.data.User,
            Activity: this.data.Activity,
          })
        }
      })
    },

    apply() {
      wx.navigateTo({
        url: '../sign-up/index',
        success: (res) => {
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
    },

    audit(e: any) {
      const status = e.currentTarget.dataset.status
      request.updateActivity({
        ActivityId: this.data.ActivityId,
        AuditStatus: status
      }).then(() => {
        this.setData({
          auditResult: status
        })
      })
    },
  }
})