<!--
****--@file     TroubleshootingResult
****--@date     2017/12/27 10:22
****--@author   wh
****--@describe   搜索结果
-->
<template>

    <div style="background: #efefef">
        <head-top></head-top>
        <div class="Result-root">
            <h1>{{title}}</h1>
            <span class="span">共<b>{{totalCount}}</b>条与"<b>{{title}}</b>"相关的搜索结果</span>
            <div>
                <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
                    <!--<router-link :to="{path:'/TroubleshootingResult',query:{name:input||'搜索'}}">-->
                    <el-button slot="append" icon="el-icon-search" @click="secrch"></el-button>
                </el-input>
            </div>

            <div class="result">
                <div class="groupsDetailtitle">
                    <div></div>&nbsp;答疑结果
                </div>
                <div class="detail" v-for="(item,index) in list" @click="seeDetail(item.id)" style="cursor: pointer">
                    <h2>{{list.title}}    [{{item.grade | grade(self)}}{{item.subject | subject}}]</h2>
                    <p style="width: 100%;height: 30px"><span style="font-weight: bold;float: left;">题目：</span><span
                            style="float: left" v-html="item.title"></span></p>
                    <p style="width: 100%;height: 30px"><span style="font-weight: bold;float: left;">问题内容：</span><span
                            style="float: left" v-html="item.content"></span></p>
                    <p class="p">
                        {{item.createTime | formatDate('yyyy-MM-dd HH:mm')}} <span> 回答者：{{item.teacherName}}</span>
                        {{item.replyNum}}个回答 </p>
                </div>
            </div>
            <div class="bottom">
                <div class="pagination" style="width: 920px;text-align: center;margin-bottom: 0px">
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

        </div>

        <footerr></footerr>

    </div>

</template>
<script>
    /*当前组件必要引入*/
    import headTop from '../../components/common/headTop.vue'
    import footerr from '../../components/common/footer.vue'
    import api from "./api"

    let Util = null
    export default {
        data() {
            return {
            	self:this,
                totalCount: 10,
                input: '',
                list: [{
                    id: 8,
                    grade: 8,
                    subject: 8,
                    title: "",
                    content: "",
                    files: "",
                    reason: "",
                    questionerId: "",
                    questionerName: "",
                    rewardIntegral: "",
                    rewardB: "",
                    isTeacher: "",
                    teacherId: "",
                    teacherName: "",
                    createTime: "",
                    isAdopt: "",
                    viewNum: "",
                    replyNum: "",
                    replyUserType: "",
                    replyUserId: "",
                    replyUserName: ""
                }],
                title: this.$route.query.name

            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                //console.log(this.$route.query.name)
                Util = this.$util;
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.searchContent.path,
                    params: {
                        curPage: 1,
                        pageSize: Util.pageInitPrams.pageSize,
                        grade: '',
                        subject: '',
                        sort: "",
                        by: '',
                        isAdopt: '',
                        title: this.$route.query.name,

                    },
                }
                this.setTableData();
            },
            setTableData(isLoading) {
                this.ajax({
                    ajaxSuccess: 'listDataSuccess',
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },

            listDataSuccess(res) {

                this.list = res.data.dataList;
                this.totalCount = res.data.totalCount;
            },
            secrch() {
//                this.$router.push({path:'/TroubleshootingResult',query:'name:index'})
//                document.location.reload();
                this.queryQptions = {
                    url: api.searchContent.path,
                    params: {
                        curPage: 1,
                        pageSize: Util.pageInitPrams.pageSize,
                        grade: '',
                        subject: '',
                        sort: "",
                        by: '',
                        isAdopt: '',
                        title: this.input,

                    },
                }
                this.title = this.input;
                this.setTableData();
            },
            seeDetail(i) {
                this.$router.push({path: '/searchDetail', query: {id: i}})
            }

            
        },
        created() {

            this.init();

        },
        mounted() {
        },
        components: {
            headTop,
            footerr
        }
    }

</script>
<style lang="scss">
    .Result-root {
        width: 1190px;
        background: #efefef;
        margin: 0 auto;
        h1 {
            text-align: center;
            font-size: 32px;
            line-height: 80px;
            height: 60px;

        }
        .span {
            float: left;
            font-size: 14px;
            line-height: 20px;
            margin-top: -20px;
            b {
                color: #fc4341;
            }
        }
        .result {
            min-height: 500px;
            background: #ffffff;
            border-radius: 5px;

        }

        .groupsDetailtitle {
            padding-top: 30px;
            margin-left: 30px;
            font-size: 16px;
            margin-top: 10px;
            padding-bottom: 20px;
            div {
                height: 16px;
                margin-top: 5px;
                float: left;
                width: 4px;
                border-radius: 1px;
                background-color: #11a63f;
            }
        }
        .el-input__inner {
            height: 60px;
        }
        .el-button--small {
            width: 100px;
        }
        .detail {
            padding: 30px;
            h2 {
                height: 30px;
                font-size: 16px;
                color: #006cbd;;
            }
            p {
                font-size: 14px;
                line-height: 26px;
            }
            .p {
                color: #a0a0a0;
                span {
                    padding: 0 20px;
                }
            }

        }
        .detail p span p span {
            font-size: 14px !important;
        }

    }
</style>