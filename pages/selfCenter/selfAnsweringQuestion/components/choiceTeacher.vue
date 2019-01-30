<!--
****--@file     choiceTeacher
****--@date     2017/12/18 下午2:09
****--@author   jhd
****--@describe   选择答题老师
-->
<template>
    <div class="choice-teacher">
        <p>提示：指定教师可能无法及时回答你的问题。 <span>共<b>{{totalCount}}</b>名教师</span></p>
        <el-table
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                :height="dynamicHt"
                @current-change="handleCurrentChange"
                @row-style="fn"
                style="width: 100%">
            <el-table-column
                    prop="teacherName"
                    label="教师"
                    align="center">

            </el-table-column>
            <el-table-column
                    prop="answerNum"
                    label="回答数量"
                    align="center">
                <template slot-scope="scope">
                    {{ scope.row.answerNum || 0}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="adoptNum"
                    label="采纳数量"
                    align="center">
                <template slot-scope="scope">
                    {{ scope.row.adoptNum || 0}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="unanswerNum"
                    label="待解答"
                    align="center">
                <template slot-scope="scope">

                    {{ scope.row.unanswerNum || 0}}
                </template>
            </el-table-column>
        </el-table>

        <div class="clearfix" style="margin-top: 10px">
            <div class="right">
                <el-pagination
                        small
                        @size-change="changePageSize"
                        @current-change="changePage"
                        :current-page.sync="myPages.currentPage"
                        :page-size="myPages.pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <p style="text-align: center">
            <el-button @click="confim" type="success">确定</el-button>
            <el-button @click="cancel">取消</el-button>
        </p>

    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null;
    import api from "../api"

    export default {
        data() {
            return {
                dynamicHt: 390,
                totalCount: 3,
                multipleSelection: [],
                tableData: [{
                    teacherId: 8,
                    teacherName: "张三",
                    answerNum: "1",
                    adoptNum: "1",
                    unanswerNum: "1"
                }, {
                    teacherId: 8,
                    teacherName: "张三",
                    answerNum: "1",
                    adoptNum: "1",
                    unanswerNum: "1"
                }, {
                    teacherId: 8,
                    teacherName: "张三",
                    answerNum: "1",
                    adoptNum: "1",
                    unanswerNum: "1"
                }],
                formValidate: {name: ''},
                currentRow: null,

            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
//                    baseURL: 'MANAGER',
                    url: api.selectTeacher.path,
                    params: {
                        curPage: 1,
                        pageSize: Util.pageInitPrams.pageSize,
                    },
                }
                this.setTableData();

            },
            confim() {
                this.$emit('cancel', this.currentRow)
            },
            cancel() {
                this.$emit('cancel')
            },
            setTableData(isLoading) {
                this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate);
                this.ajax({
                    ajaxSuccess: this.listDataSuccess,
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            listDataSuccess(res) {
                this.tableData = res.data.dataList;
                this.totalCount = res.data.totalCount;
            },
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            fn(e) {
                console.log(e)
            }

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
    .choice-teacher {
        .el-form {
            width: 250px;
        }
        p {
            font-size: 12px;
            color: #a0a0a0;
            line-height: 30px;
            span {
                float: right;
                b {
                    color: #fc4341;
                }

            }
        }
        .el-table__header-wrapper {
            border: 1px solid #e6ebf5;
            border-bottom: none;
        }
        .el-table__body {
            border: 1px solid #e6ebf5;
            border-bottom: none;
            border-top: none;
        }
        .right {

            margin: 0 auto;
            text-align: center;
        }
        .el-table__body-wrapper {
            overflow: hidden;
        }
        .el-table--enable-row-transition .el-table__body td {
            transition: 0s;
        }
        .el-table__body tr.current-row > td {
            background: #85ce61;
        }
    }

</style>