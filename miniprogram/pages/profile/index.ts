import { uploadBehavior } from '../../behaviors/upload'
import type { IChooseImageFunc } from '../../behaviors/upload'
import type { IUserInfo } from '../../services/index'
import _ from '../../miniprogram_npm/lodash-es/index'

const app = getApp()

const USER_PIC_CATALOG = 'user/'

Component({
  behaviors: [uploadBehavior],

  options: {
  },
 
  properties: {
    
  },

  data: {
    UserCoverTempFile: '',
    UserIconTempFile: '',
    User: {},

    genders: [
      { label: '男', value: 'Man' },
      { label: '女', value: 'Woman' },
    ],
    genderPickerVisible: false,

    datePickerVisible: false,
    date: '2008-10-01 00:00:00',
    start: '1949-10-01 00:00:00',
    end: new Date().getTime(),
    active: false,
  },

  lifetimes: {
    attached() {
      const User: IUserInfo = app.globalData.User
      const UserCoverTempFile = User.CoverUrls.Items[0]
      const UserIconTempFile = User.Icon

      this.setData({
        User: _.cloneDeep(User),
        UserCoverTempFile,
        UserIconTempFile,
      })
    }
  },

  observers: {
    'User.**': function (_) {
      this.setData({
        active: true
      })
    },
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
      const gender = e.detail.value[0];
      this.setData({
        'User.Gender': gender
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

    onNameInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'User.NickName': value
      })
    },

    chooseCover(this: { chooseImage: IChooseImageFunc }) {
      this.chooseImage({
        catalog: USER_PIC_CATALOG,
        varName: 'UserCoverTempFile'
      }).then(resp => {
        (this as any).setData({
          'User.CoverUrls.Items[0]': resp.tempFileURL
        })
      })
    },

    onChooseAvatar(this: { chooseImage: IChooseImageFunc }, e: any) {
      const { avatarUrl } = e.detail
    
    },
    
    submit() {

    }
  }
})