<!--
****--@file     mytestNotComplate
****--@date     2018/3/29 17:32
****--@author   ${王恒}
****--@describe   我的测评
-->
<template>
    <div class="mytestNotComplate">
        <div class="selfMyhomework">
            <div v-if="totalCount==0" style="text-align: center">
                <img style="margin-top: 100px" src="../../../../assets/images/err.png"/>
            </div>
            <div v-else class="myContentBox">
                <div class="selfWork" v-for="item in dataList" :key="item.id">
                    <p>
                        布置者：{{item.operatorName}}&nbsp &nbsp&nbsp&nbsp&nbsp | &nbsp&nbsp&nbsp&nbsp&nbsp
                        来源：{{item.groupsName}}
                        <span>
                            布置时间：{{item.releaseTime | formatDate('yyyy-MM-dd HH:mm')}} &nbsp&nbsp&nbsp&nbsp&nbsp
                            上交时间：{{item.endTime | formatDate('yyyy-MM-dd HH:mm')}}
                        </span>
                    </p>
                    <div class="selfWorkname">
                        <ul>
                            <li class="title">
                                <div class="ulleft">测评名称：{{item.name}}</div>
                                <span v-if="item.isNew=='0'&&item.endTime > now">新测评</span>
                            </li>
                            <li class="sec">共{{item.questionsNums}}小题，{{item.submitNum}}人已提交</li>
                        </ul>
                        <div class="selfready">
                            <router-link v-if="item.endTime > now"
                                         :to="{name:'questions',params:{type:'test',papersId:item.id}}">
                                <button class="b-button orangeYellow">开始测评 ></button>
                            </router-link>
                            <button v-else class="b-button" :disabled="true">已截止</button>
                        </div>
                        <!--<div class="selfready" v-if="item.endTime<new Date()">-->
                        <!--<button class="b-button" style=" background-color: #c9c9c9;">已截止</button>-->
                        <!--</div>-->
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
        url: api.myList.path,
        params: {
          answerStatus: '0',
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
