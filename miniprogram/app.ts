// app.ts
import { IAppOption } from '../typings';
import * as request from './services/index'
import { IClubInfo, IInsuranceProduct, IPoint, IUserInfo } from './services/index';

App<IAppOption>({
  globalData: {
    Loc: <IPoint>{},
    User: <IUserInfo>{},
    Club: <IClubInfo>{},
    InsuranceProductList: <Array<IInsuranceProduct>>[],
  },
  onLaunch() {
    request.login()
  },

})