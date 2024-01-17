import { ISimpleUserInfo } from "./activity";
import call from "./base";
import type { IClubInfo, IClubType, ICoverUrls, IDeleteFlag } from "./user";

export function createClub(req: ICreateClubReq): Promise<ICreateClubResp> {
  return call({
    url: '/club/create',
    method: 'POST',
    data: req
  })
}

export function followClub(req: IFollowClubReq) {
  return call({
    url: '/club/fan/create',
    method: 'POST',
    data: req
  })
}

export function getClub(req: IGetClubReq): Promise<IGetClubResp> {
  return call({
    url: '/club/get',
    method: 'POST',
    data: req
  })
}


export function updateClub(req: IUpdateClubInfoReq) {
  return call({
    url: '/club/update',
    method: 'POST',
    data: req
  })
}

export type IClubAuditStatus = 'AuditFail' | 'AuditSucc' | 'Auditing'

export interface ICreateClubReq {
  ClubType: IClubType,
  ClubName: string,
  ClubIcon: string,
  ClubDesc: string,
  CoverUrls?: ICoverUrls,
  Province: string,
  City: string,
}

export interface ICreateClubResp {
  ClubId: string
}

export interface IFollowClubReq {
  ClubId: string,
  Status: string,
}

export interface IGetClubReq {
  ClubId: string
}

export interface IGetClubResp {
  Club: IClubInfo,
  OwnerUser: ISimpleUserInfo
}

export interface IUpdateClubInfoReq {
  ClubType?: IClubType,
  ClubId?: string,
  ClubName?: string,
  ClubIcon?: string,
  ClubDesc?: string,
  Province?: string,
  City?: string,
  CoverUrls?: ICoverUrls,
  DeleteFlag?: IDeleteFlag
  AuditStatus?: IClubAuditStatus
}
