// pages/club-profile/index.ts
import * as request from '../../services/index'
import type { IUserInfo, IClubInfo, IActivityInfo, IGetClubResp, IGetActicityListReq } from '../../services/index'
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
    ClubMembers: <Array<IUserInfo>>[],
    ActivityList: <Array<IActivityInfo>>[],

    _offset: 0,
    _page: 30,
  },

  lifetimes: {
    created() { 
      // TODO 
      // 刷新活动列表
      // 上拉加载更多
    },

    attached() {
      this.fetchClubInfo().then(resp => {
        const ClubId = resp.Club.ClubId
        this.setData({
          Club: resp.Club
        })

        this.data.ClubId = ClubId
        const { _offset, _page } = this.data
        request.getActicityList({
          ClubId,
          Offset: _offset,
          Limit: _page,
        }).then(resp => {
          this.setData({
            ActivityList: resp.ActivityList
          })
        })
      })

    }
  },

  methods: {
    async fetchClubInfo(): Promise<IGetClubResp> {
      const Club: IClubInfo = app.globalData.Club
      if (Club.ClubId) {
        return { Club }
      }

      if (this.data.ClubId) {
        return request.getClub({
          ClubId: this.data.ClubId
        })
      }

      throw new Error('getClub fail: no ClubId')
    },
  }
})