<!--
****--@file     growthArchives.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe   成长档案
-->
<template>
    <div>
        <div class="growthArchives-root">

            <button class="seeHistory" style="border: none;color: #fff;background: #fd7416">导出</button>
            <router-link to="/selfcenter/seeHistory">
                <el-button class="seeHistory orangeYellow" style="border: none;color: #fff;background: #fd7416"> 查看历史
                </el-button>
            </router-link>
            <h1>{{year}}年{{grade | grade}}{{term | term}}成长档案</h1>
            <div class="select-project">选择科目：
                <el-radio @change="change" v-model="subject" :label="item.code" v-for="(item,index) in bookBtn"
                          :key="index">{{item.value}}
                </el-radio>

            </div>

            <div class="groupsDetailtitle">
                <div></div>&nbsp;章节掌握
            </div>
            <div class="know-access">
                <p style="color: #fd7416" v-if="chapter.length==0">暂无数据</p>
                <!--<div  v-if="chapter.length!=0" >-->
                <div :class="chapter.length==0?'vis':''">
                    <div id="myRadarChart" :style="{width: '890px', height: '300px'}"></div>
                </div>
                <!--</div>    -->
            </div>
            <div class="groupsDetailtitle">
                <div></div>&nbsp;科目掌握度
            </div>
            <div style="height: 280px">
                <el-select @change="drawProjectPerData" v-model="myProjectprecent" placeholder="默认"
                           style="float: left;z-index: 100">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <!--<p style="color: #fd7416" v-if="!chapter" >暂无数据</p>-->
                <div id="myProjectprecent" :style="{width: '890px', height: '300px',top:'-40px'}"></div>

            </div>
            <div class="groupsDetailtitle">
                <div></div>&nbsp;近日做题量
            </div>
            <div style="height: 280px">
                <el-select v-model="valuemyProjectprecentNumofquestion" placeholder="默认"
                           style="float: left;z-index: 100" @change="drawmyProjectprecentNumofquestionData">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <div id="myProjectprecent-numofquestion" :style="{width: '890px', height: '300px',top:'-40px'}"></div>

            </div>
            <div class="groupsDetailtitle">
                <div></div>&nbsp;&nbsp;&nbsp;历次作业成绩走势图
            </div>
            <div style="height: 280px">
                <el-select v-model="passGrade1" placeholder="默认" style="float: left;z-index: 100">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <div id="passGrade" :style="{width: '890px', height: '300px',top:'-40px'}"></div>

            </div>

        <div class="groupsDetailtitle">
            <div></div>&nbsp;历次班组排名
        </div>
        <div style="height: 280px">
            <el-select v-model="passGradeRanking1" placeholder="默认" style="float: left;z-index: 100">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <div id="passGradeRanking" :style="{width: '890px', height: '300px',top:'-40px'}"></div>

        </div>
        <div class="groupsDetailtitle">
            <div></div>&nbsp;测评分析
        </div>
        <div id="myTable" ref="myTable" class="growthArchives-myTable" style="width: 890px">

            <el-table
                    :data="LastTableData"
                    border
                    style="width: 890px;">
                <el-table-column
                        prop="id"
                        label="序号"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="project"
                        label="科目"
                        align="center">
                    <template slot-scope="scope">
                        {{scope.row.project}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="testName"
                        label="评测名称"
                        align="center"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="testDate"
                        width="150"
                        label="评测日期"
                        align="center"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatDate('yyyy-MM-dd HH:mm')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="timer"
                        label="结束时间"
                        align="center"
                        show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.updateTime | formatDate('yyyy-MM-dd HH:mm')}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="answerTrueNum"
                        label="答对题数"
                        align="center"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="answerFalseNum"
                        label="答错题数"
                        align="center"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center">
                    <template slot-scope="scope">
                        <router-link to="/selfCenter/selfTestResult">
                            <el-button class="whiteButton">查看</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" style="width: 920px">
                <div style="text-align: center">
                    <el-pagination
                            @size-change="changePageSize"
                            @current-change="changePage"
                            :current-page.sync="myPages.currentPage"
                            :page-size="myPages.pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="groupsDetailtitle">
            <div></div>&nbsp;已完成作业
        </div>
        <div class="selfWork" v-for="item in alreadywork">
            <p>
                布置者:{{item.teacher}}&nbsp &nbsp&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp&nbsp&nbsp 来源：{{item.origin}} <span>布置时间：{{item.time}}&nbsp&nbsp&nbsp&nbsp&nbsp  上交时间：2013-08-09 10：00 </span>
            </p>
            <div class="selfWorkname">
                <ul>
                    <li class="title">
                        <div class="ulleft">作业名称：{{item.name}}</div>
                    </li>
                    <li class="sec">完成状态：<span class="alreadyComplate">{{item.title}}</span></li>
                </ul>

                <div class="selfready">
                    <router-link
                            :to="{name:'homeworkAlreadydid',params:{id:item.id,type:'homeWork'},query:{groupsId:item.groupsId}}">
                        <!--to="{path:'/selfCenter/homeworkAlreadydid',params:{id:1}}"-->
                        <el-button class="whiteButton">查看详情 ></el-button>
                    </router-link>
                </div>
                <div class="selfWorkprocess">
                    <co-progress background="#fd7416" type="circle" :width="60" :percentage="90"></co-progress>
                </div>
            </div>

        </div>
        <div class="seeMore" @click="showmore" v-if="this.totalCount1>this.list.length">
            展开更多
            <i class="el-icon-tickets"></i>
        </div>
    </div>
    </div>
