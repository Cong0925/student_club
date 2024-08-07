<template>
  <div class="memberAppear">

    <div class="memberAppear-main" v-if="!state.err" v-loading="loading">
      <div class="memberAppearItem" v-for="(item, index) in state.memberAppearance" :key="index"
        @click="$router.push({ name: 'MemberAppearDetails', params: { clubId: $router.currentRoute.value.params.clubId, memberAppearanceId: item.member_appearance_id } })"
        style="cursor: pointer;">
        标题：{{ item.title }}
        <span style="float: right;">{{ item.update_time }}</span>
      </div>

    </div>
    <div class="memberAppear-main" v-if="state.err">
      <el-empty description="无成员风采" />
    </div>
    <div class="pagination">
      <!--总数超过一页，再展示分页器-->
      <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
        :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
    </div>

    <div class="active-search" v-if="!state.err">
      <div class="input"><el-input v-model="state.searchInput" placeholder="请输入风采标题" /></div>
      <div class="button">
        <el-button type="primary" plain @click="search">搜索</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { apiGetRecommendedMemberAppearance } from '@/api/member'
import { useRouter } from 'vue-router'

const state = reactive({
  searchInput: '',
  memberAppearance: [],
  total: '',
  pageSize: 10,
  currentPage: 1,
  err: 0, //社团是否发布风采
})
const router = useRouter()
const getRecommendedMemberAppearance = () => {
  apiGetRecommendedMemberAppearance({
    club_id: router.currentRoute.value.params.clubId,
    key_word: state.searchInput,
    page: state.currentPage,
    size: state.pageSize
  }).then(res => {
    if (res.code === '2001') state.err = 1
    if (res.code == 2000) {
      state.memberAppearance = res.data
      state.total = res.count
    }
  })
}
const search = () => {
  getRecommendedMemberAppearance()
}
// 预加载
onMounted(() => {
  getRecommendedMemberAppearance()
})
const changePage = (val) => {
  state.currentPage = val
  getRecommendedMemberAppearance()
}
</script>

<style scoped>
.memberAppear {
  position: relative;
  width: 1250px;
  height: 65vh;
  margin: auto;
}

.memberAppear-main {
  width: 78%;
  height: 65vh;
  float: left;
  margin-top: 2%;
}

.memberAppearItem {
  width: 100%;
  height: 10.5%;
  padding: 1.5%;
  background-color: #fff;
  border-bottom: 0.5px solid rgb(239, 239, 239);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.memberAppearItem:last-child {
  border-bottom: 0;
}

.memberAppearLeft {
  position: absolute;
  left: 0;
}

.memberAppearRight {
  position: absolute;
  right: 0;
}

.footer_pagination {
  margin-left: 125px;
  margin-top: 5px;
}

.pagination {
  position: absolute;
  top: 72vh;
}
</style>
