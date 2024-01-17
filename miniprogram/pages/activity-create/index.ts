import * as request from '../../services/index'
import type { IActivityInfo, ICreateActivityReq, IGetUserResp, IInsuranceProduct, IUserInfo } from "../../services";
import { uploadBehavior } from '../../behaviors/upload'
import type { IUploadBehavior } from '../../behaviors/upload'
import dayjs from 'dayjs'
import { getAddress } from '../../utils/location'
import { autoBack } from '../../utils/util';
import { MockActivity } from '../../utils/mock'
import env from '../../utils/env';

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
    User: <IUserInfo>{},

    ActivityCoverTempFile: '',
    Activity: <IActivityInfo>{},

    // 活动价格
    isFreeInsurance: false,
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
    errTime: '',

    // 活动&保险类别
    typePickerVisible: false,
    InsuranceProductList: <Array<IInsuranceProduct>>[],
    InsurancePrice: '',
    ActivityType: '',

    // 活动配图
    maxCount: 8,
    illustrations: [],

    submittable: false,
    _lock: false,
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
      this.getUser()
      this.initializeDateTimePicker()
      this.initializeInsuranceProductList()

      // this.initData().then((resp) => {
      //   this.setData({
      //     Activity: resp.Activity
      //   })
      // })
    }
  },

  methods: {
    initData(): Promise<{ Activity: IActivityInfo }> {
      return new Promise(resolve => {
        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel?.on) {
          eventChannel.on('initData', (data) => {
            resolve({
              Activity: data.Activity
            })
          })
        } else if (env.kDebugMode) {
          resolve({
            Activity: MockActivity
          })
        }
      })
    },

    getUser() {
      app.getUser()
        .then((resp: IGetUserResp) => {
          this.setData({
            User: resp.User,
          })
        })
    },

    submit() {
      if (this.data._lock) {
        return
      }

      if (this.data.errPrice) {
        return
      }

      const activityPrice = +this.data.ActivityPrice
      if (!this.checkActivityPrice(activityPrice)) {
        return
      }

      if (!this.checkActivityTime()) {
        return
      }

      if (!this.data.submittable) return

      this.data._lock = true
      const Activity = this.data.Activity
      const illustrations: Array<Illustration> = this.data.illustrations
      wx.showToast({
        icon: 'loading',
        title: '正在确认'
      })
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
      const updates: any = { 
        errTime: ''
      }
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
      const isFreeInsurance = InsuranceProductList[index].InsuranceType === 'Free'
      this.setData({
        isFreeInsurance,
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

    checkActivityTime() {
      const { BeginTime, EndTime } = this.data.Activity
      const t1 = dayjs(BeginTime)
      const t2 = dayjs(EndTime)
      if (t2.diff(t1, 'h') >= 48) {
        this.setData({
          errTime: '结束时间至多比开始时间晚48小时'
        })
        return false
      } 
      return true
    },

    checkActivityPrice(price: number) {
      if (this.data.isFreeInsurance) return true
      const { BeginTime, EndTime } = this.data.Activity
      if (!BeginTime || !EndTime) {
        this.setData({
          errPrice: '需要先设置活动时间'
        })
        return false
      }

      const t1 = dayjs(BeginTime).startOf('date')
      const t2 = dayjs(EndTime).startOf('date')
      const days = t2.diff(t1, 'd') + 1

      const InsurancePrice = +this.data.InsurancePrice * days
      const ActivityType = this.data.ActivityType
      const minActivityPrice = 2 * InsurancePrice
      if (price < minActivityPrice) {
        this.setData({
          errPrice: `${ActivityType}活动保险费用为¥${InsurancePrice.toFixed(2)}，活动费用不可低于${minActivityPrice.toFixed(2)}元。`
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