<template>
    <div class="header">
        <!-- 顶部logo 登录注册 -->
        <div class="header-top-wrap">
            <div class="header-top">
                <div class="logo left">
                    <router-link to="/"><img src="../../assets/images/logo.png" alt="中小学自适应平台"></router-link>
                </div>
                <div class="login right" v-if="!$store.state.app.isLogin">
                    <span class="icon" style="margin-top: 2px"></span>
                    <router-link style="color: #727272;font-size: 14px" :to="{name:'login',query:{id:1}}">登录
                    </router-link>
                    <span style="font-size: 14px">&nbsp | &nbsp</span>
                    <router-link style="color: #727272;font-size: 14px" :to="{name:'login',query:{id:2}}">注册
                    </router-link>
                </div>
                <div class="login right" v-else style="color: #434343;font-size: 14px">
                    {{getUserName('nickname')}}
                    <router-link to="/selfCenter/systemMessage" style="color: #434343">
                        <i style="color: #ccc;position: relative" class="el-icon-bell">
                            <img src="../../assets/images/ling.png" style="position: absolute;left: 0;top: -2px;"/>
                            <div style="position: absolute;top:-6px;left: 10px;width: 22px;height: 15px;background: #fc4341;color: #fff;line-height: 15px;font-size: 12px;text-align: center;border-radius: 7px;">
                                {{numofMessage}}
                            </div>
                        </i>
                    </router-link>
                    <span style="color: #ccc;margin-left: 20px">|</span>
                    <span>
                        <router-link to="/selfCenter/selfCenterdetail" style="color: #434343">个人中心</router-link>
                    </span>
                    <span style="color: #ccc">|</span>
                    <span @click="exitLogin" class="loginOut">退出</span>
                </div>
                <!--<div class="search">-->
                <!--<input id="search-value" type="text" placeholder="请输入要搜索的课程">-->
                <!--<span id="search-btn"></span>-->
                <!--</div>-->
            </div>
        </div>
        <div class="topTitle" v-if="!hideMenu">
            <!--<div class="backImg">-->
            <!--<router-link to="/">-->
            <!--<div class="div"></div>-->
            <!--</router-link>-->
            <!--<router-link to="/evaluationByself" target="_blank">-->
            <!--<div class="div"></div>-->
            <!--</router-link>-->
            <!--<router-link to="/adaptiveEvaluation" target="_blank">-->
            <!--<div class="div"></div>-->
            <!--</router-link>-->
            <!--<router-link to="/troubleShooting">-->
            <!--<div class="div"></div>-->
            <!--</router-link>-->
            <!--<router-link to="/questionBank">-->
            <!--<div class="div"></div>-->
            <!--</router-link>-->
            <!--<router-link to="/subjectAssistantCenter">-->
            <!--<div class="div"></div>-->
            <!--</router-link>-->
            <!--<router-link to="/selfCenter/seeHistory">-->
            <!--<div class="div"></div>-->
            <!--</router-link>-->
            <!--<div class="backgroundImg">-->
            <!--</div>-->
            <!--</div>-->
            <!--头部菜单栏-->


            <ul class="menu-list clearfix">
                <li class="menu-item" style="margin-left: 85px">
                    <span><img class="hover" src="../../assets/images/menu-icon1.png" alt=""></span>
                    <router-link to="/">首页</router-link>
                </li>
                <li class="menu-item">
                    <span><img class="hover" src="../../assets/images/menu-icon2.png" alt=""></span>
                    <router-link to="/evaluationByself" target="_blank">自适应测评</router-link>
                </li>
                <li class="menu-item">
                    <span><img class="hover" src="../../assets/images/menu-icon3.png" style="margin-top: 8px;"
                               alt=""></span>
                    <router-link to="/adaptiveEvaluation" target="_blank">自选测评</router-link>
                </li>

                <li class="menu-item">
                    <span><img class="hover" src="../../assets/images/menu-icon5.png" alt=""></span>
                    <router-link to="/questionBank">题库选择</router-link>
                </li>
                <li class="menu-item">
                    <span><img class="hover" src="../../assets/images/menu-icon6.png" alt=""></span>
                    <router-link to="/subjectAssistantCenter">学科助手</router-link>
                </li>
                <li class="menu-item">
                    <span><img class="hover" src="../../assets/images/menu-icon7.png" alt=""></span>
                    <router-link to="/selfCenter/seeHistory">成长档案</router-link>
                </li>
                <li class="menu-item">
                    <span><img style="position: relative; top: 2px;" class="hover"
                               src="../../assets/images/menu-icon4.png" alt=""></span>
                    <router-link to="/troubleShooting">疑难解答</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
  let Util = null
  import api from './api'

  export default {
    props: ['hideMenu'],
    data () {
      return {
        name: '',
        numofMessage: 0
      }
    },
    computed: {},
    created () {
      this.init()
    },
    watch: {
      '$store.state.user.userMsgNumber': function () {
        if (this.$store.state.user.userMsgNumber) {
          this.init()
        }
      }
    },
    methods: {
      init () {
        Util = this.$util
        if (this.$store.state.app.isLogin) {
          this.name = this.$store.getters['user/info']('name') || this.$store.getters['user/info']('nickname')
          this.ajax({
            ajaxSuccess: this.getMsgSuccess,
            ajaxParams: {
              //baseURL:'PUBLIC',
              url: api.queryBadgeNums.path,
              method: api.queryBadgeNums.method,

            },
          })
        }
      },
      getMsgSuccess (res) {
        this.numofMessage = res.data
        this.$store.state.user.userMsgNumber = false
      },
      exitLogin () {
        this.$router.push({name: 'login'})
        setTimeout(() => {
          this.$util.loginOut(this)
        }, 200)
      },
    },
  }
