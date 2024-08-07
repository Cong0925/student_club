import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    // 图片上传接口定义
    APIPicUpload(data) {
        return new request({
            url: '/common/picupload',
            method: 'POST',
            data: objectToFormData(data)
        })
    }
}
