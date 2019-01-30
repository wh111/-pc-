<!--
****--@file     index
****--@date     2018/6/11 19:43
****--@author   YC
****--@describe 学生做作业UI
-->
<template>
    <layout :questionType="questionTypeObj" :questionsId="questionsId" :todoType="todoType" @selectQuestion="selectQuestion">
        <slot name="top" slot="top"></slot>
        <template slot="question">
            <q-body v-if="qusetion instanceof Object"
                    :showData="qusetion" :index="questionIndex"
                    :showInput="showInput" :showAnswer="showAnswer"
                    @answer="answer"></q-body>
            <slot v-else>
                <p class="loadQuestionTips"><span class="el-icon-loading"></span>试题加载中...</p>
            </slot>
        </template>
        <slot name="footer" slot="footer"></slot>
    </layout>
</template>
<script>
  /*当前组件必要引入*/
  import layout from './layout';
  import qBody from '../questionTodoShow/show';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'questionIndex',
    props: ['questionTypeObj', 'qusetionContent', 'questionsId', 'todoType', 'showInput', 'showAnswer', 'index'],
    data () {
      return {
        loading: false,
        questionIndex: this.index || '',
        qusetion: this.qusetionContent || null
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      },

      selectQuestion (question) {
        this.questionIndex = question.index + 1;
        this.$emit('selectQuestion', question);
      },

      answer (data) {
        this.$emit('answer', data);
        console.log("answer",data)
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    watch: {
      qusetionContent (val) {
        console.log(val, 60)
        this.qusetion = val;
      },
      index (val) {
        this.questionIndex = val + 1;
      }
    },
    components: {
      layout, qBody
    }
  };

</script>

<style lang="scss">
    @import "../../assets/css/paper/questionTodoLayout";
</style>
