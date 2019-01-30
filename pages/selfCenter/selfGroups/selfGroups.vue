<!--
****--@file     selfGroups.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe  个人群组
-->
<template>
    <div class="groupsRoot">
        <div class="groupsSelect">
            <div class="groupsLeft" :class="{styLeft:selectLeft,styRight:selectRight}" @click="changeLeft">班级群</div>
            <div class="groupsRight" :class="{styLeft:selectRight,styRight:selectLeft}" @click="changeRight">小组群</div>
            <div class="joinGroup" @click="joinGroup">加入班组</div>
        </div>
        <!--v-if="selectRight"-->
        <div v-if="groupDetail.length!=0">
            <div class="carouselFigure"
                 style="width: 890px;float: left;position: relative;height: 150px;overflow: hidden">
                <div class="left-img" @click="clickSmall('left')"><</div>
                <div class="left-img" style="width: 5px;z-index: 10"></div>
                <div class="middle">
                    <div class="middle-swiper" :style="{'left':leftPostion+'px'}">
                        <div class="item-detail" v-for="(item,index) in groupDetail" :key="index"
                             @click="change(item,index)">
                            <section class="list">
                                <section class="img">
                                    <img :src="item.managerIcon" :onerror="onerrImg"/>
                                </section>
                                <ul>
                                    <li>{{item.managerName}}</li>
                                    <li>{{item.subject | subject }}老师</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
                <!--<swiper :options="swiperOption" style="width: 800px;overflow: visible">-->
                <!--<swiper-slide v-for="(item,index) in groupDetail" :key="index" @click.native="change(item,index)" >-->
                <!--<section class="list" >-->
                <!--<section class="img">-->
                <!--<img :src="item.managerIcon" :onerror="onerrImg"/>-->
                <!--</section>-->
                <!--<ul>-->
                <!--<li>{{item.managerName}}</li>-->
                <!--<li>{{item.subject | subject }}老师</li>-->
                <!--</ul>-->
                <!--</section>-->
                <!--</swiper-slide>-->
                <!--<div class="swiper-pagination" slot="pagination"></div>-->
                <!--<div class="swiper-button-prev" slot="button-prev"></div>-->
                <!--<div class="swiper-button-next" slot="button-next"></div>-->
                <!--</swiper>-->
                <div class="right-img" @click="clickSmall('right')"> ></div>
                <div class="right-img" @click="clickSmall('right')" style="width: 5px;z-index: 10"></div>
            </div>
            <div style="clear:both"></div>

            <!--<h1 class="groupsTitle">{{groupDetail[indexList].title}}</h1>-->
            <!--<p class="groupsTitlelist">创建人：-->
            <!--<span>{{groupDetail[indexList].managerName}}</span>-->
            <!--&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;-->
            <!--群号：-->
            <!--<span>{{groupDetail[indexList].no}}</span>-->
            <!--&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;创建时间：-->
            <!--<span>{{groupDetail[indexList].createTime}}</span>-->
            <!--</p>-->
            <h1 class="h1">{{myDetail.title}}</h1>
            <p class="h1-title">
                创建人：<span>{{myDetail.managerName}}</span>群号：<span>{{myDetail.no}}</span>创建时间：<span>{{myDetail.createTime | formatDate}}</span>
            </p>
            <div class="groupsDetailtitle">
                <div></div>&nbsp;群简介
            </div>
            <div class="groupsDetailRight">
                <div class="grouplist">
                    <p class="tatal">群成员 <span
                            style="line-height: 20px;float: right;margin-top: 10px">{{totalPeople}}人</span></p>
                    <div style="overflow: auto;height: 374px;overflow-x: hidden;width: 250px">
                        <div class="person" v-for="(item,index) in peopleList">
                            <button v-if="!item.isMyFriend&&mySelfId!=item.id" @click="addFriend(item)"
                                    style="margin-right: 0px">加为好友
                            </button>
                            <button v-if="item.isMyFriend" class="alreadyAdd">已添加</button>
                            <div class="pic"><img style="width: 30px;height: 30px" :src="item.icon"
                                                  :onerror="onerrImg"/></div>
                            <span class="name"><span>{{item.name}}</span> </span>
                            <span class="warn" v-if="item.realStatus==0">未实名</span>
                            <span class="warn" v-if="item.realStatus==1">已实名</span>
                        </div>


                    </div>
                </div>

            </div>
            <div class="groupsDetailleft">
                <div class="p">{{myDetail.remark}}</div>
                <div class="groupsDetailtitle">
                    <div></div>&nbsp;群通知
                </div>
                <div class="p">
                    <p v-for="(item,index1) in myDetail.groupsNoticeList" :key="index1">
                        {{index1 + 1}}：{{item.title}} {{item.content}}<span>发布时间：{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                    </p>
                </div>
                <div class="groupsDetailtitle">
                    <div></div>&nbsp;群动态
                </div>
                <div class="p">
                    <p v-for="(item,index1) in myDetail.groupsNewsList" :key="index1">
                        {{index1 + 1}}：{{item.title}} {{item.content}}<span>发布时间：{{item.createTime | formatDate('yyyy-MM-dd HH:mm')}}</span>
                    </p>
                </div>
                <!--<div class="p">-->
                <!--<p>1.<b>卢本伟</b> 同学已经提交了8月9日家庭作业。<span>发布时间：1017-08-09</span></p>-->
                <!--<p>2.<b> 姚明</b> 同学正在进行[初一语文]的相关练习。<span>发布时间：1017-08-09</span></p>-->
                <!--</div>-->
            </div>
        </div>
        <div class="nongroup" v-if="mark==1">
            <div class="isnull">
                <img src="../../../assets/images/isnull.png"/>
                <p>您还未加入任何群组</p>
            </div>

        </div>
        <Modal
                :mask-closable="false"
                width="360"
                v-model="evaluateModal"
                title="加入群组"
                class-name="addGroups-detail"
                :loading="loading">
            <modal-header slot="header" :content="evaluateId"></modal-header>
            <add-groups v-if="evaluateModal" @joingroups="joingroups"></add-groups>
        </Modal>
        <Modal
                :mask-closable="false"
                width="360"
                v-model="MakeFriend"
                title="添加好友"
                class-name="addGroups-detail"
                :loading="loading">
            <modal-header slot="header" :content="addfri"></modal-header>
            <add-friends v-if="MakeFriend" :peopleID="peopleID" :people="people"
                         @addcomplete="addcomplete"></add-friends>
        </Modal>
    </div>


</template>
<script>
  import addFriends from './addFriends.vue'
  import addGroups from './addGroups.vue'
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import api from './api'

  export default {
    data () {
      return {
        onerrImg: '',
        myDetail: {remark: '', groupsNoticeList: [], groupsNewsList: [],},
        groupDetail: [],
        mark: 0,
        id: '',
        leftPostion: 0,
        canClick: true,
        indexList: 0,
        peopleList: [],
        type: 0,
        people: '马老师',
        peopleID: '',
        MakeFriend: false,
        selectLeft: true,
        selectRight: false,
        evaluateModal: false,
        evaluateId: {
          id: 'addGroups',
          title: '',
        },
        addfri: {
          id: 'addfriends',
          title: '',
        },
        loading: false,
        swiperOption: {
          slidesPerView: 5,
          spaceBetween: 0,
          slidesPerGroup: 5,
          loop: true,
          loopFillGroupWithBlank: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        totalPeople: '',
        mySelfId: '',
      }
    },
    created () {
      this.init()
      this.onerrImg = 'this.src="' + require('../../../assets/images/man.png') + '"'
    },
    mounted () {
      this.mySelfId = this.$store.state.user.info.id
    },
    methods: {
      clickSmall (type) {
        if (!this.canClick) {
          return
        }
        var timer
        var m = this.leftPostion
        if (type == 'right') {
          if (this.groupDetail.length > 5) {
            if ((this.groupDetail.length - 5) * 160 + m > 0) {
              timer = setInterval(() => {
                this.leftPostion = this.leftPostion - 16
                this.canClick = false
              }, 100)
              setTimeout(() => {
                clearInterval(timer)
                this.canClick = true
              }, 100 * 10)
            }
          }
        } else if (type == 'left') {
          if (m < 0) {
            timer = setInterval(() => {
              this.leftPostion = this.leftPostion + 16
              this.canClick = false
            }, 100)
            setTimeout(() => {
              clearInterval(timer)
              this.canClick = true
            }, 100 * 10)
          }
        }
      },
      init () {
        this.ajax({
          ajaxSuccess: this.getListimgsuccess,
          ajaxParams: {

            url: api.groupsList.path,
            method: api.groupsList.method,
            params: {
              types: this.type
            },
          },
        })

      },
      getListimgsuccess (res) {//获取groups

        this.groupDetail = res.data
        this.groupDetail.map((item) => {
          item.groupsNoticeList.map((item2) => {
            item2.content = item2.content.replace(/\*/g, '')
          })
          item.groupsNewsList.map((item2) => {
            item2.content = item2.content.replace(/\*/g, '')
          })
        })
        if (res.data.length == 0) {
          this.myDetail = {remark: '', groupsNoticeList: [], groupsNewsList: [],}
          this.peopleList = []
          this.totalPeople = 0
          this.groupDetail = []
          this.mark = 1
        } else {
          for (var i = 0; i < res.data.length; i++) {
            this.groupDetail[i].managerIcon = this.getStaticPath(this.groupDetail[i].managerIcon)
          }
          this.id = this.groupDetail[0].id
          this.mark = 0
          this.geiPeople()
          this.myDetail = this.groupDetail[0]
        }

      },
      geiPeople () {
        this.ajax({
          ajaxSuccess: this.getpeoplesuccess,
          ajaxParams: {
            url: api.queryStudents.path,
            method: api.queryStudents.method,
            params: {
              id: this.id
            },
          },
        })
      },
      getpeoplesuccess (res) {//获取组员
        this.peopleList = res.data
        for (var i = 0; i < res.data.length; i++) {

          this.peopleList[i].icon = this.getStaticPath(this.peopleList[i].icon)
          if (!this.peopleList[i].icon) {
            this.peopleList[i].icon = ''
          }
        }
        this.totalPeople = res.data.length
      },
      joingroups () {
        this.evaluateModal = false
      },
      changeLeft () {
        this.selectLeft = true
        this.selectRight = false
        this.type = 0
        this.leftPostion = 0
        this.init()
      },
      changeRight () {
        this.selectLeft = false
        this.selectRight = true
        this.leftPostion = 0
        this.type = 1
        this.init()
      },
      joinGroup () {
        this.evaluateModal = true
      },
      addFriend (item) {
        this.MakeFriend = true
        this.people = item.name
        this.peopleID = item.id
      },
      addcomplete () {
        this.MakeFriend = false
      },
      change (item, index) {
        console.log(item)
        this.id = item.id
        this.indexList = index
        this.myDetail = this.groupDetail[index]
        this.geiPeople()
      }

    },
    components: {
      addGroups,
      swiper,
      swiperSlide,
      addFriends,

    }
    ,
  }


</script>
<style lang="scss">
    @import "../css/selfGroups";
</style>
