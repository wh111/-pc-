<!--
****--@file     login.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  登录注册找回密码
-->
<template>
    <div class="login-detail-root">
        <header-top></header-top>
        <template v-if="!isOtherLogin">
            <!-- 登录 -->
            <div class="login-detail" v-if="loginorregister==1">
                <div class="Tab">
                    <!--<div class="wechat">-->
                    <!--<div class="wechat-img">-->
                    <!--<img src="../../assets/images/QRCode-1.png"/>-->
                    <!--</div>-->
                    <!--<p>扫码关注我们的公众号</p>-->
                    <!--</div>-->
                    <h1><span class="spanL">用户登录 </span><span class="spanR" @click="clickRegister">用户注册</span></h1>
                    <div class="login-input">
                        <div class="div">
                            <div class="icon-login">
                                <img src="../../assets/images/agentName.png"/>
                            </div>
                            <input type="text" v-on:input="changeAccount()" v-model="loginForm.username"
                                   placeholder="请输入用户名"></input></div>
                        <div class="div" style="margin-top: 22px">
                            <div class="icon-login">
                                <img src="../../assets/images/password.png"/>
                            </div>
                            <input type="password" v-model="loginForm.password" placeholder="请输入密码"></input>
                        </div>
                        <el-checkbox v-if="unionId" v-model="bindWX">绑定微信</el-checkbox>
                        <el-checkbox v-model="checkedPassword0" :style="{'marginLeft':unionId ? '10px' : '0'}">记住密码</el-checkbox>
                        <span :style="{'marginLeft':unionId ? '10px' : '112px'}" @click="findPassword">忘记密码</span><br>

                        <load-btn class="orangeYellow" :btnData="loginBtn" @toLogin="toLogin"></load-btn>
                    </div>
                    <div class="login-footer-foot">
                        <!--<div class="img" style="margin-left: 65px"><img src="../../assets/images/QQ.png"/></div>-->
                        <!--<span>QQ</span>-->
                        <a href="javascript:void(0)" @click="showWxQRCode">
                            <div class="img" style="margin-left: 45px"><img src="../../assets/images/Wechat.png"/></div>
                            <span>微信</span></a>
                        <div id="weChat"></div>
                        <div class="img-teacher img" style="margin-left: 105px"><img
                                src="../../assets/images/greenCircle.png"/></div>
                        <a href="/sasteacher/Teacher/login" target="_blank"><span
                                style="margin-left: 10px">我是老师</span></a>
                        <!--<span v-if="isStudent" style="margin-left: 10px" @click="checkType">我是老师</span>-->
                        <!--<span v-else style="margin-left: 10px" @click="checkType">我是学生</span>-->
                        <!--<p><span style="margin-left: 80px">关于我们</span><span style="margin-left: 50px">客户服务</span><span-->
                        <!--style="margin-left: 50px">APP下载</span></p>-->
                    </div>
                </div>
            </div>
            <!-- 注册 -->
            <register v-if="loginorregister==2" :isStudent="isStudent" @sendPersonmessage="sendPersonmessage"
                      @clickLogin="clickLogin"></register>

            <!-- 找回密码 -->
            <find-password v-if="loginorregister==3" @sendP="sendP"></find-password>
        </template>
        <div v-else class="otherLoginTips">
            <i class="el-icon-loading"></i>
            <p>正在验证身份,请稍等...</p>
        </div>
        <footer-buttom style="margin-top: 100px"></footer-buttom>
        <Modal :mask-closable="false" width="360" title="注册成功" v-model="loginorregisterTrue"
               class-name="registerSuccess" :loading="loading">
            <modal-header slot="header" :content="evaluateId"></modal-header>
            <registerSuccess :typeofmessage="typeofmessage" @routerToLogin="routerToLogin"
                             v-if="loginorregisterTrue"></registerSuccess>
        </Modal>
    </div>