</template>
<script>
    import echarts from 'echarts'
    import coProgress from '../../../components/common/progress.vue'
    import api from './api'

    let Util = null
    export default {
        data() {
            return {
                mouth: "",
                myProjectprecent: '',//科目掌握度
                valuemyProjectprecentNumofquestion: '',
                passGrade1: '',//历次成绩走势图
                passGradeRanking1: '',//历次班组排名
                options: [{
                    value: '1',
                    label: '一月'
                }, {
                    value: '2',
                    label: '二月'
                }, {
                    value: '3',
                    label: '三月'
                }, {
                    value: '4',
                    label: '四月'
                }, {
                    value: '5',
                    label: '五月'
                }, {
                    value: '6',
                    label: '六月'
                }, {
                    value: '7',
                    label: '七月'
                }, {
                    value: '8',
                    label: '八月'
                }, {
                    value: '9',
                    label: '九月'
                }, {
                    value: '10',
                    label: '十月'
                }, {
                    value: '11',
                    label: '十一月'
                }, {
                    value: '12',
                    label: '十二月'
                },],

                value: '',
                totalCount: 0,
                totalCount1: 0,
                grade: this.$route.query.grade,
                subject: 'Chinese',
                term: this.$route.query.term,
                year: this.$route.query.year,
                alreadywork: [{}],
                selectHomeworkNum: '1',
                selectDate: '1',
                selectbefore: '1',
                GradeRankBefore: '1',
                radio: '1',
                bookBtn: [],
                LastTableData: [],
                queryQptions1: {},
                list: [],
                precentNumofquestion: {},//近日做题量
                percentNumData: [],//近日做题量数据
                porjectCatch: {},//科目掌握度
                chapter: [],//章节
                chapterValue: [],
                formValidate: {},
                porjectLevel: [],//科目掌握度数据
            }
        },
        created() {
            this.init();


        },
        mounted() {


            //this.drawmyProjectprecentNumofquestion()//近日做题量
            this.passGrade()//历次成绩走势图
            this.passGradeRanking()//历次班组排名
            this.bookBtn = this.$store.state.app.envs.gradeMap[this.grade]

        },
        methods: {
            init() {
                this.queryQptions1 = {
                    url: api.myQuestionDetailList.path,
                    params: {
                        curPage: 1,
                        pageSize: 3,
                        problemId: this.$store.state.user.info.id,
                    },
                },
                    this.drawRadarData()//雷达图
                this.drawProjectPerData()//科目掌握度
                this.drawmyProjectprecentNumofquestionData()//近日做题量
                this.passGradeData()//历次成绩走势图
                this.passGradeRankingData()//历次班组排名
                Util = this.$util;
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.queryAssessmentList.path,
                    params: {
                        curPage: 1,
                        pageSize: Util.pageInitPrams.pageSize,
                    },
                }
                this.setTableData();//分析测评
            },
            change() {

                this.init()
            },
            getList() {//获取已完成作业
                this.ajax({
                    ajaxSuccess: this.listData,
                    ajaxParams: this.queryQptions1,
                })
            },
            listData(res) {
                this.totalCount1 = res.data.dataList.totalCount;
            },
            setTableData(isLoading) {
                this.formValidate = {
                    grade: this.grade,
                    subject: this.subject,
                    term: this.term,
                }
                this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate);
                this.ajax({
                    ajaxSuccess: this.listDataSuccess,
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            listDataSuccess(res) {//获取分析列表
                this.queryQptions = res.data.dataList;
                this.totalCount = res.data.dataList.totalCount || 0;
            },
            drawRadarData() {//雷达图数据
                this.ajax({
                    ajaxSuccess: this.queryChapterLevelListSuccess,
                    ajaxParams: {
                        //baseURL:'PUBLIC',
                        url: api.queryChapterLevelList.path,
                        params: {
                            grade: this.grade,
                            subject: this.subject,
                            term: this.term,
                        },
                    },
                })
            },
            queryChapterLevelListSuccess(res) {
                this.chapter = [];
                for(var i = 0; i < res.data.dataList.length; i++) {
                    var m = {};
                    m = {name: res.data.dataList[i].name, max: 100}
                    this.chapter.push(m)
                    this.chapterValue[i] = res.data.dataList[i].level * 100 || 0;
                }
                this.drawRadar()
            },
            drawProjectPerData() {//科目掌握度
                if(this.myProjectprecent) {
                    this.porjectCatch = {
                        grade: this.grade,
                        subject: this.subject,
                        term: this.term,
                        date: this.year + '-' + this.myProjectprecent
                    }
                } else {
                    this.porjectCatch = {
                        grade: this.grade,
                        subject: this.subject,
                        term: this.term,
                        date: ''
                    }
                }
                this.ajax({
                    ajaxSuccess: 'drawProjectPerDataSuccess',
                    ajaxParams: {
                        //baseURL:'PUBLIC',
                        url: api.querySubjectLevelList.path,
                        params: this.porjectCatch,
                    },
                })
            },
            drawProjectPerDataSuccess(res) {//科目掌握度获取成功
                console.log(this.porjectLevel)
                if(this.myProjectprecent) {
                    var dataTime = [];
                    var dataTrue = [];

                    for(var i = 0; i < res.data.length; i++) {
                        dataTime[i] = res.data[i].year + '-' + res.data[i].month + '-' + res.data[i].day;
                        dataTrue[i] = res.data[i].level || 0;

                    }
                    this.porjectLevel = [dataTime, dataTrue,]
                } else {
                    var dataTime = [];
                    var dataTrue = [];
                    var total = [];
                    for(var i = 0; i < res.data.length; i++) {

                        dataTime[i] = res.data[i].date;
                        dataTrue[i] = res.data[i].level || 0;
                    }
                    this.porjectLevel = [dataTime, dataTrue,]

                }
                console.log(this.porjectLevel)
                this.drawProjectPer()//科目掌握度
                //this.drawmyProjectprecentNumofquestion()

            },
            drawmyProjectprecentNumofquestionData() {//近日做题量

                if(this.valuemyProjectprecentNumofquestion) {
                    this.precentNumofquestion = {
                        grade: this.grade,
                        subject: this.subject,
                        term: this.term,
                        date: this.year + '-' + this.valuemyProjectprecentNumofquestion
                    }
                } else {
                    this.precentNumofquestion = {
                        grade: this.grade,
                        subject: this.subject,
                        term: this.term,
                        date: ''
                    }
                }
                this.ajax({
                    ajaxSuccess: 'drawmyProjectprecentNumofquestionDataSuccess',
                    ajaxParams: {
                        //baseURL:'PUBLIC',
                        url: api.queryQuestionsNumList.path,
                        params: this.precentNumofquestion,
                    },
                })
            },
            drawmyProjectprecentNumofquestionDataSuccess(res) {//获取近日做题量成功
                if(this.valuemyProjectprecentNumofquestion) {
                    var dataTime = [];
                    var dataTrue = [];
                    var dataFalse = [];
                    var total = [];
                    for(var i = 0; i < res.data.length; i++) {
                        dataTime[i] = res.data[i].year + '-' + res.data[i].month + '-' + res.data[i].day;
                        dataTrue[i] = res.data[i].answerTrueNums || 0;
                        dataFalse[i] = res.data[i].answerFalseNums || 0;
                        total[i] = res.data[i].answerTrueNums || 0 + res.data[i].answerFalseNums || 0;
                    }
                    this.percentNumData = [dataTime, total, dataTrue, dataFalse]
                } else {
                    var dataTime = [];
                    var dataTrue = [];
                    var dataFalse = [];
                    var total = [];
                    for(var i = 0; i < res.data.length; i++) {
                        dataTime[i] = res.data[i].date;
                        dataTrue[i] = res.data[i].answerTrueNums || 0;
                        dataFalse[i] = res.data[i].answerFalseNums || 0;
                        total[i] = res.data[i].answerTrueNums || 0 + res.data[i].answerFalseNums || 0;
                    }
                    this.percentNumData = [dataTime, total, dataTrue, dataFalse]

                }
                this.drawmyProjectprecentNumofquestion()
            },
            passGradeData() {//历次成绩走势图

            },
            passGradeRankingData() {//历次班组排名

            },
            selectTime(i) {//科目掌握度
                this.selectDate = i;

            },
            selectHomeworkNum1(i) {//近日做题量
                this.selectHomeworkNum = i
            },
            selectbefore1(num) {//历次作业成绩走势图
                this.selectbefore = num
            },
            selectGradeRankBefore(num) {//历次班组排名
                this.GradeRankBefore = num
            },

            showmore() {
                this.queryQptions1.params.curPage++;
                this.getList();
            },
            drawRadar() {//雷达图

                // return false
                let myChart = echarts.init(document.getElementById('myRadarChart'))
                if(this.chapter.length == 0) {
                    return false
                }
                myChart.setOption({
                    title: {
                        text: '',
                    },
                    tooltip: {},
                    legend: {
                        data: ['', ''],
                    },
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5],
                            },
                        },
                        // indicator:[{}],
                        indicator: this.chapter,
//                        indicator:  [
//                            {name: '第一章', max: 100},
//                            {name: '第二章', max: 100},
//                            {name: '第三章', max: 100},
//                            {name: '第四章', max: 100},
//                        ],
                    },
                    series: [
                        {
                            name: '章节掌握度',
                            type: 'radar',
                            // areaStyle: {normal: {}},
                            data: [
                                {
                                    value: this.chapterValue,
                                    // value:   [50, 40, 70, 100],
                                    name: '掌握百分比(%)',
                                }
                            ],
                        }],
                })

            },
            drawProjectPer() {//科目掌握度图

                console.log(this.porjectLevel)
                let myProjectprecent = echarts.init(document.getElementById('myProjectprecent'))
                myProjectprecent.setOption({
                    tooltip: {
                        trigger: 'axis',
                    },
                    toolbox: {
                        show: true,
                        feature: {},
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.porjectLevel[0]
                        // data: ['8月11日', '8月12日', '8月13日', '8月14日', '8月15日', '8月16日', '8月17日'],
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}',
                        },
                    },
                    series: [
                        {
                            name: '掌握度',
                            type: 'line',
                            data: this.porjectLevel[1],

                            markLine: {
                                data: [],
                            },
                        },
                    ],
                })
            },
            drawmyProjectprecentNumofquestion() {
                //myProjectprecent-numofquestion
                // console.log(this.percentNumData)
                let aa = echarts.init(document.getElementById('myProjectprecent-numofquestion'))
                aa.setOption({
                    tooltip: {
                        trigger: 'axis',
                    },
                    toolbox: {
                        show: true,
                        feature: {},
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.percentNumData[0],
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} '
                        }
                    },
                    series: [
                        {
                            name: '做题量',
                            type: 'line',
                            data: this.percentNumData[1],
                            markLine: {
                                data: [],
                            },
                        },
                        {
                            name: '答对数',
                            type: 'line',
                            data: this.percentNumData[2],
                            markLine: {
                                data: [],
                            },
                        },
                        {
                            name: '答错数',
                            type: 'line',
                            data: this.percentNumData[3],
                            markLine: {
                                data: [],
                            },
                        },



                    ],
                })
            },
            passGrade() {
                //myProjectprecent-numofquestion
                let aa = echarts.init(document.getElementById('passGrade'))
                aa.setOption({
                    tooltip: {
                        trigger: 'axis',
                    },
                    toolbox: {
                        show: true,
                        feature: {},
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['8月11日', '8月12日', '8月13日', '8月14日', '8月15日', '8月16日', '8月17日'],
                    },
                    yAxis: {
                        type: '',
                        axisLabel: {
                            formatter: '{} ',
                        },
                    },
                    series: [
                        {
                            name: '分数',
                            type: 'line',
                            data: [30, 60, 80, 56, 100, 70, 39],

                            markLine: {
                                data: [],
                            },
                        },
                    ],
                })
            },
            passGradeRanking() {
                //myProjectprecent-numofquestion
                let aa = echarts.init(document.getElementById('passGradeRanking'))
                aa.setOption({
                    tooltip: {
                        trigger: 'axis',
                    },
                    toolbox: {
                        show: true,
                        feature: {},
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['8月11日', '8月12日', '8月13日', '8月14日', '8月15日', '8月16日', '8月17日'],
                    },
                    yAxis: {
                        type: '',
                        axisLabel: {
                            formatter: '{} ',
                        },
                    },
                    series: [
                        {
                            name: '分数',
                            type: 'line',
                            data: [30, 60, 80, 56, 100, 70, 39],

                            markLine: {
                                data: [],
                            },
                        },
                    ],
                })
            },
        },
        components: {coProgress},

    }
</script>
<style lang="scss">
    @import '../css/growthArchives.scss';

    .vis {
        visibility: hidden;
    }
</style>