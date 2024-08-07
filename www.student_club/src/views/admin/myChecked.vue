<template>
  <div>
    <div class="clubCenter-main">
      <Affix />
      <div class="clubCenter">
        <div style="font-weight:bold">待审核</div>
        <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="handleClick" stretch>
          <!-- 待审核的活动 -->
          <el-tab-pane label="活动" name="first" >
            <el-table size="large" :data="state.activeList" stripe border style="width: 1050px;">
              <el-table-column prop="title" label="活动标题" width="400" />
              <!-- <el-table-column prop="status" label="状态" width="100" /> -->
              <el-table-column prop="student_name" label="申请人" width="210" />
              <el-table-column prop="create_time" label="申请时间" width="170" />
              <el-table-column label="操作" fixed="right" width="270" align="center">
                <template #default="scope">
                  <el-button size="small" type="primary" plain
                    @click="seeDetails(1, scope.row.activity_id)">详情</el-button>
                  <el-button size="small" type="success" plain
                    @click="PassActivityApplication(scope.row.activity_id)">通过</el-button>
                  <el-button size="small" type="danger" plain
                    @click="RefuseActivityApplication(scope.row.activity_id)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 待审核的新闻 -->
          <el-tab-pane label="新闻" name="second">
            <el-table size="large" :data="state.newsList" stripe border style="width: 1050px">
              <el-table-column prop="title" label="新闻标题" width="400" />
              <el-table-column prop="editor" label="编辑" width="210" />
              <el-table-column prop="create_time" label="发布时间" width="170" />
              <el-table-column label="操作" fixed="right" width="270" align="center">
                <template #default="scope">
                  <el-button size="small" type="primary" plain @click="seeDetails(2, scope.row.news_id)">详情</el-button>
                  <el-button size="small" type="success" plain
                    @click="PassNewsApplication(scope.row.news_id)">通过</el-button>
                  <el-button size="small" type="danger" plain
                    @click="RefuseNewsApplication(scope.row.news_id)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 待审核的通知 -->
          <el-tab-pane label="通知" name="third">
            <el-table size="large" :data="state.noticeList" stripe border style="width: 1050px">
              <el-table-column prop="title" label="通知标题" width="400" />
              <el-table-column prop="editor" label="编辑" width="210" />
              <el-table-column prop="create_time" label="发布时间" width="170" />
              <el-table-column label="操作" fixed="right" width="270" align="center">
                <template #default="scope">
                  <el-button size="small" type="primary" plain @click="seeDetails(3, scope.row.notice_id)">详情</el-button>
                  <el-button size="small" type="success" plain
                    @click="PassNoticeApplication(scope.row.notice_id)">通过</el-button>
                  <el-button size="small" type="danger" plain
                    @click="RefuseNoticeApplication(scope.row.notice_id)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 待推荐的成员风采 -->
          <el-tab-pane label="成员风采" name="fourth">
            <!-- <el-scrollbar height="350px"> -->
            <el-timeline style="padding:15px; height: 55vh; overflow-y: auto;">
              <el-timeline-item v-for="(item, index) in state.memberAppearanceList" :key="index" icon="" type="primary"
                :size="item.size" hollow="true" :timestamp="item.update_time" placement="top">
                <el-card style="width: 600px;">
                  <el-image :src="item.pic_url" fit="cover"
                    style="width: 150px; height: 100px; cursor: pointer;float:left"
                    @click="$router.push({ name: 'MemberAppearDetails', query: { memberAppearanceId: item.member_appearance_id } })"></el-image>
                  <div style="float:left;padding-top:20px;margin-left:15px">
                    <span style="margin-right:50px">发布成员：{{ item.student_name }}</span>
                    <br>
                    <span v-if="item.is_recommended === 1" style="margin-right:50px">状态：已推荐</span>
                    <span v-if="item.is_recommended === 0" style="margin-right:50px">状态：未推荐</span>

                    <el-button type="primary" plain
                      @click="$router.push({ name: 'MemberAppearDetails', params: { memberAppearanceId: item.member_appearance_id } })">详情</el-button>
                    <el-button type="success" plain @click="recommend(item.member_appearance_id)">推荐</el-button>
                    <el-button type="danger" plain @click="notRecommend(item.member_appearance_id)">不推荐</el-button>
                  </div>
                  <br>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <!-- </el-scrollbar> -->
          </el-tab-pane>
        </el-tabs>
        <!--活动 总数超过一页，再展示分页器-->
        <el-pagination v-if="state.activeName === 'first'" background class="footer_pagination"
          :hide-on-single-page="true" layout="prev, pager, next" :total="paging.activeTotal" :page-size="paging.pageSize"
          :current-page="paging.activeCurrentPage" @current-change="changeActivePage" />
        <!--新闻 总数超过一页，再展示分页器-->
        <el-pagination v-if="state.activeName === 'second'" background class="footer_pagination"
          :hide-on-single-page="true" layout="prev, pager, next" :total="paging.newsTotal" :page-size="paging.pageSize"
          :current-page="paging.newsCurrentPage" @current-change="changeNewsPage" />
        <!--通知 总数超过一页，再展示分页器-->
        <el-pagination v-if="state.activeName === 'third'" background class="footer_pagination"
          :hide-on-single-page="true" layout="prev, pager, next" :total="paging.noticeTotal" :page-size="paging.pageSize"
          :current-page="paging.noticeCurrentPage" @current-change="changeNoticePage" />
      </div>
    </div>
    <el-drawer direction="ltr" v-model="state.drawer" :title="state.drawerTitle">
      <div v-html="state.drawerContent"></div>
    </el-drawer>
  </div>
