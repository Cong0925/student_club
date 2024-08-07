import { createRouter, createWebHashHistory } from 'vue-router'
import { ElNotification } from 'element-plus'
import config from "@/config"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import tool from '@/utils/tool'
import systemRouter from './systemRouter'
import { beforeEach, afterEach } from './scrollBehavior'
import { generateRoleRouter } from './asyncRouter'

import Empty from '@/views/other/empty.vue'
import Page404 from '@/views/other/404.vue'




// 系统路由
const routes = systemRouter

// 系统特殊路由
const routes_404 = {
    path: "/:pathMatch(.*)*",
    hidden: true,
    component: Page404
}

// 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

// 设置标题
document.title = config.APP_NAME

// 判断是否已加载过API路由
var isGetApiRouter = false

router.beforeEach(async (to, from, next) => {
    NProgress.start()

    // 动态标题
    document.title = to.meta.title ? `${to.meta.title} - ${config.APP_NAME}` : `${config.APP_NAME}`

    let token = tool.data.get("TOKEN")

    if(to.path === "/login") {
        isGetApiRouter = false
        next()
        return false
    }

    if(!token) {
        next({
            path: '/login'
        })
        return false
    }

    // 加载API路由
    if(!isGetApiRouter) {
        const role = tool.data.get("USER_INFO").role
        let menu = generateRoleRouter(role)
        var apiRouter = filterAsyncRouter(menu)
        tool.data.set("MENU", apiRouter)
        apiRouter.forEach(item => {
            router.addRoute("layout", item)
        })
        router.addRoute(routes_404)
        if (to.matched.length === 0) {
            router.push(to.fullPath)
        }
        isGetApiRouter = true
    }
    beforeEach(to, from)
    next()
})

router.afterEach((to, from) => {
    afterEach(to, from)
    NProgress.done()
})

router.onError((error) => {
    NProgress.done()
    ElNotification.error({
        title: '路由错误',
        message: error.message
    })
})


// 转换
function filterAsyncRouter(routerMap) {
    const accessedRouters = []
    routerMap.forEach(item => {
        item.meta = item.meta || {}
        // MAP转路由对象
        var route = {
            path: item.path,
            name: item.name,
            meta: item.meta,
            redirect: item.redirect,
            children: item.children ? filterAsyncRouter(item.children) : null,
            component: item.component ? item.component : Empty
        }
        accessedRouters.push(route)
    })
    return accessedRouters
}



export default router
