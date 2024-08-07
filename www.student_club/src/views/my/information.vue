<template>
  <div class="dicen" style="
      font-size: 20px;
      margin-top: 30px;
      margin-left: 100px;
      padding-bottom: 20px;
    ">基础信息<span class="msg">账号：{{ state.formList.account }}</span>
  </div>

  <div class="basic-information">
    <e-card v-loading="loading">
      <el-form ref="updateFormRef" :rules="updateRules" :model="state.formList">
        <el-row>
          <el-form-item label="昵称" prop="nickname" :key="index">
            <span class="msg" v-show="state.ishow">{{ state.formList.nickname }}</span>
            <el-input class="item" v-model="state.formList.nickname" v-show="!state.ishow"></el-input>
          </el-form-item>
          <el-form-item class="item_msg" label="学号" prop="student_number" :key="index">
            <span class="msg" v-show="state.ishow">{{ state.formList.student_number }}</span>
            <el-input class="item" v-model="state.formList.student_number" v-show="!state.ishow"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="学院" prop="college_id" :key="index">
            <span class="msg" v-show="state.ishow">{{ state.formList.college_name }}</span>
            <el-select v-model="state.formList.college_id" class="m-2 item" placeholder="请选择学院" v-show="!state.ishow"
              @change="handleCollegeChange">
              <el-option v-for="item in state.college_options" :key="item.college_id" :label="item.college_name"
                :value="item.college_id" />
            </el-select>
          </el-form-item>
          <el-form-item class="item_msg" label="班级" prop="class_id" :key="index">
            <span class="msg" v-show="state.ishow">{{ state.formList.class_name }}</span>
            <el-select v-model="state.formList.class_id" class="m-2 item" :placeholder="state.classTip"
              v-show="!state.ishow" :disabled="state.isClassDisabled">
              <el-option v-for="item in state.class_options" :key="item.class_id" :label="item.class_name"
                :value="item.class_id" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="邮箱" prop="email" :key="index">
            <span class="msg" v-show="state.ishow">{{ state.formList.email }}</span>
            <el-input class="item" v-model="state.formList.email" v-show="!state.ishow"></el-input>
          </el-form-item>
          <el-form-item class="item_msg" label="性别" prop="sex" :key="index">
            <span class="msg" v-show="state.ishow">{{ state.formList.sex }}</span>
            <el-select v-model="state.formList.sex" class="m-2 item" placeholder="选择性别" v-show="!state.ishow">
              <el-option v-for="item in [{ label: '男', value: '男' }, { label: '女', value: '女' }]" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button type="primary" @click="edit" v-show="state.ishow">完善信息</el-button>
          <el-button type="warning" @click="cancle(updateFormRef)" v-show="!state.ishow">取消</el-button>
          <el-button type="primary" @click="save(updateFormRef)" v-show="!state.ishow">保存</el-button>
        </el-row>
      </el-form>
    </e-card>
  </div>
  <div class="dicen" style="
      font-size: 20px;
      margin-top: 30px;
      margin-left: 100px;
      padding-bottom: 20px;
    ">
    账号信息
  </div>
  <div class="basic-information">
    <e-card>
      <el-form :model="state.formList">
        <el-row>
          <el-form-item label="姓名" prop="student_name" :key="index">
            <span class="msg" v-show="state.ishow">{{ state.formList.student_name }}</span>
            <el-input class="item" v-model="state.formList.student_name" v-show="!state.ishow"
              style="margin-left: 14px"></el-input>
          </el-form-item>
          <el-form-item class="item_msg" label="手机号" prop="mobile" :key="index">
            <span v-show="state.ishow">{{ state.formList.mobile }}</span>
            <el-input class="item" v-model="state.formList.mobile" v-show="!state.ishow"
              style="margin-left: 2px"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="密码" prop="password" :key="index">
          <span style="color: #48bd86">已设置</span>
          <el-button text @click="state.dialogFormVisible = true"
            style="color: #00a1d9; margin-left: 50px">修改密码</el-button>
        </el-form-item>
        <el-form-item label="第三方账号绑定">
          <el-button v-if="state.data.open_id == ''" type="info" @click="WxBinding">去绑定</el-button>
          <!-- <span v-else>已绑定</span> -->
          <el-image v-else style="width: 40px; height: 40px" :src="state.head_pic">已绑定</el-image>
        </el-form-item>
      </el-form>
    </e-card>
  </div>
  <!-- 修改密码弹窗 -->
  <el-dialog v-model="state.dialogFormVisible" title="修改密码" width="800px" top="200px" center>
    <el-form :model="form" class="ml-20">
      <el-form-item label="旧的密码" :label-width="state.formLabelWidth">
        <el-input type="password" show-password v-model="form.oldPassword" autocomplete="off" class="w-80 ml-5" />
      </el-form-item>
      <el-form-item label="新的密码" :label-width="state.formLabelWidth">
        <el-input type="password" show-password v-model="form.newPassword" autocomplete="off" class="w-80 ml-5" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="passwordSave">取消</el-button>
        <el-button type="primary" @click="editPassword">完成</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 绑定微信弹出二维码显示框 -->
  <el-dialog v-model="state.isBangDing" width="350px">
    <iframe scrolling="no" width="300" height="400" frameBorder="0" allowTransparency="true" :src="state.url"
      id="atrDialogIframe_protocoliframe" sandbox="allow-scripts allow-top-navigation allow-same-origin"></iframe>
  </el-dialog>
</template>

