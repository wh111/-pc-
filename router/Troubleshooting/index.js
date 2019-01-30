/*
****--@file     troubleShooting
****--@date     2017/12/25 下午5:23
****--@author   jhd
****--@describe   疑难问题
*/
const troubleShooting = {
    path: '/troubleShooting',
    name: 'troubleShooting',
    meta: {
        requireAuth: false  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/Troubleshooting/Troubleshooting.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/troubleShooting'
    // },
}
export default troubleShooting