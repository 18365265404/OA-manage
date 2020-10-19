<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>BD数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>客服数据统计</el-breadcrumb-item>
            </el-breadcrumb>
                <div>
                <el-form :inline="true" :model="researchCustomerList" ref="researchCustomerList" class="demo-form-inline">
                    <el-row>
                        <el-col>
                            <el-form-item  prop='startDate' :label-width="researchCustomerListWidth">
                                <div class="block">
                                    <el-date-picker
                                        v-model="researchCustomerList.startDate"
                                        type="date"
                                        :editable="false"
                                        placeholder="起始日期"
                                        format="yyyy-MM-dd"
                                        :picker-options="pickerBeginDateBefore"
                                        size="small"
                                    >
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item  prop='endDate' :label-width="researchCustomerListWidth">
                                    <div class="block">
                                        <el-date-picker
                                            v-model="researchCustomerList.endDate"
                                            type="date"
                                            :editable="false"
                                            placeholder="终止日期"  format="yyyy-MM-dd"
                                            :picker-options="pickerBeginDateAfter"
                                            size="small"
                                        >
                                        </el-date-picker>
                                    </div>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item>
                                <el-button size="small" type="primary" @click="submitChannelsTable">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>


                </el-form>
            </div>
        </div>
        <el-table :data="ReceivablesConfirmList" border style="width: 100%">
            <el-table-column prop="nickName" label="昵称" ></el-table-column>
            <el-table-column prop="realName" label="账号" >
            </el-table-column>


            <el-table-column prop="toStoreVolume" label="到店量" >
                <template scope="scope">
                    <div v-if="!scope.row.toStoreVolume">{{scope.row.toStoreVolume||0}}</div>
                    <div v-else style="color: blue;cursor: pointer" @click="rowCustomerDetails(scope.row,0)">{{scope.row.toStoreVolume}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="singleVolume" label="成单量" >
                <template scope="scope">
                    <div v-if="!scope.row.singleVolume">{{scope.row.singleVolume||0}}</div>
                    <div v-else style="color: blue;cursor: pointer" @click="rowCustomerDetails(scope.row,1)">{{scope.row.singleVolume}}</div>
                </template>
            </el-table-column>



        </el-table>
        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col>
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
        <el-dialog :title="rowCustomerDetailTitle" :visible.sync="rowCustomerDetailVisible">
            <el-table :data="rowCustomerDetailList" border style="width: 100%">
                <el-table-column prop="customerName" label="客户名称" ></el-table-column>
                <el-table-column prop="mobieNumber" label="客户手机号" ></el-table-column>
                <el-table-column prop="createTime" label="创建时间" >
                    <template scope="scope">
                        {{formTime(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="manageTime" label="处理时间" >
                    <template scope="scope">
                        {{formTime(scope.row.manageTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="状态" >
                    <template scope="scope">
                        {{statusText(scope.row.sataus,'customer_status')}}
                    </template>
                </el-table-column>
                </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col>
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="rowDetailHandleSizeChange"
                                       @current-change="rowDetailHandleCurrentChange"
                                       :current-page="rowDetailPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="rowDetailPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="rowDetailPagination.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import  moment from 'moment'
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    function getDays(strDateStart,strDateEnd){
        var strSeparator = "-"; //日期分隔符
        var oDate1;
        var oDate2;
        var iDays;
        oDate1= strDateStart.split(strSeparator);
        oDate2= strDateEnd.split(strSeparator);
        var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
        var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
        return iDays ;
    }
    export default{
        data(){
            return {
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }
                },
                saveDate:{
                    endDate:'',
                    startDate:'',
                    userId:'',
                    status:'',
                    saveDate:null
                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchCustomerList.startDate;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                researchCustomerList:{
                    startDate:'',
                    endDate:''
                },
                researchCustomerListWidth:'120px',
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                ReceivablesConfirmList:[],
                rowCustomerDetailVisible:false,
                rowCustomerDetailTitle:'',
                rowCustomerDetailList:[],
                rowDetailPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                dec:{
                    customer_status:[]
                }
            }
        },
        methods: {
            rowCustomerDetails(row,status){
                this.rowCustomerDetailVisible=true
                this.saveDate.userId=row.id
                this.saveDate.status=status
                this.rowCustomerDetailTitle=status?'成单量':"到店量"
                this.initCustomerDetails(this.rowDetailTableData)
            },
            rowDetailHandleSizeChange(val) {
                this.rowDetailPagination.pageSize = val;
                this.initCustomerDetails(this.rowDetailTableData)
            },
            rowDetailHandleCurrentChange(val) {
                this.rowDetailPagination.pageNow = val;
                this.initCustomerDetails(this.rowDetailTableData)
            },
            initCustomerDetails(data){
                this.$axios.post('/customer/getHsCustomerDetails',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.rowDetailPagination.total=res.data.msg.total;
                        this.rowDetailPagination.pageNum=res.data.msg.pageNum;
                        this.rowDetailPagination.pageSize=res.data.msg.pageSize;
                        this.rowCustomerDetailList=res.data.msg.list;
                        this.initDec()
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },

            submitChannelsTable(){
                this.researchCustomerList.startDate=this.researchCustomerList.startDate?moment(this.researchCustomerList.startDate).format('YYYY-MM-DD'):''
                this.researchCustomerList.endDate=this.researchCustomerList.endDate?moment(this.researchCustomerList.endDate).format('YYYY-MM-DD'):''
                    this.initCustomerList(this.tableData)
                    this.saveDate.startDate=this.researchCustomerList.startDate
                    this.saveDate.endDate=this.researchCustomerList.endDate

            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            startDateChange(val){
                this.researchCustomerList.startDate = val
            },
            endDateChange(val){
                this.researchCustomerList.endDate = val
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initCustomerList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initCustomerList(this.tableData)
            },
            initCustomerList(data){
                this.$axios.post('/customer/consultationList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.ReceivablesConfirmList=res.data.msg.list;
                        this.initDec();
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            formTime(row){
                if(row == null){
                    return null
                }
                else{
                    return moment(row).format('YYYY-MM-DD HH:mm:ss')
                }
            },
            statusText(status,statusName){ //状态值匹配
                let n;
                this.dec[statusName].forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            },
                initDec(){
              this.dec.customer_status=this.dicData.HS_CUSTOMER_STATUS
    }
    },
        computed:{
            tableData(){
                return {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'dateTimeStar':this.researchCustomerList.startDate,
                    'dateTimeStop':this.researchCustomerList.endDate,
                }
            },
            rowDetailTableData(){
                return {
                    "pageNow":this.rowDetailPagination.pageNow,
                    "pageSize":this.rowDetailPagination.pageSize,
                    'dateTimeStar':this.saveDate.startDate,
                    'dateTimeStop':this.saveDate.endDate,
                    'userId':this.saveDate.userId,
                    'status':this.saveDate.status
                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
            this.researchCustomerList.startDate=moment().subtract(6,'days').format('YYYY-MM-DD');
            this.researchCustomerList.endDate=moment().format('YYYY-MM-DD');
            this.saveDate.startDate=this.researchCustomerList.startDate
            this.saveDate.endDate=this.researchCustomerList.endDate
            this.initCustomerList(this.tableData)
        }
    }
</script>
<style>
    .saleFollowUpTips{
        font-size: 14px;
        margin: 10px 0;
    }
    .saleFollowUpTips span{
        color: red;
    }
</style>
