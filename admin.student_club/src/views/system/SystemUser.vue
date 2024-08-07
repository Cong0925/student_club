<!-- 用户设置 -->
<template>
  <div>
    <div class="Addbutton">
      <el-input
        v-model="getName"
        maxlength="30"
        style="width: 200px; margin-right: 10px"
        placeholder="请输入用户姓名"
        size="small"
        clearable
        @change="handleSearch()"
      />
      <el-input
        v-model="getID"
        maxlength="30"
        style="width: 200px; margin-right: 10px"
        placeholder="请输入系统用户ID"
        size="small"
        clearable
        @change="handleSearch()"
      />
      <el-input
        v-model="getAccount"
        maxlength="30"
        style="width: 200px; margin-right: 10px"
        placeholder="请输入账号"
        size="small"
        clearable
        @change="handleSearch()"
      />
      <el-button type="primary" @click="handleSearch()">查询</el-button>
      <el-button type="primary" @click="handleAdd()" :disabled="IsInitial == 1"
        >添加用户</el-button
      >
    </div>
    <!-- 列表显示部分 -->
    <el-card shadow="hover" class="my-module">
      <el-table border stripe :data="SysUserLIs">
        <el-table-column
          label="系统用户ID"
          align="center"
          width="250"
          show-overflow-tooltip
          prop="sys_user_id"
        />
        <el-table-column
          label="姓名"
          header-align="center"
          min-width="200"
          show-overflow-tooltip
          align="center"
          prop="sys_user_name"
        />
        <el-table-column
          label="账号"
          align="center"
          min-width="200"
          show-overflow-tooltip
          prop="account"
        />
        <el-table-column
          label="创建时间"
          align="center"
          min-width="100"
          show-overflow-tooltip
          prop="create_time"
        />

        <el-table-column
          label="操作"
          align="center"
          header-align="center"
          width="250"
        >
          <template #default="scope">
            <div class="primary">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="重置密码"
              >
                <template #reference>
                  <el-button
                    :disabled="IsInitial == 1"
                    type="primary"
                    @click="resetPassword(scope.row)"
                  >
                    <i class="el-icon-lock" />
                  </el-button>
                </template>
              </el-popover>
            </div>

            <div class="danger">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="删除账户"
              >
                <template #reference>
                  <el-button
                    :disabled="IsInitial == 1"
                    type="danger"
                    @click="handleDelete(scope.row.sys_user_id)"
                  >
                    <i class="el-icon-delete" />
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
        :current-page="Page"
        @current-change="changePage"
      />

      <!-- 添加管理人员 -->
      <!-- 添加管理员弹窗 -->
      <el-dialog v-model="dialogFormVisible" title="添加的管理人员信息">
        <el-form
          ref="addFormRef"
          :model="addForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="姓名" prop="Name">
            <el-input
              v-model="addForm.Name"
              maxlength="30"
              autocomplete="off"
              placeholder="姓名不能为空"
            />
          </el-form-item>
          <el-form-item label="账号" prop="Account">
            <el-input
              v-model="addForm.Account"
              maxlength="30"
              autocomplete="off"
              placeholder="为十一位字符"
            />
          </el-form-item>
          <el-form-item label="密码" prop="Password">
            <el-input
              v-model="addForm.Password"
              maxlength="30"
              autocomplete="off"
              placeholder="至少五位字符"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="submitAdd()">确认添加</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import tool from "@/utils/tool";
import api from "@/api/index";

