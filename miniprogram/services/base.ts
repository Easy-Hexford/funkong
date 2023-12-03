import { SERVICE_NAME, SERVICE_ENV_ID, CLOUD_ENV_ID } from '../config'

let _initCloud = false

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
    data: options.data || {}
  })
  console.info(`云调用 ${options.url} 结果: `, result.data)
  return result.data.data
}

export default call