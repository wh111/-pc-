<!--
****--@file     addGroups.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  添加群组
-->

<template>
    <div class="addGroups-root">
        <div v-if="inputID==true">
            <p>添加群组</p>
            <p>请输入群号：<input type="text" v-model="number"/>
                <button class="sure" @click="addSure">确认添加</button>
            </p>
        </div>
        <div v-if="inputID==false">
            <p style="margin-top: 10px">添加申请已发送！群创建者批准后即可加入。</p>
            <button class="sure sureknow" @click="Iknow">我知道了</button>
        </div>
    </div>
</template>
<script>
  import api from './api'

  export default {
    data () {
      return {
        inputID: true,
        number: '',
      }
    },
    methods: {
      addSure () {
        this.ajax({
          ajaxSuccess: this.getGroupsSuccess,
          error: () => {
          },
          ajaxParams: {

            url: api.getByNo.path,
            method: api.getByNo.method,
            params: {
              no: this.number
            },
          },
        })

      },
      getGroupsSuccess (res) {
        //this.me
        this.ajax({
          ajaxSuccess: this.getListimgsuccess,
          error: () => {
          },
          ajaxParams: {

            url: api.join.path,
            method: api.join.method,
            data: {
              id: res.data.id,
              no: this.number
            },
          },
        })

      },
      getListimgsuccess (res) {
        this.inputID = false
      },
      Iknow () {
        this.$emit('joingroups')
      },
    },
  }

</script>
<style lang="scss">
    .addGroups-root {
        button {
            cursor: pointer;
        }
        padding-bottom: 60px;
        height: 140px;
        font-size: 14px;
        line-height: 2.86;
        text-align: center;
        input {
            width: 140px;
            height: 30px;
            border-radius: 3px;
            border: 1px solid #e5e5e5;
        }
        .sure {
            width: 80px;
            height: 30px;
            border-radius: 3px;
            background-color: #11a63f;
            color: #ffffff;
            text-align: center;
            line-height: 30px;
            border: none;
        }
        .sureknow {
            margin-top: 10px;
        }

    }

</style>
