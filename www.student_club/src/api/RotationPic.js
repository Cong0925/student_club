import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat"
// 获取轮播图
export function fetchRotationPic() {
    return axios({
        url: "/rotationPic/list",
        method: "GET"  
    });
}

export function apiPicUpload(data) {
    return axios({
        url: "/common/picupload",
        method: "POST",
        data:objectToFormData(data)
    });
}

export function apiFileUpload(data) {
    return axios({
        url: "/common/fileupload",
        method: "POST",
        data:objectToFormData(data)
    });
}