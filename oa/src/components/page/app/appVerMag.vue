<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>婚礼人App管理</el-breadcrumb-item>
                <el-breadcrumb-item>App版本管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="searchDatas" class="demo-form-inline grayForm" ref="searchDatas">
		   <el-form-item label="平台类型:" prop='appPlatform' :label-width="formLabelWidth1">
					 <el-select v-model="searchDatas.appPlatform" clearable placeholder="请选择平台类型">
						<el-option v-for="type in pingtaiTypes"
	                                   :key="type.dicDesc"
	                                   :label="type.dicDesc"
	                                   :value="type.dicValue"></el-option>
	                </el-select>
				</el-form-item>
				<el-form-item label="提示类型:" prop='verType' :label-width="formLabelWidth1">
				    <el-select v-model="searchDatas.verType" clearable placeholder="请选择提示类型">
	                   <el-option v-for="type in versiceTypes"
                                   :key="type.dicDesc"
                                   :label="type.dicDesc"
                                   :value="type.dicValue"></el-option>
	                </el-select>
				</el-form-item>
				<el-form-item label="状态类型:" prop='verStatus' :label-width="formLabelWidth1">
				    <el-select v-model="searchDatas.verStatus" clearable placeholder="请选择状态类型">
	                    <el-option v-for="type in releaseTypes"
	                                   :key="type.dicDesc"
	                                   :label="type.dicDesc"
	                                   :value="type.dicValue"></el-option>
	                </el-select>
				</el-form-item>
				<el-form-item label="app类型:" prop='appType' :label-width="formLabelWidth1">
				    <el-select v-model="searchDatas.appType" clearable placeholder="请选择app类型">
	                    <el-option v-for="type in appTypes"
	                                   :key="type.dicDesc"
	                                   :label="type.dicDesc"
	                                   :value="type.dicValue"></el-option>
	                </el-select>
				</el-form-item>
            <el-form-item prop='verNo'>
                <el-input v-model="searchDatas.verNo" auto-complete="off" placeholder='输入版本号'></el-input>
            </el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="resetForm('searchDatas')">重置</el-button>
		  </el-form-item>
		</el-form>


		 <el-button v-if="btnMsg.appVersionAdd" type="text" @click="dialogFormVisible = true">
          	<el-button type="primary" icon="plus">添加新版本</el-button>
          </el-button>

          <el-dialog  title="添加新版本" :visible.sync="dialogFormVisible" :before-close="cancelHandle">
			  <el-form :model='ruleForm' :rules="rules" ref="ruleForm">
			  	<el-form-item label="版本号:" prop='verNo' :label-width="formLabelWidth">
				   <el-input v-model="ruleForm.verNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="版本代码:" prop='verCode' :label-width="formLabelWidth">
				    <el-input v-model="ruleForm.verCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="平台类型:" prop='appPlatform' :label-width="formLabelWidth">
					 <el-select v-model="ruleForm.appPlatform" placeholder="请选择平台类型">
						<el-option v-for="type in pingtaiTypes"
	                                   :key="type.dicDesc"
	                                   :label="type.dicDesc"
	                                   :value="type.dicValue"></el-option>
	                </el-select>
				</el-form-item>
				<el-form-item label="提示类型:" prop='verType' :label-width="formLabelWidth">
				    <el-select v-model="ruleForm.verType" placeholder="请选择提示类型">
	                   <el-option v-for="type in versiceTypes"
                                   :key="type.dicDesc"
                                   :label="type.dicDesc"
                                   :value="type.dicValue"></el-option>
	                </el-select>
				</el-form-item>
				<el-form-item label="app类型:" prop='appType' :label-width="formLabelWidth">
				    <el-select v-model="ruleForm.appType" placeholder="请选择app类型">
	                    <el-option v-for="type in appTypes"
	                                   :key="type.dicDesc"
	                                   :label="type.dicDesc"
	                                   :value="type.dicValue"></el-option>
	                </el-select>
				</el-form-item>
				<el-form-item label="下载地址:" prop='downloadAddress' :label-width="formLabelWidth">
				    <el-input v-model="ruleForm.downloadAddress" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="更改内容:" prop='content' :label-width="formLabelWidth">
				    <el-input type="textarea" :maxlength="4000" :rows="2" v-model="ruleForm.content"></el-input>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
				<el-button type="primary" icon='document' @click="publishHandle('ruleForm')">创建并发布</el-button>
			    <el-button type="primary" icon='document' @click="addVersiceHandle('ruleForm')">创建</el-button>
			    <el-button @click="cancelHandle">取 消</el-button>
			  </div>
			</el-dialog>
		  <el-table :data="appTableData" border style="width: 100%">
			<el-table-column prop="verNo" label="版本号"></el-table-column>
		    <el-table-column prop="verCode" label="版本代码"></el-table-column>
		    <el-table-column prop="appPlatform" label="平台类型"></el-table-column>
		    <el-table-column prop="appType" label="app类型"></el-table-column>
		    <el-table-column prop="downloadAddress" label="下载地址">
		    	<template scope="scope">
                    <a :href='scope.row.downloadAddress' target=_blank>{{scope.row.downloadAddress}}</a>
                </template>
		    </el-table-column>
		    <el-table-column prop="content" label="更新内容"></el-table-column>
		    <el-table-column prop="createTime" label="创建时间" :formatter="formTime"></el-table-column>
		    <el-table-column prop="releaseTime" label="发布时间" :formatter="formTime1"></el-table-column>
		    <el-table-column prop="verType" label="提示类型"></el-table-column>
		    <el-table-column prop="verStatus" label="状态"></el-table-column>
		    <el-table-column prop="operation" label="操作">
		    	<template scope="scope">
		    		<el-button
			          size="small"
			          @click.native.prevent="deleteRow(scope.$index)"
                      v-show="btnMsg.appVersionDel"
                    >
			          	删除
			          </el-button>
                    <el-button
                        size="small"
                        @click.native.prevent="createRow(scope.row)"
                        v-show="scope.row.verStatus=='创建'"
                    >
                        发布

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
    </div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data() {
            return {
            	radio:'',
            	formLabelWidth1:'80px',
            	formLabelWidth:'120px',
            	changeCityVisible:false,
            	dialogFormVisible:false,
            	 pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                searchDatas:{
                	'appPlatform':'',
	                'verStatus':'',
	                'appType':'',
	                'verType':'',
                	'verNo':''
                },
                pingtaiTypes:{},
                versiceTypes:{},
                releaseTypes:{},
                appTypes:{},
		        appTableData: [],
                ruleForm:{
                	'verNo':'',
	                'verCode':'',
	                'appPlatform':'',
	                'verStatus':'',
	                'appType':'',
	                'verType':'',
	                'downloadAddress':'',
	                'content':'',
	                'operationStatus':''
                },
                rules: {
		          verNo: [
		            { required: true, message: '请输入版本号', trigger: 'blur' },
		          ],
		          verCode: [
		            { required: true, message: '请输入版本代码', trigger: 'blur' },
		          ],
		          appPlatform: [
		            { type:'number', required: true, message: '请选择app平台类型', trigger: 'change' },
		          ],
		          verStatus: [
		            { type:'number', required: true, message: '请选择版本状态', trigger: 'change' },
		          ],
		          appType: [
		             { type:'number', required: true, message: '请选择app类型', trigger: 'change' },
		          ],
		          verType: [
		            { type:'number', required: true, message: '请选择类型', trigger: 'change' },
		          ],
		          downloadAddress: [
		            { required: true, message: '请输入下载地址', trigger: 'blur' },
		          ],
		          content: [
		            { required: true, message: '请更改内容', trigger: 'blur' },
		          ]
		        },
                btnMsg:{
                    appVersionAdd:false,//添加新版本
                    appVersionDel:false//删除版本
                }
            }
        },
        methods: {
            initBtnMsg(){
                this.btnMsg.appVersionAdd=filterBtnPms(this.btnAllPms.appVersionAdd);
                this.btnMsg.appVersionDel=filterBtnPms(this.btnAllPms.appVersionDel);
            },
        	//页码变化
		    handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initAppTable(this.tableData)
		    },
		    handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initAppTable(this.tableData)
		    },
		   //搜索
            onSubmit() {
            	if(this.searchDatas.verNo == ''){
            		this.searchDatas.verNo = null
            	}
                let keywords= this.searchDatas;
                this.initAppTable(keywords);
		    },
	        initAppTable(data){  //获取表格内容
                 this.$axios.get('/b/getVersionList',{params:data}).then((res)=>{
                 	this.pingtaiTypes=this.dicData.APP_PLATFORM;
					 this.versiceTypes=this.dicData.VERSION_TYPE;
					 this.releaseTypes=this.dicData.VERSION_STATUS;
					 this.appTypes = this.dicData.APP_TYPE;
					 this.pagination.total=res.data.msg.total;
                     this.pagination.pageNum=res.data.msg.pageNum;
                     this.pagination.pageSize=res.data.msg.pageSize;
                     this.appTableData=res.data.msg.list;
                     var listLength = res.data.msg.list.length;
                     for(var i=0;i<listLength;i++){
                     	res.data.msg.list[i].appPlatform =this.pingtaiTypes[res.data.msg.list[i].appPlatform].dicDesc;
                     	res.data.msg.list[i].verType =this.versiceTypes[res.data.msg.list[i].verType].dicDesc;
						res.data.msg.list[i].verStatus =this.releaseTypes[res.data.msg.list[i].verStatus].dicDesc;
                     	res.data.msg.list[i].appType =this.appTypes[res.data.msg.list[i].appType].dicDesc;
                     }
             	})
            },
             formTime(row){
                 return formatTime(row.createTime)
             },
              formTime1(row){
                 return formatTime(row.releaseTime)
             },
            //添加并发布新版本
            publishHandle(formName){
		            this.ruleForm.operationStatus = 2;
		            this.addHandle(formName)
            },
            //添加新版本
            addVersiceHandle(formName){
            	 this.ruleForm.operationStatus = 1;
            	 this.addHandle(formName)
            },
            //添加新版本和发布新版本公用方法
            addHandle(formName){
            	this.$refs[formName].validate((valid) => {
		          if (valid) {
	            	this.$axios.put('/b/saveVersion',this.ruleForm).then((res)=>{
	                    if(res.status==200){
	                        this.initAppTable(this.tableData);
	                        this.cancelHandle()
	                    }else {
	                        alert(res.data.msg)
	                    }
	                })
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
            },
            //取消添加
            cancelHandle(){
            	this.$refs['ruleForm'].resetFields();
 				this.dialogFormVisible = false
            },
            createRow(row){
                this.$confirm('此操作将发布该版本, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/b/publishVersion',{versionId:row.id}).then((res)=>{
                        if(res.status==200){
                            this.initAppTable(this.tableData);
                        }else {
                            alert(res.data.msg)
                        }
                    })
                    this.$message({
                        type: 'success',
                        message: '发布成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发布'
                    });
                });
















            },
            //删除操作
            deleteRow(index){
            	 this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	let data = {
            		'versionId':this.appTableData[index].id
            	   }
            	this.$axios.delete('/b/removeVersion',{params:data}).then((res)=>{
	                    if(res.status==200){
	                        this.initAppTable(this.tableData);
	                    }else {
	                        alert(res.data.msg)
	                    }
	                })
		          this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
            },
            resetForm(formName) {  //重置
		        this.$refs[formName].resetFields();
		    }

       },
        mounted(){
            this.initAppTable(this.tableData);
            this.initBtnMsg()
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize ,'appPlatform':this.searchDatas.appPlatform, 'verStatus':this.searchDatas.verStatus, 'appType':this.searchDatas.appType, 'verType':this.searchDatas.verType}
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
