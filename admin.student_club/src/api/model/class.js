import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    // 班级-列表-查询
    APIFetchClassList(data) {
        return new request({
            url: '/admin/sysClassInfo/classes',
            method: 'GET',
            params: data
        })
    },

    // 班级-修改
    APIEditClass(data) {
        return new request({
            url: '/admin/classInfo',
            method: 'PUT',
            data: objectToFormData(data)
        })
    },

    // 班级-添加
    APIAddClass(data) {
        return new request({
            url: '/admin/sysClassInfo',
            method: 'POST',
            data: objectToFormData(data)
        })
    },

    // 班级-删除
    APIDeleteClass(data) {
        return new request({
            url: '/admin/sysClassInfo'+'/'+data.classID,
            method: 'DELETE',
            data: objectToFormData(data)
        })
    }
}