</template>

<script>
import Affix from '@/components/Affix'
import { reactive, onMounted, ref } from 'vue'
import { apiGetLevel } from '@/api/account'
import { apiGetMyCheckedActivities, apiGetMyCheckedNews, apiGetMyCheckedNotices } from '@/api/club'
import { apiPassNoticeApplication, apiRefuseNoticeApplication } from '@/api/notice'
import { apiPassNewsApplication, apiRefuseNewsApplication } from '@/api/news'
import { apiPassActivityApplication, apiRefuseActivityApplication } from '@/api/activity'
import { apiSwitchRecommendation, apiGetMemberAppearanceList } from '@/api/member'
import { getCookies, toast } from '@/utils/tool'
import { useRoute, useRouter } from "vue-router"
export default {
  components: {
    Affix
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      level: '',
      activeName: 'first', //Tabs标签
      collapseMemberName: 1, //折叠面板
      drawer: false,
      drawerTitle: '',
      drawerContent: '',
      newsList: [],
      noticeList: [],
      activeList: [],
      memberAppearanceList: []
    })
    const paging = reactive({
      pageSize: 10,
      activeTotal: 0,
      activeCurrentPage: 1,
      noticeTotal: 0,
      noticeCurrentPage: 1,
      newsTotal: 0,
      newsCurrentPage: 1,
    })
    const getLevel = () => {
      apiGetLevel({
        user_id: getCookies('user_id'),
        user_type: 0,
        club_id: getCookies('club_id')
      }).then(res => {
        state.level = res.data['level']
      }).catch(err => {
        console.log(err);
      })
    }
    // 获取待审核的活动列表
    const getMyCheckedActivities = () => {
      apiGetMyCheckedActivities({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        club_id: router.currentRoute.value.params.clubId,
        size: paging.pageSize,
        page: paging.activeCurrentPage,
        //   status:'学校已通过'
      })
        .then((res) => {
          paging.activeTotal = res.count
          state.activeList = res.data
        })
        .catch((err) => {
          console.log('apiGetMyPostedActivities', err)
        })
    }
    const changeActivePage = (val) => {
      paging.activeCurrentPage = val
      getMyCheckedActivities()
    }
    // 获取待审核的新闻列表
    const getMyCheckedNews = () => {
      apiGetMyCheckedNews({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        club_id: router.currentRoute.value.params.clubId,
        size: paging.pageSize,
        page: paging.newsCurrentPage
      })
        .then((res) => {
          paging.newsTotal = res.count
          state.newsList = res.data
        })
        .catch((err) => {
          console.log('apiGetMyCheckedNews', err)
        })
    }
    const changeNewsPage = (val) => {
      paging.newsCurrentPage = val
      getMyCheckedNews()
    }
    // 获取待审核的通知列表
    const getMyCheckedNotices = () => {
      apiGetMyCheckedNotices({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        club_id: router.currentRoute.value.params.clubId,
        size: paging.pageSize,
        page: paging.noticeCurrentPage,
      })
        .then((res) => {
          paging.noticeTotal = res.count
          state.noticeList = res.data
        })
        .catch((err) => {
          console.log('apiGetMyPostedNews', err)
        })
    }
    const changeNoticePage = (val) => {
      paging.noticeCurrentPage = val
      getMyCheckedNotices()
    }
    // 获取待推荐的成员风采
    const getMyRecommendMemberAppearance = () => {
      apiGetMemberAppearanceList({
        user_id: getCookies('user_id'),
        user_type: 0,
        level: "社长",
        club_id: router.currentRoute.value.params.clubId,
      })
        .then((res) => {
          if (res.code == 2000) {
            state.memberAppearanceList = res.data
          }
        })
        .catch((err) => {
          console.log('apiGetMyMemberAppearance', err);
          toast(err, 'error', 'Error')
        })
    }
    onMounted(() => {
      if (route.query.activeTabName) {
        state.activeName = route.query.activeTabName
      }
      getLevel()
      getMyCheckedActivities()
      getMyCheckedNews()
      getMyCheckedNotices()
      getMyRecommendMemberAppearance()
    })
    // 通过新闻申请
    const PassNewsApplication = (id) => {
      apiPassNewsApplication({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        news_id: id,
        club_id: router.currentRoute.value.params.clubId
      }).then(res => {
        toast('已通过')
        getMyCheckedNews()
      }).catch(err => { console.log(err); })
    }
    // 拒绝新闻申请
    const RefuseNewsApplication = (id) => {
      apiRefuseNewsApplication({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        news_id: id,
        club_id: router.currentRoute.value.params.clubId
      }).then(res => {
        toast('已拒绝')
        getMyCheckedNews()
      }).catch(err => { console.log(err); })
    }
    // 通过活动申请
    const PassActivityApplication = (id) => {
      apiPassActivityApplication({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        activity_id: id,
        club_id: router.currentRoute.value.params.clubId
      }).then(res => {
        toast('已通过')
        getMyCheckedActivities()
      }).catch(err => { console.log(err); })
    }
    // 拒绝活动申请
    const RefuseActivityApplication = (id) => {
      apiRefuseActivityApplication({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        activity_id: id,
        club_id: router.currentRoute.value.params.clubId
      }).then(res => {
        toast('已拒绝')
        getMyCheckedActivities()
      }).catch(err => { console.log(err); })
    }
    // 通过通知申请
    const PassNoticeApplication = (id) => {
      apiPassNoticeApplication({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        notice_id: id,
        club_id: router.currentRoute.value.params.clubId
      }).then(res => {
        toast('已通过')
        getMyCheckedNotices()
      }).catch(err => { console.log(err); })
    }
    // 拒绝通知申请
    const RefuseNoticeApplication = (id) => {
      apiRefuseNoticeApplication({
        user_id: getCookies('user_id'),
        user_type: 0,
        user_level: "社长",
        notice_id: id,
        club_id: router.currentRoute.value.params.clubId
      }).then(res => {
        toast('已拒绝')
        getMyCheckedNotices()
      }).catch(err => { console.log(err); })
    }
    // 设置成员风采推荐位
    const recommend = (id) => {
      apiSwitchRecommendation({
        is_recommended: 1,
        club_id: getCookies('club_id')
      }, id).then(res => {
        toast('操作成功')
      }).catch(err => {
        console.log(err);
        toast(err, 'error', 'error')
      })
    }
    const notRecommend = (id) => {
      apiSwitchRecommendation({
        is_recommended: 0,
        club_id: getCookies('club_id')
      }, id).then(res => {
        toast('操作成功')
      }).catch(err => {
        console.log(err);
        toast(err, 'error', 'error')
      })
    }
    // 查看详情
    const seeDetails = (size, id) => {
      router.push({ name: "ClubCenterDetails", params: { clubId: router.currentRoute.value.params.clubId, size: size, id: id }, })
    }
    return {
      state,
      paging,
      PassNewsApplication,
      RefuseNewsApplication,
      PassActivityApplication,
      RefuseActivityApplication,
      PassNoticeApplication,
      RefuseNoticeApplication,
      seeDetails,
      recommend,
      notRecommend,
      changeActivePage,
      changeNoticePage,
      changeNewsPage
    }
  }
}
</script>

<style scoped>
.btn-group {
  float: right;
  margin-right: 4vw;
}

.footer_pagination {
  position: absolute;
  top: 70vh;
  /* 居中 */
  /* left: 50%;
  transform: translateX(-50%); */
}
</style>