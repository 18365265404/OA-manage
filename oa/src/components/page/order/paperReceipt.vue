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
                <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>纸质收据管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

		<div class='applyReceiptBtn' v-if='btnP.paperReceiptCreate'>
			<el-button type="primary" @click="applyReceiptHandle">新建</el-button>
		</div>
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline grayForm">
			<el-form-item prop='createTime'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.createTime"
			      type="date"
			      placeholder="提交时间" @change="startDateChange"
			      :picker-options="pickerOptions0">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item prop='utilityTime'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.utilityTime"
			      type="date"
			      placeholder="使用时间" @change="endDateChange"
			      :picker-options="pickerOptions0">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item prop='receiptNo'>
		    <el-input class='lengthInput' placeholder='收据编号' v-model="formInline.receiptNo" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item prop='orderNo'>
		    <el-input class='lengthInput' placeholder='订单号' v-model="formInline.orderNo" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item prop='salesId'>
				<el-select v-model="formInline.salesId" clearable placeholder="销售">
				    <el-option
				      v-for="type in salesIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop='financeId'>
				<el-select v-model="formInline.financeId" clearable placeholder="提交财务">
				    <el-option
				      v-for="type in financialIdcounts"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop='receiptStatus'>
				<el-select v-model="formInline.receiptStatus" clearable placeholder="收据状态">
				    <el-option
				      v-for="type in storeStatus"
				      :key="type.dicDesc"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">筛选</el-button>
			  </el-form-item>
			   <el-form-item>
				<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
			  </el-form-item>
		</el-form>




         <el-table :data="paperReceiptTableData" border style="width: 100%">
            <el-table-column prop="receiptNo" label="收据编号" ></el-table-column>
            <el-table-column prop="salesName" label="对应销售" ></el-table-column>>
            <el-table-column prop="createTime" label="提交时间" :formatter="formTime"></el-table-column>
            <el-table-column prop="financeName" label="提交财务" ></el-table-column>
            <el-table-column prop="statusText" label="目前状态">
	                	<template scope="scope">
			                <div>{{statusText(scope.row.status)}}</div>
			            </template>
	                </el-table-column>
            <el-table-column prop="utilityTime" label="使用时间" :formatter="formTime1"></el-table-column>
            <el-table-column prop="orderNo" label="对应订单号"></el-table-column>
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


        <el-dialog  title="收据申请" :visible.sync="dialogFormVisible" :before-close="cancelApplyReceiptHandle">
			  <el-form :model='applyReceipts' :rules='applyReceiptRule' ref="applyReceipts">
				<el-form-item label="销售：" prop='salesId' :label-width="formLabelWidth">
				   <el-select type='array' v-model="applyReceipts.salesId" placeholder="请选择">
				    <el-option
				      v-for="p in salesIds"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item prop='receiptNo' label='收据编号' :label-width="formLabelWidth">
			       <el-input :maxlength='20' v-model="applyReceipts.receiptNo" ></el-input>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="confirmApplyReceiptHandle('applyReceipts')">确定</el-button>
			    <el-button @click="cancelApplyReceiptHandle">取 消</el-button>
			  </div>
			</el-dialog>

    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
            	formLabelWidth:'80px',
                paperReceiptTableData:[],//顾问列表
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                storeCitys:[],
                citys:[],
                cityNames:{
                    city:''
                },
                financialIdcounts:{},
                cusIds:{},
                formInline:{
                	receiptNo:'',
                	orderNo:'',
                	salesId:'',
                	financeId:'',
                	status:'',
                	createTime:'',
                	utilityTime:'',
                	receiptStatus:''
                },
                salesIds:'',
                storeStatus:'',
                pickerOptions0:{},
                applyReceipts:{
                	salesId:'',
                	receiptNo:''
                },
                applyReceiptRule:{
                	salesId: [
			            { required: true, message: '请选择销售', trigger: 'change' },
			          ],
			          receiptNo: [
			            { required: true, message: '请输入收据编号', trigger: 'blur' },
			          ]
                },
                dialogFormVisible:false,
                btnP:{
                	paperReceiptCreate:''
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initServiceList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initServiceList(this.tableData)
            },
            onSubmit(){
            	this.initServiceList(this.formInline)
            },
            resetForm(formName){
            	this.$refs[formName].resetFields();
            },
            applyReceiptHandle(){
            	this.dialogFormVisible = true
            },
            confirmApplyReceiptHandle(formName){
            	let data = {
            		receiptNo:this.applyReceipts.receiptNo,
            		salesId:this.applyReceipts.salesId
            	}
            	this.$refs[formName].validate((valid) => {
		          if (valid) {
	                this.$axios.post('/order/saveHsPaperReceipt',data).then((res)=>{    //获取所有城市列表
						   	if(res.data.res == '0'){
						   		this.initServiceList(this.tableData);
						   		this.cancelApplyReceiptHandle()
							}
							else{
							     this.$message.error(res.data.msg)
							     this.cancelApplyReceiptHandle()
                     			 return false;
							}

						})
		          } else {
		             this.$message.error('请填写必要信息！')
                     return false;
		          }
		        });




            },
            cancelApplyReceiptHandle(){
            	this.$refs['applyReceipts'].resetFields();
            	this.dialogFormVisible = false
            },
            initServiceList(data){
                this.$axios.post('/order/getHsPaperReceiptList',data).then((res)=> {
                    if (res.status == 200) {
                    	this.storeStatus = this.dicData.HS_RECEIPT_STATUS;
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.paperReceiptTableData=res.data.msg.list;
                    }
                })
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
            getAllCitys(){
            	this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
						   	if(res2.data.res == 0){

						   		this.citys =  res2.data.msg;
		  						this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys;
		  						this.storeCitys.forEach((e)=>{
						            this.citys.forEach((n)=>{
							            if( n.cityCode==e.cityCode){
							                e.cityName = n.cityName
							                this.cityNames.city = this.storeCitys[0].cityCode;
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
			     	this.$axios.get('/store/getStoreManagerByCityCode',{params: {cityCode: this.cityNames.city}}).then((res)=>{
			     		if(res.data.res == '0'){
		                		this.financialIdcounts=res.data.msg.financialList;
		                		this.salesIds = res.data.msg.salesList;
			     		}

		           })
            },
            startDateChange(val){
		      	this.formInline.createTime = val
		    },
		    endDateChange(val){
		      	this.formInline.utilityTime = val
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
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
        	this.btnP = {
                	paperReceiptCreate:filterBtnPms(this.btnAllPms.paperReceiptCreate)
                }
            this.initServiceList(this.tableData);
            this.getAllCitys()
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
</style>
