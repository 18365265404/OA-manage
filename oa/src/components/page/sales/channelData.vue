<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 城市管理</el-breadcrumb-item>
                <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="formInline" class="demo-form-inline">
        	<p>{{formInline}}</p>
		  <el-form-item label="日期：">
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.datas"
			      type="daterange"
			      align="right"
			      placeholder="选择日期范围"
			      :picker-options="pickerOptions2">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		</el-form>

		  <el-table :data="cityTableData" border style="width: 100%">
			<el-table-column prop="provinceName" label="省份名"></el-table-column>
		    <el-table-column prop="cityName" label="城市名"></el-table-column>
		    <el-table-column prop="cityPinyin" label="拼音"></el-table-column>
		    <el-table-column prop="cityShorthand" label="简写"></el-table-column>
		    <el-table-column prop="isHot" label="是否热门"></el-table-column>
		    <el-table-column prop="operation" label="操作">
		    	<template scope="scope">

			        <el-button
			          size="small"
			          @click="handleEdit(scope.$index, scope.row)">
			          	<i class="el-icon-edit"></i>
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
            	radio:'',
            	formLabelWidth:'80px',
            	changeCityVisible:false,
            	dialogFormVisible:false,
            	changeCity:{
            		cityName:''
            	},
            	provinces:[],
            	cities:[],
            	 pagination:{
                    pageNow:0,
                    total:0,
                    pageNum:1,
                    pageSize:10
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
		        formInline:{
		        	datas:''
		        },
                 pickerOptions2: {
		          shortcuts: [{
		            text: '最近一周',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近一个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
		              picker.$emit('pick', [start, end]);
		            }
		          }, {
		            text: '最近三个月',
		            onClick(picker) {
		              const end = new Date();
		              const start = new Date();
		              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
		              picker.$emit('pick', [start, end]);
		            }
		          }]
		        },
            }
        },
        methods: {
        	 handleGrant(index, row) {
		      	this.dialogFormVisible1 = true;
		        console.log(this.tableData[index].date);
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

	      handleEdit(index, row) {  //编译表格
//	        console.log(index, row);
	        cityId = index;
	        this.changeCity.cityName = this.cityTableData[index].cityName;
	        this.changeCityVisible=true;
	        if(this.cityTableData[index].isHot == '是'){
	        	this.radio = '1'
	        }
	        else{
	        	this.radio = '0'
	        }
	      },


	      initCityTable(data){  //获取表格内容

                 this.$axios.get('/b/getOpenCityList',{params:data}).then((res)=>{
					this.pagination.total=res.data.msg.total;
                     this.pagination.pageNum=res.data.msg.pageNum;
                     this.pagination.pageSize=res.data.msg.pageSize;
                     this.cityTableData=res.data.msg.list;
                     console.log(res.data.msg.list)
                     for(var i=0;i<res.data.msg.list.length;i++){
                 		if(res.data.msg.list[i].isHot == 1){
                 			this.cityTableData[i].isHot = '是'
//               			console.log(this.cityTableData[i].cityName)
                 		}
                 		else{
                 			this.cityTableData[i].isHot = '否'
                 		}

                 	}
             	})
            },
            sureChangeHandle(){
				var isOpen
            	if(this.radio == 1){
            		isOpen = 1
            	}
            	else{
            		isOpen = 0;
            	}
            	let changeCityData = {
            		"cityId":cityId+1,
            		"openStatus":isOpen
            	}
            	 this.$axios.post('/b/updateCityHot',changeCityData).then((res)=>{
            	 	this.changeCityVisible = false;
                     if(res.status==200){
                         this.initCityTable(this.tableData)
                 	}
             	})
            },

       },
        mounted(){
            this.initCityTable(this.tableData);
            //增加城市按钮权限
            this.addCityPermission=filterBtnPms(this.btnAllPms.addCityPms);
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
