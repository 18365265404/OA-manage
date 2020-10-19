<template>
    <div>
        <!--申请绑定!-->
        <el-row>
            <el-col>
                <el-form :inline="true">
                    <el-form-item>
                <el-button type="primary" @click="saveApplyRelation" v-if="btnMsg.relationApply">申请绑定</el-button>
                        </el-form-item>
                    </el-form>
            </el-col>
            </el-row>
        <el-form :inline="true" :model="researchRelationTable" ref="researchRelationTable" class="demo-form-inline">
            <el-form-item :label-width="researchRelationTableWidth" prop="applicantId">
                <el-input  v-model="researchRelationTable.applicantId" placeholder="申请人" size="small"></el-input>

            </el-form-item>
            <el-form-item :label-width="researchRelationTableWidth" prop="appointId">
                <el-input  v-model="researchRelationTable.appointId" placeholder="指派人" size="small"></el-input>

            </el-form-item>
            <el-form-item :label-width="researchRelationTableWidth" prop="status">
                <el-select v-model="researchRelationTable.status" placeholder="状态" size="small">
                    <el-option
                        v-for="item in relationStatus"
                        :key="item.dicDesc"
                        :label="item.dicDesc"
                        :value="item.dicValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label-width="researchRelationTableWidth" prop="type">
                <el-select v-model="researchRelationTable.type" placeholder="申请类型" size="small">
                    <el-option
                        v-for="item in relationType"
                        :key="item.dicDesc"
                        :label="item.dicDesc"
                        :value="item.dicValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="submitResearchRelationTable">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button  size="small" type="primary" @click="resetForm('researchRelationTable')">重置</el-button>
            </el-form-item>
        </el-form>
        <!--用户关系列表-->
        <el-table
            :data="relationTable"
            border
            tooltip-effect="dark"
            v-loading="loading.pageList"
            element-loading-text="拼命加载中"
        >
            <el-table-column prop="applicantAccount" label="申请人账号" width="100" ></el-table-column>
            <el-table-column prop="applicantId" label="申请人id" ></el-table-column>
            <el-table-column prop="appointAccount" label="委派人账号"  width="100" ></el-table-column>
            <el-table-column prop="applicantDeptName" label="申请人部门" width="100"></el-table-column>
            <el-table-column prop="appointDeptName" label="委派人部门" width="120"></el-table-column>
            <el-table-column prop="remark" label="申请人备注" ></el-table-column>
            <el-table-column prop="createTime" label="申请时间"  width="120" :formatter="formTime"></el-table-column>
            <el-table-column prop="reviewRemark" label="审核备注"></el-table-column>
            <el-table-column prop="status" label="状态" width="100"  >
                <template scope='scope'>
                    <el-tag type="primary">{{tableStatus(scope.row.status)}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="type" label="申请类型">
                <template scope='scope'>
                   <div> {{tableType(scope.row.type)}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="150px">
                <template scope="scope">
               <div  v-show='scope.row.status!==2' style="width: 110px">
                   <el-button type="info" size="mini" v-show="scope.row.type!==2&&scope.row.status!==1&&btnMsg.relationReview" @click="reviewDialogHandle(scope.$index, scope.row)">审核</el-button>
                   <el-button type="danger" size="mini" v-show="btnMsg.relationRemoveBinding" @click="removeBinding(scope.$index, scope.row)">解除绑定</el-button>
               </div>
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
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!--申请绑定弹框-->
        <el-dialog title="新增用户关系" :visible.sync="saveRelationVisible" size="small"  :before-close="saveRelationClose" >
            <el-form :model="saveRelation" :rules="saveRelationRule" ref="saveRelation">
                <el-form-item label="指派人账号" :label-width="saveRelationDialogWidth" prop="appointAccount" >
                    <el-input v-model="saveRelation.appointAccount" placeholder='请输入指派人账号' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型" :label-width="saveRelationDialogWidth" prop="type">
                    <el-select v-model.number="saveRelation.type" placeholder="请选择">
                        <el-option
                            v-for="c in relationType"
                            :key="c.dicValue"
                            :label="c.dicDesc"
                            :value="c.dicValue"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" :label-width="saveRelationDialogWidth" prop='remark'>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="saveRelation.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click=" saveRelationHandle('saveRelation')">新增</el-button>
                <el-button @click="saveRelationClose">取 消</el-button>
            </div>
        </el-dialog>
        <!--审核弹框-->
        <el-dialog title="审核" :visible.sync="reviewRelationVisible" size="small"  :before-close="reviewRelationClose" >
            <el-form :model="reviewRelation" :rules="reviewRelationRule" ref="reviewRelation">
                <el-form-item label="审核状态" :label-width="reviewRelationDialogWidth" prop="reviewStatus">
                    <el-select v-model="reviewRelation.reviewStatus" placeholder="请选择">
                        <el-option
                            v-for="item in reviewStatus2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="备注" :label-width="reviewRelationDialogWidth" prop='reviewRemark'>
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="reviewRelation.reviewRemark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="reviewRelationHandle('reviewRelation')">确认</el-button>
                <el-button @click="reviewRelationClose">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
                loading:{
                    pageList:false,
                    detail:false
                },
                researchRelationTable:{
                    type:'',
                    status:'',
                    applicantId:"",
                    appointId:''
                },
                researchRelationTableWidth:'100px',
                reviewStatus2:[
                    {
                        value: '1',
                        label: '审核通过'
                    }, {
                        value: '2',
                        label: '审核不通过'
                    }
                ],
                userInfo:{},//账号信息
                relationTable:[],//用户关系列表
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                saveRelationDialogWidth:"120px",//增加绑定关系,
                saveRelationVisible:false,
                saveRelation:{
                    appointAccount:'',
                    type:'',
                    remark:'',
                    applicantAccount:'',
                    applicantId:''
                },
                saveRelationRule:{
                    type:[
                        {type:"number",required: true, message: '请选择申请类型', trigger: 'change' }
                    ],
                    appointAccount:[
                        { required: true, message: '请输入委托人账号', trigger: 'blur' }
                    ],
                    remark:[
                        {required: true, message: '请输入备注内容', trigger: 'blur' }
                    ]
                },
                relationType:[],
                relationStatus:[],//审核弹框
                reviewRelationVisible:false,
                reviewRelationDialogWidth:'120px',
                reviewRelation:{
                    relationId:'',
                    reviewRemark:'',
                    reviewStatus:''
                },
                reviewRelationRule:{
                    reviewStatus:[
                        {required: true, message: '请选择审核状态', trigger: 'change' }
                    ],
                    reviewRemark:[
                        {required: true, message: '请输入备注内容', trigger: 'blur' }
                    ]
                },
                btnMsg:{
                    relationApply:false,//关系申请
                    relationReview:false,//关系审核,
                    relationRemoveBinding:false//解除绑定
                }
            }
        },
        methods:{
            initBtnMsg(){
                this.btnMsg.relationApply=filterBtnPms(this.btnAllPms.relationApply);
                this.btnMsg.relationReview=filterBtnPms(this.btnAllPms.relationReview);
                this.btnMsg.relationRemoveBinding=filterBtnPms(this.btnAllPms.relationRemoveBinding);
            },
            submitResearchRelationTable(){
                this.initRelationList(this.tableData)
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            reviewRelationHandle(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$axios.post('/s/reviewRelation',this.reviewRelation).then((res)=>{
                                if(res.status==200){
                                    this.initRelationList(this.tableData)
                                    this.reviewRelationClose()
                                }else{
                                    this.$message({
                                        type: 'info',
                                        message: res.data.msg
                                    });
                                }
                            })

                        }});
            },
            reviewRelationClose(){
                this.reviewRelationVisible=false
                this.$refs['reviewRelation'].resetFields()
            },
            reviewDialogHandle(index,row){
                this.reviewRelation.relationId=row.id
                this.reviewRelationVisible=true
            },
            removeBinding(index,row){
                this.$confirm('此操作将删除绑定, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/s/removeBinding',{params:{relationId:row.id}}).then((res)=>{
                        if(res.status==200){
                            this.$message({
                                type: 'success',
                                message: '成功删除!'
                            });
                            this.initRelationList(this.tableData)
                        }else {
                            this.$message({
                                type: 'info',
                                message: res.data.msg
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            saveApplyRelation(){
                this.saveRelationVisible=true
            },
            saveRelationHandle(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$axios.put('/s/saveApplyRelation',this.saveRelation).then((res)=>{
                                console.log(res)
                                if(res.status==200){
                                    this.initRelationList(this.tableData)
                                    this.saveRelationClose()
                                }else {
                                    this.$message({
                                        type: 'warning',
                                        message:res.data.msg
                                    });
                                }
                            })
                        }})
            },
            saveRelationClose(){
                this.$refs['saveRelation'].resetFields();
                this.saveRelationVisible = false;
            },
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initRelationList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initRelationList(this.tableData)
            },
            initRelationList(data){
                this.loading.pageList=true
                this.$axios.get('/s/getOperatorRelationList',{params:data}).then((res)=>{
                    if(res.status==200){
                    this.pagination.total=res.data.msg.total;
                    this.pagination.pageNum=res.data.msg.pageNum;
                    this.pagination.pageSize=res.data.msg.pageSize;
                    this.relationTable=res.data.msg.list
                }
                    this.loading.pageList=false

                })
                this.relationType=this.dicData.RELATION_APPLY_TYPE
                this.relationStatus=this.dicData.REVIEW_STATUS
            },
            formTime(row){
                return formatTime(row.createTime)
            },
            tableType(typeValue){
                let typeText
                this.relationType.forEach((e)=>{
                    if(e.dicValue==typeValue
                    ){
                        typeText=e.dicDesc
                    }
                })
                return typeText
            },
            tableStatus(statusValue){
                let statusText
                this.relationStatus.forEach((e)=>{
                    if(e.dicValue==statusValue
                    ){
                        statusText=e.dicDesc
                    }
                })
                return statusText
            }
        },
        mounted(){
            this.initRelationList(this.tableData)
            this.userInfo=JSON.parse(localStorage.getItem('userInfo'))
            this.saveRelation.applicantId=this.userInfo.id
            this.saveRelation.applicantAccount=this.userInfo.account
            this.initBtnMsg()
        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    "type":this.researchRelationTable.type,
                        "status": this.researchRelationTable.status,
                    "applicantId":this.researchRelationTable.applicantId,
                        "appointId":this.researchRelationTable.appointId
                }
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

    .page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
    }

</style>
