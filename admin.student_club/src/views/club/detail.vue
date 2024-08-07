<template>
  <div>
    <el-row>
      <el-button
        class="goBack"
        icon="el-icon-arrow-left"
        size="small"
        @click="goBack"
        >返回上一页
      </el-button>
    </el-row>
    <el-card>
      <el-form
        ref="experimentFormRef"
        :model="clubForm"
        :rules="acttivityFormRules"
        label-width="150px"
        ><div class="pic">
          <el-image :src="clubForm.url" fit="fill" />
          <el-button class="btnup" type="primary" @click="changePic"
            >更改图片</el-button
          >
        </div>
        <div class="block">
          <el-row>
            <el-col :span="10">
              <el-form-item label="申请社团" prop="ClubtName">
                <el-input v-model="clubForm.club" placeholder="申请社团" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="社团类型" prop="ClubType">
                <el-input
                  v-model="clubForm.type"
                  maxlength="30"
                  placeholder="社团类型"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="所属学院" prop="College">
                <el-input v-model="clubForm.college" placeholder="所属学院" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="社长姓名" prop="LeaderName">
                <el-input
                  v-model="clubForm.student_name"
                  maxlength="30"
                  placeholder="社长姓名"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" style="margin-top: 10px">
            <el-col :span="10">
              <el-form-item label="社长学号" prop="LeaderNumber">
                <el-input
                  v-model="clubForm.student_number"
                  placeholder="社长学号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="联系方式" prop="TelephoneNumber">
                <el-input
                  v-model="clubForm.mobile"
                  maxlength="30"
                  placeholder="联系方式"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" style="margin-top: 10px">
            <el-col :span="10">
              <el-form-item label="指导老师" prop="TeacherName">
                <el-input v-model="clubForm.teacher" placeholder="指导老师" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="办公地址" prop="Address">
                <el-input
                  v-model="clubForm.address"
                  maxlength="30"
                  placeholder="办公地址"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" style="margin-top: 10px">
            <el-col :span="10">
              <el-form-item label="申请时间" prop="Time">
                <el-input
                  v-model="clubForm.create_time"
                  placeholder="申请时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <tinymce
          :value="clubForm.content"
          placeholder-text="介绍"
          width='50%'
          @input="WatchExperimentSummary($event)"
        />
        <el-button class="btn" type="primary" @click="updata">修改</el-button>
        <el-button class="btn" type="success" @click="approve">通过</el-button>
        <el-button class="btn" type="danger" @click="un_approve"
          >打回</el-button
        >
      </el-form>
    </el-card>
    <el-dialog v-model="dialogFormVisible" title="上传图片">
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

