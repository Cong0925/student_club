import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    // 学院-列表-查询
    APIFetchCollegeList(data) {
        return new request({
            url: '/admin/sysCollegeInfo/colleges',
            method: 'GET',
            params: data
        })
    },

    // 学院-修改
    APIEditCollege(data) {
        return new request({
            url: '/admin/collegeInfo',
            method: 'PUT',
            data: objectToFormData(data)
        })
    },

    // 学院-添加
    APIAddCollege(data) {
        return new request({
            url: '/admin/sysCollegeInfo',
            method: 'POST',
            data: objectToFormData(data)
        })
    },

    // 学院-删除
    APIDeleteCollege(data) {
        return new request({
            url: '/admin/sysCollegeInfo/'+data.collegeID,
            method: 'DELETE',
            data: objectToFormData(data)
        })
    }

}