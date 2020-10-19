<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> BD数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>销售统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            <el-form-item label="账户：" prop='bdAccount' :label-width="formLabelWidth">
                <el-input v-model="formInline.bdAccount">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="interviewTableData" border style="width: 100%">
            <el-table-column prop="account" label="账号"></el-table-column>
            <el-table-column prop="bdName" label="账户名"></el-table-column>
            <el-table-column prop="notMakeCount" label="未预约">
                <template scope="scope">
                    <div v-if="scope.row.notMakeCount==0">{{scope.row.notMakeCount}}</div>
                    <div v-else="" @click="showDetail(scope.row.bdId,0)" style="cursor: pointer;color: #20a0ff">{{scope.row.notMakeCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="interviewCount" label="预约面谈">
                <template scope="scope">
                    <div v-if="scope.row.interviewCount==0">{{scope.row.interviewCount}}</div>
                    <div v-else="" @click="showDetail(scope.row.bdId,1)" style="cursor: pointer;color: #20a0ff">{{scope.row.interviewCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="interviewCooperationCount" label="面谈合作">
                <template scope="scope">
                    <div v-if="scope.row.interviewCooperationCount==0">{{scope.row.interviewCooperationCount}}</div>
                    <div v-else="" @click="showDetail(scope.row.bdId,2)" style="cursor: pointer;color: #20a0ff">{{scope.row.interviewCooperationCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="interviewNotCooperationCount" label="面谈不合作">
                <template scope="scope">
                    <div v-if="scope.row.interviewNotCooperationCount==0">{{scope.row.interviewNotCooperationCount}}</div>
                    <div v-else="" @click="showDetail(scope.row.bdId,3)" style="cursor: pointer;color: #20a0ff">{{scope.row.interviewNotCooperationCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="totalCount" label="总计">
            <template scope="scope">
            <div v-if="scope.row.totalCount==0">{{scope.row.totalCount}}</div>
            <div v-else="" @click="showDetail(scope.row.bdId)" style="cursor: pointer;color: #20a0ff">{{scope.row.totalCount}}</div>
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
        <el-dialog  :visible.sync="dialogTableVisible">
            <el-table :data="saleDialogTable">
                <el-table-column prop="contacts" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template scope="scope">
                        {{ statusData(scope.row.status)}}
                    </template>

                </el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="saleDialogHandleSizeChange"
                                       @current-change="saleDialogHandleCurrentChange"
                                       :current-page="saleDialogPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="saleDialogPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="saleDialogPagination.total">>
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
    export default {
        data() {
            return {
                formLabelWidth:'80px',
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                interviewTableData: [],
                formInline:{
                    bdAccount:'',
                    startDate:'',
                    endDate:''
                },
                bdAccounts:[],
                pickerOptions0: {

                },
                dialogTableVisible:false,
                saleDialogPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                saleDataTable: [],
                SalesByBdId:{
                    bdId:'',
                    status:null
                },
                saleDialogTable:[],
                status:[],
                btnMsg:{
                    salesCountDetails:false
                }
            }
        },
        methods: {
            formTime(row){
                return formatTime(row.reserveTime)
            },
            showDetail(bdId,status){
                if(this.btnMsg.salesCountDetails){
                    this.SalesByBdId.bdId=bdId;
                    this.SalesByBdId.status=status;
                    this.initShowDetail()
                }
            },
            initShowDetail(){
                this.$axios.get('/s/getSalesByBdId',{params:this.showDetailData}).then((res)=>{
                    if(res.status==200){
                        this.dialogTableVisible=true
                        this.saleDialogTable=res.data.msg.list
                        this.saleDialogPagination.total=res.data.msg.total
                        this.saleDialogPagination.pageSize=res.data.msg.pageSize
                        this.saleDialogPagination.pageNum=res.data.msg. pageNum
                    }
                })
                this.status=this.dicData.WEDDING_SALES_STATUS
            },
            saleDialogHandleSizeChange(val) {
                this.saleDialogPagination.pageSize=val;
                this.initShowDetail();
            },
            saleDialogHandleCurrentChange(val) {
                this.saleDialogPagination.pageNow=val;
                this.initShowDetail();
            },
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initCityTable(this.tableData)

            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initCityTable(this.tableData)
            },
            onSubmit() {
                this.initCityTable(this.tableData);
                this.resetForm(this.formInline);
            },
            resetForm(formName) {  //重置
                this.$refs[formName].resetFields();
            },
            initCityTable(data){  //获取表格内容
                this.$axios.get('/s/countSales',{params:data}).then((res)=>{
                    this.pagination.total=res.data.msg.total;
                    this.pagination.pageNum=res.data.msg.pageNum;
                    this.pagination.pageSize=res.data.msg.pageSize;
                    this.interviewTableData=res.data.msg.list;
                })
            },
            statusData(status){
                let n;
                this.status.forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            }

        },
        mounted(){
            this.initCityTable(this.tableData);
            this.btnMsg.salesCountDetails=filterBtnPms(this.btnAllPms.salesCountDetails);
        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    account:this.formInline.bdAccount
                }
            },
            showDetailData(){
                return{
                    "pageNow":this.saleDialogPagination.pageNow,
                    "pageSize":this.saleDialogPagination.pageSize,
                    bdId:this.SalesByBdId.bdId,
                    status:this.SalesByBdId.status
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
    .demo-form-inline{
        text-align: center;
    }
    .message_bottom{
        height:44px;
        line-height: 44px;
        font-size: 12px;
        color: #999;
        text-align: center;
    }
    .page_pagination{
        text-align: right;
    }
    .lengthInput{
        width:220px;
    }
</style>
