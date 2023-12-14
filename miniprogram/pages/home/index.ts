Component({
  properties: {

  },

  
  data: {
    ActivityList: []
  },

  pageLifetimes: {
    async show() { 
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 0
      })
    }
  },
 
  methods: {

  }
})