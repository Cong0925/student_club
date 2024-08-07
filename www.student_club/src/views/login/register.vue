<template>
  <div class="register_box">
    <div class="register_box_left">
      <h2>华北电力大学</h2>
      <h4>社团管理系统</h4>
      <img :src="loginbg" />
    </div>
    <div class="register_box_right">
      <div class="right_title">注册账号</div>
      <el-form ref="formRef" :rules="rules" :model="form.registerData" label-width="80px" size="large">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.registerData.nickname" class="w-60 m-1" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="学号" prop="student_number">
          <el-input v-model="form.registerData.student_number" class="w-60 m-1" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" class="w-60 m-1" show-password v-model="form.registerData.password"
            placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="password2" label="密码" :rules="[
          {
            required: true,
            message: '两次密码不一致',
            pattern: new RegExp('^' + form.registerData.password + '$'),
          },
        ]">
          <el-input type="password" class="w-60 m-1" show-password v-model="form.registerData.password2"
            placeholder="请确认密码"></el-input>
        </el-form-item>

      </el-form>
      <div>
        <el-button class="register_button" type="primary" @click="onSubmit_register" round>注 册</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { register } from "@/api/account";
import { toast } from "@/utils/tool"
import { useRouter } from "vue-router";
import { encryptedData } from "@/utils/jsencrypt";
import loginbg from "@/assets/images/loginbg.svg";

const router = useRouter();
const formRef = ref(null);
const form = reactive({
  collegeData: [],
  classData: [],
  registerData: {
    nickname: "",
    student_number: "",
    password: "",
    password2: "",
  },
});
const rules = {
  nickname: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
  student_number: [
    { required: true, message: "学号不能为空", trigger: "blur" },
  ],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  password2: [{ required: true, message: "密码不能为空", trigger: "blur" }],
};
const onSubmit_register = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    // console.log("yes");
    register({
      nickname: form.registerData.nickname,
      student_number: form.registerData.student_number,
      password: encryptedData(form.registerData.password),
    })
      .then((res) => {
        if (res.code == 2000) {
          toast('注册成功')
          router.push("/login");
        }
        toast(res.message, 'warnning', 'warnning')
      })
      .catch((err) => {
        console.log("register", err);
        toast(err, 'error', 'error')
      });
  });
}
</script>

<style scoped>
.register_box {
  width: 1250px;
  height: 600px;
  margin: auto;
  margin-top: 20px;
  display: flex;

}

.register_box_left {
  width: 750px;
  height: 600px;
  float: left;
  padding: 60px;
  color: #fff;
  background: var(--el-color-primary);
  position: relative;
  overflow: hidden;
}

.register_box_left h2 {
  font-size: 30px;
}

.register_box_left h4 {
  font-size: 18px;
  margin-top: 10px;
  font-weight: normal;
}

.register_box_left p {
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
}

.register_box_left img {
  position: absolute;
  left: -120px;
  bottom: -160px;
  width: 550px;
}

.register_box_right {
  width: 500px;
  height: 600px;
  padding: 6%;
  padding-top: 80px;
  float: left;
  text-align: center;
  background-color: #fff;
}

.right_title {
  font-size: 23px;
  margin-bottom: 10%;
}

.otherLoginFun {
  margin-top: 80px;
}

.register_button {
  width: 250px;
  margin: auto;
  margin-top: 20px;
}
</style>