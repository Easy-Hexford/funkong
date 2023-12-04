import * as request from '../../services/index'

const app = getApp()

Component({
  properties: {

  },

  data: {
    isSuperRole: false,
    User: {},
    Club: {},
  },

  lifetimes: {
    async created() {
      const info = await request.getUser()
      this.setData({
        isSuperRole: info.User.Role === 'SuperRole',
        User: info.User,
        Club: info.Club
      })

      app.globalData.User = info.User
      app.globalData.Club = info.Club
    },

    async attached() {

    }
  },

  pageLifetimes: {
    async show() { 
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 2
      })
    }
  },

  methods: {

  }
})