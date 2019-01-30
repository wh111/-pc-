<!--
****--@file     makeQuestion
****--@date     2017/12/18 上午10:21
****--@author   jhd
****--@describe   新建提问
-->
<template>
    <div class="make-question">
        <p class="title">发表新问题</p>
        <el-form :rules="rules" ref="formValidate" :model="formValidate" label-width="100px">
            <el-form-item label="选择年级：" prop="grade"
                          style="border-top: 1px solid #e5e5e5;line-height: 30px !important;">
                <el-radio-group v-model="formValidate.grade">
                    <el-radio style="line-height: 30px" v-for="item in 12" :label="item" :key="item"
                              @change="getsubject">{{ item | grade(self) }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选择科目：" prop="subject">
                <el-radio-group v-model="formValidate.subject">
                    <el-radio v-for="(item,index) in subjectList" :label="item.code" :key="index">{{ item.value }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="标题：" prop="title">
                <el-input v-model="formValidate.title" placeholder="长度须控制5-30个字符之间"></el-input>
            </el-form-item>
            <el-form-item label="内容：" prop="content">
                <simditor @valuechanged="getInfo"></simditor>
                <p class="tip">提示：描述此题的难点，自己做不出来的地方。</p>
            </el-form-item>
            <el-form-item label="难题原因：" prop="result">
                <simditor v-if="twoSim" @valuechanged="getResult" :toolbarHidden="true"></simditor>
                <p class="tip">提示：描述此题的难点，自己做不出来的地方。</p>
            </el-form-item>
            <el-form-item label="设置积分：" prop="integral">
                <el-select style="width: 150px;" size="small" :disabled="disabled" v-model="formValidate.rewardIntegral"
                           placeholder="">
                    <el-option label="0积分" value="0"></el-option>
                    <el-option label="10积分" value="10"></el-option>
                    <el-option label="20积分" value="20"></el-option>
                    <el-option label="30积分" value="30"></el-option>
                </el-select>
                <span v-if="$store.state.user.info.vipStatus == 1"
                      style="font-size: 14px; color: rgb(65, 184, 101);margin-left: 20px">会员可免积分提问问题</span>
            </el-form-item>
            <el-form-item label="我的老师：">
                <el-button class="whiteButton" v-if="!$route.query.id" @click="choice">{{teacherSlect}}</el-button>
                <el-button class="whiteButton" v-if="$route.query.id">{{$route.query.name}}</el-button>
            </el-form-item>
        </el-form>
        <p class="load-btn-wrap">
            <load-btn style="padding: 10px 30px;" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </p>
        <!--选择老师-->
        <Modal
                :mask-closable="false"
                width="880"
                v-model="choiceModal"
                title="试题纠错"
                class-name="vertical-center-modal"
                :loading="loading">
            <modal-header slot="header" :content="choiceId"></modal-header>
            <choice-teacher v-if="choiceModal" @cancel="cancel" @correction="subCallback"></choice-teacher>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  import simditor from '../../../../components/common/simditor.vue'
  import choiceTeacher from './choiceTeacher.vue'
  import { makequestion as rules } from '../rules'
  import ElButton from '../../../../../node_modules/element-ui/packages/button/src/button.vue'
  import api from '../api'

  let Util = null
  export default {
    data () {
      return {
        self: this,
        rules,
        choiceModal: false,
        loading: false,
        choiceId: {
          id: this.$route.query.id,
          title: '选择老师',
        },
        teacherSlect: '指定老师',
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        twoSim: false,
        subjectList: [
          {
            'code': 'Chinese',
            'value': '语文',
          },
          {
            'code': 'Math',
            'value': '数学',
          },
          {
            'code': 'English',
            'value': '英语',
          },
        ],
        formValidate: {
          grade: '',
          subject: '',
          title: '',
          content: '',
          files: '',
          rewardIntegral: '0',
          reason: '',
          teacherId: this.$route.query.id || '',
          rewardB: 0

        },
        addMessTitle: {
          type: 'add',
          callback: 'close',
          successTitle: '发表成功!',
          errorTitle: '发表失败!',
          ajaxSuccess: 'successSubmit',         //res => this.successMess('发表成功!'),
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
          },
        },
        disabled: false,
        integral: 0, // 学生积分
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.integral = this.$store.getters['user/userIntegral']
        if (this.$store.state.user.info.vipStatus == 1) {
          this.disabled = true
        }
      },

      getsubject (i) {
        this.subjectList = this.$store.state.app.envs.gradeMap[i]
      },
      getInfo (content) {
        if (content.length > 10000) {
          this.$message({
            showClose: true,
            message: '输入字数过多',
            type: 'error'
          })
        }
        this.formValidate.content = content
      },
      getResult (content) {//获取难题原因
        if (content.length > 10000) {
          this.$message({
            showClose: true,
            message: '输入字数过多',
            type: 'error'
          })
        }
        this.formValidate.reason = content
      },
      //选择答题老师
      choice () {
        this.choiceModal = true
      },
      //弹窗回调函数
      subCallback (target, title) {
        this.choiceModal = false
        this.successMess(title)
      },
      //取消弹窗
      cancel (res) {
        console.log(res)
        if (res !== undefined) {
          this.teacherSlect = res.teacherName
          this.formValidate.teacherId = res.teacherId
        }
        this.choiceModal = false
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
      * 点击提交按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过
      * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          }
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate)
          this.addMessTitle.ajaxParams.url = api.commitQuestion.path
          this.addMessTitle.ajaxParams.method = api.commitQuestion.method
          //console.log(this.addMessTitle.ajaxParams.data)
          if (this.integral < this.formValidate.rewardIntegral) {
            this.$message.error('积分不足')
            isLoadingFun(false)
            return false
          }
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
      * 获取表单数据
      * @return string  格式:id=0&name=aa
      * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data)
        return myData
      },
      successSubmit () {
        this.successMess('发表成功!')
        this.updateUserIntegral()
        this.$router.push({path: '/selfCenter/selfAnsweringQuestion'})
      },
      // 更新积分
      updateUserIntegral () {
        let integral = this.integral - this.formValidate.rewardIntegral
        this.$store.commit('user/updateuserIntegral', integral)
      }

    },
    created () {
      this.init()
    },
    mounted () {
      setTimeout(() => {
        this.twoSim = true
      }, 100)
    },
    components: {
      ElButton,
      simditor,
      choiceTeacher,
    },
  }

</script>
<style lang="scss">
    .make-question {
        .active {
            margin-left: 0px;
        }
        padding: 30px 30px;
        width: 950px;
        background: #fff;
        .title {
            font-size: 18px;
            letter-spacing: 0.1px;
            text-align: left;
            color: #434343;
            margin-bottom: 5px;
        }
        .el-form-item--small {
            border-bottom: 1px solid #eee;
            padding: 10px 0;
            margin: 0;
            .tip {
                font-size: 12px;
                line-height: 1.8;
                text-align: left;
                color: #a0a0a0;
            }
            .el-form-item__content {
                .el-input--small {
                    /*width: 690px;*/
                }
            }
            .el-select--small {
                .el-input {
                    width: 150px;
                }
            }
        }
        .load-btn-wrap {
            text-align: center;
            margin-top: 20px;
        }
        .el-radio {
            margin-left: 0;
            margin-right: 25px;
        }
    }
</style>
