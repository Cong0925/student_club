<template>
  <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" background-color="#fff"
    text-color="black" text-align: center>
    <div class="basic-info" @click="changePic">
      <el-avatar :size="80" :src="state.head_pic" alt="头像" fit="cover" />
    </div>
    <el-menu-item v-for="(item, index) in state.menu" :key="index" @click="clickMenu(item, index)">
      <span style="margin:auto" :class="{ th: state.menus[index] == 1 }">{{ item.label }}</span>
    </el-menu-item>
  </el-menu>

  <el-dialog v-model="state.isShowChangeDialog" title="修改头像" width="30%" align-center>
    <el-form>
      <el-form-item label="更换logo">
        <el-upload ref="upload" :on-exceed="handleExceed" drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif"
          :http-request="handleUploadPic" :file-list="state.fileList" action="" list-type="picture-card" :limit="1"><i
            class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <div v-if="state.fileListLength === 1" style="color: red;margin-bottom: 10px;">*只能上传一张图片！</div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitPic" :loading="loading.submitLoading">提交</el-button>
        <el-button @click="cancleUpdate">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { apiUpdateUserPic, apiGetMyInformation, apiPutMyInformation } from "@/api/studentInfo"
import { apiPicUpload } from '@/api/RotationPic'
import { useRouter } from "vue-router"
import { getCookies, setCookies } from '@/utils/tool'
import APP_CONFIG from '@/config/index.js'

const router = useRouter()
const isCollapse = false
const loading = reactive({
  submitLoading: false
})
const state = reactive({
  menu: [{
    path: "/my/club",
    name: "MyClub",
    label: "我的社团",
  }, {
    path: "/my/focus",
    name: "MyFocus",
    label: "我的关注",
  }, {
    path: "my/memberAppearance",
    name: "MyAllMemberAppearance",
    label: "我的风采",
  }, {
    path: "/personalCenter/myPosted",
    name: "MyPosted",
    label: "我要发布",
  }, {
    path: "my/attended",
    name: "MyAttended",
    label: "我的活动",
  }, {
    path: "my/apply",
    name: "ApplyClub",
    label: "申请社团",
  }, {
    path: "/my/information",
    name: "MyInformation",
    label: "个人信息",
  },
  ],
  account: '',
  nickname: '',
  head_pic: '',
  menus: [0, 0, 0, 0],
  isShowChangeDialog: false,
  fileList: [],
  fileListLength: 0,
  logo_url: '',
})
const clickMenu = function (item, index) {
  state.menus[0] = 0
  state.menus[1] = 0
  state.menus[2] = 0
  state.menus[3] = 0
  state.menus[4] = 0
  state.menus[5] = 0
  state.menus[6] = 0
  state.menus[index] = 1
  router.push({
    name: item.name
  })
}
const changePic = () => {
  state.isShowChangeDialog = true
}
const submitPic = async () => {
  loading.submitLoading = true

  await apiUpdateUserPic({
    head_pic: state.logo_url
  })
    .then((res) => {
      state.head_pic = APP_CONFIG.BASEURL_PIC + state.logo_url
      setCookies('head_pic', state.head_pic)
      state.isShowChangeDialog = false
      state.fileList = []
      state.fileListLength = 0
      loading.submitLoading = false
      router.go(0)
    })
    .catch((err) => {
      console.log(err)
    })
}
const handleUploadPic = (item) => {
  apiPicUpload({
    user_id: getCookies('user_id'),
    user_type: 0,
    pic_file: item.file
  }).then((res) => {
    state.logo_url = res.data.Url
  }).catch((err) => {
    console.log('pic', err)
    toast(err, 'error', 'Error')
  })
}
const handleExceed = () => {
  state.fileListLength = 1
}
const cancleUpdate = () => {
  state.isShowChangeDialog = false
  state.fileList = []
  state.fileListLength = 0
}
onMounted(() => {
  state.account = getCookies('account')
  state.nickname = getCookies('nickname')
  state.head_pic = getCookies('head_pic')
})

</script>

<style scoped>
:root {
  --el-menu-active-color: black;
}

.el-menu-item.is-active {
  color: black;
  /* background: greenyellow; */
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
}

.el-menu {
  height: 100%;
  border: none;
}

.el-menu h3 {
  color: #fff;
  text-align: center;
  line-height: 48x
}

.th {
  color: #409EFF;
}

.basic-info {
  margin-left: 30%;
  padding-top: 10px;
  position: relative;
  cursor: pointer;
}

.basic-info::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  background-image: url(@/assets/images/photo.png);
  background-size: cover;
  opacity: 0;
  transition: opacity 0.2s;
}

.basic-info:hover::before {
  opacity: 1;
}
</style>
