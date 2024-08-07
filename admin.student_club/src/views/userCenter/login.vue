<template>
	<div class="login_bg">
		<div class="login_container">
			<div class="login_body">

				<div class="login-form">
					<div class="login-logo">
						<img class="logo" :alt="$CONFIG.APP_NAME" :src="logo">
						<h2>用户登录</h2>
					</div>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" size="large">
						<el-form-item prop="username">
							<el-input v-model="ruleForm.username" prefix-icon="el-icon-user" clearable placeholder="用户名 / 手机 / 邮箱">
								<!-- <template #append>
									<el-select v-model="userType" placeholder="请选择" style="width: 130px;">
										<el-option v-for="item in rolelist" :label="item.roleName" :value="item.role" :key="item.role"></el-option>
										<el-option label="管理员" value="admin"></el-option>
										<el-option label="用户" value="user"></el-option>
									 </el-select>
								</template> -->
							</el-input>
						</el-form-item>
						<el-form-item prop="Password">
							<el-input v-model="ruleForm.password" prefix-icon="el-icon-lock" clearable show-password placeholder="请输入密码"></el-input>
						</el-form-item>
						<!-- <el-form-item style="margin-bottom: 10px;">
							<el-row>
								<el-col :span="12">
									<el-checkbox label="记住我" v-model="ruleForm.autologin"></el-checkbox>
								</el-col>
								<el-col :span="12" style="text-align: right;">
									<el-button type="text">忘记密码？</el-button>
								</el-col>
							</el-row>
						</el-form-item> -->
						<el-form-item>
							<el-button type="primary" style="width: 100%;" :loading="islogin" round @click="login">登 录</el-button>
						</el-form-item>
					</el-form>

					<el-divider>其他登录方式</el-divider>

					<div class="login-oauth">
						<el-button size="small" type="primary" icon="el-icon-platform-eleme" circle></el-button>
						<el-button size="small" type="success" icon="el-icon-s-goods" circle></el-button>
						<el-button size="small" type="info" icon="el-icon-s-promotion" circle></el-button>
						<el-button size="small" type="warning" icon="el-icon-menu" circle></el-button>
					</div>
				</div>
				<div class="login-sidebox">
					<div class="login-sidebox__title">
						<h2>社团管理平台</h2>
						<h4>华北电力大学</h4>

					</div>
					<img :src="loginbg"/>
				</div>
			</div>
			<div class="login-footer">
			<div >© {{$CONFIG.APP_NAME}} {{$CONFIG.APP_VER}}</div>
			<div >© Powered By:控制与计算机工程学院iDeal工作室</div>
			</div>
		</div>
	</div>
</template>

<script>
import { generateRoleRouter } from '@/router/asyncRouter'
import logo from '@/assets/logo.png'
import loginbg from '@/assets/loginbg.svg'


