<!--
****--@file     rechangeAmount.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe   充值
-->
<template>
    <div class="rechangeAmount-root">
        <!--<h1>充值</h1>-->
        <!--<p class="p-changAmount">充值</p>-->
        <div class="page-recharge">
            <p class="b-tip">{{bToRmb.b}}学币 = {{bToRmb.rmb}}人民币</p>
            <div class="clearfix">
                <div class="small-recharge" v-for="(item ,index) in list " :class="{active:clickBtn==index}"
                     @click="tab(item,index)">
                    <img class="img" width="26" src="../../../assets/images/money-1.png"/>{{item.money}}学币
                </div>
            </div>
            <el-form :rules="rules" ref="formValidate" :model="formValidate" class="demo-ruleForm">
                <el-form-item prop="money">
                    <el-radio v-model="clickBtn" label="6">自定义学币数量</el-radio>
                    <el-input v-if="clickBtn == 6" size="small" @change="zdyMoney"
                              v-model="formValidate.money"></el-input>
                </el-form-item>
            </el-form>
            <div style="clear: both"></div>
            <div class="clearfix" style="margin-top: 35px">
                <div class="pay" :class="{active:formValidate.payTypes=='0'}" @click="choicePayType('0')">
                    <img style="margin-top: -3px" src="../../../assets/images/payAli.png"/>
                </div>
                <div class="pay" :class="{active:formValidate.payTypes=='1'}" @click="choicePayType('1')">
                    <img style="margin-top: -3px" src="../../../assets/images/paywechat.png"/>
                </div>
            </div>
            <!--<load-btn class="sure" size="small" @listenSubEvent="sureButton" :btnData="loadBtn"></load-btn>-->
            <pay-ment :isShowWechatPay="isShowWechatPay" :payTypes="formValidate.payTypes"
                      :baseSrcWeChat="baseSrcWeChat" :currentPrice="currentPrice"></pay-ment>
            <div class="border"></div>
        </div>
        <!--<Modal-->
        <!--:mask-closable="false"-->
        <!--width="360"-->
        <!--v-model="reChargeMoney"-->
        <!--title="确定充值"-->
        <!--class-name="reCharge-money"-->
        <!--:loading="loading">-->
        <!--<modal-header slot="header" :content="reCharge"></modal-header>-->
        <!--<reChargeAlert v-if="reChargeMoney" @IknowAlready="IknowAlready"></reChargeAlert>-->
        <!--</Modal>-->
        <div style="height: 100px;width: 100px;" v-html="form"></div>
    </div>

