<template>
	<div class="user-bar">
		<div class="screen panel-item hidden-sm-and-down" @click="screen">
			<i class="el-icon-full-screen"></i>
		</div>
		<el-dropdown trigger="click" @command="handleUser" style="height: 100%;">
			<div class="user panel-item">
				<el-avatar :size="30">{{ userNameF }}</el-avatar>
				<label>{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i></label>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="cmd">CMD</el-dropdown-item>
					<el-dropdown-item divided command="outLogin">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script>
export default {
    data() {
        return {
            userName: "未命名",
            userNameF: ""
        }
    },
    created() {
        var userInfo = this.$TOOL.data.get("USER_INFO")
        this.userName = userInfo.userName
        // console.log(this.userName)
        this.userNameF = this.userName.substring(0, 1)
    },
    methods: {
        // 个人信息
        handleUser(command) {
            if(command === "cmd") {
                this.$router.push({ path: '/cmd' })
            }
            if(command === "outLogin") {
                this.$confirm('确认是否退出当前用户？', '提示', {
                    type: 'warning',
                    confirmButtonText: '退出',
                    confirmButtonClass: 'el-button--danger'
                }).then(() => {
                    this.$router.replace({ path: '/login' })
                }).catch(() => {
                    // 取消退出
                })
            }
        },
        // 全屏
        screen() {
            var element = document.documentElement
            this.$TOOL.screen(element)
        }
    }
}
</script>

<style scoped>
	.user-bar {display: flex;align-items: center;height: 100%;}
	.user-bar .panel-item {padding: 0 10px;cursor: pointer;height: 100%;display: flex;align-items: center;}
	.user-bar .panel-item i {font-size: 16px;}
	.user-bar .panel-item:hover {background: rgba(0, 0, 0, 0.1);}
	.user-bar .user {display: flex;align-items: center;}
	.user-bar .user label {display: inline-block;margin-left:5px;font-size: 12px;cursor:pointer;}

	.msg-list li {border-top:1px solid #eee;}
	.msg-list li a {display: flex;padding:20px;}
	.msg-list li a:hover {background: #ecf5ff;}
	.msg-list__icon {width: 40px;margin-right: 15px;}
	.msg-list__main {flex: 1;}
	.msg-list__main h2 {font-size: 15px;font-weight: normal;color: #333;}
	.msg-list__main p {font-size: 12px;color: #999;line-height: 1.8;margin-top: 5px;}
	.msg-list__time {width: 100px;text-align: right;color: #999;}

	[data-theme='dark'] .msg-list__main h2 {color: #d0d0d0;}
	[data-theme='dark'] .msg-list li {border-top:1px solid #363636;}
	[data-theme='dark'] .msg-list li a:hover {background: #383838;}
</style>
