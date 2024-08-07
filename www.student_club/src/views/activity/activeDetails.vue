<template>
    <div class="main">
        <div class="bread" @click="this.$router.go(-1)">首页>社团活动</div>

        <div class="content-left">
            <el-card class="active_tittle_card">
                <div class="active-detail-title">
                    <div class="active-detail-title-title">{{ state.activeDetail.title }}</div><br>
                    <div class="active-detail-title-name">所属社团:{{ state.activeDetail.club_name }}</div>
                </div>
                <hr>
                <div class="related">
                    <div style="font-size:17px;">
                    </div>
                    <div class="relatedItem">
                        活动时间：{{ state.activeDetail.start_time }} - {{ state.activeDetail.end_time }}
                    </div>
                    <div class="relatedItem">
                        地点：{{ state.activeDetail.address }}
                    </div>
                    <div class="relatedItem">
                        联系方式：{{ state.activeDetail.mobile }}
                    </div>
                    <div class="relatedButton">
                        <el-button type="primary" v-if="!state.isTimeout && !state.attend"
                            @click="attendActivity(state.activeDetail.activity_id)">我要参加</el-button>
                        <el-button type="danger" v-if="!state.isTimeout && state.attend"
                            @click="refuseActivity(state.activeDetail.activity_id)">我要退出</el-button>
                        <el-button type="info" v-if="state.isTimeout" disabled>报名结束</el-button>

                    </div>
                </div>
            </el-card>

            <div class="active_detail_left" v-loading="loading">
                <div class="text" v-html="state.activeDetail.content"></div>
            </div>

        </div>

        <div class="active-sidebar">
            热门活动
            <div class="active-sidebar-item" v-for="(item, index) in state.recommendActives.slice(0, 3)" :key="index">
                <img v-lazy="item.pic_url" alt="" class="active-sidebar-img"
                    @click="$router.push({ params: { activityId: item.activity_id } })" style="cursor: pointer;">
                <div class="active-sidebar-title">【{{ item.club_name }}】{{ item.title }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, watch, ref } from 'vue'
import { apiGetActivitiyDetail, apiGetRecommendActivities, apiAttendActivity, apiExitActivity, apiIsAttendActivity } from '@/api/activity'
import { useRoute, useRouter } from 'vue-router'
import { getCookies, toast } from '@/utils/tool'
export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const loading = ref(false)
        const state = reactive({
            recommendActives: [],
            activeDetail: {},
            attend: false,
            isTimeout: false,
            isLogin: false
        })
        // 检查活动是否结束报名
        const checkTimeout = () => {
            const currentTime = ref(new Date())
            const deadline = new Date(state.activeDetail.start_time)
            if (currentTime.value.getTime() >= deadline.getTime()) {
                state.isTimeout = true
            }
            else {
                state.isTimeout = false
            }
        }
        // 检查是否参加活动
        const checkIsAttend = () => {
            apiIsAttendActivity({
                user_id: getCookies('user_id'),
                user_type: 0,
                activity_id: router.currentRoute.value.params.activityId
            }).then(res => {
                if (res.code == 2000) {
                    state.attend = res.data.is_attended
                } else if (res.code == 2001) {
                    state.attend = res.data.is_attended
                }
            }).catch((err) => {
                console.log('apiIsAttendActivity', err)
                toast(err, 'error', 'Error')
            })
        }
        // 获取最终页内容
        const getActivitiyDetail = async () => {
            loading.value = true
            // 获取活动详情
            await apiGetActivitiyDetail(router.currentRoute.value.params.activityId)
                .then((res) => {
                    state.activeDetail = res.data[0]
                    // console.log(state.activeDetail)
                })
                .catch((err) => {
                    console.log('apiGetActivitiyDetail', err)
                    toast(err, 'error', 'Error')
                })
            await checkTimeout()
            if (state.isLogin && !state.isTimeout) {
                // 查看是否参加活动
                checkIsAttend()
            }
            loading.value = false

        }
        // 热顶活动获取
        const getRecommendActivities = () => {
            apiGetRecommendActivities({
            }).then(res => {
                state.recommendActives = res.data.filter(item => item.pic_url !== '');
            }).catch((err) => {
                console.log('activitiesList', err)
                toast(err, 'error', 'Error')
            })
        }
        // 参加活动
        const attendActivity = async (activity_id) => {
            await apiIsAttendActivity({
                user_id: getCookies('user_id'),
                user_type: 0,
                activity_id: activity_id
            }).then(res => {
                // console.log(res)
                if (res.code == 2000) {
                    state.attend = res.data.is_attended
                    toast('已参加')
                } else if (res.code == 2001) {
                    state.attend = res.data.is_attended
                    apiAttendActivity({
                        user_id: getCookies('user_id'),
                        user_type: 0,
                        activity_id: activity_id
                    }).then(res => {
                        getActivitiyDetail()
                    }).catch((err) => {
                        console.log('activitiesList', err)
                        toast(err, 'error', 'Error')
                    })
                }
            }).catch((err) => {
                console.log('apiIsAttendActivity', err)
                toast(err, 'error', 'Error')
            })
        }
        // 退出活动
        const refuseActivity = async (activity_id) => {
            await apiIsAttendActivity({
                user_id: getCookies('user_id'),
                user_type: 0,
                activity_id: activity_id
            }).then(res => {
                if (res.code == 2000) {
                    state.attend = res.data.is_attended
                    apiExitActivity({
                        user_id: getCookies('user_id'),
                        user_type: 0,
                        activity_id: activity_id
                    }).then(res => {
                        getActivitiyDetail()
                    }).catch((err) => {
                        console.log('activitiesList', err)
                        toast(err, 'error', 'Error')
                    })
                } else if (res.code == 2001) {
                    state.attend = res.data[0].is_attended
                    toast('未参加活动，无需退出')
                }
            }).catch((err) => {
                console.log('apiIsAttendActivity', err)
                toast(err, 'error', 'Error')
            })
        }
        // 预加载
        onMounted(() => {
            state.isLogin = getCookies('isLogin')
            getActivitiyDetail()
            getRecommendActivities()
        })
        // 监听 路由变化
        watch(() =>
            router.currentRoute.value.path,
            (toPath) => {
                if (toPath.includes('/activities/details/')) {
                    getActivitiyDetail(),
                        getRecommendActivities()
                }
            }, { immediate: true, deep: true })
        return {
            state,
            attendActivity,
            refuseActivity,
            loading
        }
    }
}


</script>

<style scoped>
.main {
    width: 1250px;
    margin: auto;
    overflow: hidden;
}

.content-left {
    float: left;
}

.active_tittle_card {
    width: 985px;
    background-color: #fff;
    margin-top: 3px;
    padding: 1%
}

.active_detail_left {
    width: 985px;
    background-color: #fff;
    margin-top: 3px;
    padding: 1%;
}


.text {
    padding: 5% 0 5% 0;
}

.related {
    padding: 0.5% 2% 0 2%;
    color: #999;
}

.relatedItem {
    width: 100%;
}

.relatedItem {
    float: left;
    width: 80%;
    margin-top: 5px;
}

.relatedButton {
    float: right;
    width: 15%;
    text-align: center;
}

.active-sidebar {
    width: 260px;
    height: 550px;
    margin-top: 0.35%;
    margin-left: 5px;
    float: right;
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