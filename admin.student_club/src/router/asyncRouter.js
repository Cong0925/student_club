// 异步路由
import student from '../views/account/student.vue'
import student_edit from '../views/account/editStudent.vue'
import activities_list from '../views/activity/list.vue'
import activities_detail from '../views/activity/detail.vue'
import info from '../views/club/info.vue'
import club_detail from '../views/club/detail.vue'
import club_add from '../views/club/add.vue'
import message_news from '../views/message/news/news.vue'
import news_detail from '../views/message/news/detail.vue'
import message_member from '../views/message/member/member.vue'
import member_detail from '../views/message/member/detail.vue'
import message_notice from '../views/message/notices/notices.vue'
import notice_detail from '../views/message/notices/detail.vue'
import RotationPic from '../views/system/RotationPic.vue'
import SystemUser from '../views/system/SystemUser.vue'
import infomationSetting from '../views/system/sysconfig/informationSetting.vue'


const routes = [{
    path:'/information_manage',
    name:'InformationList',
    redirect:'/information_manage/club_information',
    meta:{
        title:'信息管理',
        icon:'el-icon-message',
        type:'menu'
    },
    children:[
        {
            name:'ClubNews',
            path:'/information_manage/club_information',
            component:message_news,
            meta:{
                title:'社团新闻',
                icon:'el-icon-document'
            }
        },{
            path:'/notice',
            name:'Notices',
            component:message_notice,
            meta:{
                title:'通知公告',
                icon:'el-icon-tickets',

            }
        },{
            path:'/member',
            name:'Member',
            component:message_member,
            meta:{
                title:'成员风采',
                icon:'el-icon-postcard'
            }
        },{
            path:'/information_manage/detail',
            name: 'news_detail',
            component:news_detail,
            meta: {
                title:'查看新闻',
                icon: 'el-icon-menu',
                active: '/information_manage/detailAll',
                hidden: true
            }
        },{
            path:'/notice/detail',
            name: 'notice_detail',
            component:notice_detail,
            meta: {
                title:'查看通知',
                icon: 'el-icon-menu',
                active: '/notice/detailAll',
                hidden: true
            }
        },{
            path:'/member/detail',
            name: 'member_detail',
            component:member_detail,
            meta: {
                title:'查看成员风采',
                icon:'el-icon-menu',
                active:'/member/detailAll',
                hidden: true
            }
        }
    ]
},{
    path:'/activities',
    name:'activities',
    redirect:'/activities/list',
    meta:{
        title:'活动审批',
        icon: 'el-icon-bicycle',
        type: 'menu'
    },
    children: [
        {
            path: '/activities/list',
            name: 'activities_list',
            component: activities_list,
            meta: {
                title: '活动列表',
                icon: 'el-icon-files'
            }
        },{
            path:'/activities/approve',
            name: 'activities_detail',
            component:activities_detail,
            meta: {
                title:'活动详情',
                icon: 'el-icon-menu',
                active: '/acctivities/approveall',
                hidden: true
            }
        }
    ]
}, {
    path:'/club_manage',
    name:'clubManage',
    redirect:'/club_manage/clubInfo',
    meta: {
        title:'社团管理',
        icon: 'el-icon-basketball',
        type: 'menu'
    },
    children:[
        {
            path:'/club_manage/clubInfo',
            name:'clubInfo',
            component:info,
            meta: {
                title:'社团信息',
                icon: 'el-icon-document'
            }
        },{
            path:'/club_manage/detail',
            name: 'club_detail',
            component:club_detail,
            meta: {
                title:'社团详情',
                icon: 'el-icon-menu',
                active: '/acctivities/detailAll',
                hidden: true
            }
        },{
            path:'/club_manage/add',
            name: 'club_add',
            component:club_add,
            meta: {
                title:'添加社团',
                icon: 'el-icon-menu',
                active: '/club/addDetail',
                hidden: true
            }
        }
    ]
},{
    path: '/account',
    name: 'account',
    redirect: '/account/student',
    meta: {
        title: '用户管理',
        icon: 'el-icon-user',
        type: 'menu'
    },
    children: [
        {
            path: '/account/student',
            name: 'student_account',
            component: student,
            meta: {
                title: '学生管理',
                icon: 'el-icon-place'
            }
        }, {
            path:'/studentInfo/students',
            name: 'EditStudent',
            component:student_edit,
            meta: {
                title:'修改学生信息',
                icon: 'el-icon-menu',
                active: '/account/add',
                hidden: true
            }
        }
    ]
}, {
    path: '/system',
    name: 'system',
    redirect: '/system/rotationpic',
    meta: {
        title: '系统设置',
        icon: 'el-icon-setting',
        type: 'menu'
    },
    children: [
         {
            path: '/system/rotationpic',
            name: 'RotationPic',
            component: RotationPic,
            meta: {
                title: '轮播图',
                icon: 'el-icon-picture'
            }
        }, {
            path: '/system/systemuser',
            name: 'system_user',
            component: SystemUser,
            meta: {
                title: '系统用户',
                icon: 'el-icon-user'
            }
        },{
            path: '/system/sysconfig',
            name: 'InformationSetting',
            component: infomationSetting,
            meta: {
                title: '系统配置',
                icon: 'el-icon-box'
            }
        }
    ]
}]

// 按照角色生成路由表
export function generateRoleRouter(role) {
    function getRouter(routes, role) {
        routes = routes.map(item => {
            // 有权限
            if((item.meta.role && item.meta.role.includes(role)) || !item.meta.role) {
                if(item.children) {
                    const children = getRouter(item.children, role)
                    children.length === 0 ? (delete item.children) : (item.children = children)
                }
                return item
            }
            return null
        })
        return routes.filter(item => item !== null)
    }
    return getRouter(routes, role)
}

export default routes