<template>
  <div>
    <div class="welcome">
      <span>
        {{ Name }}
      </span>
      <span v-if="UserType==1">管理员</span>
      <span v-else-if="UserType==2">老师</span>
      <span v-else-if="UserType==3">管理员</span>
      您好，欢迎登录学生社团管理系统！
      <span>
        {{ Time.toLocaleDateString() }}
      </span>

      <span v-if="Time.getDay()==1"> 星期一</span>
      <span v-else-if="Time.getDay()==2"> 星期二</span>
      <span v-else-if="Time.getDay()==3"> 星期三</span>
      <span v-else-if="Time.getDay()==4"> 星期四</span>
      <span v-else-if="Time.getDay()==5"> 星期五</span>
      <span v-else-if="Time.getDay()==6"> 星期六</span>
      <span v-else-if="Time.getDay()==7"> 星期日</span>
    </div>

    <el-card class="statistics">
      <div class="title">
        待处理任务
      </div>
      <div class="info" >
        <div class="info-item" @click="handleJump('/information_manage/club_information')">
          <div class="item">
            <li style="list-style:none;margin-left:25px">{{ ClubNews }}</li>
            <div class="header">
              社团新闻
            </div>
          </div>
          <div class="icon">
            <img src="../../assets/icon/news.png" alt="">
          </div>
        </div>

        <div class="info-item" @click="handleJump('/notice')">
          <div class="item">
            <li style="list-style:none;margin-left:25px">{{ ClubNotice }}</li>
            <div class="header">
              通知公告
            </div>
            
          </div>
          <div class="icon" >
            <img src="../../assets/icon/notice.png" alt="">
          </div>
        </div>

        <div class="info-item" @click="handleJump('/activities/list')">
          <div class="item">
            <li style="list-style:none;margin-left:25px">{{  ClubActivity }}</li>
            <div class="header">
              社团活动
            </div>
            
          </div>
          <div class="icon" >
            <img src="../../assets/icon/activity.png" alt="">
          </div>
        </div>

        <div class="info-item" @click="handleJump('/club_manage/clubInfo')">
          <div class="item">
            <li style="list-style:none;margin-left:25px">{{ ClubMessage }}</li>      
            <div class="header">
              社团信息
            </div>
            </div>
            <div class="icon">
            <img src="../../assets/icon/message.png" alt="">
          </div>
        </div>
      
        </div>
    </el-card>
    <el-card class="experiment">
      <div class="title">
        申请项目统计
      </div>
      <div class="info">
        <div id="customerChart" v-if="isShowEcharts" :style="{width: '700px', height: '400px'}" />
      </div>
    </el-card>
   
  </div>
</template>

