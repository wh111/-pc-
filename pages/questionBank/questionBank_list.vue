<!--
****--@file     questionBank_list
****--@date     2017/12/20 上午10:51
****--@author   jhd
****--@describe   导航栏题库 列表
-->
<template>
    <div class="questionBank_list">
        <head-top></head-top>
        <div class="content">
            <p class="title">选题中心</p>
            <div class="choice-wrap">
                <p class="list">
                    <span class="label">年级</span>
                    <span :class="select.grade == ''?'active':''" @click="choice('grade','')">全部</span>
                    <span :class="select.grade == item ?'active':''" @click="choice('grade',item)"
                          v-for="item in 12">{{ item | grade(self) }}</span>
                </p>
                <p class="list">
                    <span class="label">学科</span>
                    <span :class="select.subject == ''?'active':''" @click="choice('subject','')">全部</span>
                    <span :class="select.subject == item.code?'active':''" @click="choice('subject',item.code)"
                          v-for="item in subjectList">{{ item.value }}</span>
                </p>
                <p class="list">
                    <span class="label">类别</span>
                    <span :class="select.types == ''?'active':''" @click="choice('types','')">全部</span>
                    <span @click="choice('types',item.code)" v-for="item in productTypeList"
                          :class="select.types == item.code?'active':''">{{ item.name }}</span>
                </p>
                <p class="list">
                    <span class="label">教材</span>
                    <span :class="select.textbookVersionId ==''?'active':''"
                          @click="choice('textbookVersionId','')">全部</span>
                    <span @click="choice('textbookVersionId',item.id)" v-for="item in textBookVersionList"
                          :class="select.textbookVersionId == item.id ?'active':''">{{ item.name }}</span>
                </p>
                <p class="list">
                    <span class="label">分类</span>
                    <span :class="select.productTypes == ''?'active':''" @click="choice('productTypes','')">全部</span>
                    <span @click="choice('productTypes',item.id)" v-for="item in goodType"
                          :class="select.productTypes == item.id?'active':''">{{ item.name }}</span>
                </p>
            </div>
            <div class="isNull" v-if="goodList.length == 0">
                <img src="../../assets/images/err.png" alt="">
            </div>
            <div v-else>
                <div class="good-list clearfix" v-for="item in goodList" :key="item.id">
                    <router-link target="_blank" :to="{path:'/questionBankDetail',query:{name:item.id}}">
                        <div class="img-wrap left">
                            <img :src="resourceHttp + item.icon" onerror="javascript:this.src='/sasstudent/img/53.png'"
                                 width="150" height="160" alt="">
                        </div>
                        <div class="tips left">
                            <p class="title">{{item.title}}</p>
                            <p class="press">{{item.press}}</p>
                            <p class="msg" v-if="item.remark">
                                {{item.remark}}</p>
                            <p class="msg" v-else>暂无</p>
                            <div class="other left">
                                <p>价格：
                                    <span v-if="item.productTypes == 0"
                                          class="price">{{item.currentPrice | money}}</span>
                                    <span v-else class="price">{{item.currentPrice == null ? '0' : item.currentPrice
                                        }}积分</span>
                                </p>
                                <p>规格：<span class="spec">试卷{{item.spec | isNullStr }}{{item.unit | unit }}</span>
                                    <span class="right">{{item.sales | isNullStr }}人已购买</span>
                                </p>
                            </div>
                        </div>
                    </router-link>
                    <div class="btn-wrap left">
                        <router-link target="_blank" :to="{path:'/questionBankDetail',query:{name:item.id}}">
                            <el-button>查看详情</el-button>
                        </router-link>
                        <el-button v-if="item.productTypes == 1" class="el-button-exchange"
                                   @click="confim(item.id,item.currentPrice)">立即兑换
                        </el-button>
                        <!--<router-link  target="_blank" :to="{path:'/selfcenter/shopcar',query:{id:item.id}}">-->
                        <el-button v-else class="el-button-exchange" @click="toPay(item)">立即购买</el-button>
                        <!--</router-link>-->
                    </div>

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

        </div>
        <footer-buttom></footer-buttom>
        <!--兑换弹窗-->
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
        <!--已购买订单列表弹窗-->
        <Modal
                :mask-closable="false"
                width="780"
                v-model="orderModal"
                title="您已购买过该商品"
                :loading="loading">
            <modal-header slot="header" :content="order"></modal-header>
            <order-list v-if="orderModal" @cancel="cancel" :orderList="orderList"
                        @order="subCallback"></order-list>
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
    </div>
