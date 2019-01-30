<!--
****--@file     addFriend.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  申请好友成功
-->

<template>
  <div class="addFriendroot" style="text-align: center">
    <div v-if="sure">
      <p>申请添加[<span>{{people}}</span>]为好友，添加成功后</p>
      <p>在好友动态里，更能注意到Ta的动向</p>
      <button @click="clicksure">确认添加</button>
    </div>
    <div v-if="!sure">
      <p>好友申请已发送！等待对方同意。</p>
      <button @click="complete" style="margin-bottom: 20px">完成</button>
    </div>
  </div>

</template>
<script>
    import api from './api'
    export default {
        props: ['people', 'peopleID'],
        data () {
            return {
                sure: true,
            }
        },
        methods: {
            complete () {
                this.$emit('addcomplete')
            },
            clicksure() {
                this.ajax({
                    ajaxSuccess: this.getListimgsuccess,
                    error: () => {
                        this.sure = false
                    },
                    ajaxParams: {

                        url: api.addFriend.path,
                        method: api.addFriend.method,
                        data: {
                            friendId: this.peopleID,
                        },
                    },
                })
            },
            getListimgsuccess() {
                this.sure = false
            }
        },
        created() {
        }

    }
</script>
<style lang="scss">
  .addFriendroot {
    text-align: center;
    p {
      line-height: 30px;
      span {
        font-size: 16px;
        color: red;
        padding: 0 5px;
      }
    }
    button {
      width: 80px;
      height: 30px;
      border-radius: 3px;
      background-color: #11a63f;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
      border: none;
      margin-top: 10px;
    }
  }
</style>