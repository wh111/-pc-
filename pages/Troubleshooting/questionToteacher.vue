<!--
****--@file     questionToteacher
****--@date     2018/1/2 14:48
****--@author   wh
****--@describe   答疑名师列表
-->
<template>
    <div class="questionToteacher-root">
        <div class="right">
            <h1>答疑名师</h1>
            <div style="height: 500px;overflow:hidden">
                <div class="list" v-for="(item,index) in list" :key="index">
                    <router-link
                            :to="{path:'/selfCenter/makeQuestion',query:{id:item.teacherId,name:item.teacherName}}">
                        <div class="list-img">
                            <div><img :onerror="onerrImg" :src="item.teacherIcon"/></div>
                            <div class="cover">向Ta提问</div>
                        </div>
                    </router-link>
                    <ul style="max-width: 124px;overflow: hidden">
                        <li><span class="teacher">{{item.teacherName}}</span><span class="red">{{item.levelStatus==1?'名师':'老师'}}</span></li>
                        <li>{{item.types | stage}}<span class="shu">|</span>{{item.subject | subject}}</li>
                        <li> 答题数 ：{{item.answerNum}}</li>
                    </ul>

                </div>

            </div>
        </div>

    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null
    import api from "./api"

    export default {
        data() {
            return {
                onerrImg: 'this.src="' + require('../../assets/images/man.png') + '"',
                list: [],
                listarr: [],//暂存数组
                levelStatus:'',
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
                this.teacherList = {
                    url: api.selectTeacher.path,
                    params: {
                        curPage: 1,
                        pageSize: 5,
                        name: ''
                    },
                },
                    this.getlist();
            },
            getlist(isLoading) {

                this.ajax({
                    ajaxSuccess: 'teacherdetail',
                    ajaxParams: this.teacherList,
                }, isLoading)
            },
            teacherdetail(res) {
                let _this = this
                res.data.dataList.map(function(item) {
                    if(item.teacherIcon) {
                        item.teacherIcon = _this.getStaticPath(item.teacherIcon);
                    } else {
                        item.teacherIcon = '';
                    }
                    return item
                })
                this.listarr = [];
                for(var i = 0; i < res.data.dataList.length; i++) {
                    if(res.data.dataList[i].levelStatus == 1) {
                        this.listarr.push(res.data.dataList[i])
                    }
                }
                for(var i = 0; i < res.data.dataList.length; i++) {
                    if(res.data.dataList[i].levelStatus == 0) {
                        this.listarr.push(res.data.dataList[i])
                    }
                }

                this.list = this.listarr;
            },

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
    .questionToteacher-root {
        float: right;
        .right {
            width: 230px;
            height: 570px;
            border-radius: 5px;
            background: #fff;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            overflow: hidden;

            h1 {
                width: 230px;
                height: 40px;
                background-color: #11a63f;
                color: #fff;
                font-size: 16px;
                padding-left: 20px;
                line-height: 40px;
            }
            .list {
                height: 100px;
                padding: 13px;
                .list-img {
                    cursor: pointer;
                    width: 80px;
                    height: 80px;
                    border-radius: 100%;
                    float: left;
                    position: relative;
                    overflow: hidden;
                    img {
                        width: 80px;
                        height: 80px;

                        border-radius: 100%;
                    }
                    .cover {
                        position: absolute;
                        top: 0;
                        left: 0;
                        background: #313131;
                        opacity: 0.7;
                        width: 80px;
                        height: 80px;
                        border-radius: 100%;
                        color: #ffffff;
                        line-height: 80px;
                        text-align: center;
                        font-size: 12px;
                        visibility: hidden;
                    }
                }
                .list-img:hover .cover {
                    visibility: visible;
                }

                ul {
                    float: left;
                    li {
                        margin-left: 10px;
                        font-size: 12px;
                        line-height: 24px;
                        .teacher {
                            font-size: 14px;
                            font-weight: bold;
                            display: inline-block;
                            max-width: 85px;
                            line-height: 24px;
                            overflow: hidden;
                        }
                        .red {
                            display: inline-block;
                            color: #fc4341;
                            margin-left: 5px;
                            position: relative;
                            top: -6px;
                        }
                        .shu {
                            padding: 0 5px;
                            color: #ccc;
                        }
                    }
                }
            }
        }
    }
</style>
