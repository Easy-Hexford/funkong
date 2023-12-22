// components/firework/index.ts
Component({

  properties: {

  },

  data: {
    show: true
  },

  lifetimes: {
    attached() {
      setTimeout(() => {
        this.hide()
      }, 3000)
    }
  },

  methods: {
    display() {
      this.setData({
        show: true
      })
    },

    hide() {
      this.setData({
        show: false
      })
    }
  }
})