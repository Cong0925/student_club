<template>
  <div>
    <el-card>
      <template #header>
        <el-input
          v-model="selectClass"
          maxlength="30"
          style="width: 200px; margin-right: 10px"
          placeholder="班级名称"
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
        >添加班级</el-button>

      </template>

      <!-- 班级管理 -->
      <el-table

        ref="multipleTable"
        v-loading="loading"
        :data="ClassList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="class_id"
          label="班级ID"
          align="center"
          header-align="center"
          width="400"
        />
        <el-table-column
          prop="class_name"
          label="班级名称"
          align="center"
          header-align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
          width="50"
        >
          <template #default="scope">
            <!-- 删除班级 -->
            <div class="danger">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="删除班级"
              >
                <template #reference>
                  <i
                    class="el-icon-delete"
                    @click="handleDelete(scope.row.class_id)"
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
        title="班级设置"
      >
        <el-form
          ref="addFormRef"
          :model="editForm"
          :rules="classRules"
          label-width="100px"
        >
          <el-form-item label="班级名称" prop="ClassName">
            <el-input
              v-model="editForm.ClassName"
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
    name: 'ClassManage',
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
                ClassID: '',
                ClassName: ''
            },
            classRules: {
                ClassName: [
                    { required: 'true', message: '班级名称不能为空', trigger: 'blur' }
                ]
            },
            ClassList: [], // 班级信息数据列表
            total: 0, // 总条数
            currentPage: 1, // 当前页
            pageSize: 10, // 分页大小
            selectClass: '' // 所属班级
        })
        // 获取-班级列表
        const getClassList = () => {
            api.class.APIFetchClassList({
                // user_id: localStorage.UserID || '',
                // user_type: localStorage.UserType ? 3 : localStorage.UserType,
                college_id: 1,
                page: state.currentPage,
                size: state.pageSize,
                class_name: state.selectClass
            })
                .then((res) => {
                    state.ClassList = res.data
                    state.total = res.count
                    // console.log(state.ClassList)
                })
                .catch((err) => {
                    console.log('get Class List', err)
                    state.ClassList = []
                    state.total = 0
                    // proxy.$message.error({
                    //   message: err
                    // })
                })
        }

        // 添加
        const handleAdd = () => {
            state.ifEdit = false
            state.editForm.ClassID = ''
            state.editForm.ClassName = ''
            state.dialogFormVisible = true
        }

        // 添加班级信息
        const submitAdd = () => {
            addFormRef.value.validate(valid => {
                if (valid) {
                    state.loading = true
                    api.class.APIAddClass({
                        user_id: localStorage.UserID || '',
                        user_type: localStorage.UserType ? 1 : localStorage.UserType,
                        college_id: 1,
                        // 以下为添加的数据
                        class_name: state.editForm.ClassName
                    })
                        .then((res) => {
                            // console.log('change class', res)
                            proxy.$message.success('班级信息添加成功')
                            getClassList()
                            state.dialogFormVisible = false
                        })
                        .catch((err) => {
                            console.log('change class', err)
                            proxy.$message.error({
                                message: err
                            })
                        })

                    state.loading = false
                }
            })
        }

        // 删除班级信息
        const handleDelete = (class_id) => {
            proxy.$messageBox.confirm('此操作将永久删除该班级, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.class.APIDeleteClass({
                    user_id: localStorage.UserID,
                    user_type: localStorage.UserType ? 1 : localStorage.UserType,
                    CollegeID: 3,
                    classID: class_id
                })
                    .then((res) => {
                        proxy.$message.success('删除成功')
                        // 刷新
                        // console.log(123)
                        getClassList()
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
            getClassList()
        }
        const changePage = (val) => {
            state.currentPage = val
            getClassList()
        }

        onMounted(() => {
            getClassList()
        })
        return {
            ...toRefs(state),
            multipleTable,
            getClassList,
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
