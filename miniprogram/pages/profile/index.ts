Component({
  options: {
  },
 
  properties: {
    
  },

  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      gender: ''
    },
  },

 
  methods: {
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
      })
    },
    
    chooseGender() {
      const that = this
      const genders = ['男', '女']
      wx.showActionSheet({
        alertText: '性别',
        itemList: genders,
        success(res) {
          that.setData({
            'userInfo.gender': genders[res.tapIndex]
          })
        }
      })
    }
  }
})