</template>
<script>
    let Util
    import reChargeAlert from './reChargeAlert.vue'
    import payMent from '../../../components/common/payMent.vue'
    import baseRules from '../../../formRules/base'
    export default {
        data() {
            return {
                reCharge: {
                    id: 'reCharge',
                    title: '',
                },
                rules: {
                    money: [baseRules.numberSection(1, 10000)]
                },
                form:null,
                currentPrice: '',
                baseSrcWeChat: '',
                clickBtn: null,
                isShowWechatPay: false,
                loading: false,
                formValidate: {
                    money: '',
                    payTypes: '',
                },
                bToRmb: '',
                loadBtn: {title: '确认金额无误', callParEvent: 'listenSubEvent', size: 'small'},
                reChargeMoney: false,
                list: [{money: '50'}, {money: '100'}, {money: '200'}, {money: '300'}, {money: '400'}, {money: '500'},],
                times: null
            }
        },
        created() {
            Util = this.$util;
            let bToRmbStr = this.$store.getters['app/envs']('bToRmb')
            this.bToRmb = {
                b: bToRmbStr.split('=')[0],
                rmb: bToRmbStr.split('=')[1]
            };
        },
        methods: {
            /*
            * 选择充值类型
            * @param type String||Number  0为支付宝 1为微信
            * */
            choicePayType(type) {
                if(this.formValidate.money == '') {
                    this.errorMess('请选择充值金额！');
                    return false
                }
                this.formValidate.payTypes = type;
                if(this.times) {
                    clearInterval(this.times)
                }

                if (type=='0'){

                    this.sureButtons();
                } else {
                    this.sureButton();
                }

            },
            /*
      * 充值学币函数支付宝
      * */
            sureButtons() {
                console.log(this.formValidate.money)
                let re = /^[0-9]+$/;
                if(re.test(this.formValidate.money)) {
                    let opt = {
                        ajaxSuccess: res =>{
                            console.log(res.data)
                            this.form = res.data
                            this.$nextTick(() => {
                               document.getElementsByTagName('form')[1].submit()
                            })
                        },
                        ajaxParams: {
                            url: '/bHistory/inMoneyAlipay',
                            method: 'post',
                            data: {
                                bNumber: this.formValidate.money,
                                payTypes: this.formValidate.payTypes
                            }
                        }
                    };
                    console.log(opt)
                    this.ajax(opt)
                } else {
                    this.errorMess('充值数量只能为1-10000的正整数！');
                    return
                }
            },
            /*
            * 充值学币函数
            * */
            sureButton() {
                let re = /^[0-9]+$/;
                if(re.test(this.formValidate.money)) {
                    let opt = {
                        ajaxSuccess: res => this.toDoinMoney(res),
                        ajaxParams: {
                            url: '/bHistory/inMoney',
                            method: 'post',
                            data: {
                                bNumber: this.formValidate.money,
                                payTypes: this.formValidate.payTypes
                            }
                        }
                    };
                    this.ajax(opt)
                } else {
                    this.errorMess('充值数量只能为1-10000的正整数！');
                    return
                }
            },
            /*
            * 学币二维码生成成功回调函数
            * */
            toDoinMoney(res) {
                if(res.status.code == '0') {
                    this.baseSrcWeChat = 'data:image/png;base64,' + res.data.qrcode;
                    this.isShowWechatPay = true;
                    let that = this;
                    let PayResult = false;
                    this.times = setInterval(function() {
                        let opt = {
                            ajaxSuccess: res => {
                                if(res.data) {
                                    clearInterval(that.times);
                                    that.$emit('subCallback', res.data, '充值成功！')
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
            /*
            *获取支付结果
            * */

//            IknowAlready() {
//                this.reChargeMoney = false
//                this.$emit('payMoney')
//            },
            /*
            * 选择充值金额
            * */
            tab(value, index) {
                this.isShowWechatPay = false;
                this.formValidate.money = value.money;
                this.currentPrice = this.formValidate.money * this.bToRmb.rmb / this.bToRmb.b * 100;
                this.clickBtn = index;
            },
            /*
            * 自定义充值金额
            * @param val input改变值
            * */
            zdyMoney(val) {
                this.formValidate.money = val;
                this.currentPrice = val * this.bToRmb.rmb / this.bToRmb.b * 100;
            },

        },
        beforeDestroy() {
            if(this.times) {
                clearInterval(this.times)
            }
        },
        components: {
            reChargeAlert,
            payMent
        },

    }

</script>
<style lang="scss">
    .rechangeAmount-root {
        width: 950px;
        border-radius: 5px;
        background-color: #ffffff;
        padding-top: 40px;
        margin: 0 auto;
        .el-form-item__content {
            text-align: left;
        }
        .el-form-item {
            margin-top: 20px;
        }
        .el-input {
            width: 150px;
        }
        .pay {
            margin-top: 20px;
            border-radius: 5px;
            border: 1px solid #efefef;
            width: 179px;
            height: 47px;
            overflow: hidden;
            float: left;
            cursor: pointer;
            margin-left: 30px;
        }
        .active {
            border: 1px solid #11a63f !important;
            background: url(../../../assets/images/smailRight.png) no-repeat right top;
        }
        h1 {
            height: 35px;
            /*font-family: MicrosoftYaHei;*/
            font-size: 26px;
            padding-left: 30px;
            color: #313131;
            margin-bottom: 20px;
        }
        .p-changAmount {
            padding-left: 30px;
            font-size: 16px;

        }
        .page-recharge {
            margin: 0 auto;
            width: 890px;
            border-radius: 2px;
            border: solid 1px #e5e5e5;
            margin: 5px 0 0 30px;
            padding: 20px 50px;
            .b-tip {
                line-height: 40px;
                font-size: 13px;
                color: #495060;
            }
            .small-recharge {
                margin-right: 20px;
                width: 96px;
                height: 44px;
                line-height: 44px;
                border-radius: 2px;
                background-color: #ffffff;
                cursor: pointer;
                float: left;
                border: solid 1px #e5e5e5;
                .img {
                    position: relative;
                    top: 6px
                }
            }
            .font {
                float: left;
                margin-top: 30px;
                font-size: 16px;
                line-height: 30px;
            }
            .input {
                margin-top: 30px;
                margin-left: 21px;
                width: 96px;
                height: 30px;
                border-radius: 2px;
                padding: 0 3px;
            }
            .sure {
                width: 152px;
                height: 34px;
                border-radius: 19px;
                background-color: #fd7416;
                border: none;
                /*font-family: MicrosoftYaHei;*/
                font-size: 16px;
                color: #ffffff;
                margin-top: 130px;
                cursor: pointer;
            }
            .border {
                width: 500px;
                height: 2px;
                border: solid 1px #e5e5e5;
                margin-left: 165px;
                margin-top: 55px;
            }
            h2 {
                font-size: 26px;
                span {
                    color: #ef3f3f;
                }
            }
        }
        .pay-img {

            .img {
                border: 18px solid #eee;
                margin-top: 65px;
            }
            .img-pay-1 {
                margin-left: 27px;
                position: relative;
                top: -72px;
            }
        }

    }

    .reCharge-money .ivu-modal-close {
        display: none;
    }

    .reCharge-money .ivu-modal-header {
        display: none;
    }

    .reCharge-money .ivu-modal-footer {
        display: none;
    }

</style>
