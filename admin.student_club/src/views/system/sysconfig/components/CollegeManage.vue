<template>
  <div>
    <el-card>
      <template #header>
        <el-input
          v-model="selectCollege"
          maxlength="30"
          style="width: 200px; margin-right: 10px"
          placeholder="学院名称"
          size="small"
          clearable
          @change="handleSearch()"
        />
        <el-button
          type="primary"
          size="small"
          @click="handleSearch()"
        >搜索</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleAdd()"
        >添加学院</el-button>

      </template>

      <!-- 班级管理 -->
      <el-table

        ref="multipleTable"
        v-loading="loading"
        :data="CollegeList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="college_id"
          label="学院ID"
          align="center"
          header-align="center"
          width=400px
        />
        <el-table-column
          prop="college_name"
          label="学院名称"
          align="center"
          header-align="center"
          
        />
        <el-table-column
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
          width="50px"
        >
          <template #default="scope">
            <!-- 删除班级 -->
            <div class="danger">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="删除学院"
              >
                <template #reference>
                  <i
                    class="el-icon-delete"
                    @click="handleDelete(scope.row.college_id)"
                  />
                </template>
              </el-popover>
            </div>
          </template>

        </el-table-column>
      </el-table>

      <!--总数超过一页，再展示分页器-->
      <el-pagination
        background
        :hide-on-single-page="true"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="changePage"
      />
      <!-- 班级添加弹窗 -->
      <el-dialog

        v-model="dialogFormVisible"
        title="学院设置"
      >
        <el-form
          ref="addFormRef"
          :model="editForm"
          :rules="collegeRules"
          label-width="100px"
        >
          <el-form-item label="学院名称" prop="CollegeName">
            <el-input
              v-model="editForm.CollegeName"
              maxlength="20"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <!-- <el-button v-if="ifEdit==true" type="primary" @click="submitEdit()">确认修改</el-button> -->
            <el-button type="primary" @click="submitAdd()">确认添加</el-button>
          </span>
        </template>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs, getCurrentInstance } from 'vue'
import api from '@/api/index'

export default {
    name: 'CollegeManage',
    data() {
        return {
        }
    },
    setup() {
        const multipleTable = ref(null)
        const addFormRef = ref(null)
        const { proxy } = getCurrentInstance()
        const state = reactive({
            loading: false,
            ifEdit: false,
            dialogFormVisible: false, // 显示修改or添加对话框
            editForm: {
                CollegeID: '',
                CollegeName: ''
            },
            collegeRules: {
                CollegeName: [
                    { required: 'true', message: '学院名称不能为空', trigger: 'blur' }
                ]
            },
            CollegeList: [], // 学院信息数据列表
            total: 0, // 总条数
            currentPage: 1, // 当前页
            pageSize: 10, // 分页大小
            selectCollege: '' // 所属学院
        })
        // 获取-学院列表
        const getCollegeList = () => {
            api.college.APIFetchCollegeList({
                // user_id: localStorage.UserID || '',
                // user_type: localStorage.UserType ? 3 : localStorage.UserType,
                page: state.currentPage,
                size: state.pageSize,
                college_name: state.selectCollege
            })
                .then((res) => {
                    state.CollegeList = res.data
                    state.total = res.count
                    // console.log(state.CollegeList)
                })
                .catch((err) => {
                    console.log('get College List', err)
                    state.CollegeList = []
                    state.total = 0
                    // proxy.$message.error({
                    //   message: err
                    // })
                })
        }

        // 添加
        const handleAdd = () => {
            state.ifEdit = false
            state.editForm.CollegeID = ''
            state.editForm.CollegeName = ''
            state.dialogFormVisible = true
        }

        // 添加班级信息
        const submitAdd = () => {
            addFormRef.value.validate(valid => {
                if (valid) {
                    state.loading = true
                    api.college.APIAddCollege({
                        user_id: localStorage.UserID || '',
                        user_type: localStorage.UserType ? 1 : localStorage.UserType,
                        // college_id: 1,
                        // 以下为添加的数据
                        college_name: state.editForm.CollegeName
                    })
                        .then((res) => {
                            // console.log('change college', res)
                            proxy.$message.success('班级信息添加成功')
                            getCollegeList()
                            state.dialogFormVisible = false
                        })
                        .catch((err) => {
                            console.log('change college', err)
                            proxy.$message.error({
                                message: err
                            })
                        })

                    state.loading = false
                }
            })
        }

        // 删除学院信息
        const handleDelete = (college_id) => {
            proxy.$messageBox.confirm('此操作将永久删除该学院, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.college.APIDeleteCollege({
                    user_id: localStorage.UserID,
                    user_type: localStorage.UserType ? 1 : localStorage.UserType,
                    // CollegeID: 3,
                    collegeID: college_id
                })
                    .then((res) => {
                        proxy.$message.success('删除成功')
                        // 刷新
                        // console.log(123)
                        getCollegeList()
                    })
                    .catch((err) => {
                        console.log('delete student', err)
                        proxy.$message.error({
                            message: err
                        })
                        state.loading = false
                    })
            }).catch(() => {
                proxy.$message('取消删除')
            })
        }

        const handleSearch = () => {
            state.currentPage = 1
            getCollegeList()
        }
        const changePage = (val) => {
            state.currentPage = val
            getCollegeList()
        }

        onMounted(() => {
            getCollegeList()
        })
        return {
            ...toRefs(state),
            multipleTable,
            getCollegeList,
            changePage,
            handleSearch,
            handleAdd,
            submitAdd,
            handleDelete,
            addFormRef

        }
    },
    methods: {
        handleClick(tab, event) {
            // console.log(tab, event)
        }
    }
}
</script>

<style scoped>
.order-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100% !important;
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
