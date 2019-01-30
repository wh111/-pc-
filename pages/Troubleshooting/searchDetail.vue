<!--
****--@file     searchDetail
****--@date     2018/1/2 9:12
****--@author   wh
****--@describe   搜索结果详情
-->
<template>
    <div>
        <head-top></head-top>
        <div style="background: #efefef">
            <div class="searchDetail-root">
                <self-answering-question-show
                        style="width: 940px;float: left;margin-top: 20px"
                        @commond="commond"></self-answering-question-show>
                <div class="right1">
                    <router-link to="/selfCenter/makeQuestion">
                        <button class="nt"><i class="el-icon-edit-outline"></i><span>我要提问</span></button>
                    </router-link>
                    <teacher-list style="margin-top: 20px"></teacher-list>
                    <div style="clear: both">
                    </div>
                    <div class="listOfgood">
                        <h1>{{commondInfo.grade | grade(self)}}{{commondInfo.subject | subject}}精选问题</h1>
                        <ul>
                            <li style="cursor: pointer" v-for="(item,index) in LastTableData" @click="routerTo(item)"
                                :key="index">{{item.title}}
                            </li>
                        </ul>
                    </div>
                </div>
                <div style="clear: both">
                </div>
            </div>
        </div>
        <footerr></footerr>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import selfAnsweringQuestionShow from "../selfCenter/selfAnsweringQuestion/selfAnsweringQuestion_show.vue"
    import headTop from '../../../src/components/common/headTop.vue'
    import footerr from '../../../src/components/common/footer.vue'
    import teacherList from '../Troubleshooting/questionToteacher.vue'
    import api from './api'

    let Util = null
    export default {
        data() {
            return {
            	self:this,
                commondInfo: [],
                formValidate: {},
                LastTableData: []
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.searchContent.path,
                    params: {
                        curPage: 1,
                        pageSize: 10,
                    },
                }
                this.setTableData();
            },
            commond(res) {
                this.commondInfo = res;
            },
            setTableData(isLoading) {
                this.formValidate = {
                    grade: this.commondInfo.grade,
                    subject: this.commondInfo.subject,
                    sort: "VIEW_NUM",
                    by: '',
                    isAdopt: 1,
                    title: '',

                };
                this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate);
                this.ajax({
                    ajaxSuccess: this.listDataSuccess,
                    ajaxParams: this.queryQptions,
                }, isLoading)
            },
            listDataSuccess(res) {

                for(var i = 0; i < res.data.length; i++) {
                    if(res.data[i].viewNum >= 1000) {
                        this.LastTableData.push(res.data[i])

                    }
                }


            },
            routerTo(res) {
                this.$router.push({path: '/selfCenter/selfAnsweringQuestionShow', query: {id: res.id}})
            }
            
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            selfAnsweringQuestionShow,
            headTop,
            footerr,
            teacherList

        }
    }

</script>
<style lang="scss">
    .searchDetail-root {
        margin: 0 auto;
        width: 1190px;
        .right1 {
            float: right;
            width: 230px;
            padding-top: 20px;
            .nt {
                cursor: pointer;
                width: 230px;
                height: 50px;
                border-radius: 3px;
                background-color: #fd7416;
                font-size: 14px;

                color: #ffffff;
                border: none;
                i {
                    font-size: 30px;
                    line-height: 50px;
                    padding-right: 5px;
                    vertical-align: middle;

                }
                span {
                    line-height: 50px;
                }
            }
        }
        .listOfgood {
            width: 230px;
            margin-top: 20px;
            background: #fff;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            margin-bottom: 30px;
            h1 {
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                width: 230px;
                height: 40px;
                background-color: #11a63f;
                color: #fff;
                font-size: 16px;
                padding-left: 20px;
                line-height: 40px;
            }
            ul {
                padding: 20px;
                li {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 190px;
                }
            }

        }

    }
</style>