const file = '/';//当前模块api前缀
const api = {
    selectTeacher: {//获取老师列表
        path: '/teacher/queryReplyList',
        method: 'get'
    },
    commitQuestion: {//向老师提交自己的问题
        path: '/problem/add',
        method: 'post'
    },
    myQuestion: {//我的问题
        path: '/problem/myProblemList',
        method: 'get'
    },//问题查看详情
    myQuestionDetail: {
        path: '/problem/get',
        method: 'get'
    },
    myQuestionDetailList: {//问题解答列表
        path: '/problemReply/list',
        method: 'get'
    },//我的回答
    myAnswer: {
        path: '/problem/myReplyList',
        method: 'get'
    },//添加我的回答/stu/problemReply/add
    addAnswer: {
        path: '/problemReply/add',
        method: 'post'
    },
    changeAccept: {
        path: 'problemReply/adopt',
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
