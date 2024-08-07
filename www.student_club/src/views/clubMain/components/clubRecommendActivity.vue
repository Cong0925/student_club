<template>
<div class="clubRecommendactivities">
    <div class="title_more">
      <div class="title_more_left">社团活动</div>
      <div class="title_more_right" @click="toNew('ClubActivities')">更多</div>
    </div>
    <div v-if="!state.err">
    <div v-for="(item,index) in state.actives" 
    :key="index" 
    class="clubRecActives">
          <el-card shadow="hover" style="padding: 2%; height:110px;background-color: #fff;border: 0.25px gainsboro solid;cursor: pointer;"
          @click="toNew('ClubActiveDetails',item.activity_id)">
          <div style="float:left; width:80%">
              <div class="clubRecActives-title">{{ item.title }}</div>
              <div class="clubRecActives-related"> 时间：{{ item.start_time }}&nbsp;&nbsp;&nbsp;&nbsp;地址：{{item.address}}</div>
            </div>
            <div style="float:left;"><el-button type="primary" plain>我要参加</el-button></div>
          </el-card>
    </div>
	</div>
	<div v-if="state.err" style="height:100%;background-color: #fff;border: 0.25px gainsboro solid;">
		<el-empty description="该社团还没有发布活动" />
	</div>
</div>
</template>

<script setup>
import { reactive,onMounted } from 'vue'
import { apiGetActivitiesList } from '@/api/activity'
import { toast } from "@/utils/tool"
import { useRoute,useRouter } from "vue-router"
const route=useRoute()
const router = useRouter()
const state=reactive({
  actives:[],
  err:0, //社团是否发布活动
})

const getActivityList = () => {
    apiGetActivitiesList({
		club_id:router.currentRoute.value.params.clubId
	}).then((res) => {
			  if(res.code=='2001') state.err=1
        if(res.code=='2000') state.actives = res.data.slice(0,2)
  }).catch((err) => {
        console.log('activitiesList', err)
        toast(err,'error','Error')
  })
}
const toNew=(name,id)=>{
  let newpath=router.resolve({ name,params:{club_id:router.currentRoute.value.params.clubId,activityId: id} })
  window.open(newpath.href,'_blank')
}
onMounted(() => {
    getActivityList()
})
</script>

<style scoped>
.clubRecommendactivities{
  background-color: #fff;
}
.clubRecActives-title{
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap; 
  text-overflow: ellipsis;
}
.clubRecActives-related{
  font-size: 16px;
  margin-top:10px;
  overflow: hidden;
  white-space: nowrap; 
  text-overflow: ellipsis;
}
</style>
