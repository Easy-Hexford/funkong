import * as request from '../../services/index'
import type { IActivityInfo, ICreateActivityReq, IInsuranceProduct } from "../../services";
import { uploadBehavior } from '../../behaviors/upload'
import type { IUploadBehavior } from '../../behaviors/upload'
import dayjs from 'dayjs'
import { getAddress } from '../../utils/location'
import { MAP_KEY } from '../../config';
import { autoBack } from '../../utils/util';

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

Component({
  behaviors: [uploadBehavior],

  options: {
    pureDataPattern: /^_/
  },
  
  properties: {
    ClubId: {
      type: String,
    }
  },

  data: {
    ActivityCoverTempFile: '',
    Activity: <IActivityInfo>{},

    // 活动价格
    ActivityPrice: '',
    errPrice: '',

    // 日期选择
    BeginTime: '',
    EndTime: '',
    dateType: 'Begin',
    showDateTimePicker: false,
    datePickerVisible: false,
    start: 0,
    end: 0,
    steps: { minute: 30 },

    // 活动&保险类别
    typePickerVisible: false,
    InsuranceProductList: <Array<IInsuranceProduct>>[],
    InsurancePrice: '',
    ActivityType: '',

    // 活动配图
    maxCount: 8,
    illustrations: [],

    submittable: false,
    _submitting: false,
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

    },

    attached() {
      this.initializeDateTimePicker()
      this.initializeInsuranceProductList()
    }
  },

  methods: {
    submit() {
      if (this.data._submitting) {
        return
      }

      if (this.data.errPrice) {
        return
      }

      const activityPrice = +this.data.ActivityPrice
      if (!this.checkActivityPrice(activityPrice)) {
        return
      }

      if (!this.data.submittable) return

      this.data._submitting = true
      const Activity = this.data.Activity
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
        Location: Activity.Location,
        ActivityRule: Activity.ActivityRule,
      }).then(() => {
        wx.showToast({
          icon: 'success',
          title: '已提交审核',
        })
        autoBack()
      }, (e) => {
        wx.showToast({
          icon: 'error',
          title: e.message
        })
      }).finally(() => {
        this.data._submitting = false
      })
    },

    checkFormFields() {
      const Activity: ICreateActivityReq = this.data.Activity as any
      if (Activity.CoverUrls?.Items[0]
        && Activity.Title
        && Activity.Content
        && Activity.BeginTime
        && Activity.EndTime
        && Activity.Location
        && this.data.illustrations.length > 0
        && typeof Activity.ActivityRule?.Price === 'number'
        && typeof Activity.ActivityRule?.MaxSignUpNumber === 'number'
        && Activity.ActivityTypes?.Items[0]
      ) {
        return true
      }

      return false
    },

    initializeDateTimePicker() {
      const now = dayjs().minute(0).second(0)
      const start = now.add(24, 'hour')
      const end = now.add(2, 'week')

      this.setData({
        showDateTimePicker: true,
        start: start.valueOf(),
        end: end.valueOf()
      })
    },

    initializeInsuranceProductList() {
      request.getInsuranceProductList().then(resp => {
        this.setData({
          InsuranceProductList: resp.InsuranceProducts
        })
      })
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
            'Activity.Location': {
              Name: res.name,
              Address: res.address,
              LocationType: 'gcj02',
              Point: {
                lat: res.latitude,
                lon: res.longitude,
              }
            },
          })

          getAddress({
            lat: res.latitude,
            lon: res.longitude
          })
            .then(resp => {
              const { province, city } = resp.address_component
              this.setData({
                'Activity.Province': province,
                'Activity.City': city,
              })
            }, (err) => {
              console.error(err)
              this.setData({
                'Activity.Province': 'unKnown',
                'Activity.City': 'unKnown',
              })
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

    onTypePickerVisibleChange(e: any) {
      this.setData({
        typePickerVisible: e.detail.visible,
      });
    },

    onTypePickerConfirm(e: any) {
      const InsuranceProductList = this.data.InsuranceProductList
      const { index, activityType } = e.detail
      const insurancePrice = (InsuranceProductList[index].NormalPrice / 100).toFixed(2)
      this.setData({
        typePickerVisible: false,
        ActivityType: activityType,
        InsurancePrice: insurancePrice,
        'Activity.ActivityTypes.Items[0]': activityType,
      })
    },

    onTitleInputDone(e: any) {
      const value = e.detail.value
      this.setData({
        'Activity.Title': value
      })
    },

    checkActivityPrice(price: number) {
      const InsurancePrice = +this.data.InsurancePrice
      if (price < InsurancePrice) {
        this.setData({
          errPrice: '活动价格不能低于保险费用'
        })
        return false
      }
      return true
    },

    resetPriceErr() {
      this.setData({
        errPrice: ''
      })
    },

    onPriceInputDone(e: any) {
      const value = e.detail.value
      if (!this.checkActivityPrice(value)) {
        return
      }

      const price = Number(value).toFixed(2)
      this.setData({
        'Activity.ActivityRule.Price': +price * 100,
        ActivityPrice: price
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
              if (idx < this.data.illustrations.length) {
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