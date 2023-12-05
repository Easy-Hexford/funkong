// app.ts
import * as request from './services/index'

App({
  globalData: {
    User: {
      CoverUrls: {
        Items: []
      }
    },
    Club: {
      CoverUrls: {
        Items: []
      }
    },

  },
  onLaunch() {
    request.login()
  },

})