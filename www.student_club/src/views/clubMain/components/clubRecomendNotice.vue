<template>
  <div class="clubRecommendnotice">
    <div class="title_more">
      <div class="title_more_left">通知公告</div>
      <div class="title_more_right" @click="toNew('ClubNotices')">更多</div>
    </div>
    <div class="content" v-if="!state.err">
    <div class="notice_text"
      v-for="(item, index) in state.notices"
      :key="index" 
    >
      <div class="notice_time">
        {{ item.create_time }} <br />
        {{ item.club_name }}
      </div>
      <div class="notice_title"
      @click="toNew('ClubNoticeDetails',item.notice_id)" style="cursor: pointer;">
        {{ item.title }}</div>
    </div>
    </div>
    <div class="content" v-if="state.err">
      <el-empty description="该社团还没有发布通知" />
    </div>
  </div>
</template>

<script setup>
  import { reactive,onMounted } from "vue"
  import { apiGetNoticeList } from '@/api/notice'
  import { useRoute,useRouter } from "vue-router"
  const route=useRoute()
  const router = useRouter()
  const state = reactive({
    notices: [],
    err:0
  })
  const getNoticeList=()=>{
    apiGetNoticeList({
      club_id:router.currentRoute.value.params.clubId
    }).then(res=>{
      if(res.code=='2001') state.err=1
      if(res.code=='2000') state.notices=res.data.slice(0, 4)
    }).catch(err => {
          console.log(err);
      })
  }
  const toNew=(name,id)=>{
    let newpath=router.resolve({ name,params:{club_id:router.currentRoute.value.params.clubId,noticeId: id} })
    window.open(newpath.href,'_blank')
  }
  onMounted(()=>{
    getNoticeList()
  })
</script>

<style scoped>
.clubRecommendnotice {
  width: 100%;
  height: 400px;
  background-color: #fff;
}
.content{
  width: 100%;
  height: 400px;
  background-color: #fff;
}
.notice_text {
  width: 100%;
  height: 100px;
  background-color: #fff;
  position: relative;
}
.notice_time {
  color: #fff;
  background-color: steelblue;
  height: 60px;
  line-height: 60px;
  width: 30%;
  font-size: 18px;
  text-align: center;
  position: absolute;
  left: 1.5%;
  top: 20%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.notice_title {
  position: absolute;
  left: 31.5%;
  top: 20%;
  height: 60px;
  line-height: 30px;
  width: 67%;
  background-color: aliceblue;
  padding-left: 5%;
  padding-right: 5%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
