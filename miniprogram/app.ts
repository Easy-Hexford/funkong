// app.ts
import * as request from './services/index'

App<IAppOption>({
  globalData: {},
  onLaunch() {
    request.login()
  },

})