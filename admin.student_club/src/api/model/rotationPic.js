import request from "@/utils/request";
import { objectToFormData } from "@/utils/formDataFormat";

export default {
    // 轮播图-列表
    APIFetchRotationPicList(data) {
        return new request({
            url: "/rotationPic/list",
            method: "GET",
            params: data,
        });
    },

    // 轮播图-添加
    APIAddRotationPic(data) {
        return new request({
            url: "/admin/sysRotationPic",
            method: "POST",
            data: objectToFormData(data),
        });
    },
    // 轮播图-修改
    APIEditRotationPic(data) {
        return new request({
            url: "/admin/rotationPicInfo",
            method: "PUT",
            data: objectToFormData(data),
        });
    },
    // 轮播图-删除
    APIDeleteRotationPic(data) {
        // console.log(data)
        return new request({
            url: "/admin/sysRotationPic/"+data.mid,
            method: "DELETE",
            data: objectToFormData(data),
        });
    },
};