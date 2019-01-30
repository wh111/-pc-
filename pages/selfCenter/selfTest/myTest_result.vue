<!--
****--@file     myTest_result
****--@date     2017/12/13 下午5:14
****--@author   jhd
****--@describe   测评结果
-->
<template>
    <div class="personal-question myTest-result">
        <template v-if="showError">
            <p class="errMsg">参数被篡改，环境异常！</p>
        </template>
        <template v-else>
            <div class="head">
                <!--<p>{{resData.grade | grade(self) }}{{resData.term | term }}{{resData.subject | subject}}测评结果</p>-->
                <p v-if="resData.title">《{{resData.title}}》</p>
                <span>评测结果分析</span>
            </div>
            <ul class="clearfix type" style="padding-top: 0">
                <li style="width: 445px" :class="showType == 1 ? 'active' : ''" @click="type('1')">测评结果</li>
                <li style="width: 445px" :class="showType == 2 ? 'active' : ''" @click="type('2')">提分方案</li>
            </ul>
            <keep-alive>
                <div v-if="showType == 1">
                    <test-result @setData="setData" :id="id" :testType="testType" :getDataByURL="false"></test-result>
                </div>
            </keep-alive>
            <keep-alive>
                <div v-if="showType == 2">
                    <promote-plan :id="id" :advise="resData.advise"></promote-plan>
                </div>
            </keep-alive>
        </template>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    import testResult from './components/test_result.vue'
    import promotePlan from './components/promotePlan.vue'

    export default {
        data() {
            return {
            	self:this,
                id: '', // 自选/评测Id
                testType: '', // 测评类型（2自适应测评|3自选测评）
                resData: {
                    title: '',
                    grade: '',
                    term: '',
                    subject: '',
                    advise: '',
                },
                totalCount: 7,
                loading: false,
                showType: '1',
                testPaperModal: false,
                testPaperId: {
                    id: 'testPaperId',
                    title: '评价'
                },
                showError: false,

            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                let {id = '', testType = ''} = this.$route.params;
                if(!id || (id && isNaN(id)) || !testType || !~['2', '3'].indexOf(testType)) {
                    this.showError = true;
                }
                this.id = id;
                this.testType = testType;
            },
            /**
             * 评价
             * **/
            testPaper() {
                this.testPaperModal = true
            },
            /**
             * 自组件回调函数
             * **/
            cancel() {
                this.testPaperModal = false;
            },
            /**
             * 获取测评结果  将年级 科目等信息返回给父组件
             *
             * **/
            setData(target) {
                this.resData = target;
                // this.resData.grade = target.grade;
                // this.resData.term = target.term;
                // this.resData.subject = target.subject;
                // this.resData.advise = target.advise;
            },
            subCallback() {

            },
            /**
             * 题库类型
             * **/
            type(index) {
                this.showType = index;
            }
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            testResult,
            promotePlan
        }
    }

</script>
<style lang="scss">
    @import "../css/personalQuestion";

    .myTest-result {
        .errMsg {
            text-align: center;
            line-height: 700px;
        }
        .head {
            text-align: center;
            p {
                font-size: 30px;
                /*margin-top: 30px;*/
                line-height: 2.53;
                text-align: center;
                color: #313131;
            }
            span {
                font-size: 14px;
                line-height: 3.29;
                color: #7d7d7d;
            }
        }
    }
</style>
