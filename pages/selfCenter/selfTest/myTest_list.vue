<!--
****--@file     myTest_list
****--@date     2017/12/13 下午4:17
****--@author   jhd
****--@describe   我的测试
-->
<template>
    <div class="myTest-list">
        <p class="title">
            <span class="span">我的测评记录</span>
            <router-link to="/adaptiveEvaluation">
                <el-button class="right go-test">我要测评 <i class="el-icon-arrow-right"></i></el-button>
            </router-link>
        </p>
        <div id="myTable" ref="myTable">
            <el-table
                    :height="800"
                    :data="tableData"
                    border
                    style="width: 100%;line-height: 35px">
                <el-table-column
                        prop="index"
                        label="序号"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="subject"
                        label="科目"
                        align="center">
                    <template slot-scope="scope">{{scope.row.subject | subject}}</template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="试卷名称"
                        align="center"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="评测日期"
                        align="center">
                    <template slot-scope="scope">{{scope.row.createTime | formatDate('yyyy-MM-dd HH:ss')}}</template>
                </el-table-column>
                <el-table-column
                        prop="totalScore"
                        label="成绩"
                        align="center">
                    <template slot-scope="scope">
                        {{scope.row.totalScore ? (scope.row.totalScore / 100) : scope.row.totalScore }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="langTime"
                        label="用时"
                        align="center">
                    <template slot-scope="scope">
                        {{(scope.row.updateTime - scope.row.createTime) / 1000 | formatFen }}分钟
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center">
                    <template slot-scope="scope">
                        <router-link
                                :to="`/selfCenter/selfTestResult/3/${scope.row.id}`">
                            <button class="showButton">查看</button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
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
	import api from './api'

	let Util = null
	export default {
		data() {
			return {
				totalCount: 0,
				tableData: [],
				getAssessmentList: {
					ajaxSuccess: 'getAssessmentSuccess',
					ajaxParams: {
						url: api.assessmentList.path,
						params: {}
					}
				}
			}
		},
		methods: {
			//初始化请求列表数据
			init() {
				Util = this.$util;
				this.myPages = this.queryQptions = {
					curPage: 1,
					pageSize: Util.pageInitPrams.pageSize,
				}
				this.setTableData();
			},
			setTableData() {
				this.getAssessmentList.ajaxParams.params = this.myPages;
				this.ajax(this.getAssessmentList);
			},
			//获取我的测评记录成功回调
			getAssessmentSuccess(res) {
				let data = res.data;
				if (!data) return;
				this.tableData = this.addIndex(data.dataList);
				this.totalCount = data.totalCount;


			},

		},
		created() {
			this.init();

		},
		mounted() {
		},
		components: {}
	}

</script>
<style lang="scss">
    .showButton:hover {
        background: #eee !important;
        color: #a0a0a0 !important;
        border: 1px solid #ccc;
    }

    .showButton {
        width: 44px;
        height: 28px;
        line-height: 28px;
        background: #fff;
        color: #898989;
        border-radius: 3px;
        border: 1px solid #ccc;
    }
    .myTest-list {
        width: 950px;
        border-radius: 5px;
        background-color: #ffffff;
        .title {
            height: 78px;
            line-height: 73px;
            .span {
                font-size: 24px;
                margin-left: 30px;
                line-height: 110px;
                text-align: left;
                color: #313131;
            }
            .go-test {
                background: #fd7416;
                color: #ffffff;
                border-radius: 20px;
                border: none;
                margin: 38px 30px 0 0;
                width: 90px;
            }
            .go-test:hover {
                background: #ec641c;
            }
        }
        #myTable {
            padding: 0 30px;
            .el-table thead {
                tr {
                    background-color: #e6f9ec;
                    color: #11a63f;
                    text-align: center;
                }
            }
        }
        .pagination {
            margin: 20px 0;
        }
    }
</style>