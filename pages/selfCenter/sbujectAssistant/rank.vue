<!--
****--@file     rank.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  刷题大赛排名
-->

<template>
    <div class="rank-root">
        <template v-if="totalCount !== null">
            <template v-if="totalCount">
                <div class="champion">
                    <img class="numImg" src="../../../assets/images/rankone.png"/>
                    <user-head-img class="rankUserImg" :wh="30" :src="getStaticPath(top[0].icon)"
                                   _src="/sasstudent/img/defaulthead.png"/>
                    <ul>
                        <li>
                            <div class="name">{{ top[0].name }}</div>
                            <div class="grade">{{ top[0].grade | grade(self) }}</div>
                        </li>
                        <li><span class="school">{{ top[0].school }}</span></li>
                        <li>答对<span class="num">{{ top[0].answerTrueNum }}</span>道题目</li>
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="champion second" v-if="totalCount > 1">
                    <img class="img-two numImg" src="../../../assets/images/rankthree.png"/>
                    <user-head-img class="rankUserImg" :wh="30" :src="getStaticPath(top[1].icon)"
                                   _src="/sasstudent/img/defaulthead.png"/>
                    <ul>
                        <li>
                            <div class="name">{{ top[1].name }}</div>
                            <div class="grade">{{ top[1].grade | grade(self) }}</div>
                        </li>
                        <li><span class="school">{{ top[1].school }}</span></li>
                        <li>答对<span class="num">{{ top[1].answerTrueNum }}</span>道题目</li>
                    </ul>
                </div>
                <div class="champion three" v-if="totalCount > 2">
                    <img class="img-two numImg" src="../../../assets/images/ranktwo.png"/>
                    <user-head-img class="rankUserImg" :wh="30" :src="getStaticPath(top[2].icon)"
                                   _src="/sasstudent/img/defaulthead.png"/>
                    <ul>
                        <li>
                            <div class="name">{{ top[2].name }}</div>
                            <div class="grade">{{ top[2].grade | grade(self) }}</div>
                        </li>
                        <li><span class="school">{{ top[2].school }}</span></li>
                        <li>答对<span class="num">{{ top[2].answerTrueNum }}</span>道题目</li>
                    </ul>
                </div>
                <div class="clearfix"></div>
                <template v-if="totalCount > 3">
                    <table style="margin-top: 40px" class="el-table">
                        <tr v-for="(item,index) in tableRank" :key="index" class="el-table__row">
                            <td class="noborder">
                                <div class="cell">NO.{{item.ranking}}</div>
                            </td>
                            <td class="is-center">
                                <div class="cell">{{item.name}}</div>
                            </td>
                            <td class="is-center">
                                <div class="cell">{{item.stage | stage}}{{ item.grade | grade(self) }}</div>
                            </td>
                            <td class="is-center">
                                <div class="cell">{{item.school}}</div>
                            </td>
                            <td class="is-center">
                                <div class="cell">{{item.answerTrueNum}}道</div>
                            </td>
                        </tr>
                    </table>
                    <div class="pagination" style="width: 920px" v-if="totalCount>10">
                        <div style="text-align: center">
                            <el-pagination @size-change="changePageSize" @current-change="changePage"
                                           :current-page.sync="myPages.currentPage" :page-size="myPages.pageSize"
                                           layout="total,prev, pager, next, jumper" :total="totalCount">
                            </el-pagination>
                        </div>
                    </div>
                </template>
            </template>
            <p v-else class="noDataTip">
                居然还没有榜单，去 <b type="text" @click="brushQuestion">刷题</b> 打榜吧！
            </p>
        </template>
        <p v-else-if="!seasonId" class="noDataTip">
            暂无数据
        </p>
        <p v-else class="noDataTip">
            <span class="el-icon-loading"></span>
            加载中...
        </p>
    </div>

</template>
<script>
    import api from './api';
    import userHeadImg from '../../../components/common/userHeadImg'

    let Util;
    export default {
        props: ['seasonId'],
        data() {
            return {
                self: this,
                totalCount: null,
                top: [],
                tableRank: [],
            }
        },
        methods: {
            init() {
                Util = this.$util;
                Util.pageInitPrams.pageSize = 12;
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.rank.path,
                    params: {
                        curPage: 1,
                        pageSize: Util.pageInitPrams.pageSize,
                        seasonId: this.seasonId || ''
                    },
                };
                this.setTableData();
            },
            setTableData() {
                this.ajax({
                    ajaxSuccess: this.listDataSuccess,
                    ajaxParams: this.queryQptions,
                });
            },
            listDataSuccess(res) {
                let list = [];
                if(this.queryQptions.params.curPage === 1) {
                    this.top = res.data.dataList.slice(0, 3);
                    list = res.data.dataList.slice(3);
                } else {
                    list = res.data.dataList;
                }
                this.tableRank = list;
                this.totalCount = res.data.totalCount;
            },
            brushQuestion() {
                this.$emit('changeView')
            },
        },
        created() {
            this.init();
        },
        components: {
            userHeadImg
        }
    }
</script>
<style lang="scss">
    .rank-root {
        .rankUserImg {
            float: left;
            margin-left: 5px;
        }
        .noDataTip {
            text-align: center;
            line-height: 200px;
            b {
                cursor: pointer
            }
        }
        .champion {
            margin-top: 37px;
            margin-left: 321px;
            .numImg {
                float: left;
                margin-left: 5px;
            }
            ul {
                float: left;
                text-align: left;
                margin-left: 5px;
                .name {
                    font-size: 16px;
                    font-weight: bold;
                    float: left;
                    line-height: 20px;
                }
                .grade {
                    width: 78px;
                    height: 20px;
                    border-radius: 10px;
                    border: solid 1px #b5b5b5;
                    text-align: center;
                    font-size: 12px;
                    line-height: 20px;
                    text-align: center;
                    color: #b5b5b5;
                    float: left;
                    margin-left: 8px;
                }
                .school {
                    font-size: 12px;
                    line-height: 20px;
                    color: #b5b5b5;
                }
                .num {
                    color: #ef3f3f;
                    padding: 0 5px;
                }

            }
        }
        .second {
            margin-left: 115px;
        }
        .three {
            padding-left: 217px;
            margin-top: 80px;
        }
        th {
            padding-top: 28px;
            width: 920px;
            padding-left: 30px;
            font-size: 12px;
            tr:nth-child(2n) {
                background: #efefef;

            }
            tr {
                td {
                    line-height: 38px;
                    height: 38px;
                    width: 222px;
                    border: solid 1px #e5e5e5;
                    margin-left: -1px;

                }
            }
        }
    }
</style>