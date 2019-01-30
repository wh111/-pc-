<!--
****--@file     selfAnsweringQuestion
****--@date     2017/12/15 上午10:54
****--@author   jhd
****--@describe   我的答疑
-->
<template>
    <div class="self-answering-auestion">
        <ul class="clearfix type" style="font-size: 14px">
            <li :class="Type == 1 ? 'active' : ''" @click="type('1')">我的提问</li>
            <li :class="Type == 2 ? 'active' : ''" @click="type('2')">我的回答</li>
            <router-link to="/selfCenter/makeQuestion">
                <el-button class="right whiteButton" style="border: none">我要提问</el-button>
            </router-link>
        </ul>

        <div v-if="Type == 1">
            <my-questions></my-questions>
        </div>
        <div v-if="Type == 2">
            <my-answer></my-answer>
        </div>
    </div>
</template>
<script>
	/*当前组件必要引入*/
	let Util = null
    import myQuestions from './components/myQuestions.vue'
    import myAnswer from './components/myAnswer.vue'
    import api from "./api"
	export default {
		data (){
			return {
                Type: 1,

            }
		},
		methods:{
			//初始化请求列表数据
			init (){
                Util = this.$util;

			},
			type(type){
				this.Type = type
            },

			
		},
		created (){
			this.init();
		},
		mounted (){
		},
		components:{
			myQuestions,
			myAnswer
        }
	}

</script>
<style lang="scss">
    .self-answering-auestion{
        width: 950px;
        background: #ffffff;
        .type{
            padding:40px 30px 0 30px;
            border-bottom: 2px solid #11a63f;
            li{
                width: 210px;
                float: left;
                cursor: pointer;
                background: #f5f5f5;
                text-align: center;
                line-height: 44px;
                color: #727272;
            }
            .active{
                background: #11a63f;
                color: #ffffff;
                border-radius: 3px 3px 0 0;
            }
        }
    }

    .my-questions .item .question-item-content .btn-wrap {
        height: 88px;
        padding-top: 33px !important;
    }
</style>