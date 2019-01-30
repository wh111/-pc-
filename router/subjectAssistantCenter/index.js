/*
****--@file     subjectAssistantCenter
****--@date     2017/12/25 下午5:26
****--@author   jhd
****--@describe   学科助手首页
*/
const subjectAssistantCenter = {
    path: '/subjectAssistantCenter',
    name: 'subjectAssistantCenter',
    meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/selfCenter/sbujectAssistant/subjectAssistantCenter.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/subjectAssistantCenter'
    // },
}
export default subjectAssistantCenter