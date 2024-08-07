<template>
  <div v-if="state.hasData === true" style="position: relative;" v-loading="loading">
    <div style="margin:2%">
      <el-row>
        <el-col
          v-for="(item, index) in state.myClub ? state.myClub.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize) : []"
          :key="index" :span="8">
          <el-card :body-style="{ padding: '0px' }" class="myClubCard" @click="toClub(item.club_id)">
            <el-image :src="item.logo_url" class="image" fit="cover" />
            <div style="padding: 14px">
              <span>{{ item.club_name }}</span>
            </div>
            <div v-if="item.level !== '社长'" style="position: absolute;right: 10px;bottom: 10px;" @click.stop>
              <el-dropdown trigger="click">
                <span><el-icon>
                    <Tools />
                  </el-icon></span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button text @click="exitApply(item.club_id, index)">
                        退团申请
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
    <el-empty description="还没有自己的社团，快去申请吧！" />
  </div>

  <el-dialog v-model="state.isShowExitApplyDialog" title="退团申请">
    <div style="margin-bottom: 20px;">当前状态： {{ state.exitApplyStatus === 1 ? '已提交' : (state.exitApplyStatus === 3 ?
      '审批未通过' : '未提交') }}</div>
    <el-form ref="exitClubRef" :model="exitApplyForm" label-position="top">
      <el-form-item label="退出理由：" prop="exit_reason" :rules="[
        { required: true, message: '输入申请退团理由' },
      ]">
        <el-input type="textarea" v-model="exitApplyForm.exit_reason" :disabled="state.isEidt"
          :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>



    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancleExit(exitClubRef)">返回</el-button>
        <el-button type="primary" @click="submitExitApply(exitClubRef)" :disabled="state.isEidt">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, onMounted } from "vue"
import { apiGetMyJoinClubs, apiExitClubApply, apiGetExitStatusApply, apiReExitClubApply } from '@/api/studentInfo'
import { getCookies, setCookies, toast } from '@/utils/tool'
import { useRouter } from 'vue-router'
import { apiGetLevel } from '@/api/account'
import APP_CONFIG from '@/config/index.js'

export default {
  setup() {
    const router = useRouter()
    const currentDate = ref(new Date());
    const loading = ref(false)
    const exitApplyForm = reactive({
      student_id: getCookies('user_id'),
      club_id: '',
      exit_reason: ''
    })
    const state = reactive({
      myClub: [],
      total: '',
      pageSize: 12,
      currentPage: 1,
      hasData: false,
      level: '',
      isEidt: false,
      isShowExitApplyDialog: false,
      exitApplyStatus: -1
    })
    const getMyClub = async () => {
      loading.value = true
      await apiGetMyJoinClubs({
        user_id: getCookies('user_id'),
        user_type: 0
      }).then(res => {
        if (res.data.length > 0) {
          state.total = res.data.length
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
          state.hasData = true
          for (let i = 0; i < res.data.length; i++) {
            getLevel(state.myClub[i].club_id, i)
          }
        }
      }).catch(err => {
        console.log(err);
      })
      loading.value = false

    }
    const getLevel = (clubId, index) => {
      apiGetLevel({
        user_id: getCookies('user_id'),
        user_type: 0,
        club_id: clubId
      }).then(res => {
        state.myClub[index].level = res.data.level
      }).catch(err => {
        console.log(err);
      })
    }
    const toClub = (data) => {
      router.push({
        name: 'ClubMain',
        params: {
          clubId: data
        }
      })
      setCookies("club_id", data)
    }
    const changePage = (val) => {
      state.currentPage = val
    }
    const checkExitStatus = (clubId, index) => {
      apiGetExitStatusApply({
        student_id: getCookies('user_id'),
        club_id: clubId
      })
        .then((res) => {
          state.exitApplyStatus = res.data[0].status
          if (state.exitApplyStatus === 1) {
            state.isEidt = true
          }
          exitApplyForm.exit_reason = res.data[0].exit_reason
        })
        .catch((err) => {
          toast(err)
        })
    }
    // 退出社团申请 显示
    const exitApply = async (clubId, index) => {
      await checkExitStatus(clubId, index)
      exitApplyForm.club_id = clubId
      state.isShowExitApplyDialog = true
    }
    const exitClubRef = ref()
    // 退出社团申请 提交
    const submitExitApply = (exitClubRef) => {
      if (!exitClubRef) return
      exitClubRef.validate((valid) => {
        if (valid) {
          if (state.exitApplyStatus === 1) {
            apiExitClubApply(exitApplyForm)
              .then((res) => {
                state.isShowExitApplyDialog = false
                exitApplyForm.exit_reason = ''
              })
              .catch((err) => {
                toast(err)
              })
          }
          else if (state.exitApplyStatus === 3) {
            apiReExitClubApply(exitApplyForm)
              .then((res) => {
                state.isShowExitApplyDialog = false
                exitApplyForm.exit_reason = ''
              })
              .catch((err) => {
                toast(err)
              })
          }
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
    // 取消退出
    const cancleExit = (exitClubRef) => {
      if (!exitClubRef) return
      exitClubRef.resetFields()
      state.isEidt = false

      state.isShowExitApplyDialog = false
    }
    // 预加载
    onMounted(() => {
      getMyClub()
    })
    return {
      currentDate,
      state,
      toClub,
      changePage,
      loading,
      exitApply,
      getLevel,
      exitApplyForm,
      submitExitApply,
      exitClubRef,
      cancleExit,
      checkExitStatus
    };
  },
};
</script>

<style scoped>
.myClubCard {
  position: relative;
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
