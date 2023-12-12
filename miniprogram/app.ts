// app.ts
import { IAppOption } from '../typings';
import * as request from './services/index'
import { IClubInfo, IInsuranceProduct, IUserInfo } from './services/index';

const QQMapWX = require('./libs/qqmap-wx-jssdk.min.js');

App<IAppOption>({
  globalData: {
    qqmapsdk: null,
    User: <IUserInfo>{},
    Club: <IClubInfo>{},
    InsuranceProductList: <Array<IInsuranceProduct>>[],
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