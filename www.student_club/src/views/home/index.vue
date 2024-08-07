<template>
  <div class="common-layout">
    <div style="height:480px"><RotationPic /></div>
    <div class="main-layout">
      <RecommendActivity />
      <div id="newsAndNotice">
        <RecommendNews />
        <RecommendNotice />
      </div>
      <ClubList/>
    </div>
  </div>
</template>

<script>
import RotationPic from '@/components/RotationPic'
import RecommendActivity from './components/recommendActivity'
import RecommendNews from './components/recommendNews'
import RecommendNotice from './components/recommendNotice.vue'
import ClubList from './components/clubList.vue'
import { useRouter } from "vue-router"
export default {
  name: 'main',
  components: {
    RotationPic,
    RecommendActivity,
    RecommendNews,
    RecommendNotice,
    ClubList
  }
}
</script>

<style>
.common-layout{
  padding-top:0;
}
.main-layout{
  width: 1250px;
  margin: auto;
  margin-top: 5px;
}
#newsAndNotice{
  width: 100%;
  height: 460px;
  margin-top: 10px;
}
</style>
