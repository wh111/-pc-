<!--
****--@file     manageVip
****--@date     2018/1/3 上午11:01
****--@author   jhd
****--@describe   会员管理
-->
<template>
    <div>
        <div class="selfAccount-manage manage-VIP">
            <h1 v-if="alreadyVIP==2||alreadyVIP==1">
                会员管理
                <p style="margin-left: 270px" v-if="vipStatus == 1">
                    会员到期：{{vipExpireTime | formatDate('yyyy-MM-dd HH:mm')}}</p>
            </h1>
            <h1 v-if="alreadyVIP==3">会员续订</h1>
            <h1 v-if="alreadyVIP==4">办理会员</h1>
            <div class="manage-button" v-if="vipStatus != 1">
                <button @click="PayToVip" class="orangeYellow">办理会员</button>
            </div>
            <div id="myTable2" style="width: 890px;margin: 0 auto" class="historyOfrecharge"
                 v-show="alreadyVIP==2||alreadyVIP==1">
                <p>充值记录
                    <button v-if="vipStatus == 1" @click="PayToVip" class="orangeYellow">会员续订</button>
                </p>
                <el-table sortable="custom" align="center" border :height="440"
                          :data="HistoryList" tooltip-effect="dark" style="width: 100%">
                    <!--<el-table-column type="selection" width="55"></el-table-column>-->
                    <el-table-column
                            prop="deadline"
                            label="续订时长"
                            align="center">
                        <template slot-scope="scope">
                            {{scope.row.deadline}}个月
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="续订时间"
                            align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime | formatDate('yyyy-MM-dd HH:mm')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="endTime"
                            label="到期时间"
                            align="center"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.endTime | formatDate('yyyy-MM-dd HH:mm')}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination" style="padding-top: 20px;height: 50px" v-if="alreadyVIP == 2 || alreadyVIP == 1">
                <div style="text-align: center">
                    <el-pagination
                            @size-change="changePageSizeVip"
                            @current-change="changePageVip"
                            :current-page.sync="myPagesVip.currentPage"
                            :page-size="myPagesVip.pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!--会员列表--->
        <Modal
                :mask-closable="false"
                width="860"
                v-model="VipModal"
                title="确认订购"
                :loading="loading">
            <modal-header slot="header" :content="vipConfirm"></modal-header>
            <vipList v-if="VipModal" @subCallback="subCallback"></vipList>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    import vipList from './VipList.vue'
    import api from '../api'

    export default {
        props: ['vipStatus'],
        data() {
            return {
                loading: false,
                VipModal: false,
                vipConfirm: {
                    id: 'vipConfirmId',
                    title: '充值会员',
                },
                totalCount: 0,
                confirmModal: false,
                confirm: {
                    id: 'confirmId',
                    title: '确认支付',
                },
                vipExpireTime: '',
                formValidate: {
                    payTypes: '1',
                    deadline: '0'
                },
                loadBtn: {title: '确认支付', callParEvent: 'listenSubEvent', size: 'small'},
                VipList: [],
                HistoryList: [],
                manageLastMoney: 1,
                alreadyVIP: 1,
                multipleSelection: [],
                currentPrice: '0'
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.vipExpireTime = this.$store.getters['user/info']('vipExpireTime');
                this.myPagesVip = Util.pageInitPrams
                this.queryQptionsVip = {
                    url: api.queryHistoryList.path,
                    params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
                };
                this.setTableDataVip();
            },
            continueVIP() {//会员续订
//                this.alreadyVIP = 3;
                this.VipModal = true;
            },
            /*
            * 设置表格数据
            * @param isLoading Boolean 是否加载
            */
            setTableDataVip(isLoading) {
                this.ajax({
                    ajaxSuccess: 'listDataSuccessVip',
                    ajaxParams: this.queryQptionsVip
                }, isLoading)
            },
            listDataSuccessVip(res) {
                this.HistoryList = res.data.dataList;
                this.totalCount = res.data.totalCount
            },
            changePageSizeVip(n) {
                let pageSize = this.queryQptionsVip.params && (this.queryQptionsVip.params.pageSize = n) || (this.queryQptionsVip.pageSize = n);
                pageSize = n;
                this.setTableDataVip();
            },
            changePageVip(n) {
                let curPage = (this.queryQptionsVip.params && (this.queryQptionsVip.params.curPage = n) || (this.queryQptionsVip.curPage = n));
                this.setTableDataVip();
            },
            /*
            * 列表数据只能选择一个
            * @param isOnly true  是否只选择一个
            */
            isSelected() {
                let len = this.multipleSelection.length;
                let flag = true;
                if(len == 0) {
                    this.errorMess("请选择数据!");
                    flag = false;
                }
                if(len > 1) {
                    this.errorMess("只能选择一条数据!")
                    flag = false;
                }
                return flag;
            },
            /**
             * 弹窗回调函数
             * */
            listenSubEvent(isLoadingFun) {
                if(!isLoadingFun) isLoadingFun = function() {
                };
                isLoadingFun(true);
                let opt = {
                    error: res => {
                        this.errorMess(res.status.code)
                    },
                    ajaxSuccess: res => {
                        this.successMess('开通成功！');
                        this.confirmModal = false;
                        this.$emit('manage');
                        this.alreadyVIP = 1;
                        this.setTableDataVip();
                    },
                    ajaxParams: {
                        url: api.vipPayment.path,
                        method: api.vipPayment.method,
                        data: this.formValidate
                    }
                }
                this.ajax(opt, isLoadingFun)
            },
            /**
             * 支付成功回调函数
             * @params target Boolean
             * title  msg 提示消息
             * */
            subCallback(target, title) {
                this.VipModal = !target;
                this.successMess(title)
                if(target) {
                    this.setTableDataVip();
                }
            },
            PayToVip() {
//                this.alreadyVIP = 4;
                this.VipModal = true;
            },
            
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            vipList
        }
    }

</script>
<style lang="scss">
    .manage-VIP {
        padding: 10px;
    }
</style>
