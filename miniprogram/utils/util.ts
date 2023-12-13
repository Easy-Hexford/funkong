import dayjs from 'dayjs'

export const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}

const formatNumber = (n: number) => {
  const s = n.toString()
  return s[1] ? s : '0' + s
}

export const WeekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const formatActivityTime = (time: string): string => {
  const t = dayjs(time)
  const week = WeekNames[t.day()]
  const date = t.format('MM月DD日')
  return `${week} ${date}`
}

export const formatDistance = (distance: number) => {
  return (distance / 1000).toFixed(2) + '公里'
}