</template>
<script>
  let Util = null;
  import api from './api';
  import LoadBtn from '../../components/common/loadBtn';
  import registerSuccess from './registerSuccess.vue';
  import headerTop from '../../components/common/headTop.vue';
  import footerButtom from '../../components/common/footer.vue';
  import findPassword from './findPassword.vue';
  import register from './register.vue';

  export default {
    data () {
      return {

        isStudent: true,
        typeofmessage: 'true',

        sendKeySuccess: false,
        telNumber: '',
        loginForm: {
          username: '',
          password: '',
          keepPassword: '',
          openId: '',
          unionId: ''
        },
        loginBtn: {
          title: '立即登录',
          loadText: '登录中',
          callParEvent: 'toLogin'
        },
        messageInput: '',
        inputAccount: '',
        inputPassword: '',
        inputAccountpassword: '',

        checkedPassword: false,
        checkedPassword0: false,//记住账号
        checkedPassword1: false,//同意协议
        loginorregisterTrue: false,
        loginorregister: 1,
        evaluateId: {
          id: 'registerSuccess',
          title: ''
        },
        loading: false,
        bindWX: false,
        isOtherLogin: false,
        unionId: '',
        userId: ''
      };
    },
    watch: {
      '$route' (to, from) {
        this.loginorregister = this.$route.query.id;
        console.log(this.loginorregister);
      }
    },
    computed: {},
    created () {
      this.init();
      // if (this.$route.query.openId) {
      //   this.loginForm.openId = this.$route.query.openId
      //   this.loginForm.unionId = this.$route.query.unionId || ''
      //   if (this.$route.query.binding) {
      //     this.toLogin()
      //   } else {
      //     this.successMess('微信登录成功,请登录或注册以绑定账号')
      //   }
      //
      // }
    },
    methods: {
      init () {
        this.loginorregister = this.$route.query.id || 1;
        Util = this.$util;
        this.checkIsWXLogin();
        if (Util.getStore('user')) {
          this.loginForm = {
            username: Util.getStore('user'),
            password: Util.getStore('psw')
          };
          this.checkedPassword0 = true;
        }
      },
      checkIsWXLogin () {
        let {code, state} = this.$route.query;
        this.isOtherLogin = state != undefined;
        if (state === 'wx' && code) {
          this.wxOauth(code);
        } else {
          this.wxLoginTips('', true);
        }
      },
      wxOauth (code) {
        let opt = {
          ajaxParams: {
            url: api.wxOauth.path,
            method: api.wxOauth.method,
            params: {code}
          },
          ajaxSuccess: res => {
            if (res.data) {
              this.wxLogin(res.data);
            } else {
              this.wxLoginTips('微信登录失败', true);
            }
          }
        };
        this.ajax(opt);
      },
      wxLogin (unionId) {
        let opt = {
          ajaxParams: {
            url: api.wxPClogin.path,
            method: api.wxPClogin.method,
            data: {unionId}
          },
          ajaxSuccess: res => {
            // if (res.data) {
            //   this.wxLogin(res.data)
            // } else {
            //   this.wxLoginTips('微信登录失败', false);
            // }
            if (res.data) {

              this.getMyInfo();
            } else {
              this.unionId = unionId;
              this.wxLoginTips('', true);
            }
          }
        };
        this.ajax(opt);
      },
      bindWXToThisUser () {
        let opt = {
          ajaxParams: {
            url: api.wxBind.path,
            method: api.wxBind.method,
            data: {unionId: this.unionId, userId: this.userId, userType: '1'}
          },
          ajaxSuccess: res => {
            this.$message({
              message: res.data ? '微信绑定成功' : '微信绑定失败',
              type: res.data ? 'success' : 'warning'
            });
          }
        };
        this.ajax(opt);
      },
      showWxQRCode () {
        let {host, protocol, pathname} = window.location;
        let urlParams = {
          appid: 'wxf77a6ddae54a7eda',
          redirect_uri: encodeURI(protocol + '//' + host + pathname),
          response_type: 'code',
          scope: 'snsapi_login',
          state: 'wx'
        };
        let url = 'https://open.weixin.qq.com/connect/qrconnect?' + Object.keys(urlParams).map(key => `${key}=${urlParams[key]}`).join('&');
        window.location.href = url;
      },
      wxLoginTips (message, error = false) {
        this.isOtherLogin = !error;
        message && this.$message({
          message,
          type: error ? 'warning' : 'success'
        });
      },

      clickLogin () {
        this.loginorregister = 1;
      },
      changeAccount () {
        this.loginForm.username = this.loginForm.username.replace(/[\u4e00-\u9fa5]/g, '');
        this.inputAccount = this.inputAccount.replace(/[\u4e00-\u9fa5]/g, '');
        this.inputPassword = this.inputPassword.replace(/[\u4e00-\u9fa5]/g, '');
      },
      toLogin (isLoadingFun) {
        this.checkedPassword0 == true ? this.loginForm.keepPassword = 1 : this.loginForm.keepPassword = '';
        if (!isLoadingFun) isLoadingFun = () => {
        };
        isLoadingFun(true);
        if (Util.getStore('username')) {
          data.username = Util.getStore('username');
          data.password = Util.getStore('password');
        }
        let data = this.$util.getFormData(this.loginForm);
        let opt = {
          ajaxSuccess: res => {
            this.userId = res.data.id;
            if (this.bindWX) {
              this.bindWXToThisUser();
            }
            this.getMyInfo(isLoadingFun);
            if (this.checkedPassword0) {
              Util.setStore('user', data.username);
              Util.setStore('psw', data.password);
            } else {
              Util.removeStore('user');
              Util.removeStore('psw');
            }
            Util.setStore('password', data.password);
          },
          error: res => {
            isLoadingFun(false);
          },
          ajaxParams: {
            url: api.login.path,
            method: api.login.method,
            data
          }
        };
        this.ajax(opt);
      },
      getMyInfo (isLoadingFun) {
        let opt = {
          ajaxSuccess: 'getUserInfoSuccess',
          ajaxParams: {
            url: '/student/getMyInfo'
          }
        };
        this.ajax(opt, isLoadingFun);
      },

      getUserInfoSuccess (res) {
        this.$cookie.set(this.$util.cookieConfig.loginAuthKey, 1);
        this.$store.commit('app/setLogin', true);
        this.$store.commit('user/updateInfo', res.data);
        this.$store.commit('user/updateTextbookVersionList', res.data.textbookVersionList);
        let loginGo = this.$util.getStore('loginGo');
        if (loginGo) {
          // 登录成功后跳转到指定页面
          if (loginGo.indexOf('/selfCenter/selfShopcar') == 0) {
            this.ajax({
              ajaxSuccess: res => {
                if (res.status.code == 0) {
                  this.successMess('商品已添加到购物车！');
                  this.$router.push(loginGo);
                  this.$util.removeStore('addCartId');
                  this.$util.removeStore('loginGo');
                }
              },
              ajaxParams: {
                url: '/cart/add',
                method: 'post',
                data: {
                  productId: this.$util.getStore('addCartId')
                }
              }
            });
          } else if (loginGo.indexOf('/questionBankDetail') == 0) {
            let id = loginGo.split('?name=')[1];
            let that = this;
            this.ajax({
              ajaxSuccess: res => {
                if (res.status.code == '0') {
                  that.$router.push(`/selfcenter/shopcar?id=${res.data.id}`);
                }
              },
              error: res => {
                this.errorMess(res.status.msg);
                that.$router.push('/selfCenter/selfShopcar');
              },
              ajaxParams: {
                url: '/order/toOrder',
                method: 'post',
                data: {
                  productIds: id
                }
              }
            });
            this.$util.removeStore('loginGo');
          } else {
            this.$router.push(loginGo);
            this.$util.removeStore('loginGo');
          }
        } else {
//              alert(Util.getStore('username'))
          // 登录成功后跳转到个人中心
//              if(Util.getStore('username')){
//                this.$util.removeStore('username')
//                this.$router.push({name: 'selfData'})
//              }else{
          this.$router.push({name: 'selfCenter'});
//              }

        }
      },

      clickRegister () {
        this.loginorregister = 2;
      },
//            clickLogin() {
//                this.loginorregister = 1
//            },
      findPassword () {
        this.loginorregister = 3;
        console.log(this.$route);
        this.$route.query.id = 3;
      },
      sendPersonmessage () {
        this.typeofmessage = true;
        this.loginorregisterTrue = true;
        this.inputAccount = '';
        this.inputAccountpassword = '';
        this.checkedPassword = false;
        this.messageInput = '';
        this.inputPassword = '';
      },
      sendP () {
        this.typeofmessage = false;
        this.loginorregisterTrue = true;
        this.inputAccount = '';
        this.inputAccountpassword = '';
        this.checkedPassword = false;
        this.messageInput = '';
      },
      routerToLogin (index) {
        this.loginorregister = index;
        this.loginorregisterTrue = false;
      },
      //选择当前登录身份类型
      //type=>  student || teacher
      checkType () {
        this.isStudent = !this.isStudent;
        console.log(this.isStudent);
      }

    },
    components: {
      LoadBtn,
      registerSuccess,
      headerTop,
      footerButtom,
      findPassword,
      register
    }
  };
</script>
<style lang="scss">
    @import "./login.scss";

</style>
