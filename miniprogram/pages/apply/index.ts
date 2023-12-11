import { MockActivity } from '../../utils/mock'

Component({

  properties: {

  },

  data: {
    Activity : MockActivity,
    visible: false,
  },

  methods: {
    register() {
      this.setData({
        visible: true
      })
    },

    getRealtimePhoneNumber(e) {
      console.info('@@@ getRealtimePhoneNumber: ', e.detail)
    },

    onVisibleChange(e: any) {
      this.setData({
        visible: e.detail.visible,
      });
    },

    pay() {
      this.setData({
        visible: true
      })
    }
  }
})