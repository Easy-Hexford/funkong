class _Env {
  accountInfo: WechatMiniprogram.AccountInfo

  constructor() {
    this.accountInfo = wx.getAccountInfoSync()
  }

  get appid() {
    return this.accountInfo.miniProgram.appId
  }

  get version() {
    return this.accountInfo.miniProgram.version
  }

  get envVersion() {
    return this.accountInfo.miniProgram.envVersion
  }

  get kDebugMode() {
    return this.accountInfo.miniProgram.envVersion === 'develop'
  }

  get kTrialMode() {
    return this.accountInfo.miniProgram.envVersion === 'trial'
  }

  get kReleaseMode() {
    return this.accountInfo.miniProgram.envVersion === 'release'
  }
}

const env = new _Env()

export default env