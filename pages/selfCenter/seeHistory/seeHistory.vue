<!--
****--@file     seeHistory.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  查看历史成长档案
-->

<template>
  <div class="seeHistory-root">
    <h1>
      我的成长档案
    </h1>
    <div id="myTable" ref="myTable">

      <el-table
        :data="LastTableData"
        border
        style="width: 100%;">
        <el-table-column
                type="index"
                label="序号"
                width="90"
                align="center">
        </el-table-column>
        <el-table-column
          prop="ProjectName"
          label="档案名称"
          align="center">
          <template slot-scope="scope">
            {{scope.row.year}}年{{scope.row.grade | grade(self)}}{{scope.row.term | term}}成长档案
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          align="center">
          <template slot-scope="scope">
            <router-link
                    :to="{path:'/selfCenter/growthArchives',query:{grade:scope.row.grade,term:scope.row.term,year:scope.row.year}}">
                <el-button class="whiteButton">查看</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>
    import api from './api'
    export default {
        data () {
            return {
            	self:this,
                LastTableData: [],
            }
        },
        created() {
            this.ajax({
                ajaxSuccess: this.TelNotRegisterSuccess,
                ajaxParams: {
                    //baseURL:'PUBLIC',
                    url: api.list.path,
                    method: api.list.method,
                },
            })
        },
        methods: {
            TelNotRegisterSuccess(res) {
                this.LastTableData = res.data.dataList;
            }
        }
    }

</script>
<style lang="scss">
  .seeHistory-root {
    width: 950px;
    height: 710px;
    border-radius: 5px;
    background-color: #ffffff;
    padding: 30px;
    .el-table__body-wrapper {
      overflow: hidden;
      position: relative;
    }
    h1 {
        /*font-family: MicrosoftYaHei;*/
      font-size: 24px;
      line-height: 1.25;
      text-align: left;
      color: #313131;
    }
    #myTable {
      margin-top: 14px;
      padding: 0 0px;
      .el-table thead {
        tr {
          background-color: #e6f9ec;
          color: #11a63f;
          text-align: center;
        }
      }
    }
  }

</style>
