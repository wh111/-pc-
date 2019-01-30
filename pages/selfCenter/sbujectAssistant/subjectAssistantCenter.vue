<!--
****--@file     subjectAssistantCenter.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  学科助手动态及入口
-->
<template>
    <div>
        <head-top></head-top>
        <div class="subjectAssistant-root-base">

            <div class="subjectAssistant-root subjectAssistant-root-top  " v-if="login==2">
                <h1>竞赛动态</h1>
                <template v-if="gamesNewsList!=0">
                    <div class="p" v-for="(item,index) in gamesNewsList">
                        <div></div>
                        <span class="name">{{item.content}}</span>
                    </div>
                </template>
                <div v-else style="text-align: center;font-size: 20px;line-height: 100px">
                    <strong>无动态</strong>
                </div>
                <!--<div class="p">-->
                <!--<div style="background: yellow"></div>-->
                <!--<span class="name">李娇里</span> <span class="time">12:02</span>完成了刷题大赛，在此次比赛中获得第一名。-->
                <!--</div>-->
            </div>
            <div class="subjectAssistant-root subjectAssistant-root-bottom " v-if="login==2">

                <img src="../../../assets/images/insertpic.png"/>
                <div class="into">
                    <div class="introduce">
                        这里是竞赛中心，汇聚了一大批学渣、学霸、学圣，想要和他们一决高下吗？报名参加竞赛中心，与全国的小朋友们一起进行刷题大赛，看看谁答对的题目更多，谁的学习能力更强呢
                    </div>
                    <router-link to="/selfCenter/competionCenter">
                        <button>点击进入</button>
                    </router-link>
                </div>
            </div>

        </div>
        <footerr></footerr>
    </div>
</template>
<script>
	import headTop from '../../../components/common/headTop.vue'
	import footerr from '../../../components/common/footer.vue'
	import api from './api'

	export default {
		data() {
			return {
				login: 2,
				gamesNewsList: [],//获取到的竞赛动态列表
			}
		},
		components: {
			headTop,
			footerr,
		},
		methods: {
			//初始化数据
			init() {
				this.myPages = this.$util.pageInitPrams;
				this.queryQptions = {
					url: api.news.path,
					params: {curPage: 1, pageSize: 5},//只取五条
				}
				this.gamesNews();
			},
			//获取到的竞赛动态列表
			gamesNews() {
				this.ajax({
					ajaxSuccess: res => {
                        let data = res.data.dataList;
						if (!data) return;
						this.gamesNewsList = data;
					},
					ajaxParams: {
						url: api.news.path,
						params: {
							curPage: 1,
							pageSize: 5, //取5条
						}
					}
				})
			},
		},
		created() {
			this.init()
		},
	}

</script>
<style lang="scss">
    .subjectAssistant-root-base {
        margin: 0 auto;
        background: #efefef;
        padding: 20px 0px;

    }

    button {
        cursor: pointer;
    }

    .subjectAssistant-root {
        min-height: 720px;
        width: 1190px;
        border-radius: 5px;
        background-color: #ffffff;
        padding: 30px;
        margin: 0 auto;
        h1 {
            font-size: 26px;
        }
        .introduce {
            width: 481px;
            height: 60px;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: -0px;
            text-align: left;
            color: #333333;
        }
        button {
            width: 110px;
            height: 40px;
            background-color: #11a63f;
            /*font-family: DFWaWaSC-W5;*/
            font-size: 20px;
            letter-spacing: -0.3px;
            text-align: left;
            color: #ffffff;
            text-align: center;
            line-height: 40px;
            border: none;
            border-top-left-radius: 10px;
            border-bottom-right-radius: 10px
        }
        .into {
            width: 481px;
            float: right;

            margin-top: -10px;
            margin-top: -65px;
            button {
                float: right;
                margin-top: 10px;
            }
        }
        .p {
            font-size: 14px;
            line-height: 30px;
            div {
                width: 8px;
                background: #1cc03b;

                overflow: hidden;
                height: 8px;
                border-radius: 100%;
                float: left;
                margin-top: 11px;
            }
            .name {
                font-weight: bold;

                padding: 0 10px;
            }
            .time {
                color: #1cc03b;
                padding-right: 5px;
            }

        }
    }

    .subjectAssistant-root-top {
        height: 256px;
        min-height: 256px;
    }

    .subjectAssistant-root-bottom {
        height: 400px;
        min-height: 400px;
        margin-top: 20px;
    }

</style>
