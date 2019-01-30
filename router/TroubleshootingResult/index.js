/*
****--@file     troubleShootingResult
****--@date     2017/12/25 下午5:23
****--@author   wh
****--@describe   疑难问题搜寻结果
*/
const troubleShooting = {
    path: '/TroubleshootingResult',
    name: 'TroubleshootingResult',
    meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/Troubleshooting/TroubleshootingResult.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/troubleShooting'
    // },
}
//myAnswer.vue
export default troubleShooting