<!--
****--@file     selectBook.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  选择书籍
-->
<template>
  <div class="selectBook-root">
    <ul @click="srcPush(item)" v-for="(item,index) in list">
      <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
      <div class="selectBook">{{item.name}}</div>
      </el-tooltip>
    </ul>
    <div style="clear: both"></div>
  </div>
</template>
<script>
    export default {
        props: ['subject'],
        data () {
            return {
                list: '',
            }

        },
        created() {

            this.list = this.$store.state.app.envs.textBookVersionList

        },
        methods: {
            srcPush(i) {
                this.$emit('imgSrc', i, this.subject)

            },
        },
    }


</script>
<style lang="scss">
  .selectBook-root {

    .selectBook {
      min-width: 100px;
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 30px;
      text-align: center;
      display: inline-block;
      border: 1px solid #ccc;
      margin: 10px;
      border-radius: 4px;
      img {
        width: 68px;
        height: 68px;
      }
    }
    .selectBook:hover {
      border: 1px solid #1cc03b;
    }
    text-align: center;
    ul {
      display: inline-block;
      text-align: center;
      max-width: 280px;
      line-height: 30px;
      border-radius: 4px;

      margin-right: 10px;

    }
  }


</style>