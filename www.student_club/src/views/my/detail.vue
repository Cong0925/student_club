<template>
    <div class="main">
        <div class="bread"><el-icon>
                <CaretLeft />
            </el-icon><span @click="returnMyPosted()" style="cursor: pointer;">返回上一页</span></div>
        <div v-loading="loading">
            <div class="active_detail_title">
                <div style="font-size:25px;text-align:center;">{{ state.detail.title }}</div>
                <div style="font-size:15px;color: #999;position: absolute;right:3%" v-if="$route.params.detailSize == 1">
                    {{ state.detail.club_name }}</div>
                <div style="font-size:15px;color: #999;position: absolute;right:3%" v-if="$route.params.detailSize != 1">
                    {{ state.detail.create_time }}</div>
            </div>
            <hr>
            <div class="text" v-html="state.detail.content"></div>
            <div class="download">
                <div v-if="state.file_info != null">
                    <div v-for="(item, index) in state.file_info" :key="index">
                        <a :href="item.file_url" :download="item.file_name">{{ item.file_name }}</a>
                    </div>
                </div>
            </div><br>
            <hr>
            <div class="related">
                <div style="font-size:17px;">
                </div>
                <div class="relatedLeft" v-if="$route.params.detailSize == 1">
                    地点：{{ state.detail.address }}
                </div>
                <div class="relatedRight" v-if="$route.params.detailSize == 1">
                    联系方式：{{ state.detail.mobile }}
                </div>
                <div class="relatedLeft" v-if="$route.params.detailSize == 1">
                    活动时间：{{ state.detail.start_time }} <br> <span style="margin-left:75px">- {{ state.detail.end_time
                    }}</span>
                </div>
                <div class="relatedLeft" v-if="$route.params.detailSize != 1">
                    {{ state.detail.club_name }}
                </div>
                <div style="float: right;" v-if="$route.params.detailSize != 1">
                    编辑：{{ state.detail.editor }}
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
import { onMounted, reactive,ref  } from 'vue'
import { apiMyActivityDetail } from '@/api/activity'
import { useRoute, useRouter } from 'vue-router'
import { getCookies, toast } from '@/utils/tool'
import { apiMyNewsDetail } from '@/api/news'
import { apiMyNoticeDetail } from '@/api/notice'
export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const loading = ref(false)
        const state = reactive({
            detail: {},
            file_info: []
        })
        const getDetail = async () => {
            loading.value = true
            if (route.params.detailSize == 1) {
                // console.log(getCookies('user_id'));
                await apiMyActivityDetail({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    activity_id: route.params.detailId
                })
                    .then((res) => {
                        state.detail = res.data
                    })
                    .catch((err) => {
                        console.log('apiGetActivitiyDetail', err)
                        toast(err, 'error', 'Error')
                    })
            } else if (route.params.detailSize == 2) {
                await apiMyNewsDetail({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    news_id: route.params.detailId
                })
                    .then((res) => {
                        state.detail = res.data
                    })
                    .catch((err) => {
                        console.log('apiGetNewsDetail', err)
                        toast(err, 'error', 'Error')
                    })
            } else if (route.params.detailSize == 3) {
                await apiMyNoticeDetail({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    notice_id: route.params.detailId
                })
                    .then((res) => {
                        state.detail = res.data
                        if (res.data.file_info != null) {
                            let file = JSON.parse(res.data.file_info)
                            state.file_info = file.file_info
                        }
                    })
                    .catch((err) => {
                        console.log('apiGetNoticeDetail', err)
                        toast(err, 'error', 'Error')
                    })
            }
            loading.value = false
        }
        const returnMyPosted = () => {
            if (route.params.detailSize == 1) {
                router.replace({ name: "MyPosted", query: { activeTabName: 'first' } })
            }
            else if (route.params.detailSize == 2) {
                router.replace({ name: "MyPosted", query: { activeTabName: 'second' } })
            }
            else if (route.params.detailSize == 3) {
                router.replace({ name: "MyPosted", query: { activeTabName: 'third' } })
            }
        }
        onMounted(() => {
            getDetail()
        })
        return {
            state,
            loading,
            returnMyPosted
        }
    }
}
</script>
  
<style scoped>
.main {
    width: 98%;
    /* height: calc(100vh - 100px); */
    margin: auto;
    padding: 2%;
    background-color: #fff;
    margin-top: 5px;
    overflow: hidden;
}

.active_detail_title {
    width: 100%;
    height: 60px;
    position: relative;
}

.text {
    padding: 5% 0 5% 0;
}

.download {
    color: dodgerblue;
    font-size: 13px;
    cursor: pointer;
}

.related {
    padding: 0.5% 2% 0 2%;
    color: #999;
}

.relatedItem {
    width: 100%;
}

.relatedLeft {
    float: left;
    width: 50%;
}

.relatedRight {
    float: left;
    width: 45%;
    text-align: left;
}
</style>