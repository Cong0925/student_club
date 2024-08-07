<!-- 学生用户管理 -->
<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-input
          v-model="searchStduentForm.StudentName"
          maxlength="30"
          style="width: 200px; margin-right: 10px"
          clearable
          placeholder="请输入学生姓名"
          @change="handleSearch()"
        />
        <el-input
          v-model="searchStduentForm.StudentNumber"
          maxlength="30"
          style="width: 200px; margin-right: 10px"
          clearable
          placeholder="请输入学生学号"
          @change="handleSearch()"
        />
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </template>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="StudentList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="student_number"
          label="学号"
          align="center"
          header-align="center"
          width="210px"
        />
        <el-table-column
          prop="student_name"
          label="学生姓名"
          align="center"
          header-align="center"
          width="150px"
        />
        <el-table-column
          prop="account"
          label="登录账号"
          align="center"
          header-align="center"
          width="200px"
        />
        <el-table-column
          prop="college_name"
          label="所属学院"
          align="center"
          header-align="center"
          width="200px"
        />
        <el-table-column
          prop="class_name"
          label="班级"
          align="center"
          header-align="center"
          width="150px"
        />
        <el-table-column
          prop="sex"
          label="性别"
          align="center"
          header-align="center"
          width="80px"
        />
        <el-table-column
          prop="mobile"
          label="联系方式"
          align="center"
          header-align="center"
          min-width="235px"
        />
        <el-table-column
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
          width="300px"
        >
          <template #default="scope">
          <div class="primary">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="查看社团"
              >
              <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="primary"
                    @click="showClub(scope.row.student_id)
                    "
                  >
                    <i
                      class="el-icon-view"
                   
                    />
                  </el-button>
                </template>

              </el-popover>
          </div>
            <!-- 修改学生资料 -->
            <div class="danger">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="修改资料"
              >
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="primary"
                    @click="
                      $router.push({
                        name: 'EditStudent',
                        params: {
                          student_id: scope.row.student_id,
                          club_id: scope.row.club_id,
                        },
                      })
                    "
                  >
                    <i
                      class="el-icon-edit"
                   
                    />
                  </el-button>
                </template>
              </el-popover>
            </div>
            <!-- 删除学生 -->
            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="删除">
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="danger"
                  >
                    <i
                      class="el-icon-delete"
                      @click="handleDelete(scope.row.student_id)"
                    />
                  </el-button>
                </template>
              </el-popover>
            </div>
            <!-- 重置学生密码 -->
            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="重置">
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="primary"
                  >
                    <i
                      class="el-icon-lock"
                      @click="resetPassword(scope.row.student_id)"
                    />
                  </el-button>
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
      <!-- 查看学生社团详情弹窗 -->
      <el-dialog v-model="dialogVisibleContest" title="所属社团">
        <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="ClubList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="club_name"
          label="社团名称"
          align="center"
          header-align="center"
          width="230px"
        />
        <el-table-column
          prop="level"
          label="级别"
          align="center"
          header-align="center"
          
        />
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import api from "@/api/index"
import { onMounted, reactive, toRefs, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import tool from '@/utils/tool'
export default {
    name: "StudentCount",
    setup() {
        const addFormRef = ref(null)
        const state = reactive({
            loading: false,
            dialogFormVisible: false,
            dialogVisibleContest:false,
            StudentList: [],
            // ClubName:'',
            // colleagename:'',
            ClubList: [],
            selectClub: "",
            selectLevel: "",
            turnLevel: [
                {
                    value: "待审批",
                    label: "待审批"
                },
                {
                    value: "普通社员",
                    label: "普通社员"
                },
                {
                    value: "副部长",
                    label: "副部长"
                },
                {
                    value: "部长",
                    label: "部长"
                },
                {
                    value: "副社长",
                    label: "副社长"
                },
                {
                    value: "社长",
                    label: "社长"
                }
            ],
            searchStduentForm: {
                StudentName: "",
                StudentNumber: "",
                ClubName: "",
                IDentify: ""
            },
            total: 0,
            currentPage: 1,
            pageSize: 10
        })
        onMounted(() => {
            getStudentList()
            // getClubList()
        })
        // 显示学生社团列表
        const showClub =(student_id) =>{
          console.log(state.ClubList);
          state.dialogVisibleContest=true;
           const userinfo = {
                user_id: localStorage.UserID || "",
                user_type: localStorage.UserType ? 1 : localStorage.UserType
            }
            const params = {
                ...userinfo,
                student_id:student_id
                
            }
            api.account
                .APIFetchStudentClubList(params)
                .then((res) => {
                    state.ClubList = res.data
                    // state.total = res.count
                    const turnLevel = {
                        0: "待审批",
                        1: "普通社员",
                        2: "副部长",
                        3: "部长",
                        4: "副社长",
                        5: "社长"
                    }
                    state.ClubList.forEach((element) => {
                        element.level = turnLevel[element.level]
                    })
                    // console.log('this is ', state.StudentList)
                })
                .catch((err) => {
                    console.log("StudentClubList", err)
                    // ElMessage.error({
                    //     message:'查无用户信息'
                    // })
                    state.ClubList = null
                })
            state.loading = false

        }
        // 获取学生列表
        const getStudentList = () => {
            const userinfo = {
                user_id: localStorage.UserID || "",
                user_type: localStorage.UserType ? 1 : localStorage.UserType
            }
            // console.log(state.club_name)
            const params = {
                ...userinfo,
                // student_number: state.searchStduentForm.StudentNumber,
                // student_name: state.searchStduentForm.StudentName,
                // club_name: state.selectClub,
                // console.log(state.club_name);
                // level: state.selectLevel,
                // 社团名称和身份
                page: state.currentPage,
                size: state.pageSize
            }
            api.account
                .APIFetchStudentList(params)
                .then((res) => {
                    state.StudentList = res.data
                    state.total = res.count
                    const turnLevel = {
                        0: "待审批",
                        1: "普通社员",
                        2: "副部长",
                        3: "部长",
                        4: "副社长",
                        5: "社长"
                    }
                    state.StudentList.forEach((element) => {
                        element.level = turnLevel[element.level]
                    })
                    // console.log('this is ', state.StudentList)
                })
                .catch((err) => {
                    console.log("StudentList", err)
                    // ElMessage.error({
                    //     message:'查无用户信息'
                    // })
                    state.StudentList = null
                })
            state.loading = false
        }
        // 获取社团列表
        const getClubList = () => {
            api.club
                .APIFetchClubList({
                    user_id: localStorage.UserID || "",
                    user_type: localStorage.UserType ? 1 : localStorage.UserType
                })
                .then((res) => {
                    state.ClubList = res.data
                    // console.log(res.data)
                    // console.log(res.count)
                })
                .catch((err) => {
                    console.log("ClubList", err)
                    ElMessage.error({
                        message: err
                    })
                })
        }
        // 编辑

        // 删除学生
        const handleDelete = (id) => {
            ElMessageBox.confirm("此操作将永久删除该学生账号, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    if (id) {
                        api.account
                            .APIDeleteStudent(id, {
                                user_id: localStorage.UserID,
                                user_type: localStorage.UserType ? 1 : localStorage.UserType,
                                token: tool.data.get('token')
                            })
                            .then((res) => {
                                ElMessage.success("删除成功")
                                getStudentList()
                            })
                            .catch((err) => {
                                console.log("delete student", err)
                                ElMessage.error({
                                    message: err
                                })
                            })
                    } else {
                        ElMessage.warning("找不到该学生")
                    }
                })
                .catch(() => {
                    ElMessage("取消删除")
                })
        }
        // 重置密码
        const resetPassword = (params) => {
            ElMessageBox.confirm("此操作将重置该学生账号密码，是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    api.account
                        .APIEditStudent(params, {
                            user_id: localStorage.UserID || "",
                            user_type: localStorage.UserType ? 1 : localStorage.UserType
                        })
                        .then((res) => {
                            ElMessage.success("重置学生密码成功，密码为学号后六位")
                            getStudentList()
                        })
                        .catch((err) => {
                            console.log("reset", err)
                            ElMessage.err({
                                message: err
                            })
                        })
                    state.loading = false
                })
                .catch(() => {
                    ElMessage("取消重置密码")
                })
        }

        const handleSearch = () => {
            state.currentPage = 1
            // console.log('selectClub+',state.selectClub)
            getStudentList()
        }
        const changePage = (val) => {
            state.currentPage = val
            getStudentList()
        }
        return {
            ...toRefs(state),
            getStudentList,
            changePage,
            handleSearch,
            handleDelete,
            resetPassword,
            showClub,
        }
    }
}
</script>
<style scoped lang="scss">
.primary {
  float: left;
  color: rgb(27, 174, 174);
  font-size: 20px;
  margin-left: 50px;
  margin-right: 5px;
}
.danger {
  float: left;
  font-size: 20px;
  margin-left: 0px;
  margin-right: 5px;
}
</style>