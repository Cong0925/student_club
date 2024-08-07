import { createRouter, createWebHashHistory } from "vue-router"

import Login from '@/views/login/login.vue'
import Register from '@/views/login/register.vue'
import Main from '@/views/home/index.vue'

import Activities from '@/views/activity/activities.vue'
import ActiveDetails from '@/views/activity/activeDetails.vue'
import News from '@/views/news/index.vue'
import NewsDetails from '@/views/news/newsDetails.vue'
import Notices from '@/views/notice/notices.vue'
import NoticeDetails from '@/views/notice/noticeDetails.vue'
import ClubList from '@/views/clubList/clubList.vue'

import PersonalCenter from '@/views/my/index.vue'
import MyInformation from '@/views/my/information.vue'
import MyAllMemberAppearance from '@/views/my/memberAppearance.vue'
import MyClub from '@/views/my/club.vue'
import MyFocus from '@/views/my/focus.vue'
import MyPosted from '@/views/my/posted.vue'
import MyAttended from '@/views/my/attended.vue'
import ApplyClub from '@/views/my/apply.vue'
import MyDetail from '@/views/my/detail.vue'
import MyModify from '@/views/my/modify.vue'

import ClubCenter from '@/views/admin/clubCenter.vue'
import ClubMembers from '@/views/admin/clubMembers.vue'
import MyChecked from '@/views/admin/myChecked.vue'
import AddMember from '@/views/admin/addMember.vue'
import ClubCenterDetails from '@/views/admin/details.vue'

import ClubMain from '@/views/clubMain/clubMain.vue'
import ClubActivities from '@/views/activity/clubActivities.vue'
import ClubActiveDetails from '@/views/activity/clubActiveDetails.vue'
import ClubNews from '@/views/news/clubNews.vue'
import ClubNewsDetails from '@/views/news/clubNewsDetails.vue'
import ClubNotices from '@/views/notice/clubNotices.vue'
import ClubNoticeDetails from '@/views/notice/clubNoticeDetails.vue'
import MemberAppearance from '@/views/member/memberAppearance.vue'
import MemberSpace from '@/views/member/memberSpace.vue'
import MemberAppearDetails from '@/views/member/memberAppearDetails.vue'

import NotFound from '@/views/404.vue'
import Layout from '@/layout/index.vue'

import { APIFetchWeixinBind, APIFetchWeixinLogin } from "@/api/wxLogin.js";
import { getCookies, setCookies, toast } from '@/utils/tool'

