import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 用户登录
export function login(data) {
    return axios({
        url: "/studentInfo/login",
        method: "POST",
        data: objectToFormData(data)
    });
}
// 用户注册
export function register(data) {
    return axios({
        url: "/studentInfo/register",
        method: "POST",
        data: objectToFormData(data)
    });
}
// 获取社员职位
export function apiGetLevel(data) {
    return axios({
        url: "/student-join/clubLevel",
        method: "GET",
        params: data
    });
}
// 修改社员职位
export function apiModifyLevel(data) {
    return axios({
        url: "/student-join/modifyLevel",
        method: "PUT",
        data: objectToFormData(data)
    });
}
// 查询院系列表
export function apiGetCollegeInfo() {
    return axios({
        url: "/admin/sysCollegeInfo/colleges",
        method: "GET"
    });
}
// 查询班级列表
export function apiGetClassInfo(data) {
    return axios({
        url: "/admin/sysClassInfo/classes",
        method: "GET",
        params: data
    });
}
// 查询社团类型列表
export function apiGetClubCategories() {
    return axios({
        url: "/admin/sysClubCategory/categories",
        method: "GET"
    });
}