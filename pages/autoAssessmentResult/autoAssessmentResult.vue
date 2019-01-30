<!--
****--@file     autoAssessmentResult
****--@date     2018/1/13 上午2:28
****--@author   jhd
****--@describe   自适应测评结果页面
-->
<template>
    <div class="autoAssessmentResult">
        <headerTop></headerTop>
        <div class="test_result" style="margin-top: 20px">
            <template v-if="answerResult instanceof Object">
                <p class="title">
                    <span>本次测评得分：<i style="color: #fd7416">{{answerResult.totalScore / 100}}</i>分</span>
                    <span>用时：<i>{{answerResult.useTime / 1000 | formatTimes}}</i></span>
                    <span>答对：<i style="color:#11a63f">{{answerResult.answerTrueNum}}</i>道题</span>
                    <span>答错：<i style="color:#fc4341">{{answerResult.answerFalseNum}}</i>道题</span>
                </p>
                <div class="clearfix">
                    <div class="item left" style="margin-right: 25px;width: 585px;">
                        <span class="icon-left"><i></i>正确率</span>
                        <div class="content zql" style="text-align: center;position: relative">
                            <span style="position: absolute;top: 16px;left: 166px;">正确率</span>
                            <co-progress background="#fd7416" type="circle"
                                         :percentage="Number(((answerResult.answerTrueNum/answerResult.questionsCount)*100).toFixed(1))"></co-progress>
                        </div>
                    </div>
                    <div class="item left" style="width: 590px;">
                        <span class="icon-left"><i></i>能力值</span>
                        <div class="content inside">
                            <p>能力值：<i style="color: #fd7416;">{{answerResult.ability}}</i></p>
                            <co-progress :text-inside="true" :stroke-width="18"
                                         :percentage="Number(answerResult.ability)"></co-progress>
                            <p>学习进度：<i style="color: #fd7416;">{{answerResult.studyProgress}} %</i></p>
                            <co-progress :text-inside="true" :stroke-width="18"
                                         :percentage="Number(answerResult.studyProgress)"></co-progress>
                        </div>
                    </div>
                </div>
                <div class="item" v-if="isFirst">
                    <span class="icon-left"><i></i>测评结果</span>
                    <ve-histogram :data="autoAssessmentChartData"
                                  :settings="autoAssessmentChartSettings"></ve-histogram>
                </div>
                <div class="item">
                    <span class="icon-left"><i></i>做题详情</span>
                    <el-button class="right show-paper" @click="showModal = true">查看试卷
                        <i class="el-icon-arrow-right"></i></el-button>
                    <div class="content" style="height: auto;">
                        <p class="detial" v-for="(item,index) in answerResult.knowledgeList" :key="index">
                            {{item.knowledgeName}}：
                            <router-link v-for="(child,ind) in item.stuAnswerInfo" :key="ind" target="_blank"
                                         :to='{path:"/selfCenter/myNoteAdd",query:{questionId:child.questionsId,assessmentId:typeId,types:"autoAssessment"}}'>
                            <span :class="child.answerResult == true ? 'green' : 'red' ">
                                {{child.questionsSeq}}
                            </span>
                            </router-link>

                        </p>
                    </div>
                </div>
                <div class="item">
                    <span class="icon-left"><i></i>测评分析</span>
                    <div class="content" style="height: auto;">
                        <p class="tip" style="padding: 20px;">{{ answerResult.determineResult }}</p>
                    </div>
                </div>
            </template>
            <template v-else>
                <p class="errMsg" style="text-align: center">
                    <span class="el-icon-loading"></span>
                    数据加载中
                </p>
            </template>
        </div>
        <footterButtom></footterButtom>
        <!--查看试卷-->
        <Modal
                :mask-closable="false"
                width="810"
                v-model="showModal"
                title="查看试卷"
                class-name="vertical-center-modal"
                :loading="loading">
            <modal-header slot="header" :content="showId"></modal-header>
            <show v-if="showModal" @cancel="cancel" @show="subCallback" types="2" :typeId="typeId"></show>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    // import testResultApi from '../../sbujectAssistant/api';
    import headerTop from '../../components/common/headTop.vue'
    import footterButtom from '../../components/common/footer.vue'
    import show from '../../components/common/questionsPaper_show.vue'
    import coProgress from '../../components/common/progress.vue'

    export default {
        // props: ['id', 'testType'],
        data() {
            return {
                showId: {
                    id: 'showId',
                    title: '查看试卷'
                },
                typeId: this.$route.query.id,
                loading: false,
                tableData: [],
                answerResult: null,
                gamesAnswerId: '',
                api: {
                    url: "/autoAssessment/getAnswerResult",
                    method: 'get'
                },
                getApi: {
                    url: "/assessment/getAllAnswerQuestion",
                    method: 'get'
                },
                isFirst: '',
                autoAssessmentChartData: {},//自适应测评测评结果
                autoAssessmentChartSettings: null,//自适应测评结果表格设置
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.isFirst = this.$route.query.isFirst;
                this.autoAssessmentChartData = {
                    columns: ['章节', '掌握程度'],
                    rows: [
                        //         {'章节': '第一章', '掌握程度': 0.12, '其他': 25},
                        //         {'章节': '第二章', '掌握程度': 0.345, '其他': 46},
                        //         {'章节': '第三章', '掌握程度': 0.7, '其他': 74},
                        //         {'章节': '第四章', '掌握程度': 0.31, '其他': 24}
                    ]
                }
                this.autoAssessmentChartSettings = {
                    metrics: ['掌握程度'],
                    dimension: ['章节'],
                    yAxisType: ['percent'],
                    yAxisName: ['各章节掌握程度']
                };

                let bind = this.$route.query.bind;
                if(bind) {
                    this.bindAnswerResult()
                } else {
                    this.getAnswerResult();
                }
            },
            bindAnswerResult() {
                let opt = {
                    ajaxSuccess: res => this.getDataSuccess(res),
                    ajaxParams: {
                        url: '/autoAssessment/login/query',
                        params: {
                            assessmentAutoId: this.$route.query.id
                        }
                    }
                };
                this.ajax(opt)
            },
            getAnswerResult() {
                let opt = {
                    ajaxSuccess: res => this.getDataSuccess(res),
                    ajaxParams: {
                        url: this.api.url,
                        method: this.api.method,
                        params: {
                            id: this.$route.query.id
                        }
                    }
                }
                this.ajax(opt)
            },
            getDataSuccess(res) {
                let data = res.data;
                let rows = [];
                data.chapterList.map(item => {
                    rows.push({'章节': item.name, '掌握程度': item.level, chapterId: item.chapterId})
                });
                rows.sort((a, b) => a.chapterId < b.chapterId);
                this.autoAssessmentChartData.rows = rows;
                setTimeout(() => {
                    this.answerResult = data;
                }, 2000);
            },
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if(columnIndex === 0) {
                    if(rowIndex === 0) {
                        return {
                            rowspan: this.tableData.length,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            /**
             * 回调函数
             * **/
            subCallback() {

            },
            /**
             * 回调函数
             * **/
            cancel() {

            }
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            coProgress,
            show,
            headerTop,
            footterButtom
        }
    }

</script>
<style lang="scss">
    .test_result {
        width: 1200px;
        margin: 0 auto;
        .errMsg {
            line-height: 470px;
        }
        .zql {
            .el-progress--circle {
                margin-top: 20px;
                .el-progress-circle {
                    height: 93px !important;
                    width: 93px !important;
                }
            }
        }
        .title {
            font-weight: 500;
            font-size: 14px;
            border-radius: 5px;
            background-color: #f5f5f5;
            line-height: 60px;
            span {
                margin-left: 180px;
            }
        }
        .ve-histogram {
            width: 1200px !important;
        }
        .item {
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
                .numText {
                    text-align: center;
                    margin-top: 20px;
                    i {
                        color: #fd7416;
                    }
                }
                .el-progress-bar__inner {
                    background-color: #fd7416;
                }
                .el-progress--line {
                    margin-top: 6px;
                    width: 80%;
                }
                .el-progress-bar {
                    margin-left: 60px;
                    .el-progress-bar__innerText {
                        color: #fd7416;
                    }
                }
                .el-progress-bar__innerText {
                    display: none
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