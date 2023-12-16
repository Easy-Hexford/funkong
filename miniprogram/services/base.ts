import { SERVICE_NAME, SERVICE_ENV_ID, CLOUD_ENV_ID } from '../config'
import env from '../utils/env'

let _initCloud = false

class RequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestError'
  }
}

async function call(options: WechatMiniprogram.RequestOption) {
  if (!_initCloud) {
    wx.cloud.init({
      env: CLOUD_ENV_ID
    })
    _initCloud = true
  }
  
  const result = await wx.cloud.callContainer({
    config: {
      env: SERVICE_ENV_ID
    },
    path: options.url,
    method: options.method || 'GET',
    header: {
      "X-WX-SERVICE": SERVICE_NAME,
      "content-type": "application/json"
    },
    responseType: options.responseType || 'text',
    data: options.data || {}
  })
  
  if (env.kDebugMode || env.kTrialMode) {
    console.info(`云调用 ${options.url} 结果: `, result.data)
  }

  if (result.data.code != 0) {
    const code = result.data.code
    const message = result.data.message
    throw new RequestError(message)
  }
  
  return result.data.data

}

export default call