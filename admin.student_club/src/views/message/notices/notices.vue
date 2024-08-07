<!-- 通知公告 -->

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-input v-model="selectClubName" maxlength="30" style="width: 200px; margin-right: 10px" clearable
          placeholder="社团名称" @change="handleSearch()" />

        <el-input v-model="selectTitle" maxlength="30" style="width: 200px; margin-right: 10px" clearable placeholder="标题"
          @change="handleSearch()" />

        <el-select v-model="selectStatus" class="m-2" maxlength="30" style="width: 200px; margin-right: 10px" clearable
          placeholder="状态" size="small" @change="handleSearch()">
          <el-option v-for="item in turnLevel" :key="item.index" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </template>
      <el-table ref="multipleTable" v-loading="loading" :data="noticeInfo" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="title" label="公告标题" align="center" header-align="center" width="350px">
          <template #default="scope">
            <el-tooltip effect="light" :content="scope.row.title" placement="top">
              <div class="title-cell">
                <span class="title-text" v-if="scope.row.title.length <= 10">
                  {{ scope.row.title }}
                </span>
                <span class="title-text" v-else>
                  {{ scope.row.title.slice(0, 10) + "..." }}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="club_name" label="所属社团" align="center" header-align="center" width="250px" />

        <el-table-column prop="create_time" label="申请时间" align="center" header-align="center" width="300px" />

        <el-table-column prop="status" label="状态" align="center" header-align="center" min-width="100px">
          <template #default="scope">
            <el-tag :type="scope.row.status === '被驳回'
                ? 'danger'
                : scope.row.status === '社团未通过'
                  ? ''
                  : scope.row.status === '社团已通过'
                    ? 'warning'
                    : 'success'
              " disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" header-align="center" align="center" width="350px">
          <template #default="scope">
            <div class="primary">
              <el-popover placement="top-start" trigger="hover" content="查看">
                <template #reference>
                  <el-button :disabled="scope.row.IsInitial === 1" type="primary"
                    @click="showDetail(scope.row.notice_id)">
                    <i class="el-icon-view" />
                  </el-button>
                </template>
              </el-popover>
            </div>

            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="修改">
                <template #reference>
                  <el-button :disabled="scope.row.IsInitial === 1" type="danger" @click="
                    $router.push({
                      name: 'notice_detail',
                      params: { notice_id: scope.row.notice_id },
                    })
                    ">
                    <i class="el-icon-edit" />
                  </el-button>
                </template>
              </el-popover>
            </div>
            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="删除">
                <template #reference>
                  <el-button :disabled="scope.row.IsInitial === 1" type="danger"
                    @click="deleteNotices(scope.row.notice_id)">
                    <i class="el-icon-delete" />
                  </el-button>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看通知详情弹窗 -->
      <el-dialog v-model="dialogVisibleContest" title="公告内容">
        <div v-html="content"></div>
      </el-dialog>
      <!--总数超过一页，再展示分页器-->
      <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="total"
        :page-size="pageSize" :current-page="currentPage" @current-change="changePage" />
    </el-card>
  </div>
