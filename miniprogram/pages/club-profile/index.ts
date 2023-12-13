// pages/club-profile/index.ts
import * as request from '../../services/index'
import type { IClubInfo, IActivityInfo, IGetActicityListReq, ISimpleUserInfo } from '../../services/index'
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

    attached() {
      request.getClub({
        ClubId: this.data.ClubId
      }).then(resp => {
        this.setData({
          Club: resp.Club,
          ClubMembers: [resp.OwnerUser]
        })

        request.getActicityList({
          ClubId: this.data.ClubId,
          Offset: this.data._offset,
          Limit: this.data._page,
        }).then(resp => {
          this.setData({
            ActivityTotalCount: resp.TotalCount,
            ActivityList: resp.ActivityList
          })
          this.data._offset = resp.ActivityList.length
        })
      })
    }
  },

  methods: {
    onRefresh() {
      if (this.data._freshing) return
      this.data._freshing = true
      this.data._offset = 0
      request.getActicityList({
        ClubId: this.data.ClubId,
        Offset: this.data._offset,
        Limit: this.data._page,
      }).then(resp => {
        this.data._freshing = false
        this.setData({
          triggered: false,
          ActivityTotalCount: resp.TotalCount,
          ActivityList: resp.ActivityList
        })
        this.data._offset = resp.ActivityList.length
      })
    },
  }
})