<!-- 社团信息 -->
<template>
    <div>
        <el-card class="box-cl">
            <!-- 搜索栏 -->
            <template #header>
              <el-input v-model="selectClub" maxlength="30"
        style="width: 200px; margin-right: 10px" clearable placeholder="社团名称" @change="handleSearch()"/>
        
       
        <el-select
          v-model="selectCollege"
          class="m-2"
          maxlength="30"
        style="width: 200px; margin-right: 10px" clearable
          placeholder="所属学院"
          size="small"
          @change="handleSearch()"
        >
        <el-option
                      v-for="item in collegeList"
                      :key="item.college_id"
                      :label="item.college_name"
                      :value="item.college_id"
                  />
        </el-select>
        <el-select
          v-model="clubStatus"
          class="m-2"
          maxlength="30"
        style="width: 200px; margin-right: 10px" clearable
          placeholder="社团状态"
          size="small"
          @change="handleSearch()"
        >
          <el-option
            v-for="item in StatusList"
            :key="item.key"
            :label="item.label"
            :value="item.label"

          />
        </el-select>
            <el-button  class="button" :icon="Search" @click="handleSearch()">搜索</el-button>
            <el-button  class="rbutton" :icon="Search" @click="$router.push({
              name:'club_add',
            })">添加社团</el-button>
            </template>
            <!-- 折叠篮 -->
            <el-card v-for="item in ClubList" :key="item.index" >
                <e-card >
                  <div class="block">              
                  <el-image style="width: 150px; height: 150px" :src="item.logo_url" fit="cover" onerror="this.src='http://images.quwancode.com/upload/images/error_image.jpg';"/>
                </div>
                <el-descriptions :title="item.club_name" class="descrip">
                    <el-descriptions-item label="社长">{{item.proprieter_name}}</el-descriptions-item>
                    <el-descriptions-item label="联系方式">{{item.email}}</el-descriptions-item>
                    <el-descriptions-item label="指导老师">{{item.teacher_name}}</el-descriptions-item>
                    <el-descriptions-item label="办公地址">
                    {{item.address}}
                    </el-descriptions-item>
                    <el-descriptions-item label="社团类型"
                      >{{item.category_name}}</el-descriptions-item
                    >
                    <el-descriptions-item label="状态">
                    <el-tag :type="item.status === '待审批' ? '':(item.status === '学校已通过' ? 'success':'danger')">{{item.status}}</el-tag>
                    </el-descriptions-item>
                    
                  </el-descriptions>
                  <el-button type="primary" class="btxq" @click="
                    $router.push({
                      name: 'club_detail',
                      params: { club_id:item.club_id },
                    })">详情</el-button>
                </e-card>
            </el-card>
            <el-pagination
        background
        :hide-on-single-page="true"
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="changePage"
      />
        </el-card>
        
    </div>
</template>
<script>
    import api from '@/api/index'
    import { onMounted, reactive, toRefs, ref } from "vue";
    import { ElMessage, ElMessageBox } from "element-plus";
    export default{
        name:'社团信息',
        setup() {
            const addFormRef = ref(null)
            const state = reactive({
              loading:false,
              ClubList:[],
              CollegeList:[],
              ClubState:[],
              StatusList:[{
                  value:'学校已通过',
                  label:'学校已通过'
                },{
                  value:'被驳回',
                  label:'被驳回'
                },{
                label:'待审批',
                value:'待审批'

                }],
              collegeList:[],
              selectClub:'',
              selectState:'',
              selectType:'',
              selectCollege:'',
              total : 0,
              currentPage: 1,
              pageSize: 10,
              clubStatus:'',
              clubtype:''
            })
            onMounted(() => {
                // getStudentList()
                getClubList()
                collegeType()
             
            })
            //获取社团列表
            const getClubList = () => {
              api.club.APIFetchClubList({
                user_id:localStorage.UserID || '',
                user_type:localStorage.UserType ? 1 :localStorage.UserType,
                page:state.currentPage,
                size:state.pageSize,
                club_name:state.selectClub,
                status:state.selectState,
                college_id:state.selectCollege,
                catgegory_id:state.selectType,
                status:state.clubStatus
              }).then((res) => {
                state.ClubList = res.data
                state.ClubList.forEach(function(element) {
                  if(element.status==="学校已通过"){
                    element['color']='success'
                  }
                  if(element.status==="被驳回"){
                    element['color']='danger'
                  }
                })
                state.total = res.count
                // console.log(state.ClubList)
              }).catch((err) => {
                console.log('ClubList', err)
                ElMessage.error({
                      message:'查询为空'
                  })
              })
            }
           
            //查询
            const handleSearch = () => {
              state.currentPage = 1
              // console.log('selectClub+',state.selectClub)
              getClubList()
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
        const changePage = (val) => {
              state.currentPage = val
              getClubList()
            }
            return{
              ...toRefs(state),
              getClubList,
              handleSearch,
              collegeType,
              changePage
            }
        }
    }
</script>
<style scoped lang="scss">
    .button{
        background-color: #1BAEAE;
        color: white;
    }
    .rbutton{
        float: right;
        background-color: #1BAEAE;
        color: white;
    }
    .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px #DCDFE6;
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}
.demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.descrip{
  display:inline-block ;
  width: 75%;
  margin-top: 25px;
  margin-left: 20px;
}
.btxq{
  float: right;
  margin-bottom: 20px;
}
</style>