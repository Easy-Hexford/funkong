Component({

  properties: {

  },

  data: {
    list: [1,2,3,4,5,6, 7, 8, 9]

  },

  pageLifetimes: {
    async show() { 
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 1
      })
    }
  },

  methods: {

  }
})