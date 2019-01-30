const file = '/games/answer';//当前模块api前缀
const api = {
    list: {// 查询刷题大赛任务
        path: file + '/list',
        method: 'get'
    },
    start: {// 参与活动（开始）
        path: file + '/start',
        method: 'get'
    },
    getMyInfo: {// 查我的竞赛资料（我的参赛排名信息）
        path: file + '/getMyInfo',
        method: 'get'
    },
    rank: {// 榜单
        path: file + '/rank',
        method: 'post'
    },
    answerResult: {// 答题结束时的答题结果
        path: file + '/answerResult',
        method: 'get'
    },
    submit: { // 提交一道题（获取下一道题）
        path: file + '/submit',
        method: 'post'
    },
	news: { // 竞赛动态
        path: file + '/news',
        method: 'get'
    },
}
export default api 
