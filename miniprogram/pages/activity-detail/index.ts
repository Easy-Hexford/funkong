// pages/activity-detail/index.ts
import * as request from '../../services/index'
import type { IActivityAuditStatus, IActivityInfo, ISimpleUserInfo, IUserInfo } from '../../services'
import { calcDistance, getLocation } from '../../utils/location'
import { formatActivityTime } from '../../utils/util'
import { getPosterQuery } from '../../utils/bind'

const app = getApp()

Component({
  options: {
    pureDataPattern: /^_/
  },

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
      value: 'normal' // audit
    }
  },

  data: {
    distance: 0,
    beginTime: '',
    Activity: <IActivityInfo>{},
    ActivityMembers: <Array<ISimpleUserInfo>>[],
    OwnerUserId: '',
    User: <IUserInfo>{},

    loading: true,
    firstPage: false,
    auditResult: <IActivityAuditStatus>'',
    _reenter: false,
  },

  pageLifetimes: {
    show() {
      if (this.data._reenter) {
        this.refreshActivity()
      }
      this.data._reenter = true
    }
  },

  lifetimes: {
    async attached() {
      if (this.data.scene) {
        const posterQuery = await getPosterQuery(this.data.scene)
        this.data.ActivityId = posterQuery.ActivityId
      }

      const { User } = await app.getUser()
      await this.refreshActivity()
      const pageStack = getCurrentPages()
      const firstPage = pageStack.length === 1

      this.setData({ User, loading: false, firstPage })
      wx.showShareMenu({
        menus: ['shareAppMessage']
      })
    }
  },

  methods: {
    async refreshActivity() {
      return request.getActivity({
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

    goSignUp() {
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

    onBack() {
      wx.navigateBack();
    },
    
    onGoHome() {
      wx.reLaunch({
        url: '/pages/home/index',
      });
    },
  }
})