/*
****--@file     subjectAssistantCenter
****--@date     2017/12/25 下午5:26
****--@author   jhd
****--@describe   学科助手 - 刷题页面
*/
const brushQuestion = {
    path: '/brushQuestion/:seasonId/:gamesAnswerId',
    name: 'brushQuestion',
    meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/selfCenter/sbujectAssistant/brushQuestion.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/subjectAssistantCenter'
    // },
}
export default brushQuestion