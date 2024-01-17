import * as request from '../../services/index'
import { IActivityInfo, IClubInfo, IGetUserResp, IUserInfo } from '../../services/index'
import { HOME_SHARE_PICS } from '../../config'

const app = getApp()

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {
    RegisterClubId: {
      type: String,
    }
  },

  data: {
    ActivityList: <Array<IActivityInfo>>[],
    ActivityTotalCount: 0,

    loading: true,
    triggered: false,
    _freshing: false,
    _offset: 0,
    _page: 10,
    _loadMore: false,

    showFireWork: false,
  },

  lifetimes: {
    async attached() {
      this.refreshActivityList()

      await this.getUser()
      this.displayFireWorkIfNeeded()
    },

    ready() {
      wx.showShareMenu({
        menus: ['shareAppMessage']
      })
    }
  },

  pageLifetimes: {
    async show() {
      this.updateTabBar()
    }
  },

  methods: {
    displayFireWorkIfNeeded() {
      const User: IUserInfo = app.globalData.User
      if (this.data.RegisterClubId) {
        if (app.globalData.DidRegisterClub || !User.RegisterType) {
          this.setData({
            showFireWork: true
          })
          app.globalData.DidRegisterClub = false
        }
      }
    },

    async getUser() {
      return app.getUser()
    },

    async refreshActivityList() {
      request.getPulicActivityList({
        Offset: 0,
        Limit: this.data._page,
      }).then(resp => {
        this.setData({
          loading: false,
          ActivityList: resp.ActivityList,
          ActivityTotalCount: resp.TotalCount,
          _offset: resp.ActivityList.length
        })
      })
    },

    onRefresh() {
      if (this.data._freshing) return
      this.data._freshing = true
      this.refreshActivityList()
        .then(() => {
          this.setData({
            triggered: false,
            _freshing: false,
          })
        })
    },

    loadMore() {
      if (this.data._offset >= this.data.ActivityTotalCount) return
      if (this.data._loadMore) return
      this.data._loadMore = true
      request.getPulicActivityList({
        Offset: this.data._offset,
        Limit: this.data._page,
      }).then(resp => {
        const ActivityList = this.data.ActivityList
        ActivityList.push(...resp.ActivityList)
        this.setData({
          ActivityList,
          ActivityTotalCount: resp.TotalCount,
          _offset: ActivityList.length,
          _loadMore: false
        })
      })
    },

    updateTabBar() {
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 0
      })
    },

    onShareAppMessage(_: WechatMiniprogram.Page.IShareAppMessageOption): WechatMiniprogram.Page.ICustomShareContent {
      const count = HOME_SHARE_PICS.length
      const random = Math.floor(Math.random() * count)
      const Club: IClubInfo = app.globalData.Club
      const RegisterClubId = Club.ClubId ?? ''

      return {
        title: '累了就要Fun空一下！',
        path: `pages/home/index?RegisterClubId=${RegisterClubId}`,
        imageUrl: HOME_SHARE_PICS[random],
      }
    },
  }
})