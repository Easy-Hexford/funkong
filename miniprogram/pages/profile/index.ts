Component({
  options: {
  },
 
  properties: {
    
  },

  data: {
    userInfo: {
      coverUrl: '',
      avatarUrl: '',
      nickName: '',
      gender: '',
      birthday: '',
    },
    genders: [
      { label: '男', value: '男' },
      { label: '女', value: '女' },
    ],
    genderPickerVisible: false,
    datePickerVisible: false,
    date: '2008-10-01 00:00:00',
    start: '1949-10-01 00:00:00',
    end: new Date().getTime(),
    active: false,
  },

  observers: {
    'userInfo.**': function(_) {
      this.setData({
        active: true
      })
    }
  },

 
  methods: {
    showGenderPicker() {
      this.setData({
        genderPickerVisible: true,
      });
    },

    hideGenderPicker() {
      this.setData({
        genderPickerVisible: false,
      });
    },

    onConfirmGender(e: any) {
      const { value } = e.detail;
      this.setData({
        'userInfo.gender': value[0]
      })
      this.hideGenderPicker();
    },


    showDatePicker() {
      this.setData({
        datePickerVisible: true,
      });
    },

    hideDatePicker() {
      this.setData({
        datePickerVisible: false,
      });
    },

    onConfirmDate(e: any) {
      const { value } = e.detail;
      this.setData({
        'userInfo.birthday': value
      })
      this.hideDatePicker();
    },

    chooseCover() {
      const that = this
      wx.chooseImage({
        count: 1,
        success(res) {
          const cover = res.tempFilePaths[0]
          that.setData({
            'userInfo.coverUrl': cover
          })
        }
      })
    },

    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
      })
    },
    
    submit() {

    }
  }
})