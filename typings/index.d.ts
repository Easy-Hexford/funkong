/// <reference path="./types/index.d.ts" />

import { IClubInfo, IInsuranceProduct, IPoint, IUserInfo } from "../miniprogram/services";

interface IAppOption {
  globalData: {
    User: IUserInfo,
    Club: IClubInfo
    InsuranceProductList: Array<IInsuranceProduct>
    Loc: IPoint
  }
}