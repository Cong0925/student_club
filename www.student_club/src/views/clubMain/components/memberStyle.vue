<template>
  <div class="memberStyle">
    <el-card style="height:270px;padding-top: 5%;">
      <div class="img_con">
        <el-avatar shape="circle" :size="100" fit="cover" :src="state.data.logo_url" />
      </div>
      <div class="memberStyle-club-name">{{ state.data.club_name }}</div>
      <div v-if="state.isLogin == true">{{ state.data.like_count }} 人已关注</div>
      <el-button type="warning" class="button11" v-if="state.data.level == '社长' || state.data.level == '副社长'" @click="$router.push({
        name: 'ClubCenter',
        params: {
          clubId: $router.currentRoute.value.params.clubId
        }
      })">社团管理</el-button>
      <el-button type="warning" class="button11" v-if="state.data.level == '0'" disabled>待审核</el-button>
      <el-button type="warning" class="button11"
        v-if="state.data.has_join == '1' & state.data.level != '社长' & state.data.level != '副社长' & state.data.level != '0'"
        disabled>已加入</el-button>
      <el-button type="warning" class="button11"
        v-if="state.data.has_join == ' ' || !state.isLogin || state.data.level == null" @click="attend">我要加入</el-button>
      <el-button type="primary" class="button12" v-if="state.data.has_like == '1'" disabled>已关注</el-button>
      <el-button type="primary" class="button12" v-if="state.data.has_like == ' ' || !state.isLogin"
        @click="like">我要关注</el-button>
    </el-card>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { apiClubSummarydata } from '@/api/club'
import { apiJoinClub, apiLikeClub } from '@/api/club'
import { apiGetLevel } from '@/api/account'
import { getCookies, setCookies, toast } from '@/utils/tool'
import { useRoute, useRouter } from "vue-router"
import APP_CONFIG from '@/config/index.js'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      data: {},
      club_id: '',
      isLogin: false
    })
    const getData = () => {
      state.club_id = router.currentRoute.value.params.clubId
      apiClubSummarydata(state.club_id, {
        student_id: getCookies('user_id')
      })
        .then((res) => {
          state.data = res.data
          if (state.data.logo_url) {
            if (!state.data.logo_url.includes(APP_CONFIG.BASEURL_PIC)) {
              state.data.logo_url = APP_CONFIG.BASEURL_PIC + state.data.logo_url
            }
          }
          else {
            state.data.logo_url = APP_CONFIG.BASE_PIC
          }
        })
        .catch((err) => {
          console.log('apiClubSummarydata', err)
          toast(err, 'error', 'Error')
        })
    }

    const attend = () => {
      if (!state.isLogin) {
        toast('请先登录！', 'warning', 'Warning')
        router.push({ name: 'Login' })
      } else {
        apiJoinClub({
          user_id: getCookies('user_id'),
          user_type: 0,
          club_id: router.currentRoute.value.params.clubId
        }).then(res => {
          if (res.code == '2000') {
            toast('已发送申请')
            getData()
          }
        }).catch(err => {
          console.log('apiJoinClub', err);
        })
      }

    }
    const like = () => {
      if (!state.isLogin) {
        toast('请先登录！', 'warning', 'Warning')
        router.push({ name: 'Login' })
      } else {
        apiLikeClub({
          student_id: getCookies('user_id'),
          club_id: router.currentRoute.value.params.clubId
        }).then(res => {
          if (res.code == '2000') {
            toast('已关注')
            getData()
          }
        }).catch(err => {
          console.log('apiLikeClub', err);
        })
      }

    }
    const getLevel = () => {
      apiGetLevel({
        user_id: getCookies('user_id'),
        user_type: 0,
        club_id: router.currentRoute.value.params.clubId
      }).then(res => {
        state.data.level = res.data.level
      }).catch(err => {
        console.log(err);
      })
    }
    const toNew = (name, club_id) => {
      let newpath = router.resolve({ name, params: { clubId: club_id } })
      window.open(newpath.href, '_blank')
    }
    onMounted(() => {
      state.isLogin = getCookies('isLogin')
      if (state.isLogin) {
        getLevel()
      }
      getData()
    })
    return {
      state, attend, like, toNew
    }
  }
}
</script>

<style scoped>
.memberStyle {
  width: 100%;
  height: 290px;
  padding-top: 5%;
  text-align: center;
  /* border-radius: 1px; */
}

.memberStyle-club-name {
  font-size: 22px;
  margin-bottom: 5px;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.img_con {
  width: 104px;
  height: 104px;
  margin-left: 38%;
  margin-bottom: 3%;
  border: #BBBBBB 2px solid;
  border-radius: 50%;
}

.button11 {
  height: 35px;
  width: 80px;
  margin-top: 15px;
  margin-right: 40px;
}

.button12 {
  height: 35px;
  width: 80px;
  margin-top: 15px;
}
</style>

