// pages/club-profile/index.ts
import * as request from '../../services/index'
import type { IUserInfo, IClubInfo, IActivityInfo } from '../../services/index'
import { MockClub } from '../../utils/mock'

const app = getApp()

Component({
  properties: {

  },

  data: {
    Club: <IClubInfo>{},
    ClubMembers: <Array<IUserInfo>>[],
    ActivityList: <Array<IActivityInfo>>[],
  },

  lifetimes: {
    attached() {
      const { User, Club } = app.globalData
      this.setData({
        // Club,
        ClubMembers: [User],
        Club: MockClub
      })

      this.fetchActivities()
    }
  },

  methods: {
    fetchActivities() {
      const Club: IClubInfo = this.data.Club
      request.getActicityList({
        ClubId: Club.ClubId,
        Offset: 0,
        Limit: 20,
      }).then(resp => {
        this.setData({
          ActivityList: resp.ActivityList || []
        })
      })
    }
  }
})