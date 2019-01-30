<!--
****--@file     evaluationByself
****--@date     2017/12/19 下午4:06
****--@author   jhd
****--@describe   自适应测评首页
-->
<template>
    <div class="evaluation-byself">
        <head-top></head-top>
        <div class="selfMyTree">
            <el-row class="searchProject" v-if="!loginNoGrade">
                <el-col :span="20">
                    <el-form labelWidth="60px" label-position="right">
                        <template v-if="!isLogin">
                            <el-form-item label="教材：">
                                <template v-if="textbookVersionList.length">
                                    <el-radio-group v-model="select.textbookVersionId" @change="changeTextbook">
                                        <el-radio v-for="item in textbookVersionList" :label="item.id" :key="item.id">
                                            {{item.name}}
                                        </el-radio>
                                    </el-radio-group>
                                </template>
                                <p v-else>暂无</p>
                            </el-form-item>
                            <el-form-item label="年级：">
                                <el-radio-group v-model="select.grade" @change="changeGrade">
                                    <el-radio v-for="item in gradeList" :label="item.code" :key="item.code">
                                        {{item.name}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>

                        <el-form-item label="科目：" v-if="subjectList.length">
                            <el-radio-group v-model="select.subject" @change="changeSubject">
                                <el-radio v-for="item in subjectList" :label="item.code" :key="item.code">
                                    {{item.value}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4">
                    <router-link target="_blank"
                                 :to="`/choiceEvaluation/${select.grade}/${isFirstAssessment}/${select.textbookVersionId}/${select.subject}`"
                                 v-if="checkData()">
                        <el-button class="btn orangeYellow">
                            进入测评
                            <i class="el-icon-arrow-right"></i>
                        </el-button>
                    </router-link>

                    <el-button v-else class="btn  orangeYellow"
                               @click="isClick(!checkData())">
                        进入测评
                        <i class="el-icon-arrow-right"></i>
                    </el-button>

                </el-col>
            </el-row>
            <div class="tree">
                <div v-if="index == 1" class="treeLeft">
                    <div class="treeDoor">
                        <p class="tree-p">打开知识的大门</p>
                        <ul class="tree-ul">
                            <li>您还未点亮知识树，</li>
                            <li>请完成科目<span
                                    @click="isClick(!checkData())">
                                <router-link
                                             :to="`/choiceEvaluation/${select.grade}/${isFirstAssessment}/${select.textbookVersionId}/${select.subject}`"
                                             v-if="checkData()">
                                   <span style="color: #fc4341"> 首次测评</span>
                                </router-link>
                                <template v-else>   <span style="color: #fc4341"> 首次测评</span></template>
                                </span>点亮知识树！
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-else class="treeLeft-all">
                    <ul class="app-wrap clearfix">
                        <div v-for="(item,index) in appArr" :key="index" class="app-line" :class="'app-line-'+index">
                            <li class="img-wrap" v-for="(arr,i) in item.apple" :key="i" @click="selfText(arr)"
                                :style="{left: arr.marginLeft + i * 80 + 'px'}">
                                <el-tooltip class="item" effect="light" :content="arr.name+'：'+arr.chapterText"
                                            placement="right-end">
                                    <img class="cursor" :src="'/sasstudent/img/' + arr.img + '.png'">
                                </el-tooltip>
                            </li>
                        </div>
                    </ul>
                </div>
                <div class="treeRight">
                    <b>当前章节掌握情况</b>
                    <ul class="treeRight-ul" v-if="chapterList.length > 0">
                        <li @click="selfText(item)" class="treeRight-li" v-for="(item,index) in chapterList"
                            :key="index">
                            {{item.name}}：{{item.chapterText}}
                            <span>
                                    <div class="selfApple" style="top: 5px;position: relative"
                                         :class="{
                                            'selfApple4': item.level == 0,
                                            'selfApple3': item.level >= 1 && item.level < 50,
                                            'selfApple2': item.level >= 50 && item.level < 100,
                                            'selfApple1': item.level == 100,
                                         }"></div>
                                    <div style="width: 42px;display: inline-block">{{item.level}}%</div>
                                </span>
                        </li>
                    </ul>
                    <p v-else style="text-align: center;line-height: 25px;font-size: 12px">暂无数据</p>
                </div>
            </div>
        </div>
        <div class="speed">
            <div class="speed-left" style="border-right: 1px solid #e5e5e5">
                <p class="progress-tip">当前学习进度</p>
                <co-progress class="co-progress" background="#1cc03b" :text-inside="true" :stroke-width="18"
                             :percentage="studyProgress"></co-progress>
                <p class="numText">
                    <span>{{ studyProgress }}%</span>
                    <span class="right">100%</span>
                </p>
            </div>
            <div class="speed-left">
                <p class="progress-tip">我的能力值</p>
                <co-progress class="co-progress" background="#fd7416" :text-inside="true" :stroke-width="18"
                             :percentage="percentageAbility"></co-progress>
                <p class="numText">
                    <span>{{ percentageAbility }}</span>
                    <span class="right">100</span>
                </p>
            </div>
        </div>
        <footer-buttom></footer-buttom>
        <div>
            <Modal
                    :mask-closable="false"
                    width="700"
                    v-model="selfTextAlertModel"
                    title="自适应测评-弹窗"
                    class-name="alertSelftest">
                <modal-header slot="header" :content="selfTextAlert"></modal-header>
                <!---->
                <selfTextAlert :operationData="operationData" :subject="select.subject" v-if="selfTextAlertModel"
                ></selfTextAlert>
                <div slot="footer"></div>
            </Modal>
        </div>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from './api'
    import headTop from '../../components/common/headTop.vue'
    import footerButtom from '../../components/common/footer.vue'
    import coProgress from '../../components/common/progress.vue'
    import selfTextAlert from '../selfCenter/selfCenterdetail/components/selfTextAlert.vue' //自适应测平
    let Util = null
    export default {
        data() {
            return {
                index: 1,
                num: 20,
                isLogin: this.$store.getters['app/isLogin'],
                loginNoGrade: false,
                isFirstAssessment: 1, // 是否是首次 1首次/2非首次
                appArr: {
                    1: {apple: [], number: 1},
                    2: {apple: [], number: 7},
                    3: {apple: [], number: 6},
                    4: {apple: [], number: 7},
                    5: {apple: [], number: 8},
                    6: {apple: [], number: 10},
                    7: {apple: [], number: 11}
                },
//				weight:[ 4,5,6,3,2,1,7 ],
                select: {
                    textbookVersionId: '',
                    subject: '',
                    grade: ''
                },
                operationData: {},//点击选择的苹果数据
                selfTextAlertModel: false,
                selfTextAlert: {
                    id: 'selfTextAlert',
                    title: ' 　',
                },

                gradeList: [],
                chapterList: [],
                studyProgress: 0,//学习进度
                percentageAbility: 0,//能力值
                subjectList: [], // 科目
                textbookVersionList: [], // 教程版本
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.textbookVersionList = this.$store.getters['app/envs']('textBookVersionList');
                this.gradeList = this.$store.getters['app/envs']('gradeList');
                if(this.isLogin) {
                    // 获取学生所在年级
                    let grade = this.$store.getters['user/info']('grade');
                    if(!grade) {
                        this.loginNoGrade = true;
                        this.$notify({
                            type: 'warning',
                            title: '提示',
                            offset: 160,
                            dangerouslyUseHTMLString: true,
                            message: `请先前往<b>个人中心</b>完善年级等个人资料`
                        });
                        return
                    }
                    this.select.grade = grade;
                    // 根据年级获取科目
                    this.changeGrade(grade);
                    // 默认选择第一个科目
                    this.select.subject = this.subjectList[0].code;
                    this.changeSubject(this.select.subject);
                } else {
                    this.index = 1;
                }
            },

            /*
            * 获取当前学生学习进度/能力值
            * */
            getStudentAbility() {
                this.chapterList = [];
                this.ajax({
                    ajaxSuccess: res => {
                        if(res.data && res.data instanceof Object) {
                            let data = res.data.chapterList;
                            data.sort((a, b) => a.chapterId > b.chapterId);
                            this.chapterList = data;
                            this.studyProgress = res.data.studyProgress || 0;
                            this.percentageAbility = res.data.percentageAbility || 0;
                            this.readTree()
                        } else {
                            this.studyProgress = 0;
                            this.percentageAbility = 0;
                        }
                    },
                    ajaxParams: {
                        url: api.getStudentAbility.path,
                        params: {
                            grade: this.select.grade,
                            subject: this.select.subject
                        }
                    }
                })
            },
            getFirstAssessmentState() {
                let opt = {
                    ajaxSuccess: res => {
                        if(res.data) {
                            this.isFirstAssessment = 2;
                            this.$store.commit('user/updateIsFirstAssessment', true);
                            this.index = 2;
                            this.getStudentAbility();
                        } else {
                            this.isFirstAssessment = 1;
                            this.$store.commit('user/updateIsFirstAssessment', false);
                            this.index = 1;
                            this.studyProgress = 0;
                            this.percentageAbility = 0;
                        }
                    },
                    ajaxParams: {
                        url: api.isFirstAssessment.path,
                        params: this.select
                    }
                };
                this.ajax(opt)
            },
            changeGrade(val) {
                this.select.subject = '';
                this.subjectList = this.$store.getters['app/gradeMap'](val)
            },
            changeSubject(subject) {
                if(this.isLogin) {
                    let userTBV = this.$store.getters['user/textbookVBySubject'](subject);
                    this.select.textbookVersionId = '';
                    if(!userTBV.textbookVersionId) {
                        this.index = 1;
                        this.$Message.error('请先到个人中心完善该科目的教材版本信息！')
                    } else {
                        this.select.textbookVersionId = userTBV.textbookVersionId;
                    }
                    this.chapterList = [];
                    this.appArr = {
                        1: {apple: [], number: 1},
                        2: {apple: [], number: 7},
                        3: {apple: [], number: 6},
                        4: {apple: [], number: 7},
                        5: {apple: [], number: 8},
                        6: {apple: [], number: 10},
                        7: {apple: [], number: 11}
                    };
                    this.getFirstAssessmentState();
                }
            },
            changeTextbook(id) {
                console.log(id)
            },
            checkData() {
                return this.select.subject && this.select.grade && this.select.textbookVersionId
            },
            /*是否可以进入测评
            * @param flag  true不能点击
            * */
            isClick(flag) {
                if(flag) {
                    this.showMess(this.isLogin ? '请先到个人中心完善该科目的教材版本信息！' : "请选择相应的年级和科目及对应的教材版本!");
                }
            },
            readTree() {
                let arr = [];
                let that = this;
                let chapterList = that.chapterList;
                let len = chapterList.length;
                let ind = 0;
                this.appArr = {
                    1: {apple: [], number: 1},
                    2: {apple: [], number: 7},
                    3: {apple: [], number: 6},
                    4: {apple: [], number: 7},
                    5: {apple: [], number: 8},
                    6: {apple: [], number: 10},
                    7: {apple: [], number: 11}
                };
                for(let key in this.appArr) {
                    if(key < 7) {
                        arr.push(Math.floor(len * this.appArr[key].number / 50))
                    }
                }
                arr.map(function(item, index) {
                    if(item > 0) {
                        '1'.repeat(item).split('').map(function(i) {
                            let temp = chapterList[ind];
                            temp.img = 'app-4';
                            temp.marginLeft = parseInt(that.appArr[index + 1].number * 3 * Math.random() * 10);
                            if(temp.level === 100) {
                                temp.img = 'app-1';
                            } else if(temp.level >= 50 && temp.level < 100) {
                                temp.img = 'app-2';
                            } else if(temp.level >= 1 && temp.level < 50) {
                                temp.img = 'app-3';
                            }
                            that.appArr[index + 1].apple.push(temp);
                            ind = ind + 1;
                        })
                    }
                })
                let a = 0;
                for(let key in this.appArr) {
                    if(key < 7) {
                        a = a + this.appArr[key].apple.length
                    }
                }
                '1'.repeat(this.chapterList.length - a).split('').map(function(i) {
                    let temp = chapterList[ind];
                    temp.img = 'app-4';
                    temp.marginLeft = parseInt(that.appArr[7].number * 3 * Math.random() * 10);
                    if(temp.level === 100) {
                        temp.img = 'app-1';
                    } else if(temp.level >= 50 && temp.level < 100) {
                        temp.img = 'app-2';
                    } else if(temp.level >= 1 && temp.level < 50) {
                        temp.img = 'app-3';
                    }
                    that.appArr[7].apple.push(temp);
                    ind = ind + 1;
                })
              console.log(this.appArr)
            },

            //点击打开自适应测评弹窗
            selfText(item) {
                this.operationData = item;
                this.selfTextAlertModel = true;
            },


        },
        computed: {
            // appleStyle() {
            //     let style = {};
            //     style.width = Math.floor(Math.sqrt(Math.floor(400 * 260 / this.num))) + 'px';
            //     style.height = Math.floor(Math.sqrt(Math.floor(400 * 260 / this.num))) + 'px';
            //     return style
            // }
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
            headTop,
            coProgress,
            footerButtom,
            selfTextAlert,
        }
    }

</script>
<style lang="scss">
    .evaluation-byself {
        background-color: #efefef;
        .cursor {
            cursor: pointer;
        }
        .selfMyTree {
            width: 1200px;
            border-radius: 3px;
            margin: 40px auto;
            padding: 30px;
            padding-top: 1px;
            background-color: #ffffff;
            .searchProject {
                margin: 40px 0px;
                background: #efefef;
                font-size: 14px;
                position: relative;
                padding: 10px 0 10px 20px;
                .btn {
                    z-index: 999;
                    position: absolute;
                    top: 50%;
                    right: 2%;
                    margin-top: -16px;
                    cursor: pointer;
                    border-radius: 13.5px;
                    color: #fff;
                }

                .el-form-item--small.el-form-item {
                    margin: 0;
                    .el-form-item__label {
                        font-size: 14px;
                        font-weight: bold;
                        text-align: left;
                        color: #434343;
                    }
                }
                .el-radio-group {
                    .is-checked {
                        .is-checked {
                            .el-radio__inner {
                                background-color: #fd7416;
                                border-color: #fd7416;
                            }
                        }
                    }
                }
            }
            .tree {
                /*padding: 0 50px;*/
                height: 739px;
                background: #ffffff;
            }
        }
        .treeLeft {
            margin-left: 76px;
            float: left;
            width: 593px;
            height: 703px;
            background-size: 100%;
            background-image: url("../../assets/images/tree.png");
            .treeDoor {
                width: 593px;
                height: 210px;
                background-color: #eeeeee;
                margin-top: 145px;
                opacity: 0.9;
                .tree-p {
                    padding-top: 60px;
                    font-size: 36px;
                    font-weight: bold;
                    text-align: center;
                    color: #a0a0a0;
                }
                .tree-ul {
                    li {
                        font-size: 14px;
                        line-height: 24px;
                        text-align: center;
                        span {
                            color: red;
                            cursor: pointer;
                        }
                    }
                }

            }
        }
        .treeLeft-all {
            float: left;
            width: 593px;
            margin-left: 77px;
            height: 703px;
            position: relative;
            background-size: 100%;
            background-image: url("../../assets/images/tree-1.png");
            .app-wrap {
                position: absolute;
                top: 39px;
                .app-line {
                    height: 50px;
                    margin: 0 auto;
                    text-align: center;
                    position: relative;
                }
                .app-line-0 {
                    width: 40px;
                }
                .app-line-1 {
                    width: 198px;
                }
                .app-line-2 {
                    width: 242px;
                }
                .app-line-3 {
                    width: 300px;
                }
                .app-line-4 {
                    width: 374px;
                }
                .app-line-5 {
                    width: 472px;
                }
                .app-line-6 {
                    width: 566px;
                }
                .app-line-7 {
                    width: 586px;
                }
                .img-wrap {
                    display: inline-block;
                    position: absolute;
                    top: 6px;
                    /*float: left;*/
                    /*img {*/
                    /*!*margin:5%;*!*/
                    /*}*/
                }
            }
        }
        .treeRight {
            border-radius: 5px;
            border: solid 1px #e5e5e5;
            padding-left: 10px;
            float: right;
            width: 360px;
            height: 680px;
            line-height: 40px;
            margin-top: 31px;
            padding-right: 10px;
            font-size: 12px;
            b {
                font-size: 14px;
            }
            .treeRight-ul {
                height: 655px;
                overflow: auto;
                padding: 0px;
                .treeRight-li {
                    color: #a0a0a0;
                    width: 333px;
                    a {
                        color: #727272;
                    }
                    .selfApple {
                        width: 22px;
                        height: 22px;
                        display: inline-block;
                        background-size: 100%;
                        cursor: pointer;
                    }
                    span {
                        float: right;
                    }

                }
            }
        }
        .speed {
            width: 1200px;
            border-radius: 3px;
            background: #ffffff;
            margin: 0 auto 40px auto;
            overflow: hidden;
            .speed-left {
                float: left;
                text-align: center;
                width: 600px;
                height: 90px;
                .progress-tip {
                    font-size: 14px;
                    line-height: 2.86;
                    text-align: left;
                    margin-left: 50px;
                    color: #434343;
                }
                .co-progress, .numText {
                    width: 500px;
                    margin: 0 auto;
                    text-align: left;
                    font-size: 12px;
                    color: #a0a0a0;
                }
            }
            .el-progress-bar__innerText {
                display: none;
            }
            .el-progress-bar__outer {
                height: 6px !important;
            }
        }
        .el-radio {
            margin-left: 0;
            margin-right: 20px;
            line-height: 32px;
        }
        .selfApple1 {
            background-image: url("/sasstudent/img/app-1.png");
        }
        .selfApple2 {
            background-image: url("/sasstudent/img/app-2.png");
        }
        .selfApple3 {
            background-image: url("/sasstudent/img/app-3.png");
        }
        .selfApple4 {
            background-image: url("/sasstudent/img/app-4.png");
        }
    }

</style>