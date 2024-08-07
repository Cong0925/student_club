<template>
    <div>
        <div class="bread"><el-icon>
                <CaretLeft />
            </el-icon><span @click="this.$router.go(-1)" style="cursor: pointer;">返回上一页</span></div>

        <div class="main" v-loading="loading">
            <div class="news_detail_left">
                <div class="active-detail-title">
                    <div class="active-detail-title-title">{{ state.data.title }}</div>
                    <div class="active-detail-title-name">编辑人：{{ state.data.student_name }}</div>
                </div>
                <hr>
                <div class="text" v-html="state.data.content"></div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { CaretLeft } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiGetMemberAppearanceDetails } from '@/api/member'
export default {
    setup() {
        const router = useRouter()
        const loading = ref(false)
        const state = reactive({
            data: []
        })
        const getRecommendedMemberAppearanceDetails = async () => {
            loading.value = true
            await apiGetMemberAppearanceDetails(router.currentRoute.value.params.memberAppearanceId)
                .then(res => {
                    // console.log(res)
                    state.data = res.data[0]
                })
            loading.value = false
        }
        onMounted(() => {
            getRecommendedMemberAppearanceDetails()
        })
        return {
            state,
            getRecommendedMemberAppearanceDetails, loading
        }
    }
}
</script>

<style scoped>
.main {
    width: 1250px;
    clear: both;
    margin: auto;
    overflow: hidden;
}

.news_detail_left {
    background-color: #fff;
    padding: 1%;
    margin-top: 3px;
}

.text {
    margin: 5%;
    padding-bottom: 5%;
}
</style>