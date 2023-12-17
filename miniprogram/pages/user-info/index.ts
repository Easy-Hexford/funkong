import { uploadBehavior } from '../../behaviors/upload'
import type { IUploadBehavior } from '../../behaviors/upload'
import * as request from '../../services/index'
import type { IGetUserResp, IUserInfo, IUserInfoNullable } from '../../services/index'
import dayjs from 'dayjs'
import { MockUser } from '../../utils/mock'
import { autoBack } from '../../utils/util'

const USER_PIC_CATALOG = 'user/'
const app = getApp()

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
    end: dayjs().valueOf(),
    submittable: false,
  },

  lifetimes: {
    attached() {
      this.initData().then(User => {
        const UserCoverTempFile = User.CoverUrls.Items[0]
        const UserIconTempFile = User.Icon

        this.setData({
          User,
          UserCoverTempFile,
          UserIconTempFile,
        })
      })
    }
  },

  observers: {
    'User.**': function (_) {
      this.setData({
        submittable: this.checkFormFields()
      })
    },
  },


  methods: {
    submit() {
      if (!this.data.submittable) return

      const User: IUserInfoNullable = this.data.User
      request.updateUser({
        CoverUrls: User.CoverUrls,
        Icon: User.Icon,
        NickName: User.NickName,
        Gender: User.Gender,
        BirthdayDate: User.BirthdayDate
      }).then(() => {
        wx.showToast({
          icon: 'success',
          title: '修改成功',
        })
        app.getLatestUser()
          .then(() => {
            autoBack()
          })
      }, (e) => {
        wx.showModal({
          title: e.message,
          showCancel: false
        })
      })
    },

    checkFormFields() {
      const User: IUserInfoNullable = this.data.User
      if (User.CoverUrls?.Items[0] || User.Icon || User.NickName || User.Gender || User.BirthdayDate)
        return true
      return false
    },

    initData(): Promise<IUserInfo> {
      return new Promise(resolve => {
        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel?.on) {
          eventChannel.on('initData', (data) => {
            resolve(data.User)
          })
        } else {
          resolve(MockUser)
        }
      })
    },

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
        'User.BirthdayDate': value
      })
      this.hideDatePicker();
    },

    onNameInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'User.NickName': value
      })
    },

    chooseCover() {
      (this as unknown as IUploadBehavior).chooseImage({
        catalog: USER_PIC_CATALOG,
        varName: 'UserCoverTempFile'
      }).then(resp => {
        (this as any).setData({
          'User.CoverUrls.Items[0]': resp.tempFileURL
        });
      })
    },

    async onChooseAvatar(e: any) {
      const tempFile = e.detail.avatarUrl;
      this.setData({
        'UserIconTempFile': tempFile
      });

      (this as unknown as IUploadBehavior).pureUploadImage({
        catalog: USER_PIC_CATALOG,
        tempFile,
      }).then(resp => {
        (this as any).setData({
          'User.Icon': resp.tempFileURL
        })
      });
    },
  }
})