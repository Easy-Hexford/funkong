import * as request from '../../services/index'
import { IActivityInfo } from '../../services/index'

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {

  },
  
  data: {
    ActivityList: <Array<IActivityInfo>>[],
    ActivityTotalCount: 0,

    loading: true,
    triggered: false,
    _freshing: false,
    _offset: 0,
    _page: 10,
    _loadMore: false,
  },

  lifetimes: {
    attached() {
      this.refreshActivityList()
    }
  },

  pageLifetimes: {
    async show() { 
      this.updateTabBar()
    }
  },
 
  methods: {
    async refreshActivityList() {
      request.getPulicActivityList({
        Offset: 0,
        Limit: this.data._page,
      }).then(resp => {
        this.setData({
          loading: false,
          ActivityList: resp.ActivityList,
          ActivityTotalCount: resp.TotalCount,
          _offset: resp.ActivityList.length
        })
      })
    },

    onRefresh() {
      if (this.data._freshing) return
      this.data._freshing = true
      this.refreshActivityList()
        .then(() => {
          this.setData({
            triggered: false,
            _freshing: false,
          })
        })
    },

    loadMore() {
      if (this.data._loadMore) return
      this.data._loadMore = true
      request.getPulicActivityList({
        Offset: this.data._offset,
        Limit: this.data._page,
      }).then(resp => {
        const ActivityList = this.data.ActivityList
        ActivityList.push(...resp.ActivityList)
        this.setData({
          ActivityList,
          ActivityTotalCount: resp.TotalCount,
          _offset: ActivityList.length,
          _loadMore: false
        })
      })
    },

    updateTabBar() {
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 0
      })
    },
  }
})