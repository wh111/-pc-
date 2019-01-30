<!--
****--@file     startProblem
****--@date     2017/12/25 上午10:36
****--@author   jhd
****--@describe   自选测评-开始做题
-->
<template>
    <questions :questionTypeObj="questionTypeObj"
               :qusetionContent="questionData"
               :todoType="todoType"
               :questionsId="selectQuestionObj.questionsId"
               :index="selectQuestionObj.index"
               :showInput="showInput"
               :showAnswer="showAnswer"
               @selectQuestion="selectQuestion"
               @answer="setAnswer">
        <template v-if="questionData instanceof Object">
            <div slot="top" class="topBox">
                <p class="timeBox">
                    做题计时 <span>{{ hour | padStart(2,'0') }}:{{ minute | padStart(2,'0') }}:{{ second | padStart(2,'0') }}</span>
                </p>
            </div>
            <div slot="footer" class="footerBox" :class="{onlyOne:isLast}">
                <el-button v-if="isLast" :loading="loading" class="active" @click="submit">
                    提交
                </el-button>
                <template v-else>
                    <el-button class="active" :loading="loading" @click="next">下一题</el-button>
                    <el-button @click="cancelTest">提交</el-button>
                </template>
            </div>
        </template>
        <template v-else>
            <p v-if="questionData === null" class="loadQuestionTips">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
            <p v-else-if="questionData === false" class="loadQuestionTips">谢谢，您已经完成测评！</p>
            <p v-else class="loadQuestionTips">您所选择的科目，目前没有测评试题！</p>
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
        isLogin: false,
        loading: false,
        todoType: 'adaptiveEvaluation',

        useTimeInterval: null,

        selectQuestionObj: {
          index: '', // 当前做题的序号
          questionsId: '', // 当前做的试题
          questionTypeId: '', // 当前做题所属题型id
          answerResult: null // 是否已做
        },
        selQuestionsSeq: '',
        questionsSeq: 0,
        answer: '',

        hour: 0,//时
        minute: 0,//分
        second: 0,//秒

        showInput: true,
        showAnswer: false,
        allQuestionCount: 0, // 试题总数

        questionAnswerArr: [], // 已答题id集
        questionInfo: {}, // 试题所属科目、年级等信息
        questionConf: null, // 试题配置信息
        questionData: null, // 试题信息
        questionTypeObj: null // 试题题型对象
      };
    },
    computed:{
      isLast(){
        return this.questionAnswerArr.length >= this.allQuestionCount - 1 && !~this.questionAnswerArr.indexOf(this.selectQuestionObj.questionsId)
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        let title = this.$util.getStore('paperTitle');
        let {grade, subject, term, textbookVersionId, chapterIds} = this.$route.query;
        this.$util.removeStore('paperTitle');
        this.isLogin = this.$store.getters['app/isLogin'];
        if (!grade || !subject || !textbookVersionId || !chapterIds) {
          this.questionData = -1;
          return;
        }
        term = term || '0';
        this.questionInfo = {grade, subject, term, textbookVersionId, chapterIds, title};
        let questionConf = this.$util.getStore('questionConf');
        if (questionConf) {
          // 记录原来的做题顺序
          let questionAnswerArr = this.$util.getStore('questionAnswerArr');
          questionAnswerArr = JSON.parse(questionAnswerArr);
          questionConf = JSON.parse(questionConf);
          if (questionAnswerArr instanceof Array) {
            this.questionAnswerArr = questionAnswerArr;
          } else {
            this.questionAnswerArr = [];
          }
          // 记录原来的试题数据
          this.getQuestionSeqCall(questionConf.questionsList);
          this.questionConf = questionConf;
          this.next();
        } else {
          // 没有配置试卷标题就返回到选择页面
          if (!title) {
            this.$router.push(`/adaptiveEvaluation`);
            return;
          }
          this.add();
        }
      },
      // 获取试题id
      getQuestionId (obj) {
        let questionsId = '';
        if (obj) {
          // 如果是组合题型则获取小题id
          if (obj.childQuestionsList instanceof Array && obj.childQuestionsList.length) {
            questionsId = obj.childQuestionsList[0].id;
          } else {
            questionsId = obj.id;
          }
        }
        return questionsId;
      },
      // 获取题型后的回调
      getQuestionSeqCall (arr) {
        let questionTypeObj = {
          1: {
            questions: [],
            questionsTypeId: 1
          }
        };
        let allQuestionCount = arr.length;
        let questionAnswerArr = this.$util._.defaultsDeep([], this.questionAnswerArr);
        arr.map(item => {
          item.index = item.seq - 1;
          item.questionsTypeId = 1;
          item.answerResult = questionAnswerArr.includes(item.questionsId) ? -1 : null;
        });
        questionTypeObj['1'].questions = arr;
        this.questionAnswerArr = questionAnswerArr;
        this.allQuestionCount = allQuestionCount;
        this.questionTypeObj = questionTypeObj;
      },
      getQuestionById (questionsId) {
        let opt = {
          ajaxSuccess: 'getQuestionSuccessCall',
          ajaxParams: {
            url: api.getAnswerQuestion.path,
            method: api.getAnswerQuestion.method,
            params: {
              questionsId,
              assessmentId: this.questionConf.id
            }
          }
        };
        this.answer = '';
        clearInterval(this.useTimeInterval);
        this.ajax(opt);
      },
      getQuestionSuccessCall (res) {
          console.log('176res.data.useTime',res.data.useTime)
        this.selectQuestionObj.questionsId = this.getQuestionId(res.data);
        this.initTime(res.data.useTime);
        this.questionData = res.data;
      },
      add () {
        let opt = {
          ajaxSuccess: res => {
            this.getQuestionSeqCall(res.data.questionsList);
            this.questionConf = res.data;
            this.$util.removeStore('questionAnswerArr');
            this.$util.setStore('questionConf', res.data);
            this.next();
          },
          ajaxParams: {
            url: api.add.path,
            method: api.add.method,
            data: this.questionInfo
          }
        };
        this.ajax(opt);
      },
      setAnswer (d) {
        this.answer = d;
      },
      lookTestRes () {
        this.$util.removeStore('questionConf');
        this.$util.removeStore('questionAnswerArr');
        if (this.isLogin) {
          this.$router.push({
            path: `/selfCenter/selfTestResult/3/${this.questionConf.id}`,
            query: {bind: true}
          });
        } else {
          this.$util.setStore('loginGo', `/selfCenter/selfTestResult/3/${this.questionConf.id}?bind=true`);
          this.$router.push({name: 'login'});
          this.$notify({
            type: 'success',
            title: '提示',
            dangerouslyUseHTMLString: true,
            message: `评测成功，登录后可查看评测结果`
          });
        }
      },
      next () {
        this.saveAnswer(res => {
          if (!res.data) {
            this.lookTestRes();
            return;
          }
          this.getQuestionSuccessCall(res);
        });
      },
      submit () {
        if (this.questionData && this.answer === '') {
          this.errorMess('请先选择或填写答案！');
          return;
        }
        let opt = {
          ajaxSuccess: () => this.lookTestRes(),
          ajaxParams: {
            url: api.submit.path,
            method: api.submit.method,
            data: {
              assessmentId: this.questionConf.id,
              questionsId: this.selectQuestionObj.questionsId,
              answer: this.answer
            }
          }
        };
        this.ajax(opt);
      },
      saveAnswer (callFun) {
        if (this.questionData && this.answer === '') {
          this.errorMess('请先选择或填写答案！');
          return;
        }
        let opt = {
          ajaxSuccess: res => {
            this.loading = false;
            this.answer = '';
            if (this.selectQuestionObj.questionsId && !~this.questionAnswerArr.indexOf(this.selectQuestionObj.questionsId)) {
              this.setDoAnswer();
            }
            console.log(this.questionAnswerArr);
            this.$util.setStore('questionAnswerArr', this.questionAnswerArr);
            callFun && callFun.apply(this, [res]);
          },
          ajaxParams: {
            url: api[this.isLogin ? 'getNextQuestions' : 'getNextQuestionsNologin'].path,
            method: api[this.isLogin ? 'getNextQuestions' : 'getNextQuestionsNologin'].method,
            data: {
              assessmentId: this.questionConf.id,
              questionsId: this.selectQuestionObj.questionsId,
              answer: this.answer
            }
          }
        };
        this.loading = true;
        clearInterval(this.useTimeInterval);
        this.ajax(opt);
      },
      // 记录已做的试题
      setDoAnswer () {
        this.questionAnswerArr.push(this.selectQuestionObj.questionsId);
        this.questionTypeObj[this.selectQuestionObj.questionsTypeId].questions[this.selectQuestionObj.index].answerResult = -1;
      },
      /*********************************** 左侧操作 ****************************/
      // 选择试题
      selectQuestion (question) {
        if (this.selectQuestionObj.questionsId != question.questionsId) {
          this.getQuestionById(question.questionsId);
        }
        this.selectQuestionObj = question;
        console.log('外部', question);
      },
      /*********************************** 试题操作 ****************************/
      // 试题答案处理
      setAnswer (data) {
        console.log('答案：', data);
        this.answer = data.toString();
      },
      initTime () {
        this.useTimeInterval = setInterval(this.timer, 1000);
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
      cancelTest () {
        this.$confirm('未完成指定自选测评试卷，提前提交将不保存此次测评记录；确定提交？').then(_ => {
          this.$util.removeStore('questionConf');
          this.$util.removeStore('questionAnswerArr');
          this.$router.push('/selfCenter/selfTest');
        }).catch(() => {
        });
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    beforeDestroy () {
      clearInterval(this.useTimeInterval);
      console.log('清除计时');
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
    .startProblem {

    }
</style>
