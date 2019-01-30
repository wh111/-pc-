<!--
****--@file     error1.vue
****--@date     2017/12/25 9:29
****--@author   王恒
****--@describe   错误提示
-->
<template>
  <div class="Error-root">
    <img src="../../../assets/images/err.png"/>
  </div>
</template>
<script>
	/*当前组件必要引入*/
	let Util = null
	export default {
		data () {
			return {}
		},
		methods: {
			//初始化请求列表数据
			init () {
				Util = this.$util
			},
			
		},
		created () {
			this.init()
		},
		mounted () {
		},
		components: {},
	}

</script>
<style lang="scss">
  .Error-root {
    width: 950px;
    height: 720px;
    margin: 0 auto;
    text-align: center;
    background: #fff;
    border-radius: 5px;
    img {
      margin-top: 237px;
    }
  }
</style>