export default {
    data() {
        return {
            userType: 'admin',
            ruleForm: {
                username: "",
                password: ""
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            rolelist: [],
            islogin: false,
            logo,
            loginbg,
            userInfo: {
                dashboard: '0',
                role: ['admin'],
                userId: '',
                userName: ''
            }
        }
    },
    watch: {
        userType(val) {
            this.ruleForm.username = val
            this.ruleForm.password = val
            // console.log(this.ruleForm.password)
        }
    },
    mounted() {
        // this.$API.login.APIAdminLogin().then(res => {
        //     this.rolelist = res
        // })

    },
    created: function() {
        this.$TOOL.data.remove("TOKEN")
        this.$TOOL.data.remove("UserID")
        this.$TOOL.data.remove("Name")
        this.$TOOL.data.remove("UserType")
        this.$TOOL.data.remove("MENU")
        this.$TOOL.data.remove("PERMISSIONS")
        this.$store.commit("clearViewTags")
        this.$store.commit("clearKeepLive")
        this.$store.commit("clearIframeList")
        // console.log('%c SCUI %c Gitee: https://gitee.com/lolicode/scui', 'background:#666;color:#fff;border-radius:3px;', '')
    },
    methods: {
        login() {
            this.islogin = true
            var data = {
                account: this.ruleForm.username,
                // Password: this.$TOOL.encryptedData(this.ruleForm.password),
                password: this.$TOOL.encryptedData(this.ruleForm.password)
            }
            // console.log(data)
            // 获取token
            this.$API.login.APIAdminLogin(data).then((res) => {


                this.$TOOL.data.set("TOKEN", res.data.token)
                var curDate = new Date()
                // 当前时间戳
                var curTamp = curDate.getTime()
                // 当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
                var curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1
                // 当日已经过去的时间（毫秒）
                var passedTamp = curTamp - curWeeHours
                // 当日剩余时间
                var leftTamp = 24 * 60 * 60 * 1000 - passedTamp
                var leftTime = new Date()
                this.$TOOL.data.TimeSet(res.data.token, leftTamp + leftTime)
                if(this.$TOOL.data.TimeGet === null) {
                    this.islogin = false
                }
                this.$TOOL.data.set("UserID", res.data.sys_user_id)
                this.$TOOL.data.set("Name", res.data.sys_user_name)
								
                this.$TOOL.data.set("UserType", res.data.user_type)
                this.userInfo.userId = res.data.sys_user_id
                this.userInfo.userName = res.data.sys_user_name
                // console.log(this.userInfo)
                this.$TOOL.data.set("USER_INFO", this.userInfo)
                // 获取菜单
                var menu = generateRoleRouter(this.userType)
                this.$TOOL.data.set("MENU", menu)

                this.$router.replace({
                    path: '/'
                })
                // window.location.href = '/'
                this.$message.success("Login Success 登录成功")
            }).finally(() => {
                this.islogin = false
            })
        }
    }
}

</script>

<style scoped>
	.login_bg {position: absolute;top:0px;left:0px;right:0px;bottom:0px;}
	.login_container {position: absolute;top:50%;left:50%;width: 1100px;margin: 0 auto;z-index: 1;transform: translate(-50%, -50%);}
	.login_body {width: inherit;display: flex;box-shadow: 0px 20px 80px 0px rgba(0,0,0,0.3);}
	.login-sidebox {width: 50%;padding: 60px;color: #fff;background:var(--el-color-primary);position: relative;overflow: hidden;}
	.login-sidebox__title h2 {font-size: 30px;}
	.login-sidebox__title h4 {font-size: 18px;margin-top: 10px;font-weight: normal;}
	.login-sidebox__title p {font-size: 14px;margin-top:10px;line-height: 1.8;color: rgba(255,255,255,0.6);}
	.login-sidebox img {position: absolute;left:-120px;bottom:-160px;width: 550px;}

	.login-logo {text-align: center;margin-bottom: 30px;}
	.login-logo .logo {width: 70px;height: 70px;vertical-align: bottom;}
	.login-logo h2 {font-size: 24px;margin-top: 20px;color: #40485b;}

	.login-title {margin-top: 20px;}
	.login-title h2 {font-size: 22px;font-weight: normal;}
	.login-title p {font-size: 12px;margin-top:40px;line-height: 1.8;color: rgba(255,255,255,0.8);}

	.login-form {width: 50%;padding: 60px 100px;background: #fff;}
	.login-oauth {display: flex;justify-content:space-around;}
	.login-form .el-divider {margin-top:40px;}

	.login-footer {text-align: center;color: #999;margin-top: 50px;}

	.demo-user-item {display: flex;align-items: center;line-height: 1;padding:10px 0;}
	.demo-user-item .icon {margin-right: 20px;}
	.demo-user-item .info h2 {font-size: 14px;}
	.demo-user-item .info p {color: #666;margin-top: 6px;}

	@media (max-height: 650px){
	.login_bg {position: static;}
	.login_container {position: static;transform: none;margin:50px auto;}
	.login-footer {margin-bottom: 50px;}
	}
	@media (max-width: 1200px){
	.login_container {width: 900px;}
	.login-form {padding:60px;}
	}
	@media (max-width: 1000px){
	.login_container {width: 100%;background: #fff;margin: 0;transform:none;top:0px;bottom:0px;left:0px;right: 0px;}
	.login_body {box-shadow: none;}
	.login-form {width:100%;padding:60px 40px;}
	.login-sidebox {display: none;}
	.login-footer {margin-top: 0;}
	}
</style>
