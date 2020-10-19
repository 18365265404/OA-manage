<template>
    <div>
        <div class="crumbs">
        	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm">
            		<el-form-item label="城市:" prop='city'>
						<el-select v-model='cityNames.city' @change='changeCity' placeholder="请选择">
						    <el-option
						      v-for="type in storeCitys"
						      :key="type.cityCode"
		                      :label="type.cityName"
		                      :value="type.cityCode">
						    </el-option>
						</el-select>
					</el-form-item>
				</el-form>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>BD数据管理</el-breadcrumb-item>
            <el-breadcrumb-item>销售跟进统计</el-breadcrumb-item>
        </el-breadcrumb>
        </div>
        <!--<div class="saleFollowUpTips">-->
           <!--查询日期: {{saveDate.startDate}}&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;{{saveDate.endDate}}-->
           <!--<span> （默认查询当前日期处理的数据）</span>-->
        <!--</div>-->
        <div>
            <el-form :inline="true" :model="researchSalesFollowupTable" ref="researchSalesFollowupTable" class="demo-form-inline">
                <el-row>
                    <el-col>
                        <el-form-item :label-width="researchSalesFollowupTableWidth" prop="channelId">
                            <el-select size="small" v-model="researchSalesFollowupTable.channelId" placeholder="来源方">
                                <el-option
                                    v-for="item in  channelList"
                                    :key="item.id"
                                    :label="item.nickName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label-width="researchSalesFollowupTableWidth" prop="salesId">
                            <el-select  size="small" v-model="researchSalesFollowupTable.salesId" placeholder="销售">
                                <el-option
                                    v-for="item in salesList"
                                    :key="item.id"
                                    :label="item.nickName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item  :label-width="researchSalesFollowupTableWidth">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchSalesFollowupTable.startDate"
                                    type="date"
                                    :editable="false"
                                    placeholder="起始日期"
                                    @change="changeResearchStart"
                                    :picker-options="pickerBeginDateBefore"
                                    size="small"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item   :label-width="researchSalesFollowupTableWidth">
                            <!--<el-tooltip class="item" effect="dark" content="终止日期为7天以内" placement="top-end">-->

                                <div class="block">
                                    <el-date-picker
                                        v-model="researchSalesFollowupTable.endDate"
                                        type="date"
                                        @change="changeResearchEnd"
                                        :editable="false"
                                        placeholder="终止日期"
                                        :picker-options="pickerBeginDateAfter"
                                        size="small"
                                    >
                                    </el-date-picker>
                                </div>
                            <!--</el-tooltip>-->
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitSalesFollowupTable">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button  size="small" type="primary" @click="resetForm('researchSalesFollowupTable')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>
        </div>
        <el-table :data="SalesFollowupTableData" border style="width: 100%"  v-loading="loading2" element-loading-text="拼命加载中">
            <el-table-column prop="salesName" label="销售" ></el-table-column>
            <el-table-column prop="validCount" label="总有效" >
                <template scope="scope">
                    <div v-if="scope.row.validCount" @click="tableDetailsRow(scope.row,0)" style="color:red;cursor:pointer">{{scope.row.validCount}}</div>
                    <div v-else>{{scope.row.validCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="currentValidCount" label="当前有效" >
                <template scope="scope">
                    <div v-if="scope.row.currentValidCount" @click="tableDetailsRow(scope.row,9)" style="color:red;cursor:pointer">{{scope.row.currentValidCount}}</div>
                    <div v-else>{{scope.row.currentValidCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="newIntentCount" label="新增意向到店"  >
                <template scope="scope">
                    <div v-if="scope.row.newIntentCount" @click="tableDetailsRow(scope.row,1)" style="color:red;cursor:pointer">{{scope.row.newIntentCount}}</div>
                    <div v-else>{{scope.row.newIntentCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="有效/意向转化率" width="150px" >
                <template scope="scope">
                    {{computedPercent(scope.row.newIntentCount,scope.row.validCount)}}</template>
            </el-table-column>
            <el-table-column prop="intentArrivalStoreCount" label="总意向到店" >
                <template scope="scope">
                    <div v-if="scope.row.intentArrivalStoreCount" @click="tableDetailsRow(scope.row,2)" style="color:red;cursor:pointer">{{scope.row.intentArrivalStoreCount}}</div>
                    <div v-else>{{scope.row.intentArrivalStoreCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="newArrivalStoreCount" label="新增到店" >
                <template scope="scope">
                    <div v-if="scope.row.newArrivalStoreCount" @click="tableDetailsRow(scope.row,6)" style="color:red;cursor:pointer">{{scope.row.newArrivalStoreCount}}</div>
                    <div v-else>{{scope.row.newArrivalStoreCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="意向/到店转化率" width="150px">
                <template scope="scope">
                    {{computedPercent(scope.row.newArrivalStoreCount,scope.row.intentArrivalStoreCount)}}
                </template>
            </el-table-column>
            <el-table-column prop="arrivalStoreCount" label="总到店" >
                <template scope="scope">
                    <div v-if="scope.row.arrivalStoreCount" @click="tableDetailsRow(scope.row,7)" style="color:red;cursor:pointer">{{scope.row.arrivalStoreCount}}</div>
                    <div v-else>{{scope.row.arrivalStoreCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="newOrderCount" label="新增成单" >
                <template scope="scope">
                    <div v-if="scope.row.newOrderCount" @click="tableDetailsRow(scope.row,8)" style="color:red;cursor:pointer">{{scope.row.newOrderCount}}</div>
                    <div v-else>{{scope.row.newOrderCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="到店/成单转化率" width="150px">
                <template scope="scope">
                    {{computedPercent(scope.row.newOrderCount,scope.row.arrivalStoreCount)}}
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="总成单转化率" >
                <template scope="scope">
                    {{computedPercent(scope.row.newOrderCount,scope.row.validCount)}}
                </template>
            </el-table-column>
            <el-table-column prop="oldDataCount" label="原有数据" >
                <template scope="scope">
                    <div v-if="scope.row.oldDataCount" @click="tableDetailsRow(scope.row,4)" style="color:red;cursor:pointer">{{scope.row.oldDataCount}}</div>
                    <div v-else>{{scope.row.oldDataCount}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="newDataCount" label="新增数据" >
                <template scope="scope">
                    <div v-if="scope.row.newDataCount" @click="tableDetailsRow(scope.row,5)" style="color:red;cursor:pointer">{{scope.row.newDataCount}}</div>
                    <div v-else>{{scope.row.newDataCount}}</div>
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
        <el-dialog  :visible.sync="dialogFollowUpVisible" size="large">
            <el-table :data="followUpDialogTable">
                <el-table-column prop="customerName" label="客户名称" ></el-table-column>
                <el-table-column prop="customerMobile" label="客户手机号"></el-table-column>
                <el-table-column prop="followupTime" label="处理时间">
                    <template scope="scope">
                        {{form(scope.row.followupTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="followupStatus" label="状态">
                    <template scope="scope">
                        {{statusText(scope.row.followupStatus)}}
                    </template>
                </el-table-column>
                <el-table-column prop="reserveTime" label="查看" width="110px" >
                    <template scope="scope">
                        <el-button   size="mini"   type="text"  @click="showFollowDetail(scope.row)">跟进详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="followDialogHandleSizeChange"
                                       @current-change="followDialogHandleCurrentChange"
                                       :current-page="followDialogPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="followDialogPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="followDialogPagination.total">>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog  :visible.sync="showFollowDetailVisible" >
            <el-table :data="showFollowDetailsTable" border   v-loading="loading3" element-loading-text="拼命加载中">
                <el-table-column property="createTime" label="更新时间" :formatter="formTime1"></el-table-column>
                <el-table-column property="operatorName" label="操作人" ></el-table-column>
                <el-table-column property="operator" label="操作"></el-table-column>
                <el-table-column property="operatorStatus" label="提交状态"></el-table-column>
                <el-table-column property="commonFileList" label="图片">
                    <template scope="scope">
                        <el-button type="text" v-if="scope.row.commonFileList.length" @click="showImgDial(scope.row)">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column property="remark" label="内容" width="200px"></el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="followHandleSizeChange"
                                       @current-change="followHandleCurrentChange"
                                       :current-page="followPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="followPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="followPagination.total">>
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
    require('swiper/dist/css/swiper.css')
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
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
            	storeCitys:[],
            	cityNames:{
                	city:''
                },
                loading2: true,
                loading3:true,
                QiNiuUrl:'',
                swiperOption: {
                    pagination : '.swiper-pagination',
                    paginationClickable :true,
                    mousewheelControl : true,
                    zoom: true,
                    zoomMax :2
                },
                swiperSlides: [],
                dialogImgVisible:false,
                imageIndex: 0,
                show:false,
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }

                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
//                        let beginDateVal = this.researchSalesFollowupTable.startDate;
//                        if (beginDateVal) {
//                            return time.getTime() < beginDateVal;
//                        }
                        this.endTime=time.getTime()
                    }
                },
                SalesFollowupTableData:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                researchSalesFollowupTable:{
                    channelId:"",
                    salesId:'',
                    endDate:'',
                    startDate:''
                },
                saveDate:{
                    endDate:'',
                    startDate:''
                },
                researchSalesFollowupTableWidth:"120px",
                channelList:[],
                salesList:[],
                dialogFollowUpVisible:false,
                followUpDialogTable:[],
                followDialogPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                followDetail:{
                    salesId:'',
                    operationType:null
                },
                followupStatus:[],
                showFollowDetailVisible:false,
                showFollowDetailsTable:[],
                storeStatus:[],
                lastOprations:[],
                followPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                customer:{
                    customerId:''
                }
            }
        },
        methods:{
        	getOpenCity(){
            	this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
					   	if(res2.data.res == 0){

					   		this.citys =  res2.data.msg;
	  							this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
	  							this.storeCitys.forEach((e)=>{
						                this.citys.forEach((n)=>{
							                if( n.cityCode==e.cityCode){
							                    e.cityName = n.cityName
							                     this.cityNames.city = this.storeCitys[0].cityCode
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
            	this.initChannelList()
            },
            changeResearchStart(val){
                this.researchSalesFollowupTable.startDate = val
            },
            changeResearchEnd(val){
                this.researchSalesFollowupTable.endDate = val
            },
            getQiNiuUrlUsingGET(){
                this.$axios.get('/b/getQiNiuUrl').then((res2)=>{    //获取所有城市列表
                    if(res2.status == 200){
                        console.log(res2)
                        this.QiNiuUrl=res2.data.msg
                    }
                    else{
                        alert(res2.data.msg)
                    }
                })
            },
            showImgDial(row){
                this.swiperSlides=[],
                    row.commonFileList.map((n)=>{
                        this.swiperSlides.push(this.QiNiuUrl+'/'+n.address)
                    })
                this.show = true
            },
            hideImageView(){
                this.show = false
            },
            followHandleSizeChange(val){
                this.followPagination.pageSize=val;
                this.showFollowDetail(this.customer)
            },
            followHandleCurrentChange(val){
                this.followPagination.pageNow=val;
                this.showFollowDetail(this.customer)
            },
            showFollowDetail(row){
                let self = this;

                this.showFollowDetailVisible=true
                this.storeStatus = this.dicData.HS_CUSTOMER_STATUS;
                this.lastOprations =this.dicData.HS_CUSTOMER_OPERATION_SOURCE;
                this.customer.customerId=row.customerId
                self.$axios({
                    url: "/customer/getHsCustomerOperationList?pageNow="+self.followPagination.pageNow+'&pageSize='+self.followPagination.pageSize+'&hsCustomerId='+row.customerId,
                    method: 'post',
                    data: null,
                    transformRequest: [function (data) {
                        let ret = ''
                        return ret
                    }],
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }).then(
                    function (res) {
                        self.loading3=false;
                        if(res.data.res=='0'){
                            self.followPagination.total=res.data.msg.total;
                            self.followPagination.pageNum=res.data.msg.pageNum;
                            self.followPagination.pageSize=res.data.msg.pageSize;
                            self.showFollowDetailsTable = res.data.msg.list;
                            self.showFollowDetailsTable.forEach((n)=>{
                                if(n.remark == 'undefined'){
                                    n.remark = ''
                                }
                            })
                            res.data.msg.list.forEach((e)=>{
                                self.lastOprations.forEach((n)=>{
                                    if( n.dicValue==e.source){
                                        e.operator=n.dicDesc
                                    }

                                })
                                self.storeStatus.forEach((n)=>{
                                    if( n.dicValue==e.status){
                                        e.operatorStatus=n.dicDesc
                                    }
                                })
                            })
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
                self.loading3=true;
            },
            form(n){
                return formatTime(Number(n))
            },
            followDialogHandleSizeChange(val) {
                this.followDialogPagination.pageSize=val;
                this.initFollowUpDetails(this.followDetailData)
            },
            followDialogHandleCurrentChange(val) {
                this.followDialogPagination.pageNow=val;
                this.initFollowUpDetails(this.followDetailData)
            },
            tableDetailsRow(row,operationType){
                this.followDetail.salesId=row.salesId
                this.followDetail.operationType=operationType
                this.dialogFollowUpVisible=true
                this.initFollowUpDetails(this.followDetailData)
            },
            initFollowUpDetails(data){
                this.$axios.post('/customer/getSalesFollowupDetails',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.followDialogPagination.total=res.data.msg.total;
                        this.followDialogPagination.pageNum=res.data.msg.pageNum;
                        this.followDialogPagination.pageSize=res.data.msg.pageSize;
                        this.followUpDialogTable=res.data.msg.list;
                    }
                })
                this.followupStatus=this.dicData.HS_CUSTOMER_STATUS;
            },
            statusText(status){
                let n;
                this.followupStatus.forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            },
            submitSalesFollowupTable(){
//                this.researchSalesFollowupTable.startDate=this.researchSalesFollowupTable.startDate?moment(this.researchSalesFollowupTable.startDate).format('YYYY-MM-DD'):''
//                this.researchSalesFollowupTable.endDate=this.researchSalesFollowupTable.endDate?moment(this.researchSalesFollowupTable.endDate).format('YYYY-MM-DD'):''
//                if(getDays(this.researchSalesFollowupTable.startDate,this.researchSalesFollowupTable.endDate)>7){
//                    this.$notify.error({
//                        title: '错误',
//                        message: '请重新选择时间范围，选取范围最多为7天！',
//                        offset: 100
//                    });
//                    this.resetForm('researchSalesFollowupTable')
//                }else {
//                    this.initSalesFollowupQuantity(this.tableData)
//                    this.saveDate.startDate=this.researchSalesFollowupTable.startDate
//                    this.saveDate.endDate=this.researchSalesFollowupTable.endDate
//                    this.resetForm('researchSalesFollowupTable')
//
//                }
                this.initSalesFollowupQuantity(this.tableData)
                this.saveDate.startDate=this.researchSalesFollowupTable.startDate?moment(this.researchSalesFollowupTable.startDate).format('YYYY-MM-DD'):''
                this.saveDate.endDate=this.researchSalesFollowupTable.endDate?moment(this.researchSalesFollowupTable.endDate).format('YYYY-MM-DD'):''
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            startDateChange(val){
                this.researchSalesFollowupTable.startDate = val
            },
            endDateChange(val){
                this.researchSalesFollowupTable.endDate = val
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initSalesFollowupQuantity(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initSalesFollowupQuantity(this.tableData)
            },
            initSalesFollowupQuantity(data){
                this.$axios.post('/customer/countSalesFollowupQuantity',data).then((res)=> {
                    this.loading2=false
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.SalesFollowupTableData=res.data.msg.list;
//                        this.initDec()
                    }
                })
                this.loading2=true;
            },
            initChannelList(){
                this.$axios.post('/s/getChannelList',{cityCode:this.cityNames.city}).then((res)=>{
                    if(res.status==200){
                      this.channelList=res.data.msg
                    }
                })
            },
            initSalesList(){
                let url;
                let ContentType;
                let cityGroup=[];
                let _this=this;
                JSON.parse(localStorage.getItem("userInfo")).positionCitys.forEach((e)=>{
                    cityGroup.push(e.cityCode)
                })
                if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey === 'DEPT:SALES'){
                    url = '/s/getSalesListByUser'
                    ContentType='application/x-www-form-urlencoded'
                }
                else{
                    url = '/s/getSalesListByCitys'
                    ContentType='application/json'
                }

                this.$axios({
                    url: url,
                    method: 'post',
                    data: {'cityCode':cityGroup},
                    transformRequest: [function (data) {
                        // Do whatever you want to transform the data
                        let ret = cityGroup
                        return JSON.stringify(ret);
                    }],
                    headers: {
                        'Content-Type': ContentType
                    }
                }).then(
                    function (res) {
                        if(res.status==200){
                            _this.salesList=res.data.msg
                        }
                        })
            },
            computedPercent(a,b){
                if(b){
                    return Number(a/b*100).toFixed()+'%'
                }else {
                    return '0%'
                }
            },
            formTime1(row){

                if(row.createTime == null){

                }
                else{
                    return formatTime(row.createTime)
                }
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        computed:{
            tableData(){
                return {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    "channelId":this.researchSalesFollowupTable.channelId,
                    "salesId":this.researchSalesFollowupTable.salesId,
                    "endDate":this.researchSalesFollowupTable.endDate,
                    "startDate":this.researchSalesFollowupTable.startDate
                }
            },
            followDetailData(){
                return{
                    "pageNow":this.followDialogPagination.pageNow,
                    "pageSize":this.followDialogPagination.pageSize,
                    "endDate":this.researchSalesFollowupTable.endDate,
                    "startDate":this.researchSalesFollowupTable.startDate,
                    "salesId":this.followDetail.salesId,
                    "channelId":this.researchSalesFollowupTable.channelId,
                    "operationType":this.followDetail.operationType
                }
            },
        ...mapGetters([
            'dicData',
            'allPermission',
            'btnAllPms'
        ])
        },
        mounted(){
            this.getQiNiuUrlUsingGET()
            this.initSalesList()
            this.getOpenCity()
            this.cityNames.city = JSON.parse(localStorage.getItem("userInfo")).positionCitys[0].cityCode
            this.initChannelList()
            this.researchSalesFollowupTable.startDate = moment().format('YYYY-MM-DD')
            this.researchSalesFollowupTable.endDate=moment().format('YYYY-MM-DD')
            this.saveDate.startDate=this.researchSalesFollowupTable.startDate
            this.saveDate.endDate=this.researchSalesFollowupTable.endDate
            this.initSalesFollowupQuantity(this.tableData)
        }
    }
</script>
