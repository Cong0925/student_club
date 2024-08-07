<template>
  <div class="clubCenter-main">
    <Affix />
    <div class="clubCenter" style="position: relative;">
      <!-- <div class="head">
      <div class="title">社团成员</div>
      <div class="search"><el-input class="w-50 m-2" v-model="input" placeholder="请输入姓名"/><el-button link>搜索</el-button></div>
    </div> -->
      <el-card v-for="(item, index) in state.stuList" :key="index" class="clubMember-card">
        <el-avatar v-if="item.head_pic !== ''" :size="70"
          :src="item.head_pic.includes(state.pic_baseUrl) ? item.head_pic : (state.pic_baseUrl + item.head_pic)"
          class="clubMember-url" />
        <el-dropdown trigger="click" class="clubMember-more">
          <span><el-icon>
              <MoreFilled />
            </el-icon></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item><el-button text
                  @click="changeLevel(item.level, item.student_id)">职位变更</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="clubMember-name">
          <el-icon v-if="item.sex === '男'">
            <Male />
          </el-icon>
          <el-icon v-if="item.sex === '女'" style="color: #f37e7d">
            <Female />
          </el-icon>
          <span style="color:black">{{ item.student_name === '' ? item.student_number : item.student_name }}</span>
          <br>
          <span style="color:black">{{ item.level }}</span>
        </div>
      </el-card>
      <div style="position: absolute;top: 600px;">
        <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
          :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
      </div>
    </div>
    <el-dialog v-model="state.dialogFormVisible" title="更改社员职位">
      <span v-if="state.pre_level == '社长'">社长职位不可变更！</span>
      <el-form v-if="state.pre_level != '社长'" style="width:300px">
        <el-form-item label="原有职位">
          {{ state.pre_level }}
        </el-form-item>
        <el-form-item label="职位变更为">
          <el-select v-model="state.dest_level" placeholder="请选择职位">
            <el-option label="普通社员" value="普通社员" />
            <el-option label="副社长" value="副社长" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.dialogFormVisible = false">取消</el-button>
          <el-button v-if="state.pre_level != '社长'" type="primary" @click="modifyLevel()">确认</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import Affix from "@/components/Affix";
import { reactive, onMounted } from "vue";
import { apiGetClubMembers } from "@/api/club";
import { apiModifyLevel, apiGetLevel } from "@/api/account";
import { getCookies, toast } from "@/utils/tool";
import { useRoute, useRouter } from "vue-router";
import { MoreFilled } from '@element-plus/icons-vue'
import APP_CONFIG from '@/config/index.js'

export default {
  components: {
    Affix,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      stuList: [],
      dialogFormVisible: false,
      pre_level: '',
      dest_level: '',
      change_id: '',
      level: '',
      total: '',
      pageSize: 18,
      currentPage: 1,
      pic_baseUrl: APP_CONFIG.BASEURL_PIC
    });
    const getClubMembers = () => {
      apiGetClubMembers({
        user_id: getCookies("user_id"),
        user_type: 0,
        club_id: router.currentRoute.value.params.clubId,
        page: state.currentPage,
        size: state.pageSize
      })
        .then((res) => {
          state.total = res.count
          state.stuList = res.data;
        })
        .catch((err) => {
          console.log("apiGetClubMembers", err);
          toast(err, 'error', 'Error');
        });
    };
    const toMemberDetail = (id) => {
      router.push({ name: 'MemberSpace', query: { studentId: id } })
    }
    const changeLevel = (level, id) => {
      state.pre_level = level
      state.change_id = id
      state.dialogFormVisible = true
    }
    const getLevel = () => {
      apiGetLevel({
        user_id: getCookies('user_id'),
        user_type: 0,
        club_id: getCookies('club_id')
      }).then(res => {
        state.level = res.data['level']
      }).catch(err => {
        console.log(err);
      })
    }
    const modifyLevel = () => {
      apiModifyLevel({
        user_id: getCookies("user_id"),
        user_type: 0,
        user_level: state.level,
        member_id: state.change_id,
        club_id: router.currentRoute.value.params.clubId,
        pre_level: state.pre_level,
        dest_level: state.dest_level
      }).then((res) => {
        state.dialogFormVisible = false
        if (res.code == 2000) {
          toast('修改成功')
          getClubMembers();
          getLevel()
        }
      }).catch((err) => {
        state.dialogFormVisible = false
        console.log("apiModifyLevel", err);
        toast(err, 'error', 'Error');
      });
    }
    const changePage = (val) => {
      state.currentPage = val
      getClubMembers();

    }
    onMounted(() => {
      getClubMembers();
      getLevel()
    });
    return {
      state,
      toMemberDetail,
      changeLevel,
      modifyLevel,
      changePage
    };
  },
};
</script>

<style scoped>
.head {
  height: 50px;
  width: 100%;
}

.title {
  font-size: 18px;
  font-weight: bold;
  width: 70%;
  height: 50px;
  line-height: 50px;
  float: left;
}

.search {
  width: 30%;
}

.clubMember-card {
  width: 150px;
  height: 150px;
  float: left;
  margin-right: 1%;
  margin-top: 15px;
  position: relative;
}

.clubMember-more {
  position: absolute;
  right: 3%;
  cursor: pointer;
}

.clubMember-url {
  position: absolute;
  left: 25%;
  top: 15px;
}

.clubMember-name {
  position: absolute;
  height: 45px;
  top: 100px;
  width: 140px;
  color: #338fd0;
  text-align: center;
}
</style>
