<template>
    <div class="main">
        <!-- 修改我发布的活动 -->
        <div v-if="$route.params.modifySize == 1">
            <el-form :model="form" label-width="120px" v-loading="loading.activityFormLoading">
                <el-form-item label="所属社团">
                    {{ state.club_name }}
                </el-form-item>
                <el-form-item label="活动名称">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="最多参与人数">
                    <el-input v-model="form.max_attended" label-width="50px" />
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-col :span="11">
                        <el-date-picker v-model="form.start_time" type="datetime" placeholder="Pick a date"
                            style="width: 100%" format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s" />
                    </el-col>
                    <el-col :span="2" class="text-center">
                        <span class="text-gray-500">-</span>
                    </el-col>
                    <el-col :span="11">
                        <el-date-picker v-model="form.end_time" type="datetime" placeholder="Pick a time"
                            style="width: 100%" format="YYYY/MM/DD hh:mm:ss" value-format="YYYY-MM-DD h:m:s" />
                    </el-col>
                </el-form-item>
                <el-form-item label="活动地点">
                    <el-input v-model="form.address" />
                </el-form-item>
                <el-form-item label="重新上传封面">
                    <el-upload drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif"
                        :http-request="handleUploadActivePic" :file-list="state.fileList" action=""
                        list-type="picture-card"><i class="el-icon-plus" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="具体介绍">
                    <Editor :value="form.content" placeholder-text="" @input="WatchActiveSummary($event)" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitActive">修改</el-button>
                    <el-button @click="returnActivityList()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 修改我发布的新闻 -->
        <div v-if="$route.params.modifySize == 2">
            <el-form :model="newForm" label-width="120px" v-loading="loading.newsFormLoading">
                <el-form-item label="所属社团">
                    {{ state.club_name }}
                </el-form-item>
                <el-form-item label="新闻标题">
                    <el-input v-model="newForm.title" />
                </el-form-item>
                <el-form-item label="新闻概要">
                    <el-input v-model="newForm.summary" />
                </el-form-item>
                <!-- <el-form-item label="新闻标签">
                <el-input v-model="newForm.tag"/>
                </el-form-item> -->
                <el-form-item label="编辑人">
                    <el-input v-model="newForm.editor" />
                </el-form-item>
                <el-form-item label="重新上传封面">
                    <el-upload drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif"
                        :http-request="handleUploadNewsPic" :file-list="state.fileList" action=""
                        list-type="picture-card"><i class="el-icon-plus" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="具体内容">
                    <Editor :value="newForm.content" placeholder-text="" @input="WatchNewsSummary($event)" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitNews">修改</el-button>
                    <el-button @click="returnNewsList()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 修改我发布的通告 -->
        <div v-if="$route.params.modifySize == 3">
            <el-form :model="noticeForm" label-width="120px" v-loading="loading.noticeFormLoading">
                <el-form-item label="所属社团">
                    {{ state.club_name }}
                </el-form-item>
                <el-form-item label="通知标题">
                    <el-input v-model="noticeForm.title" />
                </el-form-item>
                <el-form-item label="编辑人">
                    <el-input v-model="noticeForm.editor" />
                </el-form-item>
                <el-form-item label="具体内容">
                    <Editor :value="noticeForm.content" placeholder-text="" @input="WatchNoticeSummary($event)" />
                </el-form-item>
                <el-form-item label="上传附件">
                    <el-upload action="" ref="file" class="upload-demo" :on-change="handleEmployeeImgUrlChange"
                        :auto-upload="false" multiple :on-remove="handleEmployeeImgUrlRemove" limit="1">
                        <el-button type="primary" style="margin-left:20px">重新上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitNotice">修改</el-button>
                    <el-button @click="returnNoticeList()">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 对话框 -->
        <el-dialog v-model="state.visible" :show-close="false" style="width: 30%;top: 20vh;">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    警告，您无权限进行此项操作！
                </div>
            </template>
            <div @click="$router.go(-1)" style="color: #409EFF;cursor: pointer;">点击此处返回</div>
        </el-dialog>
    </div>
</template>
  
