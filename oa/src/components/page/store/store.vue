<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>门店管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline grayForm">

		  <el-form-item label="门店名称：" prop='storeName'>
		    <el-input class='lengthInput' v-model="formInline.storeName" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item label="状态：" :label-width="formLabelWidth1" prop='status'>
				<el-select v-model="formInline.status" clearable placeholder="请选择">
				    <el-option
				      v-for="type in storeStatus"
				      :key="type.dicDesc"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="城市：" :label-width="formLabelWidth1" prop='cityCode'>
				<el-select v-model="formInline.cityCode" clearable placeholder="请选择">
				    <el-option
				      v-for="type in storeCitys"
				      :key="type.cityName"
                      :label="type.cityName"
                      :value="type.cityCode">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		   <el-form-item>
			<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
		  </el-form-item>
		</el-form>

		 <el-button type="text" @click="addStore" v-if="btnMsg.storeStoreMgrAdd">
          	<el-button type="primary" icon="plus">添加门店</el-button>
          </el-button>

          <el-dialog  title="添加门店" :visible.sync="dialogFormVisible" :before-close="cancelAddStoreHandle">
			  <el-form :model='addStores' :rules='addrules' ref="addStores">
			  	<el-form-item label="城市：" prop='cityCode' :label-width="formLabelWidth">
				   <el-select v-model="addStores.cityCode" placeholder="请选择" @change="changeCity">
				    <el-option
				      v-for="p in cityNames"
				      :key="p.id"
				      :label="p.cityName"
				      :value="p.cityCode" >
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="名称：" prop='storeName' :label-width="formLabelWidth">
				    <el-input v-model="addStores.storeName"></el-input>
				</el-form-item>
				<el-form-item label="地址：" prop='storeAddress' :label-width="formLabelWidth">
				    <el-input  v-model="addStores.storeAddress"></el-input>
				</el-form-item>
				<el-form-item label="驻店财务：" prop='financialIds' :label-width="formLabelWidth">
				   <el-select type='array' multiple v-model="addStores.financialIds" placeholder="请选择">
				    <el-option
				      v-for="p in financialIdcounts"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="店长：" prop='storeManagerIds' :label-width="formLabelWidth">
				   <el-select type='array' multiple v-model="addStores.storeManagerIds" placeholder="请选择">
				    <el-option
				      v-for="p in storeManagerIdcounts"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="销售：" prop='salesIds' :label-width="formLabelWidth">
				   <el-select multiple type='array' v-model="addStores.salesIds" placeholder="请选择">
				    <el-option
				      v-for="p in salesLists"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="公司：" prop='companyInfoId' :label-width="formLabelWidth">
				   <el-select clearable v-model="addStores.companyInfoId" placeholder="请选择">
				    <el-option
				      v-for="p in companyInfoListcounts"
				      :key="p.id"
				      :label="p.companyName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="addStoreHandle('addStores')">确定</el-button>
			    <el-button @click="cancelAddStoreHandle">取 消</el-button>
			  </div>
			</el-dialog>


		  <el-table :data="storeTableData" border style="width: 100%">
			<el-table-column prop="storeName" label="名称"></el-table-column>
		    <el-table-column prop="storeAddress" label="地址"></el-table-column>
		    <el-table-column prop="cityName" label="城市"></el-table-column>
		    <el-table-column prop="userMap" label="店长">
		    	<template scope="scope">
                    <span class='manager' v-for='type in scope.row.userMap.storeManagerList'>{{type.nickName}}</span>
               </template>
		    </el-table-column>
		    <el-table-column prop="userMap" label="驻店财务">
		    	<template scope="scope">
                    <span class='manager' v-for='type in scope.row.userMap.financialList'>{{type.nickName}}</span>
               </template>
		    </el-table-column>
		    <el-table-column prop="userMap" label="销售">
		    	<template scope="scope">
                    <span class='manager' v-for='type in scope.row.userMap.salesList'>{{type.nickName}}</span>
               </template>
		    </el-table-column>
		    <el-table-column prop="createTime" label="创建时间" :formatter="formTime"></el-table-column>
		    <el-table-column prop="modifyTime" label="修改时间" :formatter="formTime1"></el-table-column>
		    <el-table-column prop="statusText" label="状态"></el-table-column>
		    <el-table-column prop="operation" label="操作">
		    	<template scope="scope">
		    		<div class="btnDiv">
		    			<el-button
                            v-show="btnMsg.storeStoreMgrEdit"
				          type="text" size="small" :disabled='isdisableds[scope.$index]'
				          @click="handleEdit(scope.$index, scope.row)">
				          	修改
				          </el-button>
						<!--<el-button
				          size="small"
				          @click="handleDelete(scope.$index, scope.row)">
				          {{isUse[scope.$index]}}
				          </el-button>-->
				          <el-button
	                        type="text"
	                        v-show="scope.row.status==0&&btnMsg.storeStoreMgrDisable"
	                        size="small"
	                        @click="changeStatus(scope.$index, scope.row)">
	                        禁用
	                    </el-button>
	                    <el-button
	                        type="text"
	                        v-show="scope.row.status==1&&btnMsg.storeStoreMgrEnable"
	                        size="small"
	                        @click="changeStatus(scope.$index, scope.row)">
	                        启用
	                    </el-button>
		    		</div>


			      </template>
		    </el-table-column>
		</el-table>
		<el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
			<el-col>
			</el-col>
			<el-col>
				<div class="grid-content bg-purple">
					<el-pagination class='page_pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[10, 25,50 ,100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next" :total="pagination.total">
    				</el-pagination>
				</div>
			</el-col>
		 </el-row>

		 <el-dialog  title="修改门店" :visible.sync="dialogFormVisible1" :before-close="cancelChangeBanquetHandle">
			 <el-form :model='changeStores' :rules="changerules" ref="changeStores">
				<el-form-item label="名称：" prop='storeName' :label-width="formLabelWidth">
				    <el-input v-model="changeStores.storeName"></el-input>
				</el-form-item>
				<el-form-item label="地址：" prop='storeAddress' :label-width="formLabelWidth">
				    <el-input  v-model="changeStores.storeAddress"></el-input>
				</el-form-item>
				<el-form-item label="驻店财务：" prop='financialIds' :label-width="formLabelWidth">
				   <el-select multiple  v-model="changeStores.financialIds" placeholder="请选择">
				    <el-option
				      v-for="p in financialIdcounts"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="店长：" prop='storeManagerIds' :label-width="formLabelWidth">
				   <el-select multiple v-model="changeStores.storeManagerIds" placeholder="请选择">
				    <el-option
				      v-for="p in storeManagerIdcounts"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="销售：" prop='salesIds' :label-width="formLabelWidth">
				   <el-select multiple type='array' v-model="changeStores.salesIds" placeholder="请选择">
				    <el-option
				      v-for="p in salesLists"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="公司：" prop='companyInfoId' :label-width="formLabelWidth">
				   <el-select clearable v-model="changeStores.companyInfoId" placeholder="请选择">
				    <el-option
				      v-for="p in companyInfoListcounts"
				      :key="p.id"
				      :label="p.companyName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="changeBanquetHandle('changeStores')">确定</el-button>
			    <el-button @click="cancelChangeBanquetHandle">取 消</el-button>
			  </div>
			</el-dialog>

    </div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data() {
            return {
            	formLabelWidth:'120px',
            	formLabelWidth1:'70px',
            	dialogFormVisible:false,
            	dialogFormVisible1:false,
            	cityName:'',
            	storeTableData:[],
            	storeStatus:{},
            	cityNames:{},
            	storeCitys:{},
            	companys:[],
            	financialIdcounts:[],
            	storeManagerIdcounts:[],
            	companyInfoListcounts:[],
            	salesLists:[],
            	 pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                mangers:[],




               formInline: {
		          storeName: '',
		          cityCode:'',
		          status:''
		        },
		        addStores:{
		          storeAddress:'',
		          financialIds:[],
		          storeManagerIds:[],
		          cityCode:'',
		          storeName:'',
		          salesIds:'',
		          companyInfoId:'',
		        },
		        addrules:{  //添加门店校验
		        	cityCode: [
			            { required: true, message: '请选择城市', trigger: 'change' },
			          ],
			          storeName: [
			            { required: true, message: '请输入门店名', trigger: 'blur' },
			          ],
			          storeAddress: [
			          	{ required: true, message: '请输入门店地址', trigger: 'blur' },
			          ]
		        },
		        changeStores:{
		          storeAddress:'',
		          financialIds:[],
		          storeManagerIds:[],
		          cityCode:'',
		          storeName:'',
		          salesIds:'',
		          companyInfoId:''
		        },
		        changerules: {  //修改门店校验
		          storeName: [
		            { required: true, message: '请输入门店名', trigger: 'blur' },
		          ],
		          storeAddress: [
		            { required: true, message: '请输入门店地址', trigger: 'blur' },
		          ]
		        },
		        changeBanquets:{
		        	storeName:'',
		        	banquetName:''
		        },
		        isUse:[],
		        isdisableds:[],
                btnMsg:{
                    storeStoreMgrEnable:false,//启用
                    storeStoreMgrEdit:false,//修改门店
                    storeStoreMgrAdd:false,//添加门店
                    storeStoreMgrDisable:false//禁用
                }
            }
        },
        methods: {
            initBtnMsg(){
                this.btnMsg.storeStoreMgrEnable=filterBtnPms(this.btnAllPms.storeStoreMgrEnable);
                this.btnMsg.storeStoreMgrEdit=filterBtnPms(this.btnAllPms.storeStoreMgrEdit);
                this.btnMsg.storeStoreMgrAdd=filterBtnPms(this.btnAllPms.storeStoreMgrAdd);
                this.btnMsg.storeStoreMgrDisable=filterBtnPms(this.btnAllPms.storeStoreMgrDisable);
            },
        	initStoreTable(data){  //获取表格内容

                 this.$axios.get('/store/getStoreList',{params:data}).then((res)=>{
                 	if(res.data.res == 0){
                 		this.storeStatus = this.dicData.DATA_STATUS;
                 		this.pagination.total=res.data.msg.total;
	                     this.pagination.pageNum=res.data.msg.pageNum;
	                     this.pagination.pageSize=res.data.msg.pageSize;
	                     this.storeTableData=res.data.msg.list;
	                     var listLength = res.data.msg.list.length;

	             	 	 let newData = {
	             	 	 	'pageSize':100
	             	 	 };
	                    this.$axios.get('/b/getOpenCityLists',{params:newData}).then((res)=>{    //获取所有城市列表

	  						this.storeCitys = res.data.msg;
	  						this.cityNames = res.data.msg;
	  						this.storeTableData.forEach((e)=>{
	  							console.log(res.data.msg)
	                            res.data.msg.forEach((m)=>{
	                               if( m.cityCode==e.cityCode){
	                                   e.cityName=m.cityName
	                               }
	                            })
	                            this.storeStatus.forEach((n)=>{
	                               if( n.dicValue==e.status){
	                                   e.statusText=n.dicDesc
	                               }
	                            })
	                       })

		             	 });
		                for(var i=0;i<res.data.msg.list.length;i++){
	                       	console.log(this.storeTableData[i].status)
	                       		if(this.storeTableData[i].status == 0){
	                       			this.isdisableds[i] = false
	                       		}
	                       		else{
	                       			this.isdisableds[i] = true;
	                       		}
	                       }
                 	}

             	 })

              },
              changeStatus(index, row){
				if(this.storeTableData[index].status == 0){
		      			this.$confirm('此操作将禁用该门店, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 storeId:this.storeTableData[index].id,
			            		 storeStatus:this.storeTableData[index].status
			            	}
			            	data.storeStatus?data.storeStatus=0: data.storeStatus=1;
			            	 this.$axios.post('/store/updateStoreStatus',data).then((res)=>{
								this.initStoreTable(this.tableData);

				             })

				          this.$message({
				            type: 'success',
				            message: '成功禁用!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消禁用'
				          });
				        });
		      		}
		      		else{
		      			this.$confirm('此操作将解启用该门店, 是否继续?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	let data={
			            		 storeId:this.storeTableData[index].id,
			            		 storeStatus:this.storeTableData[index].status
			            	}
			            	data.storeStatus?data.storeStatus=0: data.storeStatus=1;
			            	 this.$axios.post('/store/updateStoreStatus',data).then((res)=>{
								this.initStoreTable(this.tableData);

				             })
					          this.$message({
					            type: 'success',
					            message: '启用成功!'
					          });
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消启用'
					          });
					        });
		      		}
            },




		      handleSizeChange(val) {   //页码变化
                   this.pagination.pageSize=val;
                   this.initStoreTable(this.tableData)
		      },
		      handleCurrentChange(val) {
                  this.pagination.pageNow=val;
                  this.initStoreTable(this.tableData)
		      },

           	  onSubmit() {   //搜索
	               this.initStoreTable(this.formInline)
		      },

		      resetForm(formName) {  //重置
		          this.$refs[formName].resetFields();
		      },

		      handleEdit(index, row) {  //编译表格
		      	  this.dialogFormVisible1 = true;
		      	  this.changeStores.id = this.storeTableData[index].id;
				  this.changeStores.cityCode = this.storeTableData[index].cityCode;
				  this.changeStores.storeAddress = this.storeTableData[index].storeAddress;
				  this.changeStores.storeName = this.storeTableData[index].storeName;
				  this.changeStores.storeManagerIds  = this.storeTableData[index].storeManagerList;
				  this.changeStores.financialIds  = this.storeTableData[index].financialList;
				  this.changeStores.salesIds  = this.storeTableData[index].salesList;
				  this.changeStores.companyInfoId  = this.storeTableData[index].companyInfoId;
				  let data = this.storeTableData[index].cityCode;
			  	  this.grtmessateByCitycode(data)
		      },
		      cancelChangeBanquetHandle(){   //取消更改门店
		      	this.$refs['changeStores'].resetFields();
            	  this.dialogFormVisible1 = false
              },

              changeBanquetHandle(formName){   //确定更改门店
              	this.$refs[formName].validate((valid) => {
		          if (valid) {
	                this.$axios.post('/store/updateStore',this.changeStores).then((res)=>{
						 if(res.status==200){
	                        this.initStoreTable(this.tableData);
	                        this.cancelChangeBanquetHandle()
	                    }else {
	                        alert(res.data.msg)
	                    }
				   })
		          } else {
		             this.$message.error('请填写必要信息！')
                     return false;
		          }
		        });
              },
		      handleDelete(index, row) {  //是否禁用表格
		      		if(this.storeTableData[index].status == 0){
		      			this.$confirm('此操作将禁用该宴会厅, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 storeId:this.storeTableData[index].id,
			            		 storeStatus:1
			            	}
			            	 this.$axios.post('/store/updateStoreStatus',data).then((res)=>{
								this.initStoreTable(this.tableData);
				             })

				          this.$message({
				            type: 'success',
				            message: '成功禁用!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消禁用'
				          });
				        });
		      		}
		      		else{
		      			this.$confirm('此操作将启用该宴会厅, 是否继续?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	let data={
				            		 storeId:this.storeTableData[index].id,
				            		 storeStatus:0
				            	 }
				            	 this.$axios.post('/store/updateStoreStatus',data).then((res)=>{
									this.initStoreTable(this.tableData);
					             })

					          this.$message({
					            type: 'success',
					            message: '启用成功!'
					          });
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消启用'
					          });
					        });
		      		}

		      },
		      addStore(){   //添加门店按钮
		      	this.dialogFormVisible = true;
		      },
			  changeCity(){  //城市下拉框改变
			  	let data = this.addStores.cityCode;
				this.addStores.storeManagerIds = [],
				this.addStores.financialIds = [],
			  	this.addStores.companyInfoId = [];
			  	this.addStores.salesIds = [];
	            this.grtmessateByCitycode(data)
		      },

		     //  获取店长/财务/公司通用方法
		     grtmessateByCitycode(data){
		     	this.$axios.get('/store/getStoreManagerByCityCode',{params: {cityCode: data}}).then((res)=>{
		     		if(res.data.res == '0'){
	                		this.storeManagerIdcounts= res.data.msg.storeManagerList;
	                		this.financialIdcounts=res.data.msg.financialList;
	                		this.salesLists = res.data.msg.salesList;
	                		this.companyInfoListcounts=res.data.msg.companyInfoList;
							console.log(this.financialIdcounts)
		     		}

	            })
		     },

		       addStoreHandle(formName){   //确定添加门店
		       		this.$refs[formName].validate((valid) => {
			          if (valid) {
			               this.$axios.put('/store/saveStore',this.addStores).then((res)=>{
			                    if(res.data.res==0){
			                        this.initStoreTable(this.tableData);
			                        this.cancelAddStoreHandle();
			                    }else {
			                        alert(res.data.msg)
			                        this.cancelAddStoreHandle();
			                    }
			                })
			          } else {
			            this.$message.error('请填写必要信息！')
                     	return false;
			          }
			        });
              },

              cancelAddStoreHandle(){  //取消添加门店
              	this.$refs['addStores'].resetFields();
				  this.dialogFormVisible = false;

              },

              formTime(row){
                 if(row.createTime == null){

            	}
            	else{
            		return formatTime(row.createTime)
            	}
              },
               formTime1(row){
                 if(row.modifyTime == null){

            	}
            	else{
            		return formatTime(row.modifyTime)
            	}
              },
        },
        mounted(){
            this.initStoreTable(this.tableData);
            this.initBtnMsg()
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize, 'hallName':this.formInline.storeName, 'status':this.formInline.status,'cityCode':this.formInline.cityCode}
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
	.demo-form-inline{
		text-align: center;
	}
	 .message_bottom{
	  	height:44px;
	  	line-height: 44px;
	  	font-size: 12px;
    	color: #999;
		text-align: center;
	}
	.page_pagination{
		text-align: right;
	}
	.lengthInput{
		width:220px;
	}


	.manager{
		margin-right:5px;
	}
	.disabledSpan{
		padding:5px 20px;
		border:1px solid #eee;
		background-color:#d1d1d1;
	}
	.grayForm input{
		color:#666
	}

	.btnDiv{
		white-space:nowrap;
	}
</style>