export default {
  name: "SysUser",
  setup() {
    const addFormRef = ref(null);

    const state = reactive({
      loading: false,
      dialogFormVisible: false,
      ifEdit: false,
      ifAdd: false,
      SysUserLIs: [],
      IsInitial: 1,
      total: 0,
      Page: 1,
      getID: "",
      getName: "",
      getAccount: "",
      pageSize: 10,
      editForm: {
        UserID: "",
        UserType: "",
        Account: "",
        Password: "",
        Name: "",
        IsInitial: "",
        SysUserID: "",
      },
      addForm: {
        Account: "",
        Password: "",
        Name: "",
      },
      rules: {
        Password: [
          { required: "true", message: "请填写系统用户密码", trigger: "blur" },
        ],
        Name: [
          {
            required: "true",
            message: "请填写管理用户的姓名",
            trigger: "blur",
          },
        ],
        Account: [
          { required: "true", message: "请填写管理员的账号", trigger: "blur" },
        ],
      },
    });

    onMounted(() => {
      state.IsInitial = localStorage.UserType;
      getUserList();
    });

    // 获取系统用户列表
    const getUserList = () => {
      state.loading = true;
      api.system
        .APIFetchSysUsersList({
          sys_user_id: state.getID,
          sys_user_name: state.getName,
          account: state.getAccount,
          page: 1,
          size: 10,
          user_id: localStorage.UserID,
          user_type: localStorage.UserType,
        })
        .then((res) => {
          state.SysUserLIs = res.data;
          state.total = res.count;
          // console.log(state.SysUserLIs);
          state.loading = false;
        })
        .catch((err) => {
          console.log("get College List", err);
          state.SysUserLIs = [];
          state.total = 0;
        });
      state.loading = false;
    };
    // 搜索
    const handleSearch = () => {
      getUserList();
    };
    // 重置密码
    const resetPassword = (SysUserInfo) => {
      ElMessageBox.confirm(
        "此操作将重置该管理人员账号密码，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const params = {
            user_id: localStorage.UserID || "",
            user_type: localStorage.UserType ? 1 : localStorage.UserType,
            system_id: SysUserInfo.sys_user_id,
          };
          api.system
            .APIResetSysUserPassword(params)
            .then((res) => {
              ElMessage.success("重置密码成功，密码为账号后六位");
              getUserList();
            })
            .catch((err) => {
              // console.log('reset', err)
              ElMessage.error({
                message: err,
              });
            });
          state.loading = false;
        })
        .catch((err) => {
          ElMessage("取消重置密码");
        });
    };
    const handleAdd = () => {
      state.ifAdd = false;
      state.addForm.Name = "";
      state.addForm.Account = "";
      state.addForm.Password = "";
      state.dialogFormVisible = true;
    };

    // 添加管理员信息
    const submitAdd = () => {
      addFormRef.value.validate((valid) => {
        if (valid) {
          state.loading = true;
          api.system
            .APIAddSysUser({
              // user_id: localStorage.UserID || "",
              // user_type: localStorage.UserType ? 1 : localStorage.UserType,
              // college_id: 1,
              // 以下为添加的数据
              sys_user_name: state.addForm.Name,
              account: state.addForm.Account,
              password: tool.encryptedData(state.addForm.Password),
            })
            .then((res) => {
              // console.log("add admin", res);
              // proxy.$message.success("管理员添加成功");
              ElMessage.success("添加成功");
              getUserList();
              state.dialogFormVisible = false;
            })
            .catch((err) => {
              console.log("add admin", err);
              ElMessage.error({
                message: err,
              });
            });

          state.loading = false;
        }
      });
    };
    const handleDelete = (id) => {
      ElMessageBox.confirm("此操作将永久删除该系统用户，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (id) {
            state.loading = true;
            api.system
              .APIDeleteSysUser(id, {
                user_id: localStorage.UserID,
                user_type: localStorage.UserType ? 1 : localStorage,
              })
              .then((res) => {
                ElMessage.success("删除成功");
                state.loading = false;
                getUserList();
              })
              .catch((err) => {
                ElMessage.error({
                  message: err,
                });
                state.loading = false;
              });
          } else {
            ElMessage.warning("找不到系统用户");
          }
        })
        .catch(() => {
          ElMessage("取消删除");
        });
    };
    const changePage = (val) => {
      state.Page = val;
      getUsersList();
    };

    return {
      ...toRefs(state),
      getUserList,
      changePage,
      handleAdd,
      submitAdd,
      // getCurrentSysUser,
      resetPassword,
      handleDelete,
      addFormRef,
      handleSearch,
    };
  },
};
</script>
<style scoped>
.primary {
  float: left;
  color: rgb(27, 174, 174);
  font-size: 20px;
  margin-left: 70px;
  margin-right: 5px;
}
.danger {
  float: left;
  font-size: 20px;
  margin-left: 0px;
  margin-right: 5px;
}
</style>