// app.ts
import * as request from './services/index'
import { IClubInfo, IInsuranceProduct, IPoint, IUserInfo } from './services/index';
import env from './utils/env'
import { bindClubManager } from './utils/bind'

App({
  globalData: {
    PlatformClubId: '',
    Loc: <IPoint>{},
    User: <IUserInfo>{},
    Club: <IClubInfo>{},
    InsuranceProductList: <Array<IInsuranceProduct>>[],
    SystemInfo: <WechatMiniprogram.SystemInfo>{},
  },
  async onLaunch() {
    wx.getSystemInfo({
      success:(res) => {
        this.globalData.SystemInfo = res
      }
    })

    this.listenError()

    const _lResp = await request.login()
    this.globalData.PlatformClubId = _lResp.PlatformClubId
    const User = await this.getUser()
    bindClubManager(User, _lResp.PlatformClubId)
  },

  listenError() {
    // @ts-ignore
    wx.onError((e: Error) => {
      if (env.kDebugMode) {
        wx.showModal({
          title: e.message,
          content: e.stack
        })
      }
    })

    wx.onUnhandledRejection(e => {
      if (env.kDebugMode) {
        wx.showModal({
          content: e.reason,
        })
      }
    })
  },

  

  async getUser(): Promise<IUserInfo> {
    if (this.globalData.User.UserId) {
      return this.globalData.User
    }
    return this.updateUser()
  },

  async updateUser(): Promise<IUserInfo>  {
    const resp = await request.getUser({
      UseCache: false
    })
    this.globalData.User = resp.User
    return resp.User
  }
})