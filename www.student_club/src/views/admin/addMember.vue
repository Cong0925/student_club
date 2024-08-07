<template>
  <div class="clubCenter-main">
    <Affix />
    <div class="clubCenter">
      <!-- <div style="font-weight:bold">待审核</div> -->
      <div>
        <div style="font-weight:bold">待审核</div>
        <el-tabs v-model="state.tagName" class="demo-tabs" stretch>
          <el-tab-pane label="入社审批" name="first" style="padding:15px; height: 60vh; overflow-y: auto;">
            <div v-if="state.joinDataList.length === 0"><el-empty description="目前没有人申请加入哦~" /></div>
            <el-collapse v-model="state.activeName" v-if="state.joinDataList.length > 0">
              <el-collapse-item v-for="(item, index) in state.joinDataList" :key="index" :name="index + 1">
                <template #title>
                  成员： {{ item.student_name === '' ? item.student_number : item.student_name }}
                </template>
                <el-steps :active="item.active" finish-status="success" align-center>
                  <el-step title="申请入社" />
                  <el-step title="社长审批" />
                </el-steps>
                <div v-if="item.isCheck === false">
                  <el-button type="success" plain @click="pass('join', item.student_id, index)">通过</el-button>
                  <el-button type="danger" plain @click="refuse('join', item.student_id, index)">拒绝</el-button>
                </div>
                <div v-if="item.isCheck === true">
                  <el-button type="success" plain disabled>已审批</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>

          <el-tab-pane label="退社审批" name="second" style="padding:15px; height: 60vh; overflow-y: auto;">
            <div v-if="state.exitDataList.length == 0"><el-empty description="目前没有人申请退出哦~" /></div>
            <el-collapse v-model="state.activeName" v-if="state.exitDataList.length > 0">
              <el-collapse-item v-for="(item, index) in state.exitDataList" :key="index" :name="index + 1">
                <template #title>
                  成员： {{ item.student_name === '' ? item.student_number : item.student_name }}
                </template>
                <el-steps :active="item.active" finish-status="success" align-center>
                  <el-step title="申请退社" />
                  <el-step title="社长审批" />
                </el-steps>
                <div style="margin-top: 10px;margin-bottom: 10px;">退团理由: {{ item.exit_reason }}</div>
                <div v-if="item.isCheck === false">
                  <el-button type="success" plain @click="pass('exit', item.student_id, index)">通过</el-button>
                  <el-button type="danger" plain @click="refuse('exit', item.student_id, index)">拒绝</el-button>
                </div>
                <div v-if="item.isCheck === true">
                  <el-button type="success" plain disabled>已审批</el-button>
                </div>

              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>

      </div>

    </div>
  </div>
</template>

<script>
import Affix from '@/components/Affix'
import { reactive, onMounted } from 'vue'
import { getCookies, toast } from '@/utils/tool'
import { apiGetStudentJoinApplications, apiPassJoin, apiRefuseJoin, apiGetStudentExitApplications, apiPassExit, apiRefuseExit } from '@/api/club'
import { useRouter } from "vue-router"
export default {
  components: {
    Affix
  },
  setup() {
    const router = useRouter()
    const state = reactive({
      activeName: 1,
      tagName: 'first',
      joinDataList: [],
      exitDataList: []
    })
    // 获取入社成员申请 列表
    const getStudentJoinApplications = () => {
      apiGetStudentJoinApplications({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: '社长',
        club_id: router.currentRoute.value.params.clubId,
        //   status:'学校已通过'
      })
        .then((res) => {
          state.joinDataList = res.data
          for (let i = 0; i < res.data.length; i++) {
            state.joinDataList[i].active = 1
            state.joinDataList[i].isCheck = false
          }
        })
        .catch((err) => {
          console.log('apiGetStudentJoinApplications', err)
          toast(err, 'error', 'Error')
        })
    }
    // 获取退社成员申请 列表
    const getStudentExitApplications = () => {
      apiGetStudentExitApplications({
        club_id: router.currentRoute.value.params.clubId,
      })
        .then((res) => {
          state.exitDataList = res.data.filter(item => item.status === 1);
          for (let i = 0; i < state.exitDataList.length; i++) {
            state.exitDataList[i].active = 1
            state.exitDataList[i].isCheck = false
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    // 通过申请
    const pass = (type, id, index) => {
      if (type === 'join') {
        if (state.joinDataList[index].active = 1) state.joinDataList[index].active = 2
        apiPassJoin({
          user_id: getCookies('user_id'),
          user_type: 0,
          user_level: "社长",
          member_id: id,
          club_id: router.currentRoute.value.params.clubId
        }).then(res => {
          state.joinDataList[index].isCheck = true
          getStudentJoinApplications()
        }).catch(err => { console.log(err); })
      }
      else if (type === 'exit') {
        if (state.exitDataList[index].active = 1) state.exitDataList[index].active = 2
        apiPassExit({
          user_id: getCookies('user_id'),
          user_type: 0,
          user_level: "社长",
          student_id: id,
          club_id: router.currentRoute.value.params.clubId
        })
          .then(res => {
            state.exitDataList[index].isCheck = true
            getStudentExitApplications()
          })
          .catch(err => { console.log(err); })
      }
    }
    // 拒绝申请
    const refuse = (type, id, index) => {
      if (type === 'join') {
        state.joinDataList[index].active = 1
        apiRefuseJoin({
          user_id: getCookies('user_id'),
          user_type: 0,
          user_level: "社长",
          member_id: id,
          club_id: router.currentRoute.value.params.clubId
        }).then(res => {
          console.log(res)
          state.joinDataList[index].isCheck = true
          getStudentJoinApplications()
        }).catch(err => { console.log(err); })
      }
      else if (type === 'exit') {
        state.exitDataList[index].active = 1
        apiRefuseExit({
          user_id: getCookies('user_id'),
          user_type: 0,
          user_level: "社长",
          student_id: id,
          club_id: router.currentRoute.value.params.clubId
        })
          .then(res => {
            console.log(res)
            state.exitDataList[index].isCheck = true
            getStudentExitApplications()
          })
          .catch(err => { console.log(err); })
      }

    }
    onMounted(() => {
      getStudentJoinApplications()
      getStudentExitApplications()
    })
    return {
      state,
      pass,
      refuse
    }
  }
}
</script>

<style></style>