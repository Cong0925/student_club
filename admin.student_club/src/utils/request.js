import axios from 'axios'
import { ElNotification, ElMessageBox } from 'element-plus'
import sysConfig from "@/config"
import tool from '@/utils/tool'
import router from '@/router'
import config from "@/config"

axios.defaults.baseURL =  config.API_URL

axios.defaults.timeout = sysConfig.TIMEOUT

// HTTP request 拦截器
axios.interceptors.request.use(
    (config) => {
        let token = tool.data.get("TOKEN")
        if(token) {
            // config.headers[sysConfig.TOKEN_NAME] = sysConfig.TOKEN_PREFIX + token
            config.headers['Token'] = token
        }
        // 避免被缓存命中，强制拉取远程
        if(!sysConfig.REQUEST_CACHE && config.method === 'get') {
            config.params = config.params || {}
            config.params['_'] = new Date().getTime()
        }
        Object.assign(config.headers, sysConfig.HEADERS)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// HTTP response 拦截器
axios.interceptors.response.use(
    (response) => {
        const res = response.data
        // console.log("reponse is",response.data.code)
        if (res.code === '2000')
        {return res}
        else if(res.code === '4001'){
            ElMessageBox.confirm('当前用户已被登出或无权限访问当前资源，请尝试重新登录后再操作。', '无权限访问', {
                type: 'error',
                closeOnClickModal: false,
                center: true,
                confirmButtonText: '重新登录'
            }).then(() => {
                router.replace({ path: '/login' })
            }).catch(() => {})
        }else if(res.code === '4005'){
            ElNotification.error({
                title: '请求错误',
                message: "密码错误!"
            })
        }
        return res
    },
    (error) => {
        console.log("error is" ,error)
        if (error.response) {
            if (error.response.status === 4004) {
                ElNotification.error({
                    title: '请求错误',
                    message: "Status:404，正在请求不存在的服务器记录！"
                })
            } else if (error.response.status === 5000) {
                ElNotification.error({
                    title: '请求错误',
                    message: error.response.data.message || "Status:500，服务器发生错误！"
                })
            } else if (error.response.status === 4001) {
                ElMessageBox.confirm('当前用户已被登出或无权限访问当前资源，请尝试重新登录后再操作。', '无权限访问', {
                    type: 'error',
                    closeOnClickModal: false,
                    center: true,
                    confirmButtonText: '重新登录'
                }).then(() => {
                    router.replace({ path: '/login' })
                }).catch(() => {})
            } else {
                ElNotification.error({
                    title: '请求错误',
                    message: error.response.data.message || `Status:${error.response.status}，未知错误！`
                })
            }
        } else {
            ElNotification.error({
                title: '请求错误',
                message: "请求服务器无响应！"
            })
        }
        return Promise.reject(error.response)
    }
)


export default axios
