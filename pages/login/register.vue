<!--
****--@file     register
****--@date     2018/1/10 16:27
****--@author   wh
****--@describe   注册
-->
<template>
    <div class="tabRegister login-detail">

        <div class="Tab">
            <h1><span class="spanR" @click="clickLogin1">用户登录 </span><span class="spanL">用户注册</span></h1>
            <div class="login-input">
                <!--<div class="div">-->
                <!--<div class="icon-login">-->
                <!--<img src="../../assets/images/agentName.png"/>-->
                <!--</div>-->
                <!--<input type="text" v-model="inputAccount" v-on:input="changeAccount()"-->
                <!--placeholder="请输入6-20位账号"></input></div>-->
                <div class="div" style="margin-top: 10px">
                    <div class="icon-login">
                        <img src="../../assets/images/telNumber.png"/>
                    </div>
                    <input type="text" v-model="inputPassword" v-on:input="changeAccount()"
                           placeholder="请输入手机号"></input></div>
                <div class="div" style="margin-top: 22px">
                    <input type="password" placeholder="请输入短信验证码" v-model="messageInput"
                           style="width: 150px;padding: 0 14px;border-left: 1px solid #ccc"/>
                    <button @click="getPassTel" v-if="!sendKeySuccess" class="getKey greenButton "
                            style="">
                        获取验证码
                    </button>
                    <button v-if="sendKeySuccess" class="alreadySend greenButton"
                            style="">
                        已发送<span style="color:#fd7416;padding-left:5px">{{timesend}}</span>s
                    </button>
                </div>
                <div class="div" style="margin-top: 22px">
                    <div class="icon-login">
                        <img src="../../assets/images/password.png"/>
                    </div>
                    <input type="password" v-model="inputAccountpassword" placeholder="请输入6-32密码"></input></div>
                <el-checkbox v-model="checkedPassword"></el-checkbox>
                <span>我已阅读并同意《 <span @click="agreementModal=true" style="color: #11a63f">用户协议</span> 》</span>
                <load-btn class="orangeYellow" :btnData="registerBtn" @toRegister="toRegister"></load-btn>
                <!--<button @click="AgreeRegister">同意协议并注册</button>-->
                <!--<p class="tabRegister-footer"><span>关于我们</span><span>客户服务</span><span>APP下载</span></p>-->
            </div>
        </div>
        <!--协议弹窗-->
        <Modal
                :mask-closable="false"
                width="700"
                v-model="agreementModal"
                title="注册协议"
                :loading="loading">
            <modal-header slot="header" :content="confirm"></modal-header>
            <agreement-modal v-if="agreementModal"></agreement-modal>
            <div slot="footer"></div>
        </Modal>
    </div>


</template>
<script>
  /*当前组件必要引入*/
  import LoadBtn from '../../components/common/loadBtn'
  import agreementModal from './agreementModal.vue'
  import api from './api'

  let Util = null
  export default {
    props: ['isStudent'],
    data () {
      return {
        agreementModal: false,
        loading: false,
        confirm: {
          id: 'confirmId',
          title: '用户协议'
        },
        showOrder: false,
        inputPassword: '',
        inputAccountpassword: '',
        registerBtn: {
          title: '注册',
          loadText: '注册中',
          callParEvent: 'toRegister'
        },
        sendKeySuccess: false,
        messageInput: '',
        checkedPassword: true,
        timesend: 60,
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        console.log(this.isStudent)
      },
      clickLogin1 () {
        this.$emit('clickLogin')
      },
      changeAccount () {
        this.inputPassword = this.inputPassword.replace(/[\u4e00-\u9fa5]/g, '')

      },
      toRegister (isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = () => {
        }
        isLoadingFun(true)
        if (!(/^1[34578]\d{9}$/.test(this.inputPassword))) {
          this.$message({
            showClose: true,
            message: '请输入正确的手机号码',
            type: 'error'
          })
          isLoadingFun(false)
          return false
        }
        if (!(/^.{6,32}$/.test(this.inputAccountpassword))) {
          this.$message({
            showClose: true,
            message: '请输入6-32位密码',
            type: 'error'
          })
          isLoadingFun(false)
          return false
        }
        if (!this.checkedPassword) {
          this.$message({
            showClose: true,
            message: '请阅读并同意协议',
            type: 'error'
          })
          isLoadingFun(false)
          return false
        }
        if (this.messageInput == '') {
          this.$message({
            showClose: true,
            message: '请输入验证码',
            type: 'error'
          })
          isLoadingFun(false)
          return false
        }
        this.ajax({//发送账号信息
          ajaxSuccess: this.sendPersonmessage1,
          error: res => {
            this.$message({
              showClose: true,
              message: res.status.msg,
              type: 'error'
            })
            isLoadingFun(false)
          },
          ajaxParams: {
            // baseURL:'PUBLIC',
            url: api.register.path,
            method: api.register.method,
            data: {
              nickname: this.inputAccount,
              mobile: this.inputPassword,
              password: this.inputAccountpassword,
              code: this.messageInput
            },
          },
        }, isLoadingFun)
      },
      getPassTel () {
        //isLoadingFun
        if (!(/^1[34578]\d{9}$/.test(this.inputPassword))) {
          this.$message({
            showClose: true,
            message: '请输入正确的手机号码',
            type: 'error'
          })

        }
        else {
          this.nameAndMoblie()

        }

      },
      nameAndMoblie () {
        this.TelNotRegisterSuccess()

      },
      TelNotRegisterSuccess () {
        this.ajax({
          ajaxSuccess: this.getPassTelSuccess,

          error: () => {
          },
          ajaxParams: {
            //baseURL:'PUBLIC',
            url: api.sendValidCode.path,
            method: api.sendValidCode.method,
            data: {
              mobile: this.inputPassword,
              types: 10,
            },
          },
        })
      },

      getPassTelSuccess (res) {
        var that = this
        var setInt = window.setInterval(function () {
          that.timesend--
          if (that.timesend == 0) {
            window.clearInterval(setInt)
            that.sendKeySuccess = false
            that.timesend = 60
          }
        }, 1000)
        this.sendKeySuccess = true
      },
      sendPersonmessage1 () {
        this.$emit('sendPersonmessage')
      }
    },
    created () {
      this.init()
    },
    mounted () {

    },
    components: {LoadBtn, agreementModal}
  }

</script>
<style lang="scss">
    @import "./login.scss";
</style>