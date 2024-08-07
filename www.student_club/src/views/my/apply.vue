<template>
  <div style="position: relative;">
    <div style="margin:2%">
      <el-button type="primary" @click="form.dialogFormVisible = true;" style="float: right; margin-right: 20px">
        申请社团
      </el-button>
      <div v-if="form.tableData.length == 0">
        <el-empty description="还没有申请过社团，快去申请社团吧~" />
      </div>
      <!-- 申请过的社团列表 -->
      <div v-if="form.tableData.length > 0">
        <el-table
          :data="form.tableData ? form.tableData.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize) : []"
          stripe style="width: 100%" :default-sort="{ prop: 'create_time', order: 'descending' }"
          v-loading="loading.tableLoading">
          <el-table-column prop="club_name" label="申请社团名" width="150" />
          <el-table-column prop="category_name" label="社团类型" width="150" />
          <el-table-column prop="address" label="办公地址" width="150" />
          <el-table-column prop="teacher_name" label="指导教师" width="150" />
          <el-table-column prop="create_time" sortable label="申请时间" width="180" />
          <el-table-column prop="status" label="状态" width="150" class="applyState" />
          <el-table-column label="操作" fixed="right" width="140" align="center">
            <template #default="scope">
              <el-button v-if="scope.row.status === '待审批'" size="small" link type="danger"
                @click="delApply(scope.row.club_id)">撤销</el-button>
              <el-button v-if="scope.row.status === '被驳回' || scope.row.status === '未提交'" size="small" link type="danger"
                @click="updateApply(scope.row.club_id, scope.row.status)">修改</el-button>
              <el-button v-if="scope.row.status === '被驳回' || scope.row.status === '未提交'" size="small" link type="danger"
                @click="delApply(scope.row.club_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-wrapper">
      <el-pagination background class="footer_pagination" :hide-on-single-page="false" layout="prev, pager, next"
        :total="state.total" :page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
    </div>
  </div>
  <!-- 申请社团 -->
  <el-dialog v-model="form.dialogFormVisible" title="申请社团" center>
    <el-form ref="applyFormRef" :rules="applyRules" :model="form.applyData" label-width="120px"
      v-loading="loading.formLoading">
      <el-form-item label="申请社团名" prop="club_name" style="max-width: 460px">
        <el-input v-model="form.applyData.club_name" />
      </el-form-item>
      <el-form-item label="社团类型" prop="category_id">
        <el-select v-model="form.applyData.category_id" placeholder="请选择社团类型">
          <el-option v-for="(item, index) in form.categoryData" :key="index" :label="item.category_name"
            :value="item.category_id" />
        </el-select>
      </el-form-item>
      <el-form-item label="社团图标" prop="logo_url">
        <el-upload drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif" :http-request="handleUploadPic"
          :file-list="state.fileList" action="" list-type="picture-card"><i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="所属学院" prop="college_id">
        <el-select v-model="form.applyData.college_id" placeholder="请选择所属学院">
          <el-option v-for="(item, index) in form.collegeData" :key="index" :label="item.college_name"
            :value="item.college_id" />
        </el-select>
      </el-form-item>
      <el-form-item label="指导教师" prop="teacher_name" style="max-width: 300px">
        <el-input v-model="form.applyData.teacher_name" />
      </el-form-item>
      <el-form-item label="办公地址" prop="address" style="max-width: 300px">
        <el-input v-model="form.applyData.address" />
      </el-form-item>
      <el-form-item label="申请理由" prop="description" style="max-width: 660px">
        <el-input v-model="form.applyData.description" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button @click="cancleApply(applyFormRef)">取消</el-button>
        <el-button v-if="state.isReApply === false" type="primary" @click="save(applyFormRef)"
          :loading="loading.saveLoading">
          保存
        </el-button>
        <el-button type="primary" @click="apply(applyFormRef)" :loading="loading.submitLoading">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { apiGetAppliedClubs, apiApplyClub, apiReApplyClub, apiSaveApplyClub, apiGetApplyClubInfo, apiCancleApplyClub } from '@/api/studentInfo'
