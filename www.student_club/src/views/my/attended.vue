<template>
    <div style="position: relative;">
        <div style="margin:2%">
            <div class="mytitle">
                我参加的活动</div><br>
            <div v-loading="loading">
                <el-table :data="state.data" stripe border style="width: 100%"
                    :default-sort="{ prop: 'start_time', order: 'descending' }">
                    <el-table-column prop="title" label="活动标题">
                        <template #default="scope">
                            <el-popover placement="top" trigger="hover" width="400px">
                                <div class="set-popper">
                                    {{ scope.row.title }}
                                </div>
                                <template #reference>
                                    <div class="set-content">
                                        {{ scope.row.title }}
                                    </div>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column prop="club_name" label="所属社团" width="200" />
                    <el-table-column prop="start_time" label="开始时间" sortable width="200" />
                    <el-table-column prop="address" label="活动地点" />
                </el-table>
            </div>
        </div>

        <div class="pagination-wrapper">
            <el-pagination background class="footer_pagination" :hide-on-single-page="false" layout="prev, pager, next"
                :total="state.total" :page-size="state.pageSize" :current-page="state.currentPage"
                @current-change="changePage" />

        </div>
    </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue'
import { apiGetMyAttendedActivities } from '@/api/club'
import { getCookies } from '@/utils/tool'
import { useRoute } from "vue-router"
export default {
    setup() {
        const route = useRoute()
        const loading = ref(false)
        const state = reactive({
            data: [],
            collapseActiveName: 1, //折叠面板
            total: '',
            pageSize: 10,
            currentPage: 1
        })
        const getMyAttendedActivities = async () => {
            loading.value = true
            await apiGetMyAttendedActivities({
                user_id: getCookies('user_id'),
                user_type: 0,
                page: state.currentPage,
                size: state.pageSize
            })
                .then((res) => {
                    // console.log(res)
                    state.data = res.data
                    state.total = res.count
                })
                .catch((err) => {
                    console.log('apiGetaMyAttendedActivities', err)
                    toast(err, 'error', 'Error')
                })
            loading.value = false
        }
        const changePage = () => {
            state.currentPage = val
            getMyAttendedActivities()
        }
        onMounted(() => {
            getMyAttendedActivities()
        })
        return {
            state, changePage, loading
        }
    }

}
</script>


<style scoped>
.mytitle {
    border-left: 4px solid #337ecc;
    font-size: 17px;
    padding-left: 5px;
    height: 17px;
    line-height: 20px;
}


.set-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.pagination-wrapper {
  position: absolute;
  top: 530px;
  margin-left: 2%;
}
</style>



