import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 社团首页的社团简介
export function apiClubSummarydata(club_id,data) {
    return axios({
        url: "/clubInfo/clubSummary/"+club_id,
        method: "GET",
        params: data
    });
}

// 加入社团
export function apiJoinClub(data) {
    return axios({
        url: "/student-join",
        method: "POST",
        data: objectToFormData(data)
    });
}

// 关注社团
export function apiLikeClub(data) {
    return axios({
        url: "/student-like",
        method: "POST",
        data: objectToFormData(data)
    });
}

// 社团中心的社团简介
export function apiGetClubDetailInfo(data) {
    return axios({
        url: "/clubInfo/clubDetailInfo",
        method: "GET",
        params: data
    });
}

// 修改社团中心的社团简介
export function apiModifyClubInfo(data) {
    return axios({
        url: "/clubInfo/modifyClubInfo",
        method: "PUT",
        params: data
    });
}

// 社团中心的社团成员
export function apiGetClubMembers(data) {
    return axios({
        url: "/student-join/members",
        method: "GET",
        params: data
    });
}

// 社团中心我参加的活动
export function apiGetMyAttendedActivities(data) {
    return axios({
        url: "/activity/activitiesAttended",
        method: "GET",
        params: data
    });
}

// 社团中心我发布的活动
export function apiGetMyPostedActivities(data) {
    return axios({
        url: "/activity/myActivities",
        method: "GET",
        params: data
    });
}

// 社团中心我发布的新闻
export function apiGetMyPostedNews(data) {
    return axios({
        url: "/news/myNews",
        method: "GET",
        params: data
    });
}

// 社团中心我发布的通知
export function apiGetMyPostedNotices(data) {
    return axios({
        url: "/notice/myNotices",
        method: "GET",
        params: data
    });
}

// 社团中心待审核的活动
export function apiGetMyCheckedActivities(data) {
    return axios({
        url: "/activity/activityApplications",
        method: "GET",
        params: data
    });
}

// 社团中心待审核的新闻
export function apiGetMyCheckedNews(data) {
    return axios({
        url: "/news/newsApplications",
        method: "GET",
        params: data
    });
}

// 社团中心待审核的通知
export function apiGetMyCheckedNotices(data) {
    return axios({
        url: "/notice/noticeApplications",
        method: "GET",
        params: data
    });
}

// 社团中心待审核的成员 加入
export function apiGetStudentJoinApplications(data) {
    return axios({
        url: "/student-join/joinApplications",
        method: "GET",
        params: data
    });
}

// 通过学生入社申请
export function apiPassJoin(data) {
    return axios({
        url: "/student-join/passJoin",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 拒绝学生入社申请
export function apiRefuseJoin(data) {
    return axios({
        url: "/student-join/refuseApplication",
        method: "DELETE",
        data: objectToFormData(data)
    });
}

// 社团中心待审核的成员 退出
export function apiGetStudentExitApplications(data) {
    return axios({
        url: "/exitClubApply/exitApplyList" ,
        method: "GET",
        params: data
    });
}

// 通过学生退社申请
export function apiPassExit(data) {
    return axios({
        url: "/exitClubApply/passExitApply",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 拒绝学生退社申请
export function apiRefuseExit(data) {
    return axios({
        url: "/exitClubApply/refuseExitApply",
        method: "PUT",
        data: objectToFormData(data)
    });
}