<!--
****--@file     errorCorrection
****--@date     2017/12/13 下午3:26
****--@author   jhd
****--@describe   试题纠错
-->
<template>
    <div id="errorCorrection">
        <div class="question-item-content">
            <p class="question-item-title">
                <span style="margin-left: 10px;">编号：{{showData.no}}</span>
                <span style="margin:0 20px ;"></span>
                <template v-if="showData.childQuestionsList instanceof Array">
                    <span v-if="showData.childQuestionsList[0].paperName">所属试卷：{{showData.childQuestionsList[0].paperName}}</span>
                </template>
                <template v-else>
                    <span v-if="showData.paperName">所属试卷：{{showData.paperName}}</span>
                </template>
                <span class="time right"
                      v-if="showData.answerNum"><b>{{showData.answerNum}}</b>人做过此题，正确率为<b>{{showData.accuracy}}</b>%</span>
            </p>
            <p class="question-item-title" style="background: #ffffff">
                <template v-if="showData.childQuestionsList instanceof Array">
                    <span style="margin-left: 10px;">分值：{{showData.childQuestionsList[0].score}}分</span>
                    <span style="margin:0 20px ;"></span>
                    <span>难易程度：{{showData.childQuestionsList[0].diffLevelCode | diffLevelCode(self)}}（{{showData.childQuestionsList[0].diffLevel}}） </span>
                    <!--<span class="time right"-->
                    <!--v-if="showData.childQuestionsList[0].usedNum"><b>我的用时：{{showData.childQuestionsList[0].usedNum | formatFen}}分钟</b></span>-->
                </template>
                <template v-else>
                    <span style="margin-left: 10px;">分值：{{showData.score}}分</span>
                    <span style="margin:0 20px ;"></span>
                    <span>难易程度：{{showData.diffLevelCode | diffLevelCode(self)}}（{{showData.diffLevel}}） </span>
                    <!--<span class="time right"-->
                    <!--v-if="showData.usedNum"><b>我的用时：{{showData.usedNum | formatFen}}分钟</b></span>-->
                </template>
            </p>
            <question-show :showData="showData" :showAnswer="true"></question-show>
            <el-form :rules="rules" ref="formValidate" :model="formValidate" v-model="formValidate">
                <el-form-item v-if="types == 1" label="错题反馈" prop="remark">
                    <el-input type="textarea" :rows="4" v-model="formValidate.remark"></el-input>
                </el-form-item>
                <el-form-item v-else-if="types == 0" label="超纲反馈" prop="remark">
                    <el-input type="textarea" :rows="4" v-model="formValidate.remark"></el-input>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <load-btn style="padding: 10px 30px;" @listenSubEvent="listenSubEvent"
                              :btnData="loadBtn"></load-btn>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  import api from '../api'
  import { outofQuestion as rules } from '../rules'
  import questionShow from '../../../../components/questionShow/show'

  export default {
    props: ['questionData', 'types'],
    data () {
      return {
        rules,
        self: this,
        showData: this.questionData,
        formValidate: {
          questionId: this.questionData.id,
          resTypes: this.$route.query.types,
          types: this.types,
          subject: this.questionData.subject,
          remark: '',
        },
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        addMessTitle: {
          type: 'add',
          callback: 'close',
          successTitle: '反馈成功!',
          errorTitle: '反馈失败!',
          ajaxSuccess: res => this.$emit('correction', 'correction', '反馈成功！'),
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.outofQuestion.path,
            method: api.outofQuestion.method,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        if (this.questionData.groups == 1) {
          this.formValidate.questionId = this.questionData.childQuestionsList[0].id
        }
      },
      /*
      * 点击提交按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过
      * */
      listenSubEvent (isLoadingFun) {
        if (this.formValidate.types == 0) {
          this.formValidate.types = this.formValidate.types.toString()
        }
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          }
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate)
          console.log(this.addMessTitle.ajaxParams.data)
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
        * 点击提交按钮 监听是否验证通过
        * @param formName string  form表单v-model数据对象名称
        * @return flag boolean   form表单验证是否通过
        * */
      submitForm (formName) {
        let flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
      /*
      * 获取表单数据
      * @return string  格式:id=0&name=aa
      * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data)
        return myData
      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      questionShow
    },
  }

</script>
<style lang="scss">
    #errorCorrection {
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
        .question-item-title {
            line-height: 39px;
            background: #f5f5f5;
            span {
                font-size: 14px;
                font-weight: bold;
                text-align: left;
                color: #434343;
                margin-left: 20px;
            }
        }
    }
</style>
