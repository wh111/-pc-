<!--
****--@file     slefData.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  个人资料
-->

<template>
    <div class="selfData-root">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="基本资料" name="first">
                <el-upload
                        class="avatar-uploader  base-change"
                        :show-file-list="false"
                        action="/api/stu/file/uploadImg"
                        :data="formImg"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <div class="showdow">修改头像</div>

                    <img :src="ruleForm.icon" :onerror="onerrImg" class="avatar">
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                </el-upload>
                <div style="clear: both"></div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="base-introduce">
                    <el-form-item label="账号" prop="account">
                        <el-input disabled="disabled" v-model="ruleForm.account" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称" prop="nickname">
                        <el-input v-model="ruleForm.nickname" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="name">
                        <el-input v-model="ruleForm.name" style="width: 180px"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-checkbox-group v-model="ruleForm.sex">
                            <div style="float: left" @click="selectsex(0)">
                                <img v-if="slectSex!=0" src="../../../assets/images/selfdata (2).gif"/>
                                <img v-if="slectSex==0" src="../../../assets/images/selfdata (4).gif"/>
                            </div>
                            <span style="float: left;font-size: 14px;padding: 0px 10px;">男</span>
                            <div style="float: left" @click="selectsex(1)">
                                <img v-if="slectSex!=1" src="../../../assets/images/selfdata (3).gif"/><img
                                    v-if="slectSex==1"
                                    src="../../../assets/images/selfdata (5).gif"/>
                            </div>
                            <span style="float: left;width: 20px;color: #434343;font-size: 14px;padding: 0px 10px;">女</span>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="生日" prop="birth">
                        <div class="block" style="float: left">

                            <el-date-picker
                                    v-model="day"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions0">
                            </el-date-picker>
                            <!--<span class="demonstration">日</span>-->
                        </div>

                    </el-form-item>

                    <el-form-item label="年级" prop="grade">
                        <el-select @change="selectGrade" v-model="ruleForm.grade" placeholder="请选择"
                                   style="width: 130px">
                            <el-option
                                    v-for="item in 12"
                                    :key="item"
                                    :label="item | grade(self)"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学制" prop="length">
                        <el-radio v-model="ruleForm.length" :label="0">六三制（6年小学，3年中学）</el-radio>
                        <br/>
                        <el-radio v-model="ruleForm.length" :label="1">五四制（5年小学，4年中学）</el-radio>
                    </el-form-item>
                    <el-form-item label="教材" prop="textbookVersionNewList">
                        <div class="selectBookword" @click="selectBookClick(index,item.code)"
                             v-for="(item,index) in bookBtn"
                             :key="index">
                            <div class="selectBook" style="background: none;line-height: 30px">
                                <p v-for="(item1,index) in textbookVersionList" :key="index">
                                    <el-tooltip class="item" effect="dark" :content="item1.textbookVersionName"
                                                placement="top">
                                        <span v-if="item.code==item1.subject" class="activeBook">{{item1.textbookVersionName}}</span>
                                    </el-tooltip>
                                </p>

                            </div>
                            <p>{{item.value}}</p>
                        </div>
                        <div style="clear: both"></div>
                    </el-form-item>

                    <el-form-item label="所属市区" prop="position">
                        <select-place class="selfDataSelectplace" :province="province" :city="city"
                                      :area="area" @selected="selected"></select-place>
                    </el-form-item>
                    <el-form-item label="学校" prop="school">
                        <el-input v-model="ruleForm.school" style="width:350px;"></el-input>
                    </el-form-item>


                </el-form>
                <el-form>
                    <el-button type="primary" class="greenButton" @click="deserve('ruleForm')">保存</el-button>

                </el-form>

            </el-tab-pane>
            <el-tab-pane label="账户安全" name="second">

                <div class="safeAccount" v-if="passwordTochange==1">
                    <div class="na">账号</div>
                    <span>{{ruleForm.account}}</span><br>
                    <div class="p">
                        <div class="na">密码</div>
                        <span>**********</span>
                        <button class="change whiteButton" @click="changPassword">修改</button>
                    </div>

                    <div class="p">
                        <div class="na">手机号</div>
                        <span v-if="ruleForm.mobile">{{ruleForm.mobile}}</span>
                        <span v-if="!ruleForm.mobile">未绑定</span>
                        <button class="change relative orangeYellow" @click="changTel" v-if="!ruleForm.mobile">绑定
                        </button>
                        <button class="change  whiteButton" @click="changTel" v-if="ruleForm.mobile">修改</button>
                    </div>
                    <div class="p">
                        <div class="na">微信号</div>
                        <span v-if="ruleForm.wechat==0">未绑定</span><span
                            v-if="ruleForm.wechat==1">已绑定</span>
                        <button class="change relative orangeYellow" v-if="ruleForm.wechat==0" @click="linkWechat">绑定</button>
                    </div>
                    <!--<div class="p pBottom">-->
                    <!--<div class="na">QQ号</div>-->
                    <!--<span v-if="ruleForm.qq">{{ruleForm.qq}}</span><span-->
                    <!--v-if="!ruleForm.qq">未绑定</span>-->
                    <!--<button class="change relative orangeYellow" v-if="!ruleForm.qq" @click="linkqq">绑定</button>-->
                    <!--&lt;!&ndash;<button class="change relative" v-if="!alreadyLinkqq" @click="linkqq">绑定</button>&ndash;&gt;-->
                    <!--&lt;!&ndash;<button class="change" v-if="alreadyLinkqq" @click="unlinkqq">解绑</button>&ndash;&gt;-->
                    <!--</div>-->
                </div>
                <div v-if="passwordTochange==2">
                    <el-form style="text-align: left" :model="ruleFormSafe" ref="ruleFormSafe" label-width="100px"
                             class="base-ruleFormSafe">
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input type="password" v-model="ruleFormSafe.oldPassword"
                                      style="width: 180px" placeholder="请输入原密码"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input type="password" v-model="ruleFormSafe.newPassword"
                                      style="width: 180px" placeholder="请输入新密码"></el-input>
                        </el-form-item>
                        <el-form-item label="再次输入" prop="pardonInput">
                            <el-input type="password" v-model="ruleFormSafe.pardonInput"
                                      style="width: 180px"  placeholder="请再次输入密码"></el-input>
                        </el-form-item>
                    </el-form>
                    <div style="text-align: center">
                        <button class="submit-deserve greenButton" @click="surePassword">确认</button>
                        <button class="submit-deserve" @click="sureTelCancel">取消</button>
                    </div>

                </div>
                <!--修改手机-->
                <div v-if="passwordTochange==3">
                    <el-form style="text-align: left" :model="ruleFormTel" ref="ruleFormTel" label-width="100px"
                             class="base-ruleFormSafe">
                        <el-form-item label="手机号码" prop="password">
                            <el-input v-model="ruleFormTel.mobile" style="width: 180px" placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码" prop="newPassword">
                            <el-input type="password" v-model="ruleFormTel.word" style="width: 180px"
                                      placeholder="6位数字"></el-input>
                            <div @click="accessKey1" v-if="!sendKeySuccess" class="accessWord orangeYellow">
                                获取验证码
                            </div>
                            <div v-if="sendKeySuccess" class="accessWord orangeYellow">
                                已发送<span style="padding-left:5px">{{timesend}}</span>s
                            </div>

                        </el-form-item>

                    </el-form>
                    <div style="text-align: center">
                        <button class="submit-deserve greenButton" @click="sureTel">确认</button>
                        <button class="submit-deserve" @click="sureTelCancel">取消</button>
                    </div>
                </div>
                <div v-if="passwordTochange==4">
                    <i class="el-icon-close" style="float: right" @click="passwordTochange=1"></i>
                    <h1 class="wechatLogin">微信登录</h1>
                    　　<img src="../../../assets/images/ewm.png"/>
                    <p> 请使用微信扫描二维码登录</p>

                </div>
                <!--<div v-if="passwordTochange==5">-->
                <!--<el-form style="text-align: left" :model="ruleFormTel" ref="ruleFormTel" label-width="100px"-->
                <!--class="base-ruleFormSafe">-->
                <!--<el-form-item label="QQ号码">-->
                <!--<el-input v-model="ruleFormTel.mobile" style="width: 180px"  placeholder="请输入QQ号码"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="QQ密码" >-->
                <!--<el-input type="password" v-model="ruleFormTel.word" style="width: 180px"-->
                <!--placeholder="请输入QQ密码"></el-input>-->
                <!--<div v-if="sendKeySuccess" class="accessWord orangeYellow">-->
                <!--已发送<span style="padding-left:5px">{{timesend}}</span>s-->
                <!--</div>-->

                <!--</el-form-item>-->

                <!--</el-form>-->
                <!--<div style="text-align: center">-->
                <!--<button class="submit-deserve greenButton" @click="sureTel">确认</button>-->
                <!--<button class="submit-deserve  greenButton" @click="sureTelCancel">取消</button>-->
                <!--</div>-->
                <!--</div>-->
            </el-tab-pane>

        </el-tabs>
        <Modal
                :mask-closable="false"
                width="360"
                title="选择书籍"
                v-model="selectBook"
                class-name="selectBook-con" :loading="loading">
            <modal-header slot="header" :content="evaluateId"></modal-header>
            <selectBook :subject="subject" @imgSrc="imgSrc" v-if="selectBook"></selectBook>
        </Modal>
        <Modal
                :mask-closable="false"
                width="360"
                title="密码修改"
                v-model="passwordChange"
                class-name="selectBook-con sureChange" :loading="loading">
            <modal-header slot="header" :content="passwordChangeId"></modal-header>
            <passwordChange v-if="passwordChange"></passwordChange>
        </Modal>
        <Modal
                :mask-closable="false"
                width="360"
                title="电话修改"
                v-model="telChange"
                class-name="selectBook-con sureChange" :loading="loading">
            <modal-header slot="header" :content="telChangeId"></modal-header>

            <telChange v-if="telChange" :content1="content1"></telChange>
        </Modal>

    </div>

