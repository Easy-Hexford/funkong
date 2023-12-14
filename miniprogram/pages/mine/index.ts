import * as request from '../../services/index'
import { IClubInfo, IUserInfo } from '../../services/index'

const app = getApp()

Component({
  properties: {

  },

  data: {
    isAuditing: false,
    User: <IUserInfo>{},
    Club: <IClubInfo>{},
  },

  lifetimes: {
    async created() {

    },

    async attached() {

    }
  },

  pageLifetimes: {
    async show() {
      this.updateTabBar()
      this.updateUserInfo()
    }
  },

  methods: {
    viewClub() {
      const ClubId = this.data.Club.ClubId
      let url = `../club-profile/index?ClubId=${ClubId}`
      if (this.data.isAuditing) {
        url = '../club-create/index'
      }
      wx.navigateTo({ url })
    },

    createActivity() {
      if (this.data.isAuditing)
        return

      const ClubId = this.data.Club.ClubId
      wx.navigateTo({
        url: `../activity-create/index?ClubId=${ClubId}`
      })
    },

    invite() {
      if (this.data.isAuditing)
      return

      const ClubId = this.data.Club.ClubId
      wx.navigateTo({
        url: `../club-poster/index?ClubId=${ClubId}`
      })
    },

    updateTabBar() {
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 2
      })
    },

    async updateUserInfo() {
      const info = await request.getUser()
      this.setData({
        isAuditing: info.Club.AuditStatus === 'Auditing',
        User: info.User,
        Club: info.Club
      })

      app.globalData.User = info.User
      app.globalData.Club = info.Club
    }
  }
})