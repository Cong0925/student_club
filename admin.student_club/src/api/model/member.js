import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default {
    //获取成员风采列表
    APIFetchMemberPicList(data) {
        return new request({
            url: "/memberAppearance/admin/appearanceList",
            method: "GET",
            params: data,
        });
    },
    APIDeleteMember(data) {
        return new request({
            url:"/memberAppearance/admin/deleteMemberAppearance/"+data.mid,
            method: "DELETE",
            params: data,

        })
    },
    APIDetailMember(data){
        return new request({
            url:'/memberAppearance/'+data.m_id,
            method:"GET",
            params:data
        })
    }

}