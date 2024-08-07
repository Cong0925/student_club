<template>
  <div style="position: relative;">
    <div style="margin:2%" v-if="!state.dialogVisible & state.postAppearance == 0">
      <el-button circle type="primary" plain icon="Plus" style="margin-left: 95%;margin-bottom: 5px;"
        @click="state.postAppearance = 1" />
      <div v-if="state.hasData === false">
        <el-empty description="还没有风采发布，点击右上角进行第一次的风采发布吧！" />
      </div>
      <div v-if="state.hasData === true" style="margin-top: 10px" v-loading="loading.listLoading">
        <el-card v-for="(item, index) in state.myMemberAppearance" :key="index"
          style="cursor: pointer; margin-bottom:5px">
          <el-avatar shape="square" :size="100" :src="item.pic_url" fit="cover" style="float:left"
            @click="$router.push({ name: 'MemberAppearDetails', params: { clubId: item.club_id, memberAppearanceId: item.member_appearance_id } })" />
          <div
            style="float:left; line-height:40px; margin-top: 8px; margin-left:5px; width:60%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
            @click="$router.push({ name: 'MemberAppearDetails', params: { clubId: item.club_id, memberAppearanceId: item.member_appearance_id } })">
            <span style="font-size:15px;">【{{ item.club_name }}】 {{ item.title }}</span><br>
            <span style="font-size:13px;">&nbsp;&nbsp;更新时间：{{ item.update_time }}</span>
          </div>
          <div style="padding-top:30px; float:right;padding-right:5%">
            <el-button type="primary" circle @click="modifyMemberAppearance(item.member_appearance_id)"><el-icon>
                <Edit />
              </el-icon></el-button>
            <el-button type="danger" :icon="Delete" circle
              @click="deleteMemberAppearance(item.member_appearance_id)"><el-icon>
                <Delete />
              </el-icon></el-button>
          </div>
        </el-card>
      </div>
    </div>
    <div class="pagination-wrapper" v-if="!state.dialogVisible & state.postAppearance == 0">
      <el-pagination background :hide-on-single-page="false" layout="prev, pager, next" :total="state.total"
        :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
    </div>
  </div>
  <!-- 修改 -->
  <div style="padding: 2%" v-if="state.dialogVisible" v-loading="loading.updateFormLoading">
    <el-form-item label="重新上传封面">
      <el-upload drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif"
        :http-request="handleReUploadAppearancePic" :file-list="state.fileList" action="" list-type="picture-card"><i
          class="el-icon-plus" />
      </el-upload>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="state.title" />
    </el-form-item>
    <Editor :value="state.content" placeholder-text="" @input="WatchActiveSummary($event)" /> <br>
    <el-form-item>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="apply" :loading="loading.updateLoading">完成</el-button>
    </el-form-item>
  </div>
  <!-- 删除 -->
  <el-dialog v-model="state.centerDialogVisible" title="Warning" width="30%" align-center>
    <span>确认删除该成员风采？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.centerDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="sureDelete()" :loading="loading.delLoading">确认删除</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 增加 -->
  <div style="padding: 2%" v-if="state.postAppearance == 1">
    <el-form :model="appearanceForm" label-width="120px" ref="addFormRef" :rules="addRules">
      <el-form-item label="所属社团" prop="club">
        <el-select v-model="appearanceForm.club_id" placeholder="请选择社团">
          <el-option v-for="(item, index) in state.myClub" :key="index" :label="item.club_name" :value="item.club_id" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="appearanceForm.title" />
      </el-form-item>
      <el-form-item label="上传封面" prop="pic">
        <el-upload drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif"
          :http-request="handleUploadAppearancePic" :file-list="state.fileList" action="" list-type="picture-card"><i
            class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="具体内容" prop="content">
        <Editor :value="appearanceForm.content" placeholder-text="" @input="WatchSummary($event)" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitAppearance(addFormRef)" :loading="loading.addloading">提交</el-button>
        <el-button @click="cancleAdd(addFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import {
  apiGetMyMemberAppearance,
  apiModifyMemberAppearance,
  apiGetMemberAppearanceDetails,
  apiDeleteMemberAppearance,
  apiApplyMemberAppearance
} from '@/api/member'
import { apiGetMyJoinClubs } from '@/api/studentInfo'
import { apiPicUpload } from '@/api/RotationPic'
import { useRoute } from 'vue-router'
import { getCookies, toast } from '@/utils/tool'
import { Edit, Delete, Plus } from '@element-plus/icons-vue'
import Editor from '@/components/Editor'

