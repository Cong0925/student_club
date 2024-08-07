import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat"


// 修改用户头像
export function apiUpdateUserPic(data) {
    return axios({
        url: "/studentInfo/modifyHeadPic",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 获取用户信息
export function apiGetMyInformation(data) {
    return axios({
        url: "/studentInfo/me",
        method: "GET",
        params: data
    });
}

// 编辑用户信息
export function apiPutMyInformation(data) {
    return axios({
        url: "/studentInfo",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 修改密码
export function apiPutPassword(data) {
    return axios({
        url: "/studentInfo/modifyPassword",
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 获取学生加入社团列表
export function apiGetMyJoinClubs(data) {
    return axios({
        url: "/student-join/myJoinClubs",
        method: "GET",
        params: data
    });
}
// 学生退出社团申请
export function apiExitClubApply(data) {
    return axios({
        url: "/exitClubApply/myExitApply",
        method: "POST",
        data: objectToFormData(data)
    });
}

// 学生 再次 退出社团申请
export function apiReExitClubApply(data) {
    return axios({
        url: "/exitClubApply/updateApply",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 学生退出社团申请 状态查询
export function apiGetExitStatusApply(data) {
    return axios({
        url: "/exitClubApply/applyStatus",
        method: "GET",
        params: data
    });
}

// 获取学生关注社团列表
export function apiGetMyLikeClubs(data) {
    return axios({
        url: "/student-like/myLikeClubs",
        method: "GET",
        params: data
    });
}

// 获取学生申请社团列表
export function apiGetAppliedClubs(data) {
    return axios({
        url: "/clubInfo/appliedClubs",
        method: "GET",
        params: data
    });
}

// 保存社团申请
export function apiSaveApplyClub(data) {
    return axios({
        url: "/clubInfo/saveApplyClub",
        method: "POST",
        data: objectToFormData(data)
    });
}

// 申请社团
export function apiApplyClub(data) {
    return axios({
        url: "/clubInfo/applyClub",
        method: "POST",
        data: objectToFormData(data)
    });
}
// 撤销申请
export function apiCancleApplyClub(data) {
    return axios({
        url: "/clubInfo/cancelApplyClub/" + data,
        method: "DELETE",
    });
}

// 驳回后，再次申请社团
export function apiReApplyClub(data, clubId) {
    return axios({
        url: "/clubInfo/reApplyClub/" + clubId,
        method: "PUT",
        data: objectToFormData(data)
    });
}

// 获取申请社团信息
export function apiGetApplyClubInfo(data) {
    return axios({
        url: "/clubInfo/appliedClub",
        method: "GET",
        params: data
    });
}

