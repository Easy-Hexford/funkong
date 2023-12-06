import * as request from '../../services/index'
import { IClubInfo } from '../../services/index'
import { MockClub } from '../../utils/mock'

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
    _poster: '',
  },

  lifetimes: {
    attached() {
      this.setData({
        User: app.globalData.User,
        Club: app.globalData.Club,
        // Club: MockClub
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

        const ClubId = (this.data.Club as IClubInfo).ClubId
        const selector = '.club-invite-poster'
        const filePath = `${wx.env.USER_DATA_PATH}/${ClubId}_club_poster.png`

        fs.access({
          path: filePath,
          success() {
            resolve(filePath)
          },

          fail:() => {
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
          }
        })
      })
    },

    getWxaCode(): Promise<string> {
      const ClubId = (this.data.Club as IClubInfo).ClubId
      const filePath = wx.env.USER_DATA_PATH + `/${ClubId}_club_qrcode.png`
      return new Promise((resolve, reject) => {
        fs.access({
          path: filePath,
          success () {
            resolve(filePath)
          },
          fail: () => {
            request.getWxaCode({
              // scene: `ClubId=${ClubId}`,
              scene: 'ClubId=12344',
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