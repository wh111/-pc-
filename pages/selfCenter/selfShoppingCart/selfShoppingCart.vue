<!--
****--@file     selfShoppingCart
****--@date     2017/12/22 上午10:57
****--@author   jhd
****--@describe   个人中心购物车
-->
<template>
    <div class="self-shopping-cart">
        <p class="title">购物车</p>
        <div class="shopList">
            <div class="shop-header">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
                <span style="margin-left: 160px">商品信息</span>
                <span style="margin-left: 260px">价格</span>
                <span style="margin-left: 200px">操作</span>
            </div>
            <el-checkbox-group v-model="checkedShops" @change="handleCheckedShopsChange">
                <div class="isNull" v-if="shopList.length == 0">
                    <!--<img src="../../../assets/images/isnull.png" alt="">-->
                    <p class="tips" style="padding-top: 260px">您的购物车是空的</p>
                </div>
                <div v-else class="shop-item" v-for="(item,index) in shopList" :key="item.id">
                    <div class="item-head">
                        <el-checkbox :disabled="item.status == 3" :key="item.id" :label="item.id"></el-checkbox>
                        <span class="right">下单时间：{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                    </div>
                    <div class="item-content clearfix">
                        <div class="left info">
                            <img class="img-wrap left" :src="resourceHttp + item.icon"
                                 onerror="javascript:this.src='/sasstudent/img/53.png'" width="110"/>
                            <div class="msg left">
                                <p class="name">{{item.title}}</p>
                                <p class="tip">试卷 {{item.spec}}{{item.unit}}</p>
                                <p class="tip">{{item.press}}</p>
                                <p class="already">{{item.sales}}人已购买 |  {{item.commentNum}}人已评价</p>
                            </div>
                        </div>
                        <div class="btn-wrap right">
                            <span v-if="item.status != 3" class="remove" @click="remove(item.id)">删除</span>
                            <span v-else class="">商品已下架</span>
                        </div>
                        <p class="price right"> {{item.currentPrice | money }}</p>
                    </div>
                </div>
            </el-checkbox-group>
            <div class="total" v-if="shopList.length">
                <span style="margin-top: 8px" class="left" @click="removeProduct">删除</span>
                已选 <span>{{this.num}}件</span> 商品，合计<span class="span">{{this.total | money}}</span>元
                <button :class="checkedShops.length == 0 ? 'disabled' : ''" :disabled="checkedShops.length == 0"
                        @click="pay"> 结算
                </button>
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
        </div>
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
        <!--删除购物车-->
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
    /*当前组件必要引入*/
    let Util = null
    import orderList from '../../questionBank/components/orderList.vue'
    import api from "./api"

    export default {
        data() {
            return {
                loading: false,
                title: '',
                postOption: {},
                removeModal: false,
                resourceHttp: '',
                removeId: {
                    id: 'removeId',
                    title: '删除购物车'
                },
                orderList: [],
                orderModal: false,
                notPayModal: false,
                order: {
                    id: 'orderId',
                    title: '已购买订单',
                },
                totalCount: 5,
                checkAll: false,
                checkBox: [],//复选框数组
                shopList: [],
                checkedShops: [],
                isIndeterminate: false,
                total: 0,
                productIds1: [],
                num: 0,
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.cartList.path,
                    params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize},
                }
                this.setTableData()
            },
            setTableData(isLoading) {
                this.ajax({
                    ajaxSuccess: 'listDataSuccess',
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            listDataSuccess(res) {
                this.shopList = res.data.dataList;
                this.totalCount = res.data.totalCount;
                let that = this
                this.shopList.map(function(item) {
                    that.checkBox.push(item.id)
                })
            },
            handleCheckAllChange(val) {//全选
                this.checkedShops = val
                    ? this.checkedShops = Util._.defaultsDeep([], this.checkBox)
                    : this.checkedShops = []
                this.isIndeterminate = false
                this.total = 0;
                this.proudctIds = [];
                this.num = this.checkedShops.length;
                let that = this
                this.checkedShops.map(function(item) {
                    that.shopList.map(function(child) {
                        item == child.id ? that.total += child.currentPrice : that.total = that.total
                    })
                })
            },
            handleCheckedShopsChange(value) {
                let that = this
                this.total = 0;
                this.proudctIds = [];
                this.num = value.length;
                value.map(function(item) {
                    that.shopList.map(function(child) {
                        child.id == item ? that.total += child.currentPrice : that.total = that.total;
                    })
                });
                this.checkedShops = value;
                this.checkAll = this.checkedShops.length === this.shopList.length;
                this.isIndeterminate = this.checkedShops.length > 0 && this.checkedShops.length < this.shopList.length;
            },
            remove(id) {//删除
                this.title = '确定删除购物车？';
                this.postOption = {
                    data: {productId: id},
                    api: api.cartRemove,
                    msg: '删除购物车'
                }
                this.removeModal = true;
                this.setTableData();
            },
            removeProduct() {
                if(this.checkedShops.length == 0) {
                    this.errorMess('请选择需要删除的商品！');
                    return false
                }
                let id = this.checkedShops.join();
                this.title = '确定删除选中的商品？';
                this.postOption = {
                    data: {productId: id},
                    api: api.cartRemove,
                    msg: '删除选中商品'
                }
                this.removeModal = true;
                this.checkedShops = [];
                this.isIndeterminate = false;
                this.total = 0;
                this.num = 0;
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
                if(!updata) {
                    this.setTableData();
                }
            },
            /*
            * 打开指定的模态窗体
            * @param options string 当前指定的模态:"add"、"edit"
            * */
            openModel(options) {
                this[options + 'Modal'] = true;
            },
            pay() {
                let ids = this.checkedShops.join();
                console.log(ids)
                let that = this;
                this.ajax({
                    ajaxSuccess: res => {
                        if(res.status.code == '0') {
                            that.$router.push(`/selfcenter/shopcar?id=${res.data.id}`)
                        }
                    },
                    error: res => {
                        if(res.status.code == '56') {
                            this.orderList = res.data;
                            this.openModel('order')
                        } else {
                            this.openModel('notPay')
                        }
                    },
                    ajaxParams: {
                        url: '/order/toOrder',
                        method: 'post',
                        data: {
                            productIds: ids
                        }
                    }
                })
            },
        },
        created() {
            this.init()
        },
        mounted() {
        },
        components: {
            orderList,
        },
    }

</script>
<style lang="scss">
    .self-shopping-cart {
        background: #ffffff;
        border-radius: 5px;
        width: 950px;
        padding: 30px;
        .el-checkbox-group {
            min-height: 600px;
        }
        .title {
            color: #313131;
            font-size: 26px;
        }
        .shop-header {
            font-size: 13px;
            text-align: left;
            color: #434343;
        }
        .shop-item {
            margin-top: 15px;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background: #fd7416;
            border-color: #fd7416;
        }
        .el-checkbox__inner:hover {
            border-color: #fd7416;
        }
        .item-head {
            width: 890px;
            line-height: 40px;
            background-color: #efefef;
            .el-checkbox {
                margin-left: 20px;
                .el-checkbox__label {
                    display: none;
                }
            }
            span {
                margin-right: 40px;
                font-size: 12px;
                text-align: left;
                color: #727272;
            }
        }
        .item-content {
            font-size: 12px;
            border: 1px solid #f5f5f5;
            border-top: none;
            .info {
                padding: 15px;
            }
        }
        .msg {
            margin-left: 20px;
            .name {
                font-size: 14px;
                font-weight: bold;
                text-align: left;
                color: #434343;
                margin-top: 10px;
            }
            .tip {
                font-size: 12px;
                text-align: left;
                color: #b5b5b5;
            }
            .already {
                color: #434343;
                margin-top: 10px;
            }
        }
        .price {
            width: 230px;
            line-height: 140px;
            color: #ef3f3f;
            text-align: center;
            border-left: 1px solid #f5f5f5;
        }
        .btn-wrap {
            width: 220px;
            text-align: center;
            line-height: 140px;
            border-left: 1px solid #f5f5f5;
            .remove {
                cursor: pointer;
            }
        }
        .total {
            text-align: right;
            width: 890px;
            height: 40px;
            background-color: #efefef;
            margin: 10px 0;
            .disabled {
                background-color: #ffffff;
                color: #000;
                border: 1px solid #fd7416;
                cursor: default;
            }
            button {
                cursor: pointer;
                width: 88px;
                height: 40px;
                background-color: #fd7416;
                font-size: 14px;
                font-weight: bold;
                color: #ffffff;
                border: none;
                margin-left: 30px;
            }
            span {
                color: #ef3f3f;
            }
            .span {
                font-weight: bold;
            }

        }
    }
</style>
