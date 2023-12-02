import call from "./base";
import { IClubInfo } from "./user";

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

export interface ICreateClubReq {
  ClubType: string,
  ClubName: string,
  ClubIcon: string,
  City: string
}

export interface ICreateClubResp {
  ClubId: string
}

export interface IFollowClubReq {
  ClubId: string,
  Status: string,
}

export interface IGetClubReq {
  ClubType: string,
  ClubId: string
}

export interface IGetClubResp {
  CLub: IClubInfo
}

export interface IUpdateClubInfoReq {
  ClubType?: string,
  ClubId?: string,
  ClubName?: string,
  ClubIcon?: string,
  City?: string,
  DeleteFlag?: string
}
