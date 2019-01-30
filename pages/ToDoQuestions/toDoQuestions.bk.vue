<!--
****--@file     toDoQuestions
****--@date     2018/1/11 下午3:34
****--@author   jhd
****--@describe   我的题库做题页面
-->
<template>
    <div class="adaptive-evaluation choice-evaluation">
        <div class="modal">
            <div class="logo-wrap">
                <router-link to="/">
                    <img src="../../assets/images/logo.png" alt="">
                </router-link>
            </div>
            <template v-if="questionData instanceof Object">
                <p class="title">
                    <span>第 {{ seq }} 题</span>
                    <span class="tip">还有<b style="color: #fd7416;">{{ surplusQuestion() }}</b>题</span>
                </p>
                <div class="content clearfix">
                    <div class="left number">
                        <ul class="number-ul clearfix">
                            <li class="number-li" v-for="item in questionList">
                                <el-button :disabled="!item.isAnswer"
                                           :class="item.seq == seq ? 'number-li-active': ''"
                                           @click="jumpQuestionById(item.seq)">{{item.seq}}
                                </el-button>
                            </li>
                        </ul>

                    </div>
                    <div class="left" style="width: 680px;">
                        <p class="con-title">
                            <span class="type">题型：{{ questionData.questionsTypeName }}</span>
                            <span class="right">竞赛时长：{{ hour }} 时 {{ minute }} 分 {{ second }} 秒</span>
                        </p>
                        <div class="con-main">
                            <question-show :showData="questionData" :showInput="!questionList[seq].isAnswer"
                                           @answer="setAnswer" :showAnswer="questionList[seq].isAnswer"></question-show>
                        </div>
                        <div class="con-btn" align="right">
                            <el-button :loading="loading" @click="submit">提交</el-button>
                            <template v-if="surplusQuestion()||allQuestion==seq">
                                <el-button v-if="questionList[seq].isAnswer" :loading="loading" @click="next">下一题
                                </el-button>
                                <el-button v-else :loading="loading" @click="confirm">确定</el-button>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="content">
                    <p class="nodataTip">
                        <span class="el-icon-loading"></span>
                        数据加载中
                    </p>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    import paperList from './components/paperList.vue'
    import coProgress from '../../components/common/progress.vue'
    import questionShow from '../../components/questionShow/show'

    import api from './api'

    export default {
        data() {
            return {
                loading: false,

                productId: null,
                papersId: null,

                answer: '',
                seq: '', // 当前试题索引
                allQuestion: 0, // 总题数
                answerArr: [], // 已经答题的索引

                timerInt: null, // 时间计时器
                hour: 0,//时
                minute: 0,//分
                second: 0,//秒

                questionsId: '',//当前试题ID
                questionList: {}, // 试题题号数据
                questionData: null,
            }
        },

        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                let {productId = '', papersId = ''} = this.$route.params;
                this.productId = productId;
                this.papersId = papersId;
//                if(){
//
//                }
                this.queryQuestionList()
            },
            // 还剩余几道题
            surplusQuestion() {
                return this.allQuestion - this.answerArr.length - (!!~this.answerArr.indexOf(this.seq) ? 0 : 1)
            },
            /**
             * 获取试题编号
             * **/
            queryQuestionList() {
                this.ajax({
                    ajaxSuccess: res => {
                        let data = res.data;
                        let temp = {};
                        let defIndex = ''; // 试题索引
                        let doSomeOne = false; // 已经做过试题
                        if(data instanceof Array && data.length) {
                            // 是否已经做过
                            doSomeOne = data.some(item => item.isAnswer);
                            this.allQuestion = data.length;
                            data.map(item => {
                                if(doSomeOne && item.isAnswer) { // 记录最后一次做题的索引
                                    defIndex = item.seq;
                                    this.answerArr.push(item.seq)
                                } else { // 默认第一题
                                    !defIndex && (defIndex = item.seq);
                                }
                                temp[item.seq] = item
                            })
                        }
                        this.questionList = temp;
                        if(doSomeOne) { // 已经做过题
                            this.seq = defIndex;
                            this.next()
                        } else { // 没有做过题
                            defIndex && this.jumpQuestionById(defIndex)
                        }
                    },
                    ajaxParams: {
                        url: api.queryQuestionList.path,
                        method: api.queryQuestionList.method,
                        params: {
                            papersId: this.papersId,
                            productId: this.productId
                        }
                    }
                })
            },
            /**
             * 提交答题（提交答案，获取正确情况）
             * **/
            confirm() {
                if(this.answer === '') {
                    this.$Message.error('请先选择或填写答案！');
                    return false
                }
                clearInterval(this.timerInt);
                let opt = {
                    ajaxSuccess: res => {
                        this.questionList[this.seq].isAnswer = true;
                        this.answerArr.push(this.seq);
                        this.answer = '';
                        this.getQuestionsById(this.seq);
                    },
                    ajaxParams: {
                        url: api.submitAnswer.path,
                        method: api.submitAnswer.method,
                        data: {
                            papersId: this.papersId,
                            seq: this.seq,
                            productId: this.productId,
                            myAnswer: this.answer,
                            questionsId: this.questionsId
                        }
                    }
                };
                this.ajax(opt);
            },
            /**
             * 跳题
             * **/
            jumpQuestionById(seq) {
                this.seq = seq;
                this.getQuestionsById(seq);
            },
            /**
             * 根据id获取试题详情
             * @param val Object
             * **/
            getQuestionsById(seq) {
                clearInterval(this.timerInt);
                this.ajax({
                    ajaxSuccess: res => {
                        this.questionData = res.data;
                        // 分题型记录数据
                        if(res.data.childQuestionsList instanceof Array && res.data.childQuestionsList.length) {
                            this.questionsId = res.data.childQuestionsList[0].id;
                        } else {
                            this.questionsId = res.data.id;
                        }
                        this.timerInt = setInterval(() => this.timer(), 1000);
                    },
                    ajaxParams: {
                        url: api.getQuestionsById.path,
                        method: api.getQuestionsById.method,
                        params: {
                            questionsId: this.questionList[seq].id,
                            productId: this.productId,
                            papersId: this.papersId
                        }
                    }
                })
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
            setAnswer(d) {
                this.answer = String(d);
            },
            next() {
                clearInterval(this.timerInt);
                this.getNextQuestions((data) => {
                    if(data instanceof Object) {
                        this.questionData = data;
                        // 分题型记录数据
                        if(data.childQuestionsList instanceof Array && data.childQuestionsList.length) {
                            this.seq = data.childQuestionsList[0].seq;
                            this.questionsId = data.childQuestionsList[0].id;
                        } else {
                            this.seq = data.seq;
                            this.questionsId = data.id;
                        }
                        // 只有在未答题的时候才进行计时，已经做过的题不再计时
                        if(!this.questionList[this.seq].isAnswer) {
                            this.timerInt = setInterval(() => this.timer(), 1000);
                        }
                        this.answer = '';
                    } else {
                        this.successMess('您已完成练习，即将跳转到我的题库！')
                        let that = this;
                        setTimeout(function() {
                            clearInterval(that.timerInt);
                            that.timerInt = null;
                          if (that.$route.query.type) {
                            that.$router.push({
                              name: 'personalQuestion',
                              query: {type: '1'}
                            })
                          } else {
                            that.$router.push({
                                path: '/selfCenter/personalQuestion_goon',
                                query: {productId: that.productId}
                            })
                          }

                        }, 3000)
                    }
                })
            },
            submit() {
                this.getNextQuestions(() => this.$router.push({
                    path: '/selfCenter/personalQuestion_goon',
                    query: {productId: this.productId}
                }));
            },
            getNextQuestions(call) {
                let opt = {
                    ajaxSuccess: res => {
                        this.loading = false;
                        call(res.data)
                    },
                    ajaxParams: {
                        url: api.getNextQuestions.path,
                        method: api.getNextQuestions.method,
                        params: {
                            papersId: this.papersId,
                            seq: this.seq,
                            productId: this.productId
                        }
                    }
                };
                this.loading = true;
                this.ajax(opt)
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        beforeDestroy() {
            clearInterval(this.timerInt);
            this.timerInt = null;
        },
        components: {
            coProgress,
            paperList,
            questionShow
        }
    }

</script>
<style lang="scss">
    @import "../../../src/assets/css/paper/question";

    .choice-evaluation {
        height: 950px;
        background-size: 100% 100%;
        background-image: url("../../assets/images/adaptiveEvaluation.jpg");
        .nodataTip {
            text-align: center;
            line-height: 500px;
        }
        .number {
            width: 240px;
            height: 430px;
            background: #f4f4f4;
            margin: 30px;
            padding: 20px;
            .nodataTip {
                line-height: 400px;
            }
            .number-li {
                float: left;
                width: 40px;
                text-align: center;
                line-height: 30px;
                background-color: #ffffff;
            }
            .number-li-right {
                background-color: #e5e5e5;
            }
            .number-li-active {
                background: #fd7416;
                color: #ffffff;
            }
            .number-li-right-red {
                background: red;
                color: #ffffff;
            }
            .number-li-right-success {
                background: green;
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
        }
        .content {
            background: #ffffff;
            padding: 0 100px;
            min-height: 500px;
            position: relative;
        }
        .con-title {
            font-size: 14px;
            line-height: 3.57;
            text-align: left;
            .type {
                color: #11a63f;
            }
        }
        .con-main {
            min-height: 360px;
            max-height: 500px;
            overflow: auto;
        }
        .con-btn {
            padding: 20px 0;
            button {
                width: 140px;
                height: 46px;
                border-radius: 23px;
                line-height: 2.5;
                letter-spacing: 0.1px;
                color: #fefefe;
                background-color: #fd7416;
                border: none;
                cursor: pointer;
            }
        }
    }
</style>
