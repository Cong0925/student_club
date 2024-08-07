<template>
    <!--新闻列表页-新闻频道首页-->
    <div class="newsCenter">
		<NewsList/>
		<HotNews/>
	</div>

</template>

<script>
import HotNews from "./components/HotNews.vue"
import NewsList from './components/NewsList.vue'

export default{
    components:{
        HotNews,NewsList
    },
    setup(){

    }
}
</script>

<style scoped>
.newsCenter{
    position: relative;
	width: 1250px;
	height: 65vh;
	margin: auto;
}
</style>