</script>
<style lang="scss">

    /*.el-button{*/
    /*border: 1px solid #ccc;*/
    /*color: #898989;*/
    /*background: #fff;*/
    /*}*/
    /*.el-button:hover {*/
    /*background-color: #eeeeee;*/
    /*border: 1px solid #ccc !important;*/
    /*color: #898989 !important;*/
    /*}*/
    .el-progress.is-success .el-progress-bar__inner {
        background: #11a63f;
    }

    .header {
        .menu-item:hover .hover {
            -webkit-transform: rotate3d(0, 1, 0, 360deg);
            -moz-transform: rotate3d(0, 1, 0, 360deg);
            transform: rotate3d(0, 1, 0, 360deg);
            transition: -webkit-transform 0.8s ease-in-out;
            transition: -moz-transform 0.8s ease-in-out;
            transition: transform 0.8s ease-in-out;
        }

    }


    .header-menu {
        .menu-item {
            a {
                font-size: 15px;
            }
        }

    }

    .loginOut {
        cursor: pointer
    }

    .header {
        .topTitle {
            width: 100%;
            background-color: #11a63f
        }
        .backImg {
            width: 1200px;
            overflow: hidden;
            margin: 0 auto;
            .div {
                width: 171px;
                height: 56px;
                float: left;
            }
        }
        .backgroundImg {
            background: url('/sasstudent/img/header_02.jpg');
            width: 1900px;
            height: 56px;
            margin-left: -355px;

        }
    }

    .has-gutter tr th .cell {
        font-weight: bold;
    }

    .showDefaultButton:hover {
        background-color: #eeeeee !important;
        border: none;
        color: #5a5e66;
    }

    .orangeYellow {
        border: none;
        background-color: #fd7416 !important;
        color: #fff !important;
    }

    .orangeYellow:hover {
        border: none;
        color: #fff !important;
        background-color: #ec641c !important;
    }

    .whiteButton {
        border: 1px solid #ccc !important;
        color: #898989;

    }

    .yellowButton {
        border: none;
        color: #fff !important;
        background: #ff9f00 !important;
    }

    .yellowButton:hover {
        border: none;
        color: #fff !important;
        background: #f09300 !important;
    }

    .whiteButton:hover {
        background-color: #eeeeee !important;
        color: #898989 !important;
    }

    .greenButton {
        border: none;
        color: #fff !important;
        background: #11a63f !important;
    }

    .greenButton:hover {
        border: none;
        color: #fff !important;
        background: #14903a !important;

    }

    .el-select-dropdown__item.selected {
        color: #fff !important;
        background: #11a63f !important;
    }

    .el-pager li.active {
        background: #11A63F;
        color: #fff;
    }

    .el-pager li:hover {
        background: #eee;
        color: #2d2f33;
    }

    .el-form-item.is-success .el-input__inner {
        border-color: #b4bccc;
    }

    .el-input__inner:hover {
        border-color: #11A63F !important;
    }

    .el-radio__input.is-checked .el-radio__inner {
        border-color: #fd7416;
        background: #fd7416;
    }

    .el-radio__input.is-checked + .el-radio__label {
        color: #727272;
    }

    .el-radio__input.is-checked .el-radio__inner:hover {
        border-color: #11A63F;
        background: #11A63F;
    }

    .el-radio__input.is-checked + .el-radio__label:hover {
        color: #11A63F;
    }

    .el-radio__label:hover {
        color: #11A63F;
    }

    .el-tabs__item {
        font-size: 12px;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        background: #fff;
        border: 1px solid #dfe4ed;
        border-radius: 2px;
        border-bottom-color: #fff;
        position: relative;
        top: 1px;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item {
        border-left: none;
    }

    .el-tabs--card > .el-tabs__header {
        background: #f5f5f5;
    }

    .progressInner .el-progress-bar__innerText, .progressInner .el-progress__text {
        display: none;
    }

    .el-table__body-wrapper {
        overflow: hidden !important;
    }

    .el-table--border::after, .el-table--group::after, .el-table::before {
        background-color: #fff !important;
    }

    .el-table--border {
        border: none !important;
        border-bottom: 1px solid #e6ebf5 !important
    }

    .el-table__footer-wrapper, .el-table__header-wrapper {
        border-top: 1px solid #e6ebf5 !important;
    }

    .el-pager li {
        border-radius: 3px;
        cursor: pointer;
    }

    /*.el-pager li:hover{*/
    /*background: #11A63F;*/
    /*color: #fff;*/
    /*}*/
</style>
