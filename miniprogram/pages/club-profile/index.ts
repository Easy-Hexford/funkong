// pages/club-profile/index.ts
import * as request from '../../services/index'
import type { IClubInfo, IClubInfoNullable } from '../../services/index'
import { MockClub } from '../../utils/mock'

const app = getApp()

Component({
  properties: {

  },

  data: {
    members: [1,2,3,4,5,6,7,8],
    activities: [1, 2],

    Club: {},
  },

  lifetimes: {
    attached() {
      this.setData({
        // Club: app.globalData.Club,
        Club: MockClub
      })
    }
  },

  methods: {

  }
})