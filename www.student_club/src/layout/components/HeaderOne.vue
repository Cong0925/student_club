<template>
    <div class="titlebg">
        <div class="nav">
            <div>
                <div class="imgbox"><img src="@/assets/images/ncepu.jpg"></div>
                <div class="titlebox">
                    <span class="title1" @click="$router.push('/')">华北电力大学</span><br>
                    <span class="title2" @click="$router.push('/')">社团管理平台</span>
                </div>
            </div>

            <div class="navBar">
                <router-link v-for="(item, index) in state.menu" :key="index" class="nav_item" :to="item.path"
                    @click="btn(index)">
                    <span :class="{ active: index === state.findIndex }">{{ item.name }}</span>
                </router-link>
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
        </div>
    </div>
</template>

<script>
import { reactive, onUpdated, onMounted, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { getCookies, setCookies } from '@/utils/tool';
import { removeCookies } from '@/utils/tool';

export default {
    setup() {
        const router = useRouter()
        const state = reactive({
            isLogin: false,
            Token: "",
            head_pic: "",
            user_name: "",
            menu: [{
                path: "/",
                name: "首页"
            }, {
                path: "/activities",
                name: "社团活动"
            }, {
                path: "/news",
                name: "社团新闻"
            }, {
                path: "/notices",
                name: "通知公告"
            }, {
                path: "/clubList",
                name: "社团列表"
            },],
            findIndex: 0
        })

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
                path: "/"
            });
        }
        const getIsLogin = () => {
            state.isLogin = getCookies('isLogin')
            state.user_name = (getCookies('user_name') === '' ? getCookies('user_info').nick_name : getCookies('user_name'))
            state.head_pic = getCookies('head_pic')
        }
        onUpdated(() => {
            getIsLogin()
        })
        onMounted(() => {
            state.isLogin = getCookies('isLogin')
            state.user_name = (getCookies('user_name') === '' ? getCookies('user_info').nick_name : getCookies('user_name'))
            state.head_pic = getCookies('head_pic')
            checkIndex()
        })
        watch(() =>
            router.currentRoute.value.path,
            (toPath) => {
                state.isLogin = getCookies('isLogin')
            }, { immediate: true, deep: true })


        // 检查当前页的标签
        const checkIndex = () => {
            const href = window.location.href
            if (href.includes('activities')) {
                state.findIndex = 1
            } else if (href.includes('news')) {
                state.findIndex = 2
            }
            else if (href.includes('notices')) {
                state.findIndex = 3
            }
            else if (href.includes('clubList')) {
                state.findIndex = 4
            }
        }
        const btn = (index) => {
            state.findIndex = index
        }
        return {
            state,
            exit,
            btn
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
    cursor: pointer;
    position: absolute;
    left: 0;
}

.titlebox {
    position: absolute;
    left: 70px;
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
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 40px;
}

.user_name {
    position: absolute;
    top: 8px;
    right: 5px;
}

.active {
    color: #409EFF;
}

/* 
@media screen and (max-width: 950px) {
.nav>a{
    font-size: 12px;
    height: 20px;
    margin-top: 40px;
    line-height: 20px;
}
.title1{
    font-size: 20px;
}
.title2{
    font-size: 14px;
}
}  */
</style>
