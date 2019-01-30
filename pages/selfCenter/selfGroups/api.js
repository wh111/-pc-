const file = '/';//当前模块api前缀
const api = {
    groupsList: {//我的群组
        path: '/groups/list',
        method: 'get'
    },
    getByNo: {//查找群
        path: '/groups/getByNo',
        method: 'get'
    },
    addFriend: {///friend/addFriend添加朋友
        path: '/friend/addFriend',
        method: 'post'
    },
    queryStudents: {//获取群成员
        path: '/groups/queryStudents',
        method: 'get'
    },
    join: {
        path: '/groups/join',
        method: 'post'
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
