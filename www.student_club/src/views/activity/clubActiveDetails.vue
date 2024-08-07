<template>
    <div class="main">
        <div class="bread"><el-icon>
                <CaretLeft />
            </el-icon>
            <span @click="this.$router.go(-1)" style="cursor: pointer;">返回上一页</span>
        </div>

        <div class="content-left" v-loading="loading">
            <el-card class="active_tittle_card">
                <div class="active-detail-title">
                    <div class="active-detail-title-title">{{ state.activeDetail.title }}</div><br>
                    <div class="active-detail-title-name">{{ state.activeDetail.club_name }}</div>
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

            <div class="active_detail_left" >
                <div class="text" v-html="state.activeDetail.content"></div>
            </div>
            <hr>

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
import { CaretLeft } from '@element-plus/icons-vue'
export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const loading = ref(false)
        const state = reactive({
            recommendActives: [],
            activeDetail: {},
            attend: false,
            isLogin: false,
            isTimeout: false
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
                    // console.log(state.attend);
                } else if (res.code == 2001) {
                    state.attend = res.data.is_attended
                    // console.log(state.attend);
                }
            }).catch((err) => {
                console.log('apiIsAttendActivity', err)
                toast(err, 'error', 'Error')
            })
        }
        const getActivitiyDetail = async () => {
            loading.value = true
            await apiGetActivitiyDetail(router.currentRoute.value.params.activityId)
                .then((res) => {
                    state.activeDetail = res.data[0]
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
        const getRecommendActivities = () => {
            apiGetRecommendActivities({
            }).then(res => {
                state.recommendActives = res.data.filter(item => item.pic_url !== '');
            }).catch((err) => {
                console.log('activitiesList', err)
                toast(err, 'error', 'Error')
            })
        }
        const attendActivity = (activity_id) => {
            apiIsAttendActivity({
                user_id: getCookies('user_id'),
                user_type: 0,
                activity_id: activity_id
            }).then(res => {
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
        const refuseActivity = (activity_id) => {
            apiIsAttendActivity({
                user_id: getCookies('user_id'),
                user_type: 0,
                activity_id: router.currentRoute.value.params.activityId
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
        onMounted(() => {
            state.isLogin = getCookies('isLogin')
            getActivitiyDetail(),
                getRecommendActivities()
        })
        watch(() =>
            router.currentRoute.value.path,
            (toPath) => {
                if (toPath.includes('/club-activities/details/')) {
                    getActivitiyDetail(),
                        getRecommendActivities()
                }
            }, { immediate: true, deep: true })
        return {
            state,
            attendActivity,
            refuseActivity,
            loading,
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