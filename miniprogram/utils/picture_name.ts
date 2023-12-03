const app = getApp()

export function random(min: number = 0, max: number = 10000) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function genPicName(path: string) {
  const UserId = app.globalData.UserId
  return `${path}${UserId}-${Date.now()}-${random()}.png`
}