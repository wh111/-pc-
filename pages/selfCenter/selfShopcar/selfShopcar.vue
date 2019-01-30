<!--
****--@file     signShopcar.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  个人购物车
-->
<template>
    <div class="selfShopcar-root">
        <div class="groupsSelect">
            <div class="groupsLeft" :class="{active:selectTab==''}" @click="change('')">全部订单</div>
            <div class="groupsRight" :class="{active:selectTab=='0'}" @click="change('0')">未付款订单</div>
            <div class="groupsLeft" :class="{active:selectTab=='1'}" @click="change('1')">已付款订单</div>
            <div class="groupsRight" :class="{active:selectTab=='2'}" @click="change('2')">已取消订单</div>
            <div class="groupsRight" :class="{active:selectTab=='3'}" @click="change('3')">积分订单</div>
        </div>
        <div class="orderList-wrap" style="min-height: 526px;width: auto">
            <div v-for="(item,index) in orderList" :key="index">
                <div class="shopList">
                    <p class="title">
                        订单编号:{{item.no}} <b style="margin:0  20px;">|</b>
                        下单时间:{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}
                        <span><el-button v-if="item.status ==0 && item.restTime > 0"
                                         @click="removeOrder(item.id)">取消订单</el-button></span>
                        <span v-if="item.status == 0 && item.restTime > 0">剩余付款时间： <span></span> {{ timeArr[index] | formatHours
                            }} </span>
                    </p>
                    <div class="shop" v-for="(child,ind) in item.productList" :key="ind">
                        <div class="img"><img :src="resourceHttp + child.icon"
                                              onerror="javascript:this.src='/sasstudent/img/53.png'"/> 　　
                        </div>
                        <ul>
                            <li class="tag">{{child.title}}<span class="num"><span v-if="child.sales">{{child.sales
                                }}</span><span v-else>0</span>人已购买
                                <span class="shu">|</span> {{child.commentNum}}条评价</span></li>
                            <li>{{child.prudectTypes}}<span>{{child.spec}}{{child.unit}}</span></li>
                            <li>{{child.press}}</li>
                        </ul>
                        <dl style="margin-top: 20px" v-if="item.status ==0 && item.restTime > 0">
                            <dt>{{child.currentPrice | money}}</dt>
                            <dd>
                                <router-link style="color: #fff"
                                             :to="{path:'/selfcenter/shopcar',query:{id:item.id}}">
                                    <button class="orangeYellow">立即付款</button>
                                </router-link>
                            </dd>
                            <!--<dd style="color: #434343;line-height: 44px;cursor: pointer" >-->
                            <!---->
                            <!--</dd>-->
                        </dl>
                        <dl v-if="item.status ==1 && item.orderTypes == 0">
                            <dt><span class="close">{{child.currentPrice | money}}</span></dt>
                            <dd>支付成功</dd>
                        </dl>
                        <dl v-else-if="item.status == 2 || item.restTime < 0">
                            <dt><span class="close">{{child.currentPrice | money}}</span></dt>
                            <dd><span style="color: #b5b5b5">交易关闭</span></dd>
                        </dl>
                        <dl v-else-if="item.orderTypes == 1">
                            <dt><span class="close">{{child.currentPrice}}积分</span></dt>
                            <dd>兑换成功</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <shopcar v-if="status==6"></shopcar>
        </div>

        <div class="pagination">
            <div style="text-align: center">
                <el-pagination
                        @size-change="changePageSize"
                        @current-change="changePage"
                        :current-page.sync="myPages.currentPage"
                        :page-size="myPages.pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <!--<commond></commond>-->
        <Modal :mask-closable="false" width="400" v-model="removeModal" class-name="vertical-center-modal"
               :loading="loading">
            <modal-header slot="header" :content="removeId"></modal-header>
            <todo-comfirm @close="closeDialog" @confirm="confirmDialog" :title="title"
                          :postOption="postOption"></todo-comfirm>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import shopcar from './shopcar.vue'
    import commond from './commond.vue'
    import api from './api'

    let Util = null;
    export default {
        data() {
            return {
                loading: false,
                title: '',
                postOption: {},
                removeId: {
                    id: 'removeId',
                    title: '取消订单'
                },
                removeModal: false,
                selectTab: this.$route.query.index || '',
                status: 1,
                commond: [],
                formValidate: {
                    status: ''
                },
                totalCount: 0,
                orderList: [],
                rest: {
                    time: ''
                },
                times: null,
                timeArr: [],
                resourceHttp: ''
            }
        },
        created() {
            this.init();
//            if(payTimes!='unde') {
//                clearInterval(payTimes)
//            }
//            ;
        },
        methods: {
            init() {
                Util = this.$util;
                this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.orderList.path,
                    params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize},
                }
                this.setTableData();
            },
            change(i) {
                this.selectTab = i;
                this.status = i;
                if(this.selectTab == 3) {
                    this.formValidate = {
                        orderTypes: '1',
                        status: ''
                    }
                } else if(this.selectTab == '') {
                    this.formValidate = {
                        status: ''
                    }
                } else {
                    this.formValidate = {
                        orderTypes: '0',
                        status: this.selectTab
                    }
                }
                this.setTableData()
            },
            setTableData(isLoading) {
                delete this.queryQptions.params.status;
                delete this.queryQptions.params.orderTypes;
                Object.assign(this.queryQptions.params, this.formValidate);
                this.ajax({
                    ajaxSuccess: 'listDataSuccess',
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            listDataSuccess(res) {
                if(this.times) {
                    clearInterval(this.times)
                }
                this.orderList = res.data.dataList;
                this.countDown(this.orderList)
                this.totalCount = res.data.totalCount
            },
            settimeFn(langtime) {//改变时间
                let that = this
                let arr = [];
                this.orderList.map(item => {
                    let ordertime = item.createTime + 1000 * 60 * 60 * 24;
                    let nowTime = new Date().getTime();
                    let restTime = ordertime - nowTime;
                    if(restTime > 1000 * 60 * 60 * 24) {
                        item.restTime = (1000 * 60 * 60 * 24 - langtime);
                        if(item.restTime > 0) {
                            arr.push(item.restTime)
                        }
                    } else {
                        item.restTime = (restTime - langtime);
                        if(item.restTime > 0) {
                            arr.push(item.restTime)
                        }
                    }
                });
                this.timeArr = arr;
            },

            toDateStr() {

            },
            countDown() {//倒计时
                let that = this;
                this.settimeFn(1000);
                this.times = setInterval(function() {
                    if(that.timeArr.length > 0) {
                        let arr = [];
                        that.timeArr.map(item => {
                            arr.push(item - 1000)
                        });
                        that.timeArr = arr;
                    } else {
                        clearInterval(that.times)
                    }
                }, 1000)
            },
            removeOrder(id) {
                this.title = '确定取消该订单吗？';
                this.postOption = {
                    data: {orderId: id},
                    api: api.orderCancel,
                    msg: ''
                }
                this.removeModal = true;
            },
            //操作弹窗执行成功回调函数
            closeDialog() {
                this.removeModal = false;
                this.setTableData()
            },
            //取消操作弹窗回调函数
            confirmDialog() {
                this.removeModal = false;
            },
            cancelOrder(id) {
                console.log(id)
            },
        },
        beforeDestroy() {
            if(this.times) {
                clearInterval(this.times)
            }
        },
        components: {
            shopcar,
            commond,

        },
    }
</script>
<style lang="scss">
    @import "../css/selfShopcar.scss";
</style>