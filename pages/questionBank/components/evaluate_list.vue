<!--
****--@file     evaluate_list
****--@date     2017/12/21 上午11:34
****--@author   jhd
****--@describe   评价列表
-->
<template>
    <div class="evaluate-list">
        <div class="progress-wrap clearfix">
            <div class="left progress-left">
                <p>好评率<br/>
                    <span class="tip">{{commentStatistics.positive}}%</span>
                </p>
            </div>
            <div class="left progress-right">
                <div class="clearfix">
                    <span class="left span">好评</span>
                    <co-progress class="left" style="width: 260px;" background="#ef3f3f"
                                 :percentage="commentStatistics.positive"></co-progress>
                </div>
                <div class="clearfix">
                    <span class="left span">中评</span>
                    <co-progress class="left" style="width: 260px;" background="#ef3f3f"
                                 :percentage="commentStatistics.moderate"></co-progress>
                </div>
                <div class="clearfix">
                    <span class="left span">差评</span>
                    <co-progress class="left" style="width: 260px;" background="#ef3f3f"
                                 :percentage="commentStatistics.negative"></co-progress>
                </div>
            </div>
        </div>
        <ul class="evaluate-ul-type">
            <li :class="formValidate.result == ''?'active':''" @click="GetType('')">
                全部评价
            </li>
            <li :class="formValidate.result == 'positive'?'active':''" @click="GetType('positive')">
                好评({{commentStatistics.positive}}%)
            </li>
            <li :class="formValidate.result == 'moderate'?'active':''" @click="GetType('moderate')">
                中评({{commentStatistics.moderate}}%)
            </li>
            <li :class="formValidate.result == 'negative'?'active':''" @click="GetType('negative')">
                差评({{commentStatistics.negative}}%)
            </li>
        </ul>
        <ul class="evaluate-ul-list">
            <li class="evaluate-ul-li clearfix" v-for="(item,index) in commentList" :key="index">
                <div class="img-head left">
                    <img class="head-img" :src="getStaticPath(item.userIcon)"
                         onerror="javascript:this.src='/sasstudent/img/man.png'" height="40" alt="">
                </div>
                <div class="center-msg left">
                    <p>{{item.userName}}</p>
                    <p>{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</p>
                    <el-rate
                            v-model="item.score"
                            disabled
                            text-color="#ff9900">
                    </el-rate>
                </div>
                <div class="info left">
                    <p>{{item.comment}}</p>
                </div>
            </li>
        </ul>
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
    import coProgress from '../../../components/common/progress.vue'
    import api from '../api'

    let Util = null
    export default {
        props: ['productId'],
        data() {
            return {
                types: '',
                value: 3,
                totalCount: 10,
                commentStatistics: {},
                commentList: [],
                formValidate: {
                    productId: this.productId,
                    result: ''
                }
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.ajax({
                    ajaxSuccess: res => this.commentStatistics = res.data,
                    ajaxParams: {
                        url: api.commentStatistics.path + '?productId=' + this.productId,
                        method: api.commentStatistics.method
                    }
                })
                this.myPages = {
                    currentPage: Util.pageInitPrams.currentPage,
                    pageSize: 10
                };
                this.queryQptions = {
                    url: api.commentList.path,
                    method: api.commentList.method,
                    params: this.myPages
                }
                this.setTableData()
            },
            /*
            * 设置表格数据
            * @param isLoading Boolean 是否加载
            */
            setTableData(isLoading) {
                Object.assign(this.queryQptions.params, this.formValidate);
                this.ajax({
                    ajaxSuccess: 'listDataSuccess',
                    ajaxParams: this.queryQptions
                }, isLoading)
            },
            listDataSuccess(res) {
                this.commentList = res.data.dataList;
                this.totalCount = res.data.totalCount
            },
            GetType(type) {
                console.log(type)
                this.formValidate.result = type
                this.setTableData()
            }

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            coProgress
        }
    }

</script>
<style lang="scss">
    .evaluate-list {
        .progress-wrap {
            padding: 20px;
        }
        .progress-left {
            margin-right: 80px;
            p {
                font-size: 16px;
                text-align: left;
                color: #313131;
                .tip {
                    font-size: 30px;
                    text-align: left;
                    color: #ef3f3f;
                }
            }
        }
        .progress-right {
            width: 310px;
            .span {
                margin-right: 10px;
                font-size: 14px;
            }
        }
        .evaluate-ul-type {
            width: 890px;
            height: 30px;
            background: #efefef;
            li {
                font-size: 14px;
                float: left;
                line-height: 30px;
                padding: 0 25px;
                color: #727272;
                cursor: pointer;
            }
            .active {
                color: #ef3f3f;
            }
        }
        .evaluate-ul-list {
            min-height: 615px;
        }
        .evaluate-ul-li {
            padding: 20px 0;
            border-bottom: 1px solid #f5f5f5;
            .head-img {
                border-radius: 50%;
            }
            .center-msg {
                width: 100px;
                margin: 0 20px 0 10px;
                p {
                    font-size: 12px;
                    text-align: left;
                    color: #727272;
                }
                .el-rate__icon {
                    font-size: 12px;
                }
            }
            .info {
                width: 700px;
                font-size: 14px;
                line-height: 1.86;
                letter-spacing: 0.1px;
                text-align: left;
                color: #434343;
            }
        }
    }

</style>
