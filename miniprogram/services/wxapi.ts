import call from './base'

export type IEnvVersion = 'develop' | 'trial' | 'release'

export function getWxaCode(req: IGetWxaCodeReq): Promise<IGetWxaCodeResp> {
  return call({
    url: '/wxa_api/getwxacodeunlimit',
    method: 'POST',
    data: req,
  })
}

export function setSceneValue(req: ISetSceneValueReq): Promise<ISetSceneValueResp> {
  return call({
    url: '/wxa_api/setscenevalue',
    method: 'POST',
    data: req
  })
}

export function getSceneValue(req: IGetSceneValueReq): Promise<IGetSceneValueResp> {
  return call({
    url: '/wxa_api/getscenevalue',
    method: 'POST',
    data: req
  })
}

export interface IGetWxaCodeReq {
  // 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符
  scene: string,
  page?: string,
  check_path?: boolean,
  env_version: IEnvVersion,
  width?: number,
  is_hyaline?: boolean
}

export interface IGetWxaCodeResp {
  buffer: string
}

export interface ISetSceneValueReq {
  Value: string,
  ExpireSeconds: number
}

export interface ISetSceneValueResp {
  Scene: string
}

export interface IGetSceneValueReq {
  Scene: string
}

export interface IGetSceneValueResp {
  Value: string
}