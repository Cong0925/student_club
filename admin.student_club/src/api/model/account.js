import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    // 学生-列表-查询【新】
    APIFetchStudentList(data) {
        return new request({
            url: '/vStudentInfo/v-student-info/query',
            method: 'GET',
            params: data
        })
    },
    APIFetchStudentClubList(data){
        return new request({
            url:'/student-join/studentClubs',
            method:'GET',
            params:data

        })
    },
    // 学生-重置密码
    APIEditStudent(StudentID, data) {
        return new request({
            url: '/studentInfo/students/' + StudentID,
            method: 'PUT',
            data: objectToFormData(data)
        })
    },
    // 学生-添加(学生自己注册)【废】
    APIAddStudent(data) {
        return new request({
            url: '/admin/studentInfo',
            method: 'POST',
            data: objectToFormData(data)
        })
    },
    // 学生-删除信息
    APIDeleteStudent(StudentID, data) {
        return new request({
            url: '/studentInfo/' + StudentID,
            method: 'DELETE',
            data: objectToFormData(data)
        })
    },
    // 学生最终页查询
    APIFetchAll(data) {
        return new request({
            url: '/studentInfo/studentInfoAdmin',
            method: 'GET',
            params: data
        })
    },

    // 学生信息修改
    APIUpdata(data) {
        return new request({
            url: '/studentInfo/putStudentInfoAdmin',
            method: 'PUT',
            data: objectToFormData(data)
        })
    },

    // 系统账户-列表-查询
    APIFetchSystemUserList(data) {
        return new request({
            url: '/admin/sysUserLists',
            method: 'GET',
            params: data
        })
    }



}




