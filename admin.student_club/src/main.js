import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import scui from './scui'
import router from './router'
import store from './store'
import { createApp } from 'vue'
import App from './App.vue'
import 'tinymce/skins/ui/oxide/skin.css'
import * as echarts from 'echarts'

const app = createApp(App)

// 目前echarts的全局引入出了问题
app.use(echarts)
app.config.globalProperties.$echarts = echarts
app.echarts = echarts
app.use(store)
app.use(router)
app.use(ElementPlus, { size: 'small' })
app.use(scui)

// 挂载app
app.mount('#app')
