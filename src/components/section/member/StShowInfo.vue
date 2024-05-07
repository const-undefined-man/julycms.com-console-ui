<template>
	<div class="page-st">
        <el-row :gutter="15" class="info">
            <el-col :span="8">
                <el-card shadow="hover">
                    <div slot="header">基本信息</div>
                    <ul>
                        <li>
                            <el-col :span="8">头像</el-col>
                            <el-col :span="16">
                                <img src="/static/adm.png" class="fl avatar">
                            </el-col>
                        </li>
                        <li>
                            <el-col :span="8">昵称</el-col>
                            <el-col :span="16">丫蛋🥚</el-col>
                        </li>
                        <li>
                            <el-col :span="8">签名</el-col>
                            <el-col :span="16">我这个人其实很低调</el-col>
                        </li>
                        <li>
                            <el-col :span="8">性别</el-col>
                            <el-col :span="16">男</el-col>
                        </li>
                        <li>
                            <el-col :span="8">出生日期</el-col>
                            <el-col :span="16">2018-04-23</el-col>
                        </li>
                    </ul>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div slot="header">注册信息</div>
                    <ul>
                        <li>
                            <el-col :span="8">注册IP</el-col>
                            <el-col :span="16">127.0.0.1</el-col>
                        </li>
                        <li>
                            <el-col :span="8">注册时间</el-col>
                            <el-col :span="16">2018-09-02 12:49:12</el-col>
                        </li>
                        <li>
                            <el-col :span="8">客户端/类型</el-col>
                            <el-col :span="16">小程序 微信</el-col>
                        </li>
                        <li>
                            <el-col :span="8">手机品牌型号</el-col>
                            <el-col :span="16">苹果 iphone7 A1660</el-col>
                        </li>
                        <li>
                            <el-col :span="8">系统版本</el-col>
                            <el-col :span="16">ios11.42.1</el-col>
                        </li>
                    </ul>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover">
                    <div slot="header">联系信息</div>
                    <ul>
                        <li>
                            <el-col :span="8">电话</el-col>
                            <el-col :span="16">15541122365</el-col>
                        </li>
                        <li>
                            <el-col :span="8">电话归属地</el-col>
                            <el-col :span="16">辽宁 联通</el-col>
                        </li>
                        <li>
                            <el-col :span="8">邮箱</el-col>
                            <el-col :span="16">i@qq.com</el-col>
                        </li>
                        <li>
                            <el-col :span="8">微信</el-col>
                            <el-col :span="16">222222222</el-col>
                        </li>
                    </ul>
                </el-card>
            </el-col>
            <el-col span:="24">
                <el-card shadow="hover" class="auth-info">
                    <div slot="header">认证信息</div>
                    <el-col :span="6">
                        <el-col>姓名 :艾格</el-col>
                        <el-col>身份证号: </el-col>
                        <el-col>123456789000000000</el-col>
                    </el-col>
                    <el-col :span="6">
                        <el-col>身份证正面</el-col>
                        <el-col>
                            <el-image
                                src="http://www.people.com.cn/mediafile/pic/20131109/14/16040359824971357606.jpg" 
                                :preview-src-list="['http://www.people.com.cn/mediafile/pic/20131109/14/16040359824971357606.jpg']">
                            </el-image>
                        </el-col>
                    </el-col>
                    <el-col :span="6">
                        <el-col>身份证反面</el-col>
                        <el-col>
                            <el-image
                                src="http://www.people.com.cn/mediafile/pic/20131109/14/16040359824971357606.jpg" 
                                :preview-src-list="['http://www.people.com.cn/mediafile/pic/20131109/14/16040359824971357606.jpg']">
                            </el-image>
                        </el-col>
                    </el-col>
                    <el-col :span="6">
                        <el-col>手持身份证</el-col>
                        <el-col>
                            <el-image
                                src="http://www.people.com.cn/mediafile/pic/20131109/14/16040359824971357606.jpg" 
                                :preview-src-list="['http://www.people.com.cn/mediafile/pic/20131109/14/16040359824971357606.jpg']">
                            </el-image>
                        </el-col>
                    </el-col>
                </el-card>
            </el-col>
        </el-row>

        <el-row class="text-center">
            <el-button>通过</el-button>
            <el-button type="danger">不通过</el-button>
        </el-row>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style scoped>
.page-st { padding-bottom: 15px; }
.el-card { margin-bottom:15px; }
.el-card .el-card__header, .el-card .el-card__body { padding:10px 15px; }
.el-card .avatar { width:50px; height: 50px; }
.el-card li { margin:10px 0; overflow: hidden; }
.auth-info .el-col { margin-bottom:10px; }
.auth-info .el-image { width: 220px; height:120px; }
</style>