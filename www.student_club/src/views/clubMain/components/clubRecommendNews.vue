<template>
  <div class="clubRecommendnews">
    <!-- 社团新闻 更多+ -->
    <div class="title_more">
      <div class="title_more_left">社团新闻</div>
      <div class="title_more_right" @click="toNew('ClubNews')">更多</div>
    </div>
    <div class="clubRecommendnewsMain">
    <!-- 最热新闻 -->
    <div class="top_new" v-if="state.err!=1">
      <el-card :body-style="{ padding: '0px' }" @click="toNew('ClubNewsDetails',state.topNew.news_id)" style="cursor: pointer;">
        <img v-lazy="state.topNew.pic_url" class="top_new_image" />
        <div style="padding: 14px" class="top_new_text">
          <span style="font-size:16px">{{ state.topNew.title }}</span>
          <span id="top_new_summary">{{ state.topNew.summary }}</span>
          <div class="top_new_bottom">
            <time>{{ state.topNew.create_time }}</time>
            <el-button text class="button">详情</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div class="top_new" v-if="state.err==1">
      <el-empty description="该社团还没有发布新闻" />
    </div>
    <!-- 其他新闻 -->
    <div class="other_news" v-if="state.err!=2 & state.err!=1">
      <div class="other_news_item" v-for="(item,index) in state.recommendNews" :key="index"
      @click="toNew('ClubNewsDetails',item.news_id)" 
        style="cursor: pointer;">
            <div class="news_title">{{item.title}}</div>
            <div class="news_time">{{item.create_time}}</div>
      </div>
    </div>
    <div class="other_news" v-if="state.err==2">
      <el-empty description="没有更多新闻了" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { reactive,onMounted } from 'vue'
import { apiGetNewsList,apiGetRecommendNews } from '@/api/news'
import { useRoute,useRouter } from "vue-router"
const route=useRoute()
const router = useRouter()
const state=reactive({
  recommendNews:[],
  topNew:{},
  err:0
})
const getNewsList=()=>{
	apiGetNewsList({
		club_id:router.currentRoute.value.params.clubId
	}).then(res=>{
    if(res.code=='2001') state.err=1 //没有新闻
    if(res.count==1) state.err=2 //只有一条新闻
		if(res.code=='2000') {
      state.recommendNews=res.data.slice(1,5)
      state.topNew=res.data[0]
    }
	}).catch((err) => {
      console.log('clubRecommendNews', err)
  })
}
onMounted(()=>{
	getNewsList()
})
const toNew=(name,id)=>{
  let newpath=router.resolve({ name,params:{club_id:router.currentRoute.value.params.clubId,newsId: id} })
  window.open(newpath.href,'_blank')
}
</script>

<style>
.clubRecommendnews{
  width: 100%;
  background-color: #fff;
}
.clubRecommendnewsMain{
  width: 100%;
  height: 400px;
  background-color: #fff;
}
.top_new{
  width: 49%;
  float: left;
}
.top_new_image {
  width: 100%;
  display: block;
  height: 250px;
}
.top_new_text{
  height: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#top_new_summary{
  display: block;
  margin-top: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.top_new_bottom {
  margin-top: 20px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #999;
}

.other_news{
  width: 50%;
  float: left;
  margin-left: 0.25%;
  height: 400px;
  background-color: #fff;
  padding: 2%;
}
.other_news_item{
  height: 25%;
  border-top: seashell 0.25px solid;
  border-bottom: seashell 0.25px solid;
  position: relative;
  padding: 3%;
}
.news_title{
  width: 90%;
  position: absolute;
  margin-left: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.news_time{
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 15px;
  color: #999;
}


.button {
  padding: 0;
  min-height: auto;
}


</style>