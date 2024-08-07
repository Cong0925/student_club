<template>
    <div>
      <el-row><el-button
        class="goBack"
        icon="el-icon-arrow-left"
        size="small"
        @click="goBack"
      >返回上一页
      </el-button></el-row>

      <el-card>
        <div class="pic">
          <el-image   :src="pic_url" fit="fill" />
          <el-button
class="change_pic"
type="primary"
        size="small"
@click="handleAdd()">更换图片</el-button>
        </div>
        <div class="pic_msg">
        <el-form
          ref="experimentFormRef"
          :model="studentForm"
          :rules="experimentFormRules"
          label-width="150px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="学号" prop="StudentNumber">
                <el-input
                  v-model="studentForm.StudentNumber"
                  placeholder="请输入学生学号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学生姓名" prop="StudentName">
                <el-input
                  v-model="studentForm.StudentName"
                  placeholder="请输入学生姓名"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属学院" prop="StudentNumber">
                <el-input
                  v-model="studentForm.College"
                  placeholder="请输入学院"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属班级" prop="StudentName">
                <el-input
                  v-model="studentForm.Class"
                  placeholder="请输入班级"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="性别" prop="StudentNumber">
                <el-select
                  v-model="studentForm.Sex"
                  filterable
                  placeholder="请选择"
                  style="display:block;"
                >
                  <el-option
                    v-for="item in SexList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学生职务" prop="StudentName">
                <el-select
                  v-model="studentForm.Level"
                  filterable
                  placeholder="请选择"
                  style="display:block;"
                >
                  <el-option
                    v-for="item in turnLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属社团" prop="StudentNumber">
                <el-select
                  v-model="studentForm.Club"
                  filterable
                  placeholder="请选择"
                  style="display:block;"
                >
                  <el-option
                            v-for="item in ClubList"
                      :key="item.club_id"
                      :label="item.club_name"
                      :value="item.club_name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="StudentName">
                <el-input
                  v-model="studentForm.telephone"
                  placeholder="请输入联系方式"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="StudentNumber">
                <el-input
                  v-model="studentForm.mail"
                  placeholder="请输入邮箱"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号" prop="StudentName">
                <el-input
                  v-model="studentForm.account"
                  placeholder="请输入账号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="give">
            <el-button
              type="primary"
              @click="studentMsgUpdata()"
            >提交</el-button>
          </div>

        </el-form>
      </div>
      </el-card>
      <el-dialog v-model="dialogFormVisible" title="上传轮播图">
      <el-form
        ref="addFormRef"
        :model="editForm"
        :rules="rules"
        label-width="100px"
      >

        <el-form-item label="上传图片" prop="RotationPicUrl">
          <el-upload
            class="avatar-uploader"
            drag
            action=""
            accept="jpg,jpeg,png,svg,bmp,gif"
            :show-file-list="false"
            :http-request="handleUploadPic"
          >
            <img
              v-if="editForm.RotationPicUrl"
              style="width: 100%; height: 100%"
              :src="editForm.RotationHttpPicUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="跳转地址" prop="DestinationUrl">
          <el-input v-model="editForm.DestinationUrl" autocomplete="off" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <!-- <el-button v-if="ifEdit==true" type="primary" @click="submitEdit()">确认修改</el-button> -->
          <el-button type="primary" @click="submitAdd()">确认添加</el-button>
        </span>
      </template>
    </el-dialog>
    </div>
  </template>

