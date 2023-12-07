// pages/club-profile/index.ts
import * as request from '../../services/index'
import type { IUserInfo, IClubInfo, IClubInfoNullable } from '../../services/index'
import { MockClub } from '../../utils/mock'

const app = getApp()

Component({
  properties: {

  },

  data: {
    Club: {},
    members: <Array<IUserInfo>>[],
  },

  lifetimes: {
    attached() {
      const { User, Club } = app.globalData
      this.setData({
        Club,
        members: [User],
        // Club: MockClub
      })
    }
  },

  methods: {

  }
})