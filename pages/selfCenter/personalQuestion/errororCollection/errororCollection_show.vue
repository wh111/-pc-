<!--
****--@file     errororCollection_show
****--@date     2018/1/19 下午4:28
****--@author   jhd
****--@describe   我的收藏  练习此题
-->
<template>
    <div class="errororCollection_show">
        <template v-if="questionData instanceof Object">
            <div class="title-wrap">
                <p class="question-item-title">
                    <span style="margin-left: 10px;">编号:{{questionData.no}}</span>
                    <span style="margin:0 20px ;"></span>
                    <template v-if="questionData.childQuestionsList instanceof Array">
                        <span v-if="questionData.childQuestionsList[0].paperName">所属试卷：{{questionData.childQuestionsList[0].paperName}}</span>
                    </template>
                    <template v-else>
                        <span v-if="questionData.paperName">所属试卷：{{questionData.paperName}}</span>
                    </template>
                    <span class="time right"
                          v-if="questionData.answerNum"><b>{{questionData.answerNum}}</b>人做过此题，正确率为<b>{{questionData.accuracy}}</b>%</span>
                </p>
                <p class="question-item-title" style="background: #ffffff">
                    <template v-if="questionData.childQuestionsList instanceof Array">
                        <span style="margin-left: 10px;">分值：{{questionData.childQuestionsList[0].score}}分</span>
                        <span style="margin:0 20px ;"></span>
                        <span>难易程度：{{questionData.childQuestionsList[0].diffLevelCode | diffLevelCode(self)}} </span>
                        <!--<span class="time right"-->
                        <!--v-if="questionData.childQuestionsList[0].usedNum"><b>我的用时：{{questionData.childQuestionsList[0].usedNum | formatFen}}分钟</b></span>-->
                    </template>
                    <template v-else>
                        <span style="margin-left: 10px;">分值：{{questionData.score}}分</span>
                        <span style="margin:0 20px ;"></span>
                        <span>难易程度：{{questionData.diffLevelCode | diffLevelCode(self)}} </span>
                        <!--<span>难易程度：{{questionData.diffLevelCode | projectDiffLevel}}（{{questionData.diffLevel}}） </span>-->
                        <!--<span class="time right"-->
                        <!--v-if="questionData.usedNum"><b>我的用时：{{questionData.usedNum | formatFen}}分钟</b></span>-->
                    </template>
                </p>
            </div>
            <div class="question-item-content">
                <question-show :showData="questionData" :showAnswer="isShow" :showInput="!isShow"></question-show>
            </div>
            <el-row>
                <el-col align="center">
                    <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <p class="errMsg">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
        </template>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  //    import simditor from '../../../../components/common/simditor.vue'
  import questionShow from '../../../../components/questionShow/show'

  export default {
    props: ['questionsId', 'types'],
    data () {
      return {
        self: this,
        isShow: false,
        questionData: null,
        id: this.questionsId,
        type: this.types,
        formValidate: {
          content: ''
        },
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        console.log(this.questionsId)
        Util = this.$util
        this.ajax({
          ajaxSuccess: res => {
            if (res.data instanceof Object) {
              this.questionData = res.data
              this.questionData.studentAnswer = undefined
            }
          },
          ajaxParams: {
            url: '/questionsFavorite/get',
            params: {
              questionsId: this.id,
              types: this.type
            }
          }
        })
      },
      /***
       * 提交
       * **/
      listenSubEvent () {
        this.isShow = !this.isShow
      },
//            getInfo(content) {//获取内容
//                this.formValidate.content = content
//            },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      questionShow,
//            simditor
    }
  }

</script>
<style lang="scss">
    .errororCollection_show {
        background: #ffffff;
        .title-wrap {
            border: 1px solid #e5e5e5;

            .question-item-title {
                line-height: 39px;
                padding-right: 20px;
                background: #f5f5f5;
            }
        }
        .question-item-content {
            height: auto;
            .answer {
                height: 80px !important;
                width: 670px;
                color: #434343;
                font-size: 14px;
                line-height: 30px;
                border-right: 1px solid #e5e5e5;
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
            .resolve {
                margin-right: 15px;
                cursor: pointer;
            }
        }
        .resolve-content {
            color: #fc4341;
            font-size: 14px;
            margin-top: 30px;
            padding: 10px 10px 0 10px;
            line-height: 30px;
        }
        .el-form {
            margin-top: 15px;
            .el-form-item {
                .right {
                    color: #a0a0a0;
                    font-size: 14px;
                    cursor: pointer;
                }
            }
        }
    }
</style>
