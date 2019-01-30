<!--
****--@file     selfAccount.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  个人账户
-->

<template>
    <div class="selfAccount-root">
        <div class="selfAccount-manage">
            <h1>余额管理</h1>
            <ul class="selfAccount-manage-lastMoney clearfix">
                <li class="title-last">账户余额</li>
                <li class="last-money">{{account}}学币</li>
                <li>
                    <button @click="returnToAddMoney" class="orangeYellow">充值</button>
                </li>
            </ul>
            <b-history-list :selectTabChange="selectTabChange"></b-history-list>
        </div>
        <manage-vip :vipStatus="vipStatus" @manage="getInfo"></manage-vip>
        <!--充值学币-->
        <Modal
                :mask-closable="false"
                width="1000"
                v-model="ToAddMoneyModal"
                title="学币充值"
                :loading="loading">
            <modal-header slot="header" :content="ToAddMoney"></modal-header>
            <recharge-amount v-if="ToAddMoneyModal" @payMoney="init" @subCallback="subCallback"></recharge-amount>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    let Util
    import manageVip from './component/manageVip.vue'
    import bHistoryList from './component/bHistoryList.vue'
    import rechargeAmount from './../rechargeAmount/rechargeAmount.vue'
    import api from './api'

    export default {
        data() {
            return {
                loading: false,
                totalCount: 5,
                account: '',
                selectTabChange: 'true',
                bHistoryList: [],
                ToAddMoneyModal: false,
                ToAddMoney: {
                    id: 'ToAddMoneyId',
                    title: '学币充值'
                },
                alreadyVIP: 1,
                vipStatus: ''
            }
        },
        methods: {
            init() {
                Util = this.$util;
                let money = this.$store.getters['user/info']();
                if(money) {
                    this.account = money.b;
                    this.vipStatus = money.vipStatus;
                } else {
                    this.getInfo()
                }

            },
            getInfo() {
                this.ajax({
                    ajaxSuccess: res => {
                        this.account = res.data.b;
                        this.vipStatus = res.data.vipStatus;
                        this.$store.commit('user/updateInfo', res.data);
                    },
                    ajaxParams: {
//                        baseURL: 'MANAGER',
                        url: '/student/getMyInfo'
                    }
                })
            },
            returnToAddMoney() {
                this.ToAddMoneyModal = true
            },
            continueVIP() {
                this.alreadyVIP = 3
            },
            /**
             * 支付成功回调函数
             * @params target Boolean
             * title  msg 提示消息
             * */
            subCallback(target, title) {
                this.ToAddMoneyModal = !target;
                this.successMess(title);
                if(target) {
                    this.getInfo();
                    this.selectTabChange = 'false';
                }
            }

        },
        created() {
            this.init()
        },
        mounted() {
        },
        components: {
            rechargeAmount,
            manageVip,
            bHistoryList
        },
    }

</script>
<style lang="scss">
    @import "../css/selfAccount.scss";
</style>