/*
****--@file     evaluationByself
****--@date     2017/12/25 下午5:26
****--@author   jhd
****--@describe   自适应测评首页
*/
const evaluationByself = {
    path: '/evaluationByself',
    name: 'evaluationByself',
    component: resolve => {
        resolve(require('../../pages/adaptiveEvaluation/evaluationByself.vue'));
    },
    meta: {
        requireAuth: false  // 添加该字段，表示进入这个路由是需要登录的
    },
    // redirect: to => {
    // 	return utils.pathPrefix + '/evaluationByself'
    // },
}
export default evaluationByself