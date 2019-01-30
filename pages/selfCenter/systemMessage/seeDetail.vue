<!--
****--@file     seeDetail
****--@date     2018/1/13 10:53
****--@author   wh
****--@describe   信息详情
-->
<template>
    <el-row class="systemSeeDetail-root">
        <el-form>
            <el-col :span="12">
                <el-form-item label="消息发送人：">{{item.operator}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="创建时间：">{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="标题：">{{item.title}}</el-form-item>
            </el-col>
            <el-col>
                <el-form-item label="内容：">{{item.content}}</el-form-item>
            </el-col>
            <el-col v-if="busType=='Add_Friend'" align="right">
                <el-button class="btn yellowOrange" :disabled="item.joinStatus" @click="sure(2)">同意并添加</el-button>
                <el-button class="btn yellowOrange" :disabled="item.joinStatus" @click="sure(3)">拒绝</el-button>
            </el-col>
        </el-form>
        <!--<dl style="width: 100%">-->
        <!--<dt style=""> 消息发送人：{{item.operator}}<span> </span>-->
        <!--</dt>-->
        <!--<dd> 标题：</dd>-->
        <!--<dd> 内容：{{item.content}}</dd>-->
        <!--<div v-if="type=='Add_Friend'" style="float: right; ">-->
        <!--<el-button class="btn" @click="sure(2)">同意并添加</el-button>-->
        <!--<el-button class="btn" @click="sure(3)">拒绝</el-button>-->
        <!--</div>-->
        <!--<div style="clear: both"></div>-->
        <!--</dl>-->

    </el-row>
</template>
<script>
  /*当前组件必要引入*/


  let Util = null
  import api from './api'

  export default {
    props: ['id', 'busType', 'operatorId', 'status'],
    data () {
      return {
        item: {}
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.ajax({
          ajaxSuccess: this.getMessageSuccess,
          ajaxParams: {
            //baseURL:'PUBLIC',
            url: api.get.path,
            method: api.get.method,
            params: {
              id: this.id,
            },
          },
        })
      },
      getMessageSuccess (res) {
        this.$store.state.user.userMsgNumber = true
        this.item = res.data
      },
      sure (index) {
        this.ajax({
          ajaxSuccess: () => this.makeSuccess(index),
          ajaxParams: {
            //baseURL:'PUBLIC',
            url: api.auditing.path,
            method: api.auditing.method,
            data: {
              status: index,
              friendId: this.operatorId,
              id: this.id,
            },
          },
        })
      },
      makeSuccess (index) {
        this.successMess(index == 2 ? '添加好友成功' : '已拒绝')
        this.$emit('seeSystemEnd')
      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {}
  }

</script>
<style lang="scss">
    .systemSeeDetail-root {
        padding: 0 20px;
        .btn {
            border: none;
            background-color: rgb(253, 116, 22);
            color: rgb(255, 255, 255);
        }
    }
</style>
