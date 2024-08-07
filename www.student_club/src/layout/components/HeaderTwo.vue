<template>
    <div class="titlebg">
        <div class="nav">
            <div>
                <div class="imgbox" @click="toNew"><img src="@/assets/images/ncepu.jpg"></div>
                <div class="titlebox">
                    <span class="title1" @click="toNew">华北电力大学</span><br>
                    <span class="title2" @click="toNew">社团管理平台</span>
                </div>
            </div>
            <div>
                <div class="imgbox2"><el-avatar :size="60" style="margin-top: 10px;" :src="state.logo_url" /></div>
                <div class="titlebox2" @click="$router.push({ name: 'ClubMain', query: { club_id: state.club_id } })">
                    <span class="title3" v-if="state.club_name.length < 15">{{ state.club_name }}</span>
                    <span class="title4" v-if="state.club_name.length > 15">{{ state.club_name }}</span>
                </div>
            </div>

            <div v-if="!state.isLogin" class="load">
                <el-button type="primary" @click="$router.push({ path: '/login' })">登录</el-button>
                <el-button link style="padding-left:0" @click="$router.push({ path: '/register' })">注册</el-button>
            </div>
            <div class="load" v-else-if="state.isLogin">
                <el-dropdown trigger="click" size="mini" style="height:30px">
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <span><el-avatar :size="30" :src="state.head_pic" /></span>
                        <div>{{ state.user_name }}</div>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-menu text-color="#333">
                                <el-dropdown-item @click="$router.push({ name: 'PersonalCenter' })">个人中心</el-dropdown-item>
                                <el-dropdown-item @click="$router.push({ name: 'MyClub' })">我的社团</el-dropdown-item>
                                <el-dropdown-item @click="exit()">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="navBar">
                <router-link v-for="(item, index) in state.menu" :key="index" class="nav_item"
                    :to="{ name: item.path, params: { clubId: $router.currentRoute.value.params.clubId } }"
                    @click="btn(index)">
                    <span :class="{ active: index === state.findIndex }">{{ item.name }}</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, onUpdated, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { getCookies, setCookies, toast } from '@/utils/tool';
import { removeCookies } from '@/utils/tool';
import { apiClubSummarydata } from '@/api/club'
import APP_CONFIG from '@/config/index.js'

export default {
    setup() {
        const router = useRouter()
        const state = reactive({
            isLogin: "",
            Token: "",
            club_id: "",
            head_pic: "",
            user_name: "",
            logo_url: '',
            club_name: '',
            menu: [{
                path: "ClubMain",
                name: "社团首页"
            }, {
                path: "ClubActivities",
                name: "社团活动"
            }, {
                path: "ClubNews",
                name: "社团新闻"
            }, {
                path: "ClubNotices",
                name: "通知公告"
            }, {
                path: "MemberAppearance",
                name: "成员风采"
            },],
            findIndex: 0
        })
        // 获取社团信息
        const getData = () => {
            setCookies('club_id', router.currentRoute.value.params.clubId)
            state.club_id = getCookies("club_id")
            apiClubSummarydata(state.club_id, {
                student_id: getCookies('user_id')
            })
                .then((res) => {
                    state.logo_url = res.data.logo_url
                    if (state.logo_url) {
                        if (!state.logo_url.includes(APP_CONFIG.BASEURL_PIC)) {
                            state.logo_url = APP_CONFIG.BASEURL_PIC + state.logo_url
                        }
                    }
                    else {
                        state.logo_url = APP_CONFIG.BASE_PIC
                    }
                    state.club_name = res.data.club_name
                })
                .catch((err) => {
                    console.log('apiClubSummarydata', err)
                    toast(err, 'error', 'Error')
                })
        }
        const exit = () => {
            removeCookies('token');
            removeCookies('isLogin');
            removeCookies('account');
            removeCookies('user_id');
            removeCookies('user_name');
            removeCookies('nickname');
            removeCookies('club_id');
            removeCookies('head_pic');
            state.isLogin = false
            router.push({
                name: "ClubMain",
                params: { clubId: state.club_id }
            });
        }
        const getIsLogin = () => {
            state.isLogin = getCookies('isLogin')
            state.user_name = (getCookies('user_name') === '' ? getCookies('user_info').nick_name : getCookies('user_name'))
            state.head_pic = getCookies('head_pic')
        }
        const toNew = () => {
            let newpath = router.resolve({ path: '/' })
            window.open(newpath.href, '_blank')
        }
        // 检查当前页的标签
        const checkIndex = () => {
            const href = window.location.href
            if (href.includes('club-activities')) {
                state.findIndex = 1
            } else if (href.includes('club-news')) {
                state.findIndex = 2
            }
            else if (href.includes('club-notices')) {
                state.findIndex = 3
            }
            else if (href.includes('memberAppearance')) {
                state.findIndex = 4
            }
        }
        onUpdated(() => {
            getIsLogin()
        })
        onMounted(() => {
            getData()
            checkIndex()
        })
        const btn = (index) => {
            state.findIndex = index
        }
        return {
            state,
            exit, btn, toNew
        };

    }
}

</script>

<style scoped>
.titlebg {
    width: 100%;
    height: 80px;
    background-color: rgb(255, 255, 253);
}

.nav {
    width: 1250px;
    height: 80px;
    margin: auto;
    position: relative;
}

.imgbox {
    display: inline-block;
    width: 70px;
    height: 70px;
    position: absolute;
    left: 0;
    cursor: pointer;
}

.titlebox {
    position: absolute;
    left: 70px;
    width: 250px;
    cursor: pointer;
}

.imgbox2 {
    display: inline-block;
    width: 70px;
    height: 70px;
    cursor: pointer;
    position: absolute;
    left: 230px;
}

.titlebox2 {
    position: absolute;
    left: 300px;
    width: 200px;
}

.title1 {
    font-size: 26px;
    font-weight: 100;
    position: absolute;
    top: 10px;
    height: 35px;
}

.title2 {
    display: inline-block;
    font-size: 16px;
    position: absolute;
    top: 45px;
    font-weight: 100;
}

.title3 {
    font-size: 26px;
    font-weight: 100;
    position: absolute;
    top: 20px;
    height: 35px;
}

.title4 {
    font-size: 15px;
    font-weight: 100;
    position: absolute;
    top: 20px;
    height: 40px;
    overflow: hidden;
}

.navBar {
    position: absolute;
    right: 120px;
    top: 45px;
}

.nav_item {
    display: inline-block;
    width: 100px;
    text-align: center;
}

.load {
    position: absolute;
    right: 0;
    top: 40px;
}


.active {
    color: #409EFF;
}
</style>
