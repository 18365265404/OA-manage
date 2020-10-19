<template>
    <div>
    	<div class="crumbs">
    		<div style='float:right'>
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
            </div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>档期管理</el-breadcrumb-item>
                <el-breadcrumb-item>档期查看</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline grayForm">
        	<el-form-item prop='year'>
				<el-select v-model="formInline.year" clearable placeholder="选择年份">
				    <el-option v-for="n in years" :value="n" :label='n+"年"' :key='n'>{{n}}年</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop='mounth'>
				<el-select v-model="formInline.mounth" @change='changeMounthHandle' clearable placeholder="选择月份">
				    <el-option v-for="n in mounths" :value="n" :label='n+"月"' :key='n'>{{n}}月</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop='banquet' label='宴会厅'>
                <el-popover
                    ref="popover2"
                    placement="right-start"
                    title="厅列表"
                    width="200"
                    trigger="click"
                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                    <div style='max-height:200px;overflow-y: scroll;'>
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="city in cities" style='display:block;margin-left:0' :label="city" :key="city.hallName">{{city.hallName}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-popover>

                <div v-popover:popover2 style="color:#999;box-sizing:border-box;min-height: 36px;line-height: 28px; padding:3px 10px; border:1px solid #bfcbd9;border-radius: 4px;word-wrap: break-word !important;word-break: break-all !important; white-space: normal !important;width: 400px">{{formInline.banquet||'请选择宴会厅'}}</div>
			</el-form-item>
				<el-button type="primary" @click="onSubmit">筛选</el-button>
			  </el-form-item>
			   <el-form-item>
				<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
			  </el-form-item>
		</el-form>




         <el-table v-loading="loading.pageList" element-loading-text="拼命加载中" :data="scheduleTableData" border style="width: 100%">
            <el-table-column v-for="col in cols" :prop="col.prop" :label="col.label">
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
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
            	cityNames:{
            		city:''
            	},
            	storeCitys:[],
            	loading:{
                    pageList:false,
                    detail:false
               },
            	formLabelWidth:'80px',
                scheduleTableData:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                formInline:{
                	banquet:'',
                	year:'',
                	mounth:''
                },
                years:[2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023],
                mounths:12,
                banquets:[],
				ischeckboxShow:false,
		         checkAll: false,
		        checkedCities: [],
		        cities: [],
		        isIndeterminate: false,
				hsllIds:[],
				hsllId1s:[],
				scheduleTime:'',
				array:[],
				cols:[{prop:'scheduleTime',label:'日期'}],
				backBanquets:[],
				dec:{
					banquet_status1:[],
					banquet_status3:[],
					banquet_status2:[],
				}
            }
        },
        methods: {
        	getOpenCity(){
            	this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
					if(res2.data.res == 0){
					    this.citys =  res2.data.msg;
	  					this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
	  					this.storeCitys.forEach((e)=>{
						    this.citys.forEach((n)=>{
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
            	this.getBanquet()
			},
        	getDec(){
        		this.dec.banquet_status1 = this.dicData.HS_SECHEDULE_TIME_TYPE
        		this.dec.banquet_status3 = this.dicData.HS_SCHEDULE_STATUS
        		this.dec.banquet_status2 = this.dicData.HS_HANDLE_STATUS
        	},
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initServiceList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initServiceList(this.tableData)
            },
            onSubmit(){
            	if(this.formInline.mounth !='' && this.formInline.year == ''){
            		this.$message.error('选择年份！')
                    return false;
            	}
            	else if(this.formInline.year != '' && this.formInline.mounth ==''){
            		this.scheduleTime = this.formInline.year
            	}
            	else if(this.formInline.year == '' && this.formInline.mounth ==''){
            		this.scheduleTime = ''
            	}
            	else{
            		if(this.formInline.mounth<10){
            			this.scheduleTime = this.formInline.year + '-' + '0'+this.formInline.mounth
            		}
            		else{
            			this.scheduleTime = this.formInline.year + '-' +this.formInline.mounth
            		}
            		
            	}
				this.initServiceList(this.tableData);

            },
            changeMounthHandle(val){
            		this.formInline.mounth = val
            },
            
            resetForm(formName){
            	this.$refs[formName].resetFields();
            	this.hsllIds = this.hsllId1s
                this.ischeckboxShow=false
                    this.checkAll=false
                    this.checkedCities=[]
                    this.isIndeterminate=false
            },

            initServiceList(data){
            	this.loading.pageList=true
            	var self = this;           	
            	self.$axios({
	                url: "/order/getHsScheduleList?pageNow="+self.pagination.pageNow+'&pageSize='+self.pagination.pageSize+'&scheduleTime='+self.scheduleTime+'&cityCode='+self.cityNames.city,
	                method: 'post',
	                data: data,
	                transformRequest: [function (data) {
	                    let ret = self.hsllIds
	                    return ret
	                }],
	                headers: {
	                    'Content-Type': 'application/json;charset=UTF-8'
	                }
	           }).then(
	                function (res) {
	                  if(res.data.res=='0'){
	                  	self.years = [2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023];
                        self.pagination.total=res.data.msg.total;
                        self.pagination.pageNum=res.data.msg.pageNum;
                        self.pagination.pageSize=res.data.msg.pageSize;
                        self.scheduleTableData=res.data.msg.list;
                        self.cols = [{prop:'scheduleTime',label:'日期'}],
                        self.objectToArray(self.scheduleTableData[0])
                        self.loading.pageList=false
	                  }else {
	                  	 self.loading.pageList=false
	                      alert(res.data.msg)
	                  }
	                }
	            )

            },
            cityText(data){  //城市显示
            	alert(data)
            	let cityName;

		      return cityName
            },
            objectToArray(item){
             	if(item !=null && item !=undefined){
             		let {keys, values, entries} = Object;
	                let ary=[];
	                for (let [key, value] of entries(item)) {
	                	var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	　　						if(reg.test(key)){
								ary.push([key, value]);
								let a = {prop:key,label:key}
								this.cols.push(a)
						}
	                }
	               for(var i=0;i<this.scheduleTableData.length;i++){
		                for(var j=0;j<this.cols.length;j++){
		                	let b = this.cols[j].prop;	
		                	
		                	if(this.scheduleTableData[i][b] != null && b !='scheduleTime'){
		                		let NewArr = this.scheduleTableData[i][b].split(',')
		                		let objectstatus = '';
		                		for(var h=0;h<NewArr.length;h++){
		                			let arr = NewArr[h].split('_');			                	
			                			if(arr[2]){
			                				this.dec.banquet_status1.forEach((n)=>{
									            if( n.dicValue==arr[0]){
									                objectstatus +=  n.dicDesc
									            }
									        })
									        this.dec.banquet_status3.forEach((n)=>{
									            if( n.dicValue==arr[2]){
									                if(NewArr.length>1){
									                	if(h==0){
									                		objectstatus +=  '(' + n.dicDesc+')-'
									                	}
									                	else{
									                		objectstatus +=  '(' + n.dicDesc+')'
									                	}
									                }
									                else{
									                	objectstatus +=  '(' + n.dicDesc+')'
									                }
									            }	
									        })
			                			}
			                			else{			                				
			                				this.dec.banquet_status1.forEach((n)=>{
									            if(n.dicValue==arr[0]){
									                objectstatus +=  n.dicDesc
									            }	
									        })
									        this.dec.banquet_status2.forEach((n)=>{
									        	
									            if( n.dicValue==arr[1]){
									                if(NewArr.length>1){
									                	if(h==0){
									                		objectstatus +=  '(' + n.dicDesc+')-'
									                	}
									                	else{
									                		objectstatus +=  '(' + n.dicDesc+')'
									                	}
									                }
									                else{
									                	objectstatus +=  '(' + n.dicDesc+')'
									                }
									            }
									        })									       
			                			}			                	
			                		 this.scheduleTableData[i][b] = objectstatus
		                		}
		                		
		                	}
		                }
					}
	                return ary
             	}               
            },
             handleCheckAllChange(event) {
		         this.checkedCities = event.target.checked ? this.cities : [];
       			 this.isIndeterminate = false;
       			 let objectArr = '';
       			 this.array=[];
       			 this.formInline.banquet=''

		        if(event.target.checked){
                    	for(var i=0;i<this.checkedCities.length;i++){
                    		this.array.push(this.checkedCities[i].id);
                    		this.formInline.banquet += this.checkedCities[i].hallName+', ';
                    	}
                    	this.array.forEach((m)=>{
	                         objectArr += '"'+m+'"'+','
	                    })
	                    if (objectArr.length > 0) {
					        objectArr = objectArr.substr(0,objectArr.length - 1);
					    }
		      			this.hsllIds='['+objectArr+']';

		        }
		        else{
		        	this.formInline.banquet = '';
		        	this.checkedCities = [];
		        	this.hsllIds = this.hsllId1s
		        }
		      },

		      handleCheckedCitiesChange(value) {
		      	let objectArr = ''
		      	this.formInline.banquet=''
		      	this.array=[];
		      	if(this.checkedCities.length>0){
					
		      		if(this.checkedCities.length == 1){
		      			this.hsllIds='['+ '"'+this.checkedCities[0].id+'"'+']';
		      			this.formInline.banquet = this.checkedCities[0].hallName;
		      		}
		      		else{
                    	for(var i=0;i<this.checkedCities.length;i++){
                    		this.array.push(this.checkedCities[i].id)
                    		this.formInline.banquet += this.checkedCities[i].hallName+',  ';
                    	}
                    	this.array.forEach((m)=>{
	                         objectArr += '"'+m+'"'+','
	                    })
	                    if (objectArr.length > 0) {
					        objectArr = objectArr.substr(0,objectArr.length - 1);
					    }
		      			this.hsllIds='['+objectArr+']';
		      		}

		      	}
		      	else{
		      		this.formInline.banquet = '';
		      		this.hsllIds = this.hsllId1s
		      	}


		        let checkedCount = value.length;
		        this.checkAll = checkedCount === this.cities.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
		      },
		      getBanquet(){
		      	this.array = []
		      	this.hsllIds = []
		      	this.hsllId1s = []
		      	this.$axios.get('/store/getHallList',{params:{'pageSize':100,'cityCode':this.cityNames.city,'status':0}}).then((res)=>{
                    if(res.data.res == '0'){
                    	this.cities = res.data.msg.list
                    	let objectArr = ''
                    	if(this.cities.length<5){
                    		for(var i=0;i<this.cities.length;i++){
	                    		this.array.push(this.cities[i].id)
	                    	}
                    	}
                    	else if(this.cities.length <= 0){
                    		this.array = []
                    	}
                    	else{
                    		for(var i=0;i<5;i++){
	                    		this.array.push(this.cities[i].id)
	                    	}
                    	}
                    	this.array.forEach((m)=>{
	                         objectArr += '"'+m+'"'+','
	                    })
	                    if (objectArr.length > 0) {
					        objectArr = objectArr.substr(0,objectArr.length - 1);
					    }
                    	this.hsllIds='['+objectArr+']';
                    	this.hsllId1s='['+objectArr+']';
                    	this.initServiceList(this.tableData);
                    }
             	 })
		      },
		    formTime(row){
                return formatTime(row.createTime)
            },
            formTime1(row){
            	if(row.utilityTime == null){

            	}
            	else{
            		return formatTime(row.utilityTime)
            	}

            },
        },
        computed:{
            tableData(){
                return  {'hsllIds':this.hsllIds}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
        	this.cityNames.city = JSON.parse(localStorage.getItem("userInfo")).positionCitys[0].cityCode
        	this.getOpenCity();
        	this.getDec();
        }

    }
</script>
<style>
	.page_pagination{
		text-align: right;
	}
	.applyReceiptBtn{
		text-align: right;
		margin-bottom:10px;
	}
	.textarea>textarea{
		resize:none;
		width:250px;
		height:100px;
	}
</style>
