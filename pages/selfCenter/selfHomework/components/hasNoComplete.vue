<!--
****--@file     hasNoComplete
****--@date     2018/3/29 16:08
****--@author   ${王恒}
****--@describe   未完成作业
-->
<template>
    <div class="myHomework">
        <div class="selfMyhomework">
            <div v-if="totalCount==0" style="text-align: center">
                <img style="margin-top: 100px" src="../../../../assets/images/err.png"/>
            </div>
            <div v-else class="myContentBox">
                <div class="selfWork" v-for="(item,index) in dataList" :key="item.id">
                    <p>布置者：{{item.teacherName}}&nbsp &nbsp&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp&nbsp&nbsp
                        来源：{{item.groupsName}}
                        <span>
                            布置时间：{{item.startTime | formatDate('yyyy-MM-dd HH:mm')}} &nbsp&nbsp&nbsp&nbsp&nbsp
                            上交时间：{{item.submitTime | formatDate('yyyy-MM-dd HH:mm')}}
                        </span>
                    </p>
                    <div class="selfWorkname">
                        <ul>
                            <li class="title">
                                <div class="ulleft">作业名称：{{item.title}}</div>
                                <span v-if="item.isNew=='0'&&item.submitTime > now">新作业</span></li>
                            <li class="sec">共{{item.totalQuestions}}小题。<span
                                    v-if="item.submitNum == 0">作业还无人解答，争做第一名</span><span
                                    v-else>{{item.finishedNums}}人已提交</span></li>
                        </ul>
                        <div class="selfready">
                            <router-link v-if="item.submitTime > now"
                                         :to="{name:'questions',params:{type:'homework',papersId:item.id},query:{groupsId:item.groupsId}}">
                                <button class="orangeYellow" @click="$store.state.app.serveAnswer={}"> 开始答题 ></button>
                            </router-link>
                            <button v-else :disabled="true"> 已截止</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div style="clear: both"></div>
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
  let Util = null
  import api from '../api'

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
        this.ajax({
          ajaxSuccess: this.listDataSuccess,
          ajaxParams: this.queryQptions,
        }, isLoading)
      },
      listDataSuccess (res) {
        this.dataList = res.data.dataList
        this.totalCount = res.data.totalCount
      },

    },
    created () {
      Util = this.$util
      this.myPages = Util.pageInitPrams
      this.queryQptions = {
        url: api.queryWork.path,
        params: {
          isFinished: '0',
          nowTime: new Date().getTime(),
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
        },
      }
      this.init()
    },
    mounted () {
    },
    components: {}
  }

</script>
<style lang="scss">
    @import "../../css/selfHomework.scss";
</style>
