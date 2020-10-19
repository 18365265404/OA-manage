<template>
    <div>
        <div class="crumbs">
        	<div style='float:right'>
            	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm">
            		<el-form-item label="城市:" prop='city'>
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
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>重复客户数据</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline grayForm">
		  <el-form-item label="手机：" prop='mobile'>
		    <el-input class='lengthInput' v-model="formInline.mobile" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
			<el-form-item label="来源：" prop='channelId'>
				<el-select v-model="formInline.channelId" clearable placeholder="请选择">
				    <el-option
				      v-for="type in channelIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		</el-form>

        
	            <el-table v-loading="loading.pageList" element-loading-text="拼命加载中" :data="duplicateDataList" border style="width: 100%">	
	                <el-table-column prop="customerName" label="客户"></el-table-column>	                
	                <el-table-column prop="mobile" label="手机"></el-table-column>
	                <el-table-column prop="cityName" label="城市">
	                	<template scope="scope">
			                <div>{{cityText(scope.row.cityCode)}}</div>
			            </template>
	                </el-table-column>
	                <el-table-column prop="statusText" label="状态">
	                	<template scope="scope">
			                <div>{{statusText(scope.row.status)}}</div>
			            </template>
	                </el-table-column>
	                <el-table-column prop="channelName" label="来源"></el-table-column>
	                <el-table-column prop="createTime" label="创建时间" :formatter="formTime"></el-table-column>
	                <el-table-column prop="creatorName" label="录入人"></el-table-column>


	            </el-table>
           

        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col >
                <div class="grid-content bg-purple">
                    <el-pagination class='page_pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[10, 25,50 ,100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next" :total="pagination.total">>
                    </el-pagination>
                </div>
            </el-col>
        </el-row>


    </div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data() {
            return {
            	isChangeCity:false,
            	loading:{
                    pageList:false,
                    detail:false
                },
            	cityNames:{
            		city:'',
            	},
            	storeStatus:[],
            	channelIds:[],
            	storeCitys:[],
            	pickerOptions0:{},
            	formInline:{
                    mobile: '',
                    channelId:'',
                },
                citys:[],
            	duplicateDataList:[],
            	pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
            }
        },

        methods: {
        	getAllCity(){
        		this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表   
					if(res2.data.res == 0){
					   	this.citys =  res2.data.msg;
	  					this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
	  					console.log(JSON.parse(localStorage.getItem("userInfo")).positionCitys)
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
			getAllDuplicateDataList(data){
				this.loading.pageList=true
				this.$axios.post('/customer/queryHsRepeatCustomerList',data).then((res)=>{
					if(res.data.res == 0){
						console.log(res)
						this.storeStatus = this.dicData.HS_CUSTOMER_STATUS; 
                    	this.lastOprations =this.dicData.HS_CUSTOMER_OPERATION_SOURCE;
						this.duplicateDataList = res.data.msg.list
						this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        console.log(JSON.parse(localStorage.getItem("userInfo")))
                        this.loading.pageList=false
					}
					else{
                    	this.loading.pageList=false
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
				})
			},
			handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.getAllDuplicateDataList(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.getAllDuplicateDataList(this.tableData);
            },
			  cityText(data){  //城市显示
            	let cityName;            
		            this.citys.forEach((n)=>{
		                if( n.cityCode==data){
		                    cityName = n.cityName
		                }
		                
		            })		                   
		      return cityName
            },
            statusText(data){  //状态显示
            	let statusText1;            
		            this.storeStatus.forEach((n)=>{
		                if( n.dicValue==data){
		                    statusText1 = n.dicDesc
		                }
		                
		            })		                   
		      return statusText1
            },
            onSubmit(){
				this.getAllDuplicateDataList(this.tableData)		

            },
            changeCityVisible(){
            	this.isChangeCity = true
            },
		    changeCity(val){	
		    	this.cityNames.city = val
		    	if(this.isChangeCity){
		    		this.getAllDuplicateDataList(this.tableData); 
		    		this.isChangeCity = false
		    	}
		    	
                this.$axios.post('/s/getChannelList',{'cityCode':this.cityNames.city}).then((res3)=>{   //所有渠道
                    if(res3.data.res == '0'){ 
                        if(res3.data.msg.length ==1 && res3.data.msg[0].id == '-999'){
							this.channelIds = []
						}
						else{
							this.channelIds = res3.data.msg;	
						} 		
                    }							
		        })
			},
            formTime(row){
            	if(row.createTime !=null){
            		return formatTime(row.createTime)
            	}
            	else{
            		return
            	}
                
            },

        },
        mounted(){
        	this.getAllCity()
            this.getAllDuplicateDataList(this.tableData); 
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize,"mobile":this.formInline.mobile,"channelId":this.formInline.channelId,"cityCode":this.cityNames.city}
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
	.page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
    }
</style>
