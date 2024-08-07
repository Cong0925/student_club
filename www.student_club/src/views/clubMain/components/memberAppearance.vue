<template>
  <div style="background-color: #fff;">
  <div class="title_more">
      <div class="title_more_left">成员风采</div>
      <div class="title_more_right" @click="toNew('MemberAppearance')">更多</div>
  </div>
  <div style="height: 160px; " m="t-4">
    <el-card :body-style="{ padding: '0px' }" 
        v-for="(item,index) in state.memberAppearance"
        :key="index"
        @click="toNew('MemberAppearDetails',item.member_appearance_id)"
        style="cursor: pointer;float: left;">
          <el-image style="width: 206px; height: 125px;" :src="item.pic_url" fit="cover"/><br>
          <span v-if="item.title!=null">&nbsp;{{ item.title.length>11?item.title.substring(0,11)+'...':item.title }}</span>
    </el-card>
  </div>
</div>
</template>

<script>
import { onMounted, reactive,computed } from 'vue'
import { apiGetRecommendedMemberAppearance } from '@/api/member'
import { useRoute,useRouter } from 'vue-router'

export default{
  components: {
    
  },
  setup(){
    const router = useRouter()
    const state=reactive({
      memberAppearance:[]
    })
    const route=useRoute()
    const getRecommendedMemberAppearance=()=>{
      apiGetRecommendedMemberAppearance({
      club_id:router.currentRoute.value.params.clubId,
      size:6,
      page:1
      }).then(res=>{
        if(res.code==2000){
          state.memberAppearance=res.data
        }
      })
    }
    const toNew=(name,id)=>{
      let newpath=router.resolve({ name,params:{club_id:router.currentRoute.value.params.clubId,memberAppearanceId: id} })
      window.open(newpath.href,'_blank')
    }
    onMounted(()=>{
      getRecommendedMemberAppearance()
    })

    return{
      state,toNew
    }
  }
}
</script>

<style scoped>
.el-carousel__item.is-animating {
  transition: transform 20s ease-in-out,-webkit-transform 20s ease-in-out;
}
</style>
