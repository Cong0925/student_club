<template>
<div class="clubCenter-left">
<el-menu
    default-active="5"
    class="el-menu-vertical-demo"
    >
    <el-menu-item index="1" @click="$router.push({ name: 'ClubCenter',params:{clubId:$router.currentRoute.value.params.clubId} })"> 
        <el-icon><house /></el-icon>
        <span>社团中心</span>
    </el-menu-item>
    <el-menu-item index="2" @click="$router.push({ name: 'ClubMembers',params:{clubId:$router.currentRoute.value.params.clubId} })">
        <el-icon><user /></el-icon>
        <span>社团成员</span>
    </el-menu-item>
    <el-menu-item index="3" @click="$router.push({ name: 'MyChecked',params:{clubId:$router.currentRoute.value.params.clubId} })">
        <el-icon><document /></el-icon>
        <span>我的审核</span>
    </el-menu-item>
    <el-menu-item index="4" @click="$router.push({ name: 'AddMember',params:{clubId:$router.currentRoute.value.params.clubId} })">
        <el-icon><setting /></el-icon>
        <span>入社审批</span>
    </el-menu-item>
</el-menu>
</div>
</template>

<script>
import {
  House,
  User,
  Document,
  Setting,
} from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { useRoute } from "vue-router"
export default {
    setup(){
        const route=useRoute()
        const state=reactive({
            user_type:0,
        })
        return{
            state,
        }
    }
}
</script>

<style scoped>

</style>