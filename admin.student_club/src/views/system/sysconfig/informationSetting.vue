<!-- 系统配置 -->
<template>
    <div class="tab">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleActive"
    >
      <el-menu-item index="1">班级管理</el-menu-item>
      <el-menu-item index="2">学院管理</el-menu-item>
      <el-menu-item index="3">社团分类管理</el-menu-item>
    </el-menu>
  </div>
  <class-manage v-if="activeIndex === '1'" />
  <college-manage v-if="activeIndex === '2'" />
  <type-manage v-if="activeIndex === '3'" />
</template>
<script>
import { reactive, toRefs } from 'vue'
import ClassManage from './components/ClassManage.vue'
import CollegeManage from './components/CollegeManage.vue'
import TypeManage from './components/ClubTypeManage.vue'
export default {
    name: 'InformationSetting',
    components: {
        ClassManage,
        CollegeManage,
        TypeManage
    },
    setup() {
        // 选择班级管理还是学院管理
        const state = reactive({
            activeIndex: '1'
        })

        // 定义事件切换方法
        const handleActive = (key) => {
            state.activeIndex = key
            // console.log('6666',state.activeIndex)
        }
        return {
            ...toRefs(state),
            handleActive
        }
    }
}
</script>
<style scoped>

</style>