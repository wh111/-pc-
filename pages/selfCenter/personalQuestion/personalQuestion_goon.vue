<!--
****--@file     personalQuestion_goon
****--@date     2017/12/12 下午2:13
****--@author   jhd
****--@describe   继续练习
-->
<template>
    <div class="personal-question ">
        <template v-if="productData instanceof Object">
            <div class="question-detail">
                <div class="img-wrap">
                    <img :src="resourceHttp + productData.icon" onerror="javascript:this.src='/sasstudent/img/53.png'"
                         alt="">
                </div>
                <div class="tip-wrap">
                    <p class="name">{{productData.title}}</p>
                    <p class="price p" v-if="productData.productTypes == 1">
                        价格：<span><b> {{productData.currentPrice}}积分</b></span>
                    </p>
                    <p class="price p" style="margin-top: 10px" v-else>
                        价格：<span><b> {{productData.currentPrice | money}}</b></span></p>
                    <p class="p">出版社：<span>{{productData.press}}</span></p>
                    <p class="unit p">试卷：{{productData.spec}}</p>
                    <el-button style="background: #c9c9c9;color: #ffffff;height: 40px;font-size: 14px;width: 110px;border: none;
margin-top: 10px" :disabled="true" size="small">已购买
                    </el-button>
                </div>
            </div>
        </template>
        <template v-else>
            <p class="errMsg">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
        </template>
        <ul class="test-paper" style="min-height: 400px">
            <template v-if="questionList.length">
                <li class="item" v-for="(item,index) in questionList" :key="index"
                    style="width: 890px;margin-left: 30px;position: relative;">
                    <p class="question-item-title">
                        <span class="orange">已购买</span>
                        <span class="time">{{item.name}}</span>
                    </p>
                    <div class="question-item-content">
                        <div class="img-wrap">
                            <img :src="resourceHttp + productData.icon" onerror="javascript:this.src='/sasstudent/img/53.png'"
                                 alt="">
                        </div>
                        <div class="tip-wrap" style="position:absolute;left: 95px;top: 55px;">
                            <p>卷号：{{item.no}}</p>
                            <p>总分：<span> {{item.paperScore}} 分</span></p>
                            <p>题数：{{item.questionNums}}</p>
                        </div>
                        <div class="btn-wrap">
                            <router-link v-if="item.seq && item.seq != item.questionNums"
                                         :to="{path:`/toDoQuestions/${productId}/${item.id}`,query:{type}}">
                                <el-button type="success" class="greenButton"
                                           style="height: 40px;font-size: 14px;width: 110px">继续答题 >
                                </el-button>
                            </router-link>
                            <el-button class="greenButton" style="height: 40px;font-size: 14px;width: 110px"
                                       v-else-if="item.seq == item.questionNums" type="success" @click="show(item)">查看试卷
                            </el-button>
                            <router-link v-else class="greenButton"
                                         :to="{path:`/toDoQuestions/${productId}/${item.id}`,query:{type}}">
                                <el-button type="success">开始答题 ></el-button>
                            </router-link>
                        </div>
                        <div class="btn-wrap" style="padding:25px 30px 26px 30px">
                            进度：{{Number(percentage[index].toFixed(1))}}%
                            <el-progress class="progressInner" style="width: 100px;" :text-inside="true" :stroke-width="8"
                                         :percentage="Number(percentage[index].toFixed(1))" status="success"></el-progress>
                        </div>

                    </div>
                </li>
            </template>
            <p v-else-if="productData instanceof Object" style="text-align: center;line-height: 440px">暂无试卷</p>
        </ul>
        <div class="pagination" v-if="questionList.length">
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
        <!--查看试卷-->
        <Modal :mask-closable="false" width="810" v-model="showModal" title="查看试卷" class-name="vertical-center-modal"
               :loading="loading">
            <modal-header slot="header" :content="showId"></modal-header>
            <show v-if="showModal" :typeId="id" :params="params" :types="1"></show>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null;
  import show from '../../../components/common/questionsPaper_show.vue';
  import api from './api';

  export default {
    data () {
      return {
        totalCount: 2,
        showId: {
          id: 'showId',
          title: '查看试卷'
        },
        id: '',
        loading: false,
        productData: null,
        questionList: [],
        resourceHttp: '',
        percentage: [],
        productId: null,
        params: {
          productId: '',
          papersId: ''
        },
        type: ''
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
        let {productId, type} = this.$route.query;
        this.productId = productId;
        this.type = type;
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          url: api.queryPaperList.path + this.productId,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        };
        this.setTableData();
        this.ajax({
          ajaxSuccess: res => {
            this.productData = res.data;
          },
          ajaxParams: {
            url: api.getProductDetail.path + this.productId
          }
        });
      },
      /**
       * 查看试卷
       *
       * ***/
      show (val) {
        this.id = val.id;
        this.params = {
          productId: this.productId,
          papersId: val.id
        };
        this.showModal = true;
      },
      /*
      * 设置表格数据
      * @param isLoading Boolean 是否加载
      */
      setTableData (isLoading) {
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      listDataSuccess (res) {
        this.questionList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        let that = this;
        this.questionList.map(function (item, index) {
          if (item.seq) {
            that.percentage.push(item.answerNums / item.questionNums * 100);
          } else {
            that.percentage.push(0);
          }
        });
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      show
    }
  };

</script>
<style lang="scss">
    @import "../css/personalQuestion";

    .errMsg {
        line-height: 470px;
        text-align: center;
    }
</style>
