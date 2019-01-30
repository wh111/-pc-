<!--
****--@file     myNote_show
****--@date     2017/12/13 下午3:53
****--@author   jhd
****--@describe   查看笔记
-->
<template>
    <div class="my-node-add">
        <template v-if="questionData instanceof Object">
            <el-row class="title-wrap">
                <p class="question-item-title">
                    <span style="margin-right: 30px">
                        <span>编号：{{questionData.no}}</span>
                    </span>
                    <span>
                        <template
                                v-if="questionData.childQuestionsList instanceof Array && questionData.childQuestionsList.length && questionData.childQuestionsList[0].paperName">
                            <span v-if="questionData.childQuestionsList[0].paperName">所属试卷：{{questionData.childQuestionsList[0].paperName}}</span>
                        </template>
                        <template v-else-if="questionData.paperName">
                            <span>所属试卷：{{questionData.paperName}}</span>
                        </template>
                        <span v-else>&nbsp;</span>
                    </span>
                    <span style="float: right">
                        <template v-if="questionData.childQuestionsList instanceof Array">
                            <span v-if="questionData.childQuestionsList[0].answerNum">
                            <b>{{questionData.childQuestionsList[0].answerNum}}</b>人做过此题，正确率为<b>{{Number(questionData.childQuestionsList[0].accuracy || 0).toFixed(1)}}</b>%</span>
                        </template>
                        <template v-else>
                            <span v-if="questionData.answerNum"><b>{{questionData.answerNum}}</b>人做过此题，正确率为<b>{{Number(questionData.accuracy || 0).toFixed(1)}}</b>%</span>
                        </template>
                    </span>
                </p>

                <p class="question-item-title-content">
                    <span style="margin-right: 30px">
                        <template v-if="questionData.childQuestionsList instanceof Array">
                            <span>分值：{{questionData.childQuestionsList[0].score}}分</span>
                        </template>
                        <template v-else>
                            <span>分值：{{questionData.score}}分</span>
                        </template>
                    </span>
                    <span>
                        <template v-if="questionData.childQuestionsList instanceof Array">
                            <span>难易程度：{{questionData.childQuestionsList[0].diffLevelCode | diffLevelCode(self)}}</span>
                        </template>
                        <template v-else>
                            <span>难易程度：{{questionData.diffLevelCode | diffLevelCode(self)}}</span>
                        </template>
                    </span>
                </p>
            </el-row>
            <div class="question-item-content">
                <question-show :showData="questionData" :showAnswer="true"></question-show>
            </div>
            <el-form ref="formValidate" v-model="formValidate">
                <el-form-item label="添加笔记">
                    <el-input :maxlength="500" type="textarea" placeholder="请填写笔记（不超过500字）" :rows="4"
                              v-model="formValidate.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="formValidate.isFavorite" :true-label="1" :false-label="0" @change="joinJoy">
                        加入收藏
                    </el-checkbox>
                    <span class="right" @click="eCorrection(1)">试题纠错</span>
                    <span style="margin-right: 20px" class="right" @click="eCorrection(0)">超纲反馈</span>
                    <!--<span class="right" @click="eCorrection(1)">试题纠错</span>-->
                    <!--<span style="margin-right: 20px" class="right" @click="eCorrection(0)">超纲反馈</span>-->
                </el-form-item>
                <el-form-item align="center">
                    <load-btn style="padding: 10px 30px;" @listenSubEvent="listenSubEvent"
                              :btnData="loadBtn"></load-btn>
                </el-form-item>
            </el-form>
            <!--<div class="el-form">-->
            <!--<p class="title">我的笔记</p>-->
            <!--<p class="content">{{formValidate.content}}</p>-->
            <!--</div>-->
        </template>
        <template v-else>
            <p class="errMsg">
                <template v-if="questionData==-1">
                    请勿篡改链接数据
                </template>
                <template v-else>
                    <span class="el-icon-loading"></span>
                    数据加载中
                </template>
            </p>
        </template>
        <!--试题纠错-->
        <Modal
                :mask-closable="false"
                width="900"
                v-model="eCorrectionModal"
                title="试题纠错"
                class-name="vertical-center-modal"
                :loading="loading">
            <modal-header slot="header" :content="eCorrectionId"></modal-header>
            <e-correction v-if="eCorrectionModal" :types="outofQuestionTypes" @cancel="cancel" @correction="subCallback"
                          :questionData="questionData"></e-correction>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  import api from '../api'
  import questionShow from '../../../../components/questionShow/show'
  import eCorrection from './errorCorrection.vue'

  export default {
    data () {
      return {
        self: this,
        resolve: true,
        loading: false,
        isFavorite: false, // 原来是否收藏
        formValidate: {
          content: '', // 笔记内容
          isFavorite: 0, // 是否收藏
        },
        eCorrectionId: {
          id: 'eCorrectionId',
          title: '错题纠错'
        },
        eCorrectionModal: false,
        questionData: null,
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.types = this.$route.query.types
        if (![1, 2, 3, 4, 5].includes(Number(this.types || 0))) { // 参数检测
          this.questionData = -1
          return
        }
        this.getNote()
      },
      subCallback (target, title) {
        this.eCorrectionModal = false
        this.successMess(title)
      },
      cancel () {
        this.eCorrectionModal = false
      },
      eCorrection (types) {
        this.outofQuestionTypes = types
        this.eCorrectionModal = true
      },
      getNote () {
        this.ajax({
          ajaxSuccess: res => {
            this.questionData = res.data
            this.isFavorite = !!res.data.isFavorite
            this.formValidate.isFavorite = res.data.isFavorite || 0
            this.formValidate.content = res.data.questionsNotesResult && res.data.questionsNotesResult.content || ''
            // Object.keys(this.formValidate).map(key => this.formValidate[key] = res.data[key])
          },
          ajaxParams: {
            url: '/questionsNotes/get',
            params: {
              questionsId: this.$route.query.questionId,
              types: this.$route.query.types
            }
          }
        })
      },
      joinJoy () {
        if (this.formValidate.isFavorite == 1) {
          this.addFavorite()
        } else {
          this.delFavorite()
        }
      },
      listenSubEvent () {
        this.saveNote()
      },
      // 保存笔记
      saveNote () {
        this.ajax({
          ajaxSuccess: res => {
            this.successMess('提交成功！')
            this.getNote()
          },
          ajaxParams: {
            url: api.questionsNotesModify.path,
            method: api.questionsNotesModify.method,
            data: {
              questionsId: this.$route.query.questionId,
              content: this.formValidate.content,
              types: this.types
            }
          }
        })
      },
      // 添加收藏
      addFavorite () {
        this.ajax({
          ajaxSuccess: res => {
            this.successMess('成功加入收藏！')

          },
          ajaxParams: {
            url: api.questionsFavoriteAdd.path,
            method: api.questionsFavoriteAdd.method,
            data: {
              questionsId: this.$route.query.questionId,
              types: this.types
            }
          }
        })
      },
      // 取消收藏
      delFavorite () {
        let opt = {
          ajaxSuccess: () => {
            this.successMess('取消收藏成功！')
          },
          ajaxParams: {
            url: 'questionsFavorite/remove',
            method: 'delete',
            params: {
              questionsId: this.$route.query.questionId
            }
          }
        }
        this.ajax(opt)
      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      questionShow, eCorrection
    }
  }

</script>
<style lang="scss">
    .my-node-add {
        min-height: 720px;
        width: 950px;
        background: #ffffff;
        padding: 40px 30px 50px 30px;
        .errMsg {
            line-height: 470px;
            text-align: center;
        }
        .title-wrap {
            border: 1px solid #e5e5e5;
            font-size: 12px;
            .question-item-title {
                line-height: 39px;
                padding: 0 20px;
                border-buttom: 1px solid #e5e5e5;
                background: #efefef;
            }
            .question-item-title-content {
                line-height: 39px;
                padding: 0 20px;
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
