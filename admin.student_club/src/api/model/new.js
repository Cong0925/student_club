import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    APIFetchNewList(data){
        return new request({
            url: '/news/newsListAdmin',
            method: 'GET',
            params: data
        })
    },
    //最终页
    APIDetailAll(data){
        return new request({
            url:'news/newsAdmin',
            method:'GET',
            params:data
        })
    },
    //删除
    APIDelete(data){
        return new request({
            url:'news/deleteNews',
            method:'DELETE',
            data:objectToFormData(data)
        })
    },
    APIPick(data){
        return new request({
            url:'news/newsCheckAdmin',
            method:'PUT',
            data:objectToFormData(data)
        })
    }
}