export default {
  components: {
    Editor
  },
  setup() {
    const loading = reactive({
      listLoading: false,
      addloading: false,
      delLoading: false,
      updateLoading: false,
      updateFormLoading: false
    })
    const state = reactive({
      myMemberAppearance: [],
      dialogVisible: false,
      centerDialogVisible: false,
      content: "",
      id: '',
      total: '',
      pageSize: 4,
      currentPage: 1,
      postAppearance: 0,
      fileList: [],
      myClub: [],
      pic_url: '',
      title: '',
      hasData: false
    })
    // 获取我的社团列表
    const getMyClub = () => {
      apiGetMyJoinClubs({
        user_id: getCookies('user_id'),
        user_type: 0
      }).then(res => {
        state.myClub = res.data
      }).catch(err => {
        console.log(err);
      })
    }
    const route = useRoute()
    // 获取我的风采列表
    const getMyMemberAppearance = async () => {
      loading.listLoading = true
      await apiGetMyMemberAppearance({
        user_id: getCookies('user_id'),
        user_type: 0,
        size: state.pageSize,
        page: state.currentPage
      })
        .then((res) => {
          // console.log(res)
          if (res.code == 2000) {
            state.myMemberAppearance = res.data
            state.total = res.count
            state.hasData = true
          }
          if (res.code == 2001) {
            state.myMemberAppearance = ''
          }
        })
        .catch((err) => {
          console.log('apiGetMyMemberAppearance', err);
          toast(err, 'error', 'Error')
        })
      loading.listLoading = false
    }
    // 删除风采
    const deleteMemberAppearance = (id) => {
      state.centerDialogVisible = true
      state.id = id
    }
    // 重新上传封面
    const handleReUploadAppearancePic = (item) => {
      apiPicUpload({
        user_id: getCookies('user_id'),
        user_type: 0,
        pic_file: item.file
      }).then((res) => {
        state.pic_url = res.data.Url
      }).catch((err) => {
        console.log('pic', err)
        toast(err, 'error', 'Error')
      })
    }
    // 成员风采
    const appearanceForm = reactive({
      user_id: '',
      user_type: 0,
      club_id: '',
      pic_url: '',
      content: '',
      title: ''
    })
    // 上传封面
    const handleUploadAppearancePic = async (item) => {
      await apiPicUpload({
        user_id: getCookies('user_id'),
        user_type: 0,
        pic_file: item.file
      }).then((res) => {
        appearanceForm.pic_url = res.data.Url
      }).catch((err) => {
        console.log('pic', err)
        toast(err, 'error', 'Error')
      })
    }
    // 提交风采添加
    const onSubmitAppearance = async (formName) => {
      loading.addloading = true
      formName.validate(async (valid, fields) => {
        if (valid) {
          appearanceForm.user_id = getCookies('user_id')
          await apiApplyMemberAppearance(appearanceForm).then(res => {
            toast('已申请')
            getMyMemberAppearance()
            state.postAppearance = 0
            appearanceForm.club_id = ''
            appearanceForm.pic_url = ''
            formName.resetFields()
          }).catch(err => {
            console.log('apiApplyMemberAppearance', err);
            toast(err, 'error', 'Error')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      loading.addloading = false
    }
    // 监听添加内容
    const WatchSummary = item => {
      appearanceForm.content = item
    }
    // 确认删除 风采
    const sureDelete = async () => {
      loading.delLoading = true
      await apiDeleteMemberAppearance({
        user_id: getCookies('user_id'),
        user_type: 0
      }, state.id).then((res) => {
        state.centerDialogVisible = false
        getMyMemberAppearance()
      }).catch((err) => {
        console.log('apiDeleteMemberAppearance', err);
        toast(err, 'error', 'Error')
      })
      loading.delLoading = false
    }
    // 修改风采 
    const modifyMemberAppearance = async (id) => {
      loading.updateFormLoading = true
      loading.updateLoading = true
      state.dialogVisible = true
      await apiGetMemberAppearanceDetails(id).then(res => {
        state.content = res.data[0].content
        state.title = res.data[0].title
      }).catch(err => {
        toast(err, 'error', 'error')
      })
      state.id = id
      // apiModifyMemberAppearance({},id)
      loading.updateLoading = false
      loading.updateFormLoading = false
    }
    // 修改内容监听
    const WatchActiveSummary = item => {
      state.content = item
    }
    // 修改提交
    const apply = async () => {
      loading.updateLoading = true
      await apiModifyMemberAppearance({
        user_id: getCookies('user_id'),
        user_type: 0,
        content: state.content,
        pic_url: state.pic_url,
        title: state.title
      }, state.id).then(res => {
        toast(res.message)
        getMyMemberAppearance(),
          state.dialogVisible = false
        state.content = ''
      }).catch(err => {
        toast(err, 'error', 'error')
      })
      loading.updateLoading = false

    }
    // 取消修改
    const cancel = () => {
      state.dialogVisible = false
      state.content = ''
    }
    // 取消添加
    const cancleAdd = (formName) => {
      if (!formName) return
      state.postAppearance = 0
      appearanceForm.club_id = ''
      appearanceForm.pic_url = ''
      formName.resetFields()
    }

    // 表单校验
    const checkClub = () => {
      if (appearanceForm.club_id) {
        return true
      } else {
        return false
      }
    }
    const checkPic = () => {
      if (appearanceForm.pic_url) {
        return true
      } else {
        return false
      }
    }
    const addFormRef = ref()
    const addRules = {
      club: [
        { required: true, validator: checkClub, message: '请选择社团', trigger: 'blur' }
      ],
      title: [
        { required: true, message: '请填写标题', trigger: 'blur' }
      ],
      pic: [
        { required: true, validator: checkPic, message: '请上传图片', trigger: 'blur' }
      ],
      content: [
        { required: true, message: '请输入内容', trigger: 'blur' }
      ]
    }
    // 分页
    const changePage = (val) => {
      state.currentPage = val
      getMyMemberAppearance()
    }
    // 预加载
    onMounted(() => {
      getMyMemberAppearance(),
        getMyClub()
    })
    return {
      state, appearanceForm,
      modifyMemberAppearance, WatchActiveSummary, apply, cancel, changePage, deleteMemberAppearance, sureDelete,
      handleUploadAppearancePic, onSubmitAppearance, WatchSummary, handleReUploadAppearancePic, cancleAdd, addRules, addFormRef, loading
    }
  }
}
</script>

<style scoped>
.myClubCard {
  width: 99%;
  height: 180px;
  text-align: center;
}

.image {
  width: 100%;
  display: block;
  height: 130px;
}

.pagination-wrapper {
  position: absolute;
  top: 530px;
  margin-left: 2%;
}
</style>
