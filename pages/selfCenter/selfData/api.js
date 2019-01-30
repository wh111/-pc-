const file = '/';//当前模块api前缀
const api = {
    getMyInfo: {//获取我的信息
        path: '/student/getMyInfo',
        method: 'get'
    },
    getBooklist: {//获取教材
        path: '/textbook/get',
        method: 'get',
    },
    uploadImg: {
        path: '/file/uploadImg',
        method: 'post'
    },
  wxOauth: {
    path: '/wxConnect/stuWxBoundByCode',
    method: 'get'
  },
    changePass: {//更改密码
        path: '/modify-password',
        method: 'put'
    },
    bindMobile: {//绑定手机号
        path: '/student/bindMobile',
        method: 'post'
    },
    sendValidCode: {//获取验证码
        path: '/sms/sendValidCode',
        method: 'post'
    },
    validCodeRight: {//验证验证码
        path: '/validCode',
        method: 'post'
        
    },
    modify1: {//修改数据
        path: '/student/modify',
        method: 'put'
    },
    nameAndMoblie: {//验证手机号是否注册过
        path: '/nameAndMoblie',
        method: 'post'
    },
    logout: {//注销
        path: '/logout',
        method: 'delete'
    }
    
}
export default api 
