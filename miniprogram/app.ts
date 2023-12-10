// app.ts
import * as request from './services/index'

const QQMapWX = require('./libs/qqmap-wx-jssdk.min.js');

App({
  globalData: {
    User: {
      CoverUrls: {
        Items: []
      }
    },
    Club: {
      CoverUrls: {
        Items: []
      }
    },

    loc: {},
    qqmapsdk: null,
  },
  onLaunch() {
    request.login()

    this.globalData.qqmapsdk = new QQMapWX({
      key: '申请的key'
    })

    // wx.getLocation({
    //   type: 'gcj02',
    //   isHighAccuracy: true,
    //   success:(res) => {
    //     console.info('getLocation: ', res)
    //     this.globalData.loc = {
    //       lat: res.latitude,
    //       lon: res.longitude
    //     }
    //   }
    // })
  },

})