import type { IRegisterType, IUserInfo } from '../services/index'
import * as request from '../services/index'
import { queryStringToObject } from './util'

const app = getApp()
const CLUB_PROFILE_PAGE_PATH = 'pages/club-profile/index'
const ACTIVITY_DETAIL_PAGE_PATH = 'pages/activity-detail/index'
const landingPage = [CLUB_PROFILE_PAGE_PATH, ACTIVITY_DETAIL_PAGE_PATH]

export interface IPosterQuery {
  ClubId: string,
  ActivityId: string,
  RegisterType: IRegisterType
}

export interface IRegisterClubInfo {
  RegisterType: string,
  RegisterInfo: {
    ClubId: string,
    ActivityId: string
  }
}

export async function bindClubManager(User: IUserInfo, PlatformClubId: string) {
  const enterOption = wx.getEnterOptionsSync()
  if (User.RegisterType) {
    return
  }

  // 非落地页首次打开，绑定为平台流量
  if (landingPage.indexOf(enterOption.path) < 0) {
    await bindPlatform(PlatformClubId)
    return
  }

  const queryScene = enterOption.query.scene

  // 落地页首次打开，非扫海报进入
  if (!queryScene) {
    await bindPlatform(PlatformClubId)
    return
  }

  // 落地页首次打开，扫海报进入，绑定主理人
  const posterQuery = await getPosterQuery(queryScene)
  if (posterQuery.ClubId) {
    await bindClub(posterQuery)
  }
}

async function bindClub(posterQuery: IPosterQuery) {
  await request.updateUser({
    RegisterType: posterQuery.RegisterType,
    RegisterInfo: {
      ClubId: posterQuery.ClubId,
      ActivityId: posterQuery.ActivityId
    }
  })

  wx.showToast({
    icon: 'success',
    title: '已加入'
  })

  // 刷新用户信息
  app.getLatestUser()
}

async function bindPlatform(PlatformClubId: string) {
  await request.updateUser({
    RegisterType: 'Normal',
    RegisterInfo: {
      ClubId: PlatformClubId,
      ActivityId: ''
    }
  })

  // 刷新用户信息
  app.getLatestUser()
}

export async function getPosterQuery(scene: string): Promise<IPosterQuery> {
  const decodeScene = decodeURIComponent(scene)
  const resp = await request.getSceneValue({
    Scene: decodeScene
  })
  const posterQuery = queryStringToObject(resp.Value) as IPosterQuery
  return posterQuery
}