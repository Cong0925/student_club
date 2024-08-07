import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 活动列表
export function apiGetActivitiesList(data) {
    return axios({
        url: "/activity/getActivities",
        method: "GET",
        params:data
    });
}

// 首页活动推荐
export function apiGetRecommendActivities(data) {
    return axios({
        url: "/activity/recommendActivities",
        method: "GET",
        params:data
    });
}

// 活动最终页
export function apiGetActivitiyDetail(activity_id) {
    return axios({
        url: "/activity/"+activity_id,
        method: "GET"
    });
}

// 是否参加活动
export function apiIsAttendActivity(data) {
    return axios({
        url: "/student-attend/isAttended",
        method: "GET",
        params:data
    });
}
// 参加活动
export function apiAttendActivity(data) {
    return axios({
        url: "/student-attend/attendActivity",
        method: "POST",
        data: objectToFormData(data)
    });
}
// 退出活动
export function apiExitActivity(data) {
    return axios({
        url: "/student-attend/exitActivity",
        method: "DELETE",
        data: objectToFormData(data)
    });
}
// 删除发布过的活动
export function apiDeleteActivity(data) {
    return axios({
        url: "/activity/deleteMyActivity",
        method: "DELETE",
        data: objectToFormData(data)
    });
}
// 活动申请
export function apiPublishActivity(data) {
    return axios({
        url: "/activity/applyActivity",
        method: "POST",
        data: objectToFormData(data)
    });
}

// 通过申请
export function apiPassActivityApplication(data) {
    return axios({
        url: "/activity/passApplication",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 拒绝申请
export function apiRefuseActivityApplication(data) {
    return axios({
        url: "/activity/refuseApplication",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 自己发布的活动详情
export function apiMyActivityDetail(data) {
    return axios({
        url: "/activity/myActivityDetail",
        method: "GET",
        params:data
    });
}
// 修改自己发布的活动
export function apiModifyMyActivity(data) {
    return axios({
        url: "/activity/modifyMyActivity",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 负责人查看活动详情
export function apiActivityApplicationDetail(data) { 
    return axios({
        url: "/activity/activityApplicationDetail",
        method: "GET",
        params:data
    });
}