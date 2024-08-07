<template>
  <div>
    <el-affix :offset="0">
      <header-two v-if="isShow"></header-two>
      <header-one v-else></header-one>
    </el-affix>
  </div>
      <router-view class="layout-main">
      </router-view>
      <Footer></Footer>
  </template>
  
  <script>
  import HeaderOne from "./components/HeaderOne.vue"
  import HeaderTwo from "./components/HeaderTwo.vue"
  import Footer from './components/Footer'
  import { useRouter } from "vue-router";
  import { computed } from 'vue'
  export default {
      components: {
          HeaderOne,
          Footer,
          HeaderTwo
      },
      setup() {
          const router = useRouter()
          let isShow = computed(() => {
            return router.currentRoute.value.meta? router.currentRoute.value.meta.isShowHeaderTwo : false
        })
          return{
              isShow
          }
      }
  }
  </script>

<style scoped>
.layout-main{
  min-height: calc(100vh - 24vh);
}
</style>