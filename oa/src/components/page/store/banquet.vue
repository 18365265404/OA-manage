<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>宴会厅管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline grayForm">
		  <el-form-item label="宴会厅名称：">
		    <el-input class='lengthInput' v-model="formInline.hallName" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item label="状态：" :label-width="formLabelWidth1">
				   <el-select v-model="formInline.status" clearable placeholder="请选择">
				    <el-option
				      v-for="type in banquetStatus"
				      :key="type.dicDesc"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				  </el-select>
				</el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		</el-form>


		 <el-button type="text" @click="addBanquet" v-if="btnMsg.storeBanquetEdit">
          	<el-button type="primary" icon="plus">添加宴会厅</el-button>
          </el-button>

          <el-dialog  title="添加宴会厅" :visible.sync="dialogFormVisible" :before-close="cancelAddBanquetHandle">

			  <el-form :model='addBanquets' ref="addBanquets" :rules='addBanquetRules' >
			  	<el-form-item label="门店：" prop='storeName' :label-width="formLabelWidth">
				   <el-select v-model="addBanquets.storeName" placeholder="请选择">
				    <el-option
				      v-for="p in storeNames"
				      :key="p.id"
				      :label="p.storeName"
				      :value="p.id" >
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="宴会厅名称：" prop='banquetName' :label-width="formLabelWidth">
				    <el-input v-model="addBanquets.banquetName"></el-input>
				</el-form-item>

			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="addBanquetHandle('addBanquets')">确定</el-button>
			    <el-button @click="cancelAddBanquetHandle">取 消</el-button>
			  </div>
			</el-dialog>


		  <el-table :data="banquetTableData" border style="width: 100%">
			<el-table-column prop="hallName" label="名称"></el-table-column>
		    <el-table-column prop="storeName" label="所属门店"></el-table-column>
		    <el-table-column prop="createTime" label="创建时间" :formatter="formTime"></el-table-column>
		    <el-table-column prop="statusText" label="状态"></el-table-column>
		    <el-table-column prop="operation" label="操作">
		    	<template scope="scope">
			        <el-button
                        v-show="btnMsg.storeBanquetEdit"
			          type="info" size="small" :disabled='isdisableds[scope.$index]'
			          @click="handleEdit(scope.$index, scope.row)">
			          	修改
			          </el-button>
					<!--<el-button
			          size="small"
			          @click="handleDelete(scope.$index, scope.row)">
			          {{isUse[scope.$index]}}
			          </el-button>	-->
			          <el-button
                        type="info"
                        v-show="scope.row.status==0&&btnMsg.storeBanquetDisable"
                        size="small"
                        @click="changeStatus(scope.$index, scope.row)">
                        禁用
                    </el-button>
                    <el-button
                        type="danger"
                        v-show="scope.row.status==1&&btnMsg.storeBanquetEnable"
                        size="small"
                        @click="changeStatus(scope.$index, scope.row)">
                        启用
                    </el-button>
			      </template>
		    </el-table-column>
		</el-table>
		<el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
			<el-col>
			</el-col>
			<el-col>
				<div class="grid-content bg-purple">
					<el-pagination class='page_pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[10, 25,50 ,100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next" :total="pagination.total">>
    				</el-pagination>
				</div>
			</el-col>
		 </el-row>

		 <el-dialog  title="修改宴会厅" :visible.sync="dialogFormVisible1" :before-close="cancelChangeBanquetHandle">
			  <el-form v-model='changeBanquets'>
			  	<el-form-item label="门店：" :label-width="formLabelWidth">
				    <el-input class='lengthInput' disabled v-model="changeBanquets.storeName"></el-input>
				</el-form-item>
				<el-form-item label="宴会厅名称：" :label-width="formLabelWidth">
				    <el-input class='lengthInput' v-model="changeBanquets.banquetName"></el-input>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="changeBanquetHandle">确定</el-button>
			    <el-button @click="cancelChangeBanquetHandle">取 消</el-button>
			  </div>
			</el-dialog>

    </div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
	var changeId;
    export default {
        data() {
            return {
            	radio:'',
            	formLabelWidth:'120px',
            	formLabelWidth1:'70px',
            	dialogFormVisible:false,
            	dialogFormVisible1:false,
            	banquetTableData:[],
            	banquetStatus:{},
            	 pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
               formInline: {
		          hallName: '',
		          status:''
		        },
		        addBanquets:{
		        	storeName:'',
		        	banquetName:''
		        },
		        addBanquetRules:{
		        	storeName: [
			            { required: true, message: '请选择门店', trigger: 'change' },
			          ],
			          banquetName: [
			            { required: true, message: '请输入宴会厅名称', trigger: 'blur' },
			          ],
		        },
		        changeBanquets:{
		        	storeName:'',
		        	banquetName:''
		        },
		        isUse:[],
		        storeNames:{},
		        cityTableData: [],
		        isdisableds:[],
                btnMsg:{
                    storeBanquetEdit:false,//修改宴会厅
                    storeBanquetAdd:false,//新增宴会厅
                    storeBanquetDisable:false,//禁用
                    storeBanquetEnable:false,//启用
                }
            }
        },
        methods: {
            initBtnMsg(){
                this.btnMsg.storeBanquetEdit=filterBtnPms(this.btnAllPms.storeBanquetEdit);
                this.btnMsg.storeBanquetAdd=filterBtnPms(this.btnAllPms.storeBanquetAdd);
                this.btnMsg.storeBanquetDisable=filterBtnPms(this.btnAllPms.storeBanquetDisable);
                this.btnMsg.storeBanquetEnable=filterBtnPms(this.btnAllPms.storeBanquetEnable);
            },
        	initBanquetTable(data){  //获取表格内容
                 this.$axios.get('/store/getHallList',{params:data}).then((res)=>{
                 	this.banquetStatus = this.dicData.DATA_STATUS;
					this.pagination.total=res.data.msg.total;
                     this.pagination.pageNum=res.data.msg.pageNum;
                     this.pagination.pageSize=res.data.msg.pageSize;
                     this.banquetTableData=res.data.msg.list;
                     var listLength = res.data.msg.list.length;
                     this.banquetTableData.forEach((e)=>{
	                    this.banquetStatus.forEach((n)=>{
	                        if( n.dicValue==e.status){
	                            e.statusText=n.dicDesc
	                        }
	                    })
	                })
	                for(var i=0;i<res.data.msg.list.length;i++){
	                       		if(this.banquetTableData[i].status == 0){
	                       			this.isdisableds[i] = false
	                       		}
	                       		else{
	                       			this.isdisableds[i] = true;
	                       		}
	                       }
             	 })
              },

               changeStatus(index, row){
               	console.log(this.banquetTableData[index].status)
				if(this.banquetTableData[index].status == 0){
		      			this.$confirm('此操作将禁用该宴会厅, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 hallId:this.banquetTableData[index].id,
			            		 hallStatus:this.banquetTableData[index].status
			            	}
			            	data.hallStatus?data.hallStatus=0: data.hallStatus=1;
			            	 this.$axios.post('/store/updateHallStatus',data).then((res)=>{
								this.initBanquetTable(this.tableData);
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
		      			this.$confirm('此操作将解启用该宴会厅, 是否继续?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	let data={
			            		 hallId:this.banquetTableData[index].id,
			            		 hallStatus:this.banquetTableData[index].status
			            	}
			            	data.hallStatus?data.hallStatus=0: data.hallStatus=1;
			            	 this.$axios.post('/store/updateHallStatus',data).then((res)=>{
								this.initBanquetTable(this.tableData);
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
                   this.initBanquetTable(this.tableData)
		           console.log(`每页 ${val} 条`);
		      },
		      handleCurrentChange(val) {
                  this.pagination.pageNow=val;
                  this.initBanquetTable(this.tableData)
		          console.log(`当前页: ${val}`);
		      },

           	  onSubmit() {   //搜索
	               this.initBanquetTable(this.formInline)
		      },
		      handleEdit(index, row) {  //编译表格
				  this.changeBanquets.storeName = this.banquetTableData[index].storeName;
				  this.changeBanquets.banquetName = this.banquetTableData[index].hallName;
				  this.dialogFormVisible1 = true;
				  changeId = index;
		      },
		      handleDelete(index, row) {  //是否禁用表格
		      		if(this.isUse[index] == '禁用'){
		      			this.$confirm('此操作将禁用该宴会厅, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 hallId:this.banquetTableData[index].id,
			            		 hallStatus:1
			            	}
			            	 this.$axios.post('/store/updateHallStatus',data).then((res)=>{
								this.initBanquetTable(this.tableData);
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
				            		 hallId:this.banquetTableData[index].id,
				            		 hallStatus:0
				            	 }
				            	 this.$axios.post('/store/updateHallStatus',data).then((res)=>{
									this.initBanquetTable(this.tableData);
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
		      addBanquet(){   //添加宴会厅按钮
		      	this.dialogFormVisible = true;
		      	let data={};
		      	this.$axios.get('/store/listStore',{params:data}).then((res)=>{
	                    console.log(res.data.msg);
	                    this.storeNames = res.data.msg;
	             	})
		      },

              formTime(row){
                 return formatTime(row.createTime)
              },
              sureChangeHandle(){

              },

              addBanquetHandle(formName){   //确定添加宴会厅
              	this.$refs[formName].validate((valid) => {
              		let self = this;
			          if (valid) {
			          		let data={
			            		 storeId:self.addBanquets.storeName,
			            		 hallName:self.addBanquets.banquetName
			            	}
			               self.$axios.put('/store/saveHall',data).then((res)=>{
			                    if(res.data.res=='0'){
			                        self.initBanquetTable(self.tableData);
			                        self.cancelAddBanquetHandle()
			                    }else {
			                        self.$message.error(res.data.msg)
			                        return false;
			                    }
			                })
			          } else {
			            self.$message.error('请填写必要信息！')
                     	return false;
			          }
			        });
              },

              cancelAddBanquetHandle(){  //取消添加宴会厅
				  this.$refs['addBanquets'].resetFields();
				  this.dialogFormVisible = false;
              },

              cancelChangeBanquetHandle(){   //取消更改宴会厅
            	  this.dialogFormVisible1 = false
              },

              changeBanquetHandle(){   //确定更改宴会厅
            	  let data={
            		 hallId:this.banquetTableData[changeId].id,
            		 hallName:this.changeBanquets.banquetName
            	 }
            	 this.$axios.post('/store/updateHallName',data).then((res)=>{
					this.initBanquetTable(this.tableData);
	                this.dialogFormVisible1 = false;
	             })
                  this.dialogFormVisible1 = false;
              }
        },
        mounted(){
            this.initBanquetTable(this.tableData);
            this.initBtnMsg()

        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize, 'hallName':this.formInline.hallName, 'status':this.formInline.status}
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

	.grayForm input{
		color:#666
	}
</style>
