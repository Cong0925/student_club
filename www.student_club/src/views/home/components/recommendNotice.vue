<template>
  <div class="recommendnotice">
    <div class="title_more">
      <div class="title_more_left">通知公告</div>
      <div class="title_more_right" @click="toNew('Notices')">更多</div>
    </div>
    <div class="content">
    <div
      class="notice_text"
      v-for="(item, index) in state.notices.slice(0, 4)"
      :key="index"
    >
      <div class="notice_time">
        {{ item.create_time }} 
        <!-- {{ item.club_name }} -->
      </div>
      <div 
      class="notice_title"
      @click="toNew('NoticeDetails',item.notice_id)" style="cursor: pointer;">
      {{ item.title }}</div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { reactive,onMounted,onBeforeUnmount } from "vue"
import { apiGetNoticeList } from '@/api/notice'
import { toast } from '@/utils/tool'
import { useRouter} from "vue-router"

const router=useRouter()
const state = reactive({
  notices: [],
  isLoad:false
});
const getNoticeList=()=>{
	apiGetNoticeList().then(res=>{
		state.notices=res.data
	}).catch(err => {
        console.log(err);
    })
}

// 预加载
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
let domToTop =document.getElementsByClassName('recommendnotice')
// 检测鼠标滚轮
const handleScroll = (event) => {
  const clientH = document.documentElement.clientHeight // 获取视口高度
  const clientT = document.documentElement.scrollTop || document.body.scrollTop; // 滚轮位置
  if (!state.isLoad && domToTop[0].offsetTop - clientT < clientH) {
    // console.log('show');
    state.isLoad = true
    getNoticeList()
  }
}
const toNew=(name,id)=>{
  let newpath=router.resolve({ name,params:{noticeId: id} })
  window.open(newpath.href,'_blank')
}
</script>

<style scoped>
.recommendnotice {
  width: 30%;
  margin-left: 0.5%;
  float: left;
  height: 453px;
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
  left: 2%;
  top: 20%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.notice_title {
  position: absolute;
  left: 32%;
  top: 20%;
  height: 60px;
  line-height: 30px;
  width: 66%;
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
