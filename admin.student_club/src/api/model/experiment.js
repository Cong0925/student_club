import request from '@/utils/request'
import { objectToFormData } from '@/utils/formDataFormat'

export default {
    // 实验列表-查询
    APIFetchExperimentList(data) {
        return new request({
            url: '/experimentInfo/experiments',
            method: 'GET',
            params: data
        })
    },

    // 实验-添加
    APIAddExperiment(data) {
        return new request({
            url: '/experimentInfo/experiments',
            method: 'POST',
            data: objectToFormData(data)
        })
    },

    // 单个实验详情-查询
    APIExperimentDetail(ExperimentID, data) {
        return new request({
            url: '/experimentInfo/experiment/' + ExperimentID,
            method: 'GET',
            params: data
        })
    },

    // 实验修改
    APIUpdateExperiment(ExperimentID, data) {
        return new request({
            url: '/experimentInfo/experiment/' + ExperimentID,
            method: 'PUT',
            data: objectToFormData(data)
        })
    },

    // 实验删除
    APIDeleteExperiment(ExperimentID, data) {
        return new request({
            url: '/experimentInfo/experiment/' + ExperimentID,
            method: 'DELETE',
            data: objectToFormData(data)
        })
    },

    // 实验推荐【新】
    APIExperimentRecommend(ExperimentID, data) {
        return new request({
            url: '/experimentInfo/experiment/' + ExperimentID,
            method: 'PUT',
            data: objectToFormData(data)
        })
    },

    // 获取所有实验类别【新】
    APIExperimentTypes(data) {
        return new request({
            url: '/experimentType/experimentTypes',
            method: 'GET',
            params: data
        })
    }
}

