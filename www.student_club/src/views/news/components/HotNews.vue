<template>
    <div class="active-search">
        <div class="input"><el-input v-model="state.input" placeholder="请输入新闻标题" /></div>
        <div class="button"><el-button type="primary" plain @click="search">搜索</el-button></div>
    </div>
    <div class="active-sidebar">
        热点新闻
        <div class="active-sidebar-item" v-for="(item, index) in state.recommendNews.slice(0, 3)" :key="index">
            <img v-lazy="item.pic_url" alt="" class="active-sidebar-img"
                @click="$router.push({ name: 'NewsDetails', params: { newsId: item.news_id } })" style="cursor: pointer;">
            <div class="active-sidebar-title">{{ item.club_name }} / {{ item.title }}</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { apiGetRecommendNews } from '@/api/news'
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const state = reactive({
    input: '',
    recommendNews: []
})
const getRecommendNews = () => {
    apiGetRecommendNews().then(res => {
        state.recommendNews = res.data.filter(item => item.pic_url !== '')
    }).catch((err) => {
        console.log('activitiesList', err)
        toast(err, 'error', 'Error')
    })
}
const search = () => {
    router.push({
        query: { key_word: state.input }
    })
    // if (location.href.indexOf("key_word") == -1) {
    //   location.href = location.href +'?key_word='+ state.input;
    //   location.reload();
    // }
}
onMounted(() => {
    getRecommendNews()
})
</script>

<style>
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
</style>