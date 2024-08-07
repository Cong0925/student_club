import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    // 类型-列表-查询
    APIFetchTypeList(data) {
        return new request({
            url: '/admin/sysClubCategory/categories',
            method: 'GET',
            params: data
        })
    },


    // 类型-添加
    APIAddType(data) {
        return new request({
            url: '/admin/sysClubCategory',
            method: 'POST',
            data: objectToFormData(data)
        })
    },

    // 学院-删除
    APIDeleteType(data) {
        return new request({
            url: '/admin/sysClubCategory/'+data.TypeID,
            method: 'DELETE',
            data: objectToFormData(data)
        })
    },
    //学院类型查询
    APISearchCollege(data) {
        return new request({
            url:'/admin/sysCollegeInfo/colleges',
            method:'GET',
            data:objectToFormData(data)
        })
    }
}