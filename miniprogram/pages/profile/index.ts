import { IClubInfo, IGetUserResp, IUserInfo } from '../../services/index'
import _ from '../../utils/lodash'

const app = getApp()

Component({
  properties: {

  },

  data: {
    isAuditing: false,
    User: <IUserInfo>{},
    Club: <IClubInfo>{},

    triggered: false,
    _freshing: false,
  },

  lifetimes: {
    async created() {

    },
  },

  pageLifetimes: {
    async show() {
      this.updateTabBar()
      this.refresh()
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

    updateTabBar() {
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 2
      })
    },

    onRefresh() {
      if (this.data._freshing) return
      this.data._freshing = true
      this.forceRefresh()
        .then(() => {
          this.data._freshing = false
          this.setData({
            triggered: false,
          })
        })
    },

    refresh() {
      app.getUser()
        .then((resp: IGetUserResp) => {
          this.setData({
            isAuditing: resp.Club.AuditStatus === 'Auditing',
            User: resp.User,
            Club: resp.Club
          })
        })
    },

    async forceRefresh() {
      app.getLatestUser()
        .then((resp: IGetUserResp) => {
          this.setData({
            isAuditing: resp.Club.AuditStatus === 'Auditing',
            User: resp.User,
            Club: resp.Club
          })
        })
    }
  }
})