import * as request from '../../services/index'
import { IActivityAuditStatus, IActivityInfo } from '../../services/index'

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {

  },

  data: {
    ActivityList: <Array<IActivityInfo>>[],
    ActivityTotalCount: 0,

    auditStatus: <IActivityAuditStatus>'Auditing',
    selections: [{
      index: 0,
      name: '待审核',
      tag: 'Auditing',
    }, {
      index: 1,
      name: '已通过',
      tag: 'AuditSucc',
    }, {
      index: 2,
      name: '未通过',
      tag: 'AuditFail',
    }],

    loading: true,
    triggered: false,
    _offset: 0,
    _page: 5,
    _freshing: false,
    _loadMore: false,
  },

  lifetimes: {
    attached() {
      this.refreshActivityList()
    }
  },

  pageLifetimes: {
    async show() { }
  },

  methods: {
    select(e: any) {
      const oldAuditStatus = this.data.auditStatus
      const auditStatus = e.currentTarget.dataset.tag
      this.setData({
        auditStatus
      })
      if (oldAuditStatus != auditStatus) {
        this.refreshActivityList()
      }
    },

    async refreshActivityList() {
      request.getActicityList({
        AuditStatus: this.data.auditStatus,
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
          this.data._freshing = false
          this.setData({
            triggered: false,
          })
        })
    },

    loadMore() {
      if (this.data._loadMore) return
      this.data._loadMore = true
      request.getActicityList({
        AuditStatus: this.data.auditStatus,
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
  }
})