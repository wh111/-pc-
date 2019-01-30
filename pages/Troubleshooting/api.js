const file = '/stu';//当前模块api前缀
const api = {
    searchContent: {//搜索问题列表
        path: '/problem/search',
        method: 'get'
    },
    selectTeacher: {//获取老师列表
        path: '/teacher/queryReplyList',
        method: 'get'
    },
    list: {//
        path: file + '/list',
        method: 'get'
    },
    get: {//
        path: file + '/get?id=',
        method: 'get'
    },
    modify: {//
        path: file + '/modify',
        method: 'put'
    },
    delete: {//
        path: file + '/remove?ids=',
        method: 'delete'
    }
}
export default api 
