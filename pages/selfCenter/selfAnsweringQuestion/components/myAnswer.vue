<!--
****--@file     myAnswer
****--@date     2017/12/15 上午11:00
****--@author   jhd
****--@describe   我的回答
-->
<template>
    <div class="my-answer">
        <div style="margin: 30px 30px 0 30px;">
            <subject :showItems="showItems" @change="subjectChange"></subject>
        </div>
        <div style="min-height: 530px;text-align: center" v-if="mark==1">
            <img src="../../../../assets/images/err.png" style="margin-top: 100px">
        </div>
        <ul class="test-paper" v-if="detailList!=''">
            <li class="item" v-for="(item,index) in detailList" :key="index"
                style="width: 890px;margin-left: 30px;position: relative;">
                <p class="question-item-title">
                    <span class="tip">{{item.title}}</span>
                    <span class="time">{{item.time}}</span>
                </p>
                <div class="question-item-content">
                    <div class="question-item-content-title">
                        <div style="width: 650px;word-wrap:break-word;max-height: 58px;overflow: hidden">
                            {{ item.content | delHtmlTag | sliceText(160,'...') }}
                        </div>
                    </div>
                    <div class="btn-wrap">
                        <span v-if="item.isAdopt==1" style="color: #11a63f;">已采纳</span>
                        <span v-else>未采纳</span>
                    </div>
                    <div class="btn-wrap">
                        <span>{{item.grade | grade(self)}}{{item.subject | subject}}</span>
                    </div>
                </div>
                <p class="person-detail">
                    <span class="person" style="margin-right: 20px">提问人：{{item.questionerName}}</span>
                    <span class="person" v-if="item.isAdopt==1">解答人：{{item.replyUserName}}</span>
                    <router-link :to="{path:'/selfCenter/selfAnsweringQuestionShow',query:{id:item.id}}">
                        <span class="detail right" style="cursor: pointer;">查看详细<i
                                class="el-icon-arrow-right"></i></span>
                    </router-link>
                </p>
            </li>
        </ul>
        <div class="pagination" v-if="detailList!=''">
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
  let Util = null
  import subject from '../../../../components/common/subject.vue'
  import api from '../api'

  export default {
    data () {
      return {
        self: this,
        totalCount: 1,
        showItems: ['subject', 'grade', 'answerStatus'],
        loadBtn: {title: '继续练习 >'},
        questionData: {
          time: '',
          name: '',
          price: '',
          unit: '',
          status: ''
        },
        detailList: [],
        formValidate: {
          grade: '',
          subject: '',
          isAdopt: '',
          title: '',
        },
        queryQptions: {},
        mark: 0,
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.myPages = Util.pageInitPrams
        this.queryQptions = {
          url: api.myAnswer.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          },
        }
        this.setTableData()
      },
      subjectChange (data) {
        this.formValidate.grade = data.grade
        this.formValidate.isAdopt = data.answerStatus
        this.formValidate.subject = data.subject
        this.setTableData()
      },
      setTableData (isLoading) {
        this.queryQptions.params = Object.assign(this.queryQptions.params, this.formValidate)
        this.ajax({
          ajaxSuccess: this.listDataSuccess,
          ajaxParams: this.queryQptions,
        }, isLoading)
      },
      listDataSuccess (res) {
        this.detailList = res.data.dataList
        if (this.detailList.length == 0) {
          this.mark = 1
        } else {
          this.mark = 0
        }
        this.totalCount = res.data.totalCount
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      subject
    }
  }

</script>
<style lang="scss">
    .my-answer {
        .question-item-content-title p span {
            font-size: 12px !important;
        }
        .test-paper {
            min-height: 485px;
            .tip-wrap {
                p {
                    font-size: 12px;
                    line-height: 1.83;
                    text-align: left;
                    color: #434343;
                }
            }
            .btn-wrap {
                padding: 26px 30px 26px 30px;
            }
        }
        .item {
            margin-top: 30px;
            .question-item-title {
                line-height: 39px;
                background: #f5f5f5;
                padding: 0 10px;
                .tip {
                    font-size: 14px;
                    font-weight: bold;
                    text-align: left;
                    color: #434343;
                }
                .time {
                    float: right;
                    font-size: 12px;
                    text-align: left;
                    color: #a0a0a0;
                }
            }
            .person-detail {
                font-size: 12px;
                text-align: left;
                color: #434343;
                line-height: 40px;
                padding: 0 15px;
                border: 1px solid #e5e5e5;
                border-top: none;
                .detail {
                    color: #fc4341;
                }
            }
            .question-item-content {
                height: 90px;
                color: #434343;
                font-size: 12px;
                border: 1px solid #e5e5e5;
                .question-item-content-title {
                    padding: 15px 10px;
                    font-size: 12px;
                    text-align: left;
                    color: #434343;
                    display: inline-block;
                }
                .tip-wrap {
                    display: inline-block;
                    .name {
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 30px;
                    }
                    .price {
                        line-height: 22px;
                        span {
                            color: red;
                            font-size: 17px;
                        }
                    }
                }
                .btn-wrap {
                    border-left: 1px solid #e5e5e5;
                    float: right;
                    padding: 24px;
                    padding-top: 33px;
                    height: 88px;
                }
            }
        }
    }
</style>
