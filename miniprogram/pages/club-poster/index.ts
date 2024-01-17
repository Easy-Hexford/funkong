import * as request from '../../services/index'
import type { IClubInfo } from '../../services/index'
import { MockClub } from '../../utils/mock'
import env from '../../utils/env'
import { Month } from '../../utils/constant'
import { compareVersion, objectToQueryString } from '../../utils/util'

const app = getApp()
const fs = wx.getFileSystemManager()
const logger = wx.getRealtimeLogManager()

Component({
  properties: {

  },

  data: {
    qrcode: '',
    Club: <IClubInfo>{},
    _poster: '',
  },

  lifetimes: {
    attached() {
      const SystemInfo: WechatMiniprogram.SystemInfo = app.globalData.SystemInfo
      const SDKVersion = SystemInfo.SDKVersion
      if (compareVersion(SDKVersion, '3.0.0') < 0) {
        wx.updateWeChatApp()
        return
      }

      this.initData().then((resp) => {
        this.setData({
          Club: resp.Club
        })

        this.getWxaCode()
          .then((qrcode: string) => {
            this.setData({
              qrcode
            })
          })
      })
    }
  },

  methods: {
    initData(): Promise<{ Club: IClubInfo }> {
      return new Promise(resovle => {
        const eventChannel = this.getOpenerEventChannel()
        if (eventChannel?.on) {
          eventChannel.on('initData', (data) => {
            resovle({
              Club: data.Club
            })
          })
        } else if (env.kDebugMode) {
          resovle({
            Club: MockClub
          })
        }
      })
    },

    share() {
      if (this.data.qrcode) {
        this.takeSnapshot().then(filePath => {
          wx.showShareImageMenu({
            path: filePath
          })
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '海报生成中...'
        })
      }
    },

    onQrcodeLoad() {
      this.takeSnapshot()
    },

    takeSnapshot(): Promise<string> {
      return new Promise((resolve, reject) => {
        if (this.data._poster) {
          resolve(this.data._poster)
        }

        const ClubId = this.data.Club.ClubId
        const selector = '.invite-poster'
        const filePath = `${wx.env.USER_DATA_PATH}/${ClubId}_club_poster.png`

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
      const ClubId = this.data.Club.ClubId
      const filePath = wx.env.USER_DATA_PATH + `/${ClubId}_club_qrcode.png`
      
      return new Promise((resolve, reject) => {
        const UserClub: IClubInfo = app.globalData.Club
        const RegisterClubId = UserClub.ClubId ?? ''

        const queryObject = {
          RegisterClubId,
          ClubId: this.data.Club.ClubId,
        }
        request.setSceneValue({
          Value: objectToQueryString(queryObject),
          ExpireSeconds: Month
        }).then(resp => {
          request.getWxaCode({
            scene: resp.Scene,
            page: `pages/club-profile/index`,
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