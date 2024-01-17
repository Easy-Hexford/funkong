// components/register/index.ts
import dayjs from 'dayjs'

import { isValidChineseIDCard, extractBirthdateFromIDCard, extractGenderFromIDCard, isValidPassport, isValidHKMCPassport } from '../../utils/util'

const IdCardTypeMap = {
  '身份证': 'ShenFenZheng',
  '护照': 'HuZhao',
  '港澳身份证': 'GangAoShenFenZheng'
}

type IIdCardType = '身份证' | '护照' | '港澳身份证'

Component({
  properties: {

  },

  data: {
    idCardType: '身份证',
    idCardTypes: [
      { label: '身份证', value: '身份证' },
      { label: '护照', value: '护照' },
      { label: '港澳身份证', value: '港澳身份证' },
    ],
    idCardTypePickerVisible: false,
    idCardNoErr: '',
    genders: [
      { label: '男', value: 'Man' },
      { label: '女', value: 'Woman' },
    ],
    genderPickerVisible: false,

    datePickerVisible: false,
    date: '2008-10-01 00:00:00',
    start: '1949-10-01 00:00:00',
    end: dayjs().valueOf(),
    submittable: false,

    User: {
      IdCardType: 'ShenFenZheng',
      IdCardNo: '',
      Name: '',
      Gender: '',
      BirthdayDate: '',
    }
  },

  observers: {
    'User.**': function (_) {
      this.setData({
        submittable: this.checkFormFields()
      })
    },
  },

  methods: {
    submit() {
      if (!this.data.submittable) return
      this.triggerEvent('submit', {
        User: this.data.User
      })
    },

    checkFormFields() {
      const User = this.data.User
      if (User.Name && User.IdCardNo && User.Gender && User.BirthdayDate)
        return true
      return false
    },

    showIDCardTypePicker() {
      this.setData({
        idCardTypePickerVisible: true,
      });
    },

    hideIDCardTypePicker() {
      this.setData({
        idCardTypePickerVisible: false
      })
    },

    onConfirmIDCardType(e: any) {
      const idCardType: IIdCardType = e.detail.value[0]
      const oldIdCardType = this.data.idCardType
      if (oldIdCardType === '身份证' && idCardType !== '身份证') {
        this.setData({
          'User.Gender': '',
          'User.BirthdayDate': ''
        })
      }
      this.setData({
        idCardType,
        'User.IdCardType': IdCardTypeMap[idCardType]
      })
    },

    onNameInputDone(e: any) {
      const name = e.detail.value
      this.setData({
        'User.Name': name
      })
    },

    onIDInputDone(e: any) {
      const idCardNo = e.detail.value
      if (!this.checkIdCardNo(idCardNo)) {
        this.setData({
          idCardNoErr: '请输入正确的证件号码'
        })
        return
      }
     
      this.setData({
        'User.IdCardNo': idCardNo
      })

      if (this.data.User.IdCardType === 'ShenFenZheng') {
        this.extractBirthAndGenderFromIdCard(idCardNo)
      }
    },

    resetIdCarNoErr() {
      this.setData({
        idCardNoErr: ''
      })
    },

    extractBirthAndGenderFromIdCard(idCardNo: string) {
      const birthday = extractBirthdateFromIDCard(idCardNo)
      const gender = extractGenderFromIDCard(idCardNo)
      this.setData({
        'User.Gender': gender,
        'User.BirthdayDate': birthday
      })
    },

    checkIdCardNo(value: string) {
      const IdCardType = this.data.User.IdCardType
      switch(IdCardType) {
        case 'ShenFenZheng': {
          return isValidChineseIDCard(value)
        }
        case 'HuZhao': {
          return isValidPassport(value)
        }
        case 'GangAoShenFenZheng': {
          return isValidHKMCPassport(value)
        }
      }
      return false
    },

    showGenderPicker() {
      this.setData({
        genderPickerVisible: true,
      });
    },

    hideGenderPicker() {
      this.setData({
        genderPickerVisible: false,
      });
    },

    onConfirmGender(e: any) {
      const gender = e.detail.value[0];
      this.setData({
        'User.Gender': gender
      })
      this.hideGenderPicker();
    },

    showDatePicker() {
      this.setData({
        datePickerVisible: true,
      });
    },

    hideDatePicker() {
      this.setData({
        datePickerVisible: false,
      });
    },

    onConfirmDate(e: any) {
      const { value } = e.detail;
      this.setData({
        'User.BirthdayDate': value
      })
      this.hideDatePicker();
    },

  }
})