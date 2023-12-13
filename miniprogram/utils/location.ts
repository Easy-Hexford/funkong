import { MAP_KEY } from '../config'
import { IPoint } from '../services'

const BASE_URL = 'https://apis.map.qq.com/ws'

export interface IGetAddressResp {
  address_component: {
    nation: string,
    province: string,
    city: string,
    district: string,
    street: string,
    street_number: string
  },
  ad_info: {
    nation_code: string,
    adcode: string,
    city_code: string,
    phone_area_code: string,
    name: string,
    nation: string,
    province: string,
    city: string,
    district: string,
  }
}

const createUrl = (path: string, params: Record<string, any>): string => {
  const query = Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
  return `${BASE_URL}/${path}/?${query}`
}

export function getAddress(point: IPoint): Promise<IGetAddressResp> {
  const url = createUrl('geocoder/v1', {
    key: MAP_KEY,
    location: `${point.lat},${point.lon}`
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success: (res: any) => {
        if (res.data.status === 0) {
          resolve(res.data.result)
        } else {
          reject(new Error(`status=${res.data.status}, message=${res.data.result}`))
        }
      },
      fail: (res: any) => {
        reject(new Error(`getAddress fail: ${res}`))
      }
    })
  })
}

export interface ICalcDistanceResp {
  distance: number,
  duration: number
}

export function calcDistance(from: IPoint, to: IPoint): Promise<ICalcDistanceResp> {
  const url = createUrl('distance/v1/matrix', {
    key: MAP_KEY,
    from: `${from.lat},${from.lon}`,
    to: `${to.lat},${to.lon}`,
    mode: 'driving'
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success: (res: any) => {
        if (res.data.status === 0) {
          resolve(res.data.result.rows[0].elements[0])
        } else {
          reject(new Error(`status=${res.data.status}, message=${res.data.result}`))
        }
      },
      fail: (res: any) => {
        reject(new Error(`getAddress fail: ${res}`))
      }
    })

  })
}

