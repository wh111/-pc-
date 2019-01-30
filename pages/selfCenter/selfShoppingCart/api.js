const file = '/';//当前模块api前缀
const api = {
    cartList: {//购物车列表
        path: '/cart/list',
        method: 'get'
    },
    productId: {////购物车结算
        path: '/order/toOrder',
        method: 'post'
    },
    cartRemove: {//删除所购商品
        path: '/cart/remove',
        method: 'delete'
    },
    cancelShop: {//订单取消
        path: '/order/cancel',
        method: "put"
    },
}
export default api 
