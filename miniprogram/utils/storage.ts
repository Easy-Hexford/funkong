const storage = {
  set: (key, val) => {
    wx.setStorage({
      key,
      data: val
    })
  },

  get: (key) => {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success(res) {
          resolve(res.data)
        },
        fail(res) {
          reject()
        }
      })
    })
  },

  setSync: (key, val) => {
    wx.setStorageSync(key, val)
  },

  getSync: (key) => {
    return wx.getStorageSync(key)
  }
}

export default storage