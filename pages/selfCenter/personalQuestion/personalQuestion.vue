<!--
****--@file     personalQuestion
****--@date     2017/12/11 下午5:10
****--@author   jhd
****--@describe   我的题库
-->
<template>
    <div class="personal-question">
        <ul class="clearfix type">
            <li :class="showType == 1 ? 'active' : ''" @click="showTypeCall('1')">专题库</li>
            <li :class="showType == 2 ? 'active' : ''" @click="showTypeCall('2')">错题 & 收藏</li>
            <li :class="showType == 3 ? 'active' : ''" @click="showTypeCall('3')">我的笔记</li>
        </ul>
        <!--专题库-->
        <div v-if="showType == 1">
            <template v-if="questionList instanceof Array">
                <div class="selfMyhomework">
                    <el-tabs v-model="type" type="card" @tab-click="init">
                        <el-tab-pane class="el-tab-pane" label="我的题库" name="my"></el-tab-pane>
                        <el-tab-pane class="el-tab-pane" label="教师专题库" name="teacher"></el-tab-pane>
                    </el-tabs>
                </div>
                <div class="isNull" v-if="questionList.length == 0">
                    <img src="../../../assets/images/isnull.png" alt="">
                    <p class="tips">暂无对应专题库</p>
                </div>
                <ul v-else class="question-wrap">
                    <li v-if="type=='my'" class="item" v-for="(item,index) in questionList" :key="index">
                        <p class="question-item-title">
                            <span class="orange">已购买</span>
                            <span class="time">{{item.paymentTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                        </p>
                        <div class="question-item-content">
                            <div class="img-wrap">
                                <img :src="getStaticPath(item.icon)" onerror="javascript:this.src='/sasstudent/img/53.png'"
                                     alt="">
                            </div>
                            <div class="tip-wrap">
                                <p class="name">{{item.title}}</p>
                                <p class="price" v-if="item.productTypes != '1'">价格：<span> {{item.currentPrice | money
                                    }}</span></p>
                                <p class="price" v-else>价格：<span> {{item.currentPrice || 0 }}积分</span></p>
                                <p class="unit">试卷：{{item.spec}}</p>
                            </div>
                            <dd class="btn-wrap">
                                <router-link :to="{path:'/selfCenter/personalQuestion_goon',query:{productId:item.id,type}}">
                                    <el-button style="height: 40px;width: 110px;font-size: 14px;" class="greenButton"
                                               type="success">开始练习 >
                                    </el-button>
                                </router-link>
                                <el-button v-if="item.commentStatus == 0"
                                           style="margin-left: 5px;height: 40px;width: 50px;padding:0"
                                           class="whiteButton" size="small" @click="evaluate(item)">
                                    <span style="margin-left: -3px;font-size: 14px">  评价</span>
                                </el-button>
                                <el-button v-else style="margin-left: 5px;height: 40px" size="small" :disabled="true">
                                    <span style="font-size: 14px">已评价</span>
                                </el-button>
                            </dd>
                        </div>
                    </li>
                    <li v-if="type=='teacher'" class="item" v-for="(item,index) in questionList" :key="index"
                        style="width: 890px;position: relative;">
                        <p class="question-item-title">
                            <span class="orange" style="color:#495060">{{item.name}}</span>
                            <!--<span class="time">{{item.name}}</span>-->
                        </p>
                        <div class="question-item-content">
                            <div class="tip-wrap" style="position:absolute;left: 23px;top: 55px;">
                                <p>卷号：{{item.no}}</p>
                                <p>总分：<span> {{item.paperScore}} 分</span></p>
                                <p>题数：{{item.questionNums}}</p>
                            </div>
                            <div class="btn-wrap">
                                <router-link v-if="item.answerNums && item.answerNums != item.questionNums"
                                             :to="{path:`/toDoQuestions/${item.id}/${item.id}`,query:{type}}">
                                    <el-button class="greenButton"
                                               style="height: 40px;font-size: 14px;width: 110px">继续答题 >
                                    </el-button>
                                </router-link>
                                <el-button class="greenButton" v-else-if="item.answerNums === item.questionNums"
                                           @click="showPaper(item)" style="height: 40px;font-size: 14px;width: 110px">
                                    查看试卷
                                </el-button>
                                <router-link v-else
                                             :to="{path:`/toDoQuestions/${item.id}/${item.id}`,query:{type}}">
                                    <el-button style="height: 40px;font-size: 14px;width: 110px" class="greenButton"
                                               type="success">开始答题 >
                                    </el-button>
                                </router-link>
                            </div>
                            <div class="btn-wrap" style="padding:25px 30px 26px 30px">
                                进度：{{Number(percentage[index])}}%
                                <el-progress style="width: 100px" :text-inside="true" :stroke-width="18"
                                             :percentage="Number((percentage[index]||0).toFixed(1))"
                                             status="success"></el-progress>
                            </div>

                        </div>
                    </li>
                </ul>
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
            </template>
            <template v-else>
                <p class="errMsg">
                    <span class="el-icon-loading"></span>
                    数据加载中
                </p>
            </template>
        </div>
        <!--错题收藏-->
        <div v-if="showType == 2">
            <erroror-collection></erroror-collection>
        </div>
        <!--我的笔记-->
        <div v-if="showType == 3">
            <my-note></my-note>
        </div>
        <!--评价商品-->
        <Modal
                :mask-closable="false"
                width="700"
                v-model="evaluateModal"
                title="评价商品"
                class-name="vertical-center-modal"
                :loading="loading">
            <modal-header slot="header" :content="evaluateId"></modal-header>
            <evaluate v-if="evaluateModal" :productData="productData" @cancel="cancel" @evaluate="subCallback"
                      :productId="productId"></evaluate>
            <div slot="footer"></div>
        </Modal>
        <!--查看试卷-->
        <Modal :mask-closable="false" width="810" v-model="showModal" title="查看试卷" class-name="vertical-center-modal"
               :loading="loading">
            <modal-header slot="header" :content="showId"></modal-header>
            <show v-if="showModal" :typeId="showId" :types="6"></show>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null;
  import api from './api';
  import myNote from './myNote/myNote.vue';
  import errororCollection from './errororCollection/errororCollection.vue';
  import evaluate from './personalQuestion_evaluate.vue';
  import show from '../../../components/common/questionsPaper_show.vue';

  export default {
    data () {
      return {
        type: this.$route.query.type || 'my',
        totalCount: 7,
        loading: false,
        productData: {},
        showType: '1',
        questionList: null,
        loadBtn: {title: '继续练习 >'},
        evaluateModal: false,
        evaluateId: {
          id: 'evaluateId',
          title: '评价'
        },
        showId: {
          id: 'showId',
          title: '查看试卷'
        },
        productId: '',
        formValidate: {
          title: '',
          textbookVersionId: '',
          subject: '',
          grade: '',
          productTypes: '',
          types: ''
        },
        percentage: [],
        showId: '',
        showModal: false,
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.myPages = Util.pageInitPrams;
        if (this.type == 'my') {
          this.queryQptions = {
            url: api.myProductList.path,
            params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
          };
        } else {
          this.queryQptions = {
            url: api.teacherProductList.path,
            params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
          };
        }

        this.setTableData();
      },
      /*
      * 设置表格数据
      * @param isLoading Boolean 是否加载
      */
      setTableData (isLoading) {
        this.questionList = [];
        Object.assign(this.queryQptions.params, this.formValidate);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      listDataSuccess (res) {
        let percentage = [];
        this.questionList = res.data.dataList;
        this.totalCount = res.data.totalCount;
        if (this.type == 'teacher') {
          res.data.dataList.map(item => {
            percentage.push(Number(((item.answerNums / item.questionNums) * 100).toFixed(2)));
            console.log(item);
          });
        }
        console.log(percentage);
        this.percentage = percentage;
      },

      /**
       * 评价
       * **/
      evaluate (value) {
        this.productData = value;
        this.productId = value.id;
        this.evaluateModal = true;
      },
      /*
      * 监听子组件通讯的方法
      * 作用:根据不同的参数关闭对应的模态
      * @param targer string example:"add"、"edit"
      * */
      cancel (targer) {
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
      subCallback (target, title, updata) {
        target && this.cancel(target);
        title && this.successMess(title);
        if (!updata) {
          this.setTableData();
        }
      },
      /*
      * 打开指定的模态窗体
      * @param options string 当前指定的模态:"add"、"edit"
      * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      /**
       * 题库类型
       * **/
      showTypeCall (index) {
        this.showType = index;
      },
      // 查看试卷
      showPaper (obj) {
        this.showId = obj.id;
        this.openModel('show');
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      evaluate,
      myNote,
      errororCollection,
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

    .personal-question {
        .question-wrap {
            min-height: 552px;

        }
        .isNull {
            min-height: 552px;
        }
        .selfMyhomework {
            margin-top: 30px;
            width: 920px;
            padding: 0 0 0px 30px;
            border-radius: 5px;
            background: #ffffff;
            .el-tabs__nav-scroll {
                padding-left: 20px;
                /*background: #f5f5f5;*/
            }
        }
    }

</style>
