<!--
****--@file     choiceEvaluation_Byself
****--@date     2017/12/19 下午2:05
****--@author   jhd
****--@describe   自适应测评
-->
<template>
    <questions class="choiceEvaluation_Byself" :qusetionContent="questionData"
               :todoType="todoType"
               :index="questionsSeq-1"
               :showInput="showInput"
               :showAnswer="showAnswer"
               @answer="setAnswer">
        <template v-if="questionData instanceof Object">
            <div slot="top" class="topBox">
                <p class="title">
                    <span>第 {{ questionsSeq }} 题</span>
                    <span class="tip">还有<b
                            style="color: #fd7416;">{{ assessment.questionsCount - questionsSeq }}</b>题</span>
                </p>
                <p class="timeBox">
                    做题计时 <span>{{ hour | padStart(2,'0') }}:{{ minute | padStart(2,'0') }}:{{ second | padStart(2,'0') }}</span>
                </p>
            </div>
            <div slot="footer" class="footerBox" :class="{onlyOne:isLast}">
                <el-button v-if="isLast" :loading="loading" @click="submit">
                    提交
                </el-button>
                <template v-else>
                    <el-button class="active" :loading="loading" @click="next">下一题</el-button>
                    <el-button @click="cancel">提交</el-button>
                </template>
            </div>
        </template>
        <template v-else>
            <p v-if="questionData === null" class="loadQuestionTips">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
            <p v-else class="loadQuestionTips">您所选择的科目，目前没有测评试题！
                <router-link to="/selfCenter/selfCenterdetail">返回个人中心</router-link>
            </p>
        </template>
    </questions>
</template>

