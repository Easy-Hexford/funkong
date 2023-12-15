// pages/club-profile/index.ts
import * as request from '../../services/index'
import type { IClubInfo, IActivityInfo, ISimpleUserInfo, IUserInfo } from '../../services/index'
import { getPosterQuery } from '../../utils/bind'
// import { MockClub } from '../../utils/mock'

const app = getApp()

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {
    ClubId: {
      type: String,
    },

    scene: {
      type: String,
    }

  },

  data: {
    Club: <IClubInfo>{},
    ClubMembers: <Array<ISimpleUserInfo>>[],
    ActivityList: <Array<IActivityInfo>>[],
    ActivityTotalCount: 0,
    triggered: false,

    _offset: 0,
    _page: 30,
    _freshing: false,
  },

  lifetimes: {
    created() {
      // TODO 
      // 上拉加载更多
    },

    async attached() {
      if (this.data.scene) {
        const posterQuery = await getPosterQuery(this.data.scene)
        this.data.ClubId = posterQuery.ClubId
      }

      this.refreshClub()
      this.refreshClubActivityList()
    }
  },

  methods: {
    async refreshClub() {
      return request.getClub({
        ClubId: this.data.ClubId
      }).then(resp => {
        this.setData({
          Club: resp.Club,
          ClubMembers: [resp.OwnerUser]
        })
      })
    },

    async refreshClubActivityList() {
      return request.getActicityList({
        ClubId: this.data.ClubId,
        Offset: 0,
        Limit: this.data._page,
      }).then(resp => {
        this.setData({
          ActivityTotalCount: resp.TotalCount,
          ActivityList: resp.ActivityList,
          _offset: resp.ActivityList.length
        })
      })
    },

    async loadMore() {
      const ActivityList = this.data.ActivityList
      return request.getActicityList({
        ClubId: this.data.ClubId,
        Offset: this.data._offset,
        Limit: this.data._page,
      }).then(resp => {
        ActivityList.push(...resp.ActivityList)
        this.setData({
          ActivityList,
          _offset: ActivityList.length
        })
      })
    },

    onRefresh() {
      if (this.data._freshing) return
      this.data._freshing = true
      this.refreshClubActivityList()
        .then(() => {
          this.data._freshing = false
          this.setData({
            triggered: false,
          })
        })
    },
  }
})