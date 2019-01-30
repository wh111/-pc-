<!--
****--@file     questionType
****--@date     2018/6/12 20:32
****--@author   YC
****--@describe 试题类型
-->
<template>
    <div class="questionType" :class="{open:isOpen}">
        <p class="questionTypeText" style="height: 100%" :class="['ljlxTest'+(isOpen ? 'Open' : 'Close') ]"
           v-if="question.questionsTypeName"
           @click="openOrClose">
            题型：
            <span>{{ question.questionsTypeName }}</span>
        </p>
        <ul class="questionTypeNumBox">
            <li v-for="(item,index) in question.questions" :key="index" class="questionTypeIndexItem"
                :class="{
                'hasDid':item.answerResult!==null,
                'ljlxTestRight':item.answerResult==true && ['homework','toDoQuestions'].includes(todoType),
                'ljlxTestError':item.answerResult==false && ['homework','toDoQuestions'].includes(todoType)}">
                <p class="questionTypeNum" :class="{'active':selectQuestionId==item.questionsId}" @click="selectQuestion(item.questionsId)">
                    {{ index + 1 }}
                </p>
            </li>
        </ul>
    </div>
</template>
<style lang="scss">

</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'questionTodoType',
    props: {
      hasType: { // 是否显示题型文本
        type: Boolean,
        default: true
      },
      question: { // 该题型显示所需数据
        type: Object,
        default: () => ({
          questionsTypeId: '', // 题型id
          questionsTypeName: '', // 试题类型
          questions: [ // 试题序号
            // {
            //   questionsId: '', // 试题id
            //   answerResult: '', // true|false 做对或者做错 null未做 任何非false的值都表示已做
            //   seq: '' // 第几题
            // }
          ]
        })
      },
      open: { // 展开的题型的序号数组
        type: Array,
        default: () => []
      },
      active: { // 选中的试题id
        type: [String, Number],
        default: ''
      },
      todoType: { // 当前路由传递的试卷的类型 test：测评, homework:作业
        type: String,
        default: 'test'
      }
    },
    data () {
      return {
        isOpen: false,
        selectQuestionId: ''
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getOpenStatus();
        this.getSelectQuestionId();
      },
      getSelectQuestionId () {
        this.selectQuestionId = this.active;
      },
      getOpenStatus () {
        this.isOpen = this.open.includes(this.question.questionsTypeId);
      },
      openOrClose () {
        this.$emit('openOrClose', this.question.questionsTypeId);
      },
      selectQuestion (questionsId) {
          // console.log("clickleft--questionsId:" , questionsId , "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        this.$emit('selectQuestion', questionsId);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    watch: {
      open () {
        this.getOpenStatus();
      },
      active () {
        this.getSelectQuestionId();
      }
    },
    components: {}
  };

</script>
