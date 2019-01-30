<!--
****--@file     shoppingCart
****--@date     2017/12/21 下午2:26
****--@author   jhd
****--@describe   购物车页面
-->
<template>
    <div class="shopping-cart-wrap">
        <head-top></head-top>
        <div class="shopping-cart">
            <div class="good clearfix">
                <div class="good-img-wrap left">
                    <img src="../../assets/images/53.png" width="160" height="180" alt="">
                </div>
                <div class="good-msg left">
                    <p class="name">
                        <span>中学地理知识地图册</span>
                        <span class="right cart">已经加入购物车</span>
                    </p>
                    <p class="other">试卷   50套</p>
                    <p class="price right">小计   ¥  99.00</p>
                    <p class="other">
                        <span>教育出版社</span>
                        <span>999 人已购买  |  999 人已评价</span>
                    </p>
                    <p class="btn-wrap right">
                        <el-button class="goback" icon="el-icon-arrow-left">返回详情</el-button>
                        <el-button class="addcar">去购物车结算</el-button>
                    </p>
                </div>
            </div>
            <div class="recommend">
                <p class="title">为你推荐</p>
                <ul class="clearfix good-ul">
                    <li class="good-item left" v-for="item in 15">
                        <div class="re-img-wrap">
                            <img src="../../assets/images/introduce.png" width="198" height="140" alt="">
                        </div>
                        <p class="name">数学方程式100道</p>
                        <p class="price">¥  99.99</p>
                    </li>
                </ul>
            </div>
        </div>
        <footer-buttom></footer-buttom>
    </div>
</template>
<script>
	/*当前组件必要引入*/
	import headTop from '../../components/common/headTop.vue'
	import footerButtom from '../../components/common/footer.vue'
	let Util = null
	export default {
		data (){
			return {}
		},
		methods:{
			//初始化请求列表数据
			init (){
				Util = this.$util
			}
			
		},
		created (){
			this.init();
		},
		mounted (){
		},
		components:{
			headTop,
			footerButtom,
		}
	}

</script>
<style lang="scss">
    .shopping-cart-wrap {
        background: #e5e5e5;
        .shopping-cart {
            width: 1200px;
            background: #ffffff;
            margin: 30px auto;
            padding: 29px;
            border-radius: 5px;
        }
        .good {
            position: relative;
        }
        .good-img-wrap {
            padding: 10px;
            border: 1px solid #e5e5e5;
        }
        .good-msg {
            width: 900px;
            margin-left: 20px;
            .name {
                font-size: 16px;
                line-height: 2;
                font-weight: bold;
                text-align: left;
                color: #313131;
                .cart {
                    font-size: 16px;
                    font-weight: normal;
                    text-align: left;
                    color: #313131;
                }
            }
            .price {
                font-size: 16px;
                margin-top: 30px;
                font-weight: bold;
                text-align: right;
                color: #ef3f3f;
            }
            .other {
                font-size: 14px;
                text-align: left;
                color: #b5b5b5;
                span {
                    margin-right: 50px;
                }
            }
            .btn-wrap {
                position: absolute;
                bottom: 0px;
                right: 40px;
                .goback {
                    border-radius: 3px;
                    color: #fd7416;
                    border: 1px solid #fd7416;
                    background-color: #ffffff;
                }
                .addcar {
                    border-radius: 3px;
                    color: #ffffff;
                    border: 1px solid #fd7416;
                    background-color: #fd7416;
                }
            }
        }
        .recommend {
            margin-top: 50px;
            .title {
                color: #313131;
                font-size: 26px;
                margin-bottom: 20px;
            }
        }
        .good-ul {
            border: 1px solid #e5e5e5;
            .good-item {
                width: 200px;
                height: 200px;
                font-size: 12px;
                margin: 15px 14px;
                /*border-radius: 4px;*/
                /*border: 1px solid #e5e5e5;*/
                p {
                    margin-left: 15px;
                    line-height: 25px;
                }
                .name {
                    color: #434343;
                }
                .price {
                    color: #ef3f3f;
                }
            }
        }
    }
</style>
