import axios from "@/utils/axios";
import { objectToFormData } from "@/utils/formDataFormat";

// 微信绑定
export function APIFetchWeixinBind(data) {
    return axios({
      url: "/common/weixinbind",
      method: "GET",
      params: data
    });
  }
  
  // 微信登录
  export function APIFetchWeixinLogin(data) {
    return axios({
      url: "/common/weixinlogin",
      method: "GET",
      params: data
    });
  }