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
        <el-image   :src="pic_url" fit="fill" />
        <el-button v-if="no_pic===1" class="change_pic" type="primary"
        size="small" @click="handleAdd()">添加图片</el-button>
      </div>
      <div class="block">
        <el-row>
          <el-col :span="10">
            <el-form-item label="申请社团" prop="ExperimentName">
              <el-input
                v-model="clubForm.club"
                placeholder="申请社团"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="社团类型" prop="ExperimentCourseNumber">
              <el-select
                  v-model="clubForm.type"
                  filterable
                  placeholder="请选择"
                  style="display:block;"
                >
                  <el-option
                      v-for="item in clubtype"
                      :key="item.category_id"
                      :label="item.category_name"
                      :value="item.category_id"
                  />
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="所属学院" prop="ExperimentName">
              <el-select
                  v-model="clubForm.college"
                  filterable
                  placeholder="请选择"
                  style="display:block;"
                >
                  <el-option
                      v-for="item in collegeList"
                      :key="item.college_id"
                      :label="item.college_name"
                      :value="item.college_id"
                  />
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="社长学号" prop="ExperimentName">
              <el-input
                v-model="clubForm.student_number"
                placeholder="社长学号"
              />
            </el-form-item>
          </el-col>
        </el-row>
       
        <el-row type="flex" style="margin-top: 10px;">
          <el-col :span="10">
            <el-form-item label="指导老师" prop="ExperimentName">
              <el-input
                v-model="clubForm.teacher"
                placeholder="指导老师"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="办公地址" prop="ExperimentCourseNumber">
              <el-input
                v-model="clubForm.address"
                maxlength="30"
                placeholder="办公地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
      </div>
        
          <tinymce
            :value="clubForm.content"
            placeholder-text="介绍"
            @input="WatchExperimentSummary($event)"
          />
        
        <el-button class="btn" type="success" @click="UpdataMsg()">完成</el-button>  
      </el-form>
    </el-card>
    <el-dialog v-model="dialogFormVisible" title="上传头像">
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
            no_pic:1,
            pic_url:'',
            dialogImageUrl: '',
            teacher_id: '',
            new_pic_url:'',
            clubtype:[],
            collegeList:[],
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
                content: ''
            },
        })

        onMounted(() => {
                clubType()
                collegeType()
            })

        // 提交更改-细节
        const UpdataMsg = () => {
          const params = {
            user_id:localStorage.UserID || '',
            user_type:localStorage.UserType ? 1 : localStorage.UserType,
            club_name:state.clubForm.club,
            student_number:state.clubForm.student_number,
            college_id:state.clubForm.college,
            category_id:state.clubForm.type,
            logo_url:state.new_pic_url,
            description:state.clubForm.content,
            teacher_name:state.clubForm.teacher,
            address:state.clubForm.address
          }
          api.club.APIAdd(params).then((res) => {
            proxy.$message.success('添加成功')
            goBack()
          }).catch((err) => {
            this.$ElMessage.error({
                        message: err
                    })
          })
        }
        //查询社团类型
        const clubType = () => {
          api.type.APIFetchTypeList().then(
            (res)=>{
              state.clubtype = res.data
            }
          ).catch((err)=>{
            proxy.$message.error({
                    message: err
                })
          })
        }
        //查询学院类型
        const collegeType = () => {
          api.type.APISearchCollege().then(
            (res)=>{
              state.collegeList = res.data
            }
          ).catch((err)=>{
            proxy.$message.error({
                    message: err
                })
          })
        }
         //上传图片
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
                state.dialogFormVisible=false
                state.no_pic = 0
            })
            .catch((err) => {
                console.log('pic',err)
                proxy.$message.error({
                    message: err
                })
            })
        }
        const WatchExperimentSummary = item => {
            state.clubForm.content = item
        }
        const handleAdd = () => {
            state.ifEdit = false
            state.editForm.RotationPicName= ''
            state.editForm.RotationPicUrl= ''
            state.editForm.DestinationUrl= ''
            state.dialogFormVisible = true
        }
        const goBack = () => {
          router.go(-1)
         }
        return {
            ...toRefs(state),
            UpdataMsg,
            handleUploadPic,
            clubType,
            collegeType,
            handleAdd,
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
.block {
  display: inline-block;
  vertical-align: top;
  height: 300px;
  margin-left: 20px;
  width: 800px;
}
.change_pic {
    margin: 0 auto;
    margin-left:70px ;
  }
</style>
