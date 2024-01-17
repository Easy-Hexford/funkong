// custom-tab-bar/index.ts

const tabUrls = [
  '/pages/home/index',
  '/pages/mine/index',
  '/pages/profile/index'
]

Component({
  data: {
    selected: 0,
    list: [
      { value: 0, label: 'Fun空', icon: 'home', index: 0 },
      { value: 1, label: '活动', icon: 'app', index: 1 },
      { value: 2, label: '我', icon: 'user', index: 2 },
    ],
  },

  methods: {
    onChange(e: any) {
      const selected = e.detail.value
      this.setData({ selected });
      wx.switchTab({
        url: tabUrls[selected]
      })
    },
  }
})