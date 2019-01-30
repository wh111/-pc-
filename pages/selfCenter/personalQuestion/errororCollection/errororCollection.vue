<!--
****--@file     errororCollection
****--@date     2017/12/12 下午4:43
****--@author   jhd
****--@describe   错题 与反馈
-->
<template>
    <div class="pspec-content">
        <el-tabs type="card" @tab-click="handleClick">
            <el-tab-pane label="我的错题" class="wdct">
                <questions-wrong v-if="index == 0 "></questions-wrong>
            </el-tab-pane>
            <el-tab-pane label="我的收藏">
                <questions-favorite v-if="index == 1 "></questions-favorite>
            </el-tab-pane>

        </el-tabs>

    </div>
</template>
<script>
	/*当前组件必要引入*/
	import api from '../api'
    import questionsFavorite from './questionsFavorite-list.vue'
    import questionsWrong from './questionsWrong-list.vue'
	let Util = null
	export default {
		data (){
			return {
                loading: false,
                removeModal: false,
                questionModal: false,
                questionsId: null,
                types: null,
                showId: {
                    id: 'showId',
                    title: '练习此题'
                },
                removeId: {
                    id: 'removeId',
                    title: "删除"
                },
                title: '',
                postOption: {},
				index:0,
				totalCount:2,
                formValidate: {
                    subject: ''
                },
				showItems:[ 'subject' ],
				activeName:'second',
				loadBtn:{ title:'添加笔记 >' },
				loadBtn1:{ title:'练习此题 >' },
                questionLsit: [],
                knowledgeList: []
			}
		},
		methods:{
			//初始化请求列表数据
			init (){
				Util = this.$util

			},
			handleClick ( val ){
                this.index = val.index;
                this.knowledgeList = [];
			},
//			//判断当前是错题还是收藏
//			handleIndex (){
//				if ( this.index == 0 ){
//					this.queryQptions.url = api.myWrongList.path
//				}else{
//					this.queryQptions.url = api.myFavoriteList.path
//				}
//                this.setTableData()
//			},

            //科目改变方法
			subjectChange ( item ){
                this.formValidate.subject = item.subject
				this.handleIndex()
			},
            //操作弹窗执行成功回调函数
            closeDialog() {
                this.removeModal = false;
                this.setTableData()
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
		created (){
			this.init()
		},
		mounted (){
		},
		components:{
            questionsFavorite,
            questionsWrong
		},
	}

</script>
<style lang="scss">
    .pspec-content {
        min-height: 615px;
        .question-item-title {
            span {
                font-size: 12px;
            }
        }
        .el-tabs__nav-scroll {
            padding-left: 20px;
        }
        .isNull {
            min-height: 500px;
        }
        .question-wrap {
            .question-item-content {
                height: auto;
                .answer {
                    padding: 10px 10px 0 10px;
                    height: 80px;
                    width: 670px;
                    color: #434343;
                    font-size: 16px;
                    line-height: 30px;
                    border-right: 1px solid #e5e5e5;
                    display: inline-block;
                }
            }
            .btn-wrap {
                /*button {*/
                /*margin-top: 50px;*/
                /*}*/
            }
        }
        .personal-question .question-wrap {
            margin-left: 0px;
        }
        .el-tabs--border-card > .el-tabs__content {
            padding: 15px 0;
        }
        padding: 20px 30px;
        .el-tabs--border-card {
            border: none;
            box-shadow: none;
            border-top: 1px solid #d8dce5;
        }
        .el-tabs--border-card > .el-tabs__header {
            border-left: 1px solid #d8dce5;
        }
    }
</style>