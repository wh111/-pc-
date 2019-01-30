<!--
****--@file     selfHomework.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  我的作业
-->
<template>
    <div class="myHomework-root">
        <div class="groupsSelect">
            <div class="groupsLeft" :class="{active:view==='myHomework'}" @click="changeView('myHomework')">我的作业</div>
            <div class="groupsMid" :class="{active:view==='myTest'}" @click="changeView('myTest')">我的测评</div>
        </div>
        <div class="selfMyhomework">
            <p class="workStatus"><span :class="finish==0?'active':''" @click="finish=0">未完成</span> <span
                    :class="finish==1?'active':''" @click="finish=1">已完成</span></p>
            <!--<el-tabs v-model="finish" type="card">-->
            <!--<el-tab-pane label="未完成" name="0"></el-tab-pane>-->
            <!--<el-tab-pane label="已完成" name="1"></el-tab-pane>-->
            <!--</el-tabs>-->
        </div>
        <div style="margin-top: -20px">
            <template v-if="view==='myHomework'">
                <has-complete v-if="finish==1"></has-complete>
                <has-no-complete v-else></has-no-complete>
            </template>
            <template v-else>
                <mytest-has-complete v-if="finish==1"></mytest-has-complete>
                <mytest-not-complate v-else></mytest-not-complate>
            </template>
        </div>
    </div>
</template>
<script>
  import hasComplete from './components/hasComplete.vue'
  import hasNoComplete from './components/hasNoComplete.vue'
  import mytestHasComplete from './components/mytestHasComplete.vue'
  import mytestNotComplate from './components/mytestNotComplate.vue'

  let Util = null
  export default {
    data () {
      return {
        view: 'myHomework',
        finish: '0'
      }
    },
    methods: {
      init () {
        // 路由控制视图
        let {view, finish} = this.$route.query
        if (['myHomework', 'myTest'].includes(view)) {
          this.view = view
        }
        if ([0, 1].includes(finish)) {
          this.finish = finish.toString()
        }
      },
      changeView (view) {
        if (this.view !== view) {
          this.finish = '0'
        }
        this.view = view
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      hasNoComplete, hasComplete, mytestHasComplete, mytestNotComplate
    },
  }

</script>
<style lang="scss">
    @import "../css/selfHomework.scss";
</style>
