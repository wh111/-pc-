<!--
****--@file     brushQuestion
****--@date     2018/1/3 18:45
****--@author   YC
****--@describe 学科助手 - 刷题
-->
<template>
    <div class="adaptive-evaluation brush-question">
        <div class="modal">
            <div class="logo-wrap">
                <router-link to="/">
                    <img src="../../../assets/images/logo.png" alt="">
                </router-link>
            </div>
            <template v-if="questionData instanceof Object">
                <p class="title">
                    <span>第 {{(questionData.childQuestionsList instanceof Array ? questionData.childQuestionsList[0].questionsSeq : questionData.questionsSeq) + 1 }} 题</span>
                    <span class="tip">还有<b style="color: #fd7416;">{{ questionData.surplusNum }}</b>题</span>
                </p>
                <div class="content">
                    <p class="con-title">
                        <span class="type">题型：{{ questionData.questionsType.name }}</span>
                        <span class="right">竞赛时长：{{ hour }} : {{ minute }} : {{ second }}</span>
                    </p>
                    <div class="con-main">
                        <question-show :showData="questionData" :showInput="true" @answer="setAnswer"></question-show>
                    </div>
                    <div class="con-btn" align="right">
                        <el-button v-if="questionData.surplusNum === 0" :loading="loading" @click="submit">
                            提交
                        </el-button>
                        <el-button v-else :loading="loading" @click="next">下一题</el-button>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="content">
                    <p v-if="questionData === null" class="nodataTip">
                        <span class="el-icon-loading"></span>
                        数据加载中
                    </p>
                    <p v-else-if="questionData === false" class="nodataTip">
                        谢谢，您已经参与过该任务！
                        <router-link to="/selfCenter/competionCenter">返回刷题大赛</router-link>
                    </p>
                    <p v-else class="nodataTip">
                        数据被篡改，环境异常！
                        <router-link to="/selfCenter/competionCenter">返回刷题大赛</router-link>
                    </p>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    import api from './api'
    import questionShow from '../../../components/questionShow/show'

    export default {
        data() {
            return {
                loading: false,

                useTimeInterval: null,

                seasonId: '',
                gamesAnswerId: '',
                answer: '',

                hour: 0,//时
                minute: 0,//分
                second: 0,//秒

                questionData: null
            }
        },

        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                let {seasonId = '', gamesAnswerId = ''} = this.$route.params;
                if(!seasonId || (seasonId && isNaN(seasonId)) || !gamesAnswerId || (gamesAnswerId && isNaN(gamesAnswerId))) {
                    this.questionData = -1;
                    return
                }
                this.seasonId = seasonId;
                this.gamesAnswerId = gamesAnswerId;
                this.start();
            },
            start() {
                this.answer = '';
                this.ajax({
                    ajaxSuccess: res => {
                        let data = res.data;
                        if(data instanceof Object) {
                            this.initTime(res.data.useTime);
                            data.basicType = data.questionsType.childTypes;
                            data.questionsTypeName = data.questionsType.name;
                        }
                        setTimeout(() => {
                                this.questionData = data
                            }, 1500
                        );
                    },
                    ajaxParams: {
                        url: api.start.path,
                        params: {
                            gamesAnswerId: this.gamesAnswerId
                        },
                    },
                })
            },
            timer() {//计时
                this.second += 1;
                if(this.second > 59) {
                    this.second = 0;
                    this.minute += 1;
                }

                if(this.minute > 59) {
                    this.minute = 0;
                    this.hour += 1;
                }
            },
            initTime(useTime) {
                if(useTime) {
                    this.hour = parseInt(useTime / 3600);
                    this.minute = parseInt((useTime - 3600 * this.hour) / 60);
                    this.second = parseInt(useTime - 3600 * this.hour - 60 * this.minute);
                }
                this.useTimeInterval = setInterval(this.timer, 1000);
            },
            setAnswer(d) {
                this.answer = d;
            },
            next() {
                this.saveAnswer((data) => {
                    this.initTime(data.useTime);
                    let temp = data;
                    temp.basicType = temp.questionsType.childTypes;
                    temp.questionsTypeName = temp.questionsType.name;
                    this.questionData = temp;
                })
            },
            submit() {
                this.saveAnswer(() => this.$router.push(`/selfCenter/brushQuestionResult/${this.gamesAnswerId}`))
            },
            saveAnswer(call) {
                if(this.answer === '') {
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
                        this.answer = '';
                        this.loading = false;
                        call(res.data)
                    },
                    ajaxParams: {
                        url: api.submit.path,
                        method: api.submit.method,
                        data: {
                            seasonId: this.seasonId,
                            gamesAnswerId: this.gamesAnswerId,
                            questionsId,
                            sutdentAnswer: this.answer
                        }
                    }
                };
                this.loading = true;
                clearInterval(this.useTimeInterval);
                this.ajax(opt)
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        beforeDestroy() {
            clearInterval(this.useTimeInterval);
            this.useTimeInterval = null;
            console.log('清除时间')
        },
        components: {
            questionShow
        }
    }

</script>
<style lang="scss">
    .brush-question {
        height: 950px;
        background-size: 100% 100%;
        background-image: url("../../../assets/images/adaptiveEvaluation.jpg");
        .nodataTip {
            text-align: center;
            line-height: 500px;
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