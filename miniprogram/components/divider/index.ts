const chars = new Array(10).fill('- - - - - - - - - -').join(' ')

Component({
  options: {},

  properties: {
    height: {
      type: Number,
      value: 10,
    },

    color: {
      type: String,
      value: '#fff'
    }
  },

  data: {
    chars
  },

  methods: {

  }
})