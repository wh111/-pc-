<!--
****--@file     questionsFavorite-list
****--@date     2018/1/19 下午4:49
****--@author   jhd
****--@describe   我的收藏
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
                    <p class="question-item-title">
                        <span style="margin-left: 10px;">编号:{{item.no}}</span>
                        <span style="margin:0 20px ;">|</span>
                        <span>知识点:{{knowledgeList[index] }}</span>
                        <span class="time">{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                    </p>
                    <div class="question-item-content">
                        <div class="answer" style="width: 658px">
                            <p>{{item.title | delHtmlTag(true) | sliceText(50, '...')}}</p>
                            <!--<p>{{item.content}}</p>-->
                            <!--<p v-for="(answer,index) in item.answers" :key="index">-->
                            <!--{{answer.options}}.{{answer.content}}</p>-->
                        </div>

                        <div class="btn-wrap" style="border-left: none;">
                            <el-button type="success" class="orangeYellow"
                                       style="height: 40px;font-size: 14px;width: 110px"
                                       @click="show(item)">
                                练习此题 >
                            </el-button>
                            <el-button style="margin-left: 5px;width: 50px;height: 40px;text-align: center;padding: 0"
                                       class="whiteButton" size="small"
                                       @click="removeFavorite(item.id)">删除
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
        <!--练习此题-->
        <Modal
                :mask-closable="false"
                width="1000"
                v-model="questionModal"
                title="练习此题"
                class-name="vertical-center-modal"
                :loading="loading">
            <modal-header slot="header" :content="showId"></modal-header>
            <show v-if="questionModal" @cancel="cancel" :questionsId="questionsId" :types="types"></show>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null;
    import subject from '../../../../components/common/subject.vue'
    import show from './errororCollection_show.vue'
    import api from '../api'

    export default {
        data() {
            return {
                loading: false,
                formValidate: {
                    subject: ''
                },
                questionModal: false,
                showId: {
                    id: 'showId',
                    title: '练习此题'
                },
                showItems: ['subject'],
                removeModal: false,
                removeId: {
                    id: 'removeId',
                    title: "删除"
                },
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
                    url: api.myFavoriteList.path,
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
                        ;
                    }
                    ;
                    that.knowledgeList.push(strArr.join())
                })
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
            cancel() {
                this.questionModal = false;
            },
            //科目改变方法
            subjectChange(item) {
                this.formValidate.subject = item.subject
                this.setTableData()
            },
            /**
             * 练习此题
             * ***/
            show(val) {
                console.log(val)
                this.questionsId = val.id;
                this.types = val.types;
                this.questionModal = true;
            },
            //删除收藏
            removeFavorite(id) {
                this.title = '确定删除该收藏吗？';
                this.postOption = {
                    data: {questionsId: id},
                    api: api.questionsFavoriteRemove,
                    msg: '删除'
                }
                this.removeModal = true;
            }
            
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            subject,
            show
        }
    }

</script>
<style lang="scss">
    .errMsg {
        line-height: 470px;
        text-align: center;
    }
</style>
