/*
****--@file     toDoQuestions
****--@date     2018/1/11 下午3:52
****--@author   jhd
****--@describe   我的题库开始答题 路由
*/

const toDoQuestions = {
    path: '/toDoQuestions/:productId/:papersId',
    name: 'toDoQuestions',
    meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/ToDoQuestions/toDoQuestions.vue'));
    },
    /*redirect: to => {
    	return utils.pathPrefix + '/login'
    },*/
}
export default toDoQuestions