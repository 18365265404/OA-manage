<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>合同订单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row type="flex" justify="end" v-if='btnP.agreementListExcel'>
            <el-col :span="3">
                <el-button  size="small" type="primary" @click="getAgreementExcel" >导出EXL</el-button>
            </el-col>
        </el-row>
        <el-form :inline="true" :model="researchAgreement" ref="researchAgreement" class="demo-form-inline">
            <el-row type="flex" justify="center" style="width: 90%;margin: 20px auto" >
                <el-col :span="9">
                    <el-form-item  prop='scheduleTimeStart' :label-width="researchAgreementWidth">
                        <div class="block">
                            <el-date-picker
                                v-model="researchAgreement.scheduleTimeStart"
                                type="date"
                                :editable="false"
                                placeholder="档期起始日期"
                                format="yyyy-MM-dd"
                                :picker-options="pickerBeginDateBefore"
                                size="small"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item  prop='scheduleTimeEnd' :label-width="researchAgreementWidth">
                        <el-tooltip class="item" effect="dark" content="终止日期为60天以内" placement="top-end">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchAgreement.scheduleTimeEnd"
                                    type="date"
                                    :editable="false"
                                    placeholder="档期结束日期"  format="yyyy-MM-dd"
                                    :picker-options="pickerBeginDateAfter"
                                    size="small"
                                >
                                </el-date-picker>
                            </div>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item  prop='createTimeStart' :label-width="researchAgreementWidth">
                        <div class="block">
                            <el-date-picker
                                v-model="researchAgreement.createTimeStart"
                                type="date"
                                :editable="false"
                                placeholder="合同起始日期"
                                format="yyyy-MM-dd"
                                :picker-options="pickerBeginDateBefore2"
                                size="small"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item  prop='createTimeEnd' :label-width="researchAgreementWidth">
                        <el-tooltip class="item" effect="dark" content="终止日期为60天以内" placement="top-end">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchAgreement.createTimeEnd"
                                    type="date"
                                    :editable="false"
                                    placeholder="合同结束日期"  format="yyyy-MM-dd"
                                    :picker-options="pickerBeginDateAfter2"
                                    size="small"
                                >
                                </el-date-picker>
                            </div>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item  prop='agreementNo' :label-width="researchAgreementWidth">
                        <el-input  v-model="researchAgreement.agreementNo" placeholder="合同编号" size="small"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item  prop='groomName' :label-width="researchAgreementWidth">
                        <el-input  v-model="researchAgreement.groomName" placeholder="新郎" size="small"></el-input>
                    </el-form-item>
                    <el-form-item  prop='brideName' :label-width="researchAgreementWidth">
                        <el-input  v-model="researchAgreement.brideName" placeholder="新娘" size="small"></el-input>
                    </el-form-item>
                    <el-form-item  prop='creatorName' :label-width="researchAgreementWidth">
                        <el-input  v-model="researchAgreement.creatorName" placeholder="签单人" size="small"></el-input>
                    </el-form-item>
                    <el-form-item  prop="orderType">
                        <el-select v-model="researchAgreement.orderType" placeholder="订单类型" size="small">
                            <el-option
                                v-for="item in dec.data_type"
                                :key="item.dicDesc"
                                :label="item.dicDesc"
                                :value="item.dicValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label-width="researchAgreementWidth" prop="hallId">
                        <el-select  size="small" v-model="researchAgreement.hallId" placeholder="宴会厅">
                            <el-option v-for="hall in hallList"
                                       :key="hall.id"
                                       :label="hall.hallName"
                                       :value="hall.id">

                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label-width="researchAgreementWidth">
                        <el-select @change='changeCity' v-model="researchAgreement.cityCode" placeholder="城市" size="small">
                            <el-option
                                v-for="item in storeCitys"
                                :key="item.cityCode"
                                :label="item.cityName"
                                :value="item.cityCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-button size="small" type="primary" @click="submitAssignedOrder">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  size="small" type="primary" @click="resetForm('researchAgreement')">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="AgreementListTable" border style="width: 100%" v-loading="loading.pageList" element-loading-text="拼命加载中">
            <el-table-column prop="agreementNo" label="合同编号" width="150px"></el-table-column>
            <el-table-column prop="groomName" label="新郎" width="100px">
            </el-table-column>
            <el-table-column prop="brideName" label="新娘" width="100px" >
            </el-table-column>
            <el-table-column prop="creatorName" label="签单人"width="100px" >
            </el-table-column>
            <el-table-column prop="scheduleTime" label="档期"  width="120px" >
                <template scope="scope">
                    {{formTime1(scope.row.scheduleTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="groomMobile" label="类型" width="100px">
            </el-table-column>
            <el-table-column prop="createTime" label="合同日期" width="180px">
                <template scope="scope">
                    {{formTime1(scope.row.createTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="storeName" label="店" width="140px">
            </el-table-column>
            <el-table-column prop="banquetHallName" label="宴会厅" width="120px">
            </el-table-column>
            <el-table-column prop="tableNumber" label="桌数" width="100px">
            </el-table-column>
            <el-table-column prop="packageAmount" label="套系价格" width="120px">
            </el-table-column>
            <el-table-column prop="packageOuterAmount" label="套系外价格" width="120px" >
            </el-table-column>
            <el-table-column prop="totalAmount" label="合同总价" width="100px">
            </el-table-column>
            <el-table-column prop="channelName" label="渠道来源" width="100px">
            </el-table-column>
            <el-table-column prop="deposit" label="定金" width="100px">
            </el-table-column>
            <el-table-column prop="depositPercentage" label="定金比例" width="100px">
            </el-table-column>
            <el-table-column prop="depositReceivedLastTime" label="定金最晚应付时间"  width="160px">
                <template scope="scope">
                    {{formTime1(scope.row.depositReceivedLastTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="depositReceivedTime" label="定金付讫时间"  width="140px">
                <template scope="scope">
                    {{formTime1(scope.row.depositReceivedTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="depositPaymentDetails" label="定金付款方式" width="160px">
            </el-table-column>
            <el-table-column prop="middle" label="中款" >
            </el-table-column>
            <el-table-column prop="middleReceivedLastTime" label="中款最晚应付时间"  width="160px" >
                <template scope="scope">
                    {{formTime1(scope.row.middleReceivedLastTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="middleReceivedTime" label="中款付讫时间" width="140px" >
                <template scope="scope">
                    {{formTime1(scope.row.middleReceivedTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="finalFunds" label="尾款" >
            </el-table-column>
            <el-table-column prop="finalReceivedLastTime" label="尾款最晚应付时间"  width="160px" >
                <template scope="scope">
                    {{formTime1(scope.row.finalReceivedLastTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="finalReceivedTime" label="尾款付讫时间"  width="140px" >
                <template scope="scope">
                    {{formTime1(scope.row.finalReceivedTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="addTableNumber" label="加桌及二销" >
            </el-table-column>
            <el-table-column prop="addPaymentTime" label="加单实际付款日期"   width="160px">
                <template scope="scope">
                    {{formTime1(scope.row.addPaymentTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="finalAmount" label="最终消费金额" width="120px">
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
                loading:{
                    pageList:false,
                    detail:false
                },
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                AgreementListTable:[],
                researchAgreement:{
                    cityCode:'',
                    orderType:'',
                    hallId:"",
                    createTimeStart:'',
                    createTimeEnd:'',
                    scheduleTimeStart:'',
                    scheduleTimeEnd:'',
                    creatorName:'',
                    brideName:'',
                    groomName:'',
                    agreementNo:''
                },
                researchAgreementWidth:'80px',
                beforeTime:'',
                beforeTime2:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }

                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchAgreement.scheduleTimeStart;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                pickerBeginDateBefore2:{
                    disabledDate:(time)=>{
                        this.beforeTime2=time.getTime()
                    }

                },
                pickerBeginDateAfter2:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchAgreement.createTimeStart;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                hallList:[],
                dec:{
                    data_type:[]
                },
                storeCitys:[],
                openCity:[],
                btnP:{
                	agreementListExcel:''
                }
            }
        },
        methods: {
            getAgreementExcel(){
                this.$confirm('此操作将下载EXL, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.open(this.exlUrl)


                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            submitAssignedOrder(){
                this.researchAgreement.createTimeStart=this.researchAgreement.createTimeStart?moment(this.researchAgreement.createTimeStart).format('YYYY-MM-DD'):''
                this.researchAgreement.createTimeEnd=this.researchAgreement.createTimeEnd?moment(this.researchAgreement.createTimeEnd).format('YYYY-MM-DD'):''
                this.researchAgreement.scheduleTimeStart=this.researchAgreement.scheduleTimeStart?moment(this.researchAgreement.scheduleTimeStart).format('YYYY-MM-DD'):''
                this.researchAgreement.scheduleTimeEnd=this.researchAgreement.scheduleTimeEnd?moment(this.researchAgreement.scheduleTimeEnd).format('YYYY-MM-DD'):''
                if(getDays(this.researchAgreement.createTimeStart,this.researchAgreement.createTimeEnd)>60||getDays(this.researchAgreement.scheduleTimeStart,this.researchAgreement.scheduleTimeEnd)>60){
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为60天！',
                        offset: 100
                    });
                }else {
                    this.initAgreementList(this.tableData)
                }
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            dateTimeStartChange(val){
                this.researchAgreement.dateTimeStart = val
            },
            dateTimeStopChange(val){
                this.researchAgreement.dateTimeStop = val
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initAgreementList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initAgreementList(this.tableData)
            },
            initAgreementList(data){
                this.loading.pageList=true
                this.$axios.post('/order/getAgreementList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.AgreementListTable=res.data.msg.list;
                        this.initDec()
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
            formTime1(row){
                if(row == null){
                    return null
                }
                else{
                    return moment(row).format('YYYY-MM-DD')
                }
            },
            initHallList(){ //获得所有厅信息
                this.$axios.get('/store/getHallList',{params:{pageSize:100,'cityCode':this.researchAgreement.cityCode,'status':0}}).then((res)=> {
                    if (res.data.res == '0') {
                        this.hallList=res.data.msg.list
                    }
                })
            },
            initCity(){ //初始化默认用户城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.researchAgreement.cityCode=this.storeCitys[0].cityCode
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
            changeCity(){
            	this.initHallList()
            	this.initAgreementList(this.tableData)
            },
            initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
//                this.dec.order_status=this.dicData.HS_ORDER_STATUS//订单状态
//                this.dec.schedule_status=this.dicData.HS_SCHEDULE_STATUS //档期状态
//                this.dec.agreement_status=this.dicData.HS_AGREEMENT_STATUS//合同状态
//                this.dec.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
            }
        },
        computed:{
            tableData(){
              return{
                  "pageNow":this.pagination.pageNow,
                  "pageSize":this.pagination.pageSize,
                      "cityCode":this.researchAgreement.cityCode,
                      "orderType":this.researchAgreement.orderType,
                      "hallId":this.researchAgreement.hallId,
                      "createTimeStart":this.researchAgreement.createTimeStart,
                      "createTimeEnd":this.researchAgreement.createTimeEnd,
                      "scheduleTimeStart":this.researchAgreement.scheduleTimeStart,
                      "scheduleTimeEnd":this.researchAgreement.scheduleTimeEnd,
                      "creatorName":this.researchAgreement.creatorName,
                      "brideName":this.researchAgreement.brideName,
                      "groomName":this.researchAgreement.groomName,
                      "agreementNo":this.researchAgreement.agreementNo
              }
            },
            exlUrl(){
               return 'http://'+this.dicExlUrl+'/order/getAgreementExcel?'+
               'cityCode='+this.researchAgreement.cityCode+
               '&orderType='+this.researchAgreement.orderType+
               '&hallId='+this.researchAgreement.hallId+
               '&createTimeStart='+this.researchAgreement.createTimeStart+
               '&createTimeEnd='+this.researchAgreement.createTimeEnd+
               '&scheduleTimeStart='+this.researchAgreement.scheduleTimeStart+
               '&scheduleTimeEnd='+this.researchAgreement.scheduleTimeEnd+
               '&creatorName='+this.researchAgreement.creatorName+
               '&brideName='+this.researchAgreement.brideName+
               '&groomName='+this.researchAgreement.groomName+
               '&agreementNo='+this.researchAgreement.agreementNo
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms',
                'dicExlUrl'
            ])
        },
        mounted(){
        	this.btnP = {
                	agreementListExcel:filterBtnPms(this.btnAllPms.agreementListExcel)
                }
            this.initHallList()
            this.initCity()
            this.initOpenCity()
            this.initAgreementList(this.tableData)
        }
    }
</script>
