// pages/activity-poster/index.ts
import * as request from '../../services/index'
import { IActivityInfo, IClubInfo } from '../../services/index'
import { MockActivity } from '../../utils/mock'

const app = getApp()
const fs = wx.getFileSystemManager()

const logger = wx.getRealtimeLogManager()

Component({
  properties: {

  },

  data: {
    qrcode: '',
    User: {},
    Club: {},
    Activity: {},
    _poster: '',
  },

  lifetimes: {
    attached() {
      this.setData({
        User: app.globalData.User,
        Club: app.globalData.Club,
        Activity: MockActivity
      })

      this.getWxaCode().then((qrcode: string) => {
        this.setData({
          qrcode
        })
      })
    }
  },

  methods: {
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

        const ActivityId = (this.data.Activity as IActivityInfo).ActivityId
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
      const ActivityId = (this.data.Activity as IActivityInfo).ActivityId
      const filePath = `${wx.env.USER_DATA_PATH}/${ActivityId}_activity_qrcode.png`
      return new Promise((resolve, reject) => {
        fs.access({
          path: filePath,
          success() {
            resolve(filePath)
          },
          fail: () => {
            request.getWxaCode({
              // scene: `ClubId=${ClubId}`,
              scene: 'ActivityId=12344',
              path: `pages/club-profile/index`,
              check_path: true,
              env_version: 'develop',
              width: 300,
            }).then(resp => {
              const buffer: any = resp.buffer
              fs.writeFileSync(filePath, buffer, 'base64')
              resolve(filePath)
            }, () => {
              reject()
            })
          }
        })
      })
    },
  }
})