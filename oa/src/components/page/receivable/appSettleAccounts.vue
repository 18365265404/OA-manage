<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>收款管理</el-breadcrumb-item>
                <el-breadcrumb-item>结婚圈结算</el-breadcrumb-item>
            </el-breadcrumb>
            <div>
                <el-form :inline="true" :model="researchSettleList" ref="researchSettleList" class="demo-form-inline">
                    <el-row>
                        <el-col>
                            <el-form-item :label-width="researchSettleListWidth">
                                <el-select v-model="researchSettleList.cityCode" placeholder="城市" size="small">
                                    <el-option
                                        v-for="item in storeCitys"
                                        :key="item.cityCode"
                                        :label="item.cityName"
                                        :value="item.cityCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  prop='startDate' :label-width="researchSettleListWidth">
                                <div class="block">
                                    <el-date-picker
                                        v-model="researchSettleList.startDate"
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
                            <el-form-item  prop='endDate' :label-width="researchSettleListWidth">
                                <el-tooltip class="item" effect="dark" content="终止日期为7天以内" placement="top-end">

                                    <div class="block">
                                        <el-date-picker
                                            v-model="researchSettleList.endDate"
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
                            <el-form-item  prop='account' :label-width="researchSettleListWidth">
                                <el-input v-model="researchSettleList.account"  placeholder="账号" ></el-input>
                                </el-form-item>
                            <el-form-item prop="bdId">
                                <el-select v-model="researchSettleList.status" placeholder="结算状态" size="small">
                                    <el-option
                                        v-for="(item,i) in dec.settle_status"
                                        :key="i"
                                        :label="item.dicDesc"
                                        :value="item.dicValue"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button size="small" type="primary" @click="submitChannelsTable">查询</el-button>
                                <el-button size="small" type="primary" @click="resetForm('researchSettleList')">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>


                </el-form>
            </div>
        </div>
        <el-table :data="ReceivablesConfirmList" border style="width: 100%" v-loading.fullscreen.lock="fullscreenLoading" >
            <el-table-column prop="advisorName" label="顾问" >
            </el-table-column>
            <el-table-column prop="advisorAccount" label="账号"  width="140px" >
            </el-table-column>
            <el-table-column prop="preAdvanceAmount" label="上次预支" width="100px" >
            </el-table-column>
            <el-table-column prop="advanceAmount" label="本次预支" width="100px" >
                <template scope="scope">
                    <div v-if="!scope.row.advanceAmount">{{scope.row.advanceAmount||0}}</div>
                    <div v-else style="color: blue;cursor: pointer" @click="rowCustomerDetails(scope.row)">{{scope.row.advanceAmount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="validAmount" label="有效金额" width="100px"  >
                <template scope="scope">
                    <div v-if="!scope.row.validAmount">{{scope.row.validAmount||0}}</div>
                    <div v-else style="color: blue;cursor: pointer" @click="rowCustomerDetails3(scope.row)">{{scope.row.validAmount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="commission" label="佣金" >
                <template scope="scope">
                    <div v-if="!scope.row.commission">{{scope.row.commission||0}}</div>
                    <div v-else style="color: blue;cursor: pointer" @click="rowCustomerDetails2(scope.row)">{{scope.row.commission}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="settleAmount" label="结算" >
            </el-table-column>
            <el-table-column prop="settlementType" label="顾问当前结算类型"  width="200px" >
                <template scope="scope">
                    {{statusText(scope.row.settlementType,'settlement_type')}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="结算状态" width="120px" >
                <template scope="scope">
                    {{statusText(scope.row.status,'settle_status')}}
                </template>
            </el-table-column>
            <el-table-column prop="settleTime" label="结算时间" width="200px">
            	<template scope="scope">
                    {{formTime(scope.row.settleTime)}}
                </template>
                </el-table-column>
            <el-table-column prop="confirmorName" label="确认人" >
            </el-table-column>
            <el-table-column prop="settlementStatus" label="请求结算" >
                <template scope="scope">
                  <span style="color: red">{{scope.row.settlementStatus==1?'是':' '}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="realName" label="操作" >
               <template scope="scope">
                   <el-button v-show="scope.row.status!=1&&btnMsg.appSettleAccountsConfirm" size="small" type="primary" @click="confirmSettle(scope.row)">确认结算</el-button>
               </template>
            </el-table-column>
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




        <el-dialog title="确认结算" :visible.sync="confirmSettleDetails" size="small" >
            <el-form :model="confirmSettleDetailsList" style='width: 80%;margin: 0 auto'>
                <el-form-item label="顾问" label-width="70px" >
                    <el-input v-model="confirmSettleDetailsList.advisorName" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="号码" label-width="70px" >
                    <el-input v-model="confirmSettleDetailsList.mobile" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="开户行" label-width="70px" >
                    <el-input v-model="confirmSettleDetailsList.bankName" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="银行账号" label-width="70px" >
                    <el-input v-model="confirmSettleDetailsList.bankAccount" auto-complete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="开户名" label-width="70px">
                    <el-input v-model="confirmSettleDetailsList.bankAccountName"  auto-complete="off" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="结算金额" label-width="70px">
                    <el-input v-model="confirmSettleDetailsList.settleAmount"  auto-complete="off" :readonly="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="confirmSettleHandle">确认</el-button>
                <el-button @click="confirmSettleCancel">取 消</el-button>
            </div>
        </el-dialog>






        <el-dialog title="有效金额" :visible.sync="rowCustomerDetailVisible3">
            <el-table :data="rowCustomerDetailList3" border style="width: 100%">
                <el-table-column prop="customerName" label="客户" >
                    <template scope="scope">
                        {{scope.row.customer.customerName}}
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="客户手机号" >
                    <template scope="scope">
                        {{scope.row.customer.mobile}}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="预定时间" >
                    <template scope="scope">
                        {{formTime(scope.row.customer.createTime)}}
                    </template>
                </el-table-column>

                <el-table-column prop="validAmount" label="有效金额" >

                </el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col>
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="rowDetailHandleSizeChange3"
                                       @current-change="rowDetailHandleCurrentChange3"
                                       :current-page="rowDetailPagination3.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="rowDetailPagination3.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="rowDetailPagination3.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

























        <el-dialog title="预支详情" :visible.sync="rowCustomerDetailVisible">
            <el-table :data="rowCustomerDetailList" border style="width: 100%">
                <el-table-column prop="customerName" label="客户" ></el-table-column>
                <el-table-column prop="mobile" label="客户手机号" ></el-table-column>
                <el-table-column prop="bookingTime" label="预定时间" >
                </el-table-column>

                <el-table-column prop="advanceAmount" label="有效金额" >

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
























        <el-dialog title="佣金详情" :visible.sync="rowCustomerDetailVisible2">
            <el-table :data="rowCustomerDetailList2" border style="width: 100%" v-loading="loading.pageList" element-loading-text="拼命加载中">
                <el-table-column prop="advisorName" label="顾问" ></el-table-column>
                <el-table-column prop="scheduleTime" label="档期" width="110px">
                    <template scope="scope">
                        {{formTime(scope.row.hsSchedule.scheduleTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="hsSchedule.storeName" label="宴会厅" >
                    <template scope="scope">
                        <span v-for="hall in scope.row.hsSchedule.banquetHallList">{{hall.hallName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="completeOrderAmount" label="成单金额" ></el-table-column>
                <el-table-column prop="commissionPercent" label="提成率" ></el-table-column>
                <el-table-column prop="commission" label="佣金" ></el-table-column>
                <el-table-column prop="type" label="收入类型" >
                    <template scope="scope">
                        {{statusText(scope.row.type,'income_type')}}
                    </template>
                </el-table-column>
            </el-table>

            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col>
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="rowDetailHandleSizeChange2"
                                       @current-change="rowDetailHandleCurrentChange2"
                                       :current-page="rowDetailPagination2.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="rowDetailPagination2.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="rowDetailPagination2.total">
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
                confirmSettleDetails:false,
                confirmSettleDetailsList:{

                },
                loading:{
                    pageList:false,
                    detail:false
                },
                fullscreenLoading: false,
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
                    billingRecordsId:''
                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchSettleList.startDate;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                researchSettleList:{
                    startDate:'',
                    endDate:'',
                    status:"",
                    account:'',
                    cityCode:''
                },
                openCity:[],
                storeCitys:[],
                researchSettleListWidth:'120px',
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
                rowCustomerDetailVisible3:false,
                rowCustomerDetailTitle3:'',
                rowCustomerDetailList3:[],
                rowDetailPagination3:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                rowCustomerDetailVisible2:false,
                rowCustomerDetailList2:[],
                rowDetailPagination2:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                dec:{
                    settle_status:[],
                    income_type:[],
                    settlement_type:[],
                    advisor_settlement_status:[]
                },
                btnMsg:{
                    appSettleAccountsAdvanceDetails:false,//本次预支详情
                    appSettleAccountsCommissionDetails:false,//佣金详情
                    appSettleAccountsConfirm:false//确认结算
                }
            }
        },
        methods: {
            initBtnMsg(){
                this.btnMsg.appSettleAccountsAdvanceDetails=filterBtnPms(this.btnAllPms.appSettleAccountsAdvanceDetails);
                this.btnMsg.appSettleAccountsCommissionDetails=filterBtnPms(this.btnAllPms.appSettleAccountsCommissionDetails);
                this.btnMsg.appSettleAccountsConfirm=filterBtnPms(this.btnAllPms.appSettleAccountsConfirm);
            },
            confirmSettleCancel(){
                this.confirmSettleDetails=false
            },
            confirmSettleHandle(){
                this.$confirm('此操作将确认结算, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/customer/confirmSettle',{billingRecordsId:this.confirmSettleDetailsList.id}).then((res)=>{
                        if(res.status==200){
                            this.$message({
                                type: 'success',
                                message: '确认成功!'
                            });
                            this.initCustomerList(this.tableData)
                        }else {
                            this.$message({
                                type: 'info',
                                message: res.data.msg
                            });
                        }
                        this.confirmSettleDetails=false
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            confirmSettle(row){
                this.confirmSettleDetails=true
                this.confirmSettleDetailsList=row
            },
            rowCustomerDetails(row){
                if(this.btnMsg.appSettleAccountsAdvanceDetails){
                    this.rowCustomerDetailVisible=true
                    this.saveDate.billingRecordsId=row.id
                    this.initCustomerDetails(this.rowDetailTableData)
                }
            },
            rowDetailHandleSizeChange(val) {
                this.rowDetailPagination.pageSize = val;
                this.initCustomerDetails(this.rowDetailTableData)
            },
            rowDetailHandleCurrentChange(val) {
                this.rowDetailPagination.pageNow = val;
                this.initCustomerDetails(this.rowDetailTableData)
            },


            rowCustomerDetails2(row){
                if(this.btnMsg.appSettleAccountsCommissionDetails){
                    this.rowCustomerDetailVisible2=true
                    this.saveDate.billingRecordsId=row.id
                    this.initCustomerDetails2(this.rowDetailTableData2)
                }
            },
            rowDetailHandleSizeChange2(val) {
                this.rowDetailPagination2.pageSize = val;
                this.initCustomerDetails2(this.rowDetailTableData2)
            },
            rowDetailHandleCurrentChange2(val) {
                this.rowDetailPagination2.pageNow = val;
                this.initCustomerDetails2(this.rowDetailTableData2)
            },


            rowCustomerDetails3(row){
                this.rowCustomerDetailVisible3=true
                this.saveDate.billingRecordsId=row.id
                this.initCustomerDetails3(this.rowDetailTableData3)
            },
            rowDetailHandleSizeChange3(val) {
                this.rowDetailPagination3.pageSize = val;
                this.initCustomerDetails3(this.rowDetailTableData3)
            },
            rowDetailHandleCurrentChange3(val) {
                this.rowDetailPagination3.pageNow = val;
                this.initCustomerDetails3(this.rowDetailTableData3)
            },



            initCustomerDetails3(data){
                this.$axios.post('/customer/queryValidAmountList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.rowDetailPagination3.total=res.data.msg.total;
                        this.rowDetailPagination3.pageNum=res.data.msg.pageNum;
                        this.rowDetailPagination3.pageSize=res.data.msg.pageSize;
                        this.rowCustomerDetailList3=res.data.msg.list;
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            initCustomerDetails2(data){
                this.loading.pageList=true
                this.$axios.post('/customer/queryCommissionList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.rowDetailPagination2.total=res.data.msg.total;
                        this.rowDetailPagination2.pageNum=res.data.msg.pageNum;
                        this.rowDetailPagination2.pageSize=res.data.msg.pageSize;
                        this.rowCustomerDetailList2=res.data.msg.list;
                        this.loading.pageList=false
                    }else {
                        this.loading.pageList=false
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            initCustomerDetails(data){
                this.$axios.post('/customer/queryAdvanceList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.rowDetailPagination.total=res.data.msg.total;
                        this.rowDetailPagination.pageNum=res.data.msg.pageNum;
                        this.rowDetailPagination.pageSize=res.data.msg.pageSize;
                        this.rowCustomerDetailList=res.data.msg.list;
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
                this.researchSettleList.startDate=this.researchSettleList.startDate?moment(this.researchSettleList.startDate).format('YYYY-MM-DD'):''
                this.researchSettleList.endDate=this.researchSettleList.endDate?moment(this.researchSettleList.endDate).format('YYYY-MM-DD'):''
                if(getDays(this.researchSettleList.startDate,this.researchSettleList.endDate)>7){
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为7天！',
                        offset: 100
                    });
                }else {
                    this.initCustomerList(this.tableData)
                }
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            startDateChange(val){
                this.researchSettleList.startDate = val
            },
            endDateChange(val){
                this.researchSettleList.endDate = val
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
                this.$loading({text:'拼命加载中'})
                this.$axios.post('/customer/querySettleList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.ReceivablesConfirmList=res.data.msg.list;
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                    this.$loading().close()
                })
            },
            formTime(row){
                if(row == null){
                    return null
                }else if(/(\d)\1{4}/g.test(row)){
                    return moment(row).format('YYYY-MM-DD')
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
                this.dec.settle_status=this.dicData.SETTLE_STATUS
                this.dec.income_type=this.dicData.INCOME_DETAILS_TYPE
                this.dec.settlement_type=this.dicData.SETTLEMENT_TYPE
                this.dec.advisor_settlement_status=this.dicData.ADVISOR_SETTLEMENT_STATUS
            },
            initCity(){ //初始化默认用户城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.researchSettleList.cityCode=this.storeCitys[0].cityCode
            },
            initOpenCity(){ //所有开通城市
                this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
                    if(res2.status == 200){
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
        },
        computed:{
            tableData(){
                return {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'startDate':this.researchSettleList.startDate,
                    'endDate':this.researchSettleList.endDate,
                    "account":this.researchSettleList.account,
                    'status':this.researchSettleList.status,
                    'cityCode':this.researchSettleList.cityCode,
            }
            },
            rowDetailTableData(){
                return {
                    "pageNow":this.rowDetailPagination.pageNow,
                    "pageSize":this.rowDetailPagination.pageSize,
                    'billingRecordsId':this.saveDate.billingRecordsId

                }
            },
            rowDetailTableData2(){
                return {
                    "pageNow":this.rowDetailPagination2.pageNow,
                    "pageSize":this.rowDetailPagination2.pageSize,
                    'billingRecordsId':this.saveDate.billingRecordsId

                }
            },
            rowDetailTableData3(){
                return {
                    "pageNow":this.rowDetailPagination3.pageNow,
                    "pageSize":this.rowDetailPagination3.pageSize,
                    'billingRecordsId':this.saveDate.billingRecordsId

                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
            this.initCity()
            this.initOpenCity()
            this.initCustomerList(this.tableData)
            this.initBtnMsg()
            this.initDec();
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
