/// <reference path="./types/index.d.ts" />

import { IClubInfo, IInsuranceProduct, IUserInfo } from "../miniprogram/services";

interface IAppOption {
  globalData: {
    qqmapsdk: any,
    User: IUserInfo,
    Club: IClubInfo
    InsuranceProductList: Array<IInsuranceProduct>
  }
}