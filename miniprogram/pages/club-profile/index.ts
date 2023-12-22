// pages/club-profile/index.ts
import * as request from '../../services/index'
import type { IClubInfo, IActivityInfo, ISimpleUserInfo, IUserInfo, getUser, IGetUserResp } from '../../services/index'
import { getPosterQuery } from '../../utils/bind'
// import { MockClub } from '../../utils/mock'

const app = getApp()

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {
    scene: {
      type: String,
    },

    ClubId: {
      type: String,
    },

    RegisterClubId: {
      type: String,
    },
  },

  data: {
    User: <IUserInfo>{},
    Club: <IClubInfo>{},
    ClubOwnerUser: <ISimpleUserInfo>{},
    ClubMembers: <Array<ISimpleUserInfo>>[],
    ActivityList: <Array<IActivityInfo>>[],
    ActivityTotalCount: 0,

    loading: true,
    firstPage: false,
    _reenter: false,

    triggered: false,
    _offset: 0,
    _page: 10,
    _freshing: false,
    _loadMore: false,

    showFireWork: false

  },

  lifetimes: {
    async attached() {
      if (this.data.scene) {
        const posterQuery = await getPosterQuery(this.data.scene)
        this.data.ClubId = posterQuery.ClubId!
        this.data.RegisterClubId = posterQuery.RegisterClubId
      }

      if (!this.data.ClubId) {
        console.error('ClubId prop not found')
        return
      }

      const pageStack = getCurrentPages()
      const firstPage = pageStack.length === 1
      this.setData({ firstPage })

      await this.refreshClub()
      await this.getUser()

      this.displayFireWorkIfNeeded()
      this.refreshClubActivityList()

      wx.showShareMenu({
        menus: ['shareAppMessage']
      })
    }
  },

  methods: {
    displayFireWorkIfNeeded() {
      const User = this.data.User
      if (!User.RegisterType && this.data.RegisterClubId) {
        this.setData({
          showFireWork: true
        })
      }
    },

    async getUser() {
      return app.getUser().then((resp: IGetUserResp) => {
        this.setData({ User: resp.User })
      })
    },

    async refreshClub() {
      return request.getClub({
        ClubId: this.data.ClubId
      }).then(resp => {
        this.setData({
          Club: resp.Club,
          ClubOwnerUser: resp.OwnerUser,
          ClubMembers: [resp.OwnerUser]
        })
      })
    },

    async refreshClubActivityList() {
      const { User, ClubOwnerUser } = this.data
      const isClubOwner = User.UserId === ClubOwnerUser.UserId
      return request.getActicityList({
        ClubId: this.data.ClubId,
        Offset: 0,
        Limit: this.data._page,
        AuditStatus: isClubOwner ? '' : 'AuditSucc'
      }).then(resp => {
        this.setData({
          loading: false,
          ActivityTotalCount: resp.TotalCount,
          ActivityList: resp.ActivityList,
          _offset: resp.ActivityList.length
        })
      })
    },

    async loadMore() {
      if (this.data._offset >= this.data.ActivityTotalCount) return
      if (this.data._loadMore) return
      this.data._loadMore = true

      const { User, ClubOwnerUser } = this.data
      const isClubOwner = User.UserId === ClubOwnerUser.UserId
      return request.getActicityList({
        ClubId: this.data.ClubId,
        Offset: this.data._offset,
        Limit: this.data._page,
        AuditStatus: isClubOwner ? '' : 'AuditSucc'
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

    onRefresh() {
      if (this.data._freshing) return
      this.data._freshing = true
      this.refreshClubActivityList()
        .then(() => {
          this.setData({
            triggered: false,
            _freshing: false,
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

    onShareAppMessage(_: WechatMiniprogram.Page.IShareAppMessageOption): WechatMiniprogram.Page.ICustomShareContent {
      const Club = this.data.Club
      const UserClub: IClubInfo = app.globalData.Club
      const RegisterClubId = UserClub.ClubId ?? ''
      return {
        title: `${Club.ClubName}邀请你参加活动`,
        path: `pages/club-profile/index?ClubId=${Club.ClubId}&RegisterClubId=${RegisterClubId}`
      }
    },
  }
})