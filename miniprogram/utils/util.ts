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

export function compareVersion(version1: string, version2: string) {
  const v1 = version1.split('.')
  const v2 = version2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

export function isValidChineseIDCard(idCard: string) {
  // 正则表达式验证
  const regExp = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!regExp.test(idCard)) {
    return false
  }

  // 校验算法
  const idCardLength = idCard.length
  if (idCardLength === 18) {
    const idCardWi = [
      7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2
    ]
    const idCardY = [
      1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2
    ]
    let idCardWiSum = 0
    for (let i = 0; i < 17; i++) {
      idCardWiSum += parseInt(idCard.substring(i, i + 1), 10) * idCardWi[i]
    }
    const idCardMod = idCardWiSum % 11
    const idCardLast = idCard.substring(17)
    if (idCardY[idCardMod] !== parseInt(idCardLast, 10) && (idCardY[idCardMod] !== 10 || idCardLast.toUpperCase() !== 'X')) {
      return false
    }
  }
  return true
}

export function extractBirthdateFromIDCard(idCard: string) {
  const birthdateStr = idCard.slice(6, 14)
  const year = birthdateStr.slice(0, 4)
  const month = birthdateStr.slice(4, 6)
  const day = birthdateStr.slice(6, 8)
  return `${year}-${month}-${day} 00:00:00`
}

export function extractGenderFromIDCard(idCard: string) {
  const genderDigit = parseInt(idCard.slice(-2, -1))
  return genderDigit % 2 === 0 ? 'Woman' : 'Man'
}

export function isValidPassport(passportNumber: string) {
  const regExp = /^[GgEePpSsDd]\d{8}$/
  return regExp.test(passportNumber)
}

export function isValidHKMCPassport(passportNumber: string) {
  const regExp = /^[HMhm]{1}([0-9]{10}|[0-9]{6})$/
  return regExp.test(passportNumber)
}

export function objectToQueryString(obj: Record<string, any>) {
  let queryString = ''
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (queryString !== '') {
        queryString += '&'
      }
      queryString += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    }
  }
  return queryString
}

export function queryStringToObject(queryString: string) {
  const obj: Record<string, any> = {}
  const keyValuePairs = queryString.split('&')
  keyValuePairs.forEach(pair => {
    const [key, value] = pair.split('=')
    obj[decodeURIComponent(key)] = decodeURIComponent(value)
  })
  return obj
}
