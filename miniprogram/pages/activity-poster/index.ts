// pages/activity-poster/index.ts
import dayjs from 'dayjs'
import * as request from '../../services/index'
import { IActivityInfo, IUserInfo } from '../../services/index'
import { IPosterQuery } from '../../utils/bind'
import { Month } from '../../utils/constant'
import env from '../../utils/env'
import { MockActivity } from '../../utils/mock'
import { compareVersion, objectToQueryString, WeekNames } from '../../utils/util'

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
    User: <IUserInfo>{},
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
    }
  },

  methods: {
    initData() {
      const eventChannel = this.getOpenerEventChannel()
      if (eventChannel?.on) {
        eventChannel.on('initData', (data) => {
          this.setData({
            User: data.User,
            Activity: data.Activity
          })
          this.formatDate()

          this.getWxaCode()
            .then((qrcode: string) => {
              this.setData({
                qrcode
              })
            })
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
      const { User, Activity } = this.data
      const ClubId = Activity.ClubId
      const ActivityId = Activity.ActivityId
      const filePath = `${wx.env.USER_DATA_PATH}/${ActivityId}_activity_qrcode.png`
      return new Promise((resolve, reject) => {
        let queryObject: IPosterQuery
        // 主理人创建活动海报
        if (User.UserId === Activity.UserId) {
          queryObject = {
            ClubId,
            ActivityId,
            RegisterType: 'ActivityInvite',
          }
        } else {
          // 非主理人创建活动海报
          queryObject = {
            ClubId,
            ActivityId: '',
            RegisterType: 'Normal',
          }
        }

        request.setSceneValue({
          Value: objectToQueryString(queryObject),
          ExpireSeconds: Month
        }).then(resp => {
          request.getWxaCode({
            scene: resp.Scene,
            page: 'pages/activity-detail/index',
            check_path: false,
            env_version: env.envVersion,
            width: 300,
          }).then(resp => {
            const buffer: any = resp.buffer
            fs.writeFileSync(filePath, buffer, 'base64')
            resolve(filePath)
          }, () => {
            reject()
          })
        })
      })
    },
  }
})