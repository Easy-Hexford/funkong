// components/expand-member-list/index.ts
import * as request from '../../services/index'
import { ISimpleUserInfo } from '../../services/index'

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {
    activityId: {
      type: String,
      value: ''
    }
  },

  data: {
    _limit: 50,
    _offset: 0,
    _loadMore: false,
    _freshing: false,
    triggered: false,
    totalCount: 0,
    members: <Array<ISimpleUserInfo>>[],
  },

  lifetimes: {
    attached() {
      this.refreshMemberList()
    }
  },

  methods: {
    async refreshMemberList() {
      const { activityId, _limit } = this.data
      return request.getActivitySignUpList({
        ActivityId: activityId,
        Limit: _limit,
        Offset: 0
      }).then(resp => {
        this.setData({
          members: resp.ActivitySignUpList.map(i => i.User),
          _offset: resp.ActivitySignUpList.length,
          totalCount: resp.TotalCount
        })
      })
    },

    async loadMore() {
      if (this.data._offset >= this.data.totalCount) return
      if (this.data._loadMore) return
      this.data._loadMore = true

      const { activityId, _limit, _offset } = this.data
      return request.getActivitySignUpList({
        ActivityId: activityId,
        Limit: _limit,
        Offset: _offset
      }).then(resp => {
        const members = this.data.members
        members.push(...resp.ActivitySignUpList.map(i => i.User))
        this.setData({
          members,
          _loadMore: false,
          _offset: members.length,
          totalCount: resp.TotalCount,
        })
      })
    },

    onRefresh() {
      if (this.data._freshing) return
      this.data._freshing = true
      this.refreshMemberList()
        .then(() => {
          this.setData({
            triggered: false,
            _freshing: false,
          })
        })
    },
  }
})