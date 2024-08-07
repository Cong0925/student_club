import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default {
    APIFetchSysUsersList(data) {
        return new request({
            url: '/admin/sysUserInfo/users',
            method: 'GET',
            params: data
        })
    },
    APIAddSysUser(data) {
        return new request({
            url: '/admin/sysUserInfo/register',
            method: 'POST',
            data: objectToFormData(data)
        })
    },
    APIDeleteSysUser(SysUserID, data) {
        return new request({
            url: '/admin/sysUserInfo/' + SysUserID,
            method: 'DELETE',
            data: objectToFormData(data)
        })
    },
    APIResetSysUserPassword(data) {
        return new request({
            url: '/admin/sysUserInfo/'+data.system_id,
            method: 'PUT',
            data: objectToFormData(data)
        })
    },
    APIGetSysUser(SysUserID, data) {
        return new request({
            url: '/admin/sysUserList/' + SysUserID,
            method: 'GET',
            params: data
        })
    }
}