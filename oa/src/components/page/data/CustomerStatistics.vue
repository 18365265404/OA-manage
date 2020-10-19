<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>BD数据管理</el-breadcrumb-item>
            <el-breadcrumb-item>客户数据统计</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" :model="researchCustomerList" ref="researchCustomerList" class="demo-form-inline">
            <el-row>
                <el-col>
                    <el-form-item  prop='status'>
                        <el-select v-model='researchCustomerList.status' @change="changeStatus" clearable placeholder="数据状态">
                            <el-option
                                v-for="(item,i) in dec.customer_status"
                                :key="i"
                                :label="item.dicDesc"
                                :value="item.dicValue"
                                size="small"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop='channelId'>
                        <el-select v-model='researchCustomerList.channelId' clearable placeholder="渠道">
                            <el-option
                                v-for="(item,i) in channelList"
                                :key="i"
                                :label="item.nickName"
                                :value="item.id"
                                size="small"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop='dateTimeStar' :label-width="researchCustomerListWidth">
                        <div class="block">
                            <el-date-picker
                                v-model="researchCustomerList.dateTimeStar"
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
                    <el-form-item  prop='dateTimeStop' :label-width="researchCustomerListWidth">
                        <el-tooltip class="item" effect="dark" content="终止日期为31天以内" placement="top-end">

                            <div class="block">
                                <el-date-picker
                                    v-model="researchCustomerList.dateTimeStop"
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
                        <el-button size="small" type="primary" @click="resetForm('researchCustomerList')">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>


        </el-form>
        <el-table :data="ReceivablesConfirmList" border style="width: 100%"
                  v-loading="loading2"
                  element-loading-text="拼命加载中">
            <el-table-column prop="saleName" label="销售" ></el-table-column>
            <el-table-column prop="channelName" label="来源渠道" ></el-table-column>
            <el-table-column prop="validData" label="数据" >
                <template scope="scope">
                    <div v-if="!scope.row.validData">{{scope.row.singleVolume||0}}</div>
                    <div v-else style="color: blue;cursor: pointer" @click="toAllCustomerPage(scope.row,saveData.status,researchCustomerList.status,false)">{{scope.row.validData}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="completeData" label="签单" >
                <template scope="scope">
                    <div v-if="!scope.row.completeData">{{scope.row.completeData||0}}</div>
                    <div v-else style="color: blue;cursor: pointer" @click="toAllCustomerPage(scope.row,5,researchCustomerList.status,true)">{{scope.row.completeData}}</div>
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
                loading2: true,
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }
                },
                toAllCustomerPageData:{
                    salesId:"",
                    status:'',
                    startDate:'',
                    endDate:'',
                    saveStatus:false,
                    oldStatus:''
                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchCustomerList.dateTimeStar;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                researchCustomerList:{
                    dateTimeStar:'',
                    dateTimeStop:'',
                    status:"",
                    channelId:''
                },
                researchCustomerListWidth:'120px',
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                saveData:{
                    status:''
                },
                ReceivablesConfirmList:[],
                dec:{
                    customer_status:[]
                },
                channelList:[]
            }
        },
        methods: {
            changeStatus(){
                this.toAllCustomerPageData.saveStatus=true
            },
            toAllCustomerPage(row,status,oldStatus,saveStatus){
                this.toAllCustomerPageData.salesId=row.id
                this.toAllCustomerPageData.status=status
                this.toAllCustomerPageData.oldStatus=oldStatus
                this.toAllCustomerPageData.saveStatus=saveStatus
                this.toAllCustomerPageData.startDate=this.toAllCustomerPageData.startDate?this.toAllCustomerPageData.startDate:moment().subtract(30,'days').format('YYYY-MM-DD');
                this.toAllCustomerPageData.endDate=this.toAllCustomerPageData.endDate?this.toAllCustomerPageData.endDate:moment().format('YYYY-MM-DD');
                this.$store.dispatch("loadingCustomerData",this.toAllCustomerPageData)
                this.$router.push({path:'/customer/allCustomer', query: {
                    t: +parseInt(500*Math.random()) //保证每次点击路由的query项都是不一样的，确保会重新刷新view
                }})
            },
            submitChannelsTable(){
                this.researchCustomerList.dateTimeStar=this.researchCustomerList.dateTimeStar?moment(this.researchCustomerList.dateTimeStar).format('YYYY-MM-DD'):''
                this.researchCustomerList.dateTimeStop=this.researchCustomerList.dateTimeStop?moment(this.researchCustomerList.dateTimeStop).format('YYYY-MM-DD'):''
                if(getDays(this.researchCustomerList.dateTimeStar,this.researchCustomerList.dateTimeStop)>31){
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为31天！',
                        offset: 100
                    });
                }else {
                    this.initCustomerList(this.tableData)
                    this.toAllCustomerPageData.startDate=this.researchCustomerList.dateTimeStar
                    this.toAllCustomerPageData.endDate=this.researchCustomerList.dateTimeStop
                    this.saveData.status=this.researchCustomerList.status
                }
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            dateTimeStarChange(val){
                this.researchCustomerList.dateTimeStar = val
            },
            dateTimeStopChange(val){
                this.researchCustomerList.dateTimeStop = val
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
                this.$axios.post('/customer/hsCustomerStatisticsList',data).then((res)=> {
                    this.loading2=false;
                    if (res.data.res == '0') {
//                        <!--let data={-->
//                            <!--"list": [-->
//                                <!--{-->
//                                    <!--"channelName": "333",-->
//                                    <!--"completeData": 66,-->
//                                    <!--"groupName": "222",-->
//                                    <!--"id": "123",-->
//                                    <!--"saleName": "444",-->
//                                    <!--"validData": 77-->
//                                <!--}-->
//                            <!--],-->
//                            <!--"pageNum": 1,-->
//                            <!--"pageSize": 10,-->
//                            <!--"pages": 1,-->
//                            <!--"sEcho": null,-->
//                            <!--"size": 1,-->
//                            <!--"total": 1-->
//                        <!--}-->
//                        this.pagination.total=data.total;
//                        this.pagination.pageNum=data.pageNum;
//                        this.pagination.pageSize=data.pageSize;
//                        this.ReceivablesConfirmList=data.list;

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
                this.loading2=true;
            },
            initDec(){
                this.dec.customer_status=this.dicData.HS_CUSTOMER_STATUS
            },
            initChannelList(){
                this.$axios.post('/s/getChannelList').then((res)=> {
                    if (res.data.res == '0') {
//                        this.pagination.total=data.total;
//                        this.pagination.pageNum=data.pageNum;
//                        this.pagination.pageSize=data.pageSize;
//                        this.ReceivablesConfirmList=data.list;


                    this.channelList=res.data.msg
                        this.initDec();
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })

            }

        },
        computed:{
            tableData(){
                return {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'dateTimeStar':this.researchCustomerList.dateTimeStar,
                    'dateTimeStop':this.researchCustomerList.dateTimeStop,
                    status:this.researchCustomerList.status,
                    channelId:this.researchCustomerList.channelId
                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms',
                'customer'
            ])
        },
        mounted(){
            this.initChannelList()
            if(this.customer.salesId){
                let data={
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    "salesId":this.customer.salesId,
                    "dateTimeStar":this.customer.startDate,
                    "dateTimeStop":this.customer.endDate
                }
                data.status=this.customer.oldStatus
                console.log(this.customer.oldStatus)
//                if(!this.customer.saveStatus){
//                    this.researchCustomerList.status=this.customer.status;
//                }else {
//                    this.researchCustomerList.status=this.customer.oldStatus;
//                }
                this.researchCustomerList.status=this.customer.oldStatus;
                this.researchCustomerList.oldStatus=this.customer.oldStatus;
                this.researchCustomerList.dateTimeStop=this.customer.endDate;
                this.researchCustomerList.dateTimeStar=this.customer.startDate;
                this.saveData.status=this.researchCustomerList.status
                this.initCustomerList(data);
                this.$store.dispatch("removeCustomerData")
            }else {
                this.researchCustomerList.dateTimeStop=moment().format('YYYY-MM-DD');
                this.researchCustomerList.dateTimeStar=moment().subtract(30,'days').format('YYYY-MM-DD');
                this.initCustomerList(this.tableData)
            }
            this.toAllCustomerPageData.startDate=this.researchCustomerList.dateTimeStar
            this.toAllCustomerPageData.endDate=this.researchCustomerList.dateTimeStop




        }
    }
</script>
