<!--
****--@file     questionBank_detail
****--@date     2017/12/20 下午3:47
****--@author   jhd
****--@describe   题库 详情
-->
<template>
    <div class="questionBank-detail">
        <head-top></head-top>
        <div class="questionBank-detail-content clearfix">
            <div class="detail-left left">
                <div class="detail-top clearfix">
                    <div class="top-img left">
                        <img :src="resourceHttp + detailData.icon" onerror="javascript:this.src='/sasstudent/img/53.png'"
                             width="180" alt="">
                    </div>
                    <div class="top-content left">
                        <p class="name">{{detailData.title}}</p>
                        <p class="type">规格：{{detailData.spec}}{{detailData.unit | unit }}试卷</p>
                        <div class="press">{{detailData.press}}</div>
                        <p class="price">
                            <span v-if="detailData.productTypes == '0'">{{detailData.currentPrice | money}}</span>
                            <span v-else>{{detailData.currentPrice}}积分</span>
                        </p>
                        <p class="btn-wrap">

                            <!--<router-link target="_blank" :to="{path:'/selfcenter/shopcar',query:{id:detailData.id}}">-->
                            <el-button v-if="detailData.productTypes == '0'" class="pay orangeYellow"
                                       @click="pay(detailData.id)">
                                立即购买
                            </el-button>
                            <el-button v-else class="pay orangeYellow"
                                       @click="toConfirm(detailData.id,detailData.currentPrice)">
                                立即兑换
                            </el-button>
                            <!--</router-link>-->
                            <!--<router-link target="_blank"-->
                            <!--:to="{path:'/selfcenter/selfShoppingCart',query:{id:detailData.id}}">-->
                            <el-button class="car" v-if="detailData.productTypes == '0'"
                                       @click="addCart(detailData.id)">加入购物车
                            </el-button>
                            <!--</router-link>-->
                        </p>
                        <p class="msg">
                            {{detailData.sales}}人已购买<span>|</span>{{detailData.commentNum}}人已评价
                        </p>
                    </div>
                </div>
                <ul class="get-type clearfix">
                    <li :class="types == 1? 'active':''" @click="type('1')">课程详情</li>
                    <li :class="types == 2? 'active':''" @click="type('2')">课程评价</li>
                </ul>
                <div v-if="types == 1" class="detail-content">
                    <p class="detail-title">
                        <span class="span"></span>
                        <span class="tip">课程介绍</span>
                    </p>
                    <p class="detail-msg" v-if="detailData.remark">{{detailData.remark}}</p>
                    <p class="detail-msg" v-else>暂无介绍</p>
                    <p class="detail-title">
                        <span class="span"></span>
                        <span class="tip">课程内容</span>
                    </p>
                    <p class="detail-msg" v-if="detailData.content">{{detailData.content}}</p>
                    <p class="detail-msg" v-else>暂无课程内容介绍</p>
                    <p class="detail-title">
                        <span class="span"></span>
                        <span class="tip">课程目标</span>
                    </p>
                    <p class="detail-msg" v-if="detailData.target">{{detailData.target}}</p>
                    <p class="detail-msg" v-else>暂无课程目标介绍</p>
                    <p class="detail-title">
                        <span class="span"></span>
                        <span class="tip">课程优势</span>
                    </p>
                    <p class="detail-msg" v-if="detailData.advantage">{{detailData.advantage}}</p>
                    <p class="detail-msg" v-else>暂无课程优势介绍</p>
                </div>
                <evaluate-list :productId="detailData.id" v-if="types == 2"></evaluate-list>
            </div>
            <div class="detail-right left">
                <p class="hot">热门推荐</p>
                <ul class="hot-ul">
                    <li class="hot-li" v-for="item in queryHotList">
                        <router-link target="_blank" :to="{name:'questionBankDetail',query:{name:item.id}}">
                            <img :src="resourceHttp + item.icon" onerror="javascript:this.src='/sasstudent/img/53.png'"
                                 width="80" height="111" alt="">
                            <div class="topic">
                                <p>{{item.title | sliceText(12, '...')}}</p>
                                <p class="red">
                                    <span v-if="item.productTypes == '0'">{{item.currentPrice | money}}</span>
                                    <span v-else>{{item.currentPrice}}积分</span>
                                </p>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <footer-buttom></footer-buttom>
        <!--已购买订单列表弹窗-->
        <Modal
                :mask-closable="false"
                width="780"
                v-model="orderModal"
                title="您已购买过该商品"
                :loading="loading">
            <modal-header slot="header" :content="order"></modal-header>
            <order-list v-if="orderModal" @cancel="cancel" :orderList="orderList"></order-list>
            <div slot="footer"></div>
        </Modal>
        <!--存在未支付订单-->
        <Modal
                :mask-closable="false"
                width="780"
                v-model="notPayModal"
                title="您有未支付订单"
                :loading="loading">
            <modal-header slot="header" :content="order"></modal-header>
            <div v-if="notPayModal" style="padding: 20px 0;">
                <p class="modal-btn" style="text-align: center">
                    <el-button @click="notPayModal = false">取消</el-button>
                    <router-link :to="{path:'/selfCenter/selfShopcar',query:{index:0}}">
                        <el-button type="primary">前往支付</el-button>
                    </router-link>
                </p>
            </div>
            <div slot="footer"></div>
        </Modal>
        <Modal
                :mask-closable="false"
                width="360"
                v-model="confirmModal"
                title="确认订购"
                :loading="loading">
            <modal-header slot="header" :content="confirm"></modal-header>
            <co-confirm-modal v-if="confirmModal" :productId="productId" :currentPrice="currentPrice" @cancel="cancel"
                              @confirm="subCallback"></co-confirm-modal>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import headTop from '../../components/common/headTop.vue'
    import footerButtom from '../../components/common/footer.vue'
    import evaluateList from './components/evaluate_list.vue'
    import coConfirmModal from './questionBank_confrim.vue'
    import orderList from './components/orderList.vue'
    //引入api
    import api from './api'

    let Util = null
    export default {
        data() {
            return {
                confirmModal: false,
                confirm: {
                    id: 'confirmId',
                    title: '确认兑换',
                },
                productId: "",
                currentPrice: '',
                resourceHttp: '',
                queryHotList: [],
                loading: false,
                orderModal: false,
                notPayModal: false,
                order: {
                    id: 'orderId',
                    title: '已购买订单',
                },
                orderList: [],
                detailData: {},
                types: 1,
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
                this.queryQptions = {
                    url: api.getDetail.path + this.$route.query.name,
                };
                this.setTableData();
                this.ajax({
                    ajaxSuccess: res => {
                        this.queryHotList = res.data
                    },
                    ajaxParams: {
                        url: api.queryHotList.path,
                        params: {
                            id: this.$route.query.name
                        }
                    }
                })
            },
            type(id) {
                this.types = id
            },
            setTableData(isLoading) {
                this.ajax({
                    ajaxSuccess: 'listDataSuccess',
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            listDataSuccess(res) {
                this.detailData = res.data;
            },
            toConfirm(id, price) {
                this.currentPrice = price;
                this.productId = id;
                this.openModel('confirm')
            },
            addCart(id) {//添加值购物车
                if(this.$store.getters['app/isLogin']) {
                    this.ajax({
                        ajaxSuccess: res => {
                            this.successMess('添加购物车成功！')
                        },
                        error: res => {
//                        console.log(res)
                        },
                        ajaxParams: {
                            url: api.cartAdd.path,
                            method: api.cartAdd.method,
                            data: {
                                productId: id
                            }
                        }
                    })
                } else {
                    this.$util.setStore('loginGo', `/selfCenter/selfShoppingCart`);
                    this.$util.setStore('addCartId', id);
                    this.errorMess('查看购物车，需要登录！');
                    this.$router.push({name: 'login'});
                }
            },
            pay(id) {
                let that = this;
                this.ajax({
                    ajaxSuccess: res => {
                      console.log(res)
                        if(res.status.code == '0') {
                            that.$router.push(`/selfcenter/shopcar?id=${res.data.id}`)
                        }
                    },
                    error: res => {
                        if(res.status.code == '56') {
                            this.orderList = res.data;
                            this.openModel('order')
                        } else if(res.status.code == '4') {
                            this.$util.setStore('loginGo', `/questionBankDetail?name=${id}`);
                        } else {
                            this.openModel('notPay')
                        }
                    },
                    ajaxParams: {
                        url: api.toOrder.path,
                        method: api.toOrder.method,
                        data: {
                            productIds: id
                        }
                    }
                })
            },
            /*
            * 监听子组件通讯的方法
            * 作用:根据不同的参数关闭对应的模态
            * @param targer string example:"add"、"edit"
            * */
            cancel(targer) {
                this[targer + 'Modal'] = false;
            },
            /*
            * 监听子组件通讯的方法
            * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
            * @param targer string example:"add"、"edit"
            * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
            * 例如:errorTitle、errorTitle
            *addMessTitle:{
            *    type:'add',
            *    successTitle:'添加成功!',
            *    errorTitle:'添加失败!',
            *    ajaxSuccess:'ajaxSuccess',
            *    ajaxError:'ajaxError',
            *    ajaxParams:{
            *      url:'/role/add',
            *      method:'post'
            *    }
            *    }
            * @param udata boolean 默认false  是否不需要刷新当前表格数据
            * */
            subCallback(target, title, updata) {
                target && this.cancel(target);
                title && this.successMess(title);
            },
            /*
            * 打开指定的模态窗体
            * @param options string 当前指定的模态:"add"、"edit"
            * */
            openModel(options) {
                this[options + 'Modal'] = true;
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            headTop,
            footerButtom,
            evaluateList,
            orderList,
            coConfirmModal
        },
    }

</script>
<style lang="scss">
    .questionBank-detail {
        background-color: #efefef;
    }

    .questionBank-detail-content {
        width: 1200px;
        margin: 0 auto;
        padding: 30px 0;
        .detail-left {
            width: 950px;
            padding: 30px 30px 0 30px;
            border-radius: 5px;
            background: #ffffff;
            .hot {
                font-size: 16px;
                text-align: left;
                color: #313131;
            }
        }
        .hot-ul {
            .hot-li {
                margin-top: 20px;
                width: 178px;
                height: 162px;
                text-align: center;
                border: solid 1px #e5e5e5;
                img {
                    margin: 0 auto;
                }
                .topic {
                    padding: 3px 10px;
                    background: #efefef;
                    p {
                        text-align: left;
                        font-size: 12px;
                        color: #434343;
                    }
                    .red {
                        color: #ef3f3f;
                    }
                }
            }
        }
        .detail-top {
            .top-img {
                padding: 8px;
                border: solid 1px #e5e5e5;
            }
        }
        .top-content {
            margin-left: 25px;
            .name {
                font-size: 16px;
                font-weight: bold;
                text-align: left;
                line-height: 30px;
                color: #313131;
            }
            .type {
                font-size: 14px;
                text-align: left;
                color: #b5b5b5;
            }
            .press {
                font-size: 14px;
                margin: 10px 0 25px 0;
                text-align: left;
                color: #313131;
            }
            .btn-wrap {
                .el-button {
                    color: #ffffff;
                    border: none;
                }
                .pay {
                    background: #11a63f;
                }
                pay:hover {
                    background: #11a63f;
                }
                .car {
                    background: #fd7416;
                }
                .car:hover {
                    background: #fd7416;
                }
            }
            .price {
                font-size: 16px;
                line-height: 30px;
                text-align: left;
                color: #ef3f3f;
            }
            .msg {
                font-size: 12px;
                margin-top: 15px;
                text-align: left;
                color: #b5b5b5;
            }
        }
        .get-type {
            width: 890px;
            margin-top: 50px;
            background: #e5e5e5;
            border-bottom: 2px solid #fd7416;
            li {
                float: left;
                font-size: 14px;
                color: #727272;
                text-align: center;
                width: 100px;
                line-height: 40px;
                cursor: pointer;
            }
            .active {
                color: #ffffff;
                border-radius: 2px;
                background-color: #fd7416;
            }
        }
        .detail-content {
            padding-bottom: 40px;
            .detail-title {
                margin-top: 50px;
                color: #313131;
                font-size: 20px;
                position: relative;
                .span {
                    width: 5px;
                    height: 18px;
                    background: #fd7416;
                    margin: 5px 10px 3px 0;
                }
                .tip {
                    position: absolute;
                    top: -2px;
                }
                span {
                    display: inline-block;
                }
            }
            .detail-msg {
                padding: 0 30px;
                font-size: 14px;
                line-height: 1.86;
                text-align: left;
                color: #434343;
            }
        }
        .detail-right {
            width: 230px;
            margin-left: 20px;
            border-radius: 5px;
            padding: 20px;
            background: #ffffff;
        }
    }
</style>
