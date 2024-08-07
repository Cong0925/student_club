<!-- 轮播图 -->
<template>
  <div>
    <el-card>
      <el-table ref="multipleTable" v-loading="loading" :data="PicList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="rotation_pic_id" label="编号" align="center" header-align="center" width="300px" />
        <el-table-column prop="rotation_pic_name" label="名称" align="center" header-align="center" width="400px" />
        <el-table-column label="素材" align="center" header-align="center" min-width="300px">
          <template #default="scope">
            <img :key="scope.row.RotationPicID" style="width: 120px" :src="scope.row.rotation_pic_url" alt="首页轮播图" />
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="DestinationUrl"
          label="跳转地址"
          align="center"
          header-align="center"
        /> -->
        <el-table-column label="操作" header-align="center" align="center" width="200px">
          <template #default="scope">
            <!-- 删除 -->
            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="删除轮换图">
                <template #reference>
                  <i class="el-icon-delete" @click="handleDelete(scope.row.rotation_pic_id)" />
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="length < 5" class="addPic" @click="handleAdd()">
        <i class="el-icon-plus" />
        上传轮播图
        <span class="suggest">（最多支持五张轮播图）</span>
      </div>
    </el-card>
    <el-dialog v-model="dialogFormVisible" title="上传轮播图">
      <el-form ref="addFormRef" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="轮换图名称" prop="RotationPicName">
          <el-input v-model="editForm.RotationPicName" autocomplete="off" maxlength="30" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="上传图片" prop="RotationPicUrl">
          <el-upload class="avatar-uploader" drag action="" accept="jpg,jpeg,png,svg,bmp,gif" :show-file-list="false"
            :http-request="handleUploadPic">
            <img v-if="editForm.RotationPicUrl" style="width: 100%; height: 100%" :src="editForm.RotationHttpPicUrl"
              class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="跳转地址" prop="DestinationUrl">
          <el-input v-model="editForm.DestinationUrl" autocomplete="off" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <!-- <el-button v-if="ifEdit==true" type="primary" @click="submitEdit()">确认修改</el-button> -->
          <el-button type="primary" @click="submitAdd()">确认添加</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive, ref, toRefs, getCurrentInstance } from "vue";
import common from "@/api/model/common";
import rotationPic from '@/api/model/rotationPic';
export default {
  name: 'RotationPic',
  setup() {
    const multipleTable = ref(null)
    const addFormRef = ref(null)
    const { proxy } = getCurrentInstance()
    const state = reactive({
      loading: false,
      dialogFormVisible: false,
      ifEdit: false,
      PicList: [],
      length: '',
      multipleSelection: [],
      editForm: {
        RotationPicName: '',
        RotationPicID: '',
        RotationPicUrl: '',
        RotationHttpPicUrl: ''
      },
      rules: {
        RotationPicName: [
          { required: 'true', message: '请填写轮换图名称', trigger: 'blur' }
        ],
        RotationPicUrl: [
          { required: 'true', message: '请上传图片', trigger: 'blur' }
        ],
        DestinationUrl: [
          { required: 'true', message: '请填写跳转地址', trigger: 'blur' }
        ]
      },
      total: 0
    })
    onMounted(() => {
      getPicList()
    })

    //获取轮播图列表
    const getPicList = () => {
      rotationPic.APIFetchRotationPicList().then((res) => {
        state.PicList = res.data
        state.total = state.PicList.length
        state.length = res.data.length
        // console.log('Pic', )
      }).catch((err) => {
        console.log('PicList', err)
        // proxy.$Message.error({
        //     message:err
        // })
      })
    }

    const handleAdd = () => {
      state.ifEdit = false
      state.editForm.RotationPicName = ''
      state.editForm.RotationPicUrl = ''
      state.editForm.DestinationUrl = ''
      state.dialogFormVisible = true
    }
    //上传图片
    const handleUploadPic = (item) => {
      common.APIPicUpload({
        user_id: localStorage.UserID,
        user_type: localStorage.UserType,
        pic_file: item.file
      })
        .then((res) => {
          state.editForm.RotationPicUrl = res.data.Url
            ? res.data.Url
            : res.data.httpUrl
          state.editForm.RotationHttpPicUrl = res.data.httpUrl
        })
        .catch((err) => {
          console.log('pic', err)
          proxy.$message.error({
            message: err
          })
        })
    }
    //上传添加
    const submitAdd = () => {
      addFormRef.value.validate(valid => {
        if (valid) {
          state.loading = true
          rotationPic.APIAddRotationPic({
            user_id: localStorage.UserID,
            user_type: localStorage.UserType,
            rotation_pic_name: state.editForm.RotationPicName,
            rotation_pic_url: state.editForm.RotationPicUrl
          }).then((res) => {
            proxy.$message.success('轮播图添加成功！')
            getPicList()
          }).catch((err) => {
            console.log('change', err)
            proxy.$Message({
              showClose: true,
              message: err,
              type: "error"
            })
          })
          state.dialogFormVisible = false
          state.loading = false
        }
      })
    }
    //翻页
    const changePage = (val) => {
      state.currentPage = val
      getPicList()
    }
    //删除轮播图
    const handleDelete = (id) => {
      proxy.$messageBox.confirm('此操作将删除该条记录(' + id + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        state.loading = true
        rotationPic.APIDeleteRotationPic({
          user_id: localStorage.UserID,
          user_type: localStorage.UserType,
          mid: id
        }).then((res) => {
          // console.log('delete rotationPic', res)
          // console
          proxy.$message.success('删除成功')
          state.loading = false
          // 刷新
          getPicList()
        })
          .catch((err) => {
            console.log('delete rotationPic', err)
            proxy.$message.error({
              message: err
            })
            state.loading = false
          })
      }).catch(() => {
        proxy.$Message('取消删除')
      })
    }
    return {
      ...toRefs(state),
      multipleTable,
      getPicList,
      changePage,
      handleAdd,
      submitAdd,
      handleDelete,
      handleUploadPic,
      addFormRef
    }
  }
}
</script>
<style scoped lang="scss">
.order-container {
  min-height: 100%;
}

.el-icon-delete {
  margin-left: 80px;
}

.el-card.is-always-shadow {
  min-height: 100% !important;
}

.header {
  width: 100%;
  height: 33px;
  overflow: hidden;
}

.addPic {
  padding: 5px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 22px;

  .suggest {
    font-size: 16px;
    font-weight: 100;
  }
}

.avatar-uploader {
  width: 100px;
  height: 180px;
  color: #ddd;
  font-size: 30px;

  .avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    line-height: 180px;
    border: 1px solid #e9e9e9;
  }
}

.primary {
  float: left;
  color: rgb(27, 174, 174);
  font-size: 20px;
  margin: 0 2px;
}

.danger {
  float: left;
  color: rgb(226, 114, 49);
  font-size: 20px;
  margin: 0 2px;
}
</style>