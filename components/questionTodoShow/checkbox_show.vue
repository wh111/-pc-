<!--
****--@file     checkbox_show
****--@date     2017/12/5 9:40
****--@author   YC
****--@describe 多选题-查看
-->
<template>
    <div>
        <el-row class="questionTodoBox">
            <!-- 顶部 -->
            <el-col class="qHeader"></el-col>
            <!-- 主体部分 -->
            <el-col class="qContent">
                <!-- 问题标题 -->
                <el-col class="qcTitle" :class="{'hasDo':hasDo}">
                    <!-- 问题显示区域 -->
                    <span v-if="index" class="qctIndex">{{ index }}</span>
                    <div class="qctTextBox" v-html="questionData.title" :style="{paddingRight:hasDo + 10 + 'px'}"></div>
                    <el-col class="qctTodoBox" :style="{width:hasDo + 'px'}">
                        <slot name="todo"></slot>
                    </el-col>
                </el-col>
                <!-- 问题选项 -->
                <el-col class="qcMain">
                    <el-checkbox-group v-model="answerVal" @change="choice" :disabled="!showInput">
                        <template v-if="!isPublicSelact">
                            <el-col class="qcmSel" :key="index" v-for="(str,index) in questionData.questionsOptions">
                                <el-checkbox :label="index">
                                    <span class="qcmSelItem">{{ index | getCharCode }}.</span>
                                    <div class="qcmSelText" v-html="str"></div>
                                </el-checkbox>
                            </el-col>
                        </template>
                        <template v-else>
                            <!-- 公共候选项只显示选项 -->
                            <el-col class="qcmSel">
                                <el-col class="qcmPubSel" :span="3" v-for="(str,index) in questionData.questionsOptions" :key="index">
                                    <el-checkbox :label="index">
                                        <span class="qcmSelItem">{{ index | getCharCode }}</span>
                                        <div class="qcmSelText"></div>
                                    </el-checkbox>
                                </el-col>
                            </el-col>
                        </template>
                    </el-checkbox-group>
                </el-col>
                <!-- 答案及解析 -->
                <el-col class="qcFooter" v-if="showAnswer">
                    <el-col>
                        <el-col :span="22">
                            <div class="qcfItem">
                                <b>正确答案：</b>
                                <b class="qcfiAnswer">{{ questionData.answer | answerCode }}</b>
                            </div>
                            <!-- 学生答案 -->
                            <template v-if="questionData.studentAnswer !== undefined">
                                <div class="qcfItem">
                                    <b>您的答案：</b>
                                    <b class="qcfiAnswer" v-if="questionData.studentAnswer !== null">{{
                                        questionData.studentAnswer | answerCode }}</b>
                                    <b class="qcfiAnswer" v-else></b>
                                </div>
                                <div class="qcfItem error"
                                     :class="{'success':questionData.answerResult==1}">
                                    <template v-if="questionData.answerResult==1">
                                        <i class="el-icon-success"></i> 正确
                                    </template>
                                    <template v-else>
                                        <i class="el-icon-error"></i> 错误
                                    </template>
                                </div>
                            </template>
                        </el-col>
                        <el-col :span="2" align="right">
                            <slot name="answerRight">
                                <el-button type="text" class="qcfShowExp" @click="showExp">查看解析 <i
                                        :class="showExpStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                                </el-button>
                            </slot>
                        </el-col>
                    </el-col>
                    <el-col class="qcfExpCon" v-if="showExpStatus">
                        <div>【解析】</div>
                        <div v-html="questionData.answerExplain"></div>
                    </el-col>
                </el-col>
            </el-col>
            <!-- 底部 -->
            <el-col class="qFooter"></el-col>
        </el-row>
        <!--<el-row class="qAnswerBox" v-if="showInput">-->
        <!--<el-col>-->
        <!--选择答案：-->
        <!--<el-button v-for="(item,index) in questionData.questionsOptions" :key="index"-->
        <!--:class="!!~answerVal.indexOf(index)?'active':''" @click="choice(index)">{{ index |-->
        <!--getCharCode-->
        <!--}}-->
        <!--</el-button>-->
        <!--</el-col>-->
        <!--</el-row>-->
    </div>
</template>
<style lang="scss">
    @import "../../assets/css/paper/questionTodo";
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'questionCheckboxShow',
    /**
     * index    题号
     * question 题目对象
     * hasDo 标题操作
     * showAnswer 显示答案和解析
     * showInput 显示选项输入框
     * questionItem 公共候选项
     */
    props: ['index', 'question', 'hasDo', 'showAnswer', 'showInput', 'questionItem'],
    data () {
      return {
        answerVal: [],
        isPublicSelact: false, // 公告候选下
        showExpStatus: false, // 显示解析
        optionsSpan: 24, // 选项展示比例
        questionData: {
          'score': '', // 分值
          'title': '', // 题目内容：文字
          'answer': '', // 正确答案：多个|隔开
          'answerExplain': '', // 答案解析
          'questionsOptions': [] // 试题选项：单选题、多选题、判断题 有此项。填空题 没有此项
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let data = null;
        if (this.question instanceof Object) {
          data = this.$util._.defaultsDeep({}, this.question);
          data.questionsOptions = data.questionsOptions && data.questionsOptions.split(this.$util.questionConfig.contentSplitStr) || [];
        }
        if (this.questionItem) {
          data.questionsOptions = this.questionItem.split(this.$util.questionConfig.contentSplitStr) || [];
          this.isPublicSelact = true;
        }
        console.log(data);
        this.questionData = data;
        // 如果选项中文字长度超过20个字符的每个选项都一行展示，否则每行显示四个选项
        // this.optionsSpan = this.questionData.questionsOptions.some(item => (item.content || '').length > 20) ? 24 : 6;
        this.answerVal = [];
        if (this.questionData.studentAnswer !== undefined && this.questionData.studentAnswer !== null) {
          let answerVal = this.questionData.studentAnswer.split('|');
          let answerArr = [];
          answerVal.map(item => answerArr.push(Number(item)));
          this.answerVal = answerArr;
          // 答案排序处理
          let answer = this.$util._.defaultsDeep([], this.answerVal);
          answer.sort();
          this.$emit('answer', answer.join('|'));
        }
      },
      showExp () {
        this.showExpStatus = !this.showExpStatus;
      },
      choice () {
        // let i = this.answerVal.indexOf(index);
        // if (!~i) {
        //   this.answerVal.push(index);
        // } else {
        //   this.answerVal.splice(i, 1);
        // }
        // 答案排序处理
        let answer = this.$util._.defaultsDeep([], this.answerVal);
        answer.sort();
        this.$emit('answer', answer.join('|'));
      }
    },
    watch: {
      question (val) {
        console.log(val);
        this.init();
      },
      showAnswer (val) {
        this.init()
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
