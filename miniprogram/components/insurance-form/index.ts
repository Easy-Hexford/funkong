// components/register/index.ts

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
    submittable: false,

    User: {
      IdCardType: 'ShenFenZheng',
      Name: '',
      IdCardNo: ''
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
        ...this.data.User
      })
    },

    checkFormFields() {
      const User = this.data.User
      if (User.Name && User.IdCardNo) 
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
      this.setData({
        'User.IdCardNo': idCardNo
      })
    }
  }
})