import * as request from '../../services/index'
import type { ICreateActivityReq } from "../../services";
import { uploadBehavior } from '../../behaviors/upload'
import type { IUploadBehavior } from '../../behaviors/upload'
import dayjs from 'dayjs'

const typeCheck = require('type-check').typeCheck;
const app = getApp()
const ACTIVITY_PIC_CATALOG = 'activity/'

// pages/activity-create/index.ts
Component({
  behaviors: [uploadBehavior],

  properties: {
    ClubId: {
      type: String,
    }
  },

  data: {
    ActivityCoverTempFile: '',
    Activity: {
      ClubId: '',
      Title: '',
      Content: '',
      CoverUrls: {
        Items: []
      },
      BeginTime: '',
      EndTime: '',
      ActivityTypes: {
        Items: []
      },
      Province: '',
      City: '',
      LocationType: 'gcj02',
      Location: {},
      LocationName: '',
      ActivityRule: {},
    },
    BeginTime: '',
    EndTime: '',
    dateType: 'Begin',
    datePickerVisible: false,
    start: dayjs().valueOf(),
    end: dayjs().add(1, 'year').valueOf(),
    typePickerVisible: false,
    submittable: false,
    activityTypes: []
  },

  observers: {
    'Activity.**': function (_) {
      this.setData({
        submittable: this.checkFormFields()
      })
    },
  },

  lifetimes: {
    attached() {
      this.data.Activity.ClubId = this.data.ClubId
    }
  },

  methods: {
    submit() {
      if (!this.data.submittable) return
      const Activity: ICreateActivityReq = this.data.Activity as any
      request.createActivity(Activity)
    },

    checkFormFields() {
      const Activity: ICreateActivityReq = this.data.Activity as any
      if (Activity.CoverUrls.Items[0] 
          && Activity.Title 
          && Activity.Content 
          && Activity.BeginTime 
          && Activity.EndTime 
          && Activity.LocationName 
          && Activity.ActivityRule?.Price
          && Activity.ActivityRule?.MaxSiguUpNumber
          && Activity.ActivityTypes.Items[0]
      ) {
        return true
      }

      return false
    },

    showDatePicker(e: any) {
      this.setData({
        dateType: e.currentTarget.dataset.type,
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
      const dateType = this.data.dateType
      const updates: any = {}
      updates[`Activity.${dateType}Time`] = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      updates[`${dateType}Time`] = dayjs(value).format('MM月DD日 HH:mm')
      this.setData(updates)
      this.hideDatePicker();
    },

    chooseLocation() {
      wx.chooseLocation({
        success: (res) => {
          this.setData({
            'Activity.LocationName': res.name,
            'Activity.Location': {
              lat: res.latitude,
              lon: res.longitude
            }
          })
        }
      })
    },

    chooseCover() {
      (this as unknown as IUploadBehavior).chooseImage({
        catalog: ACTIVITY_PIC_CATALOG,
        varName: 'ActivityCoverTempFile'
      }).then(resp => {
        (this as any).setData({
          'Activity.CoverUrls.Items[0]': resp.tempFileURL
        });
      })
    },

    showTypePicker() {
      this.setData({
        typePickerVisible: true,
      });
    },

    hideTypePicker() {
      this.setData({
        typePickerVisible: false,
      });
    },

    onVisibleChange(e: any) {
      this.setData({
        typePickerVisible: e.detail.visible,
      });
    },

    onTypePickerConfirm(e: any) {
      const { value } = e.detail
      this.setData({
        typePickerVisible: false,
        'Activity.ActivityTypes.Items[0]': value
      })
    },

    onTitleInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'Activity.Title': value
      })
    },

    onPriceInputDone(e: any) {
      const value = e.detail.value
      const formatValue = Number(value).toFixed(2)
      this.setData({
        'Activity.ActivityRule.Price': +formatValue
      })
    },

    onSignUpNumberInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'Activity.ActivityRule.MaxSiguUpNumber': value
      })
    },

    onContentInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'Activity.Content': value
      })
    }
  }
})