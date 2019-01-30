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
        <template v-if="questionData && questionData instanceof Object">
            <!-- 顶部 -->
            <div slot="top" class="topBox">
                <p class="timeBox">
                    做题计时 <span>{{ hour | padStart(2,'0') }}:{{ minute | padStart(2,'0') }}:{{ second | padStart(2,'0') }}</span>
                </p>
            </div>
            <!-- 分发按钮 -->
            <div slot="footer" class="footerBox" :class="{onlyOne:isLast}">
                <!-- 老师布置的评测 -->
                <template v-if="todoType === 'test'">
                    <el-button v-if="isLast" :loading="loading" @click="sendTime('submit')">提交</el-button>
                    <template v-else>
                        <el-button class="active" :loading="loading" @click="saveAnswerAndNext">下一题</el-button>
                        <el-button :loading="loading" @click="sendTime('stopDoTest')">提交</el-button>
                    </template>
                </template>
                <!-- 老师布置的作业 -->
                <template v-else>
                    <template v-if="!allQuestionHadAnswer">
                        <span v-if="questionAnswerArr.length==allQuestionCount"></span>
                        <el-button v-else-if="questionAnswerArr.includes(selectQuestionObj.questionsId)" class="active"
                                   :loading="loading" @click="next">下一题
                        </el-button>
                        <el-button v-else-if="answer" class="active" :loading="loading" @click="confirm"
                                   style="border: none">确定
                        </el-button>
                        <el-button v-else class="active" :loading="loading" @click="tipNoAnswer" style="border: none">
                            确定
                        </el-button>
                    </template>
                    <el-button v-if="questionAnswerArr.length!=allQuestionCount || isLast" :loading="loading"
                               @click="sendTime('stopDoHomework')">提交
                    </el-button>
                    <el-button style="width: 98%" v-else-if="!isLast" :loading="loading"
                               @click="sendTime('stopDoHomework')">提交
                    </el-button>
                </template>
            </div>
        </template>
        <template v-else>
            <p v-if="questionData === null" class="loadQuestionTips">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
            <p v-else class="loadQuestionTips">环境异常，返回
                <router-link :to="{name: 'selfCenter'}">个人中心</router-link>
                -
                <router-link :to="{name: 'selfHomework'}">我的作业</router-link>
            </p>
        </template>
    </questions>