<script>
import { reactive, ref, toRefs, onMounted, getCurrentInstance } from 'vue'
import tool from '@/utils/tool'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/index'
import Tinymce from '@/layout/components/Tinymce.vue'
import account from '@/api/model/account'
import rotationPic from '@/api/model/rotationPic'
export default {
    name: 'AddExperiment',
    components: {
        Tinymce
    },
    setup() {
        const experimentFormRef = ref(null)
        const addFormRef = ref(null)
        const router = useRouter()
        const route = useRoute()
        const { proxy } = getCurrentInstance()
        const { student_id, club_id } = route.params
        const state = reactive({
            token: tool.data.get('token') || '',
            dialogFormVisible: false,
            dialogImageUrl: '',
            teacher_id: '',
            content: '',
            ClubList: [],
            pic_url: '',
            new_pic_url: '',
            ExperimentTypeList: [], // 实验类型列表
            CourseList: [], // 课程列表
            turnLevel: [{
                value: '待审批',
                label: '待审批'
            }, {
                value: '普通社员',
                label: '普通社员'
            }, {
                value: '副部长',
                label: '副部长'
            }, {
                value: '部长',
                label: '部长'
            }, {
                value: '副社长',
                label: '副社长'
            }, {
                value: '社长',
                label: '社长'
            }],
            SexList: [
                {
                    value: '男',
                    key: 0
                },
                {
                    value: '女',
                    key: 1
                }
            ],
            turnLevel: [{
                value: '待审批',
                label: '待审批'
            }, {
                value: '普通社员',
                label: '普通社员'
            }, {
                value: '副部长',
                label: '副部长'
            }, {
                value: '部长',
                label: '部长'
            }, {
                value: '副社长',
                label: '副社长'
            }, {
                value: '社长',
                label: '社长'
            }],
            editForm: {
                RotationPicName: '',
                RotationPicID: '',
                RotationPicUrl: '',
                RotationHttpPicUrl: ''
            },
            studentForm: {
                StudentName: '',
                StudentNumber: '',
                College: '',
                Class: '',
                Sex: '',
                Club: '',
                Level: '',
                telephone: '',
                ChooseStartTime: new Date(),
                mail: '',
                account: ''
            },
            experimentFormRules: {
                StudentName: [
                    { required: 'true', message: '请填写学生姓名', trigger: 'blur' }
                ],
                StudentNumber: [
                    { required: 'true', message: '请填写学生学号', trigger: 'blur' }
                ],
                College: [
                    { required: 'true', message: '请输入所属学院', trigger: 'blur' }
                ],
                Class: [
                    { required: 'true', message: '请输入所在班级', trigger: 'blur' }
                ],
                Sex: [
                    { required: 'true', message: '请选择性别', trigger: 'blur' }
                ],
                Club: [
                    { required: 'true', message: '请选择所属社团', trigger: 'blur' }
                ],
                Level: [
                    { required: 'true', message: '请选择学生职务', trigger: 'blur' }
                ],
                telephone: [
                    { required: 'true', message: '请填写联系方式', trigger: 'blur' }
                ],
                mail: [
                    { required: 'true', message: '请填写邮箱', trigger: 'blur' }
                ],
                account: [
                    { required: 'true', message: '请填写账号', trigger: 'blur' }
                ]
            },
            ExperimentPicUrlList: [
                {
                    name: '',
                    url: ''
                }
            ]
        })

        onMounted(() => {
            getClubList()
            // getExperimentTypes()
            getStudentMsg(student_id, club_id)
        })

        // 获取-学生所有信息
        const getStudentMsg = (student_id, club_id) => {
            state.loading = true
            const params = {
                user_id: localStorage.UserID,
                user_type: localStorage.UserType ? 1 : localStorage.UserType,
                student_id: student_id,
                club_id: club_id
            }
            account.APIFetchAll(params)
                .then((res) => {
                    state.studentForm.StudentName = res.data.student_name,
                    state.studentForm.StudentNumber = res.data.student_number,
                    state.studentForm.College = res.data.college_name,
                    state.studentForm.Class = res.data.class_name,
                    state.studentForm.Sex = res.data.sex,
                    state.studentForm.Club = res.data.club_name,
                    state.studentForm.Level = state.turnLevel[res.data.level].label,
                    state.studentForm.telephone = res.data.mobile,
                    state.studentForm.mail = res.data.email,
                    state.studentForm.account = res.data.account,
                    state.pic_url = "http://images.quwancode.com" + res.data.head_pic

                })
                .catch((err) => {
                    ElMessage.error({
                        message: err
                    })
                })
        }
        // 获取-s社团列表
        const getClubList = () => {
            api.club.APIFetchClubList({
                user_id: localStorage.UserID || '',
                user_type: localStorage.UserType ? 1 : localStorage.UserType

            }).then((res) => {
                state.ClubList = res.data
                // console.log(state.ClubList)
            }).catch((err) => {
                console.log('ClubList', err)
                ElMessage.error({
                    message: err
                })
            })
        }
        // 修改信息
        const studentMsgUpdata = () => {
            api.account.APIUpdata({
                user_id: localStorage.UserID,
                user_type: localStorage.UserType ? 1 : localStorage.UserType,
                student_name: state.studentForm.StudentName,
                student_number: state.studentForm.StudentNumber,
                student_id: student_id,
                class_id: state.studentForm.Class,
                sex: state.studentForm.Sex,
                mobile: state.studentForm.telephone,
                email: state.studentForm.mail,
                account: state.studentForm.account,
                level: state.studentForm.Level,
                club_id: club_id,
                head_pic: state.new_pic_url
            }).then((res) => {
                // console.log('成功',res)
                proxy.$message.success('修改成功！')
                goBack()
            }).catch((err) => {
                console.log('ClubList', err)
                ElMessage.error({
                    message: err
                })
            })
        }
        const studentPicUpdata = () => {
            api.account.APIUpdata({
                user_id: localStorage.UserID,
                user_type: localStorage.UserType ? 1 : localStorage.UserType,
                student_id: student_id,
                level: state.studentForm.Level,
                club_id: club_id,
                head_pic: state.new_pic_url
            }).then((res) => {
                state.pic_url = "http://images.quwancode.com" + state.new_pic_url
                proxy.$message.success('修改成功！')
                goBack()
            }).catch((err) => {
                console.log('ClubList', err)
                ElMessage.error({
                    message: err
                })
            })
        }
        // 上传图片
        const handleUploadPic = (item) => {
            api.common.APIPicUpload({
                user_id: localStorage.UserID,
                user_type: localStorage.UserType,
                pic_file: item.file
            })
                .then((res) => {
                    state.editForm.RotationPicUrl = res.data.Url
                        ? res.data.Url
                        : res.data.httpUrl
                    state.editForm.RotationHttpPicUrl = res.data.httpUrl
                    state.new_pic_url = res.data.Url
                })
                .catch((err) => {
                    console.log('pic', err)
                    proxy.$message.error({
                        message: err
                    })
                })
        }
        // 更改头像
        const submitAdd = () => {
            studentPicUpdata()
            state.dialogFormVisible = false
        }
        const handleAdd = () => {
            state.ifEdit = false
            state.editForm.RotationPicName = ''
            state.editForm.RotationPicUrl = ''
            state.editForm.DestinationUrl = ''
            state.dialogFormVisible = true
        }
        // 实现富文本框的双向数据绑定
        const WatchExperimentSummary = item => {
            state.experimentForm.ExperimentSummary = item
        }

        // 提交保存实验信息
        const experimentAddSubmit = () => {
            state.loading = true
            // 定义用户信息参数
            const userinfo = {
                UserID: localStorage.UserID || '',
                UserType: localStorage.UserType ? 3 : localStorage.UserType, // 不安全
                CollegeID: 3
            }
            // 根据对应的课程取教师ID
            state.CourseList.forEach((item) => {
                if (item.CourseID === state.experimentForm.CourseID) {
                    state.teacher_id = item.TeacherID
                }
            })

            const params = {
                ...userinfo,
                ...state.experimentForm,
                TeacherID: state.teacher_id,
                ExperimentPicUrl: state.experimentForm.ExperimentPicUrl
                    ? state.experimentForm.ExperimentPicUrl
                    : '',
                ChooseStartTime: state.experimentForm.ChooseStartTime
                    ? state.experimentForm.ChooseStartTime.toDateString()
                    : '',
                ChooseEndTime: state.experimentForm.ChooseEndTime
                    ? state.experimentForm.ChooseEndTime.toDateString()
                    : '',
                SubmissionEndTime: state.experimentForm.SubmissionEndTime
                    ? state.experimentForm.SubmissionEndTime.toDateString()
                    : ''
            }

            // console.log(2222)
            // console.log(params)

            api.experiment.APIAddExperiment(params)
                .then((res) => {
                    proxy.$message.success('实验添加成功')
                    router.push({ name: 'ExperimentList' })
                })
                .catch((err) => {
                    console.log('submit', err)
                    proxy.$message.error({
                        message: err
                    })
                })
            // state.loading = false
        }

        const goBack = () => {
            router.go(-1)
        }
        return {
            ...toRefs(state),
            submitAdd,
            getClubList,
            experimentAddSubmit,
            handleUploadPic,
            handleAdd,
            WatchExperimentSummary,
            studentMsgUpdata,
            goBack

        }
    },
    methods: {
        goBack() {
            this.$router.go(-1) // 返回上一层
        }
    }
}
</script>

  <style lang="scss" scoped>
  .goBack {
    margin: 0 0 5px 0;
    float: right;
  }
  /* 图片上传之后的大小 */
  .el-upload-list--picture-card .el-upload-list__item {
    width: 30%;
    height: 150px;
  }
  .el-upload-dragger {
    height: 150px;
  }

  .pic {
    display: inline-block;
    vertical-align: top;
    width: 440px;
    height: 450px;
    margin-left: 50px;
  }
  .pic_msg {
    display: inline-block;
    width: 600px;
    margin-left: 20px;
  }
  .change_pic {
    margin: 0 auto;
    margin-left:180px ;
  }
  .give {
    width: 200px;
    margin-top: 50px;
    margin-left: 350px;
  }
  </style>