<script>
import Editor from '@/components/Editor'
import { onMounted, reactive } from 'vue'
import { apiMyActivityDetail, apiModifyMyActivity } from '@/api/activity'
import { useRoute, useRouter } from 'vue-router'
import { getCookies, toast } from '@/utils/tool'
import { apiMyNewsDetail, apiModifyMyNews } from '@/api/news'
import { apiMyNoticeDetail, apiModifyMyNotice } from '@/api/notice'
import { apiPicUpload, apiFileUpload } from '@/api/RotationPic'
export default {
    components: {
        Editor
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const loading = reactive({
            activityFormLoading: false,
            newsFormLoading: false,
            noticeFormLoading: false,
        })
        const state = reactive({
            fileList: [],
            myClub: [],
            club_name: '',
            visible: false
        })
        const form = reactive({
            user_id: '',
            user_type: 0,
            activity_id: route.params.modifyId,
            title: '',
            max_attended: '',
            start_time: '',
            end_time: '',
            address: '',
            principal_id: '',
            content: '',
            file_info: '',
            pic_url: ''
        })
        // 重新上传 活动图片
        const handleUploadActivePic = (item) => {
            apiPicUpload({
                user_id: getCookies('user_id'),
                user_type: 0,
                pic_file: item.file
            }).then((res) => {
                form.pic_url = res.data.Url
            }).catch((err) => {
                console.log('pic', err)
                toast(err, 'error', 'Error')
            })
        }
        // 提交活动修改
        const onSubmitActive = async () => {
            form.user_id = getCookies('user_id')
            form.principal_id = getCookies('user_id')
            await apiModifyMyActivity(form).then(res => {
                toast(res.message)
            }).catch(err => {
                console.log('apiModifyMyActivity', err);
                toast(err, 'error', 'Error')
            })
            router.replace({ name: "MyPosted", query: { activeTabName: 'first' } })
        }
        const newForm = reactive({
            user_id: '',
            user_type: 0,
            news_id: route.params.modifyId,
            title: '',
            summary: '',
            content: '',
            tag: '',
            editor: '',
            pic_url: ''
        })
        // 提交 新闻修改
        const onSubmitNews = async () => {
            newForm.user_id = getCookies('user_id')
            await apiModifyMyNews(newForm).then(res => {
                toast(res.message)
            }).catch(err => {
                console.log('apiModifyMyNews', err);
                toast(err, 'error', 'Error')
            })
            router.replace({ name: "MyPosted", query: { activeTabName: 'second' } })
        }
        const noticeForm = reactive({
            user_id: '',
            user_type: 0,
            notice_id: route.params.modifyId,
            title: '',
            content: '',
            editor: '',
            file_info: ''
        })
        // 
        const handleEmployeeImgUrlChange = (File) => {
            state.fileName = File.raw.name
            apiFileUpload({
                file: File.raw,
                user_id: getCookies('user_id'),
                user_type: 0
            }).then(res => {
                state.file_info = { "file_info": [{ "file_url": res.data.httpUrl, "file_name": state.fileName }] }
                noticeForm.file_info = JSON.stringify(state.file_info)
                toast(res.message)
            }).catch((err) => {
                toast(err, 'error', 'Error')
            })
        };
        // 提交 通知修改
        const onSubmitNotice = async () => {
            noticeForm.user_id = getCookies('user_id')
            await apiModifyMyNotice(noticeForm).then(res => {
                toast(res.message)
            }).catch(err => {
                console.log('apiModifyMyNotice', err);
                toast(err, 'error', 'Error')
            })
            router.replace({ name: "MyPosted", query: { activeTabName: 'third' } })
        }
        // 返回我的发布列表
        const returnActivityList = () => {
            router.replace({ name: "MyPosted", query: { activeTabName: 'first' } })
        }
        const returnNewsList = () => {
            router.replace({ name: "MyPosted", query: { activeTabName: 'second' } })
        }
        const returnNoticeList = () => {
            router.replace({ name: "MyPosted", query: { activeTabName: 'third' } })
        }
        // 获取信息
        const getDetail = async () => {
            // 活动
            if (route.params.modifySize == 1) {
                loading.activityFormLoading = true
                await apiMyActivityDetail({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    activity_id: route.params.modifyId
                })
                    .then((res) => {
                        if (res.code == 4000) {
                            state.visible = true
                        }
                        state.club_name = res.data.club_name
                        form.title = res.data.title
                        form.start_time = res.data.start_time
                        form.end_time = res.data.end_time
                        form.address = res.data.address
                        form.content = res.data.content
                        form.max_attended = res.data.max_attended
                    })
                    .catch((err) => {
                        console.log('apiGetActivitiyDetail', err)
                        toast(err, 'error', 'Error')
                    })
                loading.activityFormLoading = false
            }
            // 新闻
            else if (route.params.modifySize == 2) {
                loading.newsFormLoading = true
                await apiMyNewsDetail({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    news_id: route.params.modifyId
                })
                    .then((res) => {
                        if (res.code == 4000) {
                            state.visible = true
                        }
                        newForm.content = res.data.content
                        state.club_name = res.data.club_name
                        newForm.editor = res.data.editor
                        newForm.title = res.data.title
                        newForm.summary = res.data.summary
                    })
                    .catch((err) => {
                        console.log('apiGetNewsDetail', err)
                        toast(err, 'error', 'Error')
                    })
                loading.newsFormLoading = false
            }
            // 通告
            else if (route.params.modifySize == 3) {
                loading.noticeFormLoading = true
                await apiMyNoticeDetail({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    notice_id: route.params.modifyId
                })
                    .then((res) => {
                        if (res.code == 4000) {
                            state.visible = true
                        }
                        state.club_name = res.data.club_name
                        noticeForm.title = res.data.title
                        noticeForm.editor = res.data.editor
                        noticeForm.content = res.data.content
                    })
                    .catch((err) => {
                        console.log('apiGetNoticeDetail', err)
                        toast(err, 'error', 'Error')
                    })
                loading.noticeFormLoading = false
            }
        }
        const WatchActiveSummary = item => {
            form.content = item
        }
        const WatchNewsSummary = item => {
            newForm.content = item
        }
        const WatchNoticeSummary = item => {
            noticeForm.content = item
        }
        // 预加载
        onMounted(() => {
            getDetail()
        })
        return {
            state, form, newForm, noticeForm,
            handleUploadActivePic, onSubmitActive,
            onSubmitNews,
            handleEmployeeImgUrlChange, onSubmitNotice,
            WatchActiveSummary, WatchNewsSummary, WatchNoticeSummary,
            loading, returnActivityList, returnNewsList, returnNoticeList

        }
    }
}
</script>
  
<style scoped>
.main {
    width: 1100px;
    margin-top: 15px;
}
</style>