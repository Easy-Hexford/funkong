import call from './base';
import { ICreateClubResp } from './club';
import { IClubInfo, ICoverUrls, IDeleteFlag } from './user';

export function createActivity(req: ICreateActivityReq): Promise<ICreateClubResp> {
  return call({
    url: '/activity/create',
    method: 'POST',
    data: req,
  })
}

export function signUpctivity(req: ISignUpctivityReq): Promise<ISignUpctivityResp> {
  return call({
    url: '/activity/create_sign_up',
    method: 'POST',
    data: req,
  })
}

export function getActicityList(req: IGetActicityListReq): Promise<IGetActicityListResp> {
  return call({
    url: '/activity/get_list',
    method: 'POST',
    data: req
  })
}

export function getSignActicityList(req: IGetSignUpActicityListReq): Promise<IGetSignUpActicityListResp> {
  return call({
    url: '/aactivity/get_sign_up_list',
    method: 'POST',
    data: req
  })
}

export type ILocationType = 'gcj02' | 'wgs84'

export interface IActivityTypes {
  Items: Array<string>
}

export interface ICreateActivityReq {
  ClubId: string,
  Title: string,
  Content: string,
  CoverUrls: ICoverUrls,
  ActivityTypes: IActivityTypes,
  BeginTime: string,
  EndTime: string,
  PicList?: {
    Items: Array<string>
  },
  Province: string,
  City: string,
  LocationType?: ILocationType,
  Location: {
    lat: number,
    lon: number
  },
  LocationName: string,
  ActivityRule?: {
    MaxSignUpNumber?: number,
    Price?: number,
  }
}

export interface ICreateActivityResp {
  ActivityId: string
}

export interface ISignUpctivityReq {
  ActivityId: string
}

export interface ISignUpctivityResp {
  SignUpId: string,
  PrepayId: string,
  Payment: {
    appId: string,
    timeStamp: string,
    nonceStr: string,
    package: string,
    signType: string,
    paySign: string
  }
}
export type IActivityAuditStatus = 'AuditFail' | 'AuditSucc' | 'Auditing'

export interface IGetActicityListReq {
  ClubId?: string,
  Province?: string,
  City?: string,
  Offset?: number,
  Limit?: number,
  AuditStatus?: IActivityAuditStatus
}

export interface IGetActicityListResp {
  ActivityList: Array<IActivityInfo>,
  TotalCount: number,
}

export interface IActivityInfo {
  ActivityId: string,
  UserId: string,
  CoverUrls?: ICoverUrls,
  ClubId: string,
  Province: string,
  City: string,
  Title: string,
  Content: string,
  ActivityTypes: IActivityTypes,
  BeginTime: string,
  EndTime: string,
  PicList: {
    Items: Array<string>
  },
  Location: {
    lat: number,
    lon: number
  },
  LocationName: string,
  ActivityRule: {
    MaxSignUpNumber: number,
    Price: number,
    InsuranceProduct: {
      ActivityType: string,
      InsuranceType: string,
      InsuranceProductId: string,
      EarlyBirdPrice: number,
      NormalPrice: number
    }
  },
  ActivitySignUp: any,
  SignUpNum: number,
  OwnerUser: {
    UserId: string,
    OpenId: string,
    NickName: string,
    Icon: string,
  },
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: IDeleteFlag,
  AuditStatus: IActivityAuditStatus,
  Club: IClubInfo
}

export type IActivitySignUpTag = 'All' | 'Begin' | 'End'

export interface IGetSignUpActicityListReq {
  ActivitySignUpTag: IActivitySignUpTag,
  Offset: 0,
  Limit: 0
}

export interface ISignUpActicityInfo {
  SignUpId: string,
  ActivityId: string,
  UserId: string,
  ActivitySignUpStatus: string,
  OrderId: string,
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: IDeleteFlag,
  DeleteTime: string,
  Activity: IActivityInfo
}

export interface IGetSignUpActicityListResp {
  ActivitySignUp: Array<ISignUpActicityInfo>,
  TotalCount: number
}