<template>
    <div class="news-main" v-loading="loading">
        <div class="news-main-item" v-for="(item, index) in state.news" :key="index"
            @click="$router.push({ name: 'NewsDetails', params: { newsId: item.news_id } })" style="cursor: pointer;">
            <span>【{{ item.club_name }}】{{ item.title }}</span>
            <span style="float: right;">{{ item.create_time }}</span>

        </div>
    </div>
    <div class="pagination">
        <!--总数超过一页，再展示分页器-->
        <el-pagination background :hide-on-single-page="true" layout="prev, pager, next"
            :total="state.total" :page-size="state.pageSize" :current-page="state.currentPage"
            @current-change="changePage" />
    </div>
</template>

<script>
import { reactive, onMounted, watch, ref } from 'vue'
import { apiGetNewsList } from '@/api/news'
import { useRoute, useRouter } from "vue-router"

export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const loading = ref(false)
        const state = reactive({
            total: 0,
            pageSize: 10,
            currentPage: 1,
            input: '',
            news: []
        })
        const changePage = (val) => {
            state.currentPage = val
            getNewsList()
        }
        const getNewsList = async () => {
            loading.value = true
            await apiGetNewsList({
                size: state.pageSize,
                page: state.currentPage,
                key_word: route.query.key_word
            }).then(res => {
                state.news = res.data
                state.total = res.count
            }).catch((err) => {
                console.log('activitiesList', err)
                toast(err, 'error', 'Error')
            })
            loading.value = false

        }
        onMounted(() => {
            getNewsList()
        })
        watch(() =>
            router.currentRoute.value.path,
            (toPath) => {
                getNewsList()
            }, { immediate: true, deep: true })
        return {
            state, changePage, loading
        }

    }
}
</script>

<style scoped>
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
.pagination {
  position: absolute;
  top: 72vh;
}
</style>