// app.ts
import * as request from './services/index'

App({
  globalData: {
    User: {},
    Club: {},

  },
  onLaunch() {
    request.login()
  },

})