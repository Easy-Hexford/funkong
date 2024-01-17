// components/welcome/index.ts
Component({

  properties: {

  },
 
  data: {

  },

  methods: {
    onTap(e: any) {
      this.triggerEvent('userTap', {
        btn: e.currentTarget.dataset.btn
      })
    }
  }
})