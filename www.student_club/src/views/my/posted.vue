<template>
    <div class="myposted">
        <div style="margin:2%">
            <el-tabs v-model="state.activeName" class="demo-tabs" @tab-click="handleClick" stretch>
                <!-- 活动 -->
                <el-tab-pane label="活动" name="first">
                    <div v-if="state.postActivity == 0">
                        <div class="clubCenterTitle">
                            <el-button circle type="primary" plain icon="Plus" style="margin-left: 95%;"
                                @click="state.postActivity = 1" />
                        </div>
                        <!-- 活动列表 -->
                        <el-table :data="state.activeList" stripe border style="width: 1050px"
                            v-loading="loading.activeListLoading">
                            <el-table-column prop="title" label="活动标题" width="430" />
                            <el-table-column prop="status" label="状态" width="100" />
                            <el-table-column prop="club_name" label="发布社团" width="210" />
                            <el-table-column prop="create_time" label="发布时间" width="170" />
                            <el-table-column label="操作" fixed="right" width="140" align="center">
                                <template #default="scope">
                                    <el-button size="small" link @click="Detail(1, scope.row.activity_id)">详情</el-button>
                                    <el-button size="small" link type="primary" @click="Modify(1, scope.row.activity_id)"
                                        :disabled="scope.row.status === '学校已通过'">修改</el-button>
                                    <el-button size="small" link type="danger"
                                        @click="activeDelete(scope.row.activity_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 发布活动 -->
                    <div v-if="state.postActivity == 1">
                        <el-form ref="activityFormRef" :rules="activityRules" :model="form" label-width="120px">
                            <el-form-item label="所属社团" prop="club_id">
                                <el-select v-model="form.club_id" placeholder="请选择社团">
                                    <el-option v-for="(item, index) in state.myClub" :key="index" :label="item.club_name"
                                        :value="item.club_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="活动名称" prop="title">
                                <el-input v-model="form.title" />
                            </el-form-item>
                            <el-form-item label="最多参与人数" prop="max_attended">
                                <el-input v-model="form.max_attended" label-width="50px" />
                            </el-form-item>
                            <el-form-item label="活动时间" prop="start_time">
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
                            <el-form-item label="活动地点" prop="address">
                                <el-input v-model="form.address" />
                            </el-form-item>
                            <el-form-item label="上传封面" prop="pic_url">
                                <el-upload drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif"
                                    :http-request="handleUploadActivePic" :file-list="state.fileList" action=""
                                    list-type="picture-card"><i class="el-icon-plus" />
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="具体介绍" prop="content">
                                <Editor :value="form.content" placeholder-text="" @input="WatchActiveSummary($event)" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmitActive(activityFormRef)">提交</el-button>
                                <el-button @click="canclePost(activityFormRef, 'first')">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <!-- 新闻 -->
                <el-tab-pane label="新闻" name="second">
                    <div v-if="state.postNew == 0">
                        <div class="clubCenterTitle">
                            <el-button circle type="primary" plain icon="Plus" style="margin-left: 95%;"
                                @click="state.postNew = 1" />
                        </div>

                        <!-- 新闻列表 -->
                        <el-table :data="state.newList" stripe border style="width: 1050px"
                            v-loading="loading.newsListLoading">
                            <el-table-column prop="title" label="新闻标题" width="400" />
                            <el-table-column prop="status" label="状态" width="100" />
                            <el-table-column prop="club_name" label="发布社团" width="190" />
                            <el-table-column prop="publish_time" label="发布时间" width="160" />
                            <el-table-column prop="hits" label="点击" width="60" />
                            <el-table-column label="操作" fixed="right" width="140" align="center">
                                <template #default="scope">
                                    <el-button size="small" link @click="Detail(2, scope.row.news_id)">详情</el-button>
                                    <el-button size="small" link type="primary" @click="Modify(2, scope.row.news_id)"
                                        :disabled="scope.row.status === '学校已通过'">修改</el-button>
                                    <el-button size="small" link type="danger"
                                        @click="newsDelete(scope.row.news_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>


                    </div>
                    <!-- 发布新闻 -->
                    <div v-if="state.postNew == 1">
                        <el-form ref="newsFormRef" :rules="newsRules" :model="newForm" label-width="120px">
                            <el-form-item label="所属社团" prop="club_id">
                                <el-select v-model="newForm.club_id" placeholder="请选择社团">
                                    <el-option v-for="(item, index) in state.myClub" :key="index" :label="item.club_name"
                                        :value="item.club_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="新闻标题" prop="title">
                                <el-input v-model="newForm.title" />
                            </el-form-item>
                            <el-form-item label="新闻概要" prop="summary">
                                <el-input v-model="newForm.summary" />
                            </el-form-item>
                            <el-form-item label="新闻标签" prop="tag">
                                <el-input v-model="newForm.tag" />
                            </el-form-item>
                            <el-form-item label="上传封面" prop="pic_url">
                                <el-upload drag class="avatar-uploader" accept="jpg,jpeg,png,svg,bmp,gif"
                                    :http-request="handleUploadNewsPic" :file-list="state.fileList" action=""
                                    list-type="picture-card"><i class="el-icon-plus" />
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="具体内容" prop="content">
                                <Editor :value="newForm.content" placeholder-text="" @input="WatchNewsSummary($event)" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmitNews(newsFormRef)">提交</el-button>
                                <el-button @click="canclePost(newsFormRef, 'second')">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <!-- 通知 -->
                <el-tab-pane label="通知" name="third">
                    <div v-if="state.postNotice == 0">
                        <div class="clubCenterTitle">
                            <el-button circle type="primary" plain icon="Plus" style="margin-left: 95%;"
                                @click="state.postNotice = 1" />
                        </div>

                        <!-- 通知列表 -->
                        <el-table :data="state.noticeList" stripe border style="width: 1050px"
                            v-loading="loading.noticeListLoading">
                            <el-table-column prop="title" label="通知标题" width="430" />
                            <el-table-column prop="status" label="状态" width="100" />
                            <el-table-column prop="club_name" label="发布社团" width="220" />
                            <el-table-column prop="create_time" label="发布时间" width="160" />
                            <el-table-column label="操作" fixed="right" width="140" align="center">
                                <template #default="scope">
                                    <el-button size="small" link @click="Detail(3, scope.row.notice_id)">详情</el-button>
                                    <el-button size="small" link type="primary" @click="Modify(3, scope.row.notice_id)"
                                        :disabled="scope.row.status === '学校已通过'">修改</el-button>
                                    <el-button size="small" link type="danger"
                                        @click="noticeDelete(scope.row.notice_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>


                    </div>
                    <!-- 发布通知 -->
                    <div v-if="state.postNotice == 1">
                        <el-form ref="noticeFormRef" :rules="noticeRules" :model="noticeForm" label-width="120px">
                            <el-form-item label="所属社团" prop="club_id">
                                <el-select v-model="noticeForm.club_id" placeholder="请选择社团">
                                    <el-option v-for="(item, index) in state.myClub" :key="index" :label="item.club_name"
                                        :value="item.club_id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="通知标题" prop="title">
                                <el-input v-model="noticeForm.title" />
                            </el-form-item>
                            <el-form-item label="具体内容" prop="content">
                                <Editor :value="noticeForm.content" placeholder-text=""
                                    @input="WatchNoticeSummary($event)" />
                            </el-form-item>
                            <el-form-item label="上传附件" prop="file_info">
                                <el-upload action="" ref="file" class="upload-demo" :on-change="handleEmployeeImgUrlChange"
                                    :auto-upload="false" multiple :on-remove="handleEmployeeImgUrlRemove" limit="">
                                    <el-button type="primary" style="margin-left:20px">点击上传</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmitNotice(noticeFormRef)">提交</el-button>
                                <el-button @click="canclePost(noticeFormRef, 'third')">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="pagination-wrapper">
            <el-pagination v-if="state.activeName === 'first' && state.postActivity == 0" background
                class="footer_pagination" :hide-on-single-page="false" layout="prev, pager, next"
                :total="paging.activeTotal" :page-size="paging.pageSize" :current-page="paging.activeCurrentPage"
                @current-change="changeActivePage" />
            <el-pagination v-if="state.activeName === 'second' && state.postNew == 0" background class="footer_pagination"
                :hide-on-single-page="false" layout="prev, pager, next" :total="paging.newsTotal"
                :page-size="paging.pageSize" :current-page="paging.newsCurrentPage" @current-change="changeNewsPage" />
            <el-pagination v-if="state.activeName === 'third' && state.postNotice == 0" background class="footer_pagination"
                :hide-on-single-page="false" layout="prev, pager, next" :total="paging.noticeTotal"
                :page-size="paging.pageSize" :current-page="paging.noticeCurrentPage" @current-change="changeNoticePage" />
        </div>

    </div>
    <el-dialog v-model="state.dialogVisible" title="确认" width="30%">
        <span>确认删除该条记录？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="state.dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirm()" :loading="loading.delLoading">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import Editor from '@/components/Editor'
