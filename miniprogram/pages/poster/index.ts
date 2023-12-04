import * as request from '../../services/index'
import { IClubInfo } from '../../services/index'
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
  },

  lifetimes: {
    attached() {
      this.setData({
        User: app.globalData.User,
        Club: app.globalData.Club,
      })

      this.getWxaCode().then(qrcode => {
        this.setData({
          qrcode
        })
      })
    }
  },

  methods: {
    saveClubInvitePoster() {
      const ClubId = (this.data.Club as IClubInfo).ClubId
      this.savePoster({
        selector: '.club-invite-poster',
        filePath: `${ClubId}_club_poster.png`
      })
    },

    savePoster(options: {
      selector: string,
      filePath: string,
    }) {
      this.createSelectorQuery()
        .select(options.selector)
        .node()
        .exec(res => {
          const node = res[0].node
          node.takeSnapshot({
            type: 'arraybuffer',
            format: 'png',
            success: (res: any) => {
              const filePath = `${wx.env.USER_DATA_PATH}/${options.filePath}`
              fs.writeFileSync(filePath, res.data, 'binary')
              wx.saveImageToPhotosAlbum({ filePath })
                .then(() => {
                  wx.showToast({
                    icon: 'success',
                    title: '保存成功'
                  })
                }, () => {
                  wx.showToast({
                    icon: 'error',
                    title: '保存失败'
                  })
                })
            },
          })
        })
    },

    getWxaCode() {
      const ClubId = (this.data.Club as IClubInfo).ClubId
      return request.getWxaCode({
        scene: `ClubId=${ClubId}`,
        path: `pages/club-profile/index`,
        check_path: true,
        env_version: 'develop',
        width: 300,
      }).then(resp => {
        const buffer: any = resp.buffer
        const qrcode = 'data:image/png;base64,' + buffer
        return qrcode
      })
    },

    saveWxaCode(buffer: ArrayBuffer) {
      const ClubId = (this.data.Club as IClubInfo).ClubId
      const filePath = wx.env.USER_DATA_PATH + `/${ClubId}_club_qrcode.png`
      fs.writeFileSync(filePath, buffer, 'binary')
      return filePath
    }
  }
})