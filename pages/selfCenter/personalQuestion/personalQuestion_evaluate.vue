<!--
****--@file     personalQuestion_evaluate
****--@date     2017/12/12 下午3:27
****--@author   jhd
****--@describe   评价
-->
<template>
    <div class="pspe-content">
        <template v-if="productData instanceof Object">
            <div class="img-wrap">
                <img :src="getStaticPath(productData.icon)" onerror="javascript:this.src='/sasstudent/img/53.png'"/>
            </div>
            <div class="tip-wrap">
                <p class="name">{{productData.title}}</p>
                <p class="price" v-if="productData.productTypes != '1'">价格：<span> {{productData.currentPrice | money
                    }}</span></p>
                <p class="price" v-else>价格：<span> {{productData.currentPrice }}积分</span></p>
                <p class="unit">试卷：{{productData.spec}}</p>
            </div>
            <div class="block">
                <el-form :rules="rules" ref="formValidate" :model="formValidate">
                    <el-form-item label="分值:" prop="score">
                        <el-rate v-model="formValidate.score"></el-rate>
                    </el-form-item>
                    <el-form-item label="评价：" prop="comment">
                        <el-input type="textarea" v-model="formValidate.comment" :rows="4"
                                  placeholder="请输入内容"></el-input>
                    </el-form-item>
                </el-form>

            </div>
            <p style="text-align: center;margin-top: 20px">
                <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
            </p>
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
    import api from './api'
    import {evaluate as rules} from './rules'
	export default {
        props: ['productId', 'productData'],
		data (){
			return {
                rules,
                value1:null,
                formValidate: {
                    productId: this.productId,
                    score: 0,
                    result: '',
                    comment: '',
                    types: this.productData.productTypes
                },
				loadBtn: {title: "提交", callParEvent: "listenSubEvent"},
                addMessTitle: {
                    type: 'add',
                    callback: 'evaluate',
                    successTitle: '评论成功!',
                    errorTitle: '评论失败!',
                    ajaxSuccess: 'ajaxSuccess',
                    ajaxError: 'ajaxError',
                    ajaxParams: {
                        url: api.commentAdd.path,
                        method: api.commentAdd.method,
                    }
                },
			}
		},
		methods:{
			//初始化请求列表数据
			init (){
				Util = this.$util
			},
            /*
            * 点击提交按钮 监听是否提交数据
            * @param isLoadingFun boolean  form表单验证是否通过
            * */
            listenSubEvent(isLoadingFun) {
                let isSubmit = this.submitForm("formValidate");
                if(isSubmit) {
                    if(!isLoadingFun) isLoadingFun = function() {
                    };
                    isLoadingFun(true);
                    if(this.formValidate.score == 0) {
                        this.errorMess('请给该商品打分！');
                        isLoadingFun(false);
                        return false
                    }
                    ;
                    this.formValidate.score < 2 ? this.formValidate.result = 'negative' : this.formValidate.score < 4 ? this.formValidate.result = 'moderate' : this.formValidate.result = 'positive'
                    this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
                    this.ajax(this.addMessTitle, isLoadingFun)
                }
            },
            /*
            * 获取表单数据
            * @return string  格式:id=0&name=aa
            * */
            getFormData(data) {
                let myData = Util._.defaultsDeep({}, data);
                return myData;
            },
            /*
            * 点击提交按钮 监听是否验证通过
            * @param formName string  form表单v-model数据对象名称
            * @return flag boolean   form表单验证是否通过
            * */
            submitForm(formName) {
                let flag = false;
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        flag = true;
                    }
                });
                return flag;
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
    .pspe-content{
        .errMsg {
            line-height: 470px;
            text-align: center;
        }
        .img-wrap{
            margin:10px 10px 0 20px;
            width: 60px;
            height: 60px;
            border: solid 1px #cacaca;
            display: inline-block;
            img{
                width: 41px;
                height: 54px;
                margin: 3px 0 3px 10px;
            }
        }
        .tip-wrap{
            display: inline-block;
            .name{
                font-size: 14px;
                font-weight: 500;
                line-height: 30px;
            }
            .price{
                line-height: 22px;
                span{
                    color: red;
                    font-size: 17px;
                }
            }
        }
        .block{
            margin:15px 15px;
        }
        .el-rate{
            height: 50px;
        }
        .el-rate__icon{
            font-size: 46px;
        }
    }
</style>