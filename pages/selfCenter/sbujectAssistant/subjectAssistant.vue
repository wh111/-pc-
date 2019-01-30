<!--
****--@file     subjectAssistant.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  学科助手入口
-->

<template>
  <div>
    <div class="subjectAssistant-root">
      <h1>学科助手</h1>
      <img src="../../../assets/images/insertpic.png"/>
        <!--<img src="../../../assets/images/insertpic.png" style="width: 100px;height: 100px"/>-->
      <div class="into">
        <div class="introduce">
          这里是竞赛中心，汇聚了一大批学渣、学霸、学圣，想要和他们一决高下吗？报名参加竞赛中心，与全国的小朋友们一起进行刷题大赛，看看谁答对的题目更多，谁的学习能力更强呢
        </div>
          <router-link to="/selfCenter/competionCenter">
          <button>点击进入</button>
        </router-link>

      </div>
    </div>

  </div>
</template>
<script>
    export default {
        data () {
            return {}
        },
    }

</script>
<style lang="scss">
  .subjectAssistant-root {
    min-height: 720px;
    width: 950px;
    border-radius: 5px;
    background-color: #ffffff;
    padding: 30px;
    button {
      cursor: pointer;
    }

    h1 {
      font-size: 26px;
    }
    .introduce {
      width: 481px;
      height: 60px;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0px;
      text-align: left;
      color: #333333;
    }
    button {
      width: 110px;
      height: 40px;
      background-color: #11a63f;
        /*font-family: DFWaWaSC-W5;*/
      font-size: 20px;
      letter-spacing: -0.3px;
      text-align: left;
      color: #ffffff;
      text-align: center;
      line-height: 40px;
      border: none;
      border-top-left-radius: 10px;
      border-bottom-right-radius: 10px
    }
    .into {
      width: 481px;
      float: right;

      margin-top: -10px;
      margin-top: -65px;
      button {
        float: right;
        margin-top: 10px;
      }
    }
    .p {
      font-size: 14px;
      line-height: 30px;
      div {
        width: 8px;
        background: #1cc03b;

        overflow: hidden;
        height: 8px;
        border-radius: 100%;
        float: left;
        margin-top: 11px;
      }
      .name {
        font-weight: bold;

        padding: 0 10px;
      }
      .time {
        color: #1cc03b;
        padding-right: 5px;
      }

    }
  }

  .subjectAssistant-root-top {
    height: 256px;
    min-height: 256px;
  }

  .subjectAssistant-root-bottom {
    height: 400px;
    min-height: 400px;
    margin-top: 20px;
  }

</style>
