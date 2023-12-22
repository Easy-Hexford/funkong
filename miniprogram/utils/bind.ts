import type { IRegisterType, IUserInfo } from '../services/index'
import * as request from '../services/index'
import { queryStringToObject } from './util'

const CLUB_PROFILE_PAGE_PATH = 'pages/club-profile/index'
const ACTIVITY_DETAIL_PAGE_PATH = 'pages/activity-detail/index'
const landingPage = [CLUB_PROFILE_PAGE_PATH, ACTIVITY_DETAIL_PAGE_PATH]

export interface IPosterQuery {
  ClubId?: string,
  ActivityId?: string,
  RegisterClubId: string,
}

export interface IRegisterClubInfo {
  RegisterType: IRegisterType,
  RegisterInfo: {
    ClubId: string,
  }
}

const ValidRegisterTypes = ['ClubInvite', 'Normal']

export async function bindClubManager(User: IUserInfo) {
  const app = getApp()

  // 已注册
  if (ValidRegisterTypes.indexOf(User.RegisterType) >= 0) {
    return
  }

  const PlatformClubId = app.globalData.PlatformClubId
  const enterOption = wx.getEnterOptionsSync()
  const RegisterClubId = enterOption.query.RegisterClubId

  // 通过转发进入
  if (RegisterClubId) {
    await bindClub(RegisterClubId)
    return
  }

  // 通过海报进入
  const scene = enterOption.query.scene
  const isPosterPage = landingPage.indexOf(enterOption.path) >= 0
  if (isPosterPage && scene) {
    const posterQuery = await getPosterQuery(scene)
    if (posterQuery.RegisterClubId) {
      await bindClub(posterQuery.RegisterClubId)
      return
    }
  }

  bindPlatform(PlatformClubId)
}

export async function bindClub(RegisterClubId: string) {
  const app = getApp()

  // 需要放烟花特效
  app.globalData.DidRegisterClub = true

  // 更新用户信息
  await request.updateUser({
    RegisterType: 'ClubInvite',
    RegisterInfo: {
      ClubId: RegisterClubId
    }
  })

  console.info('bind Club ', RegisterClubId)

  // 同步最新用户信息
  await app.getLatestUser()
}

export async function bindPlatform(PlatformClubId: string) {
  const app = getApp()

  await request.updateUser({
    RegisterType: 'Normal',
    RegisterInfo: {
      ClubId: PlatformClubId
    }
  })

  console.info('bind PlatformClubId')

  // 刷新用户信息
  app.getLatestUser()
}

export async function getPosterQuery(scene: string): Promise<IPosterQuery> {
  const decodeScene = decodeURIComponent(scene)
  let posterQuery: IPosterQuery
  const resp = await request.getSceneValue({
    Scene: decodeScene
  })
  posterQuery = queryStringToObject(resp.Value) as IPosterQuery
  return posterQuery
}
