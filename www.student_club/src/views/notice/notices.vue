<template>
    <div class="notice">
        <div class="notice-main" v-loading="loading">
            <div class="notice-item" v-for="(item, index) in state.notices" :key="index"
                @click="$router.push({ name: 'NoticeDetails', params: { noticeId: item.notice_id } })"
                style="cursor: pointer;">
                【{{ item.club_name }}】{{ item.title }}
                <span style="float: right;">{{ item.create_time }}</span>
            </div>
        </div>
        <div class="pagination">
            <!--分页器-->
            <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
                :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
        </div>
        <div class="active-search">
            <div class="input"><el-input v-model="state.searchInput" placeholder="请输入通知标题" /></div>
            <div class="button">
                <el-button type="primary" plain @click="search">搜索</el-button>
            </div>
        </div>
        <!-- <div class="active-sidebar">
        热门活动
        <div class="active-sidebar-item" v-for="(item,index) in state.recommendActives.slice(0,3)" :key="index">
            <img v-lazy="item.pic_url" alt="" class="active-sidebar-img" @click="$router.push({ name: 'ActiveDetails',params:{activityId: item.activity_id} })" style="cursor: pointer;">
            <div class="active-sidebar-title">【{{item.club_name}}】{{item.title}}</div>
        </div>
    </div> -->
    </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { apiGetNoticeList } from '@/api/notice'
const loading = ref(false)
const state = reactive({
    searchInput: '',
    total: 0,
    pageSize: 10,
    currentPage: 1,
    notices: []
})
// 获取通知列表
const getNoticeList = async () => {
    const parms = {
        size: state.pageSize,
        page: state.currentPage,
        key_word: state.searchInput
    }
    loading.value = true
    await apiGetNoticeList(parms).then(res => {
        state.notices = res.data
        state.total = res.count
    }).catch(err => {
        console.log(err);
    })
    loading.value = false

}
// 搜索
const search = () => {
    getNoticeList()
}
// 分页
const changePage = (val) => {
    state.currentPage = val
    getNoticeList()
}
// 预加载
onMounted(() => {
    getNoticeList()
})
</script>

<style scoped>
.notice {
    position: relative;
    width: 1250px;
    height: 65vh;
    margin: auto;
}

.notice-main {
    width: 78%;
    height: 65vh;
    float: left;
    margin-top: 2%;
}

.notice-item {
    width: 100%;
    height: 10.0%;
    padding: 1.5%;
    background-color: #fff;
    border-bottom: 0.5px solid rgb(239, 239, 239);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 2px;
}

.pagination {
    position: absolute;
    top: 72vh;
}
</style>