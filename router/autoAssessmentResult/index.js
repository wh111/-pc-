//自适应测评结果页面

const autoAssessmentResult = {
    path: '/autoAssessmentResult',
    name: 'autoAssessmentResult',
    meta: {
        requireAuth: false  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/autoAssessmentResult/autoAssessmentResult.vue'));
    },
    /*redirect: to => {
    	return utils.pathPrefix + '/login'
    },*/
}
export default autoAssessmentResult