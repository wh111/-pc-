<!--
****--@file     mytestHasComplete
****--@date     2018/3/29 17:33
****--@author   ${王恒}
****--@describe   我的测评已完成
-->
<template>
    <div class="mytestHasComplete">
        <!--<div class="selfWork" v-for="item in dataList" :key="item.id">-->
        <!--<p>布置者:{{item.operatorName}}&nbsp &nbsp&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp&nbsp&nbsp 来源：班级群<span>布置时间：{{item.releaseTime|formatDate('yyyy-MM-dd HH:dd')}} &nbsp&nbsp&nbsp&nbsp&nbsp  上交时间：{{item.endTime|formatDate('yyyy-MM-dd HH:dd')}}</span>-->
        <!--</p>-->
        <!--<div class="selfWorkname">-->
        <!--<ul>-->
        <!--<li class="title">-->
        <!--<div class="ulleft">测评名称：{{item.name}}</div>-->
        <!--</li>-->
        <!--<li class="sec">共{{item.questionsNums}}小题，{{item.submitNum}}人已提交</li>-->
        <!--</ul>-->
        <!--<div class="selfready" v-if="item.endTime>=new Date()">-->
        <!--<router-link target="_blank" to="/choiceEvaluation">-->
        <!--<button class="b-button">开始测评 ></button>-->
        <!--</router-link>-->

        <!--</div>-->
        <!--<div class="selfready" v-if="item.endTime<new Date()">-->
        <!--<button class="b-button" style=" background-color: #c9c9c9;">已截止</button>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="selfMyhomework">
            <p v-if="totalCount==0" style="text-align: center">
                <img style="margin-top: 100px" src="../../../../assets/images/err.png"/>
            </p>
            <div class="myContentBox" v-else>
                <div class="selfWork" v-for="item in dataList" :key="item.id">
                    <p>
                        布置者：{{item.operatorName}}&nbsp &nbsp&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp&nbsp&nbsp
                        来源：{{item.groupsName}}
                        <span>
                            布置时间：{{item.publishAnswerTime | formatDate('yyyy-MM-dd HH:mm')}} &nbsp&nbsp&nbsp&nbsp&nbsp
                            上交时间：{{item.endTime | formatDate('yyyy-MM-dd HH:mm')}}
                        </span>
                    </p>
                    <div class="selfWorkname">
                        <ul>
                            <li class="title">
                                <div class="ulleft">测评名称：{{item.name}}</div>
                            <li class="sec">完成状态：<span class="alreadyComplate">已提交</span> <span
                                    class="complete-number"> ({{item.submitNum}}人已提交) </span></li>
                        </ul>

                        <template v-if="item.publishAnswerTime < now">
                            <div class="selfready">
                                <router-link
                                             :to="{name: 'homeworkRes',params:{type:'test',id:item.id}}">
                                    <el-button class="orangeYellow" style="color: #fff">
                                        查看详情 >
                                    </el-button>
                                </router-link>
                            </div>
                            <div class="selfWorkprocess">
                                <co-progress background="#fd7416" type="circle" :width="60"
                                             :percentage="item.correctRate || 0"></co-progress>
                            </div>
                        </template>
                        <div v-else class="selfready">
                            <el-button style="background-color: #fff;border: solid 1px #cccccc;color: #434343">
                                等待公布
                            </el-button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <div class="pagination" v-if="totalCount">
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
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api'
  import coProgress from '../../../../components/common/progress.vue'

  let Util = null

  export default {
    data () {
      return {
        now: new Date().getTime(),
        totalCount: 0,
        dataList: []
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.setTableData()
      },
      setTableData (isLoading) {
        let opt = {
          ajaxSuccess: res => {
            this.dataList = res.data.dataList
            this.totalCount = res.data.totalCount
          },
          ajaxParams: this.queryQptions
        }
        if (!isLoading) {
          isLoading = () => {
          }
        }
        isLoading(true)
        this.ajax(opt, isLoading)
      },
    },
    created () {
      Util = this.$util
      this.myPages = Util.pageInitPrams
      this.queryQptions = {
        url: api.myList.path,
        params: {
          answerStatus: '1',
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
          name: ''
        },
      }
      this.init()
    },
    mounted () {
    },
    components: {
      coProgress
    }
  }
</script>
<style lang="scss">
    @import "../../css/selfHomework.scss";
</style>
