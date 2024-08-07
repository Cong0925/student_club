<template>
  <div class="block text-center" v-if="state.picReactive.length > 0">
    <el-carousel height="480px">
      <el-carousel-item v-for="(item, index) in state.picReactive" :key="index" >
        <img class="rotation_img" :src="item.rotation_pic_url" @load="imgLoad" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { fetchRotationPic } from "@/api/RotationPic";
const state = reactive({
      picReactive: []
});
const router = useRouter();

// 加载轮换图设置信息
const loadRotationpic = async () => {
  fetchRotationPic()
    .then(res => {
      // console.log("res",res);
      state.picReactive = res.data;
      // console.log(state.picReactive);
    })
    .catch(err => {
      console.log(err);
      ElMessage.error({
        message: err
      });
    });
};
onMounted(() => {
  loadRotationpic();
});
</script>


<style scoped>
.rotation_img {
  width: 100%;
  height: 100%;
}
</style>