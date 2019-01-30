<!--
****--@file     paperList
****--@date     2018/1/11 下午4:16
****--@author   jhd
****--@describe   商品包含的试卷
-->
<template>
    <div class="paper-list-wrap">
        <ul>
            <li v-for="(item,index) in paperList">
                <div class="tip-wrap">
                    <p>卷号：{{item.no}}<span>总分：{{item.paperScore}} 分</span></p>
                    <p>题数：{{item.questionNums}}<span>已完成数量：{{item.answerNums == null ? 0 : item.answerNums}}</span></p>
                </div>
                <div class="">
                    <el-button v-if="item.seq" type="success">继续答题 ></el-button>
                    <el-button v-else type="success">开始答题 ></el-button>
                </div>
                <!--<div class="btn-wrap" style="padding:25px 30px 26px 30px">-->
                <!--进度：{{percentage[index]}}%-->
                <!--<el-progress style="width: 100px" :text-inside="true" :stroke-width="18"-->
                <!--:percentage="percentage[index]" status="success"></el-progress>-->
                <!--</div>-->
            </li>
        </ul>
        <div class="pagination">
            <div style="text-align: center">
                <el-pagination
                        @size-change="changePageSize"
                        @current-change="changePage"
                        :current-page.sync="myPages.currentPage"
                        :page-size="myPages.pageSize"
                        layout="prev, pager, next, jumper"
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

    export default {
        props: ['productId'],
        data() {
            return {
                totalCount: false,
                paperList: []
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.myPages = Util.pageInitPrams
                this.queryQptions = {
                    url: '/product/queryPaperList',
                    params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize, productId: this.productId}
                }
                this.setTableData()
            },
            /*
            * 设置表格数据
            * @param isLoading Boolean 是否加载
            */
            setTableData(isLoading) {
                this.ajax({
                    ajaxSuccess: 'listDataSuccess',
                    ajaxParams: this.queryQptions
                }, isLoading)
            },
            listDataSuccess(res) {
                this.paperList = res.data.dataList;
                this.totalCount = res.data.totalCount
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
    .paper-list-wrap {
        .tip-wrap {
            display: inline-block;
            font-size: 14px;
            span {
                margin-left: 50px;
            }
            .name {
                font-size: 14px;
                font-weight: 500;
                line-height: 30px;
            }
            .price {
                line-height: 22px;
            }
        }
        .btn-wrap {
            border-left: 1px solid #e5e5e5;
            float: right;
            padding: 28px;
        }
    }
</style>
