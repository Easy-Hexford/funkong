// import { MockTypes } from './mock'
import { IInsuranceProduct } from '../../services/index';

Component({
  options: {
    virtualHost: true
  },

  properties: {
    title: {
      type: String,
      value: '选择活动类型'
    },

    types: {
      type: Array,
      value: []
    },
  },

  data: {
    selected: -1,
  },

  methods: {
    select(e: any) {
      const idx = e.currentTarget.dataset.idx
      this.setData({
        selected: parseInt(idx)
      })
    },

    reset() {
      this.setData({
        selected: -1
      })
    },

    confirm() {
      const selected = this.data.selected
      const types: Array<IInsuranceProduct> = this.data.types
      if (selected < 0) return
      this.triggerEvent('confirm', {
        index: selected,
        activityType: types[selected].ActivityType
      })
    },

    cancel() {
      this.reset()
      this.triggerEvent('cancel')
    }
  }
})