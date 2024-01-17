import { IActivityInfo, IClubInfo, IGetMineActicityListResp, IUserInfo } from "../services";

export const MockClub: IClubInfo = {
  "ClubId": "vek5mu09000cxfnfdggggwu4h00z3iu1",
  "ClubType": "NormalClub",
  "ClubName": "浪潮社",
  "ClubIcon": "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/club/undefined-1701703120233-9567.png",
  "Province": "吉林省",
  "City": "长春市",
  "OwnerUserId": "vek5mu09000cxfkfs18adm2300qwzzrx",
  "ClubDesc": "青春弄潮儿",
  "CreateTime": "2023-12-04 23:19:26",
  "UpdateTime": "2023-12-04 23:29:57",
  "DeleteFlag": "Exist",
  "AuditStatus": "AuditSucc",
  "CoverUrls": {
    "Items": [
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/club/undefined-1701703108545-5538.png"
    ]
  }
}

export const MockUser: IUserInfo = {
  "UserId": "vek5mu09000cxfkfs18adm2300qwzzrx",
  "OpenId": "oZ0GI5bFm_ZpU8J2tl0yM41755Ws",
  "NickName": "照无眠",
  "Icon": "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/user/undefined-1701789761136-3045.png",
  "Gender": "Man",
  "Role": "SuperRole",
  "RegisterType": "",
  "InvitedClubId": "",
  "Phone": "17665735535",
  "Name": "",
  "IdCardType": "",
  "IdCardNo": "",
  "BirthdayDate": "2012-10-01 00:00:00",
  "CreateTime": "2023-12-04 20:58:53",
  "UpdateTime": "2023-12-05 23:22:52",
  "DeleteFlag": "Exist",
  "AuditRole": "NormalAuditRole",
  "PhoneCountryCode": "",
  "RegisterInfo": {
    "ClubId": "",
    "ActivityId": ""
  },
  "CoverUrls": {
    "Items": [
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/user/undefined-1701789758025-9487.png"
    ]
  }
}

export const MockActivity: IActivityInfo = {
  "ActivityId": "tetgzu09000cxmfb9a1p2ic2200ijc56",
  "UserId": "vek5mu09000cxfkfs18adm2300qwzzrx",
  "ClubId": "vek5mu09000cxfnfdggggwu4h00z3iu1",
  "Province": "unKnown",
  "City": "unKnown",
  "Title": "游泳健将",
  "Content": "Name tag battle between Tom & Jerry\n老鼠和猫的名牌大战《来吧，let's go》\nPS：不懂英文完全不影响抓您let's go\n猫，鼠，有奖品哦\n（两种游戏趣味结合）分三轮全程全员参与，不落空\nActivity:\nName tag battle between Tom Jerry.\nLocation: Tianhe Park\nTime: 15: 30~18: 30pm(11.12 Sun.)\nMeet up: Tianhe Park Metro station E1\nNumber of people: 30\nFee: 19.9RMB/ per person\n",
  "BeginTime": "2023-12-13 22:00:00",
  "EndTime": "2023-12-13 23:00:00",
  "CreateTime": "2023-12-12 22:26:34",
  "UpdateTime": "2023-12-12 22:26:34",
  "DeleteFlag": "Exist",
  "AuditStatus": "AuditSucc",
  "ActivityRule": {
    "MaxSignUpNumber": 100,
    "Price": 1,
    "InsuranceProduct": {
      "ActivityType": "躲猫猫",
      "InsuranceType": "BaoY",
      "InsuranceProductId": "BY25392553",
      "NormalPrice": 1,
      "BeginAge": 1,
      "EndAge": 80,
      "DeathCompensation": 200000,
      "HospitalizationCosts": 2500,
      "HospitalizationAllowance": 3000,
      "HospitalizationTimeLimit": 30
    }
  },
  "Location": {
    "Name": "陈家祠",
    "Address": "广东省广州市荔湾区地铁1号线,地铁8号线",
    "LocationType": "gcj02",
    "Point": {
      "lat": 23.125722,
      "lon": 113.246523
    }
  },
  "CoverUrls": {
    "Items": [
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391127274-7145.png"
    ]
  },
  "PicList": {
    "Items": [
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391179996-8332.png",
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391179997-3860.png",
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391179998-1109.png",
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391179998-2014.png",
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391179998-4723.png",
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391179998-1911.png",
      "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/activity/undefined-1702391179998-4097.png"
    ]
  },
  "ActivitySignUpList": [],
  "SignUpNum": 0,
  "Club": {
    "ClubId": "vek5mu09000cxfnfdggggwu4h00z3iu1",
    "ClubType": "NormalClub",
    "ClubName": "浪潮社",
    "ClubIcon": "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/club/undefined-1701703120233-9567.png",
    "Province": "吉林省",
    "City": "长春市",
    "OwnerUserId": "vek5mu09000cxfkfs18adm2300qwzzrx",
    "ClubDesc": "青春弄潮儿",
    "CreateTime": "2023-12-04 23:19:26",
    "UpdateTime": "2023-12-04 23:29:57",
    "DeleteFlag": "Exist",
    "AuditStatus": "AuditSucc",
    "CoverUrls": {
      "Items": [
        "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/club/undefined-1701703108545-5538.png"
      ]
    }
  },
  "ActivityTypes": {
    "Items": [
      "躲猫猫"
    ]
  },
  "OwnerUser": {
    "UserId": "vek5mu09000cxfkfs18adm2300qwzzrx",
    "OpenId": "oZ0GI5bFm_ZpU8J2tl0yM41755Ws",
    "NickName": "照无眠",
    "Icon": "https://7072-prod-1gsl7u0x17e23d06-1322287298.tcb.qcloud.la/user/undefined-1701789761136-3045.png"
  }
}