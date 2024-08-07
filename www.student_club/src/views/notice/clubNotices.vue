<template>
	<div class="notice">
		<div class="notice-main" v-if="!state.err" v-loading="loading">
			<div class="noticeItem" v-for="(item, index) in state.notices" :key="index"
				@click="$router.push({ name: 'ClubNoticeDetails', params: { clubId: $router.currentRoute.value.params.clubId, noticeId: item.notice_id } })"
				style="cursor: pointer;">
				<div style="float:left;width:90%">{{ item.title }} </div>
				<div style="float:left;width:10%">{{ item.create_time }} </div>
			</div>
		</div>
		<div class="notice-main" v-if="state.err">
			<el-empty description="无通知信息" />
		</div>
		<div class="pagination">
			<!--分页器-->
			<el-pagination background :hide-on-single-page="true" layout="prev, pager, next" :total="state.total"
				:page-size="state.pageSize" :current-page="state.currentPage" @current-change="changePage" />
		</div>
		<div class="active-search" v-if="!state.err">
			<div class="input"><el-input v-model="state.searchInput" placeholder="请输入通知标题" /></div>
			<div class="button">
				<el-button type="primary" plain @click="search">搜索</el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { apiGetNoticeList } from '@/api/notice'
import { useRouter } from "vue-router"
import { toast } from "@/utils/tool"
const router = useRouter()
const loading = ref(false)
const state = reactive({
	total: 0,
	pageSize: 10,
	currentPage: 1,
	searchInput: '',
	notices: [],
	err: 0, //社团是否发布通知
})
// 获取通知列表
const getNoticeList = async () => {
	const parms = {
		club_id: router.currentRoute.value.params.clubId,
		size: state.pageSize,
		page: state.currentPage,
		key_word: state.searchInput
	}
	loading.value = true
	await apiGetNoticeList(parms).then(res => {
		if (res.code == '2001') state.err = 1
		state.notices = res.data
		state.total = res.count
	}).catch(err => {
		console.log(err);
		toast(err, 'error', 'Error')
	})
	loading.value = false
}
// 搜索
const search = () => {
	// console.log(state.searchInput)
	getNoticeList()
}

// 分页
const changePage = (val) => {
	state.currentPage = val
	getNoticeList()
}
// 预加载
onMounted(() => {
	getNoticeList()
})
</script>

<style scoped>
.notice {
	position: relative;
	width: 1250px;
	height: 65vh;
	margin: auto;
}

.notice-main {
	width: 78%;
	height: 65vh;
	float: left;
	margin-top: 2%;
}

.noticeItem {
	width: 100%;
	height: 10.5%;
	padding: 1%;
	background-color: #fff;
	border-bottom: 3px solid rgb(239, 239, 239);
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	border-left: 5px solid rgb(17, 101, 172);
}

.pagination {
	position: absolute;
	top: 72vh;
}
</style>