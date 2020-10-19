<template>
    <div class="header top_header"  >
        <div class="logo"><span class='logo_span'>华盛婚礼会馆</span><span>v1.0</span></div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                                                 用户：{{username}}
                    <i class="el-icon-arrow-down"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                     <el-button class='el-dropdown-item' type="text" @click="dialogFormVisible = true">
			          	修改密码
			          </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item class='el-dropdown-item' command="loginout" >退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

        </div>
	<!--修改密码-->
		 <el-dialog title="修改密码" :visible.sync="dialogFormVisible" size='tiny' class='changeMessage' :before-close="cancelModifyPassword" >
			<el-form :model="role" ref="role" :rules="rules">
				<el-form-item label="原密码" :label-width="formLabelWidth" prop="message">
					 <el-input v-model="role.message" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" :label-width="formLabelWidth" prop="newMessage">
					<el-input v-model="role.newMessage" auto-complete="off" type="password"></el-input>
				</el-form-item>

				<el-form-item label="确认新密码" :label-width="formLabelWidth" prop="confirmMessage">
					<el-input v-model="role.confirmMessage" auto-complete="off" type="password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" icon='document' @click="modifyPassword('role')" >确认修改</el-button>
			 </div>
		</el-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.role.newMessage) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
            return {
                name: 'linxin',
                isShow: 'block',
                messageLength: 0,
                currentPage1: 1,
                gridData: [
	                {
			          date: '2016-05-02',
			          name: '王小虎',
			          address: '上海市普陀区金沙江路 1518 弄'
			        }, {
			          date: '2016-05-04',
			          name: '王小虎',
			          address: '上海市普陀区金沙江路 1518 弄'
			        }, {
			          date: '2016-05-01',
			          name: '王小虎',
			          address: '上海市普陀区金沙江路 1518 弄'
			        }, {
			          date: '2016-05-03',
			          name: '王小虎',
			          address: '上海市普陀区金沙江路 1518 弄'
			        }
		        ],

		        dialogFormVisible: false,
		        role: {
		          message: '',
		          newMessage: '',
		          confirmMessage: '',
		          delivery: false,
		          type: [],
		          resource: '',
		          desc: ''
		        },
                rules: {
                    message: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                    ],
                    newMessage: [
                        { required: true,message: '请输入新密码', trigger: 'blur' },
                        { min: 6,max:12,message: '密码长度应为6-12之间', trigger: 'blur' }
                    ],
                    confirmMessage: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                },
		        formLabelWidth: '100px',
		         types: [{
			        value: '选项1',
			        label: '所有权'
			     }, {
			        value: '选项2',
			        label: '分配权'
			     }],
			    value: '',
		        dialogTableVisible: false
            }
        },
        computed:{
            username(){
                let username = this.$store.getters.userId;
                return username ? username : " ";
            }
        },
        methods:{
            modifyPassword(formName){
                let modifyPasswordData={
                    'password':this.role.message,
                    'newPassword':this.role.newMessage,
                    'confirmPassword':this.role.confirmMessage}
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/s/modifyPassword",modifyPasswordData).then((res)=>{
                            if(res.status==200){
                                this.$message({message:'修改成功', type: 'success'});
                                this.cancelModifyPassword()
                            }else{
                                this.$message({message:res.data.msg, type: 'warning'});
                            }
                        })
                    } else {
                return false;
            }
            })

            },
            cancelModifyPassword(){
                this.$refs['role'].resetFields();
                this.dialogFormVisible = false;
            },
            handleCommand(command) {
                if(command == 'loginout'){
                    this.$store.dispatch('logOut')
                    console.log(this.$store.getters.userId)
                    if(!this.$store.getters.userId){
                        this.$router.push('/login');
                    }
                }
            },
            getHeaderBg(command) {
            	console.log(this.headerBg.background)
            	this.headerBg.background = command
            },
            handleSizeChange(val) {
		        console.log(`每页 ${val} 条`);
		      },
		      handleCurrentChange(val) {
		        console.log(`当前页: ${val}`);
		      }
        }
    }
</script>
<style scoped>
 @import "../../../static/css/additional.css";

    .header {
        position: relative;
       box-sizing: border-box;
        width: 100%;
       height:44px;

        font-size: 14px;
        color: #fff;
   }
    .logo,.user-info,.newMessage{
    	line-height:44px;
    }
   .header .logo{
        float: left;
        width:160px;
        text-align: center;
    }
    .user-info {
       padding-right: 30px;
    }
    .message{
    	color: #fff;
        font-size: 14px;
        margin-left:5px;
    }
   .logo_span{
    	 font-size: 16px;
    	 margin-right:10px;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 20px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }


    .newMessage{
    	width:80px;
    }
    .el-dropdown-item{
    	font-size: 14px;
    	height:30px;
    	color:#666;
    	line-height:30px;
    }
     .el-dropdown-item:hover{
     	color:dodgerblue
     }
    .el-icon-arrow-down{
    	margin-left:5px;
    }
	.table_bottom{
		border-bottom:1px solid #eee;
	}
	.page_pagination{
        text-align: right;
		padding:13px 5px 0 5px;
		line-height:30px !important;
	}
	.table_bottom,.header{
		display:flex;
		justify-content:space-between;
	}
	.message_bottom{
		text-align: center;
	}
	.frash{
	  	margin-bottom: 10px;
	    overflow: hidden;
	}
	.el-col {
	    border-radius: 4px;
	}
	.changeMessage .dialog-footer{
		text-align: center;
	}
</style>
