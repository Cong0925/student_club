import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 推荐位成员风采
export function apiGetRecommendedMemberAppearance(data) {
    return axios({
        url: "/memberAppearance/recommendedMemberAppearance",
        method: "GET",
        params:data
    });
}
// 成员风采详情
export function apiGetMemberAppearanceDetails(data) {
    return axios({
        url: "/memberAppearance/"+data,
        method: "GET",
    });
}
// 发布成员风采
export function apiApplyMemberAppearance(data) {
    return axios({
        url: "/memberAppearance/applyMemberAppearance",
        method: "POST",
        data:objectToFormData(data)
    });
}
// 获取我的成员风采列表
export function apiGetMyMemberAppearance(data) {
    return axios({
        url: "/memberAppearance/myMemberAppearance",
        method: "GET",
        params:data
    });
}
// 负责人获取成员风采列表
export function apiGetMemberAppearanceList(data) {
    return axios({
        url: "/memberAppearance/appearanceList",
        method: "GET",
        params:data
    });
}
// 推荐成员风采
export function apiSwitchRecommendation(data,id) {
    return axios({
        url: "/memberAppearance/switchRecommendation/"+id,
        method: "PUT",
        params:data
    });
}
// 修改成员风采
export function apiModifyMemberAppearance(data,id) {
    return axios({
        url: "/memberAppearance/modifyMemberAppearance/"+id,
        method: "PUT",
        data:objectToFormData(data)
    });
}
// 删除成员风采
export function apiDeleteMemberAppearance(data,id) {
    return axios({
        url: "/memberAppearance/deleteMemberAppearance/"+id,
        method: "DELETE",
        params:data
    });
}