// 系统路由
import Login from '../views/userCenter/login.vue'
import Dashboard from '../views/dashboard/index.vue'
import CMD from '../views/other/cmd.vue'
import Layout from '../layout/index.vue'
const routes = [{
    name: "layout",
    path: "/",
    component: Layout,
    redirect: '/dashboard',
    children: [
        {
            name: "dashboard",
            path: "/dashboard",
            meta: {
                title: "首页",
                icon: "el-icon-house",
                affix: true
            },
            component: Dashboard
        }
    ]
},
{
    path: "/cmd",
    component: CMD,
    meta: {
        title: "CMD",
        ishidden: true
    }
},
{
    path: "/login",
    component: Login,
    meta: {
        title: "登录",
        ishidden: true
    }
}
]

export default routes
