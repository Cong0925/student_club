<template>
  <div class="recommendnews">
    <!-- 社团新闻 更多+ -->
    <div class="title_more">
      <div class="title_more_left">社团新闻</div>
      <div class="title_more_right" @click="toNew('News')">更多</div>
    </div>
    <!-- 最热新闻 -->
    <div class="top_new">
      <el-card :body-style="{ padding: '0px' }" style="cursor: pointer;"
        @click="toNew('NewsDetails', state.topNew.news_id)">
        <el-image :src="state.topNew.pic_url" fit="cover" class="top_new_image" />
        <div style="padding: 14px" class="top_new_text">
          <span style="font-size:14px">{{ state.topNew.title }}</span>
          <span id="top_new_summary">{{ state.topNew.summary }}</span>
          <div class="top_new_bottom">
            <time>{{ state.topNew.create_time }} / {{ state.topNew.club_name }}</time>
            <el-button text class="button">详情</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 其他新闻 -->
    <div class="other_news">
      <div class="other_news_item" v-for="(item, index) in state.recommendNews.slice(1, 5)" :key="index"
        @click="toNew('NewsDetails', item.news_id)" style="cursor: pointer;">
        <div class="news_title">{{ item.title }}</div>
        <div class="news_time">{{ item.club_name }} / {{ item.create_time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted,onBeforeUnmount } from 'vue'
import { apiGetRecommendNews } from '@/api/news'
import { toast } from '@/utils/tool'
import { useRouter } from "vue-router"

const router = useRouter()
const state = reactive({
  recommendNews: [],
  topNew: {},
  isLoad: false
})
const getRecommendNews = () => {
  apiGetRecommendNews().then(res => {
    state.recommendNews = res.data.filter(item => item.pic_url !== '');
    state.topNew = res.data[0]
  }).catch((err) => {
    console.log('activitiesList', err)
    toast(err, 'error', 'Error')
  })
}
const toNew = (name, id) => {
  let newpath = router.resolve({ name, params: { newsId: id } })
  window.open(newpath.href, '_blank')
}

// 预加载
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
let domToTop =document.getElementsByClassName('recommendnews')
// 检测鼠标滚轮
const handleScroll = (event) => {
  const clientH = document.documentElement.clientHeight // 获取视口高度
  const clientT = document.documentElement.scrollTop || document.body.scrollTop; // 滚轮位置
  if (!state.isLoad && domToTop[0].offsetTop - clientT < clientH) {
    // console.log('show');
    state.isLoad = true
    getRecommendNews()
  }
}
</script>

<style>
.recommendnews {
  width: 69.5%;
  float: left;
  background-color: #fff;
}

.top_new {
  width: 49%;
  float: left;
}

.top_new_image {
  width: 100%;
  display: block;
  height: 250px;
}

.top_new_text {
  height: 150px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#top_new_summary {
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

.other_news {
  width: 50%;
  float: left;
  margin-left: 0.25%;
  height: 400px;
  background-color: #fff;
  padding: 2%;
}

.other_news_item {
  height: 25%;
  border-top: seashell 0.25px solid;
  border-bottom: seashell 0.25px solid;
  position: relative;
  padding: 3%;
}

.news_title {
  width: 90%;
  position: absolute;
  margin-left: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.news_time {
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 15px;
  color: #999;
}


.button {
  padding: 0;
  min-height: auto;
}</style>