<template>
  <div class="clubListMain" v-loading="loading">
    <div class="clubListItem" v-for="(ty, index) in state.categoryData" :key="index">
      <div class="clubListItemLeft">{{ ty.category_name }}</div>
      <div class="clubListItemRight">
        <div v-for="(item, i) in state.newClubList[ty.category_name]" :key="i" class="clubListItemRightItem"
          @click="toClub(item.club_id)">
          {{ item.club_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue'
import { groupBy } from '@/utils/tool'
import { useRouter } from 'vue-router'
import { setCookies } from '@/utils/tool'
import { apiGetClubList } from '@/api/clubList'
import { apiGetClubCategories } from '@/api/account'
export default {
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const state = reactive({
      clubList: [],
      newClubList: [],
      categoryData: []
    })
    const toClub = (data) => {
      let newpath = router.resolve({
        name: 'ClubMain',
        params: {
          clubId: data
        }
      })
      window.open(newpath.href, '_blank')
      setCookies("club_id", data)
    }

    const groupByName = function (data) {
      state.newClubList = groupBy(data);
    }

    const getClubList = async () => {

      await apiGetClubList().then(res => {
        state.clubList = res.data
        groupByName(state.clubList)
      })

    }
    const getClubCategories = async () => {
      loading.value = true
      await apiGetClubCategories().then(res => {
        state.categoryData = res.data
      })
      loading.value = false
    }
    onMounted(() => {
      getClubCategories()
      getClubList()
    })
    return {
      groupByName,
      state,
      toClub, loading
    }
  },
};
</script>

<style scoped>
.clubListMain {
  width: 1250px;
  margin: auto;
  padding: 1%;
  background-color: rgb(239, 239, 239);
}

.clubListItem {
  width: 1250px;
  margin: auto;
  background-color: #fff;
  margin-top: 2px;
  border-left: 15px solid rgb(26, 136, 187);
  border-radius: 10px;
  display: flex;
}

.clubListItemLeft {
  font-size: 16px;
  width: 10%;
  height: 50px;
  text-align: center;
}

.clubListItemRight {
  border-left: 2px solid rgb(239, 239, 239);
  font-size: 18px;
  width: 90%;
  display: inline-block;
  padding-bottom: 30px;
}

.clubListItemRightItem {
  display: inline-block;
  margin-left: 15px;
  cursor: pointer;
}

.clubListItemRightItem:hover {
  /* background-color: #ccc; */
  color: #4d90dd;
  font-weight: bold;
}
</style>