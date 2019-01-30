<!--
****--@file     competionCenter.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  刷题大赛题目
-->

<template>
    <div class="competionCenter-root">
        <h1 v-if="center">
            <b style="margin-left: 107px;font-weight: inherit">刷题大赛 </b>
            <span @click="rank" class="rank-1">排行榜</span>
            <img class="rank-1" src="../../../assets/images/rank.png"/>
        </h1>
        <h1 v-if="!center">刷题排行榜
            <!--<img src="../../../assets/images/rank.png"/>-->
        </h1>
        <div id="myTable" class="historyOfrecharge" ref="myTable">
            <el-table :data="LastTableData" border style="width: 100%;">
                <el-table-column prop="ranking" label="本赛季排名" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.ranking === null ? '-' : scope.row.ranking }}
                    </template>
                </el-table-column>
                <el-table-column prop="maxRanking" label="赛季最高排名" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.maxRanking === null ? '-' : scope.row.maxRanking }}
                    </template>
                </el-table-column>
                <el-table-column prop="totalNum" label="赛季累积答题数" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="tatolIntegral" label="赛季累积获得积分" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="trueNum" label="赛季累计答对题数" align="center" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="falseNum" label="赛季累计答错题数" align="center" show-overflow-tooltip>
                </el-table-column>
            </el-table>

            <template v-if="center">
                <template v-if="totalCount">
                    <div class="cardlist">
                        <div class="card" v-for="item in detailList">
                            <router-link style="color: #fff;"
                                         :to="{path:`/brushQuestion/${seasonId}/${item.id}`}">
                                <div class="tit" style="clear: both">
                                    <div class="left">{{item.grade | grade(self)}}</div>
                                    <div class="right">{{item.subject | subject}}</div>
                                    <div style="clear:both;"></div>
                                    <p class="p" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                        {{item.name}}（{{item.total}}道题）
                                    </p>
                                    <img src="../../../assets/images/smallPic.png" style="padding-bottom: 20px"/>
                                    <!--<div style="clear: both"></div>-->
                                </div>
                            </router-link>
                            <b>
                                <router-link style="color: #434343;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 200px;display: inline-block;margin-top: -14px"
                                             :to="{path:`/brushQuestion/${seasonId}/${item.id}`}">
                                    {{item.name}}（{{item.total}}道题）
                                </router-link>
                            </b>
                            <p>结束时间 <span>{{item.endTime | formatDate('yyyy-MM-dd HH:mm:ss')}}</span></p>
                        </div>
                        <p class="clearfix"></p>
                    </div>
                    <div class="pagination" style="width: 920px">
                        <div style="text-align: center">
                            <el-pagination @size-change="changePageSize" @current-change="changePage"
                                           :current-page.sync="myPages.currentPage" :page-size="myPages.pageSize"
                                           layout="total,prev, pager, next, jumper" :total="totalCount">
                            </el-pagination>
                        </div>
                    </div>
                </template>
            </template>
            <rank v-else :seasonId="seasonId" @changeView="rank"></rank>
        </div>
    </div>
</template>
<script>
    import rank from './rank.vue'
    import api from './api'

    let Util = null
    export default {
        data() {
            return {
            	self:this,
                seasonId: '', // 赛季id
                LastTableData: [
                    // {
                    //     "seasonId": 0,
                    //     "studentId": 5,
                    //     "ranking": 2,
                    //     "maxRanking": 3,
                    //     "totalNum": 0,
                    //     "trueNum": 0,
                    //     "falseNum": 0,
                    //     "tatolIntegral": 150
                    // }
                ],
                center: true,
                detailList: [],
                totalCount: 0
            }
        },
        methods: {
            init() {
                Util = this.$util;
                Util.pageInitPrams.pageSize = 12;
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.list.path,
                    params: {
                        curPage: 1,
                        pageSize: Util.pageInitPrams.pageSize,
                    },
                };
                this.setTableData();
            },
            getMyInfo(seasonId) {
                let opt = {
                    ajaxSuccess: res => {
                        let data = [res.data];
                        this.LastTableData = data;
                    },
                    ajaxParams: {
                        url: api.getMyInfo.path,
                        params: {
                            seasonId // 赛季ID
                        }
                    }
                }
                this.ajax(opt)
            },
            access(id) {
                this.ajax({
                    ajaxSuccess: () => this.$router.push({path: '/brushQuestion', query: {id}}),
                    ajaxParams: {
                        url: api.start.path,
                        params: {
                            gamesAnswerId: id
                        },
                    },
                });
            },
            rank() {
                this.center = !this.center
            },
            setTableData(isLoading) {
                this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate);
                this.ajax({
                    ajaxSuccess: this.listDataSuccess,
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            listDataSuccess(res) {
                let data = res.data.dataList;
                this.detailList = data;
                this.totalCount = res.data.totalCount;
                if(data.length && !this.LastTableData.length) {
                    this.seasonId = data[0].seasonId;
                    this.getMyInfo(data[0].seasonId)
                }
            },
        },
        components: {
            rank,
        },
        created() {
            this.init();
        }

    }
</script>
<style lang="scss">
    .competionCenter-root {
        width: 950px;
        background: #fff;
        text-align: center;
        padding-bottom: 50px;
        min-height: 720px;
        .rank-1 {
            cursor: pointer;
        }
        h1 {
            font-size: 26px;
            line-height: 78px;
            text-align: center;
            display: block;
            img {
                float: right;
                margin-top: 30px;
                width: 21px;
                height: 16px;
            }
            span {
                float: right;
                margin-right: 35px;
                font-size: 16px;
            }
        }
        #myTable {
            padding: 10px 30px;
            .el-table thead {
                tr {
                    background-color: #e6f9ec;
                    color: #11a63f;
                    text-align: center;
                    font-weight: bold;
                }
            }
            .el-table__body-wrapper {
                overflow: hidden !important;
            }
        }
        .card {
            margin-top: 10px;
            width: 210px;
            height: 182px;
            background-color: #ffffff;
            box-shadow: 0 0 7px 0 rgba(172, 172, 172, 0.5);
            padding: 5px;
            text-align: left;
            font-size: 12px;
            float: left;
            margin-right: 16px;

            p {
                color: #ef3f3f;
            }
        }
        .cardlist {
            margin-top: 10px;
            width: 910px;
            .tit {
                width: 200px;
                min-height: 130px;
                background-color: #ffc212;
            }
            .left, .right {
                width: 43px;
                height: 25px;
                line-height: 25px;
                text-align: center;
                font-size: 12px;
                float: left;
                margin-top: 20px;
            }
            .left {
                background-color: #ffecb5;
            }
            .right {
                background-color: #ff7409;
                color: #fff;
            }
            .p {
                cursor: pointer;
                /*font-family: BDZYJT-GB1-0;*/
                font-size: 16px;
                color: #ffffff;
                padding: 4px 10px;
            }
            b {
                cursor: pointer;
            }
            img {
                float: right;
                margin-right: 10px;
            }
        }
        /*.historyOfrecharge {*/
        /*min-height: 513px;*/
        /*}*/

    }


</style>
