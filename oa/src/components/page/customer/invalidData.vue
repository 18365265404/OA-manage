<template>
    <div>
        <!--查询录音!-->
        <div class="crumbs">
        	<div style='float:right'>
            	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm">
            		<el-form-item label="城市:">
                        <el-select v-model='cityNames.city' @visible-change='changeCityVisible' @change='changeCity' placeholder="请选择">
                            <el-option
                                v-for="type in storeCitys"
                                :key="type.cityCode"
                                :label="type.cityName"
                                :value="type.cityCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
				</el-form>
            </div>
        </div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>无效数据确认</el-breadcrumb-item>
            </el-breadcrumb>
        
        <el-row>
            <el-col>
                <el-form :inline="true">
                    <el-form-item v-if='btnP.invalidDataBatchConfirm'>
                        <el-button type="primary" @click="batchCirfirmInvalid">批量确认无效</el-button>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="research.mobile"></el-input></el-form-item>
                    </el-form-item>
                        <el-form-item label="渠道" >
                            <el-select v-model="research.channelId" clearable placeholder="请选择">
                                <el-option
                                    v-for="type in channelIds"
                                    :key="type.id"
                                    :label="type.nickName"
                                    :value="type.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客服" >
                            <el-select v-model="research.custServiceId" clearable placeholder="请选择">
                            	<el-option value="unassigned" label="未分配"></el-option>
                                <el-option
                                    v-for="type in cusIds"
                                    :key="type.id"
                                    :label="type.nickName"
                                    :value="type.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="researchTable">查询</el-button>
                        <el-button type="primary" @click="">清空</el-button>
                    </el-form-item>
                    
                </el-form>
            </el-col>
        </el-row>
        <!--录音列表-->
        <el-table
        	v-loading="loading.pageList" element-loading-text="拼命加载中"
            ref="multipleTable"
            :data="invalidList"
            border
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="customerName" label="客户名" ></el-table-column>
            <el-table-column prop="mobile" label="手机" >
                <template scope="scope">
                    <el-button class='btn'
                    	type="text"
			            size="small" @click="followUpDetails(scope.$index, scope.row)">
			            {{scope.row.mobile}}
			        </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="cityName" label="城市">
                <template scope="scope">
		            <div>{{cityText(scope.row.cityCode)}}</div>
		        </template>
            </el-table-column>
            <el-table-column prop="custServiceName" label="客服" ></el-table-column>
            <el-table-column prop="channelName" label="来源渠道"></el-table-column>
            <el-table-column prop="creatorName" label="导入人"></el-table-column>
            <el-table-column prop="type" label="数据类型">
            	<template scope="scope">
		            <div>{{statusText(scope.row.type,'data_type')}}</div>
		        </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button v-if='btnP.invalidDataConfirm' type="primary" class='btn' size="small" @click="cirfirmInvalidBtn(scope.$index, scope.row)">确认无效</el-button>
                    <el-button v-if='btnP.invalidDataTurnEffective' type="primary" size="small" @click="cirfirmValue(scope.$index, scope.row)">转有效</el-button>
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
        
        
        
        <el-dialog  title="确认无效" :visible.sync="dialogInvalidVisible" :before-close="cancelConfirmInvalidHandle">
			 <el-form :model='confirmInvalids' ref="confirmInvalids">
				<el-form-item label="姓名：" prop='customerName' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.customerName}}</span>
				</el-form-item>
				<el-form-item label="手机：" prop='mobile' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.mobile}}</span>
				</el-form-item>
				<el-form-item label="推送婚礼人：" prop='weddingType' :label-width="formLabelWidth">
				    <el-card class="box-card row_card">
                      <div class="text item">
                            <el-row class='system_row'>
                                <el-col>
                                    <div>                                    	
                                    	<el-radio-group v-model="weddingTypes" @change="selectRadioDataAll">
                                    		<el-radio>无效</el-radio>
										    <el-radio class='radio' v-bind:value="item.dicDesc" v-for="item in dec.wedding_select" :label="item.dicValue">{{item.dicDesc}}</el-radio>
										  </el-radio-group>

                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="confirmInvalidHandle">确定</el-button>
			    <el-button @click="cancelConfirmInvalidHandle">取 消</el-button>
			  </div>
			</el-dialog>
			
			
			<el-dialog title="客户详情" size='large' :visible.sync="dialogTableVisible" :before-close="cancelChangeVisibleHandle">
        	<p>{{changeStatus}}</p>
        	<el-form :model="changeStatus" ref='changeStatus'>
        		<div>
        			<el-form-item class='inline-form' label="客户：" :label-width="formLabelWidth2">
        				<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.customerName}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.customerName" auto-complete="off"></el-input>				 	                </el-form-item >
				    <el-form-item class='inline-form' label="手机：" :label-width="formLabelWidth2">
				    	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.mobile}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.mobile" auto-complete="off"></el-input>
				    </el-form-item>
				     <el-form-item class='inline-form' :label-width="formLabelWidth2">
				      <el-button v-show='!isEdit' class='btn' type="primary" @click="editHandle">编辑</el-button>
				      <el-button v-show='isEdit' class='btn' type="primary" @click="editHandle">确定</el-button>
				    </el-form-item>
        		</div>
	        	<div>
        			<el-form-item class='inline-form' label="城市：" :label-width="formLabelWidth2"> 
				    	 <span class='hiddenspan'>{{changeStatus.cityName}}</span>
		        	</el-form-item >
				    <el-form-item class='inline-form' label="预算：" :label-width="formLabelWidth2">
				    	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.budget}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.budget" auto-complete="off"></el-input>
				    </el-form-item>
				     <el-form-item class='inline-form' label="桌数：" :label-width="formLabelWidth2">
				     	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.tableNumber}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.tableNumber" auto-complete="off"></el-input>
				    </el-form-item>
				     <el-form-item class='inline-form' label="档期：" :label-width="formLabelWidth2">
				     	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.bookingTime}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.bookingTime" auto-complete="off"></el-input>
				    </el-form-item>
        		</div>
        		<el-form-item  label="数据备注" prop='remark' :label-width="formLabelWidth2">
				    <el-input class='textarea' type='textarea' disabled v-model="changeStatus.remark" auto-complete="off"></el-input>				    	 
		        </el-form-item >
				<el-form-item label="无效确认：" prop='statusType' :label-width="formLabelWidth2">
  					<el-radio-group v-model="radioStatus" @change='changeRadio'>
					    <el-radio :label="10">确认无效</el-radio>
					    <el-radio :label="0">有效</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-show='panduanStatus2' label="分配：" :label-width="formLabelWidth2" prop='salesId'>
					<el-select v-model="changeStatus.salesId" clearable placeholder="请选择">
					    <el-option
					      v-for="type in salesIds"
					      :key="type.id"
	                      :label="type.nickName"
	                      :value="type.id">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-show='panduanStatus5' label="推送婚礼人：" prop='weddingType' :label-width="formLabelWidth2">
				    <el-radio-group v-model="changeweddingTypes">
                        <el-radio value='' label=''>不推送</el-radio>
						<el-radio class='radio' v-for="item in dec.wedding_select" :label="item.dicValue"  v-bind:value="item.dicDesc" >{{item.dicDesc}}</el-radio>
					 </el-radio-group>
				</el-form-item>
				<el-form-item class='inline-form' :label-width="formLabelWidth2">
				      <el-button class='btn' type="primary" @click="editSubmitHandle">确定</el-button>
				</el-form-item>
        	</el-form >

            <el-tabs v-model="editableTabsValue" @tab-click="handleClick">
		        <el-tab-pane
		                :key="item.name"
		                v-for="(item, index) in editableTabs"
		                :label="item.title"
		                :name="item.name"
		            >
	            <el-table :data="followDetailsTable" border>
	                <el-table-column property="createTime" label="更新时间" :formatter="formTime1"></el-table-column>
	                <el-table-column property="operatorName" label="操作人" ></el-table-column>
	                <el-table-column property="operator" label="操作"></el-table-column>
	                <el-table-column property="operatorStatus" label="提交状态"></el-table-column>
	                 <el-table-column property="operatorName" label="图片"></el-table-column>
	                 <el-table-column label="内容" width='300'>                 	
                  	<template scope="scope">
                  		<span v-show='scope.row.source !=4'>{{scope.row.remark}}</span>
	                    <audio v-show='scope.row.source ==4' controls style="vertical-align: middle;width:100%">
	                        <source :src="`${QiNiuToken}/${scope.row.audioAdress}`" type="audio/mpeg">
	                        <embed height="50" width="100" :src="`${QiNiuToken}/${scope.row.audioAdress}`">
	                    </audio>
	                </template>
                  </el-table-column>
	            </el-table>
                </el-tab-pane>
        	</el-tabs> 
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

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
            	isChangeCity:false,
            	salesIds:[],
            	detailsRow:{},
            	loading:{
                    pageList:false,
                    detail:false
                },
            	QiNiuToken:'',
                invalidList:[],//顾问列表
                panduanStatus5:false,
                changeweddingTypes:'',
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                research:{
                	mobile:'',
                    channelId:'',
                    custServiceId:''
                },
                multipleSelection:[],
                storeCitys:[],
                citys:[],
                cityNames:{
                    city:''
                },
                channelIds:{},
                cusIds:{},
                string:'',
                dialogInvalidVisible:false,
                confirmInvalids:{
                	
                },
                 weddingTypes:undefined,
                 formLabelWidth:'100px',
                 formLabelWidth2:'100px',
                 panduanStatus2:false,
                 changeStatus:{
                	customerName:'',
                	mobile:'',
                	cityName:'',
                	budget:'',
                	tableNumber:'',
                	bookingTime:'',
                	hsCustomerId:'',
                	id:'',
                	status:'',
                	salesId:'', 
                	statusType:'',
                	weddingType:'',
                	planDate:'',
                	remark:''
                },
                followPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                followDetailsTable:[], 
                radioStatus:'10',
                isEdit:false,
                dialogTableVisible:false,
                editableTabsValue: '1',
                editableTabs: [{
                    title: '所有',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: '客服',
                    name: '2',
                    content: 'Tab 2 content'
                },{
                    title: '销售',
                    name: '3',
                    content: 'Tab 3 content'
                }
                ],
                btnP:{
                	invalidDataConfirm:'',  //无效数据确认
		            invalidDataBatchConfirm:'',  //批量确认无效
		            invalidDataTurnEffective:'',  //转有效
                },
                dec:{
                    data_type:[],
                    store_status:[],
                    wedding_select:[],
                    lastOprations_type:[],
                },
            }
        },
        methods: {
        	initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
                this.dec.store_status= this.dicData.HS_CUSTOMER_STATUS;   
                this.dec.wedding_select= this.dicData.HLR_CUSTOMER_TYPE;   
                this.dec.lastOprations_type= this.dicData.HS_CUSTOMER_OPERATION_SOURCE
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
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initInvalidList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initInvalidList(this.tableData)
            },
            initInvalidList(data){
            	this.loading.pageList=true
                this.$axios.post('/customer/getHsCustomerInvalidList',data).then((res2)=> {
                    if (res2.data.res == 0) {
                        this.pagination.total=res2.data.msg.total;
                        this.pagination.pageNum=res2.data.msg.pageNum;
                        this.pagination.pageSize=res2.data.msg.pageSize;
                        this.invalidList=res2.data.msg.list
                        this.loading.pageList=false
                    }
                    else{
                    	this.loading.pageList=false
                        this.$notify.error({
                            title: '错误',
                            message: res2.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            researchTable(){
                this.initInvalidList(this.tableData)
            },
            initCities(){
                this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
                    if(res2.status ==200 ){
                        this.citys = res2.data.msg
                        
                        this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys;
                        
                        this.storeCitys.forEach((e)=>{
                            this.citys.forEach((n)=>{
                                if( n.cityCode==e.cityCode){
                                    e.cityName = n.cityName
                                    
                                }

                            })
                        })
                        this.cityNames.city=this.storeCitys[0].cityCode
                    }
                });
            },
             changeCityVisible(){
            	this.isChangeCity = true
            },
            changeCity(val){
            	if(this.isChangeCity){
            		this.initInvalidList(this.tableData)
            		this.isChangeCity = false
            	}
            	this.cityNames.city = val
                this.$axios.post('/s/getCustServiceListByUser',{'cityCode':this.cityNames.city}).then((res4)=>{    //获取所有销售
                    if(res4.data.res == '0'){
                        this.cusIds = res4.data.msg;
                    }
                })
                this.$axios.post('/s/getChannelList',{'cityCode':this.cityNames.city}).then((res3)=>{

                    if(res3.data.res == '0'){
                        this.channelIds = res3.data.msg;
                    }
                })
                this.$axios.post('/s/getSalesList',{'cityCode':this.cityNames.city}).then((res5)=>{    //获取所有销售
					if(res5.data.res == '0'){
						this.salesIds = res5.data.msg;
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
            cirfirmInvalidBtn(index,row){
            	this.dialogInvalidVisible = true;
            	
            	this.confirmInvalids.customerName = this.invalidList[index].customerName;
		    	this.confirmInvalids.mobile = this.invalidList[index].mobile;
		    	this.confirmInvalids.hsCustomerIds = this.invalidList[index].id;
            },
            cancelConfirmInvalidHandle(){  //取消确认无效
		    	this.$refs['confirmInvalids'].resetFields();
		    	this.dialogInvalidVisible = false
		    },
		    confirmInvalidHandle(){  //确定无效
		    	if(this.weddingTypes == undefined){
		    		this.weddingTypes = ''
		    	}
		    	let data = {
			    	'hsCustomerIds':this.confirmInvalids.hsCustomerIds,
			    	'confirmStatus':10,
			    	'hlrType':this.weddingTypes
			    }
		    	
		    	this.$axios.post('/customer/confirmInvalidOrValid',data).then((res)=>{      
	  				if(res.data.res == 0){
	  					this.initInvalidList(this.tableData);
	  					this.$refs['confirmInvalids'].resetFields();
	  					this.dialogInvalidVisible = false
	  				}			      
		        });
		    },
		    selectRadioDataAll(){  //单选
		    },
		    
		    
		    
            cirfirmValue(index,row){
            	this.$confirm('是否确认转有效?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 'hsCustomerIds':this.string,
			            		 'confirmStatus':0
			            	}
			            	 this.$axios.post('/customer/confirmInvalidOrValid',data).then((res)=>{	            		
								this.initInvalidList(this.tableData)
				             })
				        	
				        this.$message({
				            type: 'success',
				            message: '已成功转有效!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消操作'
				          });          
				        });
            },
            invalidData(){
            	this.$confirm('确认无效后无法撤销, 请谨慎操作?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 'hsCustomerIds':this.string,
			            		 'confirmStatus':10
			            	}
			            	 this.$axios.post('/customer/confirmInvalidOrValid',data).then((res)=>{	            		
								this.initInvalidList(this.tableData)
				             })
				        	
				        this.$message({
				            type: 'success',
				            message: '已成功确认无效!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消操作'
				          });          
				        });
            },
            batchCirfirmInvalid(){
            	if(this.string == ''){
					 this.$alert('请至少选择一条客户数据', '', {
			          confirmButtonText: '确定',
			          callback: action => {
			            
			          }
			        });
				}
				else{
					
					this.$confirm('确认无效后无法撤销, 请谨慎操作?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 'hsCustomerIds':this.string,
			            		 'confirmStatus':10
			            	}
			            	 this.$axios.post('/customer/confirmInvalidOrValid',data).then((res)=>{	            		
								this.initInvalidList(this.tableData)
				             })
				        	
				        this.$message({
				            type: 'success',
				            message: '已成功确认无效!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消操作'
				          });          
				        });
				}
            },
            handleSelectionChange(val){  //列表左侧选择
				this.multipleSelection=val;
                if(this.multipleSelection.length == 0){
                	this.string = ''
                }
                else if(this.multipleSelection.length == 1){
                	this.string = this.multipleSelection[0].id;
                }
                else{
                	for(var i=0;i<this.multipleSelection.length;i++){
	                	this.string = this.string + ',' + this.multipleSelection[i].id	
	                }
                }
                console.log(this.string)
			},
			
			
			
			followUpDetails(index,row){
				this.detailsRow = row
				this.dialogTableVisible = true;
				this.radioStatus = 10;
				this.changeStatus.customerName = row.customerName;
		    	this.changeStatus.mobile = row.mobile;
		    	this.changeStatus.cityName = row.cityName;
		    	this.changeStatus.budget = row.budget;
		    	this.changeStatus.tableNumber = row.tableNumber;
		    	this.changeStatus.bookingTime = row.bookingTime;
		    	this.changeStatus.id = row.id;
		    	this.changeStatus.remark = row.remark;
		    	if(this.radioStatus === 10 && row.type === 0){
		    		this.panduanStatus5 = true
		    	}
		    	else{
		    		this.panduanStatus5 = false
		    	}
				let data = {
		    		'pageNow':this.followPagination.pageNow,
		    		'pageSize':this.followPagination.pageSize,
		    		'hsCustomerId':row.id,
		    		'type':'',
		    	}
		    	if(this.editableTabsValue == 1){
            		data.type = ''
            	}else if(this.editableTabsValue == 2){
            		data.type = 1
            	}else if(this.editableTabsValue == 3){
            		data.type = 0
            	}
            	this.changeStatus.id = row.id;
		    	this.citys.forEach((n)=>{
			        if( n.cityCode==row.cityCode){
			            this.changeStatus.cityName = n.cityName
			        }
			    })
		    	this.$axios.post('/customer/getHsCustomerOperationList',data).then((res)=>{    //获取客户所有操作集合
	  				if(res.data.res == 0){
	  					this.followDetailsTable = res.data.msg.list;
	  					res.data.msg.list.forEach((e)=>{
	  						this.dec.lastOprations_type.forEach((n)=>{
			                    if( n.dicValue==e.type){
			                        e.operator=n.dicDesc
			                    }
			                })
			                this.dec.store_status.forEach((n)=>{
		                        if( n.dicValue==e.status){
		                            e.operatorStatus=n.dicDesc
		                        }
		                    })
		                    if(e.source == 4 && e.commonFileList.length){
			                    self.$set(e, 'audioAdress', e.commonFileList[0].address)
			                }
			                else{
			                    self.$set(e, 'audioAdress', '')
			                }
	  					})
	  					
	  					
	  				}			      
		        });
			},
			
			 editHandle(){
		    	if(this.isEdit != false){
		    		let data = {
		    			'id':this.changeStatus.id,
		    			'customerName':this.changeStatus.customerName,
		    			'mobile':this.changeStatus.mobile,
		    			'tableNumber':this.changeStatus.tableNumber,
		    			'budget':this.changeStatus.budget,
		    			'bookingTime':this.changeStatus.bookingTime,
		    		}
		    		console.log(data)
		    		this.$axios.post('/customer/updateHsCustomer',data).then((res)=>{    //获取客户所有操作集合
		  				if(res.data.res == 0){
		  					this.followDetailsTable = res.data.msg.list;
		  					this.initCurrentTaskList(this.tablePagination);
		  				}			      
			        });
		    	}
		    	this.isEdit = !this.isEdit
		    },
			editSubmitHandle(){  //提交处理客户
				let url = ''
				this.$confirm('是否确认提交?', '提示', {
				    confirmButtonText: '确定',
				    cancelButtonText: '取消',
				    type: 'warning'
				}).then(() => {
				    let data = {};
					if(this.radioStatus === 10){
						data = {
						    'hsCustomerIds':this.changeStatus.id,
						    'confirmStatus':this.radioStatus,
						    'hlrType':this.changeweddingTypes
						}
						url = '/customer/confirmInvalidOrValid'
					}
					else{
						let data = {
							'hsCustomerIds':this.changeStatus.id,
							'assginSale':this.changeStatus.salesId
						}
						url = '/customer/transferValid'						        
					}
					    	
					this.$axios.post(url,data).then((res)=>{    
					  	if(res.data.res == '0'){					  					
					  		this.$refs['changeStatus'].resetFields();
					  		this.dialogTableVisible = false;
					  		this.initInvalidList(this.tableData)
					  	}			      
					});   	
				    this.$message({
				        type: 'success',
				        message: '已成功提交!'
				    });
				}).catch(() => {
				    this.$message({
				        type: 'info',
				        message: '已取消操作'
				    });          
				});
				
		    },
		    
		    
		    handleClick(tab, event) {
		        this.editableTabsValue = tab.name;
		        let self = this;

		    	let data = {
		    		'pageNow':this.followPagination.pageNow,
		    		'pageSize':this.followPagination.pageSize,
		    		'hsCustomerId':this.changeStatus.id,
		    		'type':'',
		    	}
		    	if(this.editableTabsValue == 1){
            		data.type = ''
            	}else if(this.editableTabsValue == 2){
            		data.type = 1
            	}else if(this.editableTabsValue == 3){
            		data.type = 0
            	}
		    	this.$axios.post('/customer/getHsCustomerOperationList',data).then((res)=>{    //获取客户所有操作集合
	  				if(res.data.res == 0){
	  					this.followDetailsTable = res.data.msg.list;
	  					res.data.msg.list.forEach((e)=>{
	  						this.dec.lastOprations_type.forEach((n)=>{
			                    if( n.dicValue==e.type){
			                        e.operator=n.dicDesc
			                    }
			                })
			                this.dec.store_status.forEach((n)=>{
		                        if( n.dicValue==e.status){
		                            e.operatorStatus=n.dicDesc
		                        }
		                    })
		                    if(e.source == 4 && e.commonFileList.length){
			                    self.$set(e, 'audioAdress', e.commonFileList[0].address)
			                }
			                else{
			                    self.$set(e, 'audioAdress', '')
			                }
	  					})
	  					
	  					
	  				}			      
		        });
		    },
		    
		    changeRadio(){	
		    	if(this.radioStatus === 10){
		    		this.panduanStatus2 = false
		    		if(this.detailsRow.type === 0){
		    			this.panduanStatus5 = true
		    		}
		    		else{
		    			this.panduanStatus5 = false
		    		}
		    	}
		    	else{
		    		this.panduanStatus5 = false
		    		this.panduanStatus2 = true
		    	}
		    },
		    formTime1(row){
                 return formatTime(row.createTime)
              },
             cancelChangeVisibleHandle(){
		    	this.$refs['changeStatus'].resetFields();
		  		this.dialogTableVisible = false
		    },
			followHandleSizeChange(val){
		    	this.followPagination.pageSize=val;
		    	this.initInvalidList(this.tableData)
		    },
		    followHandleCurrentChange(val){
		    	this.followPagination.pageNow=val;
		    	this.initInvalidList(this.tableData)
		    },
		     getQiNiuToken(){
                this.$axios.get("/b/getQiNiuUrl").then((res)=>{
                    if(res.status==200){
                        this.QiNiuToken=res.data.msg
                    }
                })
            }
			
        },
        computed:{
            tableData(){
                return  {
                	"pageNow":this.pagination.pageNow, 
                	"pageSize":this.pagination.pageSize,
                	"mobile":this.research.mobile,
                	"channelId":this.research.channelId,
                	"custServiceId":this.research.custServiceId,
                	"cityCode":this.cityNames.city,               	
                	}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
        	console.log(JSON.parse(localStorage.getItem("userInfo")))
        	this.cityNames.city = JSON.parse(localStorage.getItem("userInfo")).positionCitys[0].cityCode
        	this.btnP = {
                invalidDataConfirm:filterBtnPms(this.btnAllPms.invalidDataConfirm),  //无效数据确认
		        invalidDataBatchConfirm:filterBtnPms(this.btnAllPms.invalidDataBatchConfirm),  //批量确认无效
		        invalidDataTurnEffective:filterBtnPms(this.btnAllPms.invalidDataTurnEffective),  //转有效
            }
            this.initCities()
            this.initInvalidList(this.tableData)
            this.getQiNiuToken()
            this.initDec()
        }

    }
</script>
<style>
	.btn{
		margin-bottom:5px;
	}
	  .inline-form{
    	display:inline-block
    }
    .textarea{
    	width:60%
    }
    .hiddenspan{
    	width:130px;
    	display:inline-block
    }
</style>
