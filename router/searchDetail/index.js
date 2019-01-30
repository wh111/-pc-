const searchDetail = {
    path: '/searchDetail',
    name: 'searchDetail',
    meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/Troubleshooting/searchDetail.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/troubleShooting'
    // },
}
//myAnswer.vue
export default searchDetail