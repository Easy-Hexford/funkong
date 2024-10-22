import call from './base'
import { IClubAuditStatus } from './club'

export function login(): Promise<ILoginResp> {
  return call({
    url: '/user/login',
    method: 'POST'
  })
}

export function getUser(req: IGetUserReq): Promise<IGetUserResp> {
  return call({
    url: '/user/get',
    method: 'POST',
    data: req
  })
}

export function updateUser(req: IUpdateUserReq) {
  return call({
    url: '/user/update',
    method: 'POST',
    data: req
  })
}

export interface IGetInviteListReq {
  ClubId: string,
  Offset: number,
  Limit: number
}

export function getInviteList(req: IGetInviteListReq): Promise<IGetInviteListResp> {
  return call({
    url: '/user/get_invite_list',
    method: 'POST',
    data: req
  })
}

export function sendVerifyCode(req: ISendVerifyCodeReq) {
  return call({
    url: '/user/send_verify_code',
    method: 'POST',
    data: req
  })
}

export type IRegisterType = 'ClubInvite' | 'Normal' | ''

export type IRole = 'NormalRole' | 'SuperRole'

export type IGender = 'Man' | 'Woman' | 'Unknown' | ''

export type IIDCardType = 'ShenFenZheng' | 'HuZhao' | 'GangAoShenFenZheng'

export type IClubType = 'NormalClub' | 'SpecialClub'

export type IAuditRole = 'NormalAuditRole' | 'UnknownAuditRole'

export type IDeleteFlag = 'Deleted' | 'Exist'

export interface IUserInfo {
  UserId: string,
  OpenId: string,
  NickName: string,
  CoverUrls: ICoverUrls,
  Icon: string,
  Gender: IGender,
  Role: IRole,
  RegisterType: IRegisterType,
  RegisterInfo: {
    ClubId: string,
    ActivityId: string
  },
  InvitedClubId: string,
  Phone: string,
  Name: string,
  IdCardType: IIDCardType,
  IdCardNo: string,
  BirthdayDate: string,
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: IDeleteFlag
  AuditRole: IAuditRole,
}

export interface IUserInfoNullable {
  CoverUrls?: ICoverUrls,
  Icon?: string,
  NickName?: string,
  Gender?: IGender,
  Phone?: string,
  Name?: string,
  IdCardType?: IIDCardType,
  IdCardNo?: string,
  BirthdayDate?: string,
  CreateTime?: string,
}

export interface ILoginResp {
  PlatformClubId: string
}

export interface IClubInfo {
  ClubId: string,
  ClubType: IClubType,
  ClubName: string,
  ClubIcon: string,
  ClubDesc: string,
  CoverUrls: ICoverUrls,
  Province: string,
  City: string,
  OwnerUserId: string,
  AuditStatus: IClubAuditStatus
  CreateTime: string,
  UpdateTime: string,
  DeleteFlag: IDeleteFlag
}

export interface IClubInfoNullable {
  ClubType?: IClubType,
  ClubName?: string,
  ClubDesc?: string,
  ClubIcon?: string,
  CoverUrls?: ICoverUrls,
  Province?: string,
  City?: string,
}

export interface IGetUserReq {
  UseCache?: boolean
}

export interface IGetUserResp {
  User: IUserInfo,
  Club: IClubInfo
}

export interface ICoverUrls {
  Items: Array<string>
}

export interface IUpdateUserReq {
  RegisterType?: IRegisterType,
  RegisterInfo?: {
    ClubId?: string,
    ActivityId?: string
  },
  OpenId?: string,
  NickName?: string,
  CoverUrls?: ICoverUrls,
  Icon?: string,
  Gender?: IGender,
  Role?: IRole,
  Phone?: string,
  PhoneCode?: string,
  PhoneCountryCode?: string,
  Name?: string,
  IdCardType?: IIDCardType,
  IdCardNo?: string,
  BirthdayDate?: string,
  CreateTime?: string,
  UpdateTime?: string,
  DeleteFlag?: IDeleteFlag
  AuditRole?: IAuditRole,
}

export interface IGetInviteListResp {
  UserList: Array<IUserInfo>,
  TotalCount: number
}

export interface ISendVerifyCodeReq {
  Phone: string,
}
