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
      <el-card class="card">
        <el-form
          ref="experimentFormRef"
          :model="newsForm"
          :rules="acttivityFormRules"
          label-width="150px"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="申请社团" prop="ExperimentName">
                <el-input
                  v-model="newsForm.club_name"
                  placeholder="申请社团"
                  :disabled="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="新闻标题" prop="ExperimentCourseNumber">
                <el-input
                  v-model="newsForm.title"
                  maxlength="50"
                  placeholder="新闻标题"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="申请时间" prop="ExperimentName">
                <el-input
                  v-model="newsForm.create_time"
                  placeholder="申请时间"
                  :disabled="true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="作者" prop="ExperimentCourseNumber">
                <el-input
                  v-model="newsForm.editor"
                  maxlength="50"
                  placeholder="作者"
                  :disabled="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="30">
              <el-form-item label="概要" prop="ExperimentName">
                <el-card>{{newsForm.summary}}</el-card>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="新闻详情"
            prop="NewsDetail"
            class="detail"
          >
            <Tinymce
              id="tinymce"
              :value="newsForm.content"
              placeholder-text="请输入内容"
              @input="WatchExperimentSummary($event)"
            
            />
          </el-form-item >
          <el-button class="btn" type="success" @click="approve">通过</el-button>
          <el-button class="btn" type="danger" @click="un_approve">打回</el-button>
          <el-button class="btn" type="primary" @click="chang">完成</el-button>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script>
  import { reactive, ref, toRefs, onMounted, getCurrentInstance } from 'vue'
  import tool from '@/utils/tool'
  import { useRouter, useRoute } from 'vue-router'
  import api from '@/api/index'
  import tinymce from "tinymce"
  import Tinymce from '@/layout/components/Tinymce.vue'
  import 'tinymce/themes/silver/theme'
  
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
          const { news_id } = route.params
     
          const state = reactive({
              token: tool.data.get('token') || '',
              dialogVisible: false,
              dialogImageUrl: '',
              
              CourseList: [], 
              newsForm: {
                club_name:'',
                title:'',
                create_time:'',
                editor:'',
                content:'',
                summary:''
              },
          })
  
          onMounted(() => {
            getDetail(news_id)
            
          })
  
          // 获取-细节
          const getDetail = (news_id) => {
            const params = {
              user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              news_id:news_id
            }
            api.new.APIDetailAll(params).then((res) => {
                  state.newsForm.club_name=res.data.club_name,
                  state.newsForm.title=res.data.title,
                  state.newsForm.create_time=res.data.create_time,
                  state.newsForm.editor = res.data.editor,
                  state.newsForm.content = res.data.content
                  state.newsForm.summary = res.data.summary
            }).catch((err) => {
              this.$ElMessage.error({
                          message: err
                      })
            })
          }
         //审批-通过
         const approve = () => {
          api.new.APIPick({
            user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              news_id:news_id,
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
          api.new.APIPick({
            user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              news_id:news_id,
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
         //修改
         const chang = () => {
          api.new.APIPick({
            user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              news_id:news_id,
              status:'学校已通过',
              title:state.newsForm.title,
              content:state.newsForm.content
          }).then(()=>{
            proxy.$message.success('修改成功')
            goBack()
          }).catch((err)=>{
            this.$ElMessage.error({
                          message: err
                      })
          })
         }
         const WatchExperimentSummary = item => {
            state.newsForm.content = item
        }
        const goBack = () => {
          router.go(-1)
         }
          return {
              ...toRefs(state),
              getDetail,
              approve,
              un_approve,
              chang,
              WatchExperimentSummary,
              goBack,
              
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
  .detail{
    height: 500px;
  }
  .tiny {
    height: 400px;
  }
  .btn {
    float: right;
    margin: 0 10px;
  }
  </style>
  