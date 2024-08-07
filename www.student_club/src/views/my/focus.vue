<template>
    <div v-if="state.hasData === true" style="position: relative;" v-loading="loading">
        <div style="margin:2%">
            <el-row>
                <el-col
                    v-for="(item, index) in state.myClub ? state.myClub.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize) : []"
                    :key="index" :span="6">
                    <el-card :body-style="{ padding: '0px' }" class="myClubCard" @click="toClub(item.club_id)">
                        <el-image :src="item.logo_url" class="image" fit="cover" />
                        <div style="padding: 14px">
                            <span>{{ item.club_name }}</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="pagination-wrapper">
            <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
                :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
        </div>
    </div>
    <div v-else>
        <el-empty description="还没有关注社团，快去社团列表选取心仪的社团吧！" />
    </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiGetMyLikeClubs } from '@/api/studentInfo'
import { getCookies, setCookies, toast } from '@/utils/tool'
import APP_CONFIG from '@/config/index.js'

export default {
    setup() {
        const router = useRouter()
        const currentDate = ref(new Date())
        const loading = ref(false)
        const state = reactive({
            myClub: [],
            total: '',
            pageSize: 12,
            currentPage: 1,
            hasData: false
        })
        const toClub = (data) => {
            router.push({
                name: 'ClubMain',
                params: {
                    clubId: data
                }
            })
            setCookies("club_id", data)
        }
        const getMyLikeClub = async () => {
            loading.value = true
            await apiGetMyLikeClubs({
                user_id: getCookies('user_id'),
                user_type: 0
            }).then(res => {
                if (res.data.length > 0) {
                    state.myClub = res.data
                    state.myClub.forEach(element => {
                        if (element.logo_url) {
                            if (!element.logo_url.includes(APP_CONFIG.BASEURL_PIC)) {
                                element.logo_url = APP_CONFIG.BASEURL_PIC + element.logo_url
                            }
                        }
                        else {
                            element.logo_url = APP_CONFIG.BASE_PIC
                        }
                    });
                    state.total = res.data.length
                    state.hasData = true
                }
            }).catch(err => {
                console.log(err);
            })
            loading.value = false

        }
        const changePage = (val) => {
            state.currentPage = val
        }
        onMounted(() => {
            getMyLikeClub()
        })
        return {
            currentDate, state, toClub, changePage, loading
        }
    }
}
</script>

<style scoped>
.myClubCard {
    cursor: pointer;
    margin-bottom: 5px;
    width: 99%;
    height: 160px;
    text-align: center;
}

.image {
    width: 100%;
    display: block;
    height: 110px;
}

.pagination-wrapper {
    position: absolute;
    top: 530px;
    margin-left: 2%;
}
</style>
