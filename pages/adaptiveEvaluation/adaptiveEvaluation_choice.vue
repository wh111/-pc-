<!--
****--@file     adaptiveEvaluation_choice
****--@date     2017/12/19 上午10:38
****--@author   jhd
****--@describe   自选测评 选择
-->
<template>
    <div class="adaptive-evaluation">
        <div class="modal">
            <div class="logo-wrap">
                <router-link to="/">
                    <img src="../../assets/images/logo.png" alt="">
                </router-link>
            </div>
            <p class="title">自选测评</p>
            <div class="content">
                <p class="tip">请选择你要测试的信息</p>
                <el-form labelWidth="160px" class="selectBox">
                    <!--<el-form-item label="阶段：">-->
                    <!--<el-button v-for="(item,index) in stageList" @click="changeMoudle('stage',index + 1)"-->
                    <!--:class="select.stage == index + 1 ?'active':''"-->
                    <!--:key="index">{{ item }}-->
                    <!--</el-button>-->
                    <!--</el-form-item>-->
                    <el-form-item label="年级：">
                        <template v-for="item in gradeList">
                            <!-- 小学 -->
                            <template v-if="select.stage == 1 && item.code < 7">
                                <el-button @click="changeMoudle('grade',item.code)"
                                           :class="select.grade == item.code ? 'active':''"
                                           :key="item.code">{{item.name}}
                                </el-button>
                            </template>
                            <!-- 初中 -->
                            <template v-if="select.stage == 2 && item.code > 6 && item.code < 10">
                                <el-button @click="changeMoudle('grade',item.code)"
                                           :class="select.grade == item.code ? 'active':''"
                                           :key="item.code">{{item.name}}
                                </el-button>
                            </template>
                            <!-- 高中 -->
                            <template v-if="select.stage == 3 && item.code > 9 && item.code < 13">
                                <el-button @click="changeMoudle('grade',item.code)"
                                           :class="select.grade == item.code ? 'active':''"
                                           :key="item.code">{{item.name}}
                                </el-button>
                            </template>
                            <!-- 全部 -->
                            <template v-if="!select.stage">
                                <el-button @click="changeMoudle('grade',item.code)"
                                           :class="select.grade == item.code ? 'active':''"
                                           :key="item.code">{{item.name}}
                                </el-button>
                            </template>
                        </template>
                    </el-form-item>
                    <el-form-item label="教材：">
                        <el-button v-for="item in textbookVersionList" @click="changeMoudle('textbookVersion',item.id)"
                                   :class="select.textbookVersion == item.id ? 'active':''"
                                   :key="item.id">{{item.name}}
                        </el-button>
                    </el-form-item>
                    <el-form-item label="科目：">
                        <el-button v-for="(item,index) in subjectList" @click="changeMoudle('subject',item.code)"
                                   :class="select.subject == item.code ? 'active':''"
                                   :key="index">{{item.value}}
                        </el-button>
                    </el-form-item>
                    <el-form-item label="学期：">
                        <el-button v-for="index in 2" @click="changeMoudle('term',index-1)"
                                   :class="select.term === index-1 ? 'active':''"
                                   :key="index">{{ (index-1) | term }}
                        </el-button>
                    </el-form-item>
                    <el-form-item label="章节：" v-if="chapterList instanceof Array">
                        <template v-if="chapterList.length">
                            <el-checkbox-group v-model="select.chapter">
                                <el-checkbox v-for="item in chapterList" :label="item.id" :key="item.id">
                                    {{ item.name + ':' + item.chapterText }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </template>
                        <p v-else>暂无数据</p>
                    </el-form-item>
                </el-form>
                <p class="btn-wrap">
                    <el-button @click="startTest" style="border: none" class="orangeYellow">开始测评</el-button>
                </p>
            </div>
        </div>
        <el-dialog title="试卷名称填写" :visible.sync="editTitle" width="400px">
            <el-form :model="form" :rules="titleRules" :inline="true" ref="titleForm" onsubmit="return false">
                <el-form-item label="试卷名称：" prop="title">
                    <el-input v-model="form.title"></el-input>
                    <p>（添加试卷名称，方便查找！）</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialogBtnBox">
                <el-button @click="editTitle = false">取 消</el-button>
                <el-button type="primary" @click="editTitleDone">确 定</el-button>
            </div>
        </el-dialog>
        <!--<el-dialog title="提示" :visible.sync="centerDialogVisible" width="200px" center>-->
        <!--<span>需要注意的是内容是默认不居中的</span>-->
        <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
        <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    export default {
        data() {
            return {
                form: {
                    title: '',
                },
                select: {
                    stage: '',
                    grade: '',
                    textbookVersion: '',
                    subject: '',
                    term: '',
                    chapter: []
                },
                gradeList: [], // 年级
                chapterList: null, // 章节
                stageList: ['小学', '初中', '高中'],  // 阶段
                textbookVersionList: [], // 教材版本
                subjectList: [], // 科目
                editTitle: false,
                titleRules: {
                    title: [
                        {required: true, message: '请输入试卷名称'},
                        {min: 1, max: 50, message: '最多输入50个字'}
                    ]
                }
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.gradeList = this.$store.getters['app/envs']('gradeList');
                this.textbookVersionList = this.$store.getters['app/envs']('textBookVersionList');
                this.subjectList = this.$store.getters['app/envs']('gradeMap')[12];
            },
            changeMoudle(type, id) {
                this.select[type] = id;
                switch(type) {
                    case 'stage': // 改变阶段
                        this.changeStage();
                        break;
                    case 'grade': // 改变年级
                        this.changeGrade(id);
                        break;
                    default:
                        break;
                }
                this.getChapter()
            },
            changeStage() {
                this.select.grade = '';
                this.select.subject = '';
                this.chapterList = null;
            },
            changeGrade(grade) {
                // this.select.stage = 1;
                // if(grade > 6 && grade < 10) {
                //     this.select.stage = 2;
                // } else if(grade > 10 && grade < 13) {
                //     this.select.stage = 3;
                // }
                this.select.subject = '';
                this.subjectList = this.$store.getters['app/envs']('gradeMap')[grade];
                this.chapterList = null;
            },
            checkData() {
                let check = {
                    grade: {
                        name: '年级'
                    },
                    textbookVersion: {name: '教材'},
                    subject: {name: '科目'},
                    term: {name: '学期', hasError: this.select.term === ''},
                    chapter: {
                        name: '章节',
                        hasError: this.select.chapter.length > 10 || this.select.chapter.length < 3,
                        msg: '章节至少选项3个最多选择10个',
                    }
                };
                let dataObj = this.select;
                for(let item in check) {
                    if(check[item].hasError != undefined ? check[item].hasError : !dataObj[item]) {
                        this.$Message.error((check[item].msg || '请选择') + check[item].name);
                        return false
                    }
                }
                return true
            },
            getChapter() {
                let {grade, subject, term, textbookVersion: textbookVersionId} = this.select;
                if(!grade || !subject || !term === '' || !textbookVersionId) {
                    return
                }
                this.select.chapter = [];
                this.chapterList = [];
                let opt = {
                    ajaxSuccess: res => this.chapterList = res.data,
                    ajaxParams: {
                        url: '/textbook/queryChapterList',
                        params: {
                            grade, subject, textbookVersionId,
                            term: term || '0'
                        }
                    }
                };
                this.ajax(opt)
            },
            startTest() {
                if(this.checkData()) {
                    this.editTitle = true
                }
            },
            editTitleDone() {
                this.$refs['titleForm'].validate((valid) => {
                    if(valid) {
                        this.$util.setStore('paperTitle', this.form.title);
                        this.$util.removeStore('questionConf');
                        let {grade, subject, term, textbookVersion: textbookVersionId, chapter} = this.select;
                        this.$router.push({
                            path: '/startProplem', query: {
                                chapterIds: chapter.join(','),
                                grade, subject, term, textbookVersionId,
                            }
                        })
                    }
                });
            }
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {}
    }

</script>
<style lang="scss">
    .adaptive-evaluation {
        height: 950px;
        background-size: 100% 100%;
        background-image: url("../../assets/images/adaptiveEvaluation.jpg");
        .modal {
            .logo-wrap {
                position: absolute;
                top: 65px;
                left: 0px;
            }
            position: relative;
            width: 1200px;
            margin: 0 auto;
            padding-top: 150px;
            .title {
                font-size: 26px;
                background-color: #ebede1;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.54;
                letter-spacing: 0.1px;
                text-align: center;
                color: #313131;
            }
            .content {
                background: #ffffff;
                .tip {
                    padding-top: 60px;
                    margin-left: 100px;
                    font-size: 26px;
                    font-weight: normal;
                    font-style: normal;
                    font-stretch: normal;
                    line-height: 1.92;
                    letter-spacing: normal;
                    text-align: left;
                    color: #313131;
                }
                .el-form-item__content {
                    .el-button {
                        border-radius: 14px;
                        color: #434343;
                    }
                    /*.el-button:hover {*/
                    /*background: #fd7416;*/
                    /*color: #fff;*/
                    /*border: 1px solid #fd7416;*/
                    /*}*/
                    .active {
                        background: #fd7416;
                        color: #fff;
                        border: 1px solid #fd7416;
                    }
                }
                .el-checkbox-group {
                    .is-checked {
                        .el-checkbox__label {
                            color: #fd7416;
                        }
                        .is-checked {
                            .el-checkbox__inner {
                                background-color: #fd7416;
                                border-color: #fd7416;
                            }
                        }
                    }
                }
                .btn-wrap {
                    text-align: center;
                    padding-bottom: 30px;
                    .el-button {
                        border-radius: 23px;
                        background: #fd7416;
                        color: #fff;
                    }
                }
            }
        }
        .selectBox {
            margin-top: 20px;
        }
        .dialogBtnBox {
            .el-button {
                background: #FFF;
                color: #fd7416;
                border: none;
            }
            .el-button--primary {
                background: #fd7416;
                color: #fff;
            }
        }
        .selectBox {
            .el-button {
                margin-left: 0;
                margin-right: 10px;
                margin-bottom: 6px
            }
        }
    }
</style>
