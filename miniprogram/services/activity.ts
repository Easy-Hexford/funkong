import call from './base';
import { IClubInfo, ICoverUrls, IDeleteFlag, IUserInfo } from './user';

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

export function cancelActivity(req: ICancelActivityReq) {
  return call({
    url: '/activity/delete',
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
    url: '/activity/get_sign_up_list',
    method: 'POST',
    data: req
  })
}

export interface IGetActivitySignUpListReq {
  ActivityId: String,
  Offset: Number,
  Limit: Number,
}

export interface IActivitySignUpInfo {
  SignUpId: String,
  ActivityId: String,
  UserId: String,
  ActivitySignUpStatus: IActivityAuditStatus,
  User: ISimpleUserInfo
}

export interface IGetActivitySignUpListResp {
  ActivitySignUpList: Array<IActivitySignUpInfo>
  TotalCount: number
}

export function getActivitySignUpList(req: IGetActivitySignUpListReq): Promise<IGetActivitySignUpListResp> {
  return call({
    url: '/activity/get_activity_sign_up_list',
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

export interface IInsuranceProduct {
  ActivityType: string,
  InsuranceType: 'Free' | string,
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
  AuditStatus?: IActivityAuditStatus
  ActivityRule?: {
    MaxSignUpNumber: number,
    Price: number,
    InsuranceProduct?: IInsuranceProduct,
  }
}

export interface ICancelActivityReq {
  ActivityId: string,
  AuditStatus: IActivityAuditStatus
}

export interface ICreateActivityResp {
  ActivityId: string
}

export interface ICreateInsuranceReq {
  ActivityId: string
}

export type IActivityRefundType = 'RefundAll' | 'RefundHalf' | 'RefundNone'

export interface ISignUpctivityReq {
  ActivityId: string,
  ActivityRefundType: IActivityRefundType
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
  UseCache: boolean
}

export interface ISelfActivitySignup {
  SignUpId: string,
  PayTime: string,
  ActivityId: string,
  UserId: string,
  ActivitySignUpStatus: IActivitySignUpStatus,
  User: ISimpleUserInfo
  SignUpInfo: ISignUpInfo
}

export interface IGetActivityResp {
  Activity: IActivityInfo,
  SelfActivitySignUp?: ISelfActivitySignup
}

export type IActivityAuditStatus = 'AuditFail' | 'AuditSucc' | 'Auditing' | 'PlatformCancel' | 'SelfCancel'

export interface IGetActicityListReq {
  ClubId?: string,
  Province?: string,
  City?: string,
  Offset?: number,
  Limit?: number,
  AuditStatus?: IActivityAuditStatus | ''
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
  ActivityRule: IActivityRule,
  ActivitySignUpList: Array<ISignUpInfo>,
  SignUpNum: number,
  OwnerUser: ISimpleUserInfo,
  Club: IClubInfo
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: IDeleteFlag,
  AuditStatus: IActivityAuditStatus
}

export type IActivitySignUpTag = 'All' | 'Begin' | 'End'

export interface IGetSignUpActicityListReq {
  ActivitySignUpTag: IActivitySignUpTag,
  Offset: number,
  Limit: number
}

export interface IActivityRule {
  MaxSignUpNumber: number,
  Price: number,
  InsuranceProduct: IInsuranceProduct
}

export interface ISignUpInfo {
  ActivityRule: IActivityRule,
  User: IUserInfo,
  InsurancePrice: number,
  TotalPrice: number,
  InsuranceFailReason: string
  InsuranceRetryNum: number
}

export type IActivitySignUpStatus =
  | 'ToPay'
  | 'PayTimeout'
  | 'Paid'
  | 'InsuranceCreating'
  | 'InsuranceCreated'
  | 'InsuranceCreateFail'
  | 'Refunding'
  | 'Refund'
  | 'RefundError'

export interface ISignUpActicityInfo {
  SignUpId: string,
  ActivityId: string,
  UserId: string,
  ActivitySignUpStatus: IActivitySignUpStatus,
  OrderId: string,
  SignUpInfo: ISignUpInfo,
  PaidAmount: number,
  RefundAmount: number,
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: IDeleteFlag,
  DeleteTime: string,
  Activity: IActivityInfo
}

export interface IGetSignUpActicityListResp {
  ActivitySignUpList: Array<ISignUpActicityInfo>,
  TotalCount: number
}