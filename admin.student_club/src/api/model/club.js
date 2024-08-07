/*
 * @Description: Description of this file
 * @Version: 2.0
 * @Author: 夏明
 * @Date: 2023-01-08 08:59:42
 * @LastEditors: 夏明
 * @LastEditTime: 2023-01-08 09:07:24
 */
import request from "@/utils/request";
import { objectToFormData } from "@/utils/formDataFormat";

export default {
	// 社团-列表-查询
	APIFetchClubList(data) {
		return new request({
			url: "/clubInfo/getClubsAdmin",
			method: "GET",
			params: data,
		});
	},

	//社团最终页
	APIDetailAll(data) {
		return new request({
			url: "/clubInfo/showClubAdmin",
			method: "GET",
			params: data,
		});
	},
	APIPick(data) {
		return new request({
			url: "/clubInfo/admin/checkClubInfo",
			method: "PUT",
			data: objectToFormData(data),
		});
	},
	APIAdd(data) {
		return new request({
			url: "/clubInfo/addClubAdmin",
			method: "POST",
			data: objectToFormData(data),
		});
	},
	//修改
	APIUpdata(data) {
		return new request({
			url:'/clubInfo/admin/modifyClubInfo',
			method:"PUT",
			params:data
		})
	}
};
