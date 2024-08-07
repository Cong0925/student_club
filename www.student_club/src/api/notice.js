import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 通知列表
export function apiGetNoticeList(data) {
    return axios({
        url: "/notice/notices",
        method: "GET",
        // data: objectToFormData(data)
        params:data
    });
}

// 活动最终页
export function apiGetNoticeDetail(notice_id) {
    return axios({
        url: "/notice/"+notice_id,
        method: "GET"
    });
}

// 通知申请
export function apiPublishNotice(data) {
    return axios({
        url: "/notice/publishNotice",
        method: "POST",
        data: objectToFormData(data)
    });
}

// 通过申请
export function apiPassNoticeApplication(data) {
    return axios({
        url: "/notice/passApplication",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 拒绝申请
export function apiRefuseNoticeApplication(data) {
    return axios({
        url: "/notice/refuseApplication",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 删除通知
export function apiDeleteMyNotice(data) {
    return axios({
        url: "/notice/deleteMyNotice",
        method: "DELETE",
        data: objectToFormData(data)
    });
}
// 自己发布的通知详情
export function apiMyNoticeDetail(data) {
    return axios({
        url: "/notice/myNoticeDetail",
        method: "GET",
        params:data
    });
}
// 修改自己发布的通知
export function apiModifyMyNotice(data) {
    return axios({
        url: "/notice/modifyMyNotice",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 负责人查看通知详情
export function apiNoticeApplicationDetail(data) {
    return axios({
        url: "/notice/noticeApplicationDetail",
        method: "GET",
        params:data
    });
}