</template>
<script>
import api from "@/api/index";
import { onMounted, reactive, ref, toRefs, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Tinymce from "@/layout/components/Tinymce.vue";
export default {
  name: "news",
  setup() {
    const addFormRef = ref(null);
    const { proxy } = getCurrentInstance();
    const state = reactive({
      loading: false,
      dialogVisibleContest: false,
      noticeInfo: [],
      content: "",
      noticeForm: {
        club_name: "",
        title: "",
        create_time: "",
        editor: "",
        content: "",
        file_info: "",
      },
      turnLevel: [
        {
          value: "学校已通过",
          label: "学校已通过",
        },
        {
          value: "被驳回",
          label: "被驳回",
        },
        {
          label: "社团未通过",
          value: "社团未通过",
        },
        {
          label: "社团已通过",
          value: "社团已通过",
        },
      ],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      selectStatus: "",
      selectClubName: "",
      selectTitle: "",
    });

    //获取通知通告列表
    const getNewsInfo = () => {
      const userinfo = {
        user_id: localStorage.UserID || "",
        user_type: localStorage.UserType ? 1 : localStorage.UserType,
      };
      const params = {
        ...userinfo,
        club_name: state.selectClubName,
        status: state.selectStatus,
        title: state.selectTitle,
        page: state.currentPage,
        size: state.pageSize,
      };
      api.notice
        .APIFetchNoticeList(params)
        .then((res) => {
          state.noticeInfo = res.data;
          state.total = res.count;
        })
        .catch((err) => {
          console.log("StudentList", err);
          if (err.code === 2001) {
            ElMessage.success({
              message: "查询结果为空",
            });
          } else {
            ElMessage.error({
              message: err,
            });
          }
        });
    };

    //删除新闻列表
    const deleteNotices = (notice_id) => {
      api.notice
        .APIDelete({
          user_id: localStorage.UserID || "",
          user_type: localStorage.UserType ? 1 : localStorage.UserType,
          notice_id: notice_id,
        })
        .then((res) => {
          proxy.$message.success("删除成功", res.message);
          getNewsInfo();
        })
        .catch((err) => {
          ElMessage.error({
            message: err,
          });
        });
    };
    //推荐
    const makeup = (id, status) => {
      if (status === "待审批") {
        proxy.$message.error("未审批通过，不能处理");
      } else {
        api.notice
          .APIPick({
            user_id: localStorage.UserID || "",
            user_type: localStorage.UserType ? 1 : localStorage.UserType,
            notice_id: id,
            status: status,
            is_recommend: 1,
          })
          .then(() => {
            proxy.$message.success("修改成功");
            getNewsInfo();
            // goBack()
          })
          .catch((err) => {
            this.$ElMessage.error({
              message: err,
            });
          });
      }
    };
    //不推荐
    const makedown = (id, status) => {
      if (status === "待审批") {
        proxy.$message.error("未审批通过，不能处理");
      } else {
        api.notice
          .APIPick({
            user_id: localStorage.UserID || "",
            user_type: localStorage.UserType ? 1 : localStorage.UserType,
            notice_id: id,
            status: status,
            is_recommend: 0,
          })
          .then(() => {
            proxy.$message.success("修改成功");
            getNewsInfo();
            // goBack()
          })
          .catch((err) => {
            this.$ElMessage.error({
              message: err,
            });
          });
      }
    };
    // 查看公告详情
    const showDetail = (notice_id) => {
      console.log(notice_id);
      state.dialogVisibleContest = true;
      getDetail(notice_id);
    };
    // 获取公告-细节
    const getDetail = (notice_id) => {
      const params = {
        user_id: localStorage.UserID || "",
        user_type: localStorage.UserType ? 1 : localStorage.UserType,
        notice_id: notice_id,
      };
      api.notice
        .APIDetailAll(params)
        .then((res) => {
          state.content = res.data.content;
          console.log(state.content);
        })
        .catch((err) => {
          this.$ElMessage.error({
            message: err,
          });
        });
    };
    const closeFormDialog = () => {
      state.dialogVisibleContest = false;
    };
    onMounted(() => {
      getNewsInfo();
    });
    const handleSearch = () => {
      getNewsInfo();
    };
    const changePage = (val) => {
      state.currentPage = val;
      getNewsInfo();
    };
    return {
      ...toRefs(state),
      getNewsInfo,
      handleSearch,
      deleteNotices,
      changePage,
      makeup,
      makedown,
      showDetail,
      getDetail,
      closeFormDialog,
    };
  },
};
</script>
<style scoped>
.primary {
  float: left;
  font-size: 20px;
  margin-left: 100px;
  margin-right: 5px;
}

.danger {
  float: left;
  font-size: 20px;
  margin-left: 0px;
  margin-right: 5px;
}
</style>