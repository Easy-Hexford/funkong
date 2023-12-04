// pages/share-card/index.ts
import * as request from '../../services/index'
import { IClubInfo } from '../../services/index'
const app = getApp()
const fs = wx.getFileSystemManager()

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
    // exportCard() {
    //   this.createSelectorQuery()
    //   .select("#card-wrap")
    //   .node()
    //   .exec(res => {
    //     const node = res[0].node
    //     node.takeSnapshot({
    //       type: 'arraybuffer',
    //       format: 'png',
    //     })
    //   }),
    // },

    getWxaCode() {
      const ClubId = (this.data.Club as IClubInfo).ClubId
      return request.getWxaCode({
        scene: `ClubId=${ClubId}`,
        path: `pages/club-profile/index`,
        check_path: true,
        env_version: 'develop',
      }).then(resp => {
        const buffer: any = resp.buffer
        const qrcode = 'data:image/png;base64,' + buffer
        return qrcode
      })
    },

    saveWxaCode(buffer: ArrayBuffer) {
      const ClubId = (this.data.Club as IClubInfo).ClubId
      const filePath = wx.env.USER_DATA_PATH + `/qrcode/${ClubId}.png`
      fs.writeFileSync(filePath, buffer, 'binary')
      return filePath
    }
  }
})