<template>
    <div class="position">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>门店管理</el-breadcrumb-item>
                <el-breadcrumb-item>公司信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button type="text" @click="addCompany"  v-if="btnMsg.storeCompanyAdd">
            <el-button type="primary" icon="plus">添加公司信息</el-button>
        </el-button>

        <!--新增岗位弹框-->
        <el-dialog title="新增公司" :visible.sync="dialogFormVisible" class='positionBox' :before-close="cancelAddCompany">
            <el-form :model="newCompany" :rules="rules" ref="newCompany">
                <el-form-item label="公司开户行" :label-width="formLabelWidth" prop="bankName">
                    <el-input v-model="newCompany.bankName" placeholder='请输入公司开户行' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司开户账号" :label-width="formLabelWidth" prop="bankAccount">
                    <el-input v-model.number="newCompany.bankAccount" placeholder='请输入公司开户账号' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="城市" :label-width="formLabelWidth" prop="cityCode">
                    <el-select v-model="newCompany.cityCode" placeholder="请选择">
                        <el-option
                            v-for="c in CityName"
                            :key="c.id"
                            :label="c.cityName"
                            :value="c.cityCode"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="公司开户名" :label-width="formLabelWidth" prop="companyAccountName">
                    <el-input v-model="newCompany.companyAccountName" placeholder='请输入公司开户名' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司名" :label-width="formLabelWidth" prop="companyName">
                    <el-input v-model="newCompany.companyName" placeholder='请输入公司名' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="公司地址" :label-width="formLabelWidth" prop="companyAddress">
                    <el-input v-model="newCompany.companyAddress" placeholder='请输入公司地址' auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="sendAddCompany('newCompany')">新增</el-button>
                <el-button @click="cancelAddCompany">取 消</el-button>
            </div>
        </el-dialog>


        <el-table :data="CompanyTable" border style="width: 100%">
            <el-table-column prop="bankName" label="银行名"></el-table-column>
            <el-table-column prop="bankAccount" label="公司开户账号"></el-table-column>
            <el-table-column prop="companyAccountName" label="账户名"></el-table-column>
            <el-table-column prop="companyName" label="公司名"></el-table-column>
            <el-table-column prop="companyAddress" label="公司地址"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :formatter="formTime"></el-table-column>
            <el-table-column prop="statusText" label="状态"></el-table-column>
            <el-table-column prop="cityName" label="城市"></el-table-column>
            <el-table-column prop="operation" label="操作">
                <template scope="scope">
                    <el-button
                        type="info"
                        v-show="scope.row.status==0&&btnMsg.storeCompanyLocked"
                        size="small"
                        @click="changeStatus(scope.$index, scope.row)">
                        锁定
                    </el-button>
                    <el-button
                        type="danger"
                        v-show="scope.row.status==1&&btnMsg.storeCompanyUnlocked"
                        size="small"
                        @click="changeStatus(scope.$index, scope.row)">
                        解锁
                    </el-button>

                </template>
            </el-table-column>

        </el-table>
        <!--分页-->
        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col >
                <div class="grid-content bg-purple">
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
</template>

