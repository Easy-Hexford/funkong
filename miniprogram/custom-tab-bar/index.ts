// custom-tab-bar/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value: 'label_1',
    list: [
      { value: 'label_1', label: 'Fun空', icon: 'home' },
      { value: 'label_2', label: '活动', icon: 'app' },
      { value: 'label_3', label: '我', icon: 'user' },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      this.setData({
        value: e.detail.value,
      });
    },
  }
})