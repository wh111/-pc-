<!--
****--@file     layout
****--@date     2018/6/11 19:39
****--@author   YC
****--@describe 学生做作业布局模版
-->
<template>
    <div class="questionTodoLayout" ref="element">
        <head-top :hideMenu="true"></head-top>
        <div class="questionTodoMain" style="height: 100%">
            <div class="left leftBox" :style="{height: height}" v-if="!!questionTypeArr.length">
                <q-type v-for="(qTypeId,index) in questionTypeArr" :key="index" :hasType="!!questionTypeObj[qTypeId].questionsTypeId"
                        :question="questionTypeObj[qTypeId]" :open="openQuestion" :active="activeQuestion" :todoType="todoType"
                        @openOrClose="openOrCloseQuestion" @selectQuestion="selectQuestion"
                ></q-type>
            </div>
            <div class="rightBox">
                <slot name="top"></slot>
                <slot name="question"></slot>
                <slot name="footer"></slot>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  import headTop from '../common/headTop';
  import qType from './questionType';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'questionTodoLayout',
    props: {
      questionType: { // 试题类型
        type: Object,
        default: () => null
      },
      questionsId: { // 试题ID
        type: [String, Number],
        default: ''
      },
      todoType: { // 操作类型
        type: String,
        default: 'test'
      }
    },
    data () {
      return {
        height: 0,
        activeQuestion: this.questionsId, // 选中的试题
        openQuestion: [], // 打开的试题类型id
        questionTypeArr: [], // 试题类型
        questionTypeObj: null, // 试题id与类型对应关系
        questionIdObj: null // 试题id对应关系
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.initQuestionType();
      },
      initQuestionType () {
        let questionTypeArr = [[], []];
        let questionIdObj = {};
        let questionTypeIds = this.questionType && Object.keys(this.questionType) || [];
        questionTypeIds.map(typeId => {
          questionTypeArr[typeId > 0 ? 1 : 0].push(typeId);
          this.questionType[typeId].questions.map(item => questionIdObj[item.questionsId] = item);
        });
        questionTypeArr[0].sort((a, b) => b - a);
        questionTypeArr[1].sort((a, b) => a - b);
        this.questionTypeObj = this.questionType;
        this.questionIdObj = questionIdObj;
        this.questionTypeArr = questionTypeArr[0].concat(questionTypeArr[1]);
        // this.openQuestionCall();
      },
      // 展开试题
      openQuestionCall (questionsTypeId) {
        if (this.openQuestion.includes(questionsTypeId)) {
          return;
        }
        this.openQuestion.push(questionsTypeId || this.questionType[0].questionsTypeId);
      },
      // 关闭试题
      closeQuestionCall (questionsTypeId) {
        if (!this.openQuestion.length) {
          return;
        }
        let delIndex = this.openQuestion.indexOf(questionsTypeId);
        this.openQuestion.splice(delIndex, 1);
      },
      // 展开或者关闭试题
      openOrCloseQuestion (questionsTypeId) {
        this[(this.openQuestion.includes(questionsTypeId) ? 'close' : 'open') + 'QuestionCall'].apply(this, arguments);
      },
      // 选择试题
      selectQuestion (questionId) {
        if (questionId == this.activeQuestion) {
          return;
        }
        this.activeQuestion = questionId;
        this.openQuestionCall(this.questionIdObj[questionId].questionsTypeId);
          // console.log("layout--questionsId:", this.questionIdObj[questionId], "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        this.$emit('selectQuestion', this.$util._.defaultsDeep({}, this.questionIdObj[questionId]));
      }
    },
    created () {
      this.init();
    },
    mounted () {

      this.$nextTick(() => {
        setTimeout(() => {
          console.log(window.getComputedStyle(this.$refs.element).height.split('p')[0], window.getComputedStyle(this.$refs.element).height)
          let temp = window.getComputedStyle(this.$refs.element).height.split('p')[0] - 101
          console.log(temp)
          this.height = temp + 'px'
          console.log(this.height)
        }, 100)
//        console.log(8,this.$refs.questionTodoLayout.style)
//        this.height=this.$refs.questionTodoLayout.style.height;
//        console.log(this.$refs.questionTodoLayout.style.height)
      })
    },
    watch: {
      questionType () {
        this.initQuestionType();
      },
      questionsId (val, newVal) {
        // console.log('内部触发选择试题'+newVal+"%%%%%%%%%%%%%");
        this.selectQuestion(val);
      }
    },
    components: {
      headTop,
      qType
    }
  };

</script>
