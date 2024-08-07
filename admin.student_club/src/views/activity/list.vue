
<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-input
          v-model="selectClubName"
          maxlength="30"
          style="width: 200px; margin-right: 10px"
          clearable
          placeholder="社团名称"
          @change="handleSearch()"
        />

        <el-input
          v-model="selectTitle"
          maxlength="30"
          style="width: 200px; margin-right: 10px"
          clearable
          placeholder="标题"
          @change="handleSearch()"
        />

        <el-select
          v-model="selectStatus"
          class="m-2"
          maxlength="30"
          style="width: 200px; margin-right: 10px"
          clearable
          placeholder="状态"
          size="small"
          @change="handleSearch()"
        >
          <el-option
            v-for="item in turnLevel"
            :key="item.index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </template>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="activeInfo"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="title"
          label="活动标题"
          align="center"
          header-align="center"
          width="300px"
        >
          <template #default="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.title"
              placement="top"
            >
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

        <el-table-column
          prop="club_name"
          label="所属社团"
          align="center"
          header-align="center"
          width="200px"
        />
        <el-table-column
          prop="create_time"
          label="申请时间"
          align="center"
          header-align="center"
          width="240px"
        />
        <el-table-column
          prop="is_recommend"
          label="是否推荐"
          align="center"
          header-align="center"
          width="200px"
        >
          <template #default="scope">
            <el-tag
              v-if="scope.row.is_recommend === 0"
              type="danger"
              disable-transitions
            >
              未推荐
            </el-tag>
            <el-tag v-else type="success" disable-transitions> 推荐 </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          header-align="center"
          min-width="240px"
        >
          <template #default="scope">
            <el-tag
              :type="
                scope.row.status === '被驳回'
                  ? 'danger'
                  : scope.row.status === '社团未通过'
                  ? ''
                  : scope.row.status === '社团已通过'
                  ? 'warning'
                  : 'success'
              "
              disable-transitions
              >{{ scope.row.status }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          header-align="center"
          align="center"
          width="340px"
        >
          <template #default="scope">
            <div class="primary">
              <el-popover placement="top-start" trigger="hover" content="查看">
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="primary"
                    @click="showDetail(scope.row.activity_id)"
                  >
                    <i class="el-icon-view" />
                  </el-button>
                </template>
              </el-popover>
            </div>
            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="修改">
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="danger"
                    @click="
                      $router.push({
                        name: 'activities_detail',
                        params: { activity_id: scope.row.activity_id },
                      })
                    "
                  >
                    <i class="el-icon-edit" />
                  </el-button>
                </template>
              </el-popover>
            </div>

            <div class="danger">
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="scope.row.is_recommend === 1 ? '不推荐' : '推荐'"
              >
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    :type="scope.row.is_recommend === 1 ? 'warning' : 'success'"
                    @click="
                      scope.row.is_recommend === 1
                        ? makedown(scope.row.activity_id, scope.row.status)
                        : makeup(scope.row.news_id, scope.row.status)
                    "
                  >
                    <i
                      :class="
                        scope.row.is_recommend === 1
                          ? 'el-icon-error'
                          : 'el-icon-check'
                      "
                    />
                  </el-button>
                </template>
              </el-popover>
            </div>
            <!-- <div class="danger">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="推荐"
              >
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="success"
                    @click="makeup(scope.row.activity_id,scope.row.status)"
                  >
                    <i class="el-icon-check"   />
                  </el-button>
                </template>
              </el-popover>
            </div>
            <div class="danger">
              <el-popover
                placement="top-start"
                trigger="hover"
                content="不推荐"
              >
                <template #reference>
                  <el-button
                    :disabled="scope.row.IsInitial === 1"
                    type="warning"
                    @click="makedown(scope.row.activity_id,scope.row.status)"
                  >
                    <i class="el-icon-error"   />
                  </el-button>
                </template>
              </el-popover>
            </div>           -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 查看活动详情弹窗 -->
      <el-dialog v-model="dialogVisibleContest" title="活动详情">
        <div v-html="content"></div>
      </el-dialog>

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
    </el-card>
  </div>
</template>

<script>
import api from "@/api/index";
import { onMounted, reactive, toRefs, ref, getCurrentInstance } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  name: "news",
  setup() {
    const addFormRef = ref(null);
    const { proxy } = getCurrentInstance();
    const state = reactive({
      loading: false,
      dialogFormVisible: false,
      content: "",
      dialogVisibleContest: false,
      activeInfo: [],
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

    //获取活动列表
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
      api.activity
        .APIFetchActivityList(params)
        .then((res) => {
          (state.activeInfo = res.data),
            state.activeInfo.forEach(function (element) {
              if (element.status === "学校已通过") {
                element["color"] = "success";
              }
              if (element.status === "被驳回") {
                element["color"] = "danger";
              }
            });
          state.total = res.count;
        })
        .catch((err) => {
          console.log("StudentList", err);
          if (res.code === 2001) {
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
    //推荐
    const makeup = (id, status) => {
      if (status === "待审批") {
        proxy.$message.error("未审批通过，不能处理");
      } else {
        api.activity
          .APIPick({
            user_id: localStorage.UserID || "",
            user_type: localStorage.UserType ? 1 : localStorage.UserType,
            activity_id: id,
            status: status,
            is_recommend: 1,
          })
          .then((res) => {
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
        api.activity
          .APIPick({
            user_id: localStorage.UserID || "",
            user_type: localStorage.UserType ? 1 : localStorage.UserType,
            activity_id: id,
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

    const showDetail = (activity_id) => {
      // console.log(news_id)
      state.dialogVisibleContest = true;
      getDetail(activity_id);
    };

     // 获取活动详情
    const getDetail = (news_id) => {
      const params = {
        user_id: localStorage.UserID || "",
        user_type: localStorage.UserType ? 1 : localStorage.UserType,
        activity_id: news_id,
      };
      api.activity
        .APIDetailAll(params)
        .then((res) => {
          state.content = res.data.content;
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
      makedown,
      makeup,
      changePage,
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
  margin-left: 90px;
  margin-right: 5px;
}
.danger {
  float: left;
  font-size: 20px;
  margin-left: 0px;
  margin-right: 5px;
}
</style>