const routes = [
    {
        path: '/',
        redirect: '/index',
        component: Layout,
        children: [{
            path: 'index',
            name: 'index',
            component: Main,
            meta: {
                title: '首页'
            }
        }, {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: '登录'
            }
        }, {
            path: '/register',
            name: 'Register',
            component: Register,
            meta: {
                title: '注册'
            }
        }, {
            path: '/activities',
            name: 'Activities',
            component: Activities,
        }, {
            name: 'ActiveDetails',
            path: '/activities/details/:activityId',
            component: ActiveDetails,
        }, {
            path: '/news',
            name: 'News',
            component: News,
        }, {
            path: '/news/details/:newsId',
            name: 'NewsDetails',
            component: NewsDetails,
        }, {
            path: '/notices',
            name: 'Notices',
            component: Notices,
        }, {
            path: '/notices/details/:noticeId',
            name: 'NoticeDetails',
            component: NoticeDetails,
        }, {
            path: '/clubList',
            name: 'ClubList',
            component: ClubList,
        }, {
            // 个人中心
            path: '/my',
            name: 'PersonalCenter',
            component: PersonalCenter,
            redirect: '/my/information',
            children: [
                {
                    name: 'MyInformation',
                    path: '/my/information',
                    component: MyInformation,
                }, {
                    name: 'MyAllMemberAppearance',
                    path: '/my/myAllMemberAppearance',
                    component: MyAllMemberAppearance,
                }, {
                    name: 'MyClub',
                    path: '/my/club',
                    component: MyClub,
                }, {
                    name: 'MyFocus',
                    path: '/my/focus',
                    component: MyFocus,
                }, {
                    name: 'MyPosted',
                    path: '/my/posted',
                    component: MyPosted,
                }, {
                    name: 'MyAttended',
                    path: '/my/attended',
                    component: MyAttended,
                }, {
                    name: 'ApplyClub',
                    path: '/my/apply',
                    component: ApplyClub,
                }, {
                    name: 'MyDetail',
                    path: '/my/detail/:detailSize/:detailId',
                    component: MyDetail,
                }, {
                    name: 'MyModify',
                    path: '/my/modify/:modifySize/:modifyId',
                    component: MyModify,
                }
            ]
        }, {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
        },
        {
            // 社团管理
            path: '/admin/main/:clubId',
            name: 'ClubCenter',
            component: ClubCenter,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/admin/members/:clubId',
            name: 'ClubMembers',
            component: ClubMembers,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/admin/checked/:clubId',
            name: 'MyChecked',
            component: MyChecked,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/admin/add/:clubId',
            name: 'AddMember',
            component: AddMember,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/admin/details/:clubId/:size/:id',
            name: 'ClubCenterDetails',
            component: ClubCenterDetails,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            // 具体社团界面
            path: '/club-main/:clubId',
            name: 'ClubMain',
            component: ClubMain,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/club-activities/:clubId',
            name: 'ClubActivities',
            component: ClubActivities,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            name: 'ClubActiveDetails',
            path: '/club-activities/details/:clubId/:activityId',
            component: ClubActiveDetails,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/club-news/:clubId',
            name: 'ClubNews',
            component: ClubNews,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/club-news/details/:clubId/:newsId',
            name: 'ClubNewsDetails',
            component: ClubNewsDetails,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/club-notices/:clubId',
            name: 'ClubNotices',
            component: ClubNotices,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/club-notices/details/:clubId/:noticeId',
            name: 'ClubNoticeDetails',
            component: ClubNoticeDetails,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/memberAppearance/:clubId',
            name: 'MemberAppearance',
            component: MemberAppearance,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/memberSpace',
            name: 'MemberSpace',
            component: MemberSpace,
            meta: {
                isShowHeaderTwo: true
            }
        }, {
            path: '/memberAppear/details/:clubId/:memberAppearanceId',
            name: 'MemberAppearDetails',
            component: MemberAppearDetails,
            meta: {
                isShowHeaderTwo: true
            }
        }]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const href = window.location.href
    if (href.includes("&code") || href.includes("?code")) {

        var url = href.substring(0, href.length - 2); //vue自动在末尾加了 #/ 符号，截取去掉
        var jingPosit = url.indexOf("com/") + 4; //获取域名结束的位置
        var urlLeft = url.substring(0, jingPosit);//url左侧部分

        // 微信绑定
        if (href.includes("UserID")) {
            const PathCode = href.split("&code=");
            const Code = PathCode[1].split("&")[0];
            const params = {
                user_id: getCookies('user_id'),
                user_type: 0,
                code: Code
            };
            APIFetchWeixinBind(params).then((res) => {
                if (res.code == 2000) {
                    window.location = urlLeft + "#/my/information";//拼接跳转
                } else {
                    toast("绑定失败", 'error', 'Error');
                }
            });
        }
        // 微信登录
        else {
            const PathCode = href.split("?code=");
            // console.log(2, PathCode);
            const Code = PathCode[1].split("&")[0];
            APIFetchWeixinLogin({
                user_type: 0,
                code: Code
            }).then(res => {
                if (res.code === '2001') {
                    toast("改为欣慰绑定", 'error', 'Error');
                    window.location = urlLeft + '#/login'
                }
                else {
                    toast("登录成功");
                    // 将登陆成功的token保存
                    setCookies("token", res.data.token);
                    setCookies("isLogin", true);
                    setCookies("user_id", res.data.student_id);
                    setCookies("user_name", res.data.student_name);
                    setCookies("head_pic", res.data.head_pic);
                    window.location = urlLeft + "#/index";//拼接跳转
                }
            })
        }
    } else {
        next();
    }
});

export default router