import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

// 后台用户登录接口定义
export default {
    APIAdminLogin(data) {
        return new request({
            url: '/admin/sysUserInfo/login',
            method: 'POST',
            data: objectToFormData(data)
        })
    }
}