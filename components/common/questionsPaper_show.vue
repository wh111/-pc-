<!--
****--@file     questionsPaper_show
****--@date     2017/12/14 下午3:25
****--@author   jhd
****--@describe   查看试题
-->
<template>
    <div class="questionsPaper_show">
        <p class="paper-title" v-if="questionsData.paperName">{{ questionsData.paperName }}</p>
        <template v-if="questionsList && questionsList.length">
        <div class="question-item-wrap" v-for="(item,index) in questionsList" :key="index">
            <div>
                <span class="index">第{{ getSeq(item) }}题</span>
                <div class="progress-wrap">
                    <co-progress class="diffLevelBox" :text-inside="true" :stroke-width="18"
                                 :percentage="Number((((item.diffLevel+3)/6)*100).toFixed(1))"></co-progress>
                    <span class="right ndz">难度值：<i style="color: #fd7416;">{{item.diffLevel}}</i></span>
                </div>
            </div>
            <div class="question-item-content">
                <question-show :show-data="item" :show-answer="true">
                    <template v-if="item.groups && item.childQuestionsList instanceof Array">
                        <router-link v-for="cItem in item.childQuestionsList" :key="cItem.id"
                                     :slot="'answerRight'+cItem.id" target="_blank"
                                     :to='{
                                             path:"/selfCenter/myNoteAdd",
                                             query:{
                                                questionId: cItem.id,
                                                assessmentId:typeId,
                                                types: infoTypes,
                                                workId: paramsObj.workId,
                                                groupsId:paramsObj.groupsId,
                                                productId: paramsObj.productId,
                                                papersId: paramsObj.papersId
                                            }
                                         }'>
                            <el-button type="text" class="resolve">
                            <span>
                                查看解析
                            </span>
                            </el-button>
                        </router-link>
                    </template>
                    <router-link v-else slot="answerRight" target="_blank"
                                 :to='{
                                 path:"/selfCenter/myNoteAdd",
                                 query:{
                                    questionId: item.id,
                                    assessmentId:typeId,
                                    types: infoTypes,
                                    workId: paramsObj.workId,
                                    groupsId:paramsObj.groupsId,
                                    productId: paramsObj.productId,
                                    papersId: paramsObj.papersId
                                    }
                                 }'>
                        <el-button type="text" class="resolve">
                            <span>
                                查看解析
                            </span>
                        </el-button>
                    </router-link>
                </question-show>
            </div>
        </div>
        </template>
        <p v-else class="tipMsg">
            {{ questionsList === null ? '试题内容加载中，请稍等...' : '暂无试题' }}
        </p>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null;
  import coProgress from './progress.vue';
  import questionShow from '../questionShow/show';

  export default {
    props: ['types', 'typeId', 'params'],
    data () {
      return {
        index: '',
        infoTypes: this.types || '',
        questionsList: null,
        questionsData: {
          paperName: ''
        },
        paramsObj: {
          workId: '', // 我的作业使用
          groupsId: '', // 我的作业使用
          productId: '', // 我购买的试卷使用
          papersId: '' // 我购买的试卷使用
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            data.paperName = data.papersName;
            this.questionsData = data;
            if (res.data instanceof Array) {
              this.questionsList = res.data;
            } else {
              this.questionsList = res.data.questionsList;
            }
          }
        };
        switch (Number(this.types || 0)) {
          case 1: // 试题库（商品）
            Object.keys(this.params).map(key => this.paramsObj[key] = this.params[key] || '');
            // this.paramsObj.productId = this.params.productId
            opt.ajaxParams = {
              url: '/papers/queryQuestionsAnswerInfo',
              method: 'get',
              params: this.params
              // params: {
              //   papersId: this.typeId
              // }
            };
            break;
          case 2: // 自适应测评
            opt.ajaxParams = {
              url: '/autoAssessment/getAllAnswerQuestion',
              method: 'get',
              params: {
                assessmentAutoId: this.typeId
              }
            };
            break;
          case 3: // 自选测评
            opt.ajaxParams = {
              url: '/assessment/getAllAnswerQuestion',
              method: 'get',
              params: {
                assessmentId: this.typeId
              }
            };
            break;
          case 4: // 我的测试
            opt.ajaxParams = {
              url: '/evaluation/getEvaluationAnswerInfo',
              method: 'get',
              params: {
                papersId: this.typeId
              }
            };
            break;
          case 5: // 我的作业
            Object.keys(this.params).map(key => this.paramsObj[key] = this.params[key] || '');
            opt.ajaxParams = {
              url: '/work/getWorkAnswerInfo',
              method: 'get',
              params: this.params
            };
            break;
          case 6: // 准题库（老师发布）
            opt.ajaxParams = {
              url: '/questionsLibrary/getAnswerInfo',
              method: 'get',
              params: {papersId: this.typeId}
            };
            this.infoTypes = 4;
            break;
          default:
            break;
        }
        this.ajax(opt);
      },
      getSeq (item) {
        let childQuestionsList = item.childQuestionsList;
        let isArray = childQuestionsList instanceof Array;
        let len = isArray && childQuestionsList.length || 0;
        return item.groups && len >= 1 ? (len === 1 ? childQuestionsList[0].seq : childQuestionsList[0].seq + '-' + childQuestionsList[len - 1].seq) : item.seq;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      coProgress, questionShow
    }
  };

</script>

<style lang="scss">
    .questionsPaper_show {
        .paper-title {
            font-size: 20px;
            line-height: 1.54;
            text-align: center;
            color: #313131;
            padding-bottom: 20px;
            &:empty {
                display: none;
            }
        }
        .question-item-wrap {
            background: #f5f5f5;
            padding-top: 10px;
            margin-bottom: 40px;
            .index {
                font-size: 14px;
                font-weight: bold;
                line-height: 1;
                text-align: left;
                color: #11a63f;
                margin-left: 5px;
            }
            .progress-wrap {
                width: 190px;
                float: right;
                .ndz {
                    line-height: 14px;
                    margin-right: 5px;
                }
                .el-progress-bar__outer {
                    height: 10px !important;
                    .el-progress-bar__innerText {
                        color: #11A63F;
                    }
                }
            }
            .diffLevelBox {
                width: 100px;
                float: left;
                .el-progress-bar__inner {
                    /*background-color: transparent;*/
                    background-image: url("../../assets/images/diffLevelBg.png");
                }
            }
            .question-item-content {
                height: auto;
                .answer {
                    padding: 10px 10px 0 20px;
                    width: 670px;
                    color: #434343;
                    font-size: 14px;
                    line-height: 30px;
                    /*border-right: 1px solid #cacaca;*/
                    display: inline-block;
                }
            }
            .right-answer {
                margin-top: 15px;
                font-size: 14px;
                line-height: 50px;
                border-radius: 3px;
                background-color: #fff7de;
                border: solid 1px #f8e1c3;
                span {
                    font-size: 14px;
                    font-weight: bold;
                    text-align: left;
                    color: #fd7416;
                }
                .mar-left {
                    margin-left: 19px
                }
            }
            .resolve-content {
                background: #fff7de;
                color: #fc4341;
                font-size: 14px;
                padding: 10px 10px 0 10px;
                line-height: 30px;
            }
        }
        .resolve a {
            color: rgb(252, 67, 65);
        }
        .el-progress-bar__innerText {
            display: none
        }
    }

</style>

