<!--
****--@file     questionsWrong-list
****--@date     2018/1/19 下午4:56
****--@author   jhd
****--@describe   我的错题
-->
<template>
    <div>
        <template v-if="questionLsit instanceof Array">
            <subject :showItems="showItems" @change="subjectChange"></subject>
            <div class="isNull" v-if="questionLsit.length == 0">
                <img src="../../../../assets/images/isnull.png" alt="">
            </div>
            <ul v-else style="margin-left: 0" class="question-wrap">
                <li class="item" v-for="(item,index) in questionLsit" :key="index">
                    <div class="question-item-title">
                        <span style="margin-left: 10px;">编号:{{item.no}}</span>
                        <span style="margin:0 20px ;">|</span>
                        <span>知识点:{{knowledgeList[index] }}
                            <!--<div class="inline-block"></div>-->
                        </span><br/><span class="time" style="width:100%;line-height: 39px;height:39px;display: inline-block;padding-right:20px;float: none;text-align: right;margin-right: 0;">{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                    </div>
                    <div style="clear: both"></div>
                    <div class="question-item-content">
                        <div class="answer" style="width: 658px">
                            <p>{{item.title | delHtmlTag | sliceText(50,'...')}}</p>
                            <!--<p>{{item.content}}</p>-->
                            <!--<p v-for="(answer,index) in item.answers" :key="index">-->
                            <!--{{answer.options}}.{{answer.content}}</p>-->
                        </div>

                        <div class="btn-wrap" style="border-left: none;">
                            <router-link target="_blank"
                                         :to="{path:'/selfCenter/myNoteAdd',query:{questionId:item.id,types:item.types,fromType:'questionsWrong'}}">
                                <!--<load-btn :btnData="loadBtn"></load-btn>-->
                                <el-button class="greenButton" style="height: 40px;font-size: 14px;width: 110px">
                                    添加笔记 >
                                </el-button>
                            </router-link>
                            <el-button class="whiteButton"
                                       style="margin-left: 5px;width: 50px;height: 40px;text-align: center;padding: 0"
                                       size="small"
                                       @click="removeWrong(item.id)">删除
                            </el-button>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="pagination" v-if="questionLsit.length > 0">
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
        </template>
        <template v-else>
            <p class="errMsg">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
        </template>
        <!--删除-->
        <Modal
                :mask-closable="false"
                width="600"
                v-model="removeModal"
                title="练习此题"
                class-name="vertical-center-modal"
                :loading="loading">
            <modal-header slot="header" :content="removeId"></modal-header>
            <todo-comfirm v-if="removeModal" @close="closeDialog" @confirm="confirmDialog" :title="title"
                          :postOption="postOption"></todo-comfirm>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null;
    import subject from '../../../../components/common/subject.vue'

    import api from '../api'

    export default {
        data() {
            return {
                loading: false,
                formValidate: {
                    subject: ''
                },
                removeModal: false,
                removeId: {
                    id: 'removeId',
                    title: "删除"
                },
                showItems: ['subject'],
                questionModal: false,
                questionsId: null,
                types: null,
                postOption: {},
                totalCount: 0,
                title: '',
                questionLsit: null,
                knowledgeList: []
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.myPages = Util.pageInitPrams;
                this.queryQptions = {
                    url: api.myWrongList.path,
                    params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
                }
                this.setTableData();
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
            //ajax成功回调函数
            listDataSuccess(res) {
                let that = this;
                this.totalCount = res.data.totalCount;
                this.questionLsit = res.data.dataList;
                this.questionLsit.map(item => {
                    let strArr = [];
                    if(item.knowledgeList instanceof Array) {
                        if(item.knowledgeList.length > 0) {
                            item.knowledgeList.map(child => {
                                strArr.push(child.name)
                            })
                        }
                    }
                    ;
                    that.knowledgeList.push(strArr.join())
                })
            },
            //科目改变方法
            subjectChange(item) {
                this.formValidate.subject = item.subject
                this.setTableData()
            },
            //操作弹窗执行成功回调函数
            closeDialog() {
                this.removeModal = false;
                this.setTableData()
            },
            //取消操作弹窗回调函数
            confirmDialog() {
                this.removeModal = false;
            },
            /**
             * 练习此题
             * ***/
            show(val) {
                this.questionsId = val.id;
                this.types = val.types;
                this.questionModal = true;
            },
            //取消操作弹窗回调函数
            confirmDialog() {
                this.removeModal = false;
            },
            //删除错题
            removeWrong(id) {
                this.title = '确定删除该错题吗？';
                this.postOption = {
                    data: {questionsId: id},
                    api: api.questionsWrongRemove,
                    msg: '删除'
                }
                this.removeModal = true;
            },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            subject
        }
    }

</script>
<style lang="scss">
    .errMsg {
        line-height: 470px;
        text-align: center;
    }
    .inline-block{
        display: inline-block;
        width:121px;
        height: 39px;
        /*float: right;*/
    }
</style>
