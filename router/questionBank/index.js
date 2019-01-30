/*
****--@file     questionBank
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   题库
*/
const questionBank = {
    path: '/questionBank',
    name: 'questionBank',
    meta: {
        requireAuth: false  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/questionBank/questionBank_list.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/questionBank'
    // },
}
export default questionBank