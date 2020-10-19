<template>
    <div>
        <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>付款方式管理</el-breadcrumb-item>
        </el-breadcrumb>
            <el-button type="text" v-if='btnP.resourcePageCreate' @click="addPaymentMode('新增付款方式')" >
                <el-button type="primary" icon="plus">新增付款方式</el-button>
            </el-button>

        </div>
        <el-table :data="paymentModeList" border style="width: 100%">
            <el-table-column prop="paymentDetail" label="付款方式明细"></el-table-column>
            <el-table-column prop="paymentType" label="付款方式">
                <template scope="scope">
                    <span>{{ paymentText(paymentTypeAll,scope.row.paymentType)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="accountDetails" label="对应详细信息">
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template scope="scope">
                    <span>{{ paymentText(paymentStatus,scope.row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalCount" label="操作">
                <template scope="scope">
                        <el-button
                            v-if="scope.row.status!=='2' && btnP.resourcePageDisabled"
                            size="small"
                            type="warning"
                            @click.native.prevent="deleteRow(scope.row)">
                            禁用
                        </el-button>
                        <el-button
                        	v-if='btnP.resourcePageEdit'
                        size="small"
                        type="primary"
                        @click.native.prevent="editRow(scope.row,'编辑付款方式')">
                        编辑
                       </el-button>
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

        <el-dialog
            :title="dialogTitle"
            :visible.sync="editTableDialogVisible"
            :before-close="cancelTableHandle"
            >
            <el-form :model="editTable" :rules="editTableRule" ref="editTable" label-width="100px">
                <el-form-item label="付款方式" prop="paymentType">
                    <el-select v-model.number="editTable.paymentType" placeholder="请选择" :disabled="disabledPayment">
                        <el-option v-for="type in paymentType"
                                   :key="type.dicDesc"
                                   :label="type.dicDesc"
                                   :value="type.dicValue">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="付款方式明细"  prop="paymentDetail">
                    <el-input v-model="editTable.paymentDetail" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="对应详细信息" prop="accountDetails">
                    <el-input v-model="editTable.accountDetails" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelTableHandle">取 消</el-button>
    <el-button type="primary" @click="editTableHandle('editTable')">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                paymentModeList:[],
                editTableDialogVisible:false,
                paymentType:[],
                paymentTypeAll:[],
                paymentStatus:[],
                editTable:{
                    paymentType:null,
                    paymentDetail:'',
                    accountDetails:''
                },
                editOrAdd:false,
                dialogTitle:'',
                disabledPayment:true,
                editTableRule:{
                    paymentDetail: [
                        {required: true, message: '请输入付款方式明细', trigger: 'blur'},
                        {max:200,message:"输入内容过长,请重新输入", trigger: 'blur'}
                    ],
                    paymentType:[
                        {type:'number',required: true, message: '请选择一项', trigger: 'change'}
                    ],
                    accountDetails: [
                        {required: true, message: '请输入对应详细信息', trigger: 'blur'},
                        {max:200,message:"输入内容过长,请重新输入", trigger: 'blur'}
                    ]

                },
                btnP:{
                	resourcePageDisabled: "",  //禁用
		            resourcePageCreate: "",  //新增付款方式
		            resourcePageEdit: "",  //编辑
                }

            }
        },
        methods:{
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initPaymentModeList(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initPaymentModeList(this.tableData);
            },
            initPaymentModeList(data){  //获取表格内容
                this.$axios.post('/order/getHsPaymentList',data).then((res)=>{
                    this.pagination.total=res.data.msg.total;
                    this.pagination.pageNum=res.data.msg.pageNum;
                    this.pagination.pageSize=res.data.msg.pageSize;
                    this.paymentModeList=res.data.msg.list;
            })

            },
            deleteRow(row){
                this.$confirm('此操作将禁用此付款方式, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/order/forbidHsPaymentMode',{hsPaymentModeId:row.id}).then((res)=>{
                        if(res.status==200){
                            this.initPaymentModeList(this.tableData);
                        }else {
                            alert(res.data.msg)
                        }
                    })
                    this.$message({
                        type: 'success',
                        message: '禁用成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消禁用'
                    });
                });
            },
            editRow(row,title){
                this.dialogTitle=title
                this.editTableDialogVisible=true
                this.editTable.paymentType=row.paymentType
                this.editTable.paymentDetail=row.paymentDetail
                this.editTable.accountDetails=row.accountDetails
                this.disabledPayment=true
                this.editOrAdd=true
            },
            editTableHandle(formName){
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let url=''
                            if(this.editOrAdd){
                                url='/order/updateHsPaymentMode'
                            }else{
                                url='/order/saveHsPaymentMode'
                            }
                            this.$axios.post(url,this.editTable).then((res)=>{
                                if(res.data.res=='0'){
                                    this.initPaymentModeList(this.tableData);
                                    this.cancelTableHandle()
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                            })

                        }})

            },
            cancelTableHandle(){
//                this.$refs['editTable'].resetFields();
                this.editTable.paymentType=0
                this.editTable.paymentDetail=''
                this.editTable.accountDetails=''
                this.editTableDialogVisible=false
            },
            paymentText(typeName,n){
                let t;
                typeName.forEach((e)=>{
                    if(e.dicValue==n) {
                        t=e.dicDesc
                    }
                })
                return t
            },
            addPaymentMode(title){
                this.editTableDialogVisible=true
                this.dialogTitle=title
                this.disabledPayment=false
                this.editOrAdd=false
            }
        },
        mounted(){
        	this.btnP = {
                	resourcePageDisabled: filterBtnPms(this.btnAllPms.resourcePageDisabled),  //禁用
		            resourcePageCreate: filterBtnPms(this.btnAllPms.resourcePageCreate),  //新增付款方式
		            resourcePageEdit: filterBtnPms(this.btnAllPms.resourcePageEdit),  //编辑
                }
            this.initPaymentModeList(this.tableData);
            this.paymentTypeAll = this.dicData.HS_PAYMENT_TYPE
            this.paymentTypeAll.forEach((m)=>{
                if( Number(m.dicValue)<4){
                    this.paymentType.push(m)
                }
            })
            this.paymentStatus=this.dicData.DATA_STATUS
        },
        computed: {
            tableData(){
                return {
                    "pageNow": this.pagination.pageNow,
                    "pageSize": this.pagination.pageSize,
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
