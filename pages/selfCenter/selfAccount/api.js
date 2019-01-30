const file = '/';//当前模块api前缀
const api = {
    bHistoryList: {//充值记录  消费记录
        path: '/bHistory/list',
        method: 'get'
    },
    queryHistoryList: {//获取vip续订记录
        path: '/vip/queryHistory',
        method: 'get'
    },
    vipConfigList: {
        path: '/vipConfig/list',
        method: 'get'
    },
    vipPayment: {
        path: '/vip/payment',
        method: 'post'
    }
}
export default api 