<script>
import { reactive, onMounted, ref, watch } from "vue"
import { apiGetMyInformation, apiPutMyInformation, apiPutPassword } from '@/api/studentInfo'
import { getCookies, setCookies, toast } from '@/utils/tool'
import { useRouter } from "vue-router"
import { encryptedData } from "@/utils/jsencrypt"
import { apiGetCollegeInfo, apiGetClassInfo } from '@/api/account'

export default {
  name: "个人信息",
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const state = reactive({
      data: {},
      ishow: true,
      isClassDisabled: true,
      classTip: '请选择班级',
      college_options: [],
      class_options: [],
      formLabelWidth: "140px",
      dialogFormVisible: false,
      formList: {
        account: '',
        user_type: 0,
        nickname: '',
        student_number: '',
        college_id: '',
        class_id: '',
        email: '',
        student_name: '',
        mobile: '',
        sex: ''
      },
      url: "",
      isBangDing: false,
      head_pic: ''
    });

    const form = reactive({
      oldPassword: "",
      newPassword: "",
    });
    // 修改信息 可编辑按钮
    const edit = () => {
      state.ishow = false;
      if (state.formList.college_id) {
        getClassInfo()
      }
    };
    // 表单校验
    const updateFormRef = ref()
    const updateRules = {
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
      ],
      student_number: [
        { required: true, message: '请输入学号', trigger: 'blur' }
      ],
      college_id: [
        { required: true, message: '请选择学院', trigger: 'blur' }
      ],
      class_id: [
        { required: true, message: '请选择班级', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请填写邮箱', trigger: 'blur' }
      ],
      student_name: [
        { required: true, message: '请填写姓名', trigger: 'blur' }
      ],
      mobile: [
        { required: true, message: '请填写手机号', trigger: 'blur' }
      ],
      sex: [
        { required: true, message: '请选择性别', trigger: 'blur' }
      ]
    }
    const save = async (updateFormRef) => {
      await updateFormRef.validate(async (valid, fields) => {
        if (valid) {
          putMyInformation()
          state.ishow = true;
        } else {
          console.log('error submit!!');
          return false
        }
      });
    };
    const cancle = (updateFormRef) => {
      updateFormRef.resetFields()
      getMyInformation()
      state.ishow = true;
    };
    // 获取个人信息
    const getMyInformation = async () => {
      loading.value = true
      await apiGetMyInformation({
        user_id: getCookies('user_id'),
        user_type: 0
      }).then(res => {
        delete res.data.head_pic
        state.formList = res.data
        state.data = res.data
        setCookies('account', res.data.account)
        setCookies('nickname', res.data.nickname)
      }).catch(err => {
        console.log(err);
      })
      loading.value = false
    }
    // 修改个人信息
    const putMyInformation = () => {
      apiPutMyInformation(state.formList)
        .then(res => {
          if (res.code != '2000') toast(res.message)
          getMyInformation()
        }).catch(err => {
          console.log(err);
        })
    }
    // 修改密码
    const editPassword = () => {
      apiPutPassword({
        user_id: getCookies('user_id'),
        user_type: 0,
        old_password: encryptedData(form.oldPassword),
        new_password: encryptedData(form.newPassword)
      }).then(res => {
        router.push('/login')
      }).catch(err => {
        console.log(err);
      })
      state.dialogFormVisible = false
      // router.push('/login')
    }
    const passwordSave = () => {
      state.dialogFormVisible = false
    }
    // 绑定微信号方便登录
    const WxBinding = async () => {
      const UserID = getCookies('user_id');
      const UserType = 0;
      const urlcode = encodeURIComponent(
        "http://club.quwancode.com/?UserID=" + UserID + "&UserType=" + UserType
      );
      const constParamas =
        "response_type=code&scope=snsapi_login&state=STATE#wechat_redirect&self_redirect=default&style=black";
      state.url =
        "https://open.weixin.qq.com/connect/qrconnect?appid=wx1b280b1d784f4e54&redirect_uri=" + urlcode + "&" + constParamas;
      state.isBangDing = true;
      // window.location.href = state.contents;
    };
    // 查询学院列表
    const getCollegeInfo = () => {
      apiGetCollegeInfo()
        .then(res => {
          state.college_options = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }
    // 查询班级列表
    const getClassInfo = () => {
      const parms = {
        college_id: state.formList.college_id
      }
      apiGetClassInfo(parms)
        .then(res => {
          if (res.code === '2000') {
            state.isClassDisabled = false
            state.classTip = '请选择班级'
            state.class_options = res.data
          }
          if (res.code === '2001') {
            state.classTip = res.error
          }
        })
        .catch((err) => {
          toast(err)
        })
    }
    // 监听学院的选择，查询班级
    const handleCollegeChange = () => {
      state.class_options = []
      state.formList.class_id = ''
      getClassInfo()
    }
    // 预加载
    onMounted(() => {
      getMyInformation()
      getCollegeInfo()
      state.head_pic = getCookies('head_pic')
    })
    return {
      state,
      form,
      edit,
      save,
      editPassword,
      passwordSave,
      WxBinding,
      loading,
      cancle,
      handleCollegeChange,
      updateFormRef, updateRules,
    };
  },
};
</script>

<style scoped>
.dicen {
  display: inline-block;
}

.basic-information {
  width: 100%;
  margin: auto;
  /* margin-top: 3%; */
  border: 3px solid rgb(239, 239, 239);
  padding: 2%;
  padding-left: 10%;
  font-size: 17px;
}

.item {
  width: 250px;
  margin-left: 9px;
}

span {
  margin-left: 20px;
}

.ed>span {
  color: #3896ff;
}

.msg {
  width: 200px;
}

.item_msg {
  margin-left: 150px;
}
</style>
