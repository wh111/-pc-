const file = '/';//当前模块api前缀
const api = {
    getOrder: {//获取订单信息
        path: '/order/getOrder',
        method: 'get'
    },
    payment: {//支付（微信，支付宝）
        path: '/order/payment',
        method: 'post'
    },
    orderList: {//订单列表
        path: '/order/list',
        method: 'get'
    },
    orderCancel: {//取消订单
        path: '/order/cancel',
        method: 'put'
    },
   payAli: {
    path: '/order/alipayment',
    method: 'post'
  },
  payForm: {
        path: '/stu/bHistory/inMoneyAlipay',
        method: 'put'
    }
    
}
export default api 
