import { createApp } from 'vue'
import '@/assets/styles/style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import VueLazyload from 'vue-lazyload'



const app = createApp(App)

app.use(createPinia())

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// //点击跳转后固定在页面头部
// router.beforeEach((to, from, next) => {
//     // chrome
//     document.body.scrollTop = 0
//         // firefox
//     document.documentElement.scrollTop = 0
//         // safari
//     window.pageYOffset = 0
//     next()
// })

app.use(router)

app.use(VueLazyload)  

app.use(ElementPlus)


app.mount('#app')