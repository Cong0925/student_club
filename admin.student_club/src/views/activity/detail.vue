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
          :model="activityForm"
          :rules="acttivityFormRules"
          label-width="150px"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="申请社团" prop="ExperimentName">
                <el-input
                  v-model="activityForm.club"
                  placeholder="申请社团"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="活动主题" prop="ExperimentCourseNumber">
                <el-input
                  v-model="activityForm.title"
                  maxlength="50"
                  placeholder="活动主题"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="申请时间" prop="ExperimentName">
                <el-input
                  v-model="activityForm.create_time"
                  placeholder="申请时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="活动时间" prop="ExperimentCourseNumber">
                <el-input
                  v-model="activityForm.end_time"
                  maxlength="30"
                  placeholder="活动时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" style="margin-top: 10px;">
            <el-col :span="10">
              <el-form-item label="活动地点" prop="ExperimentName">
                <el-input
                  v-model="activityForm.address"
                  placeholder="活动地点"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="参与人数" prop="ExperimentCourseNumber">
                <el-input
                  v-model="activityForm.attend"
                  maxlength="30"
                  placeholder="参与人数"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" style="margin-top: 10px;">
           
            <el-col :span="10">
              <el-form-item label="负责人联系方式" prop="ExperimentCourseNumber">
                <el-input
                  v-model="activityForm.mobile"
                  maxlength="30"
                  placeholder="负责人联系方式"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="实验介绍"
            prop="ExperimentSummary"
          >
            <tinymce
              :value="activityForm.content"
              placeholder-text="请输入实验介绍"
             
            />
          </el-form-item >
          <el-button class="btn" type="success" @click="approve">通过</el-button>
          <el-button class="btn" type="danger" @click="un_approve">打回</el-button>
          <!-- <el-button class="btn" type="primary" @click="chang">完成</el-button> -->
          
        </el-form>
      </el-card>
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
          const { activity_id } = route.params
          const state = reactive({
              token: tool.data.get('token') || '',
              dialogVisible: false,
              dialogImageUrl: '',
              teacher_id: '',
              content: '',
              activity:'',
              ExperimentTypeList: [], // 实验类型列表
              CourseList: [], // 课程列表
              activityForm: {
                  club:'',
                  title:'',
                  create_time:'',
                  end_time:'',
                  address:'',
                  attend:'',
                  mobile:'',
                  content:''
              },
          })
  
          onMounted(() => {
            getDetail(activity_id)
            
          })
  
          // 获取-细节
          const getDetail = (activity) => {
            const params = {
              user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              activity_id:activity
            }
            api.activity.APIDetailAll(params).then((res) => {
                  state.activityForm.club=res.data.club_name,
                  state.activityForm.title=res.data.title,
                  state.activityForm.create_time=res.data.create_time,
                  state.activityForm.end_time=res.data.end_time,
                  state.activityForm.address=res.data.address,
                  state.activityForm.attend=res.data.max_attended,
                  state.activityForm.mobile=res.data.mobile,
                  state.activityForm.content = res.data.content
            }).catch((err) => {
              this.$ElMessage.error({
                          message: err
                      })
            })
          }
         //审批-通过
         const approve = () => {
          api.activity.APIPick({
            user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              activity_id:activity_id,
              status:'学校已通过'
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
          api.activity.APIPick({
            user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              activity_id:activity_id,
              status:'被驳回'
          }).then(()=>{
            proxy.$message.success('审驳回成功')
            goBack()
          }).catch((err)=>{
            this.$ElMessage.error({
                          message: err
                      })
          })
         }
        //  //修改
        //  const chang = () => {
        //   api.new.APIPick({
        //     user_id:localStorage.UserID || '',
        //       user_type:localStorage.UserType ? 1 : localStorage.UserType,
        //       activity_id:activity_id,
        //       status:'学校已通过',
        //       title:state.newsForm.title,
        //       content:state.newsForm.content
        //   }).then(()=>{
        //     proxy.$message.success('修改成功')
        //     goBack()
        //   }).catch((err)=>{
        //     this.$ElMessage.error({
        //                   message: err
        //               })
        //   })
        //  }
        const goBack = () => {
          router.go(-1)
         }
          return {
              ...toRefs(state),
              getDetail,
              approve,
              un_approve,
              goBack
              // chang
              
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
  .btn {
    float: right;
    margin: 0 10px;
  }
  </style>
  