<!--
****--@file     myNote
****--@date     2017/12/13 上午11:25
****--@author   jhd
****--@describe   我的笔记
-->
<template>
    <div class="my-note">
        <template v-if="questionLsit instanceof Array">
            <ul class="question-wrap">
                <subject :showItems="showItems" @change="subjectChange"></subject>
                <div class="isNull" v-if="questionLsit.length == 0">
                    <img src="../../../../assets/images/isnull.png" alt="">
                </div>
                <li v-else class="item" v-for="(item,index) in questionLsit" :key="index">
                    <p class="question-item-title">
                        <span style="margin-left: 10px;">编号:{{item.no}}</span>
                        <span style="margin:0 20px ;">|</span>
                        <span>知识点:{{knowledgeList[index] }}</span>
                        <span class="time">{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                    </p>
                    <div class="question-item-content">
                        <div class="answer">
                            <p>{{item.title | delHtmlTag | sliceText(50,'...')}}</p>
                            <!--<p>{{item.content}}</p>-->
                            <!--<p v-for="(answer,index) in item.answers" :key="index">-->
                            <!--{{answer.options}}.{{answer.content}}</p>-->
                        </div>

                        <div class="btn-wrap" style="border-left: none;">
                            <router-link
                                    :to='{path:"/selfCenter/myNoteShow",query:{questionId:item.id,types:item.types}}'>
                                <el-button class="yellowButton"
                                           style="color: #ffffff;border: none;width: 110px;height: 40px">查看笔记 >
                                </el-button>
                            </router-link>
                            <el-button class="whiteButton"
                                       style="margin-left: 5px;width: 50px;height: 40px;text-align: center;padding: 0"
                                       size="small"
                                       @click="remove(item.id)">删除
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
        <Modal :mask-closable="false" width="800" v-model="removeModal" class-name="vertical-center-modal"
               :loading="loading">
            <modal-header slot="header" :content="removeId"></modal-header>
            <todo-comfirm @close="closeDialog" @confirm="confirmDialog" :title="title"
                          :postOption="postOption"></todo-comfirm>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
	/*当前组件必要引入*/
	let Util = null
	import api from '../api'
	import subject from '../../../../components/common/subject.vue'
	export default {
		data (){
			return {
                loading: false,
                removeModal: false,
                removeId: {
                    id: 'removeId',
                    title: "删除"
                },
                formValidate: {
                    subject: '',
                },
                title: '',
                postOption: {},
				showItems:[ 'subject' ],
				totalCount:2,
                knowledgeList: [],
                questionLsit: null,
			}
		},
		methods:{
			//初始化请求列表数据
			init (){
				Util = this.$util
				this.myPages = Util.pageInitPrams;
				this.queryQptions = {
					url:api.myNotesList.path,
					params:{ curPage:1,pageSize:Util.pageInitPrams.pageSize }
				}
                this.setTableData()
			},
			/*
            * 设置表格数据
            * @param isLoading Boolean 是否加载
            */
            setTableData(isLoading) {
                this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate);
				this.ajax( {
					ajaxSuccess:'listDataSuccess',
					ajaxParams:this.queryQptions
				},isLoading )
			},
			//获取列表ajax成功回调函数
			listDataSuccess ( res ){
                let that = this;
                this.questionLsit = res.data.dataList;
                this.totalCount = res.data.totalCount;
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
            //删除弹窗方法
            remove(id) {
                this.title = '确定删除该笔记吗？';
                this.postOption = {
                    data: {questionsId: id},
                    api: api.questionsNotesRemove,
                    msg: '删除'
                }
                this.removeModal = true;
			},
			subjectChange ( item ){
                this.formValidate.subject = item.subject;
                this.setTableData()
			},
			
		},
		created (){
			this.init();
		},
		mounted (){
		},
		components:{
			subject
		}
	}

</script>
<style lang="scss">
    .my-note {
        min-height: 615px;
        .question-item-title {
            span {
                font-size: 12px;
            }
        }
        .question-wrap {
            min-height: 505px;
            margin-top: 20px;
            .isNull {
                min-height: 505px !important;
            }
            .question-item-content {
                height: auto;
            }
            .btn-wrap {
                /*padding: 30px !important;*/
                button {
                    /*margin-top: 50px;*/
                }
            }
        }
        .answer {
            padding: 10px 10px 0 10px;
            height: 80px !important;
            width: 658px;
            color: #434343;
            font-size: 14px;
            line-height: 30px;
            border-right: 1px solid #e5e5e5;
            display: inline-block;
        }
    }
</style>