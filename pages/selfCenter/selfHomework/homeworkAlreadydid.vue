<!--
****--@file     homeworkAlreadydid.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  已完成测评详情/已完成作业详情
-->
<template>
    <div class="homeworkAlreadydid-root">
        <h1 v-if="$route.params.type != 'homework'">测评详情</h1>
        <h1 v-else>作业详情</h1>
        <div class="detail">
            <div class="selfWork">
                <p>
                    布置者：{{myEvaluationInfoMessage.operatorName}}&nbsp &nbsp&nbsp&nbsp&nbsp <span>布置时间：{{myEvaluationInfoMessage.releaseTime | formatDate('yyyy-MM-dd HH:mm')}}&nbsp&nbsp&nbsp&nbsp&nbsp  上交时间：{{myEvaluationInfoMessage.endTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                </p>
                <div class="selfWorkname">
                    <ul>
                        <li class="title">
                            <div class="ulleft"><label v-if="$route.params.type != 'homework'">测评名称：</label>
                                <label v-else style="margin-left: 30px">作业名称：</label>{{myEvaluationInfoMessage.name}}
                            </div>
                        </li>
                    </ul>

                    <div class="selfready" style="height: 60px">
                        完成状态：<span>已完成</span>
                    </div>

                </div>

            </div>
            <div class="tab">
                <el-tabs v-model="activeName" type="card" style="" @tab-click="handleClick">
                    <el-tab-pane label="个人详情" name="first" style="">
                        <div class="groupsDetailtitle">
                            <div></div>&nbsp;正确率
                        </div>
                        <diV class="circle">
                            <span class="span">正确率</span>
                            <co-progress style="margin-left: 310px;float: left" background="#fd7416" type="circle"
                                         :percentage="UserEvaluationInfo.correctRate||0">

                            </co-progress>
                            <ul style="">
                                <li>
                                    <!--用时：{{(UserEvaluationInfo.usedTime / 60 || 0).toFixed(0)}}分钟{{(UserEvaluationInfo.usedTime % 60 || 0)}}秒-->
                                    用时：{{(UserEvaluationInfo.usedTime / 60 / 60 || 0).toFixed(0)}}时{{((UserEvaluationInfo.usedTime) / 60 || 0).toFixed(0)}}分钟{{(((UserEvaluationInfo.usedTime)) % 60 || 0).toFixed(0)}}秒
                                    <!--2018-07-30 17:05:42-->
                                    <!--2018-07-30 13:39:41-->
                                </li>
                                <li>成绩：<span
                                        style="font-size: 16px;color: #fd7416">{{UserEvaluationInfo.score}}</span>分
                                </li>
                            </ul>
                        </diV>
                        <div class="groupsDetailtitle">
                            <div></div>&nbsp;答题情况
                            <el-button class="right show-paper whiteButton" @click="seeTest(UserEvaluationInfo)">查看试卷
                                <i class="el-icon-arrow-right"></i></el-button>
                        </div>
                        <div class="content" style="height: auto;">
                            <p class="detial">
                                <span v-for="(item,index) in UserEvaluationInfo.answerInfoList">
                                 <span v-if="!item.isCorrecting" :class="[item.answerResult? 'defaultColor ':'defaultColorBlue']">

                                    <router-link target="_blank"
                                                 :to='{
                                             path:"/selfCenter/myNoteAdd",
                                             query:{
                                                questionId:item.questionsId, workId: $route.params.id,
                                                groupsId: $route.query.groupsId, assessmentId:assessmentId,types
                                                }
                                             }'>
                                      <span style="color: #fff">{{item.questionsSeq}}</span>
                                     </router-link>
                                </span>

                                <span class="defaultColor" v-if="item.isCorrecting"
                                      :class="[item.answerResult? 'defaultColor':'red']">
                                         <router-link target="_blank"
                                                      :to='{
                                             path:"/selfCenter/myNoteAdd",
                                             query:{
                                                questionId:item.questionsId, workId: $route.params.id,
                                                groupsId: $route.query.groupsId, assessmentId:assessmentId,types
                                                }
                                             }'>
                                          <span style="color: #fff">{{item.questionsSeq}}</span>
                                         </router-link>
                                </span>
                                </span>
                            </p>
                            <!--<p class="detial">阅读理解：<span class="green">2</span><span class="green">3</span><span-->
                            <!--class="green">11</span></p>-->
                            <!--<p class="detial">汉字笔画：<span class="red">4</span><span class="red">8</span><span-->
                            <!--class="green">9</span>-->
                            <!--</p>-->
                        </div>
                        <!--<div class="groupsDetailtitle">-->
                        <!--<div></div>&nbsp;作业评析-->
                        <!--</div>-->
                        <!--<div class="commit">-->
                        <!--<p>知识点掌握充足，做题时间略长，建议加强试题训练，提高做题速度，准确率较高</p>-->
                        <!--</div>-->
                        <div class="groupsDetailtitle">
                            <div></div>
                            &nbsp;历次作业成绩走势图
                        </div>
                        <div id="myProjectprecent" :style="{width: '800px', height: '300px',top:'-50px'}">
                            <p style="color:#fd7416 ">暂无数据</p>
                        </div>
                        <!--<p v-else  style="color: #fd7416;" >暂无数据</p>-->
                    </el-tab-pane>
                    <el-tab-pane label="班级详情" name="second">

                        <div class="groupsDetailtitle">
                            <div></div>&nbsp;班级成绩排名
                        </div>
                        <p class="tit" style="text-align: left">
                            <el-col :span="8">
                                <span>群组名称：{{classDetail.groupsName}}</span>
                            </el-col>
                            <el-col :span="4">
                                <span>群组人数：{{classDetail.groupTotalNum}}    </span>
                            </el-col>
                            <el-col :span="4">
                                <span>老师：{{classDetail.teacherName}}  </span>
                            </el-col>
                            <el-col :span="4">
                                <span>班级最高分：{{classDetail.maxScore}}  </span>
                            </el-col>
                            <el-col :span="4">
                                <span>班级平均分：{{classDetail.avgScore}} </span>
                            </el-col>
                        </p>
                        <br/>
                        <div id="myTable" ref="myTable">
                            <el-table
                                    :data="classDetail.studentList"
                                    border
                                    style="width: 100%;">
                                <el-table-column
                                        prop="name"
                                        label="姓名"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="score"
                                        label="成绩"
                                        align="center">
                                </el-table-column>
                                <el-table-column
                                        prop="rank"
                                        label="排名"
                                        align="center"
                                        show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{scope.row.rank || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="usedTime"
                                        width="100"
                                        label="用时"
                                        align="center"
                                        show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{(scope.row.usedTime / 60 || 0).toFixed(0)}}分钟{{(scope.row.usedTime % 60 || 0)}}秒
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="correctRate"
                                        label="正确率"
                                        align="center"
                                        show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                        prop="falseNum"
                                        label="错题数"
                                        align="center"
                                        show-overflow-tooltip>
                                </el-table-column>
                            </el-table>

                        </div>
                        <div class="groupsDetailtitle" style="float: left;width: 424px">
                            <div></div>&nbsp;成绩分布情况
                        </div>
                        <div class="groupsDetailtitle" style="float: left">
                            <div></div>&nbsp;用时分布情况
                        </div>
                        <div style="height: 250px">
                            <div id="circle-grade" style="width: 424px;height: 160px;float:left;">
                                <p style="color:#fd7416 ">暂无数据</p>
                            </div>
                            <div id="circle-time" style="width: 424px;height: 160px;float: left;">
                                <p style="color:#fd7416 ">暂无数据</p>
                            </div>
                        </div>
                        <div class="groupsDetailtitle" style="margin-top: 0">
                            <div></div>&nbsp;班级平均分走势图
                        </div>
                        <div style="height: 217px">
                            <!--<div class="growthArchives-root-timeborder">-->
                            <!--<button class="seeHistory" :class="{focus:selectbefore==1}" @click="selectbefore1(1)">-->
                            <!--<span v-if="selectbefore==1"><</span> 近一周-->
                            <!--</button>-->
                            <!--<button class="seeHistory" :class="{focus:selectbefore==2}" @click="selectbefore1(2)">-->
                            <!--<span v-if="selectbefore==2"><</span> 近一月-->
                            <!--</button>-->
                            <!--<button class="seeHistory" :class="{focus:selectbefore==3}" @click="selectbefore1(3)">-->
                            <!--<span v-if="selectbefore==3"><</span> 近三月-->
                            <!--</button>-->
                            <!--</div>-->
                            <div id="passGrade" :style="{width: '800px', height: '300px',top:'-45px'}">
                                <p style="color:#fd7416 ">暂无数据</p>
                            </div>

                        </div>
                    </el-tab-pane>
                </el-tabs>

            </div>
            <!--查看试卷-->
        </div>
        <Modal
                :mask-closable="false"
                width="810"
                v-model="showModal"
                title="查看试卷"
                class-name="vertical-center-modal"
                :loading="loading">
            <modal-header slot="header" :content="showId"></modal-header>
            <show-detail v-if="showModal" :types="types" :params="params" :typeId="typeId"></show-detail>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
  import coProgress from '../../../components/common/progress.vue'
  import showDetail from '../../../components/common/questionsPaper_show.vue'
  import echarts from 'echarts'
  import api from './api'

  export default {
    data () {
      return {
        activeName: 'first',
        LastTableData: [],
        selectbefore: 1,
        id: 'showId',
        title: '',
        showId: {
          id: 'showId',
          title: '查看试卷',
        },
        loading: false,
        showModal: false,
        tableDate: [],
        classDetail: {},
        myEvaluationInfoMessage: {},
        UserEvaluationInfo: {},
        assessmentId: null,
        params: {},
        typeId: 1, // 占位使用
        types: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getDetail()//获取试卷详情
        //this.getClass()//班级详情
        this.getUserEvaluationInfo()//获取个人详情（试卷)
      })

      // this.passGrade()
    },
    created () {
      this.init()
    },

    methods: {
      seeTest (item) {
        this.showModal = true
      },
      init () {
        this.typeId = this.$route.params.id
        if (this.$route.params.type != 'homework') {
          this.params = {papersId: this.$route.params.id}
          this.assessmentId = this.$route.params.id
          this.types = 4
        } else {
          this.params = {workId: this.$route.params.id, groupsId: this.$route.query.groupsId}
          this.assessmentId = 1
          this.types = 5
        }
        // this.getDetail()//获取试卷详情
        //this.getClass()//班级详情
        //this.getUserEvaluationInfo()//获取个人详情（试卷)

      },
      getDetail (isLoadingFun) {//获取试卷详情
        if (!isLoadingFun) isLoadingFun = function () {
        }
        isLoadingFun(true)
        this.ajax({
          ajaxSuccess: (res) => {
            this.myEvaluationInfoMessage = res.data
            if (this.$route.params.type == 'homework') {
              let {teacherName: operatorName, startTime: releaseTime, submitTime: endTime, title: name} = res.data
              let arr = {operatorName, releaseTime, endTime, name}
              Object.keys(arr).map(key => this.myEvaluationInfoMessage[key] = arr[key])
            }

          },
          ajaxParams: {
            // baseURL:'PUBLIC',
            url: this.$route.params.type != 'homework' ? api.getMyEvaluationInfo.path : api.getMyWorkInfo.path,
            method: this.$route.params.type != 'homework' ? api.getMyEvaluationInfo.method : api.getMyWorkInfo.method,
            params: this.params,
          },
        }, isLoadingFun)
      },
      getUserEvaluationInfo (isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {
        }
        isLoadingFun(true)
        this.ajax({//获取个人详情（试卷)/zuoye
          ajaxSuccess: (res) => {
            this.UserEvaluationInfo = res.data
            this.drawProjectPer()
              // console.log(329,this.UserEvaluationInfo)
          },
          ajaxParams: {
            // baseURL:'PUBLIC',
            url: this.$route.params.type != 'homework' ? api.getUserEvaluationInfo.path : api.getUserWorkInfo.path,
            method: this.$route.params.type != 'homework' ? api.getUserEvaluationInfo.method : api.getUserWorkInfo.method,
            params: this.params
          },
        }, isLoadingFun)
      },
      getClass (isLoadingFun) {//班级详情
        this.ajax({
          ajaxSuccess: (res) => {
            this.classDetail = res.data
            this.drawCircle()
            this.drawCircleTime()
            this.passGrade()
          },
          ajaxParams: {
            // baseURL:'PUBLIC',
            url: this.$route.params.type != 'homework' ? api.getGroupsInfo.path : api.getWorkGroupsInfo.path,
            method: this.$route.params.type != 'homework' ? api.getGroupsInfo.method : api.getWorkGroupsInfo.method,
            params: this.params,
          },
        }, isLoadingFun)
      },
      handleClick (tab, event) {
        if (this.activeName == 'first') {
          this.getUserEvaluationInfo()
        } else {
          this.getClass()//班级详情
        }
      },
      drawProjectPer () {

        let myProjectprecent = echarts.init(document.getElementById('myProjectprecent'))

        if (this.UserEvaluationInfo.historyScore) {
          let times = []
          let score = []
          this.UserEvaluationInfo.historyScore.map((item) => {
            times.push(this.conductDate(item.examTime, 'yyyy-MM-dd HH:ss'))
            score.push(item.score)
          })

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
              data: times,
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value} ',
              },
            },
            series: [
              {
                name: '分数',
                type: 'line',
                data: score,

                markLine: {
                  data: [],
                },
              },
            ],
          })
        }
      }
      ,
      drawCircle () {
        if (this.classDetail.pieChartScore) {
          let val = [
            {value: this.classDetail.pieChartScore.score_90_100, name: '91分-100分'},
            {value: this.classDetail.pieChartScore.score_80_90, name: '81分-90分'},
            {value: this.classDetail.pieChartScore.score_70_80, name: '71分-80分'},
            {value: this.classDetail.pieChartScore.score_60_70, name: '61分-70分'},
            {value: this.classDetail.pieChartScore.score_0_60, name: '60分以下'},
          ]
          let circleGrade = echarts.init(document.getElementById('circle-grade'))
          circleGrade.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ['91分-100分', '81分-90分', '71分-80分', '61分-70分', '60分以下'],
            },
            series: [
              {
                name: '人数',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '10',
                      fontWeight: 'bold',
                    },
                  },
                },
                labelLine: {
                  normal: {
                    show: false,
                  },
                },
                data: val,
              },
            ],
          })
        }
      }
      ,
      drawCircleTime () {
        if (this.classDetail.avgScoreList) {
          let val = [
            {value: this.classDetail.pieChartTime.time_50, name: '50分钟以上'},
            {value: this.classDetail.pieChartTime.time_30_50, name: '30到50分钟'},
            {value: this.classDetail.pieChartTime.time_0_30, name: '0到30分钟'},
          ]
          let circleGrade = echarts.init(document.getElementById('circle-time'))

          circleGrade.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ['0到30分钟', '30到50分钟', '50分钟以上'],
            },
            series: [
              {
                name: '人数',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '10',
                      fontWeight: 'bold',
                    },
                  },
                },
                labelLine: {
                  normal: {
                    show: false,
                  },
                },
                data: val,
              },
            ],
          })
        }
      }
      ,
      passGrade () {
        //myProjectprecent-numofquestion
        if (this.classDetail.avgScoreList) {
          let score = [], dataList = []
          this.classDetail.avgScoreList.map((item) => {
            score.push(item.score)
            dataList.push(this.conductDate(item.examTime, 'yyyy-MM-dd HH:ss'))
          })
          this.conductDate(this.classDetail.avgScoreList, 'yyyy-MM-dd HH:ss')
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
              data: dataList,
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value} ',
              },
            },
            series: [
              {
                name: '分数',
                type: 'line',
                data: score,

                markLine: {
                  data: [],
                },
              },
            ],
          })
        }
      }
      ,
      selectbefore1 (num) {
        this.selectbefore = num
      }
      ,

    }
    ,
    components: {
      coProgress,
      showDetail,
    }
    ,
  }
</script>
<style lang="scss">
    @import "../css/homeworkAlreadydid.scss";
</style>
