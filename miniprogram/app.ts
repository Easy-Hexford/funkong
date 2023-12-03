// app.ts
import { IAppOption } from '../typings'
import * as request from './services/index'

App<IAppOption>({
  globalData: {
    UserId: ''
  },
  async onLaunch() {
    const info = await request.login()
    const UserId = info.User.UserId
    this.globalData.UserId = UserId
  },

})