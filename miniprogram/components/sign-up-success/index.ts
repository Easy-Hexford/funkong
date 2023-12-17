// components/apply-success/index.ts
Component({
  properties: {
    content: {
      type: String,
    }
  },

  data: {

  },

  methods: {
    done() {
      this.triggerEvent('done', {})
    }
  }
})