<!--
****--@file     commond.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  推荐购买
-->
<template>
    <div class="selfShopcar-root clearfix">
        <h1>相关推荐</h1>
        <div class="Recommend shopList" v-for="(item,index) in queryHotList" :key="index">
            <div class="img">
                <img :src="resourceHttp + item.icon" onerror="javascript:this.src='/sasstudent/img/53.png'"
                     width="140" alt="">
            </div>
            <ul class="ul">
                <li class="tag">{{item.title}}</li>
                <li> 类别 : {{item.types | goodType }} </li>
                <li>规格:{{item.spec}}{{item.unit | unit}}</li>
                <li v-if="item.productTypes==0" class="price-item">{{item.currentPrice | money}}</li>
                <li class="price-item" v-else>{{item.currentPrice}}积分</li>
                <li>出版社:{{item.press}}</li>
            </ul>
            <p style="float: left;width: 160px;font-size: 12px;margin-top: 10px;text-align: center">
                <span class="num">{{item.sales}}人已购买</span>
                <!--<span class="shu">|</span> {{item.content}}条评价</span>-->
            </p>
        </div>
    </div>
</template>
<script>
    let Util;
    export default {
        data() {
            return {
                resourceHttp: '',
                queryHotList: [],
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                Util = this.$util;
                this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
                this.ajax({
                    ajaxSuccess: res => {
                        this.queryHotList = res.data.dataList
                    },
                    ajaxParams: {
                        url: '/product/recommend',
                        params: {
                            orderId: this.$route.query.id,
                            curPage: 1, pageSize: 9
                        }
                    }
                })
            }
        },
        components: {},
    }
</script>
<style lang="scss">
    @import "../css/selfShopcar.scss";

    .selfShopcar-root {
        .shopList {
            .price-item {
                font-size: 14px;
                color: #ef3f3f;
            }
        }

    }
</style>