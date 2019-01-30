<!--
****--@file     toDoQuestions
****--@date     2018/1/11 下午3:34
****--@author   jhd
****--@describe   我的题库做题页面
-->
<template>
    <questions :questionTypeObj="questionTypeObj"
               :qusetionContent="questionData"
               :todoType="todoType"
               :questionsId="selectQuestionObj.questionsId"
               :index="selectQuestionObj.index"
               :showInput="!hasAnswer"
               :showAnswer="showAnswer"
               @selectQuestion="selectQuestion"
               @answer="setAnswer">
        <div slot="top">
            <br>
        </div>
        <div slot="footer" class="footerBox" :class="{'onlyOne':questionAnswerArr.length === allQuestionCount}" v-if="!!questionData">
            <template v-if="questionAnswerArr.length !== allQuestionCount">
                <el-button v-if="hasAnswer" class="active" :loading="loading" @click="next">下一题
                </el-button>
                <el-button v-else :loading="loading" @click="confirm(false)">确定</el-button>
            </template>
            <el-button :loading="loading" @click="submit">提交</el-button>
        </div>
    </questions>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null;
  import questions from '../../components/questionTodo/index';

  import api from './api';

  export default {
    data () {
      return {
        type: '', // teacher教师发布的专题库|默认我的专题库
        loading: false,

        productId: null,
        papersId: null,

        todoType: 'toDoQuestions',

        answer: '',

        showInput: true,
        showAnswer: false,
        allQuestionCount: 0, // 试题总数

        selectQuestionObj: {
          seq: '', // 索引
          index: '', // 当前做题的序号
          questionsId: '', // 当前做的试题
          questionTypeId: '', // 当前做题所属题型id
          answerResult: null // 是否已做
        },

        timerInt: null, // 时间计时器
        hour: 0,//时
        minute: 0,//分
        second: 0,//秒

        questionsId: '',//当前试题ID
        questionList: {}, // 试题题号数据
        questionAnswerArr: [], // 已做试题集
        initQuestionType: false, // 是否初始化过试题题型
        questionTypeObj: null, // 试题题型对象
        questionData: null,
        startAnswerTime: null // 当期做题所需时间
      };
    },
    computed: {
      hasAnswer () { // 当前选择的试题是否已经解答
        return this.questionAnswerArr.includes(this.selectQuestionObj.questionsId);
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        let {productId = '', papersId = ''} = this.$route.params;
        let {type} = this.$route.query;
        this.productId = productId;
        this.papersId = papersId;
        this.type = type;
        this.queryQuestionList();
      },
      // 获取当前操作类型的转换
      getType () {
        return this.type === 'my' ? 'Teacher' : this.type.replace(/\w/, s => s.toUpperCase())
      },
      /*********************************** 左侧操作 ****************************/
      // 选择试题
      selectQuestion (question) {
        if (this.selectQuestionObj.questionsId != question.questionsId) {
          this.getQuestionsById(question.questionsId);
        }
        this.selectQuestionObj = question;
        console.log('外部', question);
      },
      /**
       * 获取试题编号
       * **/
      queryQuestionList () {
        this.ajax({
          ajaxSuccess: 'getQuestionSeqCall',
          ajaxParams: {
            url: api['get' + this.getType() + 'QuestionsSeq'].path,
            method: api['get' + this.getType() + 'QuestionsSeq'].method,
            params: {
              papersId: this.papersId,
              productId: this.productId
            }
          }
        });
      },
      // 获取题型后的回调
      getQuestionSeqCall (res) {
        let arr = res.data || [];
        let questionTypeObj = {};
        let allQuestionCount = 0;
        let questionAnswerArr = [];
        arr.map(item => {
          item.questions.map((qItem, index) => {
            qItem.index = index; // 试题在该题型下属于第几题
            qItem.questionsTypeId = item.questionsTypeId; // 该题的题型id
            if (qItem.answerResult !== null) { // 记录已做试题
              questionAnswerArr.push(qItem.questionsId);
            }
            console.log(questionAnswerArr);
          });
          allQuestionCount += item.questions.length;
          questionTypeObj[item.questionsTypeId] = item;
        });
        this.questionAnswerArr = questionAnswerArr;
        this.allQuestionCount = allQuestionCount;
        this.questionTypeObj = questionTypeObj;
        // 如果已经初始化过就不再重新获取试题内容（只是为了更新试题解答状态：正确|错误）
        if (this.initQuestionType) {
          return;
        }
        this.initQuestionType = true;
        if (questionAnswerArr.length === allQuestionCount) {
          // 所有试题都已经解答，直接返回专题库
          this.backPersonalQuestion();
        } else {
          // 获取下一题
          this.next();
        }
      },
      // 记录已做的试题
      setDoAnswer () {
        this.questionAnswerArr.push(this.selectQuestionObj.questionsId);
        // this.questionTypeObj[this.selectQuestionObj.questionsTypeId].questions[this.selectQuestionObj.index].answerResult = -1;
      },
      /**
       * 提交答题（提交答案，获取正确情况）
       * **/
      confirm (callFun) {
        if (this.answer === '') {
          this.errorMess('请先选择或填写答案！');
          return false;
        }
        console.log(api['submit' + this.getType() + 'Answer'].path)
        clearInterval(this.timerInt);
        let opt = {
          ajaxSuccess: res => {
            if (callFun) {
              // 如果有回调则把提交后的操作交给回调处理
              callFun(res);
            } else {
              this.queryQuestionList();
              this.setDoAnswer();
              this.answer = '';
              // this.getQuestionsById();
            }
          },
          ajaxParams: {
            jsonString: true,
            url: api['submit' + this.getType() + 'Answer'].path,
            method: api['submit' + this.getType() + 'Answer'].method,
            data: {
              papersId: this.papersId,
              seq: this.selectQuestionObj.seq,
              productId: this.productId,
              answer: this.answer,
              questionsId: this.selectQuestionObj.questionsId,
              startTime: this.startAnswerTime
            }
          }
        };
        this.ajax(opt);
      },
      /**
       * 根据id获取试题详情
       * @param val Object
       * **/
      getQuestionsById (questionsId) {
        clearInterval(this.timerInt);
        this.ajax({
          ajaxSuccess: res => this.getQuestionSuccessCall(res.data),
          ajaxParams: {
            url: api['get' + this.getType() + 'QuestionsById'].path,
            method: api['get' + this.getType() + 'QuestionsById'].method,
            params: {
              questionsId,
              productId: this.productId,
              papersId: this.papersId
            }
          }
        });
      },
      // 获取试题成功回调
      getQuestionSuccessCall (data) {
        this.answer = '';
        this.selectQuestionObj.questionsId = this.getQuestionId(data);
        this.startAnswerTime = new Date().getTime();
        // 只有在未答题的时候才进行计时，已经做过的题不再计时
        if (!this.questionAnswerArr.includes(data.id)) {
          this.initTime();
        }
        this.questionData = data;
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
      // 初始化时间处理
      initTime () {
        // 当前模式不需要计时
        return;
        this.timerInt = setInterval(this.timer, 1000);
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
      // 设置答案
      setAnswer (d) {
        this.answer = String(d);
      },
      // 获取下一题
      next () {
        clearInterval(this.timerInt);
        this.getNextQuestions((data) => {
          // 如果下一题还有数据就继续，否则就是已经答题完成了
          if (data instanceof Object) {
            this.getQuestionSuccessCall(data);
          } else {
            this.successMess('您已完成练习，即将跳转到我的题库！');
            let that = this;
            clearInterval(this.timerInt);
            setTimeout(function () {
              that.backPersonalQuestion();
            }, 3000);
          }
        });
      },
      // 返回题库
      backPersonalQuestion () {
        clearInterval(this.timerInt);
        if (this.type === 'my') {
          // 返回：我的题库-专题库-我的专题库
          this.$router.push({
            path: '/selfCenter/personalQuestion_goon',
            query: {productId: this.productId, type: this.type}
          });
        } else {
          // 返回：我的题库-专题库-教师专题库
          this.$router.push({
            name: 'personalQuestion',
            query: {type: this.type}
          });
        }
      },
      // 提交
      submit () {
        // 如果已经全部答完就直接返回专题库，否则就必须做完此题才能提交
        if (this.hasAnswer) {
          this.backPersonalQuestion();
        } else {
          this.confirm(() => this.backPersonalQuestion());
        }
      },
      // 获取下一题
      getNextQuestions (call) {
        let opt = {
          ajaxSuccess: res => {
            this.loading = false;
            call(res.data);
          },
          ajaxParams: {
            url: api['get' + this.getType() + 'NextQuestions'].path,
            method: api['get' + this.getType() + 'NextQuestions'].method,
            params: {
              papersId: this.papersId,
              seq: this.selectQuestionObj.seq,
              productId: this.productId
            }
          }
        };
        this.loading = true;
        this.ajax(opt);
      }
    },
    created () {
      this.init();
    },
    beforeDestroy () {
      // 组件销毁前先清除定时器
      clearInterval(this.timerInt);
      this.timerInt = null;
    },
    components: {
      questions
    }
  };

</script>
<style lang="scss">

</style>
