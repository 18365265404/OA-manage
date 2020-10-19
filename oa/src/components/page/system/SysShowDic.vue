<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>数字字典管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
			  <el-form-item label="关键字：">
			    <el-input class='lengthInput' v-model="formInline.name" placeholder="请输入字典名" @keyup.enter.native="onSubmit"></el-input>
			  </el-form-item>
			  <el-form-item>
				<el-button type="primary" @click="onSubmit" icon="search"></el-button>
			  </el-form-item>
		</el-form>
			
        <div>
            <el-button type="text" @click="frashDic"><el-button type="primary" icon="warning">刷新公共缓存</el-button></el-button>
            <div>
                <el-table
                    :data="dicData"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="序号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="dicName"
                        label="字典名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="dicValue"
                        label="字典值">
                    </el-table-column>
                    <el-table-column
                        prop="dicDesc"
                        label="字典描述">
                    </el-table-column>
                    <el-table-column
                        prop="dicSort"
                        label="字典排序">
                    </el-table-column>
                </el-table>
                <div class="paginationWrap">
                    <el-row type="flex" justify="space-between">
                        <el-col >
                            <div class="grid-content bg-purple"><span class="tabLeAddCount"></span></div>
                        </el-col>
                        <el-col >
                            <div class="grid-content bg-purple-light"  style="text-align: right">
                                <el-pagination class='page_pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[10, 25,50 ,100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next" :total="pagination.total">>
    				</el-pagination>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>




        </div>
        <div>
        </div>
    </div>
</template>

<script>
    export default{
        data() {
            return {
                value: '',
                dialogFormVisible: false,
                formLabelWidth: '120px',
                formInline: {
		          user: '',
		          region: ''
		        },
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                dicData: []
            }
        },
        methods:{
        	initDicTable(data){  //获取表格内容
                 this.$axios.get('/b/getDictionaryList',{params:data}).then((res)=>{
					this.pagination.total=res.data.msg.total;
                     this.pagination.pageNum=res.data.msg.pageNum;
                     this.pagination.pageSize=res.data.msg.pageSize;
                     this.dicData=res.data.msg.list;
             	})
            },
              handleSizeChange(val) {
                   this.pagination.pageSize=val;
                   this.initDicTable(this.tableData)
		      },
		      handleCurrentChange(val) {
                  this.pagination.pageNow=val;
                  this.initDicTable(this.tableData)
		      },
		      frashDic(){
		      	  this.initDicTable(this.tableData);
		      },
		      onSubmit() {
	               let keywords={
	                   keywords:this.formInline.name
	               }
	               this.initDicTable(keywords)
		      },
        },
        mounted(){
            this.initDicTable(this.tableData);
        },
        computed: {
        	tableData(){
               return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize,keywords:this.formInline.name}
            },
        }
    }
</script>
<style>
	.demo-form-inline{
		text-align: center;
	}
</style>
