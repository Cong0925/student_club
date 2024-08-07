<template>
<div class="clubCenter-main">
    <Affix/>
    <div class="clubCenter" style="padding-top:1%; padding-left:0.25%">
        <div class="left">
            <div class="club_img"><el-avatar shape="circle" :size="100" fit="cover" :src="state.data.logo_url" /></div>
            <div  class="club_name">{{state.data.club_name}}</div>
        </div>
        <div class="club_content">
            <div class="club_info">
                <span>{{state.data.join_count}}人已加入</span>
                <span style="margin-left: 20px;">{{state.data.like_count}}人已关注</span>
                <span style="margin-left: 70%;"><el-button link @click="state.isEdit=true">编辑社团简介</el-button></span>
            </div>
            <div v-if="!state.isEdit" style="margin-top: 10px;height: 430px;" v-html="state.data.description"></div>
            <div v-if="state.isEdit" style="margin-top: 10px;height: 640px;">
                <el-form>
                    <el-form-item label="更换社团logo">
                        <el-upload
                            drag
                            class="avatar-uploader"
                            accept="jpg,jpeg,png,svg,bmp,gif"
                            :http-request="handleUploadPic"
                            :file-list="state.fileList"
                            action=""
                            list-type="picture-card" ><i class="el-icon-plus" />
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="更改社团简介">
                        <Editor :value="state.data.description"
                        placeholder-text=""
                        @input="WatchSummary($event)" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="modifyClubInfo">提交</el-button>
                        <el-button @click="state.isEdit=false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import Affix from '@/components/Affix'
    import Editor from '@/components/Editor'
    import { reactive,onMounted } from 'vue'
    import { apiGetClubDetailInfo,apiModifyClubInfo } from '@/api/club'
    import { getCookies,toast } from '@/utils/tool'
    import { useRoute,useRouter } from "vue-router"
    import { apiPicUpload } from '@/api/RotationPic'
    export default {
        components:{
            Affix,Editor
        },
        setup(){
        const route=useRoute()
        const router=useRouter()
        const state=reactive({
            data:{},
            isEdit:false,
            description:'',
            fileList:[],
            logo_url:''
        })
        const getData = () => {
            apiGetClubDetailInfo({
                club_id:router.currentRoute.value.params.clubId
            })
            .then((res) => {
                state.data=res.data
            })
            .catch((err) => {
                console.log('apiClubSummarydata', err)
                toast(err,'error','Error')
            })
        }
        const modifyClubInfo=()=>{
            apiModifyClubInfo({
                user_id:getCookies('user_id'),
                user_type:0,
                club_id:router.currentRoute.value.params.clubId,
                description:state.description,
                logo_url:state.logo_url
            }).then((res) => {
                if(res.code==2000){
                    toast('修改成功')
                    getData()
                    router.go(0)
                }
                state.isEdit=false
            }).catch((err) => {
                state.isEdit=false
                console.log('apiModifyClubInfo', err)
                toast(err,'error','Error')
            })
        }
        const handleUploadPic = (item) => {
            apiPicUpload({
                user_id:getCookies('user_id'),
                user_type:0,
                pic_file: item.file
            }).then((res) => {
                state.logo_url = res.data.Url
            }).catch((err) => {
                console.log('pic', err)
                toast(err,'error','Error')
            })
        }
        const WatchSummary = item => {
            state.description = item
        }
        onMounted(() => {
            getData()
        })
        return{
        state,handleUploadPic,modifyClubInfo,WatchSummary
        }
    }
    }
</script>

<style scoped>
.left{
    width: 150px;
    float: left;
    /* padding-top: 3%; */
}
.club_img{
    width: 150px;
    height: 100px;
    padding-left: 18%;
}
.club_name{
    height:100px; 
    line-height:30px; 
    font-size:17px; 
    text-align: center;
}
.club_info{
    font-size: 15px;
    color: lightslategray;
    height: 20px;
    line-height: 20px;
    text-align: left;
}
.club_content{
    font-size:17px; 
    width:85%; 
    float:left;
    /* padding: 5%; */
}
</style>