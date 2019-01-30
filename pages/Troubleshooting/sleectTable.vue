<!--
****--@file     sleectTable
****--@date     2018/1/12 23:59
****--@author   wh
****--@describe   未答列表
-->

<template>
    <div class="selectLeftTable">

        <subject :showItems="showItems" @change="change" style="padding: 30px 30px"></subject>
        <div class="say">
            <router-link to="/selfCenter/makeQuestion">
                <button class="orangeYellow">我要提问</button>
            </router-link>
            <p class="paixu" style="float: right;height: 40px;line-height: 40px;color: #434343">
                <span>排序：</span>
                <span @click="setType('')" :class="formValidate.viewType==''?'active':''"
                      style="margin-right: 20px">默认 </span>
                <span @click="setType('view')" :class="formValidate.viewType=='view'?'active':''"
                      style="margin-right: 10px">浏览量<i class="iconfont icon-shangsheng"
                                                       :class="formValidate.viewType=='view'?'active':''"></i></span>
                <span @click="setType('reply')" :class="formValidate.viewType=='reply'?'active':''">回复数<i
                        class="iconfont icon-shangsheng"
                        :class="formValidate.viewType=='replyNum'?'active':''"></i></span>
            </p>
        </div>
        <div>
            <div id="myTable1">
                <el-table
                        @row-click="seeDatail"
                        :data="LastTableData"
                        border
                        style="width: 100%">
                    <el-table-column

                            prop="grade"
                            label="年级科目"
                            align="center">
                        <template slot-scope="scope">
                            {{ scope.row.grade | grade(self)}}{{ scope.row.subject | subject}}
                        </template>
                    </el-table-column>
                    <!--<el-table-column-->
                    <!--prop="subject"-->
                    <!--label="科目"-->
                    <!--align="center">-->
                    <!--<template slot-scope="scope">-->
                    <!--{{ scope.row.subject | subject}}-->
                    <!--</template>-->
                    <!--</el-table-column>-->


                    <el-table-column
                            prop="title"
                            label="问题"
                            show-overflow-tooltip
                            align="center" width="200" style="overflow: hidden;"></el-table-column>


                    <el-table-column
                            prop="createTime"
                            label="时间"
                            align="center" width="150">
                        <template slot-scope="scope">
                            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="questionerName"
                            label="提问人"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="viewNum"
                            label="浏览量"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            prop="replyNum"
                            label="回复数"
                            align="center">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="100"
                            align="center">
                        <template slot-scope="scope">
                            <!--<router-link :to="{path:'/selfCenter/makeAnswer',query:{id:scope.row.id}}">-->
                            <el-button @click="Myanswer($event,scope.row)" class="whiteButton">我来解答</el-button>
                            <!--</router-link>-->
                        </template>
                    </el-table-column>
                </el-table>

            </div>
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
            <div style="clear: both"></div>

        </div>
    </div>
</template>
<script>
  /*当前组件必要引入*/

  let Util = null
  import subject from '../../components/common/subject.vue'
  import api from './api'

  export default {
    data () {
      return {
        self: this,
        showItems: ['subject', 'grade', 'sort'],
        input: '',
        selectRank: 1,
        LastTableData: [],
        totalCount: 10,
        formValidate: {
          grade: '',
          subject: '',
          sort: '',
          by: '',
          isAdopt: 0,
          title: '',
          viewType: '',
        },
        great: 0
      }
    },
    created () {
      Util = this.$util
      this.myPages = Util.pageInitPrams
      this.queryQptions = {
        url: api.searchContent.path,
        params: {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
        },
      }
      this.setTableData()
    },
    methods: {
      setType (type) {
        this.formValidate.viewType = type
        this.setTableData()
      },
      seeDatail (row, event, column) {
        this.$router.push({path: '/searchDetail', query: {id: row.id}})
      },
      change (i) {
        this.formValidate.grade = i.grade
        this.formValidate.sort = i.sort
        if (i.sort == 'VIEW_NUM') {
          this.great = 1
        } else {
          this.great = 0
        }
        this.formValidate.subject = i.subject
        this.setTableData()
      },
      Myanswer (e, o) {//我来解答
        e.stopPropagation()
        let temp = {}
        if (this.$store.state.user.info) {
          if (o.questionerId == this.$store.state.user.info.id) {
            temp = {path: '/searchDetail', query: {id: o.id}}
//            this.$router.push({path: '/searchDetail', query: {id: o.id}})
            window.open(routeData.href, '_blank')
          } else {
            temp = {path: '/selfCenter/makeAnswer', query: {id: o.id}}
//            this.$router.push({path: '/selfCenter/makeAnswer', query: {id: o.id}})
          }
          let routeData = this.$router.resolve(temp)
          window.open(routeData.href, '_blank')
        } else {
          this.$message.error('请登录...')
          this.$router.push({name: 'login'})
        }

      },

      changeRank (num) {
        this.selectRank = num
        if (num == 1) {
          this.formValidate.sort = ''

        } else if (num == 2) {
          this.formValidate.sort = 'CREATE_TIME'
        } else if (num == 3) {
          this.formValidate.sort = 'VIEW_NUM'
        } else if (num == 4) {
          this.formValidate.sort = 'REPLY_NUM'
        }
        this.setTableData()
      },
      setTableData (isLoading) {
        this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate)
        this.ajax({
          ajaxSuccess: this.listDataSuccess,
          ajaxParams: this.queryQptions,
        }, isLoading)
      },
      listDataSuccess (res) {

        this.LastTableData = res.data.dataList
        //this.LastTableData=[];
        this.totalCount = res.data.totalCount
        if (this.formValidate.sort == 'VIEW_NUM' && this.great == 1) {
          this.LastTableData = []
          this.totalCount = 0
          for (var i = 0; i < res.data.dataList.length; i++) {
            if (res.data.dataList[i].viewNum >= 1000) {
              this.LastTableData.dataList.push(res.data.dataList[i])
              this.totalCount++
            }
          }
        }
      },
    },
    components: {

      subject,
    },
  }
</script>
<style lang="scss">
    .selectLeftTable {
        .paixu {
            padding-right: 20px;
            span {
                color: #434343;
                line-height: 40px;
                font-size: 14px;
            }
            .active {
                color: #fd7416;
            }
        }
        .icon-shangsheng {
            color: #9a9a9a;
            font-size: 20px;
            line-height: 40px;
            position: relative;
            top: 2px;
        }
    }
</style>
