import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 新闻列表
export function apiGetNewsList(data) {
    return axios({
        url: "/news/newsList",
        method: "GET",
        params:data
        // data: objectToFormData(data)
    });
}

// 首页新闻推荐
export function apiGetRecommendNews(data) {
    return axios({
        url: "/news/recommendNews",
        method: "GET",
        // params:data
    });
}

// 新闻最终页
export function apiGetNewsDetail(news_id) {
    return axios({
        url: "/news/"+news_id,
        method: "GET"
    });
}

// 新闻申请
export function apiPublishNews(data) {
    return axios({
        url: "/news/publishNews",
        method: "POST",
        data: objectToFormData(data)
    });
}

// 通过申请
export function apiPassNewsApplication(data) {
    return axios({
        url: "/news/passApplication",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 拒绝申请
export function apiRefuseNewsApplication(data) {
    return axios({
        url: "/news/refuseApplication",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 删除新闻
export function apiDeleteMyNews(data) {
    return axios({
        url: "/news/deleteMyNews",
        method: "DELETE",
        data: objectToFormData(data)
    });
}

// 自己发布的新闻详情
export function apiMyNewsDetail(data) {
    return axios({
        url: "/news/myNewsDetail",
        method: "GET",
        params:data
    });
}
// 修改自己发布的新闻
export function apiModifyMyNews(data) {
    return axios({
        url: "/news/modifyMyNews",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 负责人查看新闻详情
export function apiNewsApplicationDetail(data) {
    return axios({
        url: "/news/newsApplicationDetail",
        method: "GET",
        params:data
    });
}