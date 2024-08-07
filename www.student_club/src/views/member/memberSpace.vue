<template>
  <div class="bread"><el-icon><CaretLeft /></el-icon><span @click="this.$router.go(-1)" style="cursor: pointer;">返回上一页</span></div>
  <div class="memberSpace">
    <el-timeline style="padding:15px">
      <el-timeline-item v-for="(item, index) in state.memberAppearanceList" :key="index" 
      type="primary" hollow="true" timestamp="2018/4/12" placement="top">
        <el-card style="width:60%">
          <el-image :src="item.pic_url" fit="cover" class="memberSpaceLeft"
          @click="$router.push({ name: 'MemberAppearDetails',query:{memberAppearanceId: item.member_appearance_id} })"></el-image>
          <div class="memberSpaceRight">
            <span>这里是title</span>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import {CaretLeft} from '@element-plus/icons-vue'
import { apiGetMyMemberAppearance } from '@/api/member'
import { getCookies,toast } from '@/utils/tool'
import { onMounted, reactive } from 'vue'
import { useRoute } from "vue-router";
export default {
  setup(){
    const route = useRoute();
    const state=reactive({
      memberAppearanceList:[]
    })
    const getMyMemberAppearance = () => {
        apiGetMyMemberAppearance({
        user_id:route.query.studentId,
        user_type:0
        })
        .then((res) => {
            state.memberAppearanceList=res.data
        })
        .catch((err) => {
            console.log('apiGetMyMemberAppearance', err);
            toast(err,'error','Error')
        })
    }
    onMounted(()=>{
      getMyMemberAppearance()
    })
    return{
      state
    }
  }
}
</script>

<style scoped>
.memberSpace{
  width: 1250px;
  margin: auto;
  background-color: #fff;
  min-height: 450px;
  margin-top: 5px;
}
.memberSpaceLeft{
  width: 150px; 
  height: 100px; 
  cursor: pointer;
  float:left
}
.memberSpaceRight{
  float:left;
  padding-top:20px;
  margin-left:15px
}
</style>