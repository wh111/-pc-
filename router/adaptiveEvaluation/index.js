/*
****--@file     adaptiveEvaluation
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   自选测评
*/

const adaptiveEvaluation = {
    path: '/adaptiveEvaluation',
    name: 'adaptiveEvaluation',
    // meta: {
    //     requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    // },
    component: resolve => {
        resolve(require('../../pages/adaptiveEvaluation/adaptiveEvaluation_choice.vue'));
    },
    /*redirect: to => {
    	return utils.pathPrefix + '/login'
    },*/
}
export default adaptiveEvaluation