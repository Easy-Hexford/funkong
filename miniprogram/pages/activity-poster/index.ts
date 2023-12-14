// pages/activity-poster/index.ts
import dayjs from 'dayjs'
import * as request from '../../services/index'
import { IActivityInfo } from '../../services/index'
import { MockActivity } from '../../utils/mock'
import { compareVersion, WeekNames } from '../../utils/util'

const app = getApp()
const logger = wx.getRealtimeLogManager()
const fs = wx.getFileSystemManager()

Component({
  properties: {

  },

  data: {
    qrcode: '',
    date: '',
    time: '',
    Activity: <IActivityInfo>{},
    _poster: '',
  },

  lifetimes: {
    attached() {
      const SystemInfo = app.globalData.SystemInfo as WechatMiniprogram.SystemInfo
      const SDKVersion = SystemInfo.SDKVersion
      if (compareVersion(SDKVersion, '3.0.0') < 0) {
        wx.updateWeChatApp()
        return
      }

      this.initData()
      this.getWxaCode()
        .then((qrcode: string) => {
          this.setData({
            qrcode
          })
        })
    }
  },

  methods: {
    initData() {
      const eventChannel = this.getOpenerEventChannel()
      if (eventChannel?.on) {
        eventChannel.on('initData', (data) => {
          this.setData({
            Activity: data.Activity
          })
          this.formatDate()
        })
      } else {
        this.setData({
          Activity: MockActivity
        })
        this.formatDate()
      }
    },

    formatDate() {
      const Activity = this.data.Activity
      const BeginTime = Activity.BeginTime
      const t = dayjs(BeginTime)
      const date = t.format('YYYY年MM月DD日')
      const week = `${WeekNames[t.day()]} ${t.format('HH:mm')}`
      this.setData({
        week,
        date,
      })
    },

    share() {
      this.takeSnapshot().then((filePath: string) => {
        wx.showShareImageMenu({
          path: filePath
        })
      })
    },

    onQrcodeLoad() {
      this.takeSnapshot()
    },

    takeSnapshot(): Promise<string> {
      return new Promise((resolve, reject) => {
        if (this.data._poster) {
          resolve(this.data._poster)
        }

        const ActivityId = this.data.Activity.ActivityId
        const selector = '.invite-poster'
        const filePath = `${wx.env.USER_DATA_PATH}/${ActivityId}_activity_poster.png`

        this.createSelectorQuery()
          .select(selector)
          .node()
          .exec(res => {
            const node = res[0].node
            node.takeSnapshot({
              type: 'arraybuffer',
              format: 'png',
              success: (res: any) => {
                fs.writeFileSync(filePath, res.data, 'binary')
                this.data._poster = filePath
                resolve(filePath)
              },
              fail(e: any) {
                reject(e)
              }
            })
          })
      })
    },

    getWxaCode(): Promise<string> {
      const ActivityId = this.data.Activity.ActivityId
      const filePath = `${wx.env.USER_DATA_PATH}/${ActivityId}_activity_qrcode.png`
      return new Promise((resolve, reject) => {
        request.getWxaCode({
          scene: '123',
          path: 'pages/activity-detail/index',
          check_path: false,
          env_version: 'trial',
          width: 300,
        }).then(resp => {
          const buffer: any = resp.buffer
          fs.writeFileSync(filePath, buffer, 'base64')
          resolve(filePath)
        }, () => {
          reject()
        })

        fs.access({
          path: filePath,
          success() {
            resolve(filePath)
          },
          fail: () => {
            
          }
        })
      })
    },
  }
})