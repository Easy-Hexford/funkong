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
    dataType: options.dataType || 'json',
    responseType: options.responseType || 'text',
    header: {
      'X-WX-SERVICE': 'golang-dpux-043',
    },
    data: options.data || {}
  })
  return result.data
}

export default call