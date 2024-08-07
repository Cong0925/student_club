<template>
	  <router-view class="app_main"></router-view>
</template>

<script>
export default {
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    /* -webkit-font-smoothing: antialiased; */
    /* -moz-osx-font-smoothing: grayscale; */
    color: #2c3e50;
    padding: 0;
    margin: 0;
    min-width: 600px;
    background-color: rgb(239, 239, 239);
  }
  .app_main{
    min-height:calc(100vh - 222px);;
  }
  * {
    margin: 0;
    padding: 0;
  }
  html,
  body {
    font-size: 14px;
    padding: 0;
    margin: 0;
    height: 100%;
  }
</style>