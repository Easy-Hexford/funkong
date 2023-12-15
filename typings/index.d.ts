/// <reference path="./types/index.d.ts" />

import { IClubInfo, IInsuranceProduct, IPoint, IRegisterType, IUserInfo } from "../miniprogram/services";

interface IApp {
  globalData: {
    Loc: IPoint
    User: IUserInfo,
    Club: IClubInfo
    InsuranceProductList: Array<IInsuranceProduct>
    SystemInfo: WechatMiniprogram.SystemInfo,
    AccountInfo: WechatMiniprogram.AccountInfo
  }
}

declare global {

}

