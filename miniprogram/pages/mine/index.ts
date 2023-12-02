import * as request from '../../services/index'

Component({
  properties: {

  },

  data: {
    isSuperRole: false,
    userInfo: {},
    clubInfo: {},
  },

  lifetimes: {
    async created() {
      const info = await request.getUser()
      this.setData({
        isSuperRole: info.User.Role === 'SuperRole',
        userInfo: info.User,
        clubInfo: info.Club ?? {}
      })
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