// components/member-list/index.ts
import { MockMembers } from './mock'

Component({
  properties: {
    members: {
      type: Array,
      value: []
    },

    activityId: {
      type: String,
      value: ''
    },

    clubId: {
      type: String,
      value: ''
    },
  },

  data: {
    visible: false
  },

  lifetimes: {
    attached() {
      this.setData({
        // members: MockMembers
      })
    }
  },

  methods: {
    expand() {
      this.setData({
        visible: true,
      })
    },
    
    hidePopup() {
      this.setData({
        visible: false,
      })
    },

    onVisibleChange(e: any) {
      this.setData({
        visible: e.detail.visible,
      });
    },
  }
})
