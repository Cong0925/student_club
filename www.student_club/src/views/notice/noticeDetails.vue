<template>
  <div>
    <div class="bread" @click="this.$router.go(-1)">首页>通知公告</div>
    <div class="main" v-loading="loading">
      <div class="title" style="margin-bottom:15px">{{ state.data.title }}</div>
      <div class="time related-left">{{ state.data.create_time }}</div>
      <hr>
      <div class="text" v-html="state.data.content"></div>
      <div class="download">
        <div v-if="state.file_info != null">
          <div v-for="(item, index) in state.file_info" :key="index">
            <a :href="item.file_url" :download="item.file_name" target="_blank">{{ item.file_name }}</a>
          </div>
        </div>
      </div>
      <hr>
      <div class="time related-left">{{ state.data.club_name }}</div>
      <div class="time related-right">编辑：{{ state.data.editor }}</div>
    </div>
  </div>
</template>

<script>
import { toast } from '@/utils/tool'
import { apiGetNoticeDetail } from '@/api/notice'
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
export default {
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const state = reactive({
      data: {},
      file_info: []
    })
    const getNoticeDetail = async () => {
      loading.value = true
      await apiGetNoticeDetail(router.currentRoute.value.params.noticeId)
        .then((res) => {
          state.data = res.data[0]
          if (state.data.file_info != null) {
            let file = JSON.parse(state.data.file_info)
            state.file_info = file.file_info
          }
        })
        .catch((err) => {
          console.log('apiGetNoticeDetail', err)
          toast(err, 'error', 'Error')
        })
      loading.value = false

    }
    onMounted(() => {
      getNoticeDetail()
    })
    return {
      state,
      loading
    }
  }
}
</script>

<style scoped>
.main {
  width: 1250px;
  margin: auto;
  padding: 2%;
  background-color: #fff;
  margin-top: 5px;
  min-height: 500px;
}

.title {
  font-size: 30px;
}

.text {
  padding: 5%;
}

.download {
  color: dodgerblue;
  font-size: 13px;
  cursor: pointer;
}

.related-left {
  font-size: 15px;
  display: inline-block;
}

.related-right {
  font-size: 15px;
  float: right;
}</style>