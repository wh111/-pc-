const file = '/'//当前模块api前缀
const api = {
  queryWork: {//我的作业
    path: '/work/myList',
    method: 'get'
  },
  myList: {//我的测评
    path: '/evaluation/myList',
    method: 'get'
  },
  getMyEvaluationInfo: {//查看试卷(测评)
    path: '/evaluation/getMyEvaluationInfo',
    method: 'get'
  },
  getMyWorkInfo: {//查看试卷(已完成测评)
    path: '/work/getMyWorkInfo',
    method: 'get'
  },
  getUserWorkInfo: {//查询个人详情(作业)
    path: '/work/getUserWorkInfo',
    method: 'get'
  },
  getGroupsInfo: {//班级详情测评
    path: '/evaluation/getGroupsInfo',
    method: 'get'
  },
  getWorkGroupsInfo: {//作业班级详情测评
    path: '/work/getGroupsInfo',
    method: 'get'
  },
  getUserEvaluationInfo: {//
    path: 'evaluation/getUserEvaluationInfo',//测试查询个人详情
    method: 'get'
  },
  delete: {//
    path: file + '/remove?ids=',
    method: 'delete'
  }
}
export default api
