<template>
  <div class="loginCenter">
    <div class="llogin" v-if="state.visible == 0">
      <h2>华北电力大学</h2>
      <h4>社团管理系统</h4>
      <!-- <p>实验、课程、项目、人员管理。</p> -->
      <img :src="loginbg" />
    </div>

    <div class="llogintwo" v-if="state.visible == 1">
      <div style="margin: 5% 10% 0px 10%;">
        <el-text class="mx-1" type="danger" style="font-size: 20px;color: red;">
          *请确认微信已经绑定过已有帐号，否则无法通过扫码登陆，请先账号登陆后，在个人中心绑定微信！*
        </el-text>
      </div>
      <div style="margin: 0px 0px 0px 30%">
        <iframe scrolling="no" width="300" height="400" frameBorder="0" allowTransparency="true" :src="state.url"
          id="atrDialogIframe_protocoliframe" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe>
      </div>
    </div>

    <div class="rlogin">
      <div class="rlogin-title">登录</div>
      <el-form ref="formRef" :rules="rules" :model="form" size="large">
        <el-form-item prop="student_number">
          <el-input v-model="form.student_number" placeholder="请输入学号">
            <template #prefix>
              <el-icon class="el-input__icon">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" show-password v-model="form.password" placeholder="请输入密码">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button class="login_button" round type="primary" @click="onSubmit_login" :loading="loading">登 录</el-button>
        <el-button class="login_button" round type="primary" @click="onSubmit_register">注 册</el-button>
      </div>
      <div class="otherLoginFun">
        <el-divider>
          其他登录方式
        </el-divider>
        <img src="@/assets/images/wechat_logo.png" style="width: 70px; height: 45px; cursor: pointer; margin-left: 37%;"
          @click="isWechat">
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { toast } from "@/utils/tool";
import { login } from "@/api/account";
import { encryptedData } from "@/utils/jsencrypt";
import { setCookies } from "@/utils/tool";
import loginbg from "@/assets/images/loginbg.svg";
import APP_CONFIG from '@/config/index.js'
const router = useRouter();

const form = reactive({
  student_number: "",
  password: "",
});
const state = reactive({
  url: '',
  visible: 0
})
const isWechat = () => {
  if (state.visible == 0) {
    state.visible = 1
  } else if (state.visible == 1) {
    state.visible = 0
  }
}
const setSrc = () => {
  state.url = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx1b280b1d784f4e54' +
    '&redirect_uri=' + encodeURIComponent('http://club.quwancode.com/')
    + "&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect&self_redirect=default&style=black"
}
onMounted(() => {
  setSrc()
})
const rules = {
  student_number: [
    { required: true, message: "学号不能为空", trigger: "blur" },
  ],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
};
const formRef = ref(null);
const loading = ref(false);
const onSubmit_login = () => {
  // 表单预验证
  formRef.value.validate(async (valid) => {
    //如果预验证不通过则什么也不执行
    if (!valid) return;
    //反之 则请求后台登录接口 将输入的用户名和密码与数据库中已注册用户名和密码进行对比
    //验证成功 即可放行！
    loading.value = true;
    login({
      student_number: form.student_number,
      password: encryptedData(form.password),
    })
      .then((res) => {
        if (res.code != 2000) return toast("登陆失败", 'error', 'Error');
        toast("登录成功");
        // 将登陆成功的token保存至sessionStorage中
        const user_info = res.data
        const pic_baseUrl = APP_CONFIG.BASEURL_PIC
        if (user_info.head_pic) {
          if (!user_info.head_pic.includes(pic_baseUrl)) {
            user_info.head_pic = pic_baseUrl + user_info.head_pic
          }
        }
        else {
          user_info.head_pic = APP_CONFIG.BASE_PIC
        }

        setCookies("head_pic", user_info.head_pic);
        setCookies("user_info", user_info);
        setCookies("token", res.data.token);
        setCookies("isLogin", true);
        setCookies("user_id", res.data.student_id);
        setCookies("user_name", res.data.student_name);
        window.sessionStorage.setItem("token", res.data.token);
        // 编程式导航 跳转至后台主页/home页面
        router.push("/");
        // 路由守卫 只有登陆成功返回token才可以跳转 通过修改url不能跳转
        router.beforeEach((to, from, next) => {
          // 如果访问的是登录页直接放行
          if (to.path === "/login") return next();
          //反之则从sessionstorage中获取保存的token值 进行判断
          const tokenStr = window.sessionStorage.getItem("token");
          // 没有token 强制让其返回到登录页
          if (!tokenStr) return next("/login");
          // 有token 直接放行到用户任意想去的地方
          next();
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

// 监听回车事件
function onKeyUp(e) {
  if (e.key == "Enter") onSubmit_login();
}

const onSubmit_register = () => {
  router.push({ path: "/register" });
};
</script>

<style scoped>
.loginCenter {
  width: 1250px;
  height: 600px;
  margin: auto;
  margin-top: 20px;
}

.llogin {
  width: 750px;
  height: 600px;
  float: left;
  padding: 60px;
  color: #fff;
  background: var(--el-color-primary);
  position: relative;
  overflow: hidden;
}

.llogintwo {
  width: 750px;
  height: 600px;
  float: left;
  position: relative;
  overflow: hidden;
  background: #fff;
  border-right: rgb(239, 239, 239) 1px solid;
}

.llogin h2 {
  font-size: 30px;
}

.llogin h4 {
  font-size: 18px;
  margin-top: 10px;
  font-weight: normal;
}

.llogin p {
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
}

.llogin img {
  position: absolute;
  left: -120px;
  bottom: -160px;
  width: 550px;
}

.rlogin {
  width: 500px;
  height: 600px;
  padding: 6%;
  padding-top: 80px;
  float: left;
  text-align: center;
  background-color: #fff;
}

.rlogin-title {
  font-size: 23px;
  margin-bottom: 10%;
}

.login_button {
  width: 250px;
  margin: auto;
  margin-top: 20px;
}

.el-form-item {
  margin-top: 25px;
}

.otherLoginFun {
  margin-top: 80px;
}
</style>