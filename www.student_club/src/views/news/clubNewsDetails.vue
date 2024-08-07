<template>
    <div>
        <div class="bread"><el-icon>
                <CaretLeft />
            </el-icon><span @click="this.$router.go(-1)" style="cursor: pointer;">返回上一页</span></div>
        <div class="main" v-loading="loading">
            <div class="news_detail_left">
                <div class="active-detail-title">
                    <div class="active-detail-title-title">{{ state.news.title }}</div><br>
                    <div class="active-detail-title-name">{{ state.news.publish_time }}</div>
                </div>
                <hr>
                <div class="text" v-html="state.news.content"></div>
                <hr>
                <div class="related">
                    <div class="relatedLeft">
                        {{ state.news.club_name }}
                    </div>
                    <div class="relatedButton">
                        编辑：{{ state.news.editor }}
                    </div>
                </div>
            </div>
            <div class="active-sidebar">
                热点新闻
                <div class="active-sidebar-item" v-for="(item, index) in state.recommendNews.slice(0, 3)" :key="index">
                    <img v-lazy="item.pic_url" alt="" class="active-sidebar-img"
                        @click="$router.push({ params: { newsId: item.news_id } })" style="cursor: pointer;">
                    <div class="active-sidebar-title">{{ item.club_name }} / {{ item.title }}</div>

                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { CaretLeft } from '@element-plus/icons-vue'
import { onMounted, reactive, watch, ref } from 'vue'
import { apiGetNewsDetail, apiGetRecommendNews } from '@/api/news'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const state = reactive({
    news: {},
    recommendNews: []
})
const getNewsDetail = async () => {
    loading.value = true
    await apiGetNewsDetail(router.currentRoute.value.params.newsId)
        .then((res) => {
            state.news = res.data
        })
        .catch((err) => {
            console.log('apiGetNewsDetail', err)
            toast(err, 'error', 'Error')
        })
    loading.value = false

}
const getRecommendNews = () => {
    apiGetRecommendNews().then(res => {
        state.recommendNews = res.data.filter(item => item.pic_url !== '');
    }).catch((err) => {
        console.log('activitiesList', err)
        toast(err, 'error', 'Error')
    })
}
watch(() =>
    router.currentRoute.value.path,
    (toPath) => {
        getNewsDetail(),
            getRecommendNews()
    }, { immediate: true, deep: true })
onMounted(() => {
    getNewsDetail()
    getRecommendNews()
})
</script>
  
<style scoped>
.main {
    width: 1250px;
    clear: both;
    margin: auto;
    overflow: hidden;
}

.news_detail_left {
    width: 985px;
    background-color: #fff;
    float: left;
    padding: 1%;
    margin-top: 3px;
}

.newsDetail_title {
    width: 100%;
    height: 60px;
    position: relative;
}

.text {
    padding: 5% 0.5% 5% 0.5%;
}

.text img {
    width: 500px;
    height: 300px;
    margin: auto;
    padding-top: 15px;
    padding-bottom: 15px;
}

.related {
    padding: 0.5% 0.5% 0 0.5%;
}

.relatedItem {
    width: 100%;
}

.relatedLeft {
    float: left;
    width: 40%;
}

.relatedButton {
    float: right;
    width: 15%;
    text-align: center;
}

.active-sidebar {
    width: 260px;
    height: 550px;
    margin-top: 0.25%;
    margin-left: 5px;
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