<script type="text/ecmascript-6" >
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data: function(){
            return {
                btnMsg:{
                    storeCompanyAdd:false,
                    storeCompanyLocked:false,
                    storeCompanyUnlocked:false
                },
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                CompanyTable:[],
                CityName:[],
                types:[],
                cities:[],
                checkedCities:[],
                deptTree:[],
                newCompany:{
                    bankName:'',
                    bankAccount:'',
                    cityCode:'',
                    companyAccountName:'',
                    companyName:'',
                    companyAddress:'',
                    status:1
                },
                rules:{
                    bankName:[
                        {required: true, message: '请填写银行名', trigger: 'blur' },
                        { max:20,message: '银行名过长', trigger: 'blur' }
                    ],
                    bankAccount:[
                        { required: true,type:'number', message: '请填写正确银行账号', trigger: 'blur' }
                    ],
                    cityCode:[
                        {required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    companyAccountName:[
                        {required: true, message: '请填写公司账号', trigger: 'blur' },
                        { max:20,message: '公司账号过长', trigger: 'blur' }
                    ],
                    companyName :[
                        {required: true, message: '请填写公司名', trigger: 'blur' },
                        { max:20,message: '公司名过长', trigger: 'blur' }
                    ],
                    companyAddress:[
                        {required: true, message: '请填写公司地址', trigger: 'blur' },
                        { max:200,message: '公司地址过长', trigger: 'blur' }
                    ]
                },
                dialogFormVisible: false,
                dialogFormVisible1: false,
                formLabelWidth: '120px'
            };
        },

        methods: {
            changeStatus(index, row){
				if(this.CompanyTable[index].status == 0){
		      			this.$confirm('此操作将锁定该公司信息, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	 let data={
			                    companyId:this.CompanyTable[index].id,
			                    companyStatus:this.CompanyTable[index].status
			                }
			                data.companyStatus?data.companyStatus=0: data.companyStatus=1;
			                this.$axios.post('/store/updateCompanyStatus',data).then(()=>{
			                    this.initCompanyTable(this.tableData);
			                })

				          this.$message({
				            type: 'success',
				            message: '成功锁定!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消锁定'
				          });
				        });
		      		}
		      		else{
		      			this.$confirm('此操作将解锁该公司信息, 是否继续?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	let data={
				                    companyId:this.CompanyTable[index].id,
				                    companyStatus:this.CompanyTable[index].status
				                }
				                data.companyStatus?data.companyStatus=0: data.companyStatus=1;
				                this.$axios.post('/store/updateCompanyStatus',data).then(()=>{
				                    this.initCompanyTable(this.tableData);
				                })

					          this.$message({
					            type: 'success',
					            message: '解锁成功!'
					          });
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消解锁'
					          });
					        });
		      		}
            },
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initCompanyTable(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initCompanyTable(this.tableData);
            },
            initCompanyTable(data){
                this.companyStatus = this.dicData.DATA_STATUS;
                this.$axios.get('/store/getCompanyInfoList',{params:data}).then((res)=>{
                    this.pagination.total=res.data.msg.total;
                    this.pagination.pageNum=res.data.msg.pageNum;
                    this.pagination.pageSize=res.data.msg.pageSize;
                    this.CompanyTable=res.data.msg.list;
                }).then(()=>{
                    this.$axios.get('/b/getOpenCityLists',{params:data}).then((res2)=>{
                        this.CityName=res2.data.msg
                        console.log(this.companyStatus)
                        this.CompanyTable.forEach((e)=>{
                            this.companyStatus.forEach((m)=>{
                               if( m.dicValue==e.status){
                                   e.statusText=m.dicDesc
                               }
                            })
                            let s= this.CityName.filter((n)=>{
                                return n.cityCode==e.cityCode
                            })
                            e.cityName=s[0].cityName
                        })
                    });
                })
                this.$axios.post("/s/deptTree",{parentIds:0}).then((res)=>{
                    if(res.status==200){
                        this.deptTree=res.data.msg;
                    }
                })
            },
            addCompany(){
                this.dialogFormVisible = true
                this.$axios.get('/b/getOpenCityList',{params:{pageNow:1,pageSize:1000}}).then((res)=>{
                    this.cities=res.data.msg.list
                })
            },
            sendAddCompany(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.put("/store/saveCompanyInfo",this.newCompany).then((res)=>{
                            if(res.status==200){
                                this.cancelAddCompany()
                                this.initCompanyTable()
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        });
                    } else {
                        this.$message.error('请填写必要信息！')
                        return false;
                    }
                });
            },
            cancelAddCompany(){
                this.$refs['newCompany'].resetFields();
                this.dialogFormVisible = false;
            },
            sendAccreditHandle(){
                if(this.checkedRoles.length){
                    this.$axios.post('/s/positionGrantRole',{id:this.accredit.id,roleIds:this.checkedRoles}).then((res)=>{
                        this.checkedRoles=[];
                        this.dialogFormVisible1 = false

                    })
                }else {
                    this.$message.error('请填写必要信息！')
                }
            },
             formTime(row){
                 return formatTime(row.createTime)
              },
        },
        mounted(){
            this.initCompanyTable(this.tableData);
            this.btnMsg.storeCompanyAdd=filterBtnPms(this.btnAllPms.storeCompanyAdd);
            this.btnMsg.storeCompanyLocked=filterBtnPms(this.btnAllPms.storeCompanyLocked);
            this.btnMsg.storeCompanyUnlocked=filterBtnPms(this.btnAllPms.storeCompanyUnlocked);
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])

        }
    }
</script>
<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
    }
    .position .text {
        margin: 0;
        border-bottom:none;
    }
    .position .el-checkbox:first-child{
        margin-left: 15px;
    }
    .position .box-card .el-card__header{
        padding:0 10px
    }
    .box-card .el-card__body{
        padding:10px 20px;
    }

</style>
<style scoped>
    .el-button+.el-button {
        margin: 0;
    }
    </style>
