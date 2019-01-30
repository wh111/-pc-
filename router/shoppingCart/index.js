/*
****--@file     shoppingCart
****--@date     2017/12/25 下午5:15
****--@author   jhd
****--@describe   题库购物车
*/
const shoppingCart = {
    path: '/shoppingCart',
    name: 'shoppingCart',
    meta: {
        requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: resolve => {
        resolve(require('../../pages/selfCenter/selfShoppingCart/selfShoppingCart.vue'));
    }
    // redirect: to => {
    // 	return utils.pathPrefix + '/shoppingCart'
    // },
}
export default shoppingCart