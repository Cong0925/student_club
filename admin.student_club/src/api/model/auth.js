
import request from "@/utils/request"

export default {
    rolelist(params) {
        return new request({
            url: '/rolelist',
            method: 'GET',
            params
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
