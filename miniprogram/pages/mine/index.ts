import * as request from '../../services/index'
import { IActivityInfo, IActivitySignUpTag, ISignUpActicityInfo } from '../../services/index'

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {

  },

  data: {
    ActivitySignUpList: <Array<ISignUpActicityInfo>>[],
    ActivityTotalCount: 0,

    signUpTag: <IActivitySignUpTag>'All',
    selections: [{
      index: 0,
      name: '全部',
      tag: 'All',
    }, {
      index: 1,
      name: '等待中',
      tag: 'NoBegin',
    }, {
      index: 2,
      name: '已结束',
      tag: 'End',
    }],

    loading: true,
    triggered: false,
    _offset: 0,
    _page: 10,
    _freshing: false,
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
    onUserTap(e: any) {
      const { area, idx } = e.detail
      if (area === 'body') {
        const SignUpActivity = this.data.ActivitySignUpList[idx]
        wx.navigateTo({
          url: `../activity-detail/index?ActivityId=${SignUpActivity.Activity.ActivityId}`
        })
      }
    },

    select(e: any) {
      const oldSignUpTag = this.data.signUpTag
      const signUpTag = e.currentTarget.dataset.tag
      this.setData({
        signUpTag
      })
      if (oldSignUpTag != signUpTag) {
        this.refreshActivityList()
      }
    },

    async refreshActivityList() {
      request.getSignActicityList({
        ActivitySignUpTag: this.data.signUpTag,
        Offset: 0,
        Limit: this.data._page,
      }).then(resp => {
        this.setData({
          loading: false,
          ActivitySignUpList: resp.ActivitySignUpList,
          ActivityTotalCount: resp.TotalCount,
          _offset: resp.ActivitySignUpList.length
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
            _freshing: false
          })
        })
    },

    loadMore() {
      if (this.data._offset >= this.data.ActivityTotalCount) return
      if (this.data._loadMore) return
      this.data._loadMore = true
      request.getSignActicityList({
        ActivitySignUpTag: this.data.signUpTag,
        Offset: this.data._offset,
        Limit: this.data._page,
      }).then(resp => {
        const ActivitySignUpList = this.data.ActivitySignUpList
        ActivitySignUpList.push(...resp.ActivitySignUpList)
        this.setData({
          ActivitySignUpList,
          ActivityTotalCount: resp.TotalCount,
          _offset: ActivitySignUpList.length,
          _loadMore: false
        })
      })
    },

    updateTabBar() {
      const tabComp = this.getTabBar()
      tabComp.setData({
        selected: 1
      })
    },
  }
})