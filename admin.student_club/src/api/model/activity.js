import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default{
    APIFetchActivityList(data){
        return new request({
            url: 'activity/getActivitiesListAdmin',
            method: 'GET',
            params: data
        })
    },
    APIDetailAll(data) {
        return new request({
            url:'/activity/getActivitiesAdmin',
            method:'GET',
            params:data
        })
    },
    APIPick(data){
        return new request({
            url:'/activity/activityCheckAdmin',
            method:'PUT',
            data:objectToFormData(data)
        })
    }
}