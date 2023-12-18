// app.ts
import * as request from './services/index'
import { IClubInfo, IGetUserResp, IInsuranceProduct, IPoint, IUserInfo } from './services/index';
import env from './utils/env'
import { bindClubManager } from './utils/bind'
import {forceUpdate} from './utils/update_manager'

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
    forceUpdate()
    
    this.listenError()
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.SystemInfo = res
      }
    })

    request.login().then(resp => {
      this.globalData.PlatformClubId = resp.PlatformClubId
      this.bindClubManagerIfNeeded()
    })
  },

  async bindClubManagerIfNeeded() {
    const resp = await this.getUser()
    const PlatformClubId = this.globalData.PlatformClubId
    bindClubManager(resp.User, PlatformClubId)
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
    return resp
  }
})