import axios from 'axios'
import { toast } from '@/utils/tool';
import { getCookies,removeCookies } from '@/utils/tool';
import router from "@/router/index";

const service = axios.create({
    // baseURL:'/api'
    baseURL: 'http://api.club.quwancode.com/api_1_0'
})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
    // 往header头自动添加token
    const token = getCookies('token')
    if (token) {
        // console.log('headers',config.headers);
        config.headers['token'] = token
    }
    // 在发送请求之前做些什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    toast(error,'error','Error')
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function(response) {
    if(response.data.code==4001){
        toast('登录已失效，请先登录！','warning','Warning')
        router.push({ name: 'Login' })
        removeCookies('token');
        removeCookies('isLogin');
        removeCookies('account');
        removeCookies('user_id');
        removeCookies('user_name');
        removeCookies('nickname');
        removeCookies('club_id');
        removeCookies('head_pic');
    }else if(response.data.message=='缺少参数token或请求非法'){
        toast('登录已失效，请先登录！','warning','Warning')
        router.push({ name: 'Login' })
        removeCookies('token');
        removeCookies('isLogin');
        removeCookies('account');
        removeCookies('user_id');
        removeCookies('user_name');
        removeCookies('nickname');
        removeCookies('club_id');
        removeCookies('head_pic');
    }
    // 对响应数据做点什么
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    // console.log('err',error);
    toast(error.response.data.msg || '请求失败', 'error')
    // console.log('err',error.response.data.msg)
    return Promise.reject(error);
});



export default service