<!--
****--@file     show
****--@date     2018/1/12 16:55
****--@author   YC
****--@describe 题型查看
-->
<template>
    <div>
        <!-- 组合题 -->
        <template v-if="showDatas.groups">
            <mix-show v-if="showDatas.publics" :question="showDatas" :index="index" :hasDo="hasDo"
                      :showAnswer="showAnswer" :showInput="showInput" @answer="answer">
                <slot name="todoBox" slot="todo"></slot>
                <template v-if="showDatas.groups && showDatas.childQuestionsList">
                    <slot v-for="item in showDatas.childQuestionsList" :name="'answerRight'+item.id"
                          :slot="'answerRight'+item.id"></slot>
                </template>
                <slot v-else name="answerRight" slot="answerRight"></slot>
            </mix-show>
            <group-show v-else :question="showDatas" :index="index" :hasDo="hasDo" :showAnswer="showAnswer"
                        :showInput="showInput" @answer="answer">
                <slot name="todoBox" slot="todo"></slot>
                <template v-if="showDatas.groups && showDatas.childQuestionsList">
                    <slot v-for="item in showDatas.childQuestionsList" :name="'answerRight'+item.id"
                          :slot="'answerRight'+item.id"></slot>
                </template>
                <slot v-else name="answerRight" slot="answerRight"></slot>
            </group-show>
        </template>
        <!-- 普通题型 -->
        <template v-else>
            <radio-show v-if="showDatas.basicType === 'Radio'" :question="showDatas" :index="index" :hasDo="hasDo"
                        :showAnswer="showAnswer" :showInput="showInput" @answer="answer">
                <slot name="todoBox" slot="todo"></slot>
                <slot name="answerRight" slot="answerRight"></slot>
            </radio-show>
            <checkbox-show v-if="showDatas.basicType === 'Checkbox'" :question="showDatas" :index="index"
                           :hasDo="hasDo" :showAnswer="showAnswer" :showInput="showInput" @answer="answer">
                <slot name="todoBox" slot="todo"></slot>
                <slot name="answerRight" slot="answerRight"></slot>
            </checkbox-show>
            <judgment-show v-if="showDatas.basicType === 'Judgment'" :question="showDatas" :index="index"
                           :hasDo="hasDo" :showAnswer="showAnswer" :showInput="showInput" @answer="answer">
                <slot name="todoBox" slot="todo"></slot>
                <slot name="answerRight" slot="answerRight"></slot>
            </judgment-show>
            <input-show v-if="showDatas.basicType === 'Input'" :question="showDatas" :index="index" :hasDo="hasDo"
                        :showAnswer="showAnswer" :showInput="showInput" @answer="answer">
                <slot name="todoBox" slot="todo"></slot>
                <slot name="answerRight" slot="answerRight"></slot>
            </input-show>
            <answer-show v-if="showDatas.basicType === 'Answer'" :question="showDatas" :index="index" :hasDo="hasDo"
                         :showAnswer="showAnswer" :showInput="showInput" @answer="answer">
                <slot name="todoBox" slot="todo"></slot>
                <slot name="answerRight" slot="answerRight"></slot>
            </answer-show>
        </template>
    </div>
</template>
<script>
  /*当前组件必要引入*/
  import radioShow from './radio_show'
  import checkboxShow from './checkbox_show'
  import judgmentShow from './judgment_show'
  import inputShow from './input_show'
  import answerShow from './answer_show'
  import groupShow from './group_show'
  import mixShow from './mix_show'

  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'questionShow',
    //showData 是试题的显示数据对象
    // index 第几题
    // hasDo 需要操作该题分发内容的宽度
    // showAnswer 显示该题答案
    // showInput 答题模式
    props: ['showData', 'index', 'hasDo', 'showAnswer', 'showInput'],
    data () {
      return {
        showDatas: {}
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        // console.log(this.showDatas)
        this.showDatas = this.showData
      },
      answer (data) {
        this.$emit('answer', data)
          console.log(data)
      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    watch: {
      showData (val) {
        this.init()
        // console.log(val, 'showData=showDatas')
      },
      showAnswer (val) {
        this.init()

//        this.init();
      }
    },
    components: {
      radioShow, checkboxShow, judgmentShow, inputShow, answerShow, groupShow, mixShow
    }
  }

</script>
<style>
    /*.questionTodoMain p{*/
    /*width:100%;*/
    /*}*/
    /*.questionTodoMain p img{*/
    /*width:100%;*/
    /*}*/
</style>

