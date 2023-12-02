let _initCloud = false

async function call(options: WechatMiniprogram.RequestOption) {
  if (!_initCloud) {
    wx.cloud.init({
      env: 'release-5g0ny7l2324d3b5b'
    })
    _initCloud = true
  }
  
  const result = await wx.cloud.callContainer({
    config: {
      env: 'prod-1gsl7u0x17e23d06'
    },
    path: options.url,
    method: options.method || 'GET',
    header: {
      "X-WX-SERVICE": "golang-dpux",
      "content-type": "application/json"
  },
    data: options.data || {}
  })
  console.info(`云调用 ${options.url} 结果: `, result.data)
  return result.data.data
}

export default call