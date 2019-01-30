<!--
****--@file     orderList
****--@date     2017/12/28 下午6:07
****--@author   jhd
****--@describe   购买过的商品
-->
<template>
    <div class="orderList">
        <div class="shopList" v-for="(item,index) in productList" :key="index">
            <p class="title">商品信息</p>
            <div class="shop">
                <div class="img"><img :src="getStaticPath(item.icon)"
                                      onerror="javascript:this.src='/sasstudent/img/53.png'"/> 　　
                </div>
                <ul>
                    <li class="tag">{{item.title}}</li>
                    <li>试卷 <span>{{item.spec}}</span></li>
                    <li>{{item.press}}</li>
                </ul>
                <dl>
                    <dt><span class="close">￥ {{item.currentPrice}}</span></dt>

                </dl>
            </div>

        </div>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    let Util = null;
    export default {
        props: ['orderList'],
        data() {
            return {
                loadBtn: {title: "前往支付", callParEvent: "listenSubEvent"},
                productList: this.orderList
            }
        },
        methods: {
            //初始化请求列表数据
            init() {
                Util = this.$util;
            },
            listenSubEvent() {

            },
            cancel() {
                this.$emit('cancel', 'order')
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
    .orderList {
        .shopList {
            width: 680px;
            height: 180px;
            border: 1px solid #efefef;
            overflow: hidden;
            margin-left: 30px;
            margin-top: 16px;
            .title {
                height: 39px;
                background-color: #efefef;
                border-bottom: solid 1px #e5e5e5;
                font-size: 12px;
                color: #727272;
                padding-left: 18px;
                line-height: 39px;
                span {
                    float: right;
                    margin-right: 30px;
                    color: #ef3f3f;;
                }

            }
            .shop {
                height: 140px;
                background: #fff;
                .img {
                    float: left;
                    width: 80px;
                    margin: 30px;
                    border: solid 1px #e5e5e5;
                    overflow: hidden;
                    img {
                        width: 80px;
                        height: 80px;
                    }
                }
                ul {
                    float: left;
                    margin-top: 26px;
                    li {
                        color: #b5b5b5;
                        font-size: 12px;
                        line-height: 24px;
                        .num {
                            margin-left: 233px;
                            .shu {
                                padding: 0 5px;
                            }
                        }
                    }
                    .tag {
                        font-size: 14px;
                        color: #434343;
                    }

                }
                dl {
                    float: right;
                    margin-right: 55px;
                    text-align: center;
                    margin-top: 37px;
                    width: 120px;
                    dt {
                        color: #ef3f3f;
                        font-size: 14px;
                        font-weight: bold;

                    }
                    dd {
                        color: #fd7416;
                    }
                    .close {
                        color: #434343;
                        font-weight: normal;
                    }
                    button {
                        margin-top: 10px;
                        font-size: 14px;
                        color: #ffffff;
                        width: 120px;
                        height: 40px;
                        background-color: #fd7416;
                        border: none;
                        text-align: center;
                        line-height: 40px;
                        border-radius: 5px;
                    }

                }
            }

        }
    }
</style>
