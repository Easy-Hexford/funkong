/// <reference path="./types/index.d.ts" />

import { IClubInfo, IUserInfo } from "../miniprogram/services";

interface IAppOption {
  globalData: {
    User: IUserInfo,
    Club: IClubInfo
  }
}