import { getCookies, toast } from '@/utils/tool'
import { apiPicUpload } from '@/api/RotationPic'
import { apiGetCollegeInfo, apiGetClubCategories } from '@/api/account'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = reactive({
  submitLoading: false,
  saveLoading: false,
  tableLoading: false,
  formLoading: false
})
const form = reactive({
  dialogFormVisible: false,
  applyData: {
    user_id: getCookies('user_id'),
    user_type: 0,
    club_name: "",
    category_id: "",
    teacher_name: "",
    college_id: "",
    description: "",
    logo_url: '',
    address: ''
  },
  tableData: [],
  collegeData: [],
  categoryData: []
});
const state = reactive({
  isReApply: false,
  reApplyClubId: '',
  total: '',
  pageSize: 10,
  currentPage: 1,
  fileList: ''
})
// 状态转换
const translate = (data) => {
  data.forEach((element) => {
    if (element.status == 0) {
      element.status = "待审批";
    } else if (element.status == 1) {
      element.status = "已通过";
    }
    else if (element.status == 2) {
      element.status = "被驳回";
    }
    else if (element.status == 3) {
      element.status = "未提交";
    }
  });
};
// 获取申请列表
const getAppliedClubs = async () => {
  loading.tableLoading = true
  await apiGetAppliedClubs({
    user_id: getCookies('user_id'),
    user_type: 0,
  }).then(res => {
    if (res.code === '2000') {
      state.total = res.data.length
      form.tableData = res.data
      translate(form.tableData);
    }
  }).catch(err => {
    console.log(err);
  })
  loading.tableLoading = false
}
// 分页
const changePage = (val) => {
  state.currentPage = val
}
// 社团图标
const handleUploadPic = (item) => {
  apiPicUpload({
    user_id: getCookies('user_id'),
    user_type: 0,
    pic_file: item.file
  }).then((res) => {
    // 如果是本地服务器存储的话，Url不为空；
    // newForm.pic_url = res.data.Url
    //     ? res.data.Url
    //     : res.data.httpUrl
    form.applyData.logo_url = res.data.Url
  }).catch((err) => {
    console.log('pic', err)
    toast(err, 'error', 'Error')
  })
}
// 提交申请
const apply = async (applyFormRef) => {
  // console.log(state.isReApply)
  if (state.isReApply) {
    loading.submitLoading = true
    await apiReApplyClub(form.applyData, state.reApplyClubId)
      .then((res) => {
        // console.log(res)
        getAppliedClubs()
      })
      .catch((err) => {
        console.log(err)
      })
    applyFormRef.resetFields()
    loading.submitLoading = false
    form.dialogFormVisible = false
    state.isReApply = false
  }
  else {
    loading.submitLoading = true
    await applyFormRef.validate(async (valid, fields) => {
      if (valid) {
        await apiApplyClub(form.applyData).then(res => {
          if (res.code === '5001') {
            toast("该社团名已存在，请更换社团名！")
          }
          else {
            toast("申请成功！")
          }
          getAppliedClubs()

        }).catch(err => {
          getAppliedClubs()
          console.log(err);
        })
        loading.submitLoading = false
        form.dialogFormVisible = false
        applyFormRef.resetFields()

      } else {
        loading.submitLoading = false
        console.log('error submit!!');
        return false
      }
    });
  }
}
// 保存社团申请内容
const save = async (applyFormRef) => {
  await applyFormRef.validate(async (valid, fields) => {
    if (valid) {
      loading.saveLoading = true
      await apiSaveApplyClub(form.applyData).then(res => {
        if (res.code === '2000') {
          toast("保存成功！")
        }
      }).catch(err => {
        console.log(err);
      })
      getAppliedClubs()
      applyFormRef.resetFields()
      loading.saveLoading = false
      form.dialogFormVisible = false
    }
    else {
      loading.saveLoading = false
      console.log('error submit!!');
      return false
    }
  })
}
// 取消申请
const cancleApply = (applyFormRef) => {
  applyFormRef.resetFields()
  form.dialogFormVisible = false
  state.isReApply = false
}
// 修改社团申请内容
const updateApply = async (clubID, status) => {
  form.dialogFormVisible = true
  state.isReApply = true
  loading.formLoading = true
  state.reApplyClubId = clubID
  await apiGetApplyClubInfo({ club_id: clubID })
    .then((res) => {
      if (res.code === '2000') {
        form.applyData = res.data
      }
      // console.log(form.applyData)
    })
    .catch((err) => {
      console.log(err)
    })
  loading.formLoading = false
}
// 撤销社团申请
const delApply = async (clubID) => {
  ElMessageBox.confirm(
    '确认 撤销/删除 此社团的申请？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      apiCancleApplyClub(clubID)
        .then((res) => {
          ElMessage({
            type: 'success',
            message: '操作成功',
          })
          getAppliedClubs()
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}
// 表单校验
const applyFormRef = ref()
const applyRules = {
  club_name: [
    { required: true, message: '请输入社团名', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ],
  logo_url: [
    { required: true, message: '请上传图片', trigger: 'blur' }
  ],
  college_id: [
    { required: true, message: '请选择学院', trigger: 'blur' }
  ],
  teacher_name: [
    { required: true, message: '请填写指导教师', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请填写地址', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请填写申请理由', trigger: 'blur' }
  ]
}

// 获取学院信息
const getCollegeInfo = () => {
  apiGetCollegeInfo().then(res => {
    form.collegeData = res.data
  })
}
// 获取 社团分类
const getClubCategories = () => {
  apiGetClubCategories().then(res => {
    form.categoryData = res.data
  })
}
// 预加载
onMounted(() => {
  getAppliedClubs()
  getCollegeInfo()
  getClubCategories()
});
</script>
<style>
.pagination-wrapper {
  position: absolute;
  top: 530px;
  margin-left: 2%;
}
</style>
