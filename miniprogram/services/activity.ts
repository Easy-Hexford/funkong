import call from './base';
import { ICreateClubReq, ICreateClubResp } from './club';

export function createActivity(req: ICreateClubReq): Promise<ICreateClubResp> {
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

export interface ICreateActivityReq {
  ClubId: string,
  Title: string,
  Content: string,
  ActivityType: string,
  BeginTime: string,
  EndTime: string,
  PicList?: {
    PicUrls: Array<string>
  },
  Province: string,
  City: string,
  Location?: {
    lat: number,
    lon: number
  },
  LocationName: string,
  ActivityRule?: {
    MaxSiguUpNumber?: number,
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

export type IAuditStatus = 'AuditFail' | 'AuditSucc' | 'Auditing'

export interface IGetActicityListReq {
  ClubId: string,
  City: string,
  Offset: 0,
  Limit: 0,
  AuditStatus: IAuditStatus
}

export interface IGetActicityListResp {
  ActivityList: Array<IActivityInfo>,
  TotalCount: number,
}

export interface IActivityInfo {
  ActivityId: string,
  UserId: string,
  ClubId: string,
  Province: string,
  City: string,
  Title: string,
  Content: string,
  ActivityType: string,
  BeginTime: string,
  EndTime: string,
  PicList: {
    PicUrls: Array<string>
  },
  Location: {
    lat: number,
    lon: number
  },
  LocationName: string,
  ActivityRule: {
    MaxSiguUpNumber: number,
    Price: number,
  },
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: string,
  AuditStatus: string,
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
  DeleteFlag: string,
  DeleteTime: string,
  Activity: IActivityInfo
}

export interface IGetSignUpActicityListResp {
  ActivitySignUp: Array<ISignUpActicityInfo>,
  TotalCount: number
}