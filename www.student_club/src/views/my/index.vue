<template>
  <div>
  <div class="center-left">
    <personalAside></personalAside>
  </div>

  <div class="center-right">
      <router-view></router-view>
  </div>
</div>
</template>

<script>
import personalAside from "./side.vue";
export default {
  components: {
    personalAside,
  },
};
</script>

<style>
.center-left {
  width: 200px;
  height: 600px;
  margin-top: 0.5%;
  margin-left: 13%;
  margin-bottom: 2%;
  float: left;
  background-color: #fff;
}
.center-right {
  width: 60%;
  min-height: 600px;
  margin-top: 0.5%;
  margin-left: 0.5%;
  margin-bottom: 2%;
  float: left;
  background-color: #fff;
}
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
