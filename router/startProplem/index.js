/*--
****--@file     startProplem
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   自选测评-开始做题
*/
const startProplem = {
    path: '/startProplem',
    name: 'startProplem',
    // meta: {
    //     requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    // },
    component: resolve => {
        resolve(require('../../pages/startProblem/startProblem.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/startProplem'
    // },
}
export default startProplem