</template>
<script>
  /*当前组件必要引入*/
  import headTop from '../../components/common/headTop.vue'
  import footerButtom from '../../components/common/footer.vue'
  import coConfirmModal from './questionBank_confrim.vue'
  import orderList from './components/orderList.vue'
  import api from './api'

  let Util = null
  export default {
    data () {
      return {
        self: this,
        productId: '',
        currentPrice: '',
        loading: false,
        confirmModal: false,
        confirm: {
          id: 'confirmId',
          title: '确认兑换',
        },
        orderList: [],
        orderModal: false,
        notPayModal: false,
        order: {
          id: 'orderId',
          title: '已购买订单',
        },
        totalCount: 10,
        select: {
          title: '',
          grade: '',
          subject: '',
          types: '',
          textbookVersionId: '',
          productTypes: '',
        },
        goodList: [],
        subjectList: [],
        productTypeList: [],
        textBookVersionList: [],
        goodType: [
          {
            name: '付费商品',
            id: '0'
          },
          {
            name: '积分商品',
            id: '1'
          }
        ],
        formValidate: {
          title: '',//商品标题
          textbookVersionId: '',//教材版本id
          subject: '',//科目
          grade: '',//年级
          productTypes: '',//商品类型
          types: ''//商品类别
        },
        resourceHttp: ''
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        if (!this.$store.getters['app/isLogin']) {
          let opt = {
            ajaxSuccess: res => {
              this.$store.commit('app/initEnvs', res.data)
              this.resourceHttp = this.$store.getters['app/envs']('resourceHttp')
              this.subjectList = this.$store.getters['app/envs']('gradeMap')[12]
              this.productTypeList = this.$store.getters['app/envs']('productTypeList')
              this.textBookVersionList = this.$store.getters['app/envs']('textBookVersionList')
              this.myPages = Util.pageInitPrams
              this.queryQptions = {
                url: api.getProductlist.path,
                params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
              }
              this.setTableData()
            },
            ajaxParams: {
              url: '/envs'
            }
          }
          this.ajax(opt)
        } else {
          this.resourceHttp = this.$store.getters['app/envs']('resourceHttp')
          this.subjectList = this.$store.getters['app/envs']('gradeMap')[12]
          this.productTypeList = this.$store.getters['app/envs']('productTypeList')
          this.textBookVersionList = this.$store.getters['app/envs']('textBookVersionList')
          this.myPages = Util.pageInitPrams
          this.queryQptions = {
            url: api.getProductlist.path,
            params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
          }
          this.setTableData()
        }
      },
      /*
      * 设置表格数据
      * @param isLoading Boolean 是否加载
      */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.select)
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      listDataSuccess (res) {
        this.goodList = res.data.dataList
        this.totalCount = res.data.totalCount
      },
      confim (id, price) {
        this.currentPrice = price
        this.productId = id
        this.openModel('confirm')
      },
      choice (type, id) {
        this.select[type] = id
        if (type == 'grade') {
          this.subjectList = this.$store.getters['app/envs']('gradeMap')[id || 1]
        }
        this.setTableData()
      },
      /*
      * 监听子组件通讯的方法
      * 作用:根据不同的参数关闭对应的模态
      * @param targer string example:"add"、"edit"
      * */
      cancel (targer) {
        this[targer + 'Modal'] = false
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
      subCallback (target, title, updata) {
        target && this.cancel(target)
        title && this.successMess(title)
        if (!updata) {
          this.setTableData()
        }
      },
      /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
      openModel (options) {
        this[options + 'Modal'] = true
      },
      //立即购买
      toPay (shop) {
        let that = this
        this.ajax({
          ajaxSuccess: res => {
            if (res.status.code == '0') {
              if (shop.currentPrice <= 0) {
                this.successMess('购买成功')

              } else {
                that.$router.push(`/selfcenter/shopcar?id=${res.data.id}`)
              }

            }
          },
          error: res => {
            if (res.status.code == '56') {
              this.orderList = res.data
              this.openModel('order')
            } else if (res.status.code == '4') {
              this.$util.setStore('loginGo', `/questionBankDetail?name=${id}`)
            } else {
              this.openModel('notPay')
            }
          },
          ajaxParams: {
            url: api.toOrder.path,
            method: api.toOrder.method,
            data: {
              productIds: shop.id
            }
          }
        })
      }

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      headTop,
      footerButtom,
      coConfirmModal,
      orderList
    },
  }

