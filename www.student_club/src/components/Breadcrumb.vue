<template>
  <div class="position">
    <el-icon :size="20">
      <i class="el-icon-location"></i>
    </el-icon>
    <span>当前位置：首页<span>{{route}}</span></span>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { reactive, toRefs } from '@vue/reactivity';
import { computed, onMounted } from '@vue/runtime-core';

export default {
    name:'position',
    setup() {
      const store=useStore()
      let position=reactive({
        route:store.state.path
      })
      position.route=computed(()=>{
        return store.state.path
      })
      return{
        ...toRefs(position)
      }
    }
}
</script>

<style scoped>
.position{
  width: 90%;
  height: 40px;
  background-color: #fff;
  margin-top: 20px;
  margin-left: 3.5%;
  text-align: left;
  padding-left: 5px;
  position: relative;
}
.position>span{
  margin: 0;
  display: inline-block;
  font-size: 12px;
  margin-left: 25px;
  line-height: 40px;
}
.position>span>span{
  font-weight: 100;
}
.el-icon{
  color: rgb(26, 187, 155);
  position: absolute;
  top: 10px;
}
</style>