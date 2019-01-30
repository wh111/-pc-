<!--
****--@file     Troubleshooting.vue
****--@date     2017/12/13 下午4:17
****--@author   王恒
****--@describe  疑难问题
-->
<template>
    <div>
        <div style="background: #efefef">
            <head-top></head-top>

            <div class="Troubleshooting-root">
                <div class="left">
                    <div class="groupsSelect">
                        <div class="groupsLeft" :class="{active:selectTab==1}" @click="change1(1)">已解答</div>
                        <div class="groupsRight" :class="{active:selectTab==2}" @click="change1(2)">未解答</div>
                        <router-link :to="{path:'/TroubleshootingResult',query:{name:input||''}}">
                            <button style="border-radius: 0px 3px  3px 0" class="greenButton">搜索</button>
                        </router-link>
                        <el-input class="inputSecrch" style="float: right;width: 180px;font-size: 14px;" v-model="input"
                                  placeholder="请输入内容"></el-input>
                    </div>
                    <select-left-table v-if="selectTab==1"></select-left-table>

                    <select-table v-if="selectTab==2"></select-table>
                </div>


                <right-list></right-list>
                <div style="clear: both;margin-bottom: 20px"></div>
            </div>
        </div>
        <footerr></footerr>
    </div>
</template>
<script>
    import subject from '../../components/common/subject.vue'
    import headTop from '../../components/common/headTop.vue'
    import footerr from '../../components/common/footer.vue'
    import rightList from './questionToteacher.vue'
    import selectTable from './sleectTable.vue'
    import selectLeftTable from './selectLeftTable.vue'
    import api from "./api"

    let Util = null;
    export default {
        data() {
            return {
                selectTab: 1,
                showItems: ['subject', 'grade', 'sort'],
                input: '',
                selectRank: 1,

            }
        },
        created() {
            Util = this.$util;


        },
        methods: {

            change1(index) {
                this.selectTab = index;
            },





        },
        components: {
            subject,
            headTop,
            footerr,
            rightList,
            selectTable,
            selectLeftTable
        },

    }


</script>
<style lang="scss">
    @import "css/Troubleshooting.scss";

</style>