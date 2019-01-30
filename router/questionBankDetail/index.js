/*
****--@file     questionBankDetail
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   题库详情
*/
const questionBankDetail = {
    path: '/questionBankDetail',
    name: 'questionBankDetail',
    meta: {
        requireAuth: false  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/questionBank/questionBank_detail.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/questionBankDetail'
    // },
}
export default questionBankDetail