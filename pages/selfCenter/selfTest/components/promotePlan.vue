<!--
****--@file     promotePlan
****--@date     2017/12/13 下午5:35
****--@author   jhd
****--@describe   提分方案
-->
<template>
    <div class="promote-plan">
        <template v-if="goodList instanceof Array">
            <p class="promote-plan-p">
                {{ advise }}
            </p>
            <div class="isNull" v-if="goodList.length == 0">
                <img src="../../../../assets/images/isnull.png" alt="">
                <p>暂无相关推荐</p>
            </div>
            <ul class="clearfix promote-plan-ul" v-else>
                <li class="promote-plan-item" v-for="(item,index) in goodList" :key="index">
                    <router-link target="_blank" :to="{path:'/questionBankDetail',query:{name:item.id}}">
                        <dl>
                            <dt>
                                <img :src="resourceHttp + item.icon"
                                     onerror="javascript:this.src='/sasstudent/img/53.png'"/>
                            </dt>
                            <dd>
                                <p class="price" v-if="item.productTypes == 0">
                                    {{item.currentPrice | money}}
                                </p>
                                <p class="price" v-else>
                                    {{item.currentPrice | isNullStr }}积分
                                </p>
                                <p class="item-title">{{item.title}}</p>
                                <p class="item-unit">试卷{{item.spec | isNullStr }}{{item.unit | unit }}</p>
                            </dd>
                        </dl>
                    </router-link>
                </li>
            </ul>
            <div class="pagination" v-if="goodList.length > 0">
                <div style="text-align: center">
                    <el-pagination
                            @size-change="changePageSize"
                            @current-change="changePage"
                            :current-page.sync="myPages.currentPage"
                            :page-size="myPages.pageSize"
                            layout="total,prev, pager, next, jumper"
                            :total="totalCount">
                    </el-pagination>
                </div>
            </div>

        </template>
        <template v-else>
            <p class="errMsg">
                <span class="el-icon-loading"></span>
                数据加载中
            </p>
        </template>
    </div>
</template>
<script>
	/*当前组件必要引入*/
	let Util = null
	export default {
        props: ['advise'],
		data (){
            return {
                goodList: null,
                resourceHttp: '',
            }
		},
		methods:{
			//初始化请求列表数据
            init() {
                Util = this.$util;
                if(!this.$store.getters['app/isLogin']) {
                    let opt = {
                        ajaxSuccess: res => {
                            this.$store.commit('app/initEnvs', res.data);
                            this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
                            this.myPages = Util.pageInitPrams
                            this.queryQptions = {
                                url: '/product/assessmentRecommend',
                              params: {curPage: 1, pageSize: 12}
                            }
                            this.setTableData()
                        },
                        ajaxParams: {
                            url: '/envs'
                        }
                    };
                    this.ajax(opt)
                } else {
                    this.resourceHttp = this.$store.getters['app/envs']('resourceHttp');
                    this.myPages = Util.pageInitPrams
                    this.queryQptions = {
                        url: '/product/assessmentRecommend',
                      params: {curPage: 1, pageSize: 12}
                    }
                    this.setTableData()
                }
            },
            /*
            * 设置表格数据
            * @param isLoading Boolean 是否加载
            */
            setTableData(isLoading) {
                Object.assign(this.queryQptions.params, {assessmentId: this.$route.params.id});
                this.ajax({
                    ajaxSuccess: 'listDataSuccess',
                    ajaxParams: this.queryQptions
                }, isLoading)
            },
            listDataSuccess(res) {
                this.goodList = res.data.dataList;
                this.totalCount = res.data.totalCount
            },

        },
		created (){
			this.init();
		},
		mounted (){
		},
		components:{}
	}

</script>
<style lang="scss">
    .promote-plan{
        padding: 30px 30px;
        .promote-plan-p{
            font-size: 14px;
            height: 56px;
            line-height: 3.14;
            text-align: center;
            color: #434343;
        }
        .promote-plan-item:nth-child(4){
            margin-right: 0;
        }
        .promote-plan-item:nth-child(8){
            margin-right: 0;
        }
        .promote-plan-item{
            display: inline-block;
            text-align: center;
            width: 206px;
            cursor:pointer;
            margin: 0 16px 30px 0;
            dt{
                border:1px solid #f5f5f5;
                padding: 15px 0 10px 0;
                img{
                    width: 154px;
                    height: 183px;
                }
            }
            dd{
                line-height: 1.5;
                border:1px solid #f5f5f5;
                border-top: none;
                padding:10px 0;
                .price{
                    color: #fc4341;
                    font-size: 18px;
                }
                .item-title{
                    color: #434343;
                    font-size: 12px;
                }
                .item-unit{
                    font-size: 12px;
                    color: #ffffff;
                    display: inline-block;
                    padding:0 10px ;
                    border-radius: 3px;
                    background: #facd89;
                }
            }
        }
        .errMsg {
            line-height: 500px;
        }
        .isNull {
            min-height: 438px;
            img {
                margin-top: 120px;
            }
            p {
                text-align: center;
                font-size: 20px;
                line-height: 3;
            }
        }
    }
</style>
