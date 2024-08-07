<template>
    <div>
        <div class="newsCenter" v-if="!state.err">
            <div class="news-main" v-loading="loading">
                <div class="news-main-item" v-for="(item, index) in state.news" :key="index"
                    @click="$router.push({ name: 'ClubNewsDetails', params: { clubId: $router.currentRoute.value.params.clubId, newsId: item.news_id } })"
                    style="cursor: pointer;">
                    {{ item.title }}<span style="float: right;">{{ item.create_time }} </span>
                </div>
            </div>
            <div class="active-search">
                <div class="input"><el-input v-model="state.input" placeholder="请输入新闻标题" /></div>
                <div class="button"><el-button type="primary" plain @click="search">搜索</el-button></div>
            </div>
            <div class="active-sidebar">
                热点新闻
                <div class="active-sidebar-item" v-for="(item, index) in state.recommendNews.slice(0, 3)" :key="index">
                    <img v-lazy="item.pic_url" alt="" class="active-sidebar-img"
                        @click="$router.push({ name: 'ClubNewsDetails', params: { clubId: $router.currentRoute.value.params.clubId, newsId: item.news_id } })"
                        style="cursor: pointer;">
                    <div class="active-sidebar-title">{{ item.club_name }} / {{ item.title }}</div>
                </div>
            </div>
            <div class="pagination">
                <!--总数超过一页，再展示分页器-->
                <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
                    :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
            </div>
        </div>
        <div class="newsCenter" v-if="state.err">
            <el-empty description="该社团还没有新闻" />
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { apiGetNewsList, apiGetRecommendNews } from '@/api/news'
import { useRouter } from "vue-router"
const router = useRouter()
const loading = ref(false)
const state = reactive({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    input: '',
    err: 0, //社团是否发布新闻
    news: [],
    recommendNews: []
})
const changePage = (val) => {
    state.currentPage = val
    getNewsList()
}
const getNewsList = async (key_word) => {
    loading.value = true
    await apiGetNewsList({
        club_id: router.currentRoute.value.params.clubId,
        size: state.pageSize,
        page: state.currentPage,
        key_word: key_word
    }).then(res => {
        if (res.code == '2001') state.err = 1
        state.news = res.data
        state.total = res.count
    }).catch((err) => {
        console.log('activitiesList', err)
        toast(err, 'error', 'Error')
    })
    loading.value = false

}
const getRecommendNews = () => {
    apiGetRecommendNews().then(res => {
        state.recommendNews = res.data.filter(item => item.pic_url !== '')
    }).catch((err) => {
        console.log('activitiesList', err)
        toast(err, 'error', 'Error')
    })
}
const search = () => {
    getNewsList(state.input)
}
onMounted(() => {
    getRecommendNews()
    getNewsList()
})
</script>

<style>
.newsCenter {
    position: relative;
    width: 1250px;
    margin: auto;
}

.news-main {
    width: 78%;
    height: 65vh;
    margin-top: 2%;
    float: left;
}

.news-main-item {
    width: 100%;
    height: 10%;
    padding: 2%;
    background-color: #fff;
    margin-bottom: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.active-sidebar {
    width: 20%;
    height: 515px;
    margin-top: 0.25%;
    margin-left: 2%;
    float: left;
    background-color: #fff;
    padding: 1%;
}

.active-sidebar-img {
    height: 120px;
    width: 100%;
    margin-top: 2%;
}

.active-sidebar-title {
    height: 20px;
    margin-bottom: 5%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.pagination {
    position: absolute;
    top: 72vh;
}
</style>