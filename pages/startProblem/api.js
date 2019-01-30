const file = "assessment";
const api = {
    add: {//创建测评
        path: file + '/add',
        method: 'post'
    },
    submit: { // 提交测评(结束提交)
        path: file + '/submit',
        method: 'post'
    },
    getAnswerQuestion: { // 根据试题ID查询试题详情以及作答情况
        path: file + '/getAnswerQuestion',
        method: 'get'
    },
    getNextQuestions: {//答题并获取下一道题（下一道题）
        path: file + '/getNextQuestions',
        method: 'post'
    },
    getNextQuestionsNologin: {//答题并获取下一道题（下一道题）(未登录)
        path: file + '/nologin/getNextQuestions',
        method: 'post'
    },
    submit: {//提交测评
        path: file + '/submit',
        method: 'post'
    },
}
export default api;