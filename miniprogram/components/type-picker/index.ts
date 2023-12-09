// components/acvitity-type-picker/index.ts
import { MockTypes } from './mock'

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
      value: MockTypes
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
      const { selected, types } = this.data
      if (selected < 0) return
      this.triggerEvent('confirm', {
        index: selected,
        value: types[selected]
      })
    },

    cancel() {
      this.reset()
      this.triggerEvent('cancel')
    }
  }
})