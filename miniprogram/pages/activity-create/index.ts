import * as request from '../../services/index'
import type { ICreateActivityReq } from "../../services";
import { uploadBehavior } from '../../behaviors/upload'
import type { IUploadBehavior } from '../../behaviors/upload'
import dayjs from 'dayjs'

const typeCheck = require('type-check').typeCheck;
const app = getApp()
const ACTIVITY_PIC_CATALOG = 'activity/'

interface Illustration {
  idx: number
  tempFilePath: string,
  url: string; 
  size?: number; 
  fileType: 'image' | 'video'; 
  percent?: number; 
  status: 'loading' | 'reload' | 'failed' | 'done'
}

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
      Province: '广东省',
      City: '广州市',
      LocationType: 'gcj02',
      Location: {},
      LocationName: '',
      ActivityRule: {},
    },
    BeginTime: '',
    EndTime: '',
    dateType: 'Begin',
    datePickerVisible: false,
    start: 0,
    end: 0,
    typePickerVisible: false,
    submittable: false,
    activityTypes: [],

    maxCount: 8,
    illustrations: [],
  },

  observers: {
    'Activity.**': function (_) {
      this.setData({
        submittable: this.checkFormFields()
      })
    },
  },

  lifetimes: {
    created() {
      const today = dayjs().format('DD/MM/YYYY')
      const startTime = dayjs(today, 'DD/MM/YYYY')
      const endTime = startTime.add(1, 'year')
      this.setData({
        start: startTime.valueOf(),
        end: endTime.valueOf()
      })
    },

    attached() {
      console.info('ClubId: ', this.data.ClubId)
    }
  },

  methods: {
    submit() {
      if (!this.data.submittable) return
      const Activity: ICreateActivityReq = this.data.Activity as any
      const illustrations: Array<Illustration> = this.data.illustrations
      request.createActivity({
        ClubId: this.data.ClubId,
        Title: Activity.Title,
        Content: Activity.Content,
        CoverUrls: Activity.CoverUrls,
        ActivityTypes: Activity.ActivityTypes,
        BeginTime: Activity.BeginTime,
        EndTime: Activity.EndTime,
        PicList: {
          Items: illustrations.map(i => i.url)
        },
        Province: Activity.Province,
        City: Activity.City,
        LocationType: 'gcj02',
        Location: Activity.Location,
        LocationName: Activity.LocationName,
        ActivityRule: Activity.ActivityRule,
      }).then(() => {
        wx.showToast({
          icon: 'success',
          title: '已提交审核',
        })

        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      })
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
          && Activity.ActivityRule?.MaxSignUpNumber
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
        'Activity.ActivityRule.MaxSignUpNumber': +value
      })
    },

    onContentInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'Activity.Content': value
      })
    },

    addIllustration() {
      const illustrations: Array<Illustration> = this.data.illustrations
      const lastIdx = illustrations.length - 1
      const count = this.data.maxCount - illustrations.length 
      wx.chooseMedia({
        count,
        mediaType: ['image'],
        sizeType: ['original'],
        success: (res) => {
          res.tempFiles.forEach((item, index) => {
            const idx = lastIdx + index + 1
            const newIllustration: Illustration = {
              idx,
              tempFilePath: item.tempFilePath,
              url: '',
              size: item.size,
              percent: 0,
              fileType: item.fileType,
              status: 'loading'
            }
            illustrations.push(newIllustration);

            (this as unknown as IUploadBehavior).pureUploadImage({
              catalog: ACTIVITY_PIC_CATALOG,
              tempFile: item.tempFilePath
            }).then(resp => {
              if (this.data.illustrations.length > idx) {
                const obj: any = {}
                newIllustration.url = resp.tempFileURL
                newIllustration.status = 'done'
                obj[`illustrations[${idx}]`] = newIllustration
                this.setData(obj)
              }
            })
            
          })
          this.setData({
            illustrations: illustrations as any
          })
        }
      })
    },

    delIllustration(e: any) {
      const idx = e.currentTarget.dataset.idx
      const { illustrations } = this.data
      illustrations.splice(idx, 1)
      this.setData({ illustrations })
    }
  }
})