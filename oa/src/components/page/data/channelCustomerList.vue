<template>
    <div>
        <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>BD数据管理</el-breadcrumb-item>
            <el-breadcrumb-item>渠道客户数据</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div>
            <el-form :inline="true" :model="researchChannelsTable" ref="researchChannelsTable" class="demo-form-inline">
                <el-row>
                    <el-col>
                        <el-form-item label='日期'  prop='startDate'>
                            <div class="block">
                                <el-date-picker
                                    v-model="researchChannelsTable.startDate"
                                    type="date"
                                    :picker-options="pickerOptions0"
                                    @change='startDateChange'
                                    size="small">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item label='到' prop='endDate'>
                                <div class="block">
                                    <el-date-picker
                                        v-model="researchChannelsTable.endDate"
                                        type="date"
                                        :picker-options="pickerOptions0"
                                        @change="endDateChange"
                                        size="small">
                                    </el-date-picker>
                                </div>
                        </el-form-item>
                        <el-form-item label="账号：" prop='advisorAccount'>
						    <el-input class='lengthInput' v-model="researchChannelsTable.advisorAccount" @keyup.enter.native="onSubmit" size="small"></el-input>
						</el-form-item>
						<el-form-item label="手机：" prop='mobile'>
						    <el-input class='lengthInput' v-model="researchChannelsTable.mobile" @keyup.enter.native="onSubmit" size="small"></el-input>
						</el-form-item>
						<el-form-item label="客户名：" prop='customerName'>
						    <el-input class='lengthInput' v-model="researchChannelsTable.customerName" @keyup.enter.native="onSubmit" size="small"></el-input>
						</el-form-item>
						<el-form-item label="状态：" prop='customerStatus'>
							<el-select size="small" v-model="researchChannelsTable.customerStatus" clearable placeholder="请选择">
							    <el-option
							      v-for="type in storeStatus"
							      :key="type.dicDesc"
			                      :label="type.dicDesc"
			                      :value="type.dicValue">
							    </el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="销售：" prop='salesId'>
							<el-select size="small" v-model="researchChannelsTable.salesId" clearable placeholder="请选择">
								<el-option value="assigned" label="已分配"></el-option>
								<el-option value="unassigned" label="未分配"></el-option>
							    <el-option
							      v-for="type in salesIds"
							      :key="type.id"
			                      :label="type.nickName"
			                      :value="type.id">
							    </el-option>
							</el-select>
						</el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitChannelsTable">查询</el-button>
                        </el-form-item>
                        <el-form-item>
							<el-button size="small" type="primary" @click="resetForm('researchChannelsTable')">重置</el-button>
						</el-form-item>
                    </el-col>
                </el-row>


            </el-form>
        </div>

        <el-table :data="channelsTable" border style="width: 100%;" >
            <el-table-column prop="advisorName" label="顾问" width='100'></el-table-column>
            <el-table-column prop="advisorAccount" label="账号" width='100'></el-table-column>
            <el-table-column prop="customerName" label="客户" width='100'></el-table-column>
            <el-table-column prop="mobile" label="手机" width='100'></el-table-column>
            <el-table-column prop="budget" label="预算" width='100'></el-table-column>
            <el-table-column prop="bookingTime" label="档期" width='100'></el-table-column>
            <el-table-column prop="customerStatus" label="状态" width='100'>
            	<template scope="scope">
	            	<p>{{statusText(scope.row.customerStatus,'customer_status')}}</p>
		        </template>
            </el-table-column>
            <el-table-column prop="salesName" label="销售" width='100'></el-table-column>
            <el-table-column prop="custServiceName" label="客服" width='100'></el-table-column>
            <el-table-column prop="assignTime" label="分配时间" width='100' :formatter="formTime"></el-table-column>
            <el-table-column prop="channelName" label="来源" width='100'></el-table-column>
            <el-table-column prop="createTime" label="日期" width='100' :formatter="formTime1"></el-table-column>
            <el-table-column prop="feedbackList" label="反馈渠道(双击查看)" width='350'>
            	<template scope="scope">
            		<div @dblclick="tableList(scope.row)">
            			<p v-for='(item, index) in scope.row.feedbackList'>{{index+1}}、{{item.content}}</p>
            		</div> 
	            </template>
            </el-table-column>
            <el-table-column prop="operationList" label="跟进(双击查看)" width='350'>
            	<template scope="scope">
            		<div @dblclick="tableList1(scope.row)">
            			<p>{{getOperationText(scope.row)}}</p>
            		</div>
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
        
        <el-dialog title="客服反馈渠道记录" size='large' :visible.sync="customerFeedbackvisible">
            <el-table :data="FeedbackTable" border>
                <el-table-column property="createTime" label="日期" :formatter="formTime1"></el-table-column>
                <el-table-column property="creatorName" label="客服" ></el-table-column>
                <el-table-column property="content" label="详情"></el-table-column>
                <el-table-column property="status" label="状态">
               		<template scope="scope">
	            		<p>{{statusText(scope.row.status,'customer_status')}}</p>
		            </template>
                </el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="checkHandleSizeChange"
                                       @current-change="checkHandleCurrentChange"
                                       :current-page="checkPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="checkPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="checkPagination.total">>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="跟进记录" size='large' :visible.sync="customerfollowvisible">
        	<el-table :data="followDetailsTable" border>
	            <el-table-column property="createTime" label="更新时间" :formatter="formTime1"></el-table-column>
	            <el-table-column property="operatorName" label="操作人" ></el-table-column>
	            <el-table-column property="source" label="操作">
	                <template scope="scope">
		                <div>{{statusText(scope.row.source,'lastOperation_type')}}</div>
		            </template>
	            </el-table-column>
	            <el-table-column property="status" label="提交状态">
	                <template scope="scope">
			            <div>{{statusText(scope.row.source,'submite_type')}}</div>
			        </template>
	            </el-table-column>
	            <el-table-column property="source" label="图片">
	                <template scope="scope">
	                    <el-button class='btn'
	                    	type="text"
	                    	v-if='scope.row.commonFileList.length && scope.row.source !=4'
				            size="small" @click="showImgDial(scope.row)">
				                       查看
				        </el-button>
				        <span v-if='!scope.row.commonFileList.length && scope.row.source !=4'>
				            空
				        </span>
	                </template>
	            </el-table-column>
	            <el-table-column label="内容" width='300'>
	                <template scope="scope">
	                    <span v-if='scope.row.source !=4'>{{scope.row.remark}}</span>
		                <audio v-if='scope.row.source ==4' controls style="vertical-align: middle;width:100%">
		                    <source :src="`${QiNiuUrl}/${scope.row.audioAdress}`" type="audio/mpeg">
		                    <embed height="50" width="100" :src="`${QiNiuUrl}/${scope.row.audioAdress}`">
		                </audio>
		            </template>
	            </el-table-column>
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
            	customerFeedbackvisible:false,
            	FeedbackTable:[],
            	customerId:'',
            	checkPagination:{
            		pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
            	},
            	swiperSlides:[],
            	customerfollowvisible:false,
            	followDetailsTable:[],
            	followPagination:{
            		pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
            	},
            	
            	pickerOptions0: {},
                researchChannelsTable:{
                    startDate:'',
                    endDate:'',
                    advisorAccount:'',
                    mobile:'',
                    customerName:'',
                    customerStatus:'',
                    salesId:'',
                },
                storeStatus:[],
                salesIds:[],
                scheduleTableData:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                channelsTable:[],
                cols:[
                ],
                researchChannelsTableWidth:'120px',
                citys:[],
                dec:{
                	customer_status:[],
                	data_status:[],
                	operation_type:[],
                	operation_record_type:[],
                	lastOperation_type:[]
                }
            }
        },
        methods: {
        	getAllDec(){
        		this.dec.customer_status = this.dicData.HS_CUSTOMER_STATUS
        		this.dec.data_status = this.dicData.HS_CUSTOMER_OPERATION_SOURCE
        		this.dec.operation_type = this.dicData.HS_CUSTOMER_OPERATION_TYPE
        		this.dec.operation_record_type = this.dicData.HS_CUSTOMER_OPERATION_RECORDING_TYPE
        		this.dec.lastOperation_type = this.dicData.HS_CUSTOMER_OPERATION_SOURCE
        		this.dec.submite_type = this.dicData.HS_CUSTOMER_STATUS
        		
        	},
        	showImgDial(row){
                this.swiperSlides=[],
                row.commonFileList.map((n)=>{
                    this.swiperSlides.push(this.QiNiuUrl+'/'+n.address)
                })
                this.show = true
            },
        	getQiNiuUrlUsingGET(){
                this.$axios.get('/b/getQiNiuUrl').then((res2)=>{    //获取所有城市列表
                    if(res2.data.res == 0){
                        this.QiNiuUrl=res2.data.msg
                    }
                    else{
                        alert(res2.data.msg)
                    }
                })
            },
        	formTime(row){
            	if(row.assignTime !=null){
            		return formatTime(row.assignTime)
            	}
            	else{
            		return
            	}
            },
        	formTime1(row){	
                if(row.createTime !=null){
            		return formatTime(row.createTime)
            	}
            	else{
            		return
            	}
        	},
            submitChannelsTable(){
                this.initChannelList(this.tableData)
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            startDateChange(val){
                this.researchChannelsTable.startDate = val
            },
            endDateChange(val){
                this.researchChannelsTable.endDate = val
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initChannelList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initChannelList(this.tableData)
            },
            checkHandleSizeChange(val){
            	this.checkPagination.pageSize = val
            	this.tableListData(this.tableListDatas)
            },
            checkHandleCurrentChange(val){
            	this.checkPagination.pageNum = val
            	this.tableListData(this.tableListDatas)
            },
            
            tableList(row){
            	this.customerId = row.customerId
               this.tableListData(this.tableListDatas)
            },
            tableListData(data){
	           	this.customerFeedbackvisible=true;
	            this.$axios.post('/customer/getCustomerFeedbackList',data).then((res)=>{
	                if(res.data.res==0){
	                    this.FeedbackTable=res.data.msg.list;
	                    this.checkPagination.total=res.data.msg.total;
	                    this.checkPagination.pageNum=res.data.msg.pageNum;
	                    this.checkPagination.pageSize=res.data.msg.pageSize;
	                }
	            })
           },
           tableList1(row){
           	this.customerfollowvisible = true
           	let self = this
           	self.$axios({
	            url: "/customer/getHsCustomerOperationList?pageNow="+self.followPagination.pageNow+'&pageSize='+self.followPagination.pageSize+'&hsCustomerId='+row.hsCustomerId+'&type=',
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
	                if(res.data.res=='0'){
						self.followDetailsTable = res.data.msg.list;
						self.followPagination.total=res.data.msg.total;
                       	self.followPagination.pageNum=res.data.msg.pageNum;
                      	self.followPagination.pageSize=res.data.msg.pageSize;
                      	var audio = document.getElementsByTagName('audio')
			            for(var i=0;i<audio.length;i++){
			                audio[i].load()
			            }
		  				res.data.msg.list.forEach((e)=>{
			                if(e.source == 4 && e.commonFileList.length){
			                    self.$set(e, 'audioAdress', e.commonFileList[0].address)
			                }
			                else{
			                    self.$set(e, 'audioAdress', '')
			                }
		  				})
	                }else {
	                    alert(res.data.msg)
	                }
	            })
           },
           followHandleSizeChange(val){
           	
           },
           followHandleCurrentChange(val){
           	
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
            getOperationText(row){
            	let operationText = ''
            	for(var i=0;i<row.operationList.length;i++){
            		if(i<5){
            			let m = row.operationList[i]
            			if(m.remark == null){
	            			m.remark = ''
	            		}
	            		if(m.source != 4){
	            			operationText = operationText+m.remark+'操作类型:'+'('+this.statusText(m.source,'data_status')+')'+'-'+'('+this.statusText(m.type,'operation_type')+':'+m.operatorName+')'+'--'+this.formTime1(m)
	            		}
	            		else{
	            			let remark = ''
	            			m.commonFileList.forEach((n)=>{
	            				remark = remark+n.audioAdress+'、'
	            			})
	            			remark = remark.substring(1,remark.length-1)
	            			operationText = operationText+remark+'操作类型:'+'('+this.statusText(m.source,'data_status')+')'+'-'+'('+this.statusText(m.type,'operation_record_type')+':'+m.operatorName+')'+'--'+this.formTime1(m)
	            		}
            		}
            	}
	            return operationText 
            },
            initChannelList(data){
            	this.operationText = ''
            	this.storeStatus = []
                this.$loading({text:'拼命加载中'})
                this.$axios.post('/customer/getChannelCustomerList',data).then((res)=>{
                    if(res.data.res == '0'){
                    	this.$loading().close()
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.channelsTable=res.data.msg.list
                        this.dicData.HS_CUSTOMER_STATUS.forEach((m)=>{
	                        if( m.dicStatus==0){
	                            this.storeStatus.push(m)
	                        }
	                    })
	                    
	                    
	                    
                    }
                    else{
                    	this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    	this.$loading().close()
                    }
                    
                })	
            },
            getAllSales(){
            	 this.$axios.post('/s/getSalesListByDeptKey',{}).then((res4)=>{    //获取所有销售
					if(res4.data.res == '0'){
						this.salesIds = res4.data.msg;
						for(var i=0;i<this.salesIds.length;i++){
							if(this.salesIds[i].id== '-999'){
					            this.salesIds.splice(i,1)
					        }
						}
					}
					else{
						this.salesIds = []
					}
			    })
            },
            cityText(data){
                let cityName;
                this.citys.forEach((n)=>{
                    if( n.cityCode==data){
                        cityName = n.cityName
                    }
                })
                return cityName

            },
        },
        mounted(){
        	this.getQiNiuUrlUsingGET()
        	this.getAllDec()
        	this.getAllSales()
            this.initChannelList(this.tableData)
        },
        computed:{
        	tableListDatas(){
        		return{
        			"pageNow":this.checkPagination.pageNow,
	        		"pageSize":this.checkPagination.pageSize,
	        		"customerId":this.customerId
        		}
        	},
            tableData(){
                return {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'startDate':this.researchChannelsTable.startDate,
                    'endDate':this.researchChannelsTable.endDate,
                    'advisorAccount':this.researchChannelsTable.advisorAccount,
                    'mobile':this.researchChannelsTable.mobile,
                    'customerName':this.researchChannelsTable.customerName,
                    'customerStatus':this.researchChannelsTable.customerStatus,
                    'salesId':this.researchChannelsTable.salesId,
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