</template>
<script>

    import selectBook from './components/selectBook.vue'
    import telChange from './components/telChange.vue'
    import passwordChange from './components/passwordChange.vue'
    import selectPlace from '../../../components/common/distpicker/index.vue'
    import {makeQuestion as rules} from './rules'
    //import
    import api from './api'

    let Util = null
    export default {
        data() {
            return {
                self: this,
                imgsrcdetail: '',
                onerrImg: '',
                gradeList: [],
                formImg: {},
                imageUrl: '',
                timesend: 60,
                sendKeySuccess: false,
                rules,
                activeName: 'first',
                slectSex: 0,
                selectBook: false,
                selectBookSrc: '',
                passwordTochange: 1,
                loading: false,
                passwordChange: false,
                telChange: false,
                evaluateId: {
                    id: 'selectBook-con',
                    title: '',
                },
                telChangeId: {
                    id: 'telChangeId',
                    title: '',
                },
                passwordChangeId: {
                    id: 'passwordChangeId',
                    title: '',
                },
                bookBtn: [],
                ruleForm: {
                    account: '',
                    nickname: '',
                    name: '',
                    sex: 1,
                    year: '',
                    month: '',
                    day: '',
                    grade: '',
                    len: '',
                    school: '',
                    county: '',
                    id: '',
                    qq: '',


                },
                ruleFormSafe: {
                    oldPassword: '',
                    newPassword: '',
                    pardonInput: '',
                },
                ruleFormTel: {
                    mobile: '',
                    word: '',
                    stuPassword:'',
                },
                formValidate: {},
                selectDiv: '',
                alreadyLinkqq: false,
                alreadyLinkWechat: false,
                wechatLink: '未绑定',
                qqLink: '12345678',
                imgList: [],
                imgsrcList: [],
                day: '',
                province: '',
                city: '',
                area: '',
                textbookVersionList: [],
                myId: '',
                subject: '',
                imgpath: '',
                numoftype: '',
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                },
                content1: ''
            }
        },
        created() {

          if (this.$route.query.code) {
            this.wxOauth(this.$route.query.code, this.$route.query.state)
          } else {
            this.init()
          }

        },
        mounted() {
        },
        methods: {
          wxOauth (code, state) {
            let opt = {
              ajaxParams: {
                url: api.wxOauth.path,
                method: api.wxOauth.method,
                params: {code, state}
              },
              ajaxSuccess: res => {
                this.successMess('微信绑定成功')
                this.ruleForm.wechat = true
              },
            }
            this.ajax(opt)
          },
            //选择市区
            selected(res) {
                this.area = res.area.value;
                this.city = res.city.value;
                this.province = res.province.value;
            },

            //选择班级
            selectGrade(i) {
                this.bookBtn = this.$store.state.app.envs.gradeMap[i]
                //  this.bookBtn = JSON.parse(localStorage.getItem('gradeMap'))[i]

            },
            //上传图片
            handleAvatarSuccess(res, file) {

                this.ruleForm.icon = URL.createObjectURL(file.raw);

                //this.ruleForm.icon = this.getStaticPath(res.data.dataList);
                this.imgsrcdetail = res.data;
                // this.ruleForm.icon=res.data.dataList;
            },
            beforeAvatarUpload(file) {
                this.formImg = {file: file, mini: false}

                const isLt2M = file.size / 1024 / 1024 < 10;
                if(!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!');
                }
                return isLt2M;
            },
            init() {
                Util = this.$util;
                // this.gradeList=this.$store.getters['app/envs']('gradeList')||[];
                this.ajax({//获取个人信息
                    ajaxSuccess: this.RightSend,
                    ajaxParams: {
                        url: api.getMyInfo.path,
                        params: {},
                    },
                })

            },

            RightSend(res) {

                this.ruleForm = res.data;
              if (!this.ruleForm.sex) {
                this.ruleForm.sex = 0
              }
                if(this.ruleForm.grade == null) {
                    this.ruleForm.grade = 1;
                }
                this.ruleForm.len = res.data.length;
                this.imgsrcdetail = this.ruleForm.icon;
                this.ruleForm.icon = this.getStaticPath(this.ruleForm.icon);
                this.slectSex = this.ruleForm.sex;
                if(res.data.birth) {
                    var date = this.conductDate(res.data.birth).split('-');
                    this.day = date[0] + '-' + date[1] + '-' + date[2];
                }
                this.bookBtn = this.$store.state.app.envs.gradeMap[res.data.grade];
                this.province = this.ruleForm.province;
                this.city = this.ruleForm.town;
                this.area = this.ruleForm.county;
                this.textbookVersionList = res.data.textbookVersionList;
                //初始化我的书本列表
                this.ruleForm.textbookVersionNewList = [];
                for(var i = 0; i < this.textbookVersionList.length; i++) {
                    var m = {};
                    m.textbookVersionId = this.textbookVersionList[i].textbookVersionId;
                    m.subject = this.textbookVersionList[i].subject;
                    this.ruleForm.textbookVersionNewList.push(m)
                }
                this.myId = res.data.id;
                if(this.$store.state.user.info.sex == 1) {//照片替换
                    this.onerrImg = 'this.src="' + require('../../../assets/images/woman.png') + '"'

                } else {
                    this.onerrImg = 'this.src="' + require('../../../assets/images/man.png') + '"'
                }
            },//请求图片列表
            reqImgList(i) {
                this.ajax({
                    ajaxSuccess: this.getListimgsuccess,
                    ajaxParams: {
                        // baseURL: "MANAGER",
                        url: api.getBooklist.path,
                        method: api.getBooklist.method,
                        params: {
                            id: i
                        },
                    },
                })
            },

            getListimgsuccess() {
                // this.imgsrcList.push()

            },
            linkWechat() {
              let {host, protocol, pathname} = window.location
              let urlParams = {
                appid: 'wxf77a6ddae54a7eda',
                redirect_uri: encodeURI(protocol + '//' + host + pathname),
                response_type: 'code',
                scope: 'snsapi_login',
                state: 'wx'
              }
              let url = 'https://open.weixin.qq.com/connect/qrconnect?' + Object.keys(urlParams).map(key => `${key}=${urlParams[key]}`).join('&')
              window.location.href = url
            },
            unlinkWechat() {
                this.alreadyLinkWechat = false
            },
            unlinkqq() {
                this.alreadyLinkqq = false
            },
            linkqq () {
                // this.alreadyLinkqq = true;
                this.passwordTochange = 5
            },
            handleClick(tab, event) {
                this.passwordTochange = 1;
                this.ruleFormSafe = {
                    oldPassword: '',
                    newPassword: '',
                    pardonInput: '',
                };
                this.ruleFormTel = {
                    mobile: '',
                    word: '',
                    stuPassword:'',
                };
            },
            selectsex(index) {

                this.ruleForm.sex = index;


                this.slectSex = index
            },
            selectBookClick(index, mm) {
                this.selectDiv = index
                this.selectBook = true;
                this.subject = mm;
            },
            imgSrc(src, subject) {
                var oDiv = document.getElementsByClassName('selectBook')
                oDiv[this.selectDiv].innerHTML = src.name;
                oDiv[this.selectDiv].style.border = " 1px solid #11A63F";
                oDiv[this.selectDiv].style.overflow = 'hidden';
                oDiv[this.selectDiv].style.textOverflow = 'ellipsis';
                oDiv[this.selectDiv].style.whiteSpace = 'nowrap';
                var obj = {
                    textbookVersionId: src.id,
                    subject: subject,
                };
                if(this.ruleForm.textbookVersionNewList.length > 0){
                  var isHave = 0;
                  this.ruleForm.textbookVersionNewList.map((item)=>{
                    if(item.subject == obj.subject){
                        item.textbookVersionId = obj.textbookVersionId;
                    }else{
                      isHave ++;
                    }
                  });
                  if(isHave >= this.ruleForm.textbookVersionNewList.length){
                    this.ruleForm.textbookVersionNewList.push(obj);
                  }
                }else{
                  this.ruleForm.textbookVersionNewList.push(obj);
                }

                this.selectBookSrc = src;
                this.selectBook = false;
            },
            changPassword() {
                this.passwordTochange = 2
            },
            changTel() {
                this.passwordTochange = 3
            },
            surePasswordCancle() {
                this.passwordTochange = 1
            },
            surePassword() {
                if(this.ruleFormSafe.newPassword !== this.ruleFormSafe.pardonInput) {
                    this.$message({
                        showClose: true,
                        message: '两次密码输入不一致',
                        type: 'error'
                    });
                } else {
                    this.ajax({
                        ajaxSuccess: this.changePassword,
                        error: () => {
                        },
                        ajaxParams: {
                            // baseURL: "MANAGER",
                            url: api.changePass.path,
                            method: api.changePass.method,
                            data: {
                                oldPassword: this.ruleFormSafe.oldPassword,
                                newPassword: this.ruleFormSafe.newPassword,
                            },
                        },
                    })
                }

            },
            changePassword() {
                this.passwordTochange = 1
                this.passwordChange = 1
            },
            sureTel() {//bindMobile
                if(this.ruleFormTel.word.length != 6) {
                    this.$message({
                        showClose: true,
                        message: '请输入6位验证码',
                        type: 'error'
                    });
                    return false;
                }
                if(!(/^1[34578]\d{9}$/.test(this.ruleFormTel.mobile))) {
                    this.$message({
                        showClose: true,
                        message: '请输入正确的手机号码',
                        type: 'error'
                    });
                    return false;
                }
                this.RightSendKey();
//                this.ajax({//验证验证码
//                    ajaxSuccess: this.RightSendKey,
//                    ajaxParams: {
//                        //baseURL:'PUBLIC',
//                        url: api.validCodeRight.path,
//                        method: api.validCodeRight.method,
//                        data: {
//                            mobile: this.ruleFormTel.mobile,
//                            types: 30,
//                            code: this.ruleFormTel.word,
//                        },
//                    },
//                })



            },
            nameAndMoblie() {
                this.ajax({
                    ajaxSuccess: this.getPassTelSuccess, //获取成功变换发送短信按钮
                    ajaxParams: {
                        //baseURL:'PUBLIC',
                        url: api.sendValidCode.path,
                        method: api.sendValidCode.method,
                        data: {
                            mobile: this.ruleFormTel.mobile,
                            types: '30'//修改绑定手机号码
                        },
                    },
                })
            },
//            TelNotRegisterSuccess() {
//                this.ajax({
//                    ajaxSuccess: this.getPassTelSuccess,
//                    ajaxParams: {
//                        //baseURL:'PUBLIC',
//                        url: api.sendValidCode.path,
//                        method: api.sendValidCode.method,
//                        data: {
//                            mobile: this.ruleFormTel.mobile,
//                            types: 30,
//                        },
//                    },
//                })
//            },
            RightSendKey() {//修改手机号
                this.ajax({
                    ajaxSuccess: this.Telchangesuccess,
                    error: () => {
                    },
                    ajaxParams: {
                        //baseURL: "MANAGER",
                        url: api.bindMobile.path,
                        method: api.bindMobile.method,
                        data: {
                            mobile: this.ruleFormTel.mobile,
                            code: this.ruleFormTel.word,
                            id: this.ruleForm.id,

                        },
                    },
                })
            },
            Telchangesuccess() {
                this.ruleForm.mobile = this.ruleFormTel.mobile;
                this.content1 = this.ruleForm.mobile;
                this.ruleFormTel = {};
                this.passwordTochange = 1
                this.telChange = 1;

            },
            sureTelCancel() {
                this.passwordTochange = 1

            },
            accessKey1() {//获取验证码
                if(!(/^1[34578]\d{9}$/.test(this.ruleFormTel.mobile))) {
                    this.$message({
                        showClose: true,
                        message: '请输入正确的手机号码',
                        type: 'error'
                    });

                } else {
                    this.nameAndMoblie();

                }
            },
            getPassTelSuccess(res) {
                var that = this;
                var setInt = window.setInterval(function() {
                    that.timesend--;
                    if(that.timesend == 0) {
                        window.clearInterval(setInt);
                        that.sendKeySuccess = false;
                        that.timesend = 60
                    }
                }, 1000)
                this.sendKeySuccess = true;
                return
            },
            deserve(formName) {
                if(this.ruleForm.textbookVersionNewList.length < this.bookBtn.length) {
                    this.$message.error('教材信息不完整');
                    return false;
                }
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.ajax({
                            ajaxSuccess: this.changeMydataSuccess,
                            ajaxParams: {
                                //baseURL:'PUBLIC',
                                jsonString: true,
                                url: api.modify1.path,
                                method: api.modify1.method,
                                data: {
                                    id: this.myId,
                                    name: this.ruleForm.name,
                                    nickname: this.ruleForm.nickname,
                                    sex: this.ruleForm.sex,
                                    birth: this.day,
                                    grade: this.ruleForm.grade,
                                    length: this.ruleForm.length || 0,
                                    school: this.ruleForm.school,
                                    province: this.province,
                                    town: this.city,
                                    county: this.area,
                                    textbookVersionList: this.ruleForm.textbookVersionNewList,
                                    icon: this.imgsrcdetail,
                                },
                            },
                        })
                    } else {
                        return false;
                    }
                });

            },
            /*
            * 获取表单数据
            * @return string  格式:id=0&name=aa
            * */
            getFormData(data) {
                let myData = Util._.defaultsDeep({}, data);
                return myData;
            },
            changeMydataSuccess() {
                this.$message({
                    showClose: true,
                    message: '信息修改成功',
                    type: 'success'
                });
                // 修改资料后重新获取当前用户的资料
                this.getMyInfo();
            },
            getMyInfo() {
                let opt = {
                    ajaxSuccess: res => {
                        if(res.data instanceof Object) {
                            this.$store.commit('user/updateInfo', res.data);
                            this.$store.commit('user/updateTextbookVersionList', res.data.textbookVersionList)
                        }
                    },
                    ajaxParams: {
                        url: '/student/getMyInfo'
                    }
                };
                this.ajax(opt);
            },

        },
        components: {
            selectBook,
            passwordChange,
            telChange,
            selectPlace
        },

    }

</script>
<style lang="scss">
    @import "../css/selfData.scss";

    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
</style>