export default {
    name: 'AddExperiment',
    components: {
        Tinymce
    },
    setup() {
        const experimentFormRef = ref(null)
        const router = useRouter()
        const route = useRoute()
        const { proxy } = getCurrentInstance()
        const { club_id } = route.params
        const state = reactive({
            token: tool.data.get('token') || '',
            dialogFormVisible: false,
            dialogImageUrl: '',
            teacher_id: '',
            new_pic_url:'',
            pic_url:'',
            editForm: {
                RotationPicName: '',
                RotationPicID:'',
                RotationPicUrl: '',
                RotationHttpPicUrl:''
            },
            clubForm: {
                club:'',
                type:'',
                college:'',
                student_name:'',
                student_number:'',
                mobile:'',
                teacher:'',
                address:'',
                create_time:'',
                content: '',
                url:'',
                student_id:''
            },
        })

        onMounted(() => {
          getDetail(club_id)
          
        })

        // 获取-细节
        const getDetail = (club_id) => {
          const params = {
            user_id:localStorage.UserID || '',
            user_type:localStorage.UserType ? 1 : localStorage.UserType,
            club_id:club_id
          }
          api.club.APIDetailAll(params).then((res) => {
                state.clubForm.club=res.data.club_name,
                state.clubForm.type=res.data.category_name,
                state.clubForm.create_time=res.data.create_time,
                state.clubForm.college=res.data.college_name,
                state.clubForm.address=res.data.address,
                state.clubForm.mobile=res.data.mobile,
                state.clubForm.teacher=res.data.teacher_name,
                state.clubForm.student_name=res.data.proprieter_name,
                state.clubForm.student_number=res.data.student_number,
                state.clubForm.student_id=res.data.proprieter_id,
                state.clubForm.content = res.data.description,
                
                state.clubForm.url = res.data.logo_url
                ?res.data.logo_url
                :'http://images.quwancode.com/upload/images/error_image.jpg'
                
          }).catch((err) => {
            this.$ElMessage.error({
                        message: err
                    })
          })
        }
        const handleUploadPic = (item) =>{
            api.common.APIPicUpload({
                user_id:localStorage.UserID,
                user_type:localStorage.UserType,
                pic_file:item.file
            })
            .then((res) => {
                state.editForm.RotationPicUrl=res.data.Url
                    ?res.data.Url
                    :res.data.httpUrl
                state.editForm.RotationHttpPicUrl = res.data.httpUrl
                state.new_pic_url=res.data.Url
                state.pic_url = "http://images.quwancode.com"+state.new_pic_url
                // state.dialogFormVisible=false
                // state.no_pic = 0
            })
            .catch((err) => {
                console.log('pic',err)
                proxy.$message.error({
                    message: err
                })
            })
        }
        const submitAdd = () => {
          state.clubForm.url = state.pic_url
          state.dialogFormVisible = false
          api.club.APIUpdata({
              user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              club_id:club_id,
              logo_url:state.new_pic_url

            }).then((res) => {
              proxy.$message.success('修改成功')
              goBack()
            }).catch((err) => {
              this.$ElMessage.error({
                          message: "修改失败"
                      })
            })
        }
        const changePic = () => {
          
            state.ifEdit = false
            state.editForm.RotationPicName= ''
            state.editForm.RotationPicUrl= ''
            state.editForm.DestinationUrl= ''
            state.dialogFormVisible = true
       
        }

       //审批-通过
       const approve = () => {
          api.club.APIPick({
            user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              club_id:club_id,
              status:'学校已通过',
              proprieter_id:state.clubForm.student_id
          }).then(()=>{
            proxy.$message.success('审批成功')
            goBack()
          }).catch((err)=>{
            this.$ElMessage.error({
                          message: err
                      })
          })
    
         }
         //审批-拒绝
         const un_approve = () => {
          api.club.APIPick({
            user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              club_id:club_id,
              status:'被驳回',
              proprieter_id:state.clubForm.student_id
          }).then(()=>{
            proxy.$message.success('审驳回成功')
            goBack()
          }).catch((err)=>{
            this.$ElMessage.error({
                          message: err
                      })
          })
          
         }
         const updata = () => {

            api.club.APIUpdata({
              user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              club_id:club_id,
              teacher_name:state.clubForm.teacher,
              address:state.clubForm.address,
              description:state.clubForm.content

            }).then((res) => {
              proxy.$message.success('修改成功')
              goBack()
            }).catch((err) => {
              this.$ElMessage.error({
                          message: "修改失败"
                      })
            })
         }
         const goBack = () => {
          router.go(-1)
         }
         const WatchExperimentSummary = item => {
            state.clubForm.content = item
        }
        return {
            ...toRefs(state),
            getDetail,
            approve,
            un_approve,
           goBack,
           changePic,
           handleUploadPic,
           submitAdd,
           updata,
           WatchExperimentSummary
            
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
  height: 300px;
  width: 250px;
  margin-left: 70px;
}
.pic el-img {
  margin-top: 20px;
}
.btn {
  float: right;
  margin: 0 10px;
}
.btnup {
  margin-top: 20px;
  margin-left: 80px;
}
.block {
  display: inline-block;
  vertical-align: top;
  height: 300px;
  margin-left: 20px;
  width: 800px;
}
</style>
