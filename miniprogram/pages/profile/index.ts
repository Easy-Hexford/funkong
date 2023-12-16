import * as request from '../../services/index'
import { IClubInfo, IUserInfo } from '../../services/index'
import _ from '../../utils/lodash'

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
      if (this.data.isAuditing) {
        return
      }

      wx.navigateTo({
        url: `../club-poster/index`,
        success:(res) => {
          res.eventChannel.emit('initData', {
            Club: this.data.Club,
          })
        }
      })
    },

    updateTabBar() {
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 2
      })
    },

    editUserInfo() {
      wx.navigateTo({
        url: '../user-info/index',
        success: (res) => {
          res.eventChannel.emit('initData', {
            User: _.cloneDeep(this.data.User),
          })
        }
      })
    },

    async updateUserInfo() {
      const info = await request.getUser({
        UseCache: false
      })
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