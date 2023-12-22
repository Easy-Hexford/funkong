import type { IRegisterType, IUserInfo } from '../services/index'
import * as request from '../services/index'
import { queryStringToObject } from './util'

const app = getApp()
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

export async function bindClubManager(User: IUserInfo, PlatformClubId: string) {
  if (ValidRegisterTypes.indexOf(User.RegisterType) >= 0) {
    return
  }

  const enterOption = wx.getEnterOptionsSync()

  const RegisterClubId = enterOption.query.RegisterClubId

  // 通过转发进入
  if (RegisterClubId) {
    await bindClub(RegisterClubId, PlatformClubId)
    return
  }

  // 通过海报进入
  const scene = enterOption.query.scene
  const isPosterPage = landingPage.indexOf(enterOption.path) >= 0
  if (isPosterPage && scene) {
    const posterQuery = await getPosterQuery(scene)
    await bindClub(posterQuery.RegisterClubId, PlatformClubId)
    return
  }

  bindPlatform(PlatformClubId)
}

export async function bindClub(RegisterClubId: string, PlatformClubId: string) {
  const RegisterType: IRegisterType = RegisterClubId ? 'ClubInvite' : 'Normal'
  await request.updateUser({
    RegisterType,
    RegisterInfo: {
      ClubId: RegisterClubId ?? PlatformClubId
    }
  })

  // 烟花特效


  // 刷新用户信息
  app.getLatestUser()
}

export async function bindPlatform(PlatformClubId: string) {
  await request.updateUser({
    RegisterType: 'Normal',
    RegisterInfo: {
      ClubId: PlatformClubId
    }
  })

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
