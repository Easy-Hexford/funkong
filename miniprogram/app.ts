// app.ts
import * as request from './services/index'
import { IClubInfo, IGetUserResp, IInsuranceProduct, IPoint, IUserInfo } from './services/index';
import env from './utils/env'
import { bindClubManager } from './utils/bind'
import { forceUpdate } from './utils/update_manager'

App({
  globalData: {
    PlatformClubId: '',
    Loc: <IPoint>{},
    User: <IUserInfo>{},
    Club: <IClubInfo>{},
    InsuranceProductList: <Array<IInsuranceProduct>>[],
    SystemInfo: <WechatMiniprogram.SystemInfo>{},
    DidRegisterClub: false
  },
  async onLaunch() {
    forceUpdate()

    this.listenError()
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.SystemInfo = res
      }
    })

    request.login().then(resp => {
      this.globalData.PlatformClubId = resp.PlatformClubId
      this.getUser().then(resp => {
        bindClubManager(resp.User)
      })
    })
  },

  listenError() {
    // @ts-ignore
    wx.onError((e: Error) => {
      if (env.kDebugMode || env.kTrialMode) {
        wx.showModal({
          title: e.message,
          content: e.stack,
          showCancel: false
        })
      }
    })

    wx.onUnhandledRejection(e => {
      if (env.kDebugMode || env.kTrialMode) {
        wx.showModal({
          content: e.reason,
          showCancel: false
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

  async getLatestUser(): Promise<IGetUserResp> {
    const resp = await request.getUser({
      UseCache: false
    })
    this.globalData.User = resp.User
    this.globalData.Club = resp.Club
    console.info('app getLatestUser ', resp.User)
    return resp
  }
})