</template>
<script>
  let Util = null;
  import api from './api';
  import questions from '../../../../components/questionTodo/index';

  let answerType, answerPapersId
  let thatItem = null
  let token = null
  export default {
    data () {
      return {
        loading: false,

        timerInt: null, // 时间计时器
        hour: 0,//时
        minute: 0,//分
        second: 0,//秒

        todoType: '', // 操作类型 test测试|homework作业

        papersId: '', // 试卷id
        groupsId: '', // 群组id

        selectQuestionObj: {
          index: '', // 当前做题的序号
          questionsId: '', // 当前做的试题
          questionTypeId: '', // 当前做题所属题型id
          answerResult: null // 是否已做
        },
        // showInput: true, // 当前试题是否已做
        // showAnswer: false, // 当前试题是否显示答案

        answer: '', // 试题答案
        questionData: null, // 显示试题数据
        questionTypeObj: null, // 试题分类
        questionAnswerArr: [], // 已做试题
        allQuestionCount: 0, // 总试题

        evaluationInfo: null, // 测评

        useTime: 0, // 总共用时（秒）
          canChange:true,
        startAnswerTime: '', // 开始做题的时间
        timerInt: null, // 计时器
        num: 0
      };
    },
    computed: {
      // 显示输入框
      showInput () {
        return this.todoType === 'homework' ? !this.questionAnswerArr.includes(this.selectQuestionObj.questionsId) : true;
      },
      // 是否显示答案及解析
      showAnswer () {
        return this.todoType === 'homework' ? !this.showInput : false;
      },
      // 所有试题都已经解答
      allQuestionHadAnswer () {
        // console.log(this.questionAnswerArr.length, this.allQuestionCount)
        return this.questionAnswerArr.length - 1 === this.allQuestionCount
      },
      // 是否是最后一道题
      isLast () {
        // console.log(this.questionAnswerArr.length >= this.allQuestionCount - 1, 99, this.selectQuestionObj.questionsId, this.questionAnswerArr)
        return this.todoType === 'homework' ? this.allQuestionHadAnswer : (this.questionAnswerArr.length === this.allQuestionCount - 1 && !this.questionAnswerArr.includes(this.selectQuestionObj.questionsId)) || (this.questionAnswerArr.length === this.allQuestionCount && this.questionAnswerArr.includes(this.selectQuestionObj.questionsId))
      }
    },
    methods: {
      /*********************************** 初始化 *****************************/
      //初始化请求列表数据
      init () {
        console.log(this.$cookie)
        console.log(this.$cookie.get('Token'))
        token = this.$cookie.get('Token')
        thatItem = this
        console.log(thatItem, 136)
        Util = this.$util;
        let {type = '', papersId = ''} = this.$route.params;
        let {groupsId} = this.$route.query;
        if (!['test', 'homework'].includes(type) || isNaN(papersId)) {
          this.questionData = -1;
          return;
        }

        let opt = {
          ajaxSuccess: 'getTimeSuccess',
          ajaxParams: {
            url: '/answerTime/getInfo',
            method: 'post',
            jsonString: true,
            data: {
              relateId: papersId,
              relateType: type == 'test' ? 1 : 2,
            }
          }
        }
        this.ajax(opt)
        this.todoType = type;
        this.papersId = papersId;
        this.groupsId = groupsId;
        answerType = type
        answerPapersId = papersId
        if (this.todoType === 'test') {
          this.getMyTestInfo();
        } else {
          this.getWorkQuestionsSeq();
        }
      },
      getTimeSuccess (res) {
        if (res.data) {
          this.initTime(parseInt(res.data.anserTime))
        } else {
          this.initTime(0)
        }
      },
      sendTime (call) {
        console.log(answerType, answerPapersId)
        console.log(this.$cookie)
        let time = this.hour * 3600 + this.minute * 60 + this.second
        let opt = {
          ajaxSuccess: () => {
            if (call) {
              this[call]()
            }
          },
          ajaxParams: {
            url: '/answerTime/update',
            method: 'post',
            jsonString: true,
            data: {
              relateId: answerPapersId,
              relateType: answerType == 'test' ? 1 : 2,
              anserTime: time
            }
          }
        }
        this.ajax(opt)
      },

      /*********************************** 左侧操作 ****************************/
      // 选择试题
      selectQuestion (question) {

          // console.log("home--question:", question, "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", this.answer)
          this.canChange=false;
        // console.log(question,this.todoType,156)
        if (this.answer) {
          if (this.todoType === 'test') {
            this.saveAnswer(() => {
              if (this.selectQuestionObj.questionsId != question.questionsId) {
                this.getQuetion(question.questionsId)
              }
              this.selectQuestionObj = question
            }, true)
          } else {

            if (this.selectQuestionObj.questionsId != question.questionsId) {
                //this.$store.commit('app/updateServeAnswer', {id:question.questionsId, val:this.answer})
                // console.log(this.$store.state.app.serveAnswer, "#####################################")
              this.getQuetion(question.questionsId)
            }
            this.selectQuestionObj = question
          }


        } else {

          if (this.selectQuestionObj.questionsId != question.questionsId) {
            this.getQuetion(question.questionsId)
          }
          this.selectQuestionObj = question
        }
//        setTimeout(()=>{
//          if (this.selectQuestionObj.questionsId != question.questionsId) {
//            this.getQuetion(question.questionsId);
//          }
//          this.selectQuestionObj = question;
//        },1000)
          this.canChange=true;
        // console.log('外部', question);
      },
      /*********************************** 试题操作 ****************************/
      // 试题答案处理
      setAnswer (data) {
        // console.log('答案：', data);
      if(this.canChange){
              this.answer = data.toString();
          }
      },
      /*********************************** 按钮逻辑 ****************************/
      // 试题做完提交
      submit () {
        this['submit' + this.getType()].apply(this);
      },
      // 下一题
      next () {
        let params = {
          test: {
            papersId: this.papersId
          },
          homework: {
            workId: this.papersId,
            groupsId: this.groupsId
          }
        };
        let opt = {
          ajaxSuccess: 'getQuestionsSuccessCall',
          ajaxParams: {
            url: api[this.todoType === 'test' ? 'getNextQuestions' : 'getWorkNextQuestions'].path,
            method: api[this.todoType === 'test' ? 'getNextQuestions' : 'getWorkNextQuestions'].method,
            params: params[this.todoType]
          }
        };
//        clearInterval(this.timerInt);
        this.loading = true;
        this.ajax(opt);
      },
      // 提示没有答案
      tipNoAnswer () {
        this.errorMess('请选择或者填写答案！');
      },
      // 获取当前类型
      getType () {
        return this.todoType.replace(/^\w/, s => s.toLocaleUpperCase());
      },
      // 查看结果
      lookRes () {
        // console.log('查看结果', 'go' + this.getType() + 'Res');
        let data = {
          test: {papersId: this.papersId},
          homework: {workId: this.papersId, groupsId: this.groupsId}
        };
        let opt = {
          ajaxSuccess: () => {this['go' + this.getType() + 'Res'].apply(this)},
          ajaxParams: {
            url: api[this.todoType === 'test' ? 'submitPapers' : 'submitWork'].path,
            method: api[this.todoType === 'test' ? 'submitPapers' : 'submitWork'].method,
            data: data[this.todoType]
          }
        };
        this.ajax(opt);

      },
      /*********************************** 测评试题操作 *************************/
      // 保存答案并获取下一题
      saveAnswerAndNext () {
        this.saveAnswer(res => {
          this.answer = '';
          this.next();
        });
      },

      // 停止做测评
      stopDoTest () {
        this.stopDo(() => this.$confirm('当前测评还未完成，是否确认提交？').then(_ => {
          this.alertTest();
        }).catch(() => {
        }));
      },

      // 测试提交答案弹出确认
      alertTest () {
        if (this.evaluationInfo.publishAnswerTime < new Date().getTime()) { // 当前还未到公布答案时间
          this.sendTime('lookRes')
        } else {
          this.$alert(`测评结果将于${this.conductDate(this.evaluationInfo.publishAnswerTime, 'yyyy-MM-dd HH:ss')}时公布`, '提交成功', {
            confirmButtonText: '我知道了',
            callback: () => this.sendTime('lookRes')
          });
        }
      },

      // 评测提交
      submitTest () {
        this.saveAnswer(() => this.alertTest(), false);
      },

      // 查看测评结果
      goTestRes () {
        if (this.evaluationInfo.publishAnswerTime < new Date().getTime()) {
          // 立即公布
          this.$router.push({name: 'homeworkRes', params: {id: this.papersId, type: this.todoType}}); // 跳转到结果页面
        } else {
          // 延迟公布
          this.$router.push({name: 'selfHomework', query: {view: 'my' + this.getType(), finish: 1}}); // 跳转到：我的作业-我的评测-已完成
        }
      },
      /*********************************** 作业试题操作 *************************/
      // 保存答案并获取正确答案
      confirm () {
        this.saveAnswer(() => this.showAnswerCall());
      },

      // 显示答案
      showAnswerCall () {
        // console.log(this.questionData)
        this.getWorkQuestionsSeq(false);
        this.answer = '';
        // this.getQuetion(this.selectQuestionObj.questionsId);
      },

      // 查看测评结果
      goHomeworkRes () {
        this.$router.push({
          name: 'homeworkRes',
          params: {id: this.papersId, type: this.todoType},
          query: {groupsId: this.groupsId}
        }); // 跳转到结果页面
      },

      // 停止继续做
      stopDo (fun) {
        // 有答案就提交,提交之后再进行询问(避免一个试题重复提交答案)
        if (this.answer && !this.questionAnswerArr.includes(this.selectQuestionObj.questionsId)) {
          this.saveAnswer(() => {
            this.stopDo();
          });
          // return;
        }
        if (!this.questionAnswerArr.length) {
          this.errorMess('至少需要答一道题才能提交');
          return;
        }
        fun && fun.apply(this);
      },

      // 停止做作业
      stopDoHomework () {
        // console.log(this.questionAnswerArr.length, this.allQuestionCount)
        if (this.questionAnswerArr.length - 1 === this.allQuestionCount || this.questionAnswerArr.length === this.allQuestionCount) { // 全部做完
          this.$alert(`恭喜你成功提交作业！`, '', {
            confirmButtonText: '我知道了',
            callback: () => this.sendTime('lookRes')
          });
        } else {

            this.$confirm('当前作业还未完成，是否确认提交？').then(_ => {
              this.sendTime('lookRes')
                this.isLast();

              this.stopDo(() => {
                    if (this.answer != '') {
                        this.showAnswerCall();
                    }
                });
            }).catch(() => {
            });


        }
      },
      /*********************************** 数据获取 ****************************/
      // 获取试题类型 - 作业
      getWorkQuestionsSeq (loadQuestion = true) {
        let params = {
          workId: this.papersId,
          groupsId: this.groupsId
        };
        let opt = {
          ajaxSuccess: res => {
            this.getQuestionSeqCall(res.data, loadQuestion);
            console.log(373,this.allQuestionHadAnswer, this.questionAnswerArr.length, this.allQuestionCount)
            loadQuestion && !this.allQuestionHadAnswer && (this.questionAnswerArr.length != this.allQuestionCount) && this.next()
          },
          ajaxParams: {
            url: api.getWorkQuestionsSeq.path,
            method: api.getWorkQuestionsSeq.method,
            params
          }
        };
        this.ajax(opt);
      },
      // 获取试题类型 - 测评
      getTestQuestionsSeq (loadQuestion = true) {
        let params = {
          papersId: this.papersId
        };
        let opt = {
          ajaxSuccess: res => {
            this.getQuestionSeqCall(res.data, loadQuestion);
            loadQuestion && !this.allQuestionHadAnswer && this.next();
          },
          ajaxParams: {
            url: api.getQuestionsSeq.path,
            method: api.getQuestionsSeq.method,
            params
          }
        };
        this.ajax(opt);
      },
      // 获取试题基本信息 - 测评
      getMyTestInfo () {
        let opt = {
          ajaxSuccess: res => {
            this.evaluationInfo = res.data;
            this.getTestQuestionsSeq();
          },
          ajaxParams: {
            url: api.getMyEvaluationInfo.path,
            method: api.getMyEvaluationInfo.method,
            params: {
              papersId: this.papersId
            }
          }
        };
        this.ajax(opt);
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
      getQuestionSeqCall (arr, loadQuestion) {
        let questionTypeObj = {};
        let allQuestionCount = 0;
        let questionAnswerArr = [];
        let useTime = 0;
        arr.map(item => {
          item.questions.map((qItem, index) => {
            qItem.index = index; // 试题在该题型下属于第几题
            qItem.questionsTypeId = item.questionsTypeId; // 该题的题型id
            useTime += qItem.useTime; // 合计每道题的时间
            if (qItem.answerResult !== null) { // 记录已做试题
              questionAnswerArr.push(qItem.questionsId);
            }
          });
          allQuestionCount += item.questions.length;
          questionTypeObj[item.questionsTypeId] = item;
        });
        // console.log(questionTypeObj);
        // console.log(451,useTime);
        this.useTime = useTime;
        this.questionAnswerArr = questionAnswerArr;
        this.allQuestionCount = allQuestionCount;
        this.questionTypeObj = questionTypeObj;
        if (questionAnswerArr.length === allQuestionCount) {
          this.loadLastQuestion(questionTypeObj); // 加载最后一道题
        }
      },
      // 获取试题成功回调
      getQuestionsSuccessCall (res) {
        this.answer = '';
        // console.log("类型",this.todoType !== 'test')
        if (this.todoType !== 'test') {
          // this.$store.state.app.serveAnswer[question.questionsId]=this.answer;
          console.log("获取试题成功回调",this.$store.state.app.serveAnswer)
          for (var i in this.$store.state.app.serveAnswer) {
            if (i == res.data.questionsId) {
              // console.log(99999, this.$store.state.app.serveAnswer[i])
//            this.answer = this.$store.state.app.serveAnswer[i]
              res.data.studentAnswer = this.$store.state.app.serveAnswer[i]
                // console.log("数据",res.data)
            }
          }
        }
        this.questionData = res.data;
        this.startAnswerTime = res.data.startTime;
        console.log('479',res.data.startTime)
        this.selectQuestionObj.questionsId = this.getQuestionId(res.data);
        this.loading = false;
//         if(this.num==0){
//           this.initTime(this.useTime);
//         }
//         else if(this.todoType !== 'test'&&this.num!=0){
//           if (this.showInput) {
//             this.timerInt = setInterval(this.timer, 1000);
//           }
//         }
        this.num++

      },
      // 加载最后一道题
      loadLastQuestion (obj) {
        let objMap = Object.keys(obj).sort((a, b) => a - b);
        let lastQuestion = obj[objMap[objMap.length - 1]].questions;
        let lastQuestionId = lastQuestion[lastQuestion.length - 1].questionsId;
        this.getQuetion(lastQuestionId);
      },
      // 获取试题内容
      getQuetion (questionsId) {
        let params = {
          test: {
            questionsId,
            papersId: this.papersId
          },
          homework: {
            questionsId,
            workId: this.papersId,
            groupsId: this.groupsId
          }
        };
        let opt = {
          ajaxSuccess: 'getQuestionsSuccessCall',
          ajaxParams: {
            url: api[this.todoType === 'test' ? 'getQuestions' : 'getWorkQuestions'].path,
            method: api[this.todoType === 'test' ? 'getQuestions' : 'getWorkQuestions'].method,
            params: params[this.todoType]
          }
        };
        this.answer = '';
//        if(this.todoType !== 'homework'){
//          clearInterval(this.timerInt);
//        }
//        clearInterval(this.timerInt);
        this.ajax(opt);
      },
      // 保存答案
      saveAnswer (callFun, pushSeq = true, typeItem) {
        //如果有typeItem则左侧不变色
        if (this.answer === '') {
          this.errorMess('请先选择或填写答案！');
          return false;
        }
//        if(this.todoType !== 'homework'){
//          clearInterval(this.timerInt);
//        }

        let data = {
          test: {
            papersId: this.papersId,
            startTime: this.startAnswerTime,
            answer: this.answer,
            questionsId: this.selectQuestionObj.questionsId
          },
          homework: {
            workId: this.papersId,
            startTime: this.startAnswerTime,
            answer: this.answer,
            questionsId: this.selectQuestionObj.questionsId,
            groupsId: this.groupsId
          }
        };
        let opt = {
          ajaxSuccess: res => {
            let useTime = 0;
            console.log("ajaxSuccess",pushSeq, this.questionAnswerArr, this.selectQuestionObj.questionsId, this.selectQuestionObj, !this.questionAnswerArr.includes(this.selectQuestionObj.questionsId))
            if (pushSeq && !this.questionAnswerArr.includes(this.selectQuestionObj.questionsId)) {
              if (this.questionData.childQuestionsList) {
                this.questionData.childQuestionsList[0].studentAnswer = this.answer
                this.questionData.childQuestionsList[0].answerResult = this.answer == this.questionData.childQuestionsList[0].answer ? 1 : 0
              } else {
                this.questionData.studentAnswer = this.answer
                this.questionData.answerResult = this.answer == this.questionData.answer ? 1 : 0
              }
              console.log(this.todoType)

              if (this.todoType === 'test') {
                useTime = this.hour * 3600;
                useTime += this.minute * 60;
                useTime += this.second;
                console.log(this.selectQuestionObj.questionsTypeId, this.selectQuestionObj.index)
                this.questionTypeObj[this.selectQuestionObj.questionsTypeId].questions[this.selectQuestionObj.index].answerResult = -1;

                this.useTime = useTime;
              }
              this.questionAnswerArr.push(this.selectQuestionObj.questionsId)
            }
            this.answer === '';
            this.loading = false;
            console.log(this.questionTypeObj)
            callFun && callFun.apply(this, res);
          },
          ajaxParams: {
            jsonString: true,
            url: api[this.todoType === 'test' ? 'submitAnswer' : 'submitWorkAnswer'].path,
            method: api[this.todoType === 'test' ? 'submitAnswer' : 'submitWorkAnswer'].method,
            data: data[this.todoType]
          }
        };
        this.loading = true;
        this.ajax(opt);
      },
      // 计时器初始化
      initTime (useTime) {
        if (useTime) {
          this.hour = parseInt(useTime / 3600);
          this.minute = parseInt((useTime - 3600 * this.hour) / 60);
          this.second = parseInt(useTime - 3600 * this.hour - 60 * this.minute);
        }
        clearInterval(this.timerInt);
        if (this.showInput) {
          this.timerInt = setInterval(this.timer, 1000);
        }
      },

      // 计时
      timer () {
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

    },
    created () {
      this.init();
    },
    watch: {
      answer (val,newVal) {
          // console.log("---------", this.answer, val, newVal)
        if (this.answer != '') {
            this.$store.state.app.serveAnswer[this.questionData.questionsId] ='';
            this.$store.state.app.serveAnswer[this.questionData.questionsId] = this.answer
            // console.log("+++++++",this.$store.state.app.serveAnswer)
        }
        // console.log(this.$store.state.app.serveAnswer, "%%%%%%%%%%%%%%%%%%%%")
      }
    },
    mounted () {
    },
    beforeDestroy () {
      clearInterval(this.timerInt);
      this.sendTime()
      window.a = 0
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
  window.onbeforeunload = function (e) {
    e = e || window.event
    window.localStorage.a = this
    thatItem.sendTime()
    // 兼容IE8和Firefox 4之前的版本
    if (e) {
      e.returnValue = '关闭提示'
    }
    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    return '关闭提示'
  }

</script>
<style lang="scss">

</style>
