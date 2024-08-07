import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 社团列表
export function apiGetClubList() {
    return axios({
        url: "/clubInfo/getClubs",
        method: "GET"
        // data: objectToFormData(data)
    });
}