</script>
<style lang="scss">
    .questionBank_list {
        background: #efefef;
        .content {
            background: #ffffff;
            width: 1200px;
            border-radius: 5px;
            margin: 28px auto 52px auto;
            padding: 15px 35px 35px 35px;
            .title {
                font-size: 26px;
                color: #313131;
                text-align: left;
                font-weight: inherit;
                height: 55px;
            }
            .choice-wrap {
                background-color: rgba(17, 166, 63, 0.03);
                box-shadow: 0 2px 4px 0 rgba(209, 209, 209, 0.5);
                border: solid 1px #11a63f;
                padding: 20px;
                .list {
                    line-height: 30px;
                    .label {
                        font-size: 16px;
                        font-weight: bold;
                        font-style: normal;
                        text-align: left;
                        color: #434343;
                        margin-right: 20px;
                    }
                    span {
                        font-size: 14px;
                        text-align: left;
                        color: #434343;
                        cursor: pointer;
                        margin-left: 15px;
                    }
                    .active {
                        color: #11a63f;
                        font-weight: bold;
                    }
                }

            }
            .good-list {
                padding: 35px 0;
                border-bottom: 1px solid #e5e5e5;;
                .img-wrap {
                    padding: 8px 5px;
                    border: solid 1px #e5e5e5;
                }
                .tips {
                    width: 800px;
                    margin-left: 20px;
                    .title {
                        font-size: 16px;
                        font-weight: bold;
                        text-align: left;
                        color: #313131;
                    }
                    .press {
                        font-size: 12px;
                        text-align: left;
                        color: #313131;
                    }
                    .msg {
                        font-size: 14px;
                        margin-top: 8px;
                        width: 690px;
                        letter-spacing: -0.3px;
                        text-align: left;
                        color: #1a1a1a;
                        padding: 5px 0;
                    }
                    .other {
                        padding: 0 10px;
                        width: 300px;
                        height: 60px;
                        background-color: #f8f8f8;
                        p {
                            font-size: 12px;
                            line-height: 30px;
                            text-align: left;
                            color: #9c9c9c;
                        }
                        .price {
                            font-size: 14px;
                            font-weight: bold;
                            text-align: right;
                            color: #ef3f3f;
                        }
                        .spec {
                            font-size: 14px;
                            text-align: left;
                            color: #313131;
                        }
                    }
                }
                .btn-wrap {
                    width: 140px;
                    padding: 45px 0;
                    .el-button {
                        float: right;
                        border: 1px solid #fd7416;
                        color: #fd7416;
                        margin-top: 10px;
                    }
                    .el-button-exchange {
                        background: #fd7416;
                        color: #ffffff;
                    }
                    .exchange {
                        margin-top: 20px;
                    }
                    .el-button:hover {
                        background: #ffffff;
                    }
                    .el-button-exchange:hover {
                        background: #fd7416;
                        color: #ffffff;
                    }
                }
            }
        }
        .modal-content {

        }

    }
</style>