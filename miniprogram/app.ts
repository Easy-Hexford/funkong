// app.ts
import * as request from './services/index'
import { IClubInfo, IGetUserResp, IInsuranceProduct, IPoint, IUserInfo } from './services/index';
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
    const resp = await this.getUser()
    bindClubManager(resp.User, _lResp.PlatformClubId)
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

  async getUser(): Promise<IGetUserResp> {
    if (this.globalData.User.UserId) {
      return {
        User: this.globalData.User,
        Club: this.globalData.Club
      }
    }
    return this.getLatestUser()
  },

  async getLatestUser(): Promise<IGetUserResp>  {
    const resp = await request.getUser({
      UseCache: false
    })
    this.globalData.User = resp.User
    this.globalData.Club = resp.Club
    return resp
  }
})