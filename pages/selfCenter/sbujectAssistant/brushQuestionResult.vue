<!--
****--@file     brushQuestionResult
****--@date     2017/12/13 下午5:34
****--@author   jhd
****--@describe   测评结果
-->
<template>
    <div class="brushQuestionResult">
        <template v-if="answerResult instanceof Object">
            <p class="title">
                <span>用时：<i>{{ answerResult.useTime / 1000 | formatTimes }}</i></span>
                <span>答对：<i style="color:#11a63f">{{ answerResult.answerTrueNum }}</i>道题</span>
                <span>答错：<i style="color:#fc4341">{{ answerResult.answerFalseNum }}</i>道题</span>
            </p>
            <div class="clearfix">
                <div class="item left" style="margin-right: 25px;width: 432px;">
                    <span class="icon-left"><i></i>正确率</span>
                    <div class="content" style="text-align: center;position: relative">
                        <span style="position: absolute;top: 33px;left: 191px;">正确率</span>
                        <co-progress background="#fd7416" type="circle" :percentage="percentage()"></co-progress>
                    </div>
                </div>
                <div class="item left" style="width: 432px;">
                    <span class="icon-left"><i></i>排名情况</span>
                    <div class="content">
                        <div class="no">
                            <p>击败了 <b>{{ answerResult.rate }}%</b> 的同学</p>
                            <p>当前名次：<b>第{{ answerResult.nowRank }}名</b>！</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <span class="icon-left"><i></i>做题详情</span>
                <div class="content" style="height: auto;">
                    <p class="detial" v-for="(item,index) in knowledge" :key="index">{{ index }}：
                        <span v-for="(cItem,cIndex) in item" :key="cIndex"
                              :class="{'green':cItem.answerResult,'red':!cItem.answerResult}">{{ cItem.questionsSeq }}</span>
                    </p>
                </div>
            </div>
        </template>
        <template v-else>
            <p v-if="answerResult === -1" class="errMsg">
                数据被篡改，环境异常！
            </p>
            <p v-else class="errMsg">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
        </template>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    import api from './api';

    import coProgress from '../../../components/common/progress.vue'

    export default {
        data() {
            return {
                loading: false,
                answerResult: null,
                gamesAnswerId: '',
                knowledge: {}
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                let {gamesAnswerId = ''} = this.$route.params;
                if(!gamesAnswerId || (gamesAnswerId && isNaN(gamesAnswerId))) {
                    this.answerResult = -1;
                    return
                }
                this.gamesAnswerId = gamesAnswerId;
                this.getAnswerResult()
            },
            getAnswerResult() {
                let opt = {
                    ajaxSuccess: res => {
                        let knowledge = {};
                        res.data.stuAnswerInfo.map(item => {
                            if(!knowledge[item.knowledgeName]) {
                                knowledge[item.knowledgeName] = []
                            }
                            knowledge[item.knowledgeName].push(item)
                        });
                        this.knowledge = knowledge;
                        setTimeout(() => {
                            this.answerResult = res.data;
                        }, 2000);
                    },
                    ajaxParams: {
                        url: api.answerResult.path,
                        method: api.answerResult.method,
                        params: {
                            gamesAnswerId: this.gamesAnswerId
                        }
                    }
                }
                this.ajax(opt)
            },
            percentage() {
                let {answerTrueNum = 0, answerFalseNum = 0} = this.answerResult;
                let sum = answerTrueNum + answerFalseNum;
                let num = answerTrueNum / sum;
                return isNaN(num) ? 0 : +((num * 100).toFixed(2));
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            coProgress
        }
    }

</script>
<style lang="scss">
    .brushQuestionResult {
        min-height: 600px;
        padding: 30px 30px;
        .errMsg {
            line-height: 470px;
            text-align: center;
        }
        .title {
            font-weight: 500;
            font-size: 14px;
            border-radius: 5px;
            background-color: #f5f5f5;
            line-height: 60px;
            span {
                margin-left: 90px;
            }
        }
        .no {
            padding: 36px;
        }
        .item {
            margin-top: 36px;
            .icon-left {
                i {
                    display: inline-block;
                    width: 4px;
                    height: 13px;
                    margin-right: 5px;
                    background: #11a63f;
                }
            }
            .show-paper {
                border-radius: 12px;
                padding: 5px 14px;
                background-color: #ffffff;
                border: solid 1px #bfbfbf;
            }
            .content {
                background: #f5f5f5;
                height: 150px;
                padding: 10px 0;
                p {
                    line-height: 30px;
                }
                .analytic {
                    width: 260px;
                    padding: 28px 10px;
                    color: #434343;
                    .name {
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 1.5;
                    }
                    .name-content {
                        font-size: 14px;
                        line-height: 1.43;
                    }
                }
                .detial {
                    line-height: 45px;
                    margin-left: 15px;
                    span {
                        display: inline-block;
                        width: 30px;
                        color: #ffffff;
                        line-height: 30px;
                        text-align: center;
                        border-radius: 15px;
                        margin-right: 10px;
                    }
                    .green {
                        background: #1cc03b;
                    }
                    .red {
                        background: red;
                    }
                }
                .el-progress--circle .el-progress__text {
                    font-size: 28px !important;
                    color: #fd7416;
                }
            }
            .inside {
                position: relative;
                span {
                    position: absolute;
                    top: 30px;
                    left: 38%;
                }
                .el-progress-bar__inner {
                    background-color: #fd7416;
                }
                .el-progress--line {
                    margin-top: 13%;
                    width: 80%;
                }
                .el-progress-bar {
                    margin-left: 42px;
                    .el-progress-bar__innerText {
                        color: #fd7416;
                    }
                }
            }
            #myTable {
                .el-table thead {
                    tr {
                        background-color: #e6f9ec;
                        color: #11a63f;
                    }
                }
            }
            .time {
                font-size: 12px;
                line-height: 1.5;
                text-align: left;
                color: #bfbfbf;
            }
            .tip {
                font-size: 14px;
                text-align: left;
                color: #434343;
            }
        }
    }
</style>