import request from "@/utils/request"

export default {
    getIncompletetaskAdmin(params) {
        return new request({
            url: '/admin/dashboard/getIncompletetaskAdmin',
            method: 'GET',
            params:params
        })
    },
    getClubDataList(params) {
        return new request({
            url:'/admin/dashboard/getCurveAdmin',
            method:'GET',
            params:params
        })
    },
    token(data) {
        return new request({
            url: '/token',
            method: 'POST',
            data
        })
    }
}
