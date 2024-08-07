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
        <el-row>
          <a style="font-size: 25px; margin: auto;">标题:{{ title }}</a>
        </el-row>
        <div v-html = "content" ></div>
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
          const { member_appearance_id } = route.params
          const state = reactive({
              token: tool.data.get('token') || '',
              dialogVisible: false,
              dialogImageUrl: '',
              name:'',
              title:'',
              CourseList: [], 
              content:''
          })
  
          onMounted(() => {
            getDetail(member_appearance_id)
            
          })
  
          // 获取-细节
          const getDetail = (member_id) => {
            const params = {
              user_id:localStorage.UserID || '',
              user_type:localStorage.UserType ? 1 : localStorage.UserType,
              m_id:member_id
            }
            api.member.APIDetailMember(params).then((res) => {
                  state.content = res.data.content
                  state.name = res.data.student_name
                  state.title = res.data.title
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
  .btn {
    float: right;
    margin: 0 10px;
  }
  </style>
  