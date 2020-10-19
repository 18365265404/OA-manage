<template>
    <div>
        <!--查询顾问!-->
        <el-row>
            <el-col>
                <el-form :inline="true">
                    <el-form-item label="账号">
                        <el-input v-model="research.advisorAccount"></el-input></el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="research.inviterType"  placeholder="请选择" clearable >
                            <el-option v-for="(item,i) in inviterType"
                                       :key="i"
                                       :label="item.dicDesc"
                                       :value="item.dicValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="激活状态">
                        <el-select v-model="research.userStatus"  placeholder="请选择" clearable >
                            <el-option v-for="(item,i) in userStatus"
                            :key="i"
                                       :label="item.dicDesc"
                                       :value="item.dicValue"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="researchTable">查询</el-button>
                        <el-button type="danger" @click="resetResearch" >清空</el-button>
                </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row v-if='btnMsg.newAderControlAssign'>
            <el-col>
                <el-form :inline="true">
                    <el-form-item label="城市">
                        <el-select v-model="researchAdvisorList.cityCode"  placeholder="请选择" clearable @change="changeAdvisorList" >
                            <el-option
                                v-for="item in storeCitys"
                                :key="item.cityCode"
                                :label="item.cityName"
                                :value="item.cityCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="可分配顾问">
                        <el-select v-model="assignInviter.advisorAccount"
                                   placeholder="请搜索"
                                   clearable
                                   filterable
                                   remote
                                   :remote-method="remoteMethod"
                                   :loading="filter">
                            <el-option v-for="(item,i) in options4"
                                       :key="i"
                                       :label="item.account"
                                       :value="item.account"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="assignInviterHandle">分配顾问下线</el-button>
                        </el-form-item>
                </el-form>

                </el-col>
        </el-row>
        <el-button type="text" @click="addAdvisorOpen" v-if='btnMsg.newAderControlAdd'>
            <el-button type="primary" icon="plus">添加顾问</el-button>
        </el-button>
        <!--新增顾问弹框-->
        <el-dialog title="新增顾问" :visible.sync="addAdvisorVisible" size="small" :before-close="addAdvisorClose" >
            <el-form :model="addAdvisor" :rules="addAdvisorRules" ref="addAdvisor">
                <el-form-item label="顾问账号" :label-width="addAdvisorDialogWidth" prop="account">
                    <el-input v-model="addAdvisor.account" placeholder='请输入顾问账号' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="顾问名称" :label-width="addAdvisorDialogWidth" prop="name">
                    <el-input v-model.number="addAdvisor.name" placeholder='请输入顾问名称' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="岗位" :label-width="addAdvisorDialogWidth" prop="positionId">
                    <el-select v-model="addAdvisor.positionId" placeholder="请选择">
                        <el-option
                            v-for="c in positionList"
                            :key="c.id"
                            :label="c.positionName"
                            :value="c.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机" :label-width="addAdvisorDialogWidth" prop="mobile">
                    <el-input v-model="addAdvisor.mobile" placeholder='请输入手机号' auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="addAdvisorHandle('addAdvisor')">新增</el-button>
                <el-button @click="addAdvisorClose">取 消</el-button>
            </div>
        </el-dialog>
        <!--顾问列表-->
        <el-table
            ref="multipleTable"
            :data="advisorTable"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-loading="loading.pageList"
            element-loading-text="拼命加载中"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="顾问昵称" ></el-table-column>
            <el-table-column prop="account" label="顾问帐号" ></el-table-column>>
            <el-table-column prop="positionCitys" label="城市">
                <template scope="scope">
                    <div>{{cityText(scope.row.positionCitys)}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="inviter" label="推荐人" ></el-table-column>
            <el-table-column prop="inviteeCount" label="下线数量" >
                <template scope="scope">
                    <el-button type="primary" size="small" @click="getInviteeList(scope.row.account)" v-show="scope.row.inviteeCount">{{scope.row.inviteeCount}}</el-button>
                    {{!scope.row.inviteeCount?scope.row.inviteeCount:''}}
                </template>
            </el-table-column>
            <el-table-column prop="userStatus" label="状态">
                <template scope="scope">
                    <div v-if="scope.row.userStatus">激活</div>
                    <div v-else="!scope.row.userStatus">禁用</div>
                </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" >
                <template scope="scope">
                        <el-button type="success" size="small" v-show="scope.row.userStatus&&btnMsg.newAderControlAddoffine" @click="AddUnderLineHandle(scope.$index, scope.row)">增加下线</el-button>
                        <el-button type="primary" size="small" v-show="btnMsg.newAderControlEdit" @click="handleModification(scope.$index, scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
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
                                   :total="pagination.total">>
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <!--修改-->
        <el-dialog title="修改" :visible.sync="modificationUnderLineVisible"   size="mini" :before-close="modificationUnderLineCancel">
        <el-form :model="modificationUnderLine" :rules="modificationRules" ref='modificationUnderLine'>
            <el-form-item label="顾问名称" :label-width="addAdvisorDialogWidth" prop="accout">
                <el-input v-model="modificationUnderLine.accout" placeholder='请输入顾问名称' auto-complete="off"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="有效金额" :label-width="addAdvisorDialogWidth" prop="validAmount" >
                <el-input v-model.number="modificationUnderLine.validAmount" placeholder='请输入有效金额' auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="佣率模式" :label-width="addAdvisorDialogWidth" prop="settlementType">
                <el-select v-model="modificationUnderLine.settlementType" placeholder="请选择" @change="changeModule"  @visible-change="visibleChange" >
                    <el-option
                        v-for="c in ModuleList"
                        :key="c.settlementType"
                        :label="c.name"
                        :value="c.settlementType"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="ModuleName" :label-width="addAdvisorDialogWidth" prop="completeOrderPercent">
                <el-input v-model.number="modificationUnderLine.completeOrderPercent"  auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" icon='document' @click="modificationUnderLineHandle('modificationUnderLine')">新增</el-button>
            <el-button @click="modificationUnderLineCancel">取 消</el-button>
        </div>
    </el-dialog>
        <!--下线列表-->
        <el-dialog title="下线列表" :visible.sync="UnderLineTableVisible" >
            <el-table :data="underLineTable">
                <el-table-column property="account" label="账号" ></el-table-column>
                <el-table-column property="nickName" label="昵称" ></el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="underLineHandleSizeChange"
                                       @current-change="underLineHandleCurrentChange"
                                       :current-page="underLinePagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="underLinePagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="underLinePagination.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'

    export default{
        data(){
            var checkAge = (rule, value, callback) => {
                let type=this.modificationUnderLine.settlementType
                if (type==0||type==2) {
                    if(value>=1){
                        return callback(new Error('返佣率不能超过1'));
                    }else {
                        callback()
                    }
                }else{
                    if(value<=10){
                        return callback(new Error('返佣金额太小'));
                    }else {
                        callback()
                    }
                }

            };
            return {
                btnMsg:{
                    newAderControlAssign:false,
                    newAderControlAdd:false,
                    newAderControlAddoffine:false,
                    newAderControlEdit:false
                },
                loading:{
                    pageList:false,
                    detail:false
                },
                options4: [],
                filter: false,
                modificationRules:{
                    validAmount:[
                        {required: true, message: '请输入有效金额', trigger: 'blur',type:"number" }
                    ],
                    settlementType:[
                        {required: true, message: '请选择一项', trigger: 'change' ,type:"number"}
                    ],
                    completeOrderPercent:[
                        {required: true, message: '请输入有效金额', trigger: 'blur',type:"number"},
                        { validator: checkAge, trigger: 'blur',type:"number" }
                    ]
                },
                ModuleName:'',
                ModuleList:[],//佣率模式
                advisorTable:[],//顾问列表
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                CityLists:[],
               addAdvisorVisible: false,//增加顾问
                addAdvisor:{
                    account:'',
                    positionId:'',
                    name:'',
                    mobile:''
                },
                addAdvisorRules:{
                    name:[
                        {required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    mobile:[
                        {required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    account:[
                        {required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    positionId:[
                        {required: true, message: '请选择一项', trigger: 'change'}
                    ]
                },
                addAdvisorDialogWidth:"120px",
                positionList:[],
                addUnderLineVisible:false,//删选表格内容
                inviterType:[],
                research:{
                    advisorAccount:'',
                    inviterType:'',
                    userStatus:''
                },
                multipleSelection:[],
                availableAdvisor:[], //可分配顾问
                assignInviter:{
                    inviteeIds:'',
                    advisorAccount:''
                },
                modificationUnderLineVisible:false,//修改下线
                modificationUnderLine:{
                    validAmount:'',
                    settlementType:'',
                    completeOrderPercent:'',
                    accout:'',
                    id:""

                },
                saveModificationUnderLiner:{},
                underLineTable:[],//顾问列表
                UnderLineTableVisible:false,
                underLinePagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                addUnderLine:{
                    account:'',
                    deptId:'',
                    positionId:''
                },//增加下线数量
                getInviteeAccount:"",
                userStatus:[],//用户状态,
                onOffChange:false,
                adviostList:[],
                storeCitys:[],
                openCity:[],
                researchAdvisorList:{
                    cityCode:''
                }

            }
        },
        methods:{
            remoteMethod(query) {
                if (query !== '') {
                    this.filter = true;
                    setTimeout(() => {
                        this.filter = false;
                        this.options4 = this.adviostList.filter(item => {
                            return item.account.toLowerCase()
                                    .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 300);
                } else {
                    this.options4 = [];
                }
            },
            changeAdvisorList(val){
                this.AvailableAdvisor();
                this.adviostList=[]
            },
            visibleChange(val){
                this.onOffChange=true
            },
            changeModule(val){
                if(this.onOffChange){
                    this.ModuleList.some((e)=>{
                        if(e.settlementType==val){
                            this.ModuleName=e.name
                            this.modificationUnderLine.validAmount=e.validAmount
                            this.modificationUnderLine.completeOrderPercent=e.completeOrderPercent?e.completeOrderPercent:e.completeOrderAmount
                        }
                    })
                }

            },
            AddUnderLineHandle(index, row){
                this.addUnderLine.account=row.account;
                this.addUnderLine.deptId=row.deptId;
                this.addUnderLine.positionId=row.positionId;
                this.$confirm('此操作将增加下线数量, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.put('/s/generateAdvisor',this.addUnderLine).then((res)=>{
                        this.initAdvisorList(this.tableData)
                    })
                    this.$message({
                        type: 'success',
                        message: '成功增加!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });

            },
            underLineHandleSizeChange(val) {
                this.underLinePagination.pageSize=val;
                this.initInviteeList(this.underLineTableData)
            },
            underLineHandleCurrentChange(val) {
                this.underLinePagination.pageNow=val;
                this.initInviteeList(this.underLineTableData)
            },
            assignInviterHandle(){
                this.assignInviter.inviteeIds= this.multipleSelection.map((n)=>{
                    return n.id
                }).join(',')
             let sameAccount=this.multipleSelection.some((n)=>{
                    return this.assignInviter.advisorAccount==n.account
                })
                if(sameAccount){
                    this.$message.error('不能分配到相同顾问账号！');
                }else{
                    this.$axios.post('/s/assignInviter',this.assignInviter).then((res)=>{
                        if(res.status==200){
                            this.initAdvisorList(this.tableData)
                            this.$message.info('分配成功');
                        }
                    })


                }
            },
            initCity(){ //初始化默认用户城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.researchAdvisorList.cityCode=this.storeCitys[0].cityCode
                this.inviterType=this.dicData.INVITER_TYPE
                this.userStatus =this.dicData.USER_STATUS
            },
            initOpenCity(){ //所有开通城市
                this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
                    if(res2.status == 200){
                        this.CityLists=res2.data.msg
                        this.openCity =  res2.data.msg;
                        this.storeCitys.forEach((e)=>{
                            this.openCity.forEach((n)=>{
                                if( n.cityCode==e.cityCode){
                                    e.cityName = n.cityName
                                }
                            })
                        })
                    }
                    else{
                        alert(msg)
                    }

                })
            },
            getInviteeList(account){
                this.getInviteeAccount=account
                this.initInviteeList(this.underLineTableData)
            },
            initInviteeList(data){
                this.$axios.get('/s/getInviteeListByAccount',{params:data}).then((res)=>{
                    if(res.status==200){
                        this.UnderLineTableVisible=true
                        this.underLineTable=res.data.msg.list
                        this.underLinePagination.total=res.data.msg.total;
                        this.underLinePagination.pageNum=res.data.msg.pageNum;
                        this.underLinePagination.pageSize=res.data.msg.pageSize;
                    }
                })
            },
            modificationUnderLineHandle(){
                this.$refs['modificationUnderLine'].validate((valid) => {
                        if (valid) {
                            let data={
                                validAmount:this.modificationUnderLine.validAmount,
                                settlementType:this.modificationUnderLine.settlementType,
                                id:this.modificationUnderLine.id
                            }

                            switch(this.modificationUnderLine.settlementType){
                                case 0:
                                case 2:
                                    data.completeOrderPercent=this.modificationUnderLine.completeOrderPercent
                                    break;
                                case 1:
                                case 3:
                                    data.completeOrderAmount=this.modificationUnderLine.completeOrderPercent
                                    break;
                            }
                            this.$axios.post("/s/updateAdvisor",data).then((res)=>{
                                if(res.status==200){
                                    this.modificationUnderLineCancel()
                                    this.initAdvisorList(this.tableData)
                                }else {
                                    alert(res.data.msg)
                                }
                            });
                        } else {
                            console.log('error submit!!');
                            return false;
                        }})
            },
            modificationUnderLineCancel(){
                this.modificationUnderLineVisible=false;
                this.onOffChange=false
            },
            handleModification(index,row){
                this.modificationUnderLineVisible=true
                this.modificationUnderLine.id=row.id
                this.modificationUnderLine.accout=row.account
                this.modificationUnderLine.settlementType=row.settlementType
                this.modificationUnderLine.validAmount=row.validAmount
                switch(row.settlementType){
                    case 0:
                    case 2:
                        this.modificationUnderLine.completeOrderPercent=row.completeOrderPercent
                        this.onOffChange=false
                        break;
                    case 1:
                    case 3:
                        this.modificationUnderLine.completeOrderPercent=row.completeOrderAmount
                        this.onOffChange=false
                        break;
                }
                this.ModuleList.some((e)=>{
                    if(e.settlementType==this.modificationUnderLine.settlementType){
                        this.ModuleName=e.name
                    }
                })
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
            ,
            researchTable(){
                this.initAdvisorList(this.tableData)
            },
            resetResearch(){
                this.research.advisorAccount=''
                this.research.inviterType=''
                this.research.userStatus=''

            },
            addAdvisorOpen(){
                this.addAdvisorVisible=true
                this.$axios.get('/s/listPosition').then((res)=>{
                    if(res.status==200){
                        this.positionList=res.data.msg
                    }
                })
            },
            addAdvisorHandle(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$axios.put('/s/saveAdvisor',this.addAdvisor).then((res)=>{
                                if(res.status==200){
                                    this.initAdvisorList(this.tableData)
                                    this.addAdvisorClose()
                                    this.AvailableAdvisor()
                                    this.$message.info('添加成功');
                                }else {
                                    this.$message.error(res.data.msg);
                                }
                            })
                        }})
            },
            addAdvisorClose(){
                this.$refs['addAdvisor'].resetFields();
                this.addAdvisorVisible = false;
            },
            initAdvisorList(data){
                this.loading.pageList=true
             this.$axios.get('/s/getAdvisorList',{params:data}).then((res)=>{
                     if(res.status==200){
                         this.pagination.total=res.data.msg.total;
                         this.pagination.pageNum=res.data.msg.pageNum;
                         this.pagination.pageSize=res.data.msg.pageSize;
                         this.advisorTable=res.data.msg.list

             }
                 this.loading.pageList=false
             })

             },
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initAdvisorList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initAdvisorList(this.tableData)
            },
            cityText(data){
                if(data){
                    let cityGroup=data.split(',')
                    let cityGroupName=[]
                    cityGroup.forEach((n)=>{
                        this.CityLists.forEach((b)=>{
                            if(b.cityCode==n){
                                cityGroupName.push(b.cityName)
                            }
                        })
                    })
                    cityGroupName=cityGroupName.join(',')
                    return cityGroupName
                }else {

                }

            },
            AvailableAdvisor(){
                this.$axios.get("/s/getAvailableAdvisorList",{params:{cityCode:this.researchAdvisorList.cityCode}}).then((res3)=>{
                   if(res3.status==200){
                       this.adviostList=res3.data.msg
                   }
                })
            },
           getSettlementModuleList(){
               this.$axios.post("/customer/getSettlementModuleList").then((res)=>{
                   if(res.status==200){
                       this.ModuleList=res.data.msg
                   }
               })
           }
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    userStatus:this.research.userStatus,
                    advisorAccount:this.research.advisorAccount,
                    inviterType:this.research.inviterType


                }
            },
            underLineTableData(){
                return {"account":this.getInviteeAccount,
                    "pageNow":this.underLinePagination.pageNow,
                    "pageSize":this.underLinePagination.pageSize}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
    },
        mounted(){
            this.initCity()
            this.getSettlementModuleList()
            this.initAdvisorList(this.tableData)
            this.AvailableAdvisor()
            this.btnMsg.newAderControlAssign=filterBtnPms(this.btnAllPms.newAderControlAssign)
            this.btnMsg.newAderControlAdd=filterBtnPms(this.btnAllPms.newAderControlAdd)
            this.btnMsg.newAderControlAddoffine=filterBtnPms(this.btnAllPms.newAderControlAddoffine)
            this.btnMsg.newAderControlEdit=filterBtnPms(this.btnAllPms.newAderControlEdit)
        }
    }
</script>
<style>

    .page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
    }

</style>
