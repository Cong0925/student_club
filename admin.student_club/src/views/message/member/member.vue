<!-- 轮播图 -->
<template>
  <div>
    <el-card>
      <template #header>
        <el-input v-model="selectClub" maxlength="30" style="width: 200px; margin-right: 10px" clearable
          placeholder="社团名称" @change="handleSearch()" />
        <el-input v-model="selectName" maxlength="30" style="width: 200px; margin-right: 10px" clearable
          placeholder="学生姓名" @change="handleSearch()" />
        <el-input v-model="selectNumber" maxlength="30" style="width: 200px; margin-right: 10px" clearable
          placeholder="学生学号" @change="handleSearch()" />

        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </template>
      <el-table ref="multipleTable" v-loading="loading" :data="PicList" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="student_number" label="学生学号" align="center" header-align="center" width="280px" />
        <el-table-column prop="student_name" label="学生姓名" align="center" header-align="center" with="200px
            " />
        <el-table-column prop="club_name" label="社团名称" align="center" header-align="center" width="240px" />
        <el-table-column prop="title" label="标题" align="center" header-align="center" width="350px" />
        <el-table-column label="风采展示" align="center" header-align="center" min-width="380px">
          <template #default="scope">
            <img :key="scope.row.member_appearance_id" style="width: 120px" :src="scope.row.pic_url" alt="成员风采" />
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
            <div class="primary">
              <el-popover placement="top-start" trigger="hover" content="查看">
                <template #reference>
                  <el-button :disabled="scope.row.IsInitial === 1" type="primary"
                    @click="showDetail(scope.row.member_appearance_id)">
                    <i class="el-icon-view" />
                  </el-button>
                </template>
              </el-popover>

            </div>

            <div class="danger">
              <el-popover placement="top-start" trigger="hover" content="删除">
                <template #reference>
                  <el-button :disabled="scope.row.IsInitial === 1" type="danger"
                    @click="handleDelete(scope.row.member_appearance_id)">
                    <i class="el-icon-delete" />
                  </el-button>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看成员风采详情弹窗 -->
      <el-dialog v-model="dialogVisibleContest" title="成员风采内容">
        <div v-html="content"></div>
      </el-dialog>
      <!--总数超过一页，再展示分页器-->
      <el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="total" :page-size="size"
        :current-page="page" @current-change="changePage" />
    </el-card>
  </div>
</template>
<script>
import { onMounted, reactive, ref, toRefs, getCurrentInstance } from "vue";
import memberPic from "@/api/model/member";

export default {
  name: "RotationPic",
  setup() {
    const multipleTable = ref(null);
    const addFormRef = ref(null);
    const { proxy } = getCurrentInstance();
    const state = reactive({
      loading: false,
      content: "",
      dialogFormVisible: false,
      dialogVisibleContest: false,
      ifEdit: false,
      PicList: [],
      length: "",
      multipleSelection: [],
      selectName: "",
      selectNumber: "",
      selectClub: "",
      page: 1,
      size: 10,
      total: 0,
    });
    onMounted(() => {
      getPicList();
    });

    //获取成员风采信息列表
    const getPicList = () => {
      memberPic
        .APIFetchMemberPicList({
          user_id: localStorage.UserID || "",
          user_type: localStorage.UserType ? 1 : localStorage.UserType,
          club_name: state.selectClub,
          student_name: state.selectName,
          student_number: state.selectNumber,
          page: state.page,
          size: state.size,
        })
        .then((res) => {
          state.PicList = res.data;
          state.total = res.count;
          // console.log(state.PicList)
          //   console.log('Pic', )
        })
        .catch((err) => {
          console.log("PicList", err);
          // proxy.$Message.error({
          //     message:err
          // })
        });
    };

    const showDetail = (member_appearance_id) => {
      console.log(member_appearance_id);
      state.dialogVisibleContest = true;
      getDetail(member_appearance_id);
    };

    // 获取-细节
    const getDetail = (member_id) => {
      const params = {
        user_id: localStorage.UserID || "",
        user_type: localStorage.UserType ? 1 : localStorage.UserType,
        m_id: member_id,
      };
      memberPic
        .APIDetailMember(params)
        .then((res) => {
          // console.log(state.content);
          state.content = res.data[0].content;
          // console.log(res.data.content);
          // console.log(state.content);
        })
        .catch((err) => {
          console.log("get memberappearance_detail", err);
              proxy.$message.error({
                message: err,
              });
              // state.loading = false;
        });
    };

    const closeFormDialog = () => {
      state.dialogVisibleContest = false;
    };

    //搜索
    const handleSearch = () => {
      getPicList();
    };

    //翻页
    const changePage = (val) => {
      state.page = val;
      getPicList();
    };
    //删除
    const handleDelete = (id) => {
      proxy.$messageBox
        .confirm("此操作将删除该条记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          memberPic
            .APIDeleteMember({
              user_id: localStorage.UserID || "",
              user_type: localStorage.UserType ? 1 : localStorage.UserType,
              mid: id,
            })
            .then((res) => {
              // console.log('delete rotationPic', res)
              proxy.$message.success("删除成功");
              // 刷新
              getPicList();
            })
            .catch((err) => {
              console.log("delete rotationPic", err);
              proxy.$message.error({
                message: err,
              });
              state.loading = false;
            });
        })
        .catch(() => {
          proxy.$Message("取消删除");
        });
    };

    return {
      ...toRefs(state),
      getPicList,
      changePage,
      handleDelete,
      handleSearch,
      closeFormDialog,
      showDetail,
      getDetail,
    };
  },
};
</script>
<style scoped lang="scss">
.primary {
  float: left;
  font-size: 20px;
  margin-left: 45px;
  margin-right: 5px;
}

.danger {
  float: left;
  font-size: 20px;

  margin-right: 5px;
}
</style>