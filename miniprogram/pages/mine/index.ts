import * as request from '../../services/index'

const app = getApp()

Component({
  properties: {

  },

  data: {
    isSuperRole: false,
    isAuditing: false,
    User: {},
    Club: {},
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
    updateTabBar() {
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 2
      })
    },

    async updateUserInfo() {
      const info = await request.getUser()
      this.setData({
        isSuperRole: info.User.Role === 'SuperRole',
        isAuditing: info.Club.AuditStatus === 'Auditing',
        User: info.User,
        Club: info.Club
      })

      app.globalData.User = info.User
      app.globalData.Club = info.Club
    }
  }
})