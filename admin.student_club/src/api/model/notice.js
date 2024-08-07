import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    APIFetchNoticeList(data){
        return new request({
            url: 'notice/noticesListAdmin',
            method: 'GET',
            params: data
        })
    },
     //最终页
     APIDetailAll(data){
        return new request({
            url:'notice/noticeAdmin',
            method:'GET',
            params:data
        })
    },
    APIDelete(data){
        return new request({
            url:'notice/deleteNotice',
            method:'DELETE',
            data:objectToFormData(data)
        })
    },
    APIPick(data){
        return new request({
            url:'notice/noticeCheckAdmin',
            method:'PUT',
            data:objectToFormData(data)
        })
    }
}