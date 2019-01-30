const api = {
  login: {//登录
    path: '/login',
    method: 'post'
  },
  wxConnect: {
    path: '/student/wxConnect',
    method: 'post'
  },
  register: {//注册
    path: '/register',
    method: 'post'
  },
  sendValidCode: {//获取短信验证码
    path: '/sms/sendValidCode',
    method: 'post'
  },
  logout: {//注销
    path: '/logout',
    method: 'post'
  },
  validCodeRight: {//验证验证码
    path: '/validCode',
    method: 'post'

  },
  backPassword: {
    path: '/back-password',
    method: 'post'
  },
  // nameAndMoblie: {//验证手机号是否注册过
  //     path: '/nameAndMoblie',
  //     method: 'post'
  // }
  wxOauth: {
    path: '/wxConnect/oauth',
    method: 'get'
  },
  wxPClogin: {
    path: '/wxConnect/wXPClogin',
    method: 'post'
  },
  wxBind: {
    path: '/wxConnect/wXPCbound',
    method: 'post'
  }
};
export default api;
