<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 城市管理</el-breadcrumb-item>
                <el-breadcrumb-item>城市管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline">
		  <el-form-item label="关键字：">
		    <el-input class='lengthInput' v-model="formInline.user" placeholder="请输入城市名、拼音" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		</el-form>


		 <el-button v-if="btnMsg.storeCityOpen" type="text" @click="openNewCity">
          	<el-button type="primary" icon="plus">开通新城市</el-button>
          </el-button>

          <el-dialog  title="开通新城市" :visible.sync="dialogFormVisible" :before-close="cancelAddCityHandle">
			  <el-form :model="addCity" ref="addCity" :rules="rules">
			  	<el-form-item label="省份" :label-width="formLabelWidth" prop="province">
				   <el-select v-model="addCity.province" placeholder="请选择" @change="changeProvince">
				    <el-option
				      v-for="p in provinces"
				      :key="p.id"
				      :label="p.provinceName"
				      :value="p.provinceCode" >
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="城市" :label-width="formLabelWidth" prop="city">
				   <el-select v-model="addCity.city" placeholder="请选择">
				    <el-option
				      v-for="c in cities"
				      :key="c.id"
				      :label="c.cityName"
				      :value="c.id"
                    >
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="是否热门" :label-width="formLabelWidth" prop="radio">
                    <el-radio-group v-model="addCity.radio">
				    <el-radio class="radio"  label="1">是</el-radio>
  					<el-radio class="radio"  label="0">否</el-radio>
                        </el-radio-group>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">

			    <el-button type="primary" icon='document' @click="addCityHandle('addCity')">确定</el-button>
			    <el-button @click="cancelAddCityHandle">取 消</el-button>
			  </div>
			</el-dialog>


		  <el-table :data="cityTableData" border style="width: 100%">
			<el-table-column prop="provinceName" label="省份名"></el-table-column>
		    <el-table-column prop="cityName" label="城市名"></el-table-column>
		    <el-table-column prop="cityPinyin" label="拼音"></el-table-column>
		    <el-table-column prop="cityShorthand" label="简写"></el-table-column>
		    <el-table-column prop="isHot" label="是否热门"></el-table-column>
		    <el-table-column prop="operation" label="操作">
		    	<template scope="scope">

			        <el-button
                        v-show="btnMsg.storeCityEdit"
			        	type='primary'
			          size="small"
			          @click="handleEdit(scope.$index, scope.row)">
			          	修改</i>
			         </el-button>
			         <el-button
			        	type='primary'
                        v-show="btnMsg.storeCityDel"
			          size="small"
			          @click="handledelet(scope.$index, scope.row)">
			          	删除</i>
			         </el-button>
			      </template>
		    </el-table-column>
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


		   <el-dialog title="城市修改" :visible.sync="changeCityVisible">
			  <el-form :model="changeCity">
			    <el-form-item label="城市名" :label-width="formLabelWidth">
			      <el-input v-model="changeCity.cityName" auto-complete="off"></el-input>
			    </el-form-item>
				<el-form-item label="是否热门" :label-width="formLabelWidth">
				    <el-radio class="radio" v-model="radio" label="1">是</el-radio>
  					<el-radio class="radio" v-model="radio" label="0">否</el-radio>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="sureChangeHandle">确定</el-button>
			    <el-button @click="changeCityVisible = false">取 消</el-button>
			  </div>
			</el-dialog>

    </div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {filterBtnPms} from '../../utils/common'
	var cityId;
    export default {
        data() {
            return {
                btnMsg:{
                    storeCityOpen:false,
                    storeCityDel:false,
                    storeCityEdit:false
                },
            	radio:'',
            	formLabelWidth:'80px',
            	changeCityVisible:false,
            	dialogFormVisible:false,
            	changeCity:{
            		cityName:''
            	},
            	provinces:[],
            	cities:[],
                addCity:{
                    province:'',
                    city:'',
                    radio:''
                },
                isClearAddDisgle:false,
                rules:{
                    province:[
                        { required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    city:[
                        {required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    radio:[
                        {required: true, message: '请选择一个', trigger: 'change' }
                    ]
                },
            	 pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
               formInline: {
		          user: '',
		          region: ''
		        },
		         pickerOptions0: {
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },
		        pickerOptions1: {
		         disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },
		        value1: '',
		        value2: '',
		        cityTableData: [],
            }
        },
        methods: {
        	 handleGrant(index, row) {
		      	this.dialogFormVisible1 = true;
		        this.role.name = this.tableData[index].name;
		      },
		       handleSizeChange(val) {
                   this.pagination.pageSize=val;
                   this.initCityTable(this.tableData)

		      },
		      handleCurrentChange(val) {
                  this.pagination.pageNow=val;
                  this.initCityTable(this.tableData)
		      },
           onSubmit() {
               let keywords={
                   keywords:this.formInline.user
               }
               this.initCityTable(keywords)
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
	      handleEdit(index, row) {  //编译表格
	        cityId = row.cityId;
	        this.changeCity.cityName = this.cityTableData[index].cityName;
	        this.changeCityVisible=true;
	        if(this.cityTableData[index].isHot == '是'){
	        	this.radio = '1'
	        }
	        else{
	        	this.radio = '0'
	        }
	      },
	      handledelet(index, row){  //删除城市
	      	let data = {
	      		cityId:row.cityId,
	      		openStatus:0
	      	}
	      	this.$confirm('此操作将删除该城市, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/b/updateCityOpen ',data).then((res)=>{
                    if(res.data.res==0){
                    	this.initCityTable(this.tableData);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else {
                        alert(res.data.msg)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
	      },
	      openNewCity(){ //开通新城市，获取省份城市
	      	this.dialogFormVisible = true;
	      	this.isClearAddDisgle = false
	      	let data = {};
	      	this.$axios.get('/b/initNewOpenCity',data).then((res)=>{
	      		console.log(res.data.msg.cityList)
              this.provinces=res.data.msg.provinceList;
             	})
	      },
            changeProvince(){ //切换省份
            	if(!this.isClearAddDisgle){
            		this.$axios.get('/b/listCityByProvinceCode',{params: {
	                    provinceCode: this.addCity.province
	                }}).then((res)=>{
	                	this.cities=res.data.msg
	                    this.addCity.city='';
	                    this.cities.forEach((e)=>{
	                   if( e.cityCode==this.addCity.city){
	                       data.id=e.id;
	                       data.cityShorthand=e.cityShorthand;
	                       data.cityPinyin=e.cityPinyin;
	                       data.cityName=e.cityName
	                   }
	                })
	                })
            	}
            },

	      initCityTable(data){  //获取表格内容

                 this.$axios.post('/b/getOpenCityList',data).then((res)=>{
                 	if(res.status == 200){
                 		this.pagination.total=res.data.msg.total;
	                     this.pagination.pageNum=res.data.msg.pageNum;
	                     this.pagination.pageSize=res.data.msg.pageSize;
	                     this.cityTableData=res.data.msg.list;
	                     console.log(res.data.msg.list)
	                     for(var i=0;i<res.data.msg.list.length;i++){
	                 		if(res.data.msg.list[i].isHot == 1){
	                 			this.cityTableData[i].isHot = '是'
	                 		}
	                 		else{
	                 			this.cityTableData[i].isHot = '否'
	                 		}

	                 	}
                 	}

             	})
            },
            sureChangeHandle(){
				var isOpen
                console.log(this.radio)
            	if(this.radio == 1){
            		isOpen = 1
            	}
            	else{
            		isOpen = 0;
            	}
            	let changeCityData = {
            		"cityId":cityId,
            		"openStatus":isOpen
            	}
            	 this.$axios.post('/b/updateCityHot',changeCityData).then((res)=>{
            	 	this.changeCityVisible = false;
                     if(res.status==200){
                         this.initCityTable(this.tableData)
                 	}
             	})
            },
            addCityHandle(formName){
                let data={
                    id:this.addCity.city,
                    provinceCode:this.addCity.province,
                    cityShorthand:'',
                    cityPinyin:'',
                    isHot:parseInt(this.addCity.radio),
                    isOpen:1,
                    cityName:''
                 }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/b/updateCity',data).then((res)=>{
                            if(res.status==200){
                                this.initCityTable(this.tableData);
                                this.cancelAddCityHandle()
                            }else {
                                alert(res.data.msg)
                            }
                        });
                    } else {
                        this.$message.error('请填写必要信息！')
                        return false;
                    }
                });


            },
            cancelAddCityHandle(){
            	this.isClearAddDisgle = true
                this.dialogFormVisible = false;
                this.cities='';
                this.$refs['addCity'].resetFields();
            }
       },
        mounted(){
            this.initCityTable(this.tableData);
            //增加城市按钮权限
            this.btnMsg.storeCityOpen=filterBtnPms(this.btnAllPms.storeCityOpen);
            this.btnMsg.storeCityDel = filterBtnPms(this.btnAllPms.storeCityDel)
            this.btnMsg.storeCityEdit = filterBtnPms(this.btnAllPms.storeCityEdit)
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize}
            },
            ...mapGetters([
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
</style>
