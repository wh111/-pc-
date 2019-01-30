<!--
****--@file     bHistoryList
****--@date     2018/1/4 上午11:05
****--@author   jhd
****--@describe   学币 充值记录
-->
<template>
    <div style="margin: 0 30px;">
        <div class="groupsSelect " style="width: 890px">
            <div class="groupsLeft" style="width: 415px" :class="{active:selectTab == 'true'}"
                 @click="changeHistory('true')">充值记录
            </div>
            <div class="groupsRight" style="width: 415px" :class="{active:selectTab == 'false'}"
                 @click="changeHistory('false')">消费记录
            </div>
        </div>
        <div class="myTable-bList" id="myTable" ref="myTable">
            <el-table sortable="custom" align="center" border :height="400"
                      :data="bHistoryList" tooltip-effect="dark" style="width: 100%" v-show="selectTab == 'true'">
                <el-table-column prop="numbers" label="充值学币数量" align="center">
                    <template slot-scope="scope">
                        {{scope.row.numbers }}学币
                    </template>
                </el-table-column>
                <el-table-column prop="times" label="充值时间" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{scope.row.times | formatDate('yyyy-MM-dd HH:mm')}}
                    </template>
                </el-table-column>
                <el-table-column prop="totalNumbers" label="剩余学币数量" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{scope.row.totalNumbers }}学币
                    </template>
                </el-table-column>
            </el-table>
            <el-table sortable="custom" align="center" border :height="400"
                      :data="bHistoryList" tooltip-effect="dark" style="width: 100%" v-show="selectTab == 'false'">
                <el-table-column prop="numbers" label="消费学币数量" align="center">
                    <template slot-scope="scope">
                        {{scope.row.numbers}}学币
                    </template>
                </el-table-column>
                <el-table-column prop="times" label="消费时间" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{scope.row.times | formatDate('yyyy-MM-dd HH:mm')}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="描述" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column prop="totalNumbers" label="剩余学币数量" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{scope.row.totalNumbers}}学币
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <router-link
                                :to="{path:'/selfCenter/selfAnsweringQuestionShow',query:{id:scope.row.busId}}">
                            <el-button type="success" class="whiteButton">查看</el-button>
                        </router-link>
                    </template>
                </el-table-column>
                <!--<el-table-column label="操作" align="center" width="100">-->
                <!--<template slot-scope="scope">-->
                <!--<el-button size="small" type="success">查看</el-button>-->
                <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
        </div>
        <div class="pagination" style="margin-top: 0px;height: 50px">
            <div style="text-align: center">
                <el-pagination
                        @size-change="changePageSizeB"
                        @current-change="changePageB"
                        :current-page.sync="myPagesB.currentPage"
                        :page-size="myPagesB.pageSize"
                        layout="total,prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null;
    import api from '../api'

    export default {
        props: ['selectTabChange'],
        data() {
            return {
                selectTab: 'true',
                bHistoryList: [],
                totalCount: 5
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.myPagesB = Util.pageInitPrams
                this.queryQptionsB = {
                    url: api.bHistoryList.path,
                    params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
                }
                this.setTableDataB()
            },
            /*
            * 设置表格数据
            * @param isLoading Boolean 是否加载
            */
            setTableDataB(isLoading) {
                Object.assign(this.queryQptionsB.params, {types: this.selectTab});
                this.ajax({
                    ajaxSuccess: 'listDataSuccessB',
                    ajaxParams: this.queryQptionsB
                }, isLoading)
            },
            listDataSuccessB(res) {
                this.bHistoryList = res.data.dataList;
                this.totalCount = res.data.totalCount
            },
            changeHistory(types) {
                this.selectTab = types
                this.setTableDataB()
            },
            changePageSizeB(n) {
                console.log(n)
                let pageSize = this.queryQptionsB.params && (this.queryQptionsB.params.pageSize = n) || (this.queryQptionsB.pageSize = n);
                pageSize = n;
                this.setTableDataB()
            },
            changePageB(n) {
                this.queryQptionsB.params.curPage = n;
                this.setTableDataB()
            }
            
        },
        watch: {
            selectTabChange(val) {
                this.init()
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
    .myTable-bList {
        padding: 10px;
        .el-button {
            padding: 4px 15px;
        }
    }
</style>
