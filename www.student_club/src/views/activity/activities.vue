<template>
    <div class="activeCenter">
        <div class="active-main" v-loading="state.loading">
            <div class="active-main-item" v-for="(item, index) in state.actives" :key="index">
                <div class="active-main-item-left"
                    @click="$router.push({ name: 'ActiveDetails', params: { activityId: item.activity_id } })"
                    style="cursor: pointer;">活动主题：{{ item.title }}</div>
                <div class="active-main-item-left"
                    @click="$router.push({ name: 'ActiveDetails', params: { activityId: item.activity_id } })"
                    style="cursor: pointer;">时间：{{ item.start_time }} &nbsp;&nbsp;&nbsp;&nbsp; 地址：{{ item.address }}</div>
                <div class="active-main-item-button">
                    <el-button type="primary" v-if="!state.isTimeout[index] && !state.attend[index]"
                        @click="attendActivity(item.activity_id)">我要参加</el-button>
                    <el-button type="danger" v-if="!state.isTimeout[index] && state.attend[index]"
                        @click="refuseActivity(item.activity_id)">我要退出</el-button>
                    <el-button type="info" v-if="state.isTimeout[index]" disabled>报名结束</el-button>

                </div>
                <div class="active-main-item-left"
                    @click="$router.push({ name: 'ActiveDetails', params: { activityId: item.activity_id } })"
                    style="cursor: pointer;">社团：{{ item.club_name }}</div>
            </div>
            <!--总数超过一页，再展示分页器-->

        </div>
        <div class="pagination">
            <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
                :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
        </div>
        <div class="active-search">
            <div class="input"><el-input v-model="state.input" placeholder="请输入活动标题" /></div>
            <div class="button">
                <el-button type="primary" plain @click="search">搜索</el-button>
            </div>
        </div>
        <div class="active-sidebar">
            热门活动
            <div class="active-sidebar-item" v-for="(item, index) in state.recommendActives.slice(0, 3)" :key="index">
                <img v-lazy="item.pic_url" alt="" class="active-sidebar-img"
                    @click="$router.push({ name: 'ActiveDetails', params: { activityId: item.activity_id } })"
                    style="cursor: pointer;">
                <div class="active-sidebar-title">【{{ item.club_name }}】{{ item.title }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { toast, getCookies } from "@/utils/tool"
import { apiGetActivitiesList, apiGetRecommendActivities, apiAttendActivity, apiExitActivity, apiIsAttendActivity } from '@/api/activity'
import { useRouter } from "vue-router";
const state = reactive({
    loading: false,
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 6, // 分页大小
    actives: [],
    input: '',
    recommendActives: [],
    attend: [false],
    isTimeout: [false]
})


const router = useRouter()
// 获取活动列表
const getActivityList = async (key_word, id) => {
    state.loading = true
    await apiGetActivitiesList({ size: state.pageSize, page: state.currentPage, key_word: key_word })
        .then((res) => {
            state.actives = res.data
            state.total = res.count
        })
        .catch((err) => {
            console.log('activitiesList', err)
            toast(err, 'error', 'Error')
        })
    state.loading = false
    checkTimeout()
}
const checkTimeout = () => {
    const currentTime = ref(new Date())
    if (getCookies('user_id') && state.actives) {
        state.actives.forEach((element, i) => {
            const deadline = new Date(element.start_time)
            if (currentTime.value.getTime() >= deadline.getTime()) {
                state.isTimeout[i] = true
            }
            else {
                state.isTimeout[i] = false
                isAttend(element.activity_id, i)
            }

        });
    }
}
// 热门活动
const getRecommendActivities = () => {
    apiGetRecommendActivities()
        .then(res => {
            state.recommendActives = res.data.filter(item => item.pic_url !== '');
        }).catch((err) => {
            console.log('activitiesList', err)
            toast(err, 'error', 'Error')
        })
}
// 分页
const changePage = (val) => {
    state.currentPage = val
    getActivityList()
}
// 参加活动
const attendActivity = async (activity_id) => {
    state.loading = true
    await apiIsAttendActivity({
        user_id: getCookies('user_id'),
        user_type: 0,
        activity_id: activity_id
    }).then(res => {
        if (res.code == 2000) {
            toast('您已参加该活动')
        } else if (res.code == 2001) {
            // 参加
            apiAttendActivity({
                user_id: Number(getCookies('user_id')),
                user_type: 0,
                activity_id: Number(activity_id)
            }).then(res => {
                toast('参加成功')
            }).catch((err) => {
                console.log('activitiesList', err)
                toast(err, 'error', 'Error')
            })
        }
    }).catch((err) => {
        console.log('apiIsAttendActivity', err)
        toast(err, 'error', 'Error')
        return false
    })
    state.loading = false
    getActivityList()
}
// 退出活动
const refuseActivity = async (activity_id) => {
    state.loading = true
    await apiIsAttendActivity({
        user_id: getCookies('user_id'),
        user_type: 0,
        activity_id: activity_id
    }).then(res => {
        if (res.code == 2000) {
            // 退出
            apiExitActivity({
                user_id: getCookies('user_id'),
                user_type: 0,
                activity_id: activity_id
            }).then(res => {
                toast('退出成功')
            }).catch((err) => {
                console.log('activitiesList', err)
                toast(err, 'error', 'Error')
            })
        } else if (res.code == 2001) {
            toast('您已退出该活动！')
        }
    }).catch((err) => {
        console.log('apiIsAttendActivity', err)
        toast(err, 'error', 'Error')
        return false
    })
    state.loading = false
    getActivityList()
}
// 搜索
const search = () => {
    getActivityList(state.input)
}
// 预加载
onMounted(() => {
    getActivityList()
    getRecommendActivities()
})
// 判断是否参加活动
const isAttend = (id, i) => {
    apiIsAttendActivity({
        user_id: getCookies('user_id'),
        user_type: 0,
        activity_id: id
    }).then(res => {
        if (res.code == 2000) {
            state.attend[i] = true
        } else if (res.code == 2001) {
            state.attend[i] = false
        }
    }).catch((err) => {
        console.log('apiIsAttendActivity', err)
        toast(err, 'error', 'Error')
        return false
    })
}
</script>

<style scoped>
.activeCenter {
    position: relative;
    width: 1250px;
    margin: auto;
}

.active-main {
    width: 78%;
    height: 65vh;
    margin-top: 2%;
    float: left;
}

.active-main-item {
    width: 100%;
    min-height: 80px;
    height: 11vh;
    padding: 2%;
    background-color: #fff;
    margin-bottom: 2px;
}

.active-main-item-left {
    float: left;
    width: 70%;
    height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.active-main-item-right {
    float: left;
    width: 15%;
    text-align: center;
}

.active-main-item-button {
    float: right;
    width: 15%;
    text-align: center;

}

.active-sidebar {
    width: 20%;
    height: 506px;
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
    top:72vh;
}
</style>