<template>
  <div class="clubList">
    <div class="title_more">
      <div class="title_more_left"> 社团列表</div>
      <div class="title_more_right" @click="toNew('ClubList')">更多</div>
    </div>
    <div style="padding: 0 2% 0 2%;">
      <el-tabs class="demo-tabs" @tab-click="loadClubsByCategory($event)">
        <el-tab-pane v-for="i in state.categoryData" :key="i.category_id" :label="i.category_name">

          <div v-for="(item, index) in state.newClubList[i.category_name]" :key="index" class="list"
            @click="toNew('ClubMain', item.club_id)" style="cursor: pointer;">
            <div v-if="item.club_name">
              <div class="club-card">
                <el-avatar :size="90" :src="item.logo_url" class="club-card-logo" />
                <span class="club-card-text">{{ item.club_name }}</span>
              </div>
            </div>
          </div>

          <div v-if="!state.newClubList[i.category_name]">
            <el-empty description="description" />
          </div>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted,onBeforeUnmount } from "vue";
import { groupBy } from "@/utils/tool";
import { useRouter } from 'vue-router'
import { setCookies } from '@/utils/tool'
import { apiGetClubList } from '@/api/clubList'
import { apiGetClubCategories } from '@/api/account'
import APP_CONFIG from '@/config/index.js'

export default {
  setup() {
    const router = useRouter()
    const state = reactive({
      clubList: [],
      newClubList: [],
      categoryData: [],
      isLoad: false
    });
    const loadClubsByCategory = (event) => {
      const categoryIndex = event.index; // 获取点击标签的索引
      const categoryId = state.categoryData[categoryIndex].category_id; // 获取对应索引的 category_id

      console.log(categoryId)
    }

    const groupByName = function (data) {
      state.newClubList = groupBy(data);
    };
    const toNew = (name, id) => {
      let newpath = router.resolve({ name, params: { clubId: id } })
      window.open(newpath.href, '_blank')
      setCookies("club_id", id)
    }
    const getClubList = () => {
      apiGetClubList().then(res => {
        res.data.forEach(element => {
          if (element.logo_url) {
            if (!element.logo_url.includes(APP_CONFIG.BASEURL_PIC)) {
              element.logo_url = APP_CONFIG.BASEURL_PIC + element.logo_url
            }
          }
          else {
            element.logo_url = APP_CONFIG.BASE_PIC
          }
        });
        state.clubList = res.data
        groupByName(state.clubList)
      })
    }
    const getClubCategories = () => {
      apiGetClubCategories().then(res => {
        state.categoryData = res.data
      })
    }    
    // 预加载
    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });
    onBeforeUnmount(()=>{
      window.removeEventListener('scroll', handleScroll);
    });
    let domToTop = document.getElementsByClassName('clubList')
    // 检测鼠标滚轮
    const handleScroll = (event)=> {
      const clientH = document.documentElement.clientHeight // 获取视口高度
      const clientT = document.documentElement.scrollTop || document.body.scrollTop; // 滚轮位置
      if(!state.isLoad && domToTop[0].offsetTop - clientT < clientH){
        // console.log('show');
        state.isLoad = true
        getClubCategories()
        getClubList()
      }
    }
    return {
      groupByName,
      state,
      toNew,
      loadClubsByCategory,
      handleScroll
    };
  },
};
</script>

<style scoped>
.clubList {
  margin: 5px 0% 1% 0%;
  /* height: 500px; */
  background-color: #fff;
}

.clubList img {
  width: 100%;
}

.list {
  font-size: 20px;
  color: #fff;
}

.demo-tabs {
  height: 380px;
  overflow: hidden;
}

.club-card {
  width: 14vw;
  height: 8vw;
  float: left;
  display: flex;
  align-items: center;
  background: #fd746c;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right,
      #ff9068,
      #fd746c);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right,
      #ff9068,
      #fd746c);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  margin: 0vw 0.5vw 0.5vw 0vw;
}

.club-card-logo {
  margin-left: 1.2vw;
  width: 5vw;
}

.club-card-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 0.7vw;
  width: 8vw;

}
</style>
