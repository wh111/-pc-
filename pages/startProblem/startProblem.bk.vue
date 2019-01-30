<!--
****--@file     startProblem
****--@date     2017/12/25 上午10:36
****--@author   jhd
****--@describe   自选测评-开始做题
-->
<template>
    <div class="startProblem">
        <div class="modal">
            <div class="logo-wrap">
                <router-link to="/">
                    <img src="../../assets/images/logo.png" alt="">
                </router-link>
            </div>
            <template v-if="questionData instanceof Object">
                <p class="title">
                    <span>第{{ questionsSeq }}题</span>
                    <span class="tip">还有<b style="color: #fd7416;">{{(questionAnswerArr.length >= questionConf.questionsCount && !!~questionAnswerArr.indexOf(selQuestionsSeq)) ? 1 : questionConf.questionsCount - questionAnswerArr.length }}</b>题</span>
                </p>
                <div class="content">
                    <div class="left number">
                        <div class="scroll-box">
                            <ul class="number-ul">
                                <li class="number-li"
                                    v-for="i in questionConf.questionsCount"
                                    :class="{'number-li-active': questionsSeq == i,'number-li-right':!!~questionAnswerArr.indexOf(i)}"
                                    @click="getAnswerQuestion(i)"
                                >
                                    {{i}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="left con-main">
                        <p class="con-title">
                            <span class="type">题型:{{ questionData.questionsTypeName }}</span>
                            <span class="right">测试时长：{{ hour }} 时 {{ minute }} 分 {{ second }} 秒</span>
                        </p>
                        <div class="question-item">
                            <question-show :show-data="questionData" :showInput="true"
                                           @answer="setAnswer"></question-show>
                        </div>
                        <div class="btn-wrap">
                            <p class="right-p" align="right">
                                <el-button
                                        v-if="questionAnswerArr.length >= questionConf.questionsCount && !~questionAnswerArr.indexOf(selQuestionsSeq)"
                                        :loading="loading"
                                        @click="submit">
                                    提交
                                </el-button>
                                <template v-else>
                                    <el-button :loading="loading" @click="next">下一题</el-button>
                                    <el-button @click="cancelTest">提交</el-button>
                                </template>
                            </p>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </template>
            <template v-else>
                <p v-if="questionData === null" class="nodataTip">
                    <span class="el-icon-loading"></span>
                    数据加载中
                </p>
                <p v-else-if="questionData === false" class="nodataTip">谢谢，您已经完成测评！</p>
                <p v-else class="nodataTip">您所选择的科目，目前没有测评试题！</p>
            </template>
        </div>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  import api from './api'
  import questionShow from '../../components/questionShow/show'

  export default {
    data() {
      return {
        isLogin: false,
        loading: false,

        useTimeInterval: null,

        selQuestionsSeq: '',
        questionsSeq: 0,
        answer: '',

        hour: 0,//时
        minute: 0,//分
        second: 0,//秒

        questionAnswerArr: [], // 答题索引
        questionInfo: {}, // 试题所属科目、年级等信息
        questionConf: {}, // 试题配置信息
        questionData: null // 试题信息
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        let title = this.$util.getStore('paperTitle');
        let {grade, subject, term, textbookVersionId, chapterIds} = this.$route.query;
        this.$util.removeStore('paperTitle');
        this.isLogin = this.$store.getters['app/isLogin'];
        if(!grade || !subject || !textbookVersionId || !chapterIds) {
          this.questionData = -1;
          return
        }
        term = term || '0';
        this.questionInfo = {grade, subject, term, textbookVersionId, chapterIds, title};
        let questionConf = this.$util.getStore('questionConf');
        if(questionConf) {
          // 记录原来的做题顺序
          let questionAnswerArr = this.$util.getStore('questionAnswerArr');
          questionAnswerArr = JSON.parse(questionAnswerArr);
          if(questionAnswerArr instanceof Array) {
            this.questionAnswerArr = questionAnswerArr
          } else {
            this.questionAnswerArr = []
          }
          // 记录原来的试题数据
          this.questionConf = JSON.parse(questionConf);
          this.next();
        } else {
          // 没有配置试卷标题就返回到选择页面
          if(!title) {
            this.$router.push(`/adaptiveEvaluation`)
            return
          }
          this.add();
        }
      },
      getAnswerQuestion(index) {
        let temp = this.questionConf.questionsIdList[index - 1];
        let opt = {
          ajaxSuccess: res => {
            this.questionsSeq = index;
            this.initTime(res.data.useTime);
            this.questionData = res.data;
          },
          ajaxParams: {
            url: api.getAnswerQuestion.path,
            method: api.getAnswerQuestion.method,
            params: {
              questionsId: temp.questionsId,
              assessmentId: this.questionConf.id
            }
          }
        };
        this.selQuestionsSeq = index;
        this.answer = '';
        clearInterval(this.useTimeInterval);
        this.ajax(opt)
      },
      add() {
        let opt = {
          ajaxSuccess: res => {
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
        this.ajax(opt)
      },
      setAnswer(d) {
        this.answer = d;
      },
      lookTestRes() {
        this.$util.removeStore('questionConf');
        this.$util.removeStore('questionAnswerArr');
        if(this.isLogin) {
          this.$router.push({
            path: `/selfCenter/selfTestResult/3/${this.questionConf.id}`,
            query: {bind: true}
          })
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
      next() {
        this.saveAnswer((data) => {
          if(!data) {
            this.lookTestRes();
            return
          }
          if(data instanceof Object) {
            this.questionsSeq = data.seq + 1;
          } else {
            this.questionsSeq = +this.questionsSeq + 1;
          }
          this.selQuestionsSeq = '';
          this.initTime(data.useTime);
          this.questionData = data;
        })
      },
      submit() {
        if(this.questionData && this.answer === '') {
          this.$Message.error('请先选择或填写答案！');
          return
        }
        let questionsId = '';
        if(this.questionData) {
          // 如果是组合题型则获取小题id
          if(this.questionData.childQuestionsList instanceof Array && this.questionData.childQuestionsList.length) {
            questionsId = this.questionData.childQuestionsList[0].id
          } else {
            questionsId = this.questionData.id
          }
        }
        let opt = {
          ajaxSuccess: () => this.lookTestRes(),
          ajaxParams: {
            url: api.submit.path,
            method: api.submit.method,
            data: {
              assessmentId: this.questionConf.id,
              questionsId,
              answer: this.answer
            }
          }
        }
        this.ajax(opt)
      },
      saveAnswer(call) {
        if(this.questionData && this.answer === '') {
          this.$Message.error('请先选择或填写答案！');
          return
        }
        let questionsId = '';
        if(this.questionData) {
          // 如果是组合题型则获取小题id
          if(this.questionData.childQuestionsList instanceof Array && this.questionData.childQuestionsList.length) {
            questionsId = this.questionData.childQuestionsList[0].id
          } else {
            questionsId = this.questionData.id
          }
        }
        let opt = {
          ajaxSuccess: res => {
            this.loading = false;
            this.answer = '';
            if(!~this.questionAnswerArr.indexOf(this.questionsSeq)) {
              this.questionAnswerArr.push(this.questionsSeq);
            }
            this.$util.setStore('questionAnswerArr', this.questionAnswerArr);
            call(res.data)
          },
          ajaxParams: {
            url: api[this.isLogin ? 'getNextQuestions' : 'getNextQuestionsNologin'].path,
            method: api[this.isLogin ? 'getNextQuestions' : 'getNextQuestionsNologin'].method,
            data: {
              assessmentId: this.questionConf.id,
              questionsId,
              answer: this.answer
            }
          }
        };
        this.loading = true;
        clearInterval(this.useTimeInterval);
        this.ajax(opt)
      },
      initTime() {
        this.useTimeInterval = setInterval(this.timer, 1000);
      },
      timer() {//计时
        this.second = this.second + 1;
        if(this.second > 59) {
          this.second = 0;
          this.minute = this.minute + 1;
        }

        if(this.minute > 59) {
          this.minute = 0;
          this.hour = this.hour + 1;
        }
      },
      choice(id) {
        this.answer = id
      },
      up() {
        this.numDown == this.numDown++;
        this.num = this.num - 20
      },
      down() {
        this.numDown == this.numDown--;
        this.num = this.num + 20
      },
      cancelTest() {
        this.$confirm('未完成指定自选测评试卷，提前提交将不保存此次测评记录；确定提交？').then(_ => {
          this.$util.removeStore('questionConf');
          this.$util.removeStore('questionAnswerArr');
          this.$router.push('/selfCenter/selfTest')
        }).catch(() => {
        });
      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      questionShow
    }
  }

</script>
<style lang="scss">
    .startProblem {
        height: 950px;
        background-size: 100% 100%;
        background-image: url("../../assets/images/adaptiveEvaluation.jpg");
        .nodataTip {
            text-align: center;
            line-height: 440px;
            background-color: #fff;
        }
        .number {
            width: 240px;
            height: 440px;
            background: #f4f4f4;
            margin: 30px;
            padding: 20px;
            padding-right: 0;
            .scroll-box {
                overflow: auto;
                width: 100%;
                height: 100%;
                overflow: auto;
                width: 100%;
                height: 100%;
            }
            .number-ul {
                width: 200px;
            }
            .number-li {
                float: left;
                width: 40px;
                text-align: center;
                line-height: 30px;
                background-color: #ffffff;
                cursor: pointer;
            }
            .number-li-right {
                background-color: #e5e5e5;
            }
            .number-li-active {
                background: #fd7416;
                color: #ffffff;
            }
        }
        .modal {
            .logo-wrap {
                position: absolute;
                top: 65px;
                left: 0px;
            }
            position: relative;
            width: 1200px;
            margin: 0 auto;
            padding-top: 150px;
            .title {
                font-size: 26px;
                background-color: #ebede1;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.54;
                letter-spacing: 0.1px;
                text-align: center;
                color: #313131;
                .tip {
                    float: right;
                    margin-right: 50px;
                    font-size: 16px;
                    line-height: 2.5;
                    letter-spacing: 0.1px;
                    text-align: left;
                    color: #313131;
                }
            }
            .content {
                background: #ffffff;
                min-height: 500px;
                position: relative;
                .con-title {
                    font-size: 14px;
                    line-height: 3.57;
                    text-align: left;
                    .type {
                        color: #11a63f;
                    }
                }
                .con-main {
                    width: 880px;
                }
            }
            .question-item {
                margin-top: 20px;
                min-height: 350px;
                .question-content {
                    float: left;
                    width: 600px;
                }
            }
            .btn-wrap {
                width: 100%;
                padding: 20px;
                overflow: hidden;
                .right-p {
                    width: 300px;
                    float: right;
                    .el-button {
                        background: #fd7416;
                        color: #ffffff;
                        border: 1px solid #fd7416;
                    }
                }
                .left-p {
                    .el-button {
                        border-radius: 30px;
                        background: #fff;
                        color: #313131;
                    }
                    .active {
                        background: #fd7416;
                        color: #ffffff;
                        border: 1px solid #fd7416;
                    }
                }
            }
        }
    }
</style>