<script>
  /*当前组件必要引入*/
  let Util = null;
  import api from './api';
  import questions from '../../components/questionTodo/index';

  export default {
    data () {
      return {
        loading: false,

        grade: '', // 年级
        subject: '', // 科目
        chapterId: '', // 章节id
        isFirstAssessment: '', // 是否首次测评
        textbookVersionId: '', // 测评教材版本

        todoType: 'choiceEvaluation',

        seasonId: '',
        gamesAnswerId: '',
        answer: '',
        questionsSeq: '0',

        showInput: true,
        showAnswer: false,
        allQuestionCount: 0, // 试题总数

        timerInt: null, // 时间计时器
        hour: 0,//时
        minute: 0,//分
        second: 0,//秒

        questionData: null,
        assessment: {
          'id': '', // 测评ID
          'createTime': '', // 首测时间
          'questionsCount': '' // 试题总数量
        },
        isLogin: this.$store.getters['app/isLogin']
      };
    },
    computed: {
      isLast () { // 是否最后一题
        return this.assessment.questionsCount - this.questionsSeq === 0;
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        // 检测路由参数是否正确（防止手动篡改）
        let {grade = '', subject = '', isFirstAssessment = '', textbookVersionId = ''} = this.$route.params;
        if (!grade || (grade && isNaN(grade)) || !isFirstAssessment || !~['1', '2'].indexOf(isFirstAssessment) || !subject || (subject && !/^[A-Z][a-z]+$/.test(subject)) || !textbookVersionId) {
          this.questionData = -1;
          return;
        }
        this.grade = grade;
        this.subject = subject;
        this.isFirstAssessment = isFirstAssessment;
        this.textbookVersionId = textbookVersionId;
        this.chapterId = this.$route.query.chapterId || '';
        this.getAssessment();
      },
      getAssessment () {
        let type = 'addAssessment';
        if (this.chapterId) {
          type = 'add';
        } else {
          if (this.isFirstAssessment == 1) {
            type = 'addFirstAssessment';
          }
        }
        let opt = {
          ajaxSuccess: res => {
            this.assessment = res.data;
            this.next();
          },
          ajaxParams: {
            url: api[type].path,
            method: api[type].method,
            data: {
              grade: this.grade,
              subject: this.subject,
              chapterId: this.chapterId,
              textbookVersionId: this.textbookVersionId // 测评教材版本
            }
          }
        };
        this.ajax(opt);
      },
      timer () {//计时
        this.second = this.second + 1;
        if (this.second > 59) {
          this.second = 0;
          this.minute = this.minute + 1;
        }

        if (this.minute > 59) {
          this.minute = 0;
          this.hour = this.hour + 1;
        }
      },
      setAnswer (d) {
        this.answer = d;
      },
      next () {
        this.saveAnswer((data) => {
          if (data) {
            this.questionsSeq = data.seq;
            this.questionData = data;
            this.timerInt = setInterval(() => this.timer(), 1000);
          } else {
            if (this.questionsSeq > 1) {
              this.lookTestRes();
            } else {
              this.questionData = data;
            }
          }
        });
      },
      submit () {
        if (this.answer === '') {
          this.$Message.error('请先选择或填写答案！');
          return;
        }
        let questionsId = '';
        if (this.questionData) {
          // 如果是组合题型则获取小题id
          if (this.questionData.childQuestionsList instanceof Array && this.questionData.childQuestionsList.length) {
            questionsId = this.questionData.childQuestionsList[0].id;
          } else {
            questionsId = this.questionData.id;
          }
        }
        let opt = {
          ajaxSuccess: () => this.lookTestRes(),
          ajaxParams: {
            url: api.submit.path,
            method: api.submit.method,
            data: {
              assessmentAutoId: this.assessment.id, // 自适应测评id
              questionsId, // 自适应测评id
              answer: this.answer // 自适应测评id
            }
          }
        };
        this.ajax(opt);
      },
      saveAnswer (call) {
        if (this.questionData && this.answer === '') {
          this.errorMess('请先选择或填写答案！');
          return;
        }
        let questionsId = '';
        if (this.questionData) {
          // 如果是组合题型则获取小题id
          if (this.questionData.childQuestionsList instanceof Array && this.questionData.childQuestionsList.length) {
            questionsId = this.questionData.childQuestionsList[0].id;
          } else {
            questionsId = this.questionData.id;
          }
        }
        let data = {
          assessmentAutoId: this.assessment.id, // 自适应测评id
          questionsId, // 自适应测评id
          answer: this.answer, // 自适应测评id
          questionsSeq: this.questionsSeq // 第几题
        };
        if (!this.isLogin) {
          Object.assign(data, {
            grade: this.grade, // 年级
            subject: this.subject, // 科目
            textbookVersionId: this.textbookVersionId // 测评教材版本
          });
        }
        let opt = {
          ajaxSuccess: res => {
            this.loading = false;
            this.answer = '';
            call(res.data);
          },
          ajaxParams: {
            url: api['getNextQuestions' + (this.isLogin ? '' : 'NoLogin')].path,
            method: api['getNextQuestions' + (this.isLogin ? '' : 'NoLogin')].method,
            data
          }
        };
        this.loading = true;
        clearInterval(this.timerInt);
        this.timerInt = null;
        this.ajax(opt);
      },
      lookTestRes () {
        if (this.isLogin) {
          this.$router.push({
            path: '/autoAssessmentResult',
            query: {id: this.assessment.id, isFirst: this.isFirstAssessment}
          });
        } else {
          this.$util.setStore('loginGo', `/autoAssessmentResult?id=${this.assessment.id}&isFirst=${this.isFirstAssessment}&bind=true`);
          this.$router.push({name: 'login'});
          this.$notify({
            type: 'success',
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: `评测成功，登录后可查看评测结果`
          });
        }
      },
      cancel () {
        this.$confirm('未完成指定自适应测评试卷，提前提交将不保存此次测评记录；确定提交？').then(_ => {
          this.$router.push('/evaluationByself');
        }, _ => {});
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    beforeDestroy () {
      clearInterval(this.timerInt);
      this.timerInt = null;
    },
    filters: {
      padStart (val, len, prefix = '') {
        return val.toString().padStart(len, prefix);
      }
    },
    components: {
      questions
    }
  };

</script>
<style lang="scss">
    .choiceEvaluation_Byself {
        .title {
            float: left;
            line-height: 50px;
        }
    }
</style>
