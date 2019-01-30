<!--
****--@file     systemMessage.vue
****--@date     2017/12/13 下午4:17
****--@author   wh
****--@describe  系统消息
-->
<template>
    <div class="systemMessage-root">
        <div class="groupsSelect">
            <div class="groupsLeft" :class="{active:selectTab==''}" @click="changeTab('')">全部消息</div>
            <div class="groupsMid" :class="{active:selectTab=='0'}" @click="changeTab('0')">未读消息</div>
            <div class="groupsLeft" :class="{active:selectTab=='1'}" @click="changeTab('1')">已读消息</div>
        </div>
        <div class="message-wrap">
            <div class="isNull" v-if="messageList.length == 0">
                <img src="../../../assets/images/err.png" alt="">
            </div>
            <div v-else class="ul" style="cursor: pointer" v-for="item in messageList" @click="see(item.id)">
                <div><img :src="item.operatorIcon||'1'" onerror="this.src='/sasstudent/img/man.png'"/></div>
                <dl style="width: 700px">
                    <dt>{{item.operator}}
                        <span>{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                        <template v-if="selectTab===''">
                            <span v-if="item.readStatus" class="readStatus active">已读</span>
                            <span v-else class="readStatus">未读</span>
                        </template>
                    </dt>
                    <dd>{{item.title}}</dd>
                    <dd>{{item.content}}</dd>
                </dl>
                <el-button class="seeSystemMessage" @click="seeSystemMessage(item)"
                           style="border: none;    background-color: #fd7416;color: #fff">查看详情
                </el-button>
            </div>
        </div>

        <div class="pagination" v-if="messageList.length > 0">
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
        <Modal @on-cancel="cancel"
               :mask-closable="false"
               width="500"
               v-model="showdetail"
               title="查看详情"
               class-name="systemMessage-detail"
               :loading="loading">
            <modal-header slot="header" :content="systemMessage"></modal-header>
            <see-detail v-if="showdetail" :id="id" :busType="busType" :operatorId="operatorId" :status="status"
                        @seeSystemEnd="seeSystemEnd"></see-detail>
        </Modal>

    </div>
</template>
<script>
  import seeDetail from './seeDetail.vue'

  let Util = null
  import api from './api'

  export default {
    data () {
      return {
        loginorregisterTrue: false,
        typeofmessage: '',
        showdetail: false,
        totalCount: 2,
        selectTab: '',
        loading: false,
        messageList: [],
        formValidate: {
          readStatus: ''
        },
        systemMessage: {
          id: 'systemMessageID',
          title: '消息详情',
        },
        id: '',
        busType: '',
        operatorId: '',
        status: ''
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        Util = this.$util
        this.myPages = Util.pageInitPrams
        this.queryQptions = {
          url: api.list.path,
          params: {curPage: 1, pageSize: 10}
        }
        this.setTableData()
      },
      see (res) {
        this.typeofmessage = res
        this.loginorregisterTrue = true

      },
      seeSystemMessage (index) {//查看信息详情
        this.id = index.id
        this.busType = index.busType
        this.operatorId = index.operatorId
        this.showdetail = true
        this.status = index.status

      },
      seeSystemEnd () {//查看结束
        this.showdetail = false
        this.setTableData()
      },
      cancel () {
        this.setTableData()
      },
      /*
      * 设置表格数据
      * @param isLoading Boolean 是否加载
      */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.formValidate)
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.data.totalCount || 0
        this.messageList = this.addIndex(res.data.dataList || [])
        for (var i = 0; i < this.messageList.length; i++) {
          this.messageList[i].operatorIcon = this.getStaticPath(this.messageList[i].operatorIcon)
        }
        if (this.messageList.length == 0) {
//					this.$router.push('error');
        }
      },
      changeTab (num) {
        this.queryQptions.params.curPage = 1
        this.myPages.currentPage = 1
        this.selectTab = num
        this.formValidate.readStatus = num
        this.queryQptions.params.curPage = 1
        this.setTableData()
      },

    },
    components: {seeDetail}
  }
</script>
<style lang="scss">
    .systemMessage-root {
        width: 950px;
        min-height: 730px;
        background: #fff;
        padding-top: 40px;

        .readStatus {
            padding: 2px 4px;
            border-radius: 4px;
            background-color: #1cc03b;
            color: #fff;
            &.active {
                background-color: #fd7416;
            }
        }

        /*.systemMessage-detail .ivu-modal-header*/
        /*border:none;*/
        /*}*/
        .seeSystemMessage {
            float: right;
            margin-top: 100px;
        }
        .groupsSelect {
            cursor: pointer;
            width: 950px;
            border-bottom: 2px solid #11a63f;
            height: 46px;
            padding-left: 30px;
            div {

                height: 44px;
                text-align: center;
                float: left;
                border-radius: 3px 3px 0 0;
                /*font-family: MicrosoftYaHei;*/
                font-size: 16px;
                line-height: 44px;
                width: 300px;
                color: #727272;

            }
            .active {
                background-color: #11a63f;
                color: #fff;
            }

        }
        .message-wrap {
            min-height: 570px;
        }
        .ul {
            width: 890px;
            overflow: hidden;
            height: 150px;
            margin: 40px 30px;
            border-bottom: 1px solid #e5e5e5;
            div {
                margin-top: 9px;
                float: left;
                width: 50px;
                height: 50px;
                border: none;
                overflow: hidden;
                border-radius: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            dl {
                margin-left: 30px;
                float: left;
                dt {
                    font-size: 12px;
                    line-height: 2;
                    color: #bfbfbf;
                    span {
                        margin-left: 10px;
                    }
                }
                dd {

                }
            }
        }
    }

    .systemMessage-detail .ivu-modal-footer, .ivu-modal-header {
        border: none;
    }

    .systemMessage-detail .ivu-modal-footer, {
        display: none;
    }


</style>
