/*
****--@file     choiceEvaluation
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   自适应测评   试题
*/
const choiceEvaluation = {
    path: '/choiceEvaluation/:grade/:isFirstAssessment/:textbookVersionId/:subject',
    name: 'choiceEvaluation',
    component: resolve => {
        resolve(require('../../pages/adaptiveEvaluation/choiceEvaluation_Byself.vue'))
    },
    meta: {
        requireAuth: false  // 添加该字段，表示进入这个路由是需要登录的
    },
    // redirect: to => {
    // 	return utils.pathPrefix + '/choiceEvaluation'
    // },
}
export default choiceEvaluation