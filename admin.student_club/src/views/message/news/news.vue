<!-- 社团新闻 -->
<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <el-input v-model="selectClubName" maxlength="30" style="width: 200px; margin-right: 10px" clearable
          placeholder="社团名称" @change="handleSearch()" />
        <el-input v-model="selectTitle" maxlength="30" style="width: 200px; margin-right: 10px" clearable placeholder="标题"
          @change="handleSearch()" />
        <el-select v-model="selectStatus" class="m-2" maxlength="30" style="width: auto; margin-right: 10px" clearable
          placeholder="状态" size="small" @change="handleSearch()">
          <el-option v-for="item in turnLevel" :key="item.index" :label="item.label" :value="item.value" />
        </el-select>

        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </template>
      <el-table ref="multipleTable" v-loading="loading" :data="newInfo" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="title" label="新闻标题" align="center" header-align="center" width="350px">
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

        <el-table-column prop="club_name" label="新闻来源" align="center" header-align="center" width="200px" />

        <el-table-column prop="editor" label="作者" align="center" header-align="center" width="auto" />
        <el-table-column prop="create_time" label="发布时间" align="center" header-align="center" width="250px" />
        <el-table-column prop="is_recommend" label="是否推荐" align="center" header-align="center" width="auto">
          <template #default="scope">
            <el-tag v-if="scope.row.is_recommend === 0" type="danger" disable-transitions>
              未推荐
            </el-tag>
            <el-tag v-else type="success" disable-transitions> 推荐 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center" header-align="center" min-width="150px">
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
                  <el-button :disabled="scope.row.IsInitial === 1" type="primary" @click="showDetail(scope.row.news_id)">
                    <i class="el-icon-view" />
                  </el-button>
                </template>
              </el-popover>
            </div>

            <!-- 修改班级 -->
            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="修改">
                <template #reference>
                  <el-button :disabled="scope.row.IsInitial === 1" type="danger" @click="
                    $router.push({
                      name: 'news_detail',
                      params: { news_id: scope.row.news_id },
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
                  <el-button :disabled="scope.row.IsInitial === 1" type="danger" @click="deleteNews(scope.row.news_id)">
                    <i class="el-icon-delete" />
                  </el-button>
                </template>
              </el-popover>
            </div>
            <div class="danger">
              <el-popover placement="top-start" trigger="hover" :content="scope.row.is_recommend === 1 ? '不推荐' : '推荐'">
                <template #reference>
                  <el-button :disabled="scope.row.IsInitial === 1"
                    :type="scope.row.is_recommend === 1 ? 'warning' : 'success'" @click="
                      scope.row.is_recommend === 1
                        ? makedown(scope.row.news_id, scope.row.status)
                        : makeup(scope.row.news_id, scope.row.status)
                      ">
                    <i :class="scope.row.is_recommend === 1
                        ? 'el-icon-error'
                        : 'el-icon-check'
                      " />
                  </el-button>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看新闻详情弹窗 -->
      <el-dialog v-model="dialogVisibleContest" title="新闻内容">
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
import tinymce from "tinymce";
import Tinymce from "@/layout/components/Tinymce.vue";
import "tinymce/themes/silver/theme";
export default {
  name: "news",
  setup() {
    const addFormRef = ref(null);
    const { proxy } = getCurrentInstance();
    const newsDetailFormRef = ref(null);
    const state = reactive({
      loading: false,
      dialogFormVisible: false,
      dialogVisibleContest: false,
      content: "",
      newInfo: [],
      detailForm: {
        club_name: "",
        title: "",
        create_time: "",
        editor: "",
      },
      turnLevel: [
        {
          value: "普通社员",
          label: "普通社员",
        },
        {
          value: "副部长",
          label: "副部长",
        },
        {
          value: "部长",
          label: "部长",
        },
        {
          value: "副社长",
          label: "副社长",
        },
        {
          value: "社长",
          label: "社长",
        },
      ],
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

    //删除新闻列表
    const deleteNews = (news_id) => {
      api.new
        .APIDelete({
          user_id: localStorage.UserID || "",
          user_type: localStorage.UserType ? 1 : localStorage.UserType,
          news_id: news_id,
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
    //获取新闻列表
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
      api.new
        .APIFetchNewList(params)
        .then((res) => {
          (state.newInfo = res.data), (state.total = res.count);
        })
        .catch((err) => {
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
    //推荐
    const makeup = (id, status) => {
      if (status === "待审批") {
        proxy.$message.error("未审批通过，不能处理");
      } else {
        api.new
          .APIPick({
            user_id: localStorage.UserID || "",
            user_type: localStorage.UserType ? 1 : localStorage.UserType,
            news_id: id,
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
        api.new
          .APIPick({
            user_id: localStorage.UserID || "",
            user_type: localStorage.UserType ? 1 : localStorage.UserType,
            news_id: id,
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

    // 查看新闻详情
    const showDetail = (news_id) => {
      // console.log(news_id)
      state.dialogVisibleContest = true;
      getDetail(news_id);
    };
    // 获取新闻详情
    const getDetail = (news_id) => {
      const params = {
        user_id: localStorage.UserID || "",
        user_type: localStorage.UserType ? 1 : localStorage.UserType,
        news_id: news_id,
      };
      api.new
        .APIDetailAll(params)
        .then((res) => {
          state.content = res.data.content;
          // state.detailForm.summary = res.data.summary;
          // console.log(res.data.content);
          // console.log(state.detailForm.content);
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
      deleteNews,
      changePage,
      makeup,
      makedown,
      showDetail,
      closeFormDialog,
      getDetail,
    };
  },
};
</script>
<style scoped>
.primary {
  float: left;
  font-size: 20px;
  margin-left: 80px;
  margin-right: 5px;
}

.danger {
  float: left;
  font-size: 20px;
  margin-left: 0px;
  margin-right: 5px;
}
</style>
