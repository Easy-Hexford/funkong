import call from './base';
import { IClubInfo, ICoverUrls, IDeleteFlag } from './user';

export function createActivity(req: ICreateActivityReq): Promise<ICreateActivityResp> {
  return call({
    url: '/activity/create',
    method: 'POST',
    data: req,
  })
}

export function updateActivity(req: IUpdateActivityReq) {
  return call({
    url: '/activity/update',
    method: 'POST',
    data: req
  })
}

export function createInsurance(req: ICreateInsuranceReq): Promise<void> {
  return call({
    url: '/activity/create_insurance',
    method: 'POST',
    data: req,
  })
}

export function createSignUpActivity(req: ISignUpctivityReq): Promise<ISignUpctivityResp> {
  return call({
    url: '/activity/create_sign_up',
    method: 'POST',
    data: req,
  })
}

export function deleteSignUpActivity(req: ISignUpctivityReq) {
  return call({
    url: '/activity/delete_sign_up',
    method: 'POST',
    data: req
  })
}

export function exitActivity(req: IExitctivityReq): Promise<void> {
  return call({
    url: '/activity/delete_sign_up',
    method: 'POST',
    data: req
  })
}

export function getActivity(req: IGetActivityReq): Promise<IGetActivityResp> {
  return call({
    url: '/activity/get',
    method: 'POST',
    data: req
  })
}

export function getInsuranceProductList(): Promise<IGetInsuranceProductListResp> {
  return call({
    url: '/activity/get_insurance_product_list',
    method: 'POST',
  })
}

export function getActicityList(req: IGetActicityListReq): Promise<IGetMineActicityListResp> {
  return call({
    url: '/activity/get_list',
    method: 'POST',
    data: req
  })
}

export function getPulicActivityList(req: IGetPublicActivityListReq): Promise<IGetPublicActivityListResp> {
  return call({
    url: '/activity/get_public_list',
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

export interface IPoint {
  lat: number,
  lon: number
}

export interface ILocation {
  Name: string,
  Address: string,
  LocationType: ILocationType,
  Point: IPoint
}

export type ILocationType = 'gcj02' | 'wgs84'

export interface IActivityTypes {
  Items: Array<string>
}

export interface IActivityPicList {
  Items: Array<string>
}

export interface ISimpleUserInfo {
  UserId: string,
  OpenId: string,
  NickName: string,
  Icon: string
}

export interface ISignUpInfo {
  SignUpId: string,
  ActivityId: string,
  UserId: string,
  ActivitySignUpStatus: string,
  User: ISimpleUserInfo
}

export interface IInsuranceProduct {
  ActivityType: string,
  InsuranceType: string,
  InsuranceProductId: string,
  NormalPrice: number,
  BeginAge: number,
  EndAge: number,
  DeathCompensation: number,
  HospitalizationCosts: number,
  HospitalizationAllowance: number,
  HospitalizationTimeLimit: number
}

export interface IWxPaymentParams {
  appId: string,
  timeStamp: string,
  nonceStr: string,
  package: string,
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA' | undefined,
  paySign: string
}

export interface ICreateActivityReq {
  ClubId: string,
  Province: string,
  City: string,
  Title: string,
  Content: string,
  CoverUrls?: ICoverUrls,
  ActivityTypes: IActivityTypes,
  BeginTime: string,
  EndTime: string,
  PicList?: IActivityPicList,
  Location: ILocation,
  ActivityRule: {
    MaxSignUpNumber: number,
    Price: number,
  }
}

export interface IUpdateActivityReq {
  ActivityId: string,
  Province?: string,
  City?: string,
  Title?: string,
  Content?: string,
  CoverUrls?: ICoverUrls,
  ActivityTypes?: IActivityTypes,
  BeginTime?: string,
  EndTime?: string,
  PicList?: IActivityPicList,
  Location?: ILocation,
  ActivityRule?: {
    MaxSignUpNumber: number,
    Price: number,
    InsuranceProduct?: IInsuranceProduct,
  }
}

export interface ICreateActivityResp {
  ActivityId: string
}

export interface ICreateInsuranceReq {
  ActivityId: string
}

export interface ISignUpctivityReq {
  ActivityId: string
}

export interface ISignUpctivityResp {
  SignUpId: string,
  PrepayId: string,
  Payment: IWxPaymentParams
}

export interface IExitctivityReq {
  ActivityId: string
}

export interface IGetActivityReq {
  ActivityId: string
}

export interface IGetActivityResp {
  Activity: IActivityInfo
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

export interface IGetInsuranceProductListResp {
  InsuranceProducts: Array<IInsuranceProduct>
}

export interface IGetMineActicityListResp {
  ActivityList: Array<IActivityInfo>,
  TotalCount: number,
}

export interface IGetPublicActivityListReq {
  Province?: string,
  City?: string,
  Offset?: number,
  Limit?: number,
}

export interface IGetPublicActivityListResp {
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
  PicList: IActivityPicList,
  Location: ILocation,
  ActivityRule: {
    Price: number,
    MaxSignUpNumber: number,
    InsuranceProduct: IInsuranceProduct,
  },
  ActivitySignUpList: Array<ISignUpInfo>,
  SignUpNum: number,
  OwnerUser: ISimpleUserInfo,
  Club: IClubInfo
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: IDeleteFlag,
  AuditStatus: IActivityAuditStatus,
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