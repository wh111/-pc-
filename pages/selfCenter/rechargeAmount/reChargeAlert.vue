<!--
****--@file     rechangeAlert.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe   充值成功
-->
<template>
  <div class="rechangeAlert-root">
    <span>您已经充值成功</span><br/>
    <button class="button" @click="Iknow">我知道了</button>
  </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
        methods: {
            Iknow () {
                this.$emit('IknowAlready')
            },
        },

    }


</script>
<style lang="scss">
  .rechangeAlert-root {
    width: 328px;
    height: 175px;
    text-align: center;
      /*font-family: MicrosoftYaHei;*/
    font-size: 26px;
    padding-top: 14px;
    .button {
      margin-top: 40px;
      width: 300px;
      height: 40px;
      border-radius: 2px;
      background-color: #fd7416;
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      line-height: 40px;
      border: none;
    }
  }

</style>
