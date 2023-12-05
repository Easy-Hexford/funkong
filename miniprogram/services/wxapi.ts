import call from './base'

export type IEnvVersion = 'develop' | 'trial' | 'release'

export function getWxaCode(req: IGetWxaCodeReq): Promise<IGetWxaCodeResp> {
  return call({
    url: '/wxa_api/getwxacodeunlimit',
    method: 'POST',
    data: req,
  })
}

export interface IGetWxaCodeReq {
  // 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符
  scene: string,
  path?: string,
  check_path?: boolean,
  env_version: IEnvVersion,
  width?: number,
  is_hyaline?: boolean
}

export interface IGetWxaCodeResp {
  buffer: string
}