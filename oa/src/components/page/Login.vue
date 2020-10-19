<template>
    <div class="login">
        <div class="login-bg">
            <div class="login-mask">
                <div class="login-title">

                </div>

            </div>

        </div>
        <div class="login-wrap">
            <div class="ms-title">后台管理系统</div>
            <div class="ms-subTitle">华盛婚礼会馆</div>
            <div class="ms-login">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <el-form-item prop="username">
                       <div class="ms-icon">
                           <svg class="m-icon" aria-hidden="true">
                               <use xlink:href="#icon-yonghu"></use>
                           </svg>
                       </div>
                        <el-input v-model="ruleForm.username" placeholder="请输入用户名" ></el-input>
                    </el-form-item>
                    <!--<el-form-item prop="username">
                        <div class="ms-icon">
                            <svg class="m-icon" aria-hidden="true">
                                <use xlink:href="#icon-dunpai"></use>
                            </svg>
                        </div>
                        <el-input v-model="ruleForm.username" placeholder="请输入用户名" class="login-input-half" ></el-input>
                        <div class="verifyCode">

                        </div>
                    </el-form-item>-->
                    <el-form-item prop="password">
                        <div class="ms-icon">
                        <svg class="m-icon" aria-hidden="true">
                            <use xlink:href="#icon-yaochi"></use>
                        </svg>
                            </div>
                        <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" @keyup.enter.native="login()" ></el-input>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click='login()'>登录</el-button>
                    </div>
                    <p style="font-size:12px;line-height:30px;color:#999;">华盛婚礼会馆</p>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    verfyCode:'123'
                },
                rules: {
                    username: [
                        { required:  true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            login(){
                if(this.ruleForm.username == "" || this.ruleForm.password == ""){
                    alert("请输入用户名或密码")
                }else{
                    let data = {
                        'account':this.ruleForm.username,
                        'password':this.ruleForm.password,
                        "verfyCode":"qwerqwr",
                         "loginType":0
                    }
                   let self=this;
                    this.$store.dispatch('login', data).then(() => {
                        setTimeout(function () {
                            if(self.res=='0'){
                                self.$router.push('/readme')
                            }
                        },500)
                }).catch();

                }

            },

            submitForm(formName) {
            }
        },
        computed:{
            res(){
                return this.$store.state.user.res
            },
            userinfo(){
                return this.$store.getters.userInfo
            }
        },

    }





</script>

<style >
    @media(min-width: 768px){
        .login-title{
            background-size:300px auto ;
            bottom:70px;
            right: 100px;
        }
        .login-bg{
            background-size:100% auto ;
        }
    }
    @media(min-width: 992px){
        .login-title{
            background-size:300px auto ;
            bottom:70px;
            right: 100px;
        }
        .login-bg{
            background-size:100% auto ;
        }

    }
    @media(min-width: 1200px){
        .login-title{
            background-size:466px auto ;
            bottom:140px;
            right: 237px;
        }
        .login-bg{
            background-size:80% auto ;
        }
    }

    .login-bg{
        position: absolute;
        width:100%;
        height:100%;
        right: 50%;
        margin-right: -77px;
        background: url("http://admin.hunliren.com/resources/static/h-ui/images/gq/loginBg.jpg") no-repeat right;
    }
    .login-mask{
        position: absolute;
        width:100%;
        height:100%;
        margin-right: -77px;
        background-color: rgba(0,21,61,0.2);

    }
    .login-title{
        width: 466px;
        height: 182px;
        position: absolute;
        background-image: url("http://admin.hunliren.com/resources/static/h-ui/images/gq/loginBgText.png");
        background-repeat: no-repeat;
    }
    .login-wrap{
        position: absolute;
        width:100%;
        height:100%;
        left: 50%;
        margin-left: 77px;
        background: #fff;
    }
    .ms-title{
        position: absolute;
        top:50%;
        margin-top: -230px;
        margin-right: 32px;
        font-size:28px;
        color: #4786ff;
        right: 75%;
        letter-spacing: 5px;
        font-weight: bold;
        transform: translateX(50%);
    }
    .ms-subTitle{
        position: absolute;
        top:50%;
        margin-top: -188px;
        margin-right: 32px;
        font-size:18px;
        color: #4786ff;
        letter-spacing: 16px;
        right: 75%;
        transform: translateX(50%);
    }
    .ms-login{
        position: absolute;
        top:50%;
        width:400px;
        height:160px;
        margin:-150px 32px 0 0;
        padding:40px 0 0 0;
        border-radius: 5px;
        background: #fff;
        right: 75%;
        transform: translate(50%);
    }
    .login-btn{
        text-align: center;
        width: 389px;
    }
    .login-btn button{
        width:100%;
        height:60px;
    }
    .login .el-input{
        width: 328px;
        vertical-align: middle;
    }
    .login .el-button{
        font-size: 24px;
    }
   .login .el-input .el-input__inner{
        height: 60px;
        background-color: #fff;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
    .login .el-form-item__content{
        font-size: 0;
    }
   .ms-icon{
       display: inline-block;
       width: 58px;
       height: 58px;
       text-align: center;
       vertical-align: middle;
       border: 1px solid #bfcbd9;
       border-right: 0;
       border-bottom-left-radius: 5px;
       border-top-left-radius: 5px;
   }
    .ms-icon .m-icon{
        margin-top: 18px;
    }
    .login-input-half{
        width: 195px!important;
    }
    .verifyCode{
        display: inline-block;
        vertical-align: middle;
        width: 108px;
        border: 1px solid #bfcbd9;
        height: 58px;
        margin-left: 20px;
        border-radius: 5px;
    }
</style>

