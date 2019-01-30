<!--
****--@file     VipList
****--@date     2018/1/9 下午7:48
****--@author   jhd
****--@describe   vip充值弹窗
-->
<template>
    <div class="vip-List">
        <div id="vip-ul-wrap" class="historyOfrecharge">
            <p>会员价格</p>
            <ul class="clearfix">
                <li v-for="(item,index) in VipList" :key="index" class="vip-item"
                    :class="formValidate.deadline == item.deadline ? 'vip-item-active' : ''" @click="choiceVip(item)">
                    <p class="currentPrice">现价：{{item.currentPrice | money}}</p>
                    <p class="originalPrice">原价：{{item.originalPrice | money}}</p>
                    <span class="deadline">
                        <i>
                            {{item.deadline}}个月
                        </i>
                    </span>
                </li>
            </ul>
            <div class="continue-submitOrder">
                共 <span>{{formValidate.deadline}}</span>个月 会员，合计 <span>{{currentPrice | money}}</span>元
                <!--<button @click="vipPayment">确认订购</button>-->
            </div>
        </div>
        <div class="confirm-wrap-pay">
            <div class="clearfix">
                <div class="pay left" :class="{active:formValidate.payTypes=='0'}"
                     @click="sureButtons">
                    <img style="margin-top: -3px" src="../../../../assets/images/payAli.png"/>
                </div>
                <div class="pay left" :class="{active:formValidate.payTypes=='1'}"
                     @click="payMoney('1') ">
                    <img style="margin-top: -3px" src="../../../../assets/images/paywechat.png"/>
                </div>
            </div>
        </div>
        <div style="height: 100px;width: 100px;" v-html="form"></div>
        <pay-ment :isShowWechatPay="isShowWechatPay" :baseSrcWeChat="baseSrcWeChat" :payTypes="formValidate.payTypes"
                  :currentPrice="currentPrice"></pay-ment>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from '../api'
    import payMent from '../../../../components/common/payMent.vue'

    let Util = null
    export default {
        data() {
            return {
                currentPrice: '',
                formValidate: {
                    payTypes: '',
                  deadline: '0'
                },
                VipList: [],
                baseSrcWeChat: '',
                isShowWechatPay: false,
              times: null,
              form: null,
              month: null,
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.getVipList()
            },

            choiceVip(val) {
                this.formValidate.deadline = val.deadline;
                this.currentPrice = val.currentPrice;
              this.month = val.deadline
                this.isShowWechatPay = false;
            },
            /*
             * checkbox 选择后触发事件
             * @param val Array 存在所有的选择每一个行数据
             */
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if(this.multipleSelection.length > 1) {
                    this.errorMess("只能选择一条数据!")
                } else if(this.multipleSelection.length == 1) {
                    this.formValidate.deadline = this.multipleSelection[0].deadline;
                    this.currentPrice = this.multipleSelection[0].currentPrice;
                } else {
                    this.formValidate.deadline = '0';
                    this.currentPrice = '0'
                }
            },
            /*
            * 获取vip价格
            * */
            getVipList() {
                this.ajax({
                    ajaxSuccess: res => {
                        this.VipList = res.data
                    },
                    ajaxParams: {
                        url: api.vipConfigList.path
                    }
                })
            },
          sureButtons () {
            let re = /^[0-9]+$/
            if (re.test(this.currentPrice)) {
              let opt = {
                ajaxSuccess: res => {
                  console.log(res.data)
                  this.form = res.data
                  this.$nextTick(() => {
                    document.getElementsByTagName('form')[0].submit()
                  })
                },
                ajaxParams: {
                  url: '/vip/paymentAlipay',
                  method: 'post',
                  data: {
                    deadline: this.month
                  }
                }
              }
              console.log(opt)
              this.ajax(opt)
            } else {
              this.errorMess('请选择充值时间！')
              return
            }
          },
            payMoney(type) {
                if(this.formValidate.deadline == '') {
                    this.errorMess('请选择开通会员类型！');
                    return false
                }
                ;
                this.formValidate.payTypes = type;
                if(this.times) {
                    clearInterval(this.times)
                }
                ;
                this.ajax({
                    ajaxSuccess: res => {
                        if(res.status.code == '0') {
                            this.baseSrcWeChat = 'data:image/png;base64,' + res.data.qrcode;
                            this.isShowWechatPay = true;
                            let that = this;
                            this.times = setInterval(function() {
                                let opt = {
                                    ajaxSuccess: res => {
                                        if(res.data) {
                                            clearInterval(that.times);
                                            that.$emit('subCallback', res.data, '开通会员成功！')
                                        }
                                        ;
                                    },
                                    ajaxParams: {
                                        url: '/pay/getPayResult',
                                        method: 'get',
                                        params: {
                                            orderNo: res.data.orderNo
                                        }
                                    }
                                }
                                that.ajax(opt)
                            }, 2500);
                        }
                    },
                    ajaxParams: {
                        url: api.vipPayment.path,
                        method: api.vipPayment.method,
                        data: this.formValidate
                    }
                })
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        beforeDestroy() {
            if(this.times) {
                clearInterval(this.times)
            }
        },
        components: {
            payMent
        }
    }

</script>
<style lang="scss">
    .vip-List {
        #vip-ul-wrap {
            .vip-item {
                position: relative;
                float: left;
                margin-right: 7px;
                width: 200px;
                height: 80px;
                border: 1px solid #ddd;
                p {
                    text-align: center;
                }
                .currentPrice {
                    color: #ff6e1e;
                    height: 35px;
                    padding-top: 18px;
                    font-size: 16px;
                }
                .originalPrice {
                    height: 18px;
                    margin-top: 5px;
                    font-size: 12px;
                    color: #666;
                }
                .deadline {
                    height: 76px;
                    line-height: 16px;
                    padding: 0 7px 0 8px;
                    right: 13px;
                    top: 0px;
                    position: absolute;
                    display: table;
                    width: 16px;
                    font-size: 12px;
                    color: #333;
                    background-color: #ededed;
                    i {
                        line-height: 16px;
                        display: table-cell;
                        vertical-align: middle;
                    }
                }
            }
            .vip-item-active {
                border: 2px solid #ff6e1e;
            }
        }
        .confirm-wrap-pay {
            margin-top: 20px;
            .pay {
                border-radius: 5px;
                border: 1px solid #efefef;
                width: 179px;
                height: 47px;
                overflow: hidden;
                float: left;
                margin-left: 30px;
            }
            .active {
                border: 1px solid #1cc03b;
            }
            p {
                text-align: center;
                margin: 20px;
            }
            .price {
                font-size: 20px;
                span {
                    color: #ef3f3f;
                    font-size: 22px;
                }
            }
        }
        .continue-submitOrder {
            height: 40px;
            padding-right: 20px;
            background-color: #efefef;
            line-height: 40px;
            font-size: 16px;
            text-align: right;
            margin-top: 10px;
            span {
                color: #ef3f3f;
            }
            button {
                margin-left: 10px;
                border-radius: 0;
                height: 40px;
            }
        }
    }
</style>
