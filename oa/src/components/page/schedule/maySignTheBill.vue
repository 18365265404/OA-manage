<template>
    <div>
    	<div class="crumbs">
    		<div style='float:right'>
            	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm">
            		<el-form-item label="城市:" prop='city'>
						<el-select v-model='cityNames.city' @change='changeCity' clearable placeholder="请选择">
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
                <el-breadcrumb-item>我的签单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            <el-form-item label="档期" prop="scheduleTime">
                <el-date-picker
                    v-model="formInline.scheduleTime"
                    type="date"
                    :editable="false"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="宴会厅" prop="hallId">
                <el-select clearable v-model="formInline.hallId" placeholder="请选择">
                    <el-option v-for="hall in hallList"
                               :key="hall.hallId"
                               :label="hall.hallName"
                               :value="hall.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status" >
                <el-select clearable v-model="formInline.status" placeholder="请选择" size="small">
                    <el-option
                        v-for="(item,i) in myStatus.status"
                        :key="i"
                        :label="item.dicDesc"
                        :value="item.dicValue"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
        </el-form>
         <el-table :data="scheduleTableData" border style="width: 100%" >
             <el-table-column type="expand">
                 <template scope="props">
                     <el-form label-position="left" inline class="demo-table-expand">
                         <el-form-item label="档期">
                             <span>{{ props.row.scheduleTime }}</span>
                         </el-form-item>
                         <el-form-item label="档期类型">
                             <span> {{statusText(props.row.status,'orderScheduleStatus')}}</span>
                         </el-form-item>
                         <el-form-item label="处理状态">
                             <span>{{statusText(props.row.handleStatus,'handle_status')}}</span>
                         </el-form-item>
                         <el-form-item label="申请时间">
                             <span>{{formTime(props.row.createTime)}}</span>
                         </el-form-item>
                         <el-form-item label="时间类型">
                             <span>{{statusText(props.row.scheduleTimeType,'schedule_time_type')}}</span>
                         </el-form-item>
                         <el-form-item label="宴会厅">
                             <span>{{ props.row.hallName }}</span>
                         </el-form-item>
                         <el-form-item label="数据状态">
                             <span> {{statusText(props.row.status,'status')}}</span>
                         </el-form-item>
                     </el-form>
                 </template>
             </el-table-column>
            <el-table-column prop="creatorName" label="申请人" ></el-table-column>
             <el-table-column prop="hallName" label="宴会厅" ></el-table-column>
             <el-table-column prop="scheduleTime" label="档期" ></el-table-column>
             <el-table-column prop="status" label="数据状态" >
                 <template scope="scope">
                     {{statusText(scope.row.status,'status')}}
                 </template>
             </el-table-column>
             <el-table-column prop="orderScheduleStatus" label="档期状态" >
                 <template scope="scope">
                     {{statusText(scope.row.orderScheduleStatus,'orderScheduleStatus')}}
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
    moment.locale('zh-cn');
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
            	cityNames:{
            		city:''
            	},
            	storeCitys:[],
            	formLabelWidth:'80px',
                scheduleTableData:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                myStatus:{
                    status:[],
                    orderScheduleStatus:[],
                    schedule_time_type:[],
                    handle_status:[]
                },
                formInline:{
                    status:'',
                    scheduleTime:'',
                    hallId:''
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                hallList:[]

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
            	this.initServiceList(this.tableData)
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
                this.formInline.scheduleTime?this.formInline.scheduleTime=moment(this.formInline.scheduleTime).format('YYYY-MM-DD'):''
                this.initServiceList(this.tableData)
            },
            resetForm(formName) {  //重置
                this.$refs[formName].resetFields();
            },
            initServiceList(data){
                this.$axios.post('/order/getHsScheduleDataList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.scheduleTableData=res.data.msg.list;
                        this.myStatus.status=this.dicData.HS_SCHEDULE_DATA_STATUS;
                        this.myStatus.orderScheduleStatus=this.dicData.HS_SCHEDULE_STATUS;
                        this.myStatus.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
                        this.myStatus.handle_status=this.dicData.HS_HANDLE_STATUS
                    }
                })
            },
            initHallList(){
                this.$axios.get('/store/getHallList',{params:{pageSize:100}}).then((res)=> {
                    if (res.data.res == '0') {
                       this.hallList=res.data.msg.list
                    }
                })
            },
		    formTime(row){
                       if(parseFloat(row)){
                           return moment(parseFloat(row)).format('YYYY-MM-DD')
                       }
            },
            statusText(status,statusName){
                let n;
                this.myStatus[statusName].forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            }
        },
        computed:{

            tableData(){
                return  {"pageNow":this.pagination.pageNow,
                         "pageSize":this.pagination.pageSize,
                         "status":this.formInline.status,
                         "scheduleTime":this.formInline.scheduleTime,
                         "hallId":this.formInline.hallId,
                         "cityCode":this.cityNames.city

                }
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
            this.initServiceList(this.tableData)
            this.initHallList()
        }

    }
</script>
<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
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
