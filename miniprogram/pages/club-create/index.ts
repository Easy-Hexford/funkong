import * as request from '../../services/index'

import { uploadBehavior, IUploadBehavior } from '../../behaviors/upload'
import type { IClubInfo, IClubInfoNullable, IGetUserResp, IUserInfo } from '../../services/index'
import { autoBack } from '../../utils/util'
import env from '../../utils/env'
import { MockClub } from '../../utils/mock'

const app = getApp()
const log = wx.getRealtimeLogManager()

const CLUB_PIC_CATALOG = 'club/'

Component({
  options: {
    pureDataPattern: /^_/
  },

  behaviors: [uploadBehavior],

  properties: {
    mode: {
      type: String,
      value: 'create'
    }
  },

  data: {
    User: <IUserInfo>{},

    ClubCoverTempFile: '',
    ClubIconTempFile: '',

    Club: <IClubInfo>{},
    submittable: false,
    _lock: false,
  },

  attached() {
    this.getUser()
    this.initData().then((resp) => {
      const Club = resp.Club
      this.setData({
        Club,
        ClubCoverTempFile: Club.CoverUrls?.Items[0] || '',
        ClubIconTempFile: Club.ClubIcon || ''
      })
    })
  },

  observers: {
    'Club.**': function (_) {
      this.setData({
        submittable: this.checkFormFields()
      })
    },
  },

  methods: {
    getUser() {
      app.getUser()
        .then((resp: IGetUserResp) => {
          this.setData({
            User: resp.User,
          })
        })
    },
    
    initData(): Promise<{ Club: IClubInfo }> {
      return new Promise(resovle => {
        const eventChannel = this.getOpenerEventChannel()
        if (this.data.mode === 'edit' && eventChannel?.on) {
          eventChannel.on('initData', (data) => {
            resovle({
              Club: data.Club
            })
          })
        } else {
          resovle({ Club: app.globalData.Club })
        }
      })
    },

    submit() {
      if (this.data._lock) {
        return
      }

      if (!this.data.submittable) return

      this.data._lock = true
      const Club: IClubInfo = this.data.Club as any
      wx.showToast({
        icon: 'loading',
        title: '正在确认'
      })
      const api = this.data.mode === 'edit' ? request.updateClub : request.createClub
      
      api({
        ClubType: 'NormalClub',
        ClubName: Club.ClubName,
        CoverUrls: Club.CoverUrls,
        ClubIcon: Club.ClubIcon,
        Province: Club.Province,
        City: Club.City,
        ClubDesc: Club.ClubDesc
      }).then(() => {
        wx.showToast({
          icon: 'success',
          title: '已提交',
        })
        autoBack()
      }, (e) => {
        wx.showModal({
          content: e.message,
          showCancel: false
        })
      }).finally(() => {
        this.data._lock = false
      })
      this.setData({
        'Club.AuditStatus': 'Auditing'
      })
    },

    checkFormFields() {
      const Club: IClubInfoNullable = this.data.Club
      if (Club.ClubName && Club.Province && Club.ClubDesc && Club.CoverUrls?.Items[0] && Club.ClubIcon)
        return true

      return false
    },

    onClubNameInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'Club.ClubName': value
      })
    },

    onRegionPickerChange(e: any) {
      const value = e.detail.value
      const [province, city] = value
      this.setData({
        'Club.Province': province,
        'Club.City': city
      })
    },

    onClubDescInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'Club.ClubDesc': value
      })
    },

    async chooseCover() {
      (this as unknown as IUploadBehavior).chooseImage({
        catalog: CLUB_PIC_CATALOG,
        varName: 'ClubCoverTempFile'
      }).then(resp => {
        (this as any).setData({
          'Club.CoverUrls.Items[0]': resp.tempFileURL
        });
      })
    },

    async chooseAvatar() {
      (this as unknown as IUploadBehavior).chooseImage({
        catalog: CLUB_PIC_CATALOG,
        varName: 'ClubIconTempFile'
      }).then(resp => {
        (this as any).setData({
          'Club.ClubIcon': resp.tempFileURL
        });
      })
    },

    deleteAvatar() {
      this.setData({
        'ClubIconTempFile': '',
        'Club.ClubIcon': ''
      })
    },

    goBack() {
      wx.navigateBack()
    }
  }
})