<template>
  <div class="activities">

    <div class="title_more">
      <div class="title_more_left">社团活动</div>
      <div class="title_more_right" @click="toNew('Activities')">更多</div>
    </div>

    <el-row>
      <el-col v-for="(item, index) in state.actives.slice(0, 4)" :key="index" :span="8">
        <el-card @click="toNew('ActiveDetails', item.activity_id)" style="cursor: pointer;">
          <img v-lazy="item.pic_url" class="active_image" />
          <div class="rec_active_item_title">
            <span>{{ item.title }}</span>
            <div class="bottom">
              <time class="time">{{ item.start_time }}</time>
              <!-- <span class="clubName">{{ item.club_name }}</span> -->
              <el-button text class="button">详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { apiGetRecommendActivities } from '@/api/activity'
import { toast } from '@/utils/tool'
import { useRouter } from "vue-router";
const router = useRouter()
const state = reactive({
  actives: []
})
// 获取活动列表
const getRecommendActivities = () => {
  apiGetRecommendActivities().then(res => {
    state.actives = res.data.filter(item => item.pic_url !== '');
  }).catch((err) => {
    console.log('activitiesList', err)
    toast(err, 'error', 'Error')
  })
}
// 预加载
onMounted(() => {
  getRecommendActivities()
})
// 活动跳转
const toNew = (name, id) => {
  let newpath = router.resolve({ name, params: { activityId: id } })
  window.open(newpath.href, '_blank')
}
</script>

<style>
/* 全局 */
.activities {
  font-size: 14px;
  position: relative;
  text-align: left;
  /* color: dodgerblue; */
  background-color: #fff;
}

/* 小卡片 */
.el-col {
  padding: 1px;
}

.el-col-8 {
  width: 25%;
  flex: 0 0 25%;
}

.el-card__body {
  padding: 0%;
}

.rec_active_item_title {
  padding: 14px;
  height: 110px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.active_image {
  width: 100%;
  display: block;
  height: 200px;
}

.el-button--text {
  padding-left: 82%;
}
</style>
