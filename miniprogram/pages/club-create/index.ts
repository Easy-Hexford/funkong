import * as request from '../../services/index'

import { uploadBehavior, IUploadBehavior } from '../../behaviors/upload'
import { IClubInfo, IClubInfoNullable } from '../../services/index'

const app = getApp()
const log = wx.getRealtimeLogManager()

const CLUB_PIC_CATALOG = 'club/'

Component({
  behaviors: [uploadBehavior],

  properties: {

  },

  data: {
    ClubCoverTempFile: '',
    ClubIconTempFile: '',

    User: {},
    Club: {
      CoverUrls: {
        Items: []
      }
    },
  },

  attached() {
    this.setData({
      User: app.globalData.User,
      Club: app.globalData.Club,
    })
  },

  observers: {
    'Club.**': function (_) {
      this.setData({
        active: this.checkClubField()
      })
    },
  },

  methods: {
    submit() {
      const Club: IClubInfo = this.data.Club as any
      request.createClub({
        ClubType: 'NormalClub',
        ClubName: Club.ClubName,
        CoverUrls: Club.CoverUrls,
        ClubIcon: Club.ClubIcon,
        Province: Club.Province,
        City: Club.City,
        ClubDesc: Club.ClubDesc
      })
      this.setData({
        isAuditing: true
      })
    },

    checkClubField() {
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
    }
  }
})