import { reactive, onMounted, ref } from 'vue'
import { apiGetMyPostedActivities, apiGetMyPostedNews, apiGetMyPostedNotices } from '@/api/club'
import { apiPublishNotice, apiDeleteMyNotice } from '@/api/notice'
import { apiPublishNews, apiDeleteMyNews } from '@/api/news'
import { apiPublishActivity, apiDeleteActivity } from '@/api/activity'
import { apiPicUpload, apiFileUpload } from '@/api/RotationPic'
import { apiApplyMemberAppearance, apiGetMyMemberAppearance } from '@/api/member'
import { apiGetMyJoinClubs } from '@/api/studentInfo'
import { getCookies, toast } from '@/utils/tool'
import { useRoute, useRouter } from "vue-router"
import { Plus, Management, Flag, PhoneFilled, Stamp } from '@element-plus/icons-vue'
export default {
    components: {
        Editor
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const activityFormRef = ref()
        const activityRules = {
            club_id: [
                { required: true, message: '请选择社团', trigger: 'blur' }
            ],
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            max_attended: [
                { required: true, message: '请输入最大人数', trigger: 'blur' }
            ],
            start_time: [
                { required: true, message: '请选择时间', trigger: 'blur' }
            ],
            address: [
                { required: true, message: '请输入活动地址', trigger: 'blur' }
            ],
            pic_url: [
                { required: true, message: '请上传图片', trigger: 'blur' }
            ],
            content: [
                { required: true, message: '请输入活动内容', trigger: 'blur' }
            ],
        }

        const newsFormRef = ref()
        const newsRules = {
            club_id: [
                { required: true, message: '请选择社团', trigger: 'blur' }
            ],
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            summary: [
                { required: true, message: '请输新闻概要', trigger: 'blur' }
            ],
            tag: [
                { required: true, message: '请输入标签', trigger: 'blur' }
            ],
            pic_url: [
                { required: true, message: '请上传文件', trigger: 'blur' }
            ],
            content: [
                { required: true, message: '请输入新闻内容', trigger: 'blur' }
            ],
        }
        const checkfile = () => {
            // console.log(state.file_info, state.file_info.length)
            if (state.file_info) return true
            else return false
        }

        const noticeFormRef = ref()
        const noticeRules = {
            club_id: [
                { required: true, message: '请选择社团', trigger: 'blur' }
            ],
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            file_info: [
                { required: true, validator: checkfile, message: '请上传文件', trigger: 'blur' }
            ],
            content: [
                { required: true, message: '请输入新闻内容', trigger: 'blur' }
            ],
        }

        const loading = reactive({
            delLoading: false,
            activeListLoading: false,
            activeAddLoading: false,

            newsListLoading: false,
            newsAddLoading: false,

            noticeListLoading: false,
            noticeAddLoading: false,
        })
        const state = reactive({
            postActivity: 0,
            postNew: 0,
            postNotice: 0,
            postAppearance: 0,
            activeName: 'first', //Tabs标签
            collapseActiveName: 0, //折叠面板
            collapseNewsName: 0, //折叠面板
            collapseNoticeName: 0, //折叠面板
            activeList: [],
            newList: [],
            noticeList: [],
            myMemberAppearanceList: [],
            fileList: [],
            // 文件
            fileName: '',
            file_info: '',
            myClub: [],
            dialogVisible: false,
            delete_id: '',
            delete_size: ''
        })
        const paging = reactive({
            pageSize: 9,
            activeTotal: '',
            activeCurrentPage: 1,
            noticeTotal: '',
            noticeCurrentPage: 1,
            newsTotal: '',
            newsCurrentPage: 1,
        })
        // 获取我的社团
        const getMyClub = () => {
            apiGetMyJoinClubs({
                user_id: getCookies('user_id'),
                user_type: 0
            }).then(res => {
                state.myClub = res.data
            }).catch(err => {
                console.log(err);
            })
        }
        // 活动参数
        const form = reactive({
            user_id: '',
            user_type: 0,
            club_id: '',
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
        // 提交活动申请
        const onSubmitActive = async (activityFormRef) => {
            await activityFormRef.validate(async (valid, fields) => {
                if (valid) {
                    form.user_id = getCookies('user_id')
                    form.principal_id = getCookies('user_id')
                    form.editor = getCookies('user_name')
                    await apiPublishActivity(form).then(res => {
                        toast('已申请')
                        state.postActivity = 0
                    }).catch(err => {
                        console.log('apiPublishActivity', err);
                        toast(err, 'error', 'Error')
                    })
                    getMyPostedActivities()
                } else {
                    console.log('error submit!!');
                    return false
                }
            });

        }
        // 提交活动图片
        const handleUploadActivePic = (item) => {
            apiPicUpload({
                user_id: getCookies('user_id'),
                user_type: 0,
                pic_file: item.file
            }).then((res) => {
                // 如果是本地服务器存储的话，Url不为空；
                // newForm.pic_url = res.data.Url
                //     ? res.data.Url
                //     : res.data.httpUrl
                form.pic_url = res.data.Url
            }).catch((err) => {
                console.log('pic', err)
                toast(err, 'error', 'Error')
            })
        }
        // 删除活动 参数
        const activeDelete = (id) => {
            state.delete_size = 1
            state.dialogVisible = true
            state.delete_id = id
        }
        // 新闻参数
        const newForm = reactive({
            user_id: '',
            user_type: 0,
            club_id: '',
            title: '',
            summary: '',
            content: '',
            tag: '',
            editor: '',
            pic_url: ''
        })
        // 提交申请新闻
        const onSubmitNews = async (newsFormRef) => {
            await newsFormRef.validate(async (valid, fields) => {
                if (valid) {
                    newForm.user_id = getCookies('user_id')
                    newForm.editor = getCookies('user_name')
                    await apiPublishNews(newForm).then(res => {
                        toast('已申请')
                        state.postNew = 0

                    }).catch(err => {
                        console.log('apiPublishNews', err);
                        toast(err, 'error', 'Error')
                    })
                    getMyPostedNews()
                } else {
                    console.log('error submit!!');
                    return false
                }
            });

        }
        // 新闻删除参数
        const newsDelete = (id) => {
            state.delete_size = 2
            state.dialogVisible = true
            state.delete_id = id
        }
        // 新闻 上传图片
        const handleUploadNewsPic = (item) => {
            apiPicUpload({
                user_id: getCookies('user_id'),
                user_type: 0,
                pic_file: item.file
            }).then((res) => {
                // 如果是本地服务器存储的话，Url不为空；
                // newForm.pic_url = res.data.Url
                //     ? res.data.Url
                //     : res.data.httpUrl
                newForm.pic_url = res.data.Url
            }).catch((err) => {
                console.log('pic', err)
                toast(err, 'error', 'Error')
            })
        }
        // 通知参数
        const noticeForm = reactive({
            user_id: '',
            user_type: 0,
            club_id: '',
            title: '',
            content: '',
            editor: '',
            file_info: ''
        })
        // 通知 文件上传
        const handleEmployeeImgUrlChange = (File) => {
            state.fileName = File.raw.name
            apiFileUpload({
                file: File.raw,
                user_id: getCookies('user_id'),
                user_type: 0
            }).then(res => {
                // console.log(res, state.file_info)
                if (state.file_info == '') {
                    state.file_info = { "file_info": [{ "file_url": res.data.httpUrl, "file_name": state.fileName }] }
                } else {
                    let file_info_item = { "file_url": res.data.httpUrl, "file_name": state.fileName }
                    state.file_info.file_info.push(file_info_item)
                }
                toast(res.message)
            }).catch((err) => {
                toast(err, 'error', 'Error')
                console.log(err);
            })
        };
        // 提交通知申请
        const onSubmitNotice = async (noticeFormRef) => {
            await noticeFormRef.validate(async (valid, fields) => {
                if (valid) {
                    noticeForm.file_info = JSON.stringify(state.file_info)
                    noticeForm.user_id = getCookies('user_id')
                    noticeForm.editor = getCookies('user_name')
                    await apiPublishNotice(noticeForm).then(res => {
                        toast('已申请')
                        state.postNotice = 0
                        state.file_info = ''
                    }).catch(err => {
                        console.log('apiPublishNotice', err);
                        toast(err, 'error', 'Error')
                    })
                    getMyPostedNotices()
                } else {
                    console.log('error submit!!');
                    return false
                }
            });

        }
        // 通知删除参数
        const noticeDelete = (id) => {
            state.delete_size = 3
            state.dialogVisible = true
            state.delete_id = id
        }
        // 成员风采
        // const appearanceForm = reactive({
        //     user_id: '',
        //     user_type: 0,
        //     club_id: '',
        //     pic_url: '',
        //     content: ''
        // })
        // const handleUploadAppearancePic = (item) => {
        //     apiPicUpload({
        //         user_id: getCookies('user_id'),
        //         user_type: 0,
        //         pic_file: item.file
        //     }).then((res) => {
        //         appearanceForm.pic_url = res.data.Url
        //     }).catch((err) => {
        //         console.log('pic', err)
        //         toast(err, 'error', 'Error')
        //     })
        // }
        // const onSubmitAppearance = () => {
        //     appearanceForm.user_id = getCookies('user_id')
        //     appearanceForm.club_id = route.query.club_id
        //     console.log(appearanceForm);
        //     apiApplyMemberAppearance(appearanceForm).then(res => {
        //         toast('已申请')
        //         state.postAppearance = 0
        //     }).catch(err => {
        //         console.log('apiApplyMemberAppearance', err);
        //         toast(err, 'error', 'Error')
        //     })
        // }
        // 获取发布的活动列表
        const getMyPostedActivities = async () => {
            loading.activeListLoading = true
            await apiGetMyPostedActivities({
                user_id: getCookies('user_id'),
                user_type: 0,
                size: paging.pageSize,
                page: paging.activeCurrentPage,
            })
                .then((res) => {
                    state.activeList = res.data
                    paging.activeTotal = res.count
                })
                .catch((err) => {
                    console.log('apiGetMyPostedActivities', err)
                    toast(err, 'error', 'Error')
                })
            loading.activeListLoading = false
        }
        const changeActivePage = (val) => {
            paging.activeCurrentPage = val
            getMyPostedActivities()
        }
        // 获取发布的新闻列表
        const getMyPostedNews = async () => {
            loading.newsListLoading = true
            await apiGetMyPostedNews({
                user_id: getCookies('user_id'),
                user_name: getCookies('user_name'),
                user_type: 0,
                size: paging.pageSize,
                page: paging.newsCurrentPage
            })
                .then((res) => {
                    state.newList = res.data
                    paging.newsTotal = res.count
                })
                .catch((err) => {
                    console.log('apiGetMyPostedNews', err)
                    toast(err, 'error', 'Error')
                })
            loading.newsListLoading = false
        }
        const changeNewsPage = (val) => {
            paging.newsCurrentPage = val
            getMyPostedNews()
        }
        // 获取发布的通知列表
        const getMyPostedNotices = async () => {
            loading.noticeListLoading = true
            await apiGetMyPostedNotices({
                user_id: getCookies('user_id'),
                user_name: getCookies('user_name'),
                user_type: 0,
                size: paging.pageSize,
                page: paging.noticeCurrentPage,
                //   status:'学校已通过'
            })
                .then((res) => {
                    state.noticeList = res.data
                    paging.noticeTotal = res.count
                })
                .catch((err) => {
                    console.log('apiGetMyPostedNotices', err)
                    toast(err, 'error', 'Error')
                })
            loading.noticeListLoading = false
        }
        const changeNoticePage = (val) => {
            paging.noticeCurrentPage = val
            getMyPostedNotices()
        }
        // 获取我的成员风采列表
        const getMyMemberAppearance = () => {
            apiGetMyMemberAppearance({
                user_id: getCookies('user_id'),
                user_type: 0
            })
                .then((res) => {
                    state.myMemberAppearanceList = res.data
                })
                .catch((err) => {
                    console.log('apiGetMyMemberAppearance', err);
                    toast(err, 'error', 'Error')
                })
        }
        // 实现富文本框的双向数据绑定
        const WatchActiveSummary = item => {
            form.content = item
        }
        const WatchNewsSummary = item => {
            newForm.content = item
        }
        const WatchNoticeSummary = item => {
            noticeForm.content = item
        }
        const WatchAppearanceSummary = item => {
            appearanceForm.content = item
        }
        // 删除
        const confirm = () => {
            loading.delLoading = true
            if (state.delete_size == 1) {
                apiDeleteActivity({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    activity_id: state.delete_id
                }).then((res) => {
                    state.dialogVisible = false
                    toast('删除成功')
                    loading.delLoading = false

                    getMyPostedActivities()
                }).catch((err) => {
                    state.dialogVisible = false
                    console.log('apiDeleteActivity', err)
                    toast(err, 'error', 'Error')
                })
            } else if (state.delete_size == 2) {
                apiDeleteMyNews({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    news_id: state.delete_id
                }).then((res) => {
                    state.dialogVisible = false
                    toast('删除成功')
                    loading.delLoading = false

                    getMyPostedNews()
                }).catch((err) => {
                    state.dialogVisible = false
                    console.log('apiDeleteMyNews', err)
                    toast(err, 'error', 'Error')
                })
            } else if (state.delete_size == 3) {
                apiDeleteMyNotice({
                    user_id: getCookies('user_id'),
                    user_type: 0,
                    notice_id: state.delete_id
                }).then((res) => {
                    state.dialogVisible = false
                    toast('删除成功')
                    loading.delLoading = false

                    getMyPostedNotices()
                }).catch((err) => {
                    state.dialogVisible = false
                    console.log('apiDeleteMyNews', err)
                    toast(err, 'error', 'Error')
                })
            }
            state.delete_size = ''
            state.delete_id = ''
        }
        const canclePost = (formRef, activeName) => {
            if (activeName === 'first') {
                formRef.resetFields()
                state.postActivity = 0
            }
            if (activeName === 'second') {
                formRef.resetFields()
                state.postNew = 0
            }
            if (activeName === 'third') {
                formRef.resetFields()
                state.postNotice = 0
            }
        }
        // 详情
        const Detail = (size, id) => {
            router.push({ name: "MyDetail", params: { detailSize: size, detailId: id }, })
        }
        // 修改
        const Modify = (size, id) => {
            router.push({ name: "MyModify", params: { modifySize: size, modifyId: id }, })
        }
        // 预加载
        onMounted(() => {
            if (route.query.activeTabName) {
                state.activeName = route.query.activeTabName
            }
            getMyPostedActivities()
            getMyPostedNews()
            getMyPostedNotices()
            getMyClub()
        })
        return {
            state, paging,
            form,
            newForm,
            noticeForm,
            // appearanceForm, onSubmitAppearance, handleUploadAppearancePic,
            onSubmitNotice, onSubmitNews, onSubmitActive,
            handleUploadNewsPic, handleUploadActivePic,
            WatchActiveSummary, WatchNewsSummary, WatchNoticeSummary, WatchAppearanceSummary,
            handleEmployeeImgUrlChange,
            changeActivePage, changeNewsPage, changeNoticePage,
            activeDelete, newsDelete, noticeDelete, confirm,
            Detail, Modify,
            loading, canclePost,
            activityFormRef,
            activityRules,
            newsFormRef,
            newsRules,

            noticeFormRef,
            noticeRules,

        }
    }

}
</script>

<style scoped>
.myposted {
    position: relative;
}

.pagination-wrapper {
    position: absolute;
    top: 530px;
    margin-left: 2%;
}
</style>