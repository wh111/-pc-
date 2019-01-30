<!--
****--@file     hasComplete
****--@date     2018/3/29 16:08
****--@author   ${王恒}
****--@describe   已完成作业
-->
<template>
    <div class="myHomework">
        <div class="selfMyhomework" style="margin-top: 0">
            <div v-if="totalCount==0" style="text-align: center">
                <img style="margin-top: 100px" src="../../../../assets/images/err.png"/>
            </div>
            <div v-else class="myContentBox">
                <div class="selfWork" v-for="item in dataList" :key="item.id">
                    <p>布置者：{{item.teacherName}}&nbsp &nbsp&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp&nbsp&nbsp
                        来源：{{item.groupsName}}
                        <span>
                            布置时间：{{item.startTime | formatDate('yyyy-MM-dd HH:mm')}} &nbsp&nbsp&nbsp&nbsp&nbsp
                            上交时间：{{item.submitTime | formatDate('yyyy-MM-dd HH:mm') }}
                        </span>
                    </p>
                    <div class="selfWorkname">
                        <ul>
                            <li class="title">
                                <div class="ulleft">作业名称：{{item.title}}</div>
                            <li class="sec">完成状态：<span class="alreadyComplate">已完成</span> <span
                                    class="complete-number"> ({{item.finishedNums}}人已完成) </span></li>
                        </ul>

                        <div class="selfready">
                            <router-link
                                    :to='{name:"homeworkRes",params:{id:item.id,type:"homework"},query:{groupsId:item.groupsId}}'>
                                <el-button class="orangeYellow">查看详情 ></el-button>
                            </router-link>
                        </div>
                        <div class="selfWorkprocess">
                            <co-progress background="#fd7416" type="circle" :width="60"
                                         :percentage="item.correctRate || 0"></co-progress>
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
  let Util = null
  import api from '../api'
  import coProgress from '../../../../components/common/progress.vue'

  export default {
    data () {
      return {
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
          // console.log(res)
      },

    },
    created () {
      Util = this.$util
      this.myPages = Util.pageInitPrams
      this.queryQptions = {
        url: api.queryWork.path,
        params: {
          isFinished: '1',
          nowTime: new Date().getTime(),
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
        },
      }
      this.init()
    },
    mounted () {
    },
    components: {coProgress}
  }

</script>
<style lang="scss">
    @import "../../css/selfHomework.scss";
</style>
