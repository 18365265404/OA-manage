<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> BD数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>跟进统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="saleFollowUpTips">
            <span> （默认查询当前7天内的数据）</span>
        </div>
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            <el-form-item label="账户：" prop='account' :label-width="formLabelWidth">
                <el-input v-model="formInline.account">
                </el-input>
            </el-form-item>
            <el-form-item label="起始日期：" prop='startDate'>
                <div class="block">
                    <el-date-picker
                        v-model="formInline.startDate"
                        type="date"
                        placeholder="选择日期" @change="startDateChange"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="终止日期：" prop='endDate'>
                <div class="block">
                    <el-date-picker
                        v-model="formInline.endDate"
                        type="date"
                        placeholder="选择日期" @change="endDateChange"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </div>
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
            <!--<el-table-column prop="totalCount" label="总计">-->
                <!--<template scope="scope">-->
                    <!--<div v-if="scope.row.totalCount==0">{{scope.row.totalCount}}</div>-->
                    <!--<div v-else="" @click="showDetail(scope.row.bdId)" style="cursor: pointer;color: #20a0ff">{{scope.row.totalCount}}</div>-->
                <!--</template>-->
            <!--</el-table-column>-->

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
        <el-dialog  :visible.sync="dialogTableVisible">
            <el-table :data="saleDialogTable">
                <el-table-column prop="reserveTime" label="跟进时间" :formatter="formTime"></el-table-column>
                <el-table-column prop="operatorName" label="跟进人"></el-table-column>
                <el-table-column prop="remark" label="跟进详情"></el-table-column>
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
<style>
    .saleFollowUpTips{
        font-size: 14px;
        margin: 10px 0;
    }
    .saleFollowUpTips span{
        color: red;
    }
</style>
<script type="text/ecmascript-6">
    import  moment from 'moment'
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
                    account:'',
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
                    followupType:0,
                    followupStatus:null
                },
                saleDialogTable:[],
                status:[],
                btnMsg:{
                    followupCountDetails:false
                }
            }
        },
        methods: {
            formTime(row){
                return   row.createTime?formatTime(row.createTime):''
            },
            showDetail(bdId,status){
              if(this.btnMsg.followupCountDetails){
                  this.SalesByBdId.bdId=bdId;
                  this.SalesByBdId.followupStatus=status;
                  this.initShowDetail()
              }
            },
            initShowDetail(){
                this.$axios.get('/s/getFollowupListByBdId',{params:this.showDetailData}).then((res)=>{
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
            startDateChange(val){
                this.formInline.startDate = val
            },
            endDateChange(val){
                this.formInline.endDate = val
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initCityTable(this.tableData)
            },
            onSubmit() {
                this.initCityTable(this.tableData);
            },
            resetForm(formName) {  //重置
                this.$refs[formName].resetFields();
            },
            initCityTable(data){  //获取表格内容
                this.$loading({text:'拼命加载中'})
                this.$axios.get('/s/countFollowup',{params:data}).then((res)=>{
                    this.pagination.total=res.data.msg.total;
                    this.pagination.pageNum=res.data.msg.pageNum;
                    this.pagination.pageSize=res.data.msg.pageSize;
                    this.interviewTableData=res.data.msg.list;
                    this.$loading().close()
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
            this.formInline.startDate=moment().subtract(6,'days').format('YYYY-MM-DD');
            this.formInline.endDate=moment().format('YYYY-MM-DD');
            this.initCityTable(this.tableData);
            this.btnMsg.followupCountDetails=filterBtnPms(this.btnAllPms.followupCountDetails);
        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    account:this.formInline.account,
                    startDate:this.formInline.startDate,
                    endDate:this.formInline.endDate}
            },
            showDetailData(){
                return{
                    "pageNow":this.saleDialogPagination.pageNow,
                    "pageSize":this.saleDialogPagination.pageSize,
                    bdId:this.SalesByBdId.bdId,
                    followupType:this.SalesByBdId.followupType,
                    followupStatus:this.SalesByBdId.followupStatus,
                    startDate:this.formInline.startDate,
                    endDate:this.formInline.endDate
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
