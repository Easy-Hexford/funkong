// components/member-list/index.ts
import { MockMembers } from './mock'

Component({
  properties: {
    members: {
      type: Array,
      value: []
    }
  },

  lifetimes: {
    attached() {
      this.setData({
        members: MockMembers
      })
    }
  },

  data: {

  },

  methods: {

  }
})
