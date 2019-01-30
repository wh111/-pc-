/*
****--@file     login
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   登录注册
*/
const login = {
    path: '/Student/login',
    name: 'login',
    component: resolve => {
        resolve(require('../../pages/login/login.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/login'
    // },
}
export default login
