<template>
    <div>
        <!--面包屑-->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <!--筛选栏-->
            <el-row :gutter="20">
                <el-col :sm="6" :lg="6" :offset="7">
                    <div class="grid-content bg-purple">
                        <el-input v-model="input" placeholder="请输入账号名、昵称" @keyup.enter.native="researchUser"></el-input>
                    </div>
                </el-col>
                <el-col :sm="1" :lg="4">
                    <el-button type="primary" icon="search" @click="researchUser"></el-button>
                </el-col>
            </el-row>

            <!--新增用户-->
            <el-button type="text" @click="initAddUser" v-if="btnMsg.userAdd">
                <el-button type="primary" icon="plus">新增用户</el-button>
            </el-button>
            <el-dialog title="新增用户" :visible.sync="dialogFormVisible" size="tiny" :before-close="cancelSendNewUser" :close-on-click-modal="false">
                <el-form :model="newUser" :rules="rules" ref="newUser">


                    <el-form-item label="用户账号account" :label-width="formLabelWidth" prop="account">
                        <el-input v-model="newUser.account" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称nickName" :label-width="formLabelWidth" prop="nickName">
                        <el-input v-model="newUser.nickName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码mobile" :label-width="formLabelWidth" prop="mobile">
                        <el-input v-model="newUser.mobile" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门" :label-width="formLabelWidth" prop="selectedOptions">
                        <el-cascader :options="deptTree"
                                     v-model="newUser.selectedOptions"
                                     :props="props"
                                     :change-on-select="true"
                                     @change="changePosition"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="用户岗位positionId" :label-width="formLabelWidth" prop="positionId">
                        <el-select v-model="newUser.positionId" placeholder="请选择岗位">
                            <el-option v-for="p in position" :key="p.id" :label="p.positionName" :value="p.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelSendNewUser">取 消</el-button>
                    <el-button type="primary" @click="sendNewUser('newUser')">确 定</el-button>
                </div>
            </el-dialog>
            <div>
                <!--表格-->
                <el-table :data="userTable" border style="width: 100%">
                    <el-table-column prop="account" label="用户账号">
                    </el-table-column>
                    <el-table-column prop="nickName" label="用户昵称">
                    </el-table-column>
                    <el-table-column prop="deptName" label="用户部门">
                    </el-table-column>
                    <el-table-column prop="positionName" label="用户岗位">
                    </el-table-column>
                    <el-table-column prop="state" label="用户状态">
                        <template scope="scope">
                            {{scope.row.state?'正常':'锁定'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template scope="scope">
                            <el-button size="small" :type="scope.row.state?'info':'danger'" v-show="btnMsg.userLocked&&btnMsg.userUnlocked" @click="lockedUser(scope.$index, scope.row)">{{scope.row.state?'锁定':'解锁'}}</el-button>
                            <el-button size="small" type="warning" v-show="btnMsg.userResetpassword" @click="resetPassword(scope.$index, scope.row)">重设密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <div class="paginationWrap">
                <el-row type="flex" justify="space-between">
                    <el-col >
                        <div class="grid-content bg-purple"><span class="tabLeAddCount"></span></div>
                    </el-col>
                    <el-col >
                        <div class="grid-content bg-purple-light"  style="text-align: right">
                            <el-pagination class='page_pagination'
                                           @size-change="handleSizeChange"
                                           @current-change="handleCurrentChange"
                                           :current-page="pagination.pageNum"
                                           :page-sizes="[10, 25,50 ,100]"
                                           :page-size="pagination.pageSize"
                                           layout="total, sizes, prev, pager, next"
                                           :total="pagination.total">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </div>
            </div>


        </div>
        <div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6" >
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data() {
            var validateMobile = (rule, value, callback) => {
                if (!/^1\d{10}$/.test(value)){
                    callback(new Error('手机号不正确'));
                } else {
                    callback();
                }
            }
            return {
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                userTable:[],
                deptTree:[
                    {
                        "id":"0",
                        "deptName":"根节点",
                        "child":[],
                        "parentDeptIds": null
                    }
                ],
                props:{
                    label: 'deptName',
                    children: 'child',
                    value:'id'
                },
                selectedOptions:[],
                selectCity: [],
                value: '',
                input:'',
                dialogFormVisible: false,
                newUser: {
                    account: '',
                    nickName: '',
                    mobile: null,
                    positionId: '',
                    selectedOptions:[]
                },
                formLabelWidth: '80px',
                position:[],
                rules:{
                    account:[
                        {required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    nickName:[
                        {  required: true, message: '请输入昵称', trigger: 'blur' },
                        { max:12,message: '昵称过长', trigger: 'blur' }
                    ],
                    mobile:[
                        {required: true, message: '请输入手机号码', trigger: 'blur' },
                        { max:11,message: '手机号码为11位', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    positionId:[
                        {required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    selectedOptions:[
                        {type: 'array',required: true, message: '请选择一个', trigger: 'change' }                    ]
                },
                btnMsg:{
                    userAdd:false,// 新增用户
                    userLocked:false,//锁定用户
                    userUnlocked:false,// 解锁用户
                    userResetpassword:false//重置密码
                }
            }
        },
        methods:{
            lockedUser:function (index,row) {
                let tips=this.userTable[index].state?'此操作将锁定用户':'此操作将解锁用户';
                this.$confirm(tips, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                     let status=this.userTable[index].state?0:1;
                        this.$axios.post("/s/state",{userId:this.userTable[index].id,state:status}).then((res)=>{
                            if(res.status==200){
                              if(this.userTable[index].state){
                                  this.$message({
                                      message: '锁定用户已成功',
                                      type: 'success',
                                      duration:'1000'
                                  });
                              }else {
                                  this.$message({
                                      message: '解锁用户已成功',
                                      type: 'success',
                                      duration:'1000'
                                  });
                              }
                                this.initUserTable(this.tableData);
                            }
                        })
                }).catch(()=>{

                })
            },
            resetPassword:function (index,row) {
                this.$confirm('确定重置该用户密码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.post("/s/resetPass",{userId:this.userTable[index].id}).then((res)=>{
                        if(res.status==200){
                            this.$message({
                                message: '密码重置成功',
                                type: 'success',
                                duration:'1000'
                            });
                        }

                    })
                }).catch(()=>{

                })
            },
            initUserTable(data){
                this.$axios.post('/s/userPage',data).then((res)=>{
                 if(res.status==200){
                     this.pagination.total=res.data.msg.total;
                     this.pagination.pageNum=res.data.msg.pageNum;
                     this.pagination.pageSize=res.data.msg.pageSize;
                     this.userTable=res.data.msg.list
                 }
                })

            },
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initUserTable(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initUserTable(this.tableData);
            },
            initAddUser(){
                this.dialogFormVisible = true
                this.$axios.post("/s/deptTree",{parentIds:0}).then((res)=>{
                    if(res.status==200){
                        this.deptTree[0].child=res.data.msg;
                    }
                })
            },
            changePosition(){
                this.newUser.positionId=[];
                this.$axios.post("/s/findPositionByDeptId",{deptId:this.deptId}).then((res)=>{
                    if(res.status==200){
                       this.position=res.data.msg
                    }
                })

            },
            sendNewUser(formName){
                let data={
                    account:this.newUser.account,
                    mobile:this.newUser.mobile,
                    state:1,
                    positionId:this.newUser.positionId,
                    deptId:this.deptId,
                    nickName:this.newUser.nickName
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/s/addUser',data).then((res)=>{
                            if(res.status==200){
                                this.initUserTable(this.tableData)
                                this.cancelSendNewUser();
                            }else {
                                alert(res.data.msg)
                            }
                        });
                    } else {
                        this.$message.error('请填写必要信息！')
                        return false;
                    }
                });
            },
            cancelSendNewUser(){
                this.$refs['newUser'].resetFields();
                this.dialogFormVisible = false;
            },
            researchUser(){
                this.initUserTable(this.tableData)
            }

        },
        mounted(){
            this.initUserTable(this.tableData)
            this.btnMsg.userAdd=filterBtnPms(this.btnAllPms.userAdd);
            this.btnMsg.userLocked=filterBtnPms(this.btnAllPms.userLocked);
            this.btnMsg.userUnlocked=filterBtnPms(this.btnAllPms.userUnlocked);
            this.btnMsg.userResetpassword=filterBtnPms(this.btnAllPms.userResetpassword);
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize,"condition":this.input}
            },
            deptId(){
                return this.newUser.selectedOptions[this.newUser.selectedOptions.length-1]
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        }

    }
</script>
