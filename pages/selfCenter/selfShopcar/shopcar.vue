<!--
****--@file     shopcar.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  购物车详情
-->
<template>
    <div class="shopcar-root">
        <h1>收银台<span>{{orderData.totalPrice | money }}</span></h1>
        <div class="shopList" v-for="(item,index) in orderData.productList" :key="index">
            <p class="title">商品信息</p>
            <div class="shop">
                <div class="img"><img :src="resourceHttp + item.icon"
                                      onerror="javascript:this.src='/sasstudent/img/53.png'"/> 　　
                </div>
                <ul>
                    <li class="tag">{{item.title}}</li>
                    <li>试卷 <span>{{item.spec}}</span></li>
                    <li>{{item.press}}</li>
                </ul>
                <dl>
                    <dt><span class="close">{{item.currentPrice | money}}</span></dt>
                </dl>
            </div>

        </div>
        <div style="height: 100px;width: 100px;" v-html="form"></div>
        <p class="sel">选择支付方式</p>
        <div class="pay" :class="{active:payType=='0'}" @click="payAli">
            <img style="margin-top: -3px" src="../../../assets/images/payAli.png"/>
        </div>
        <div class="pay" :class="{active:payType=='1'}" @click="payMoney('1')">
            <img style="margin-top: -3px" src="../../../assets/images/paywechat.png"/>
        </div>
        <div style="clear: both"></div>
        <!--<button class="payright" @click="payMoney">-->
        <!--立即支付-->
        <!--</button>-->

        <pay-ment :isShowWechatPay="isShowWechatPay" :payTypes="payType" :baseSrcWeChat="baseSrcWeChat"
                  :currentPrice="orderData.totalPrice"></pay-ment>
        <commond></commond>
        <!--兑换弹窗-->
        <Modal
                :mask-closable="false"
                width="360"
                v-model="confirmModal"
                title="确认订购"
                :loading="loading">
            <modal-header slot="header" :content="confirm"></modal-header>

            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    let Util, payTimes = null
    import commond from './commond.vue'
    import api from './api'
    import payMent from '../../../components/common/payMent.vue'
    export default {
        data() {
            return {
                baseSrcWeChat: '',
                loading: false,
                confirmModal: false,
                confirm: {
                    id: 'confirmId',
                    title: '支付结果'
                },
                payType: '1',
                id: '',
                orderData: {},
                resourceHttp: '',
                isShowWechatPay: false,
              orderNo: '',
              form: null,
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                Util = this.$util;
                this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
                this.queryQptions = {
                    url: api.getOrder.path + '?id=' + this.$route.query.id,
                    method: api.getOrder.method,
                };
                this.order()
            },
            order(isLoading) {
                this.ajax({
                    ajaxSuccess: 'sendOrderId',
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            sendOrderId(res) {
                this.orderData = res.data;
                this.orderNo = res.data.no;
            },
          payAli () {
            this.ajax({
              ajaxSuccess: res => {
//                  if(res.status.code == '0') {
//                    this.baseSrcWeChat = 'data:image/png;base64,' + res.data;
//                    this.isShowWechatPay = true;
//                    let that = this;
//                    payTimes = setInterval(function() {
//                      that.getPaySuccess()
//                    }, 2500);
//                  }
//                  res.data.biz_content=JSON.stringify(res.data.biz_content);
//                  this.setUrl(res.data)
                this.form = res.data

                this.$nextTick(() => {
                  document.getElementsByTagName('form')[0].submit()
                })
              },
              ajaxParams: {
                url: api.payAli.path,
                method: api.payAli.method,
                data: {
                  orderId: this.$route.query.id,
                }
              },
            })
          },
          setUrl (val) {
//              let str='';
//              for(var i in val){
//                str+=(i+'='+val[i]+'&')
//              }
//              str= str.substring(0, str.length - 1);
//              console.log(str);
            this.form = res.data
//              return
            // window.location.href='https://openapi.alipaydev.com/gateway.do?'+str
          },
            payMoney(type) {
                if(payTimes) {
                    clearInterval(payTimes)
                }

                this.payType = type;
                this.ajax({
                    ajaxSuccess: res => {
                        if(res.status.code == '0') {
                            this.baseSrcWeChat = 'data:image/png;base64,' + res.data;
                            this.isShowWechatPay = true;
                            let that = this;
                            payTimes = setInterval(function() {
                                that.getPaySuccess()
                            }, 2500);
                        }
                    },
                    ajaxParams: {
                        url: api.payment.path,
                        method: api.payment.method,
                        data: {
                            orderId: this.$route.query.id,
                            payTypes: this.payType
                        }
                    },
                })
            },
            getPaySuccess() {
                let opt = {
                    ajaxSuccess: res => {
                        if(res.data) {
                            this.successMess('支付成功，跳转到我的订单！');
                            clearInterval(payTimes);
                            this.$router.push('/selfCenter/selfShopcar?index=')
                        }
                        ;
                    },
                    ajaxParams: {
                        url: '/pay/getPayResult',
                        method: 'get',
                        params: {
                            orderNo: this.orderNo
                        }
                    }
                };
                this.ajax(opt)
            }
        },
        beforeDestroy() {
            clearInterval(payTimes)
        },
        destroyed() {
            clearInterval(payTimes)
        },
        components: {
            commond,
            payMent
        },
    }
</script>
<style lang="scss">
    @import "css/shopcar.scss";

    .pay-money-wrap:hover {
        border-color: #ababab;
        border: 2px solid hsla(0, 0%, 67%, .5);
    }

    .pay-money-wrap {
        border: 2px solid #ababab;
        width: 910px;
        margin: 20px;
        position: relative;
        .product-icon {
            height: 28px;
            margin-left: 32px;
            display: inline-block;
            width: 28px;
            vertical-align: middle;
        }
        .earnname {
            width: 94px;
            font-size: 18px;
            display: inline-block;
            height: 56px;
            line-height: 56px;
        }
        .paynum {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 14px;
            padding-right: 18px;
            display: inline-block;
            height: 56px;
            line-height: 56px;
            .num {
                padding: 0 2px;
                color: #f5456e;
                vertical-align: baseline;
                font-size: 18px;
            }
        }
        .icon-aliPay {
            background: url('../../../assets/images/payMent.png') 0 -112px no-repeat;
        }
        .icon-wechatPay {
            background: url('../../../assets/images/payMent.png') 0 -167px no-repeat;
        }
        .pay-money {
            height: 300px;
            .img-wrap {
                float: left;
                width: 45%;
                height: 230px;
                padding: 32px 0;
                text-align: center;
                background: #fff;
            }
            .tip {
                float: left;
                position: relative;
                padding: 61px 0;
                width: 55%;
                height: 300px;
                background: #f4f4f4;
                h5 {
                    padding: 40px 0;
                    font: 700 20px/1.4 Microsoft YaHei;
                    text-align: center;
                    color: #999;
                }
                p {
                    text-align: center;
                    color: #999;
                }
            }
            .tip:after {
                content: "";
                position: absolute;
                top: 50%;
                left: -64px;
                margin-top: -48px;
                height: 0;
                overflow: hidden;
                border-top: 48px solid #fff;
                border-right: 32px solid #f4f4f4;
                border-bottom: 48px solid #fff;
                border-left: 32px solid #fff;
            }
        }
    }
</style>