<script>
// import { inject, onMounted, reactive, toRefs } from 'vue'
import { onMounted, reactive, toRefs, onBeforeUpdate,ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/api/index'
import * as echarts from 'echarts'
// import { setTimeout } from 'timers/promises'

export default {
    name: 'Index',
    data() {
        return {
        }
    },
    setup() {
        // const echarts = inject('ec')// 引入
        const router = useRouter()
        let isShowEcharts = ref(true)
        let isLogin = ref(true)
        const state = reactive({
            // 顶部欢迎条
            Time: new Date(),
            Name: localStorage.Name ? localStorage.Name.replace(/"/g, '') : '', // 去除localStorage自带的双引号
            UserType: localStorage.UserType ? 1 : localStorage.UserType,

            // 各种统计数据
            ClubNews: '',
            ClubNotice: '',
            ClubActivity: '',
            ClubMessage: '',
            EventList: [],

            // 图表数据
            monthList:[],
            activitiesList:[],
            newsList:[],
            clubInfoList:[],
            nameList:['社团公告','通知公告','社团活动']
        })
        //获取待处理任务
        const getEvnetList = () => {
          state.loading = true
          api.dashboard.getIncompletetaskAdmin({
            user_id:localStorage.UserID,
            user_type:localStorage.UserType
          }).then((res) => {
            if (res.data === 4001 ){
              isLogin = false
              return
            }else{
            state.ClubNews = res.data[0].News_count,
            state.ClubActivity = res.data[0].Activity_count,
            state.ClubNotice = res.data[0].Notice_count,
            state.ClubMessage = res.data[0].ClubInfo_count
            getClubDataList()
          }
          }).catch((err) => {
            console.log('ClubMessage ',err)
            ElMessage.error({
              message: err
            })
          })
          state.loading = false
        }
        //获取图表信息
        const getClubDataList = () => {
          const params = {
            user_id:localStorage.UserID,
            user_type:localStorage.UserType
          }
          api.dashboard.getClubDataList(params).then((res) => {
            state.monthList = Object.keys(res.data.activity)
            state.activitiesList = Object.values(res.data.activity)
            state.newsList = Object.values(res.data.news)
            state.clubInfoList = Object.values(res.data.clubinfo)
            // console.log('m',state.monthList,'a',state.activitiesList,'n',state.newsList,'c',state.clubInfoList)
            initChart()
          }).catch((err) => {
            console.log('ClubMessage ',err)
            ElMessage.error({
              message: err
            })
          })
        }
       
        //绘制图表
        const initChart = () => {
            
            var myChart = echarts.init(document.getElementById('customerChart'))
            // console.log('aa',state.clubInfoList)
            myChart.setOption({
                title: {
                    text: ''
                },
                legend: {
                    data: ['社团公告','通知公告','社团活动']
                },
                tooltip: {
                    trigger: 'item'
                },
                xAxis: {
                    type: 'category',   // 还有其他的type，可以去官网喵两眼哦
                    data: state.monthList,   // x轴数据
                    name: '时间',   // x轴名称
                    // x轴名称样式
                    nameTextStyle: {
                    fontWeight: 600,
                    fontSize: 18
                    }
                  },
                  yAxis: {
                    type: 'value',
                    name: '数量',   // y轴名称
                    // y轴名称样式
                    nameTextStyle: {
                      fontWeight: 600,
                      fontSize: 18
                    }
                  },
                  tooltip: {
                    trigger: 'axis'   // axis   item   none三个值
                  },

                series:[
                  {
                    name:'社团公告',
                    data:state.clubInfoList,
                    type:'line',
                    
                  },
                  {
                    name:'通知公告',
                    data:state.newsList,
                    type:'line',
                   
                  },{
                    name:'社团活动',
                    data:state.activitiesList,
                    type:'line',
                   
                  }
                ]
            })
            window.onresize = function() { // 自适应大小
                myChart.resize()
            }
        }

        const handleJump = (address) => {
            router.push({ path: address })
        }
        onMounted(() => {
            // getClubDataList()
            getEvnetList()
            // setTimeout("initChart",500)
            // initChart()
        })
        
       
        return {
            isShowEcharts,
            ...toRefs(state),
            getEvnetList,
            handleJump,
            initChart,
            getClubDataList,

            
        }
    }
}
</script>

<style lang="scss" scoped>

  .title{
    font-size: 20px;
    font-weight: 500;
    padding: 0 20px;
    border-left: 7px solid #4095E5;
    margin-bottom: 18px;
  }
  .welcome{
    margin: 10px 20px;
  }

  .statistics {
    margin: 10px;
    .info{
      display: flex;
      .info-item {
        flex: 1;
        margin-right: 20px;
        background-color: #FFFFFF;
        // border-radius:15px;
        box-shadow: 2px 2px 2px 2px #ccc;
        padding: 15px;
        font-size: 20px;
        .icon{
          width: 80px;
          line-height: 100%;
          float: right;
          img{
            width: 100%;
          }
        }
        .item{
          float: left;
          margin: 10px;
          .header{
            padding-bottom: 5px;
            margin-bottom: 5px;
            border-bottom: 1px solid #ccc;
            text-decoration-line: none;
          }
        }
      }
      .item:last-child{
        margin-right: 0;
      }
    }
  }
  .navigation{
    float: left;
    margin: 10px;
    width: 500px;
    .info{
      .info-item{
        float: left;
        text-align: center;
        margin: 5px;
        .Pic{
          width: 50px;
          height: 50px;
          padding:5px;
          margin: 10px;
          border-radius: 10px;
          background-color: #4095E5;
          text-align: center;
          line-height: 50px;
          i{
            font-size: 50px;
            color: #fff;
          }
        }
        .Pic :hover{
          width: 50px;
          height: 50px;
          padding:5px;
          border-radius: 10px;
          background-color: #4095E5;
          text-align: center;
          line-height: 50px;
          i{
            font-size: 50px;
            color: #fff;
          }
        }
      }
    }
  }
  .experiment{
    float: left;
    margin: 10px auto;
    .info{
      display: flex;
      .info-item{
        flex: 1;
        float: left;
        text-align: center;
        margin: 5px;
      }
    }
  }

</style>
