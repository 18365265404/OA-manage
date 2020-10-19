<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

          <el-button type="text" @click="dialogFormVisible = true" v-if="btnMsg.roleAdd">
          	<el-button type="primary" icon="plus">新增角色</el-button>
          </el-button>

          <el-dialog title="新增角色" :visible.sync="dialogFormVisible" :before-close="resetAddRole">
			  <el-form :model="addRole" ref="addRole" :rules="rules">
			    <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
			      <el-input v-model="addRole.roleName" placeholder='请输入资源名' auto-complete="off"></el-input>
			    </el-form-item>
				<el-form-item label="角色key" :label-width="formLabelWidth"  prop="roleKey">
				    <el-input v-model="addRole.roleKey" placeholder='请输入角色key'  auto-complete="off"></el-input>
				</el-form-item>
               <!--备用-->
				<!--<el-form-item label="角色类型" :label-width="formLabelWidth">-->
				    <!--<el-select v-model="value" placeholder="所有权">-->
					    <!--<el-option v-for="type in types" :key="type.value" :label="type.label" :value="type.value"></el-option>-->
					<!--</el-select>-->
				<!--</el-form-item>-->
			  </el-form>
			  <div slot="footer" class="dialog-footer">

			    <el-button type="primary" icon='document' @click="addRoleHandle('addRole')">新增</el-button>
			    <el-button @click="resetAddRole">取 消</el-button>
			  </div>
			</el-dialog>


		 <el-table :data="rolesTable" border style="width: 100%">
		   <el-table-column prop="roleName" label="角色名" ></el-table-column>
    		<el-table-column prop="roleKey" label="角色key" ></el-table-column>
    		<el-table-column prop="createTime" label="创建时间" :formatter="formTime"></el-table-column>
             <el-table-column label="操作">
                 <template scope="scope">
                         <el-button size="small" type="info" v-show="btnMsg.roleAuthorization" @click="handleGrant(scope.$index, scope.row)">授权</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
        <el-dialog size="large" title="授权" :visible.sync="dialogFormVisible1" :lock-scroll="false" :before-close="cancelAccredit">

            <el-form >
                <el-form-item label="角色名" :label-width="formLabelWidth">
                    <h2>{{role.name}}</h2>
                </el-form-item>
                <!--复选框混合使用-->
                <el-form-item label="网站权限" :label-width="formLabelWidth" id="role">
                    <el-card class="box-card row_card" v-for='(item,index) in accredit' :key="index">
                        <div slot="header" class="clearfix">
                            <input class="all-checked" type="checkbox" v-bind:value="item.id"    @change="accreditDataAll(index,$event)"/>
                         <span>{{item.resourceName}}</span>
                        </div>
                        <div class="text item" v-for="secItem in item.child" >
                            <el-row class='system_row'>
                                <el-col :span="5">
                                    <div >
                                        <input type="checkbox"  class="sec-checked" v-bind:value="secItem.id"   @change="accreditDataAll(index,$event)">
                                        <span>{{secItem.resourceName}}</span>

                                    </div>
                                </el-col>
                                <el-col :span="13" v-if="secItem.child.length">
                                    <div class="er" v-for="thirdItem in secItem.child">
                                        <input type="checkbox" v-bind:value="thirdItem.id"    @change="accreditDataAll(index,$event)"/>
                                        <span>{{thirdItem.resourceName}}</span>

                                        <div v-if="thirdItem.child.length" >
                                            <div class="er" v-for="fourItem in thirdItem.child">
                                                <input type="checkbox" v-bind:value="fourItem.id"    @change="accreditDataAll(index,$event)"/>
                                                <span>{{fourItem.resourceName}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="sendAccredit">新增</el-button>
                <el-button @click="cancelAccredit">取 消</el-button>
            </div>
        </el-dialog>
		  <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
			<el-col>
			</el-col>
			<el-col >
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
    import $ from "jQuery"
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
         methods: {
		      handleGrant(index, row) {
                  let self=this;
		        this.role.name = this.rolesTable[index].roleName;
                  this.role.id = this.rolesTable[index].id;
                  this.dialogFormVisible1 = true;
                  this.accredit=[];

                  this.$axios.post("/s/findResourceByPlatform").then(
                      (res)=>{
                  this.accredit=res.data.msg;

                          function addCheckValue(ele) {
                              ele.forEach(function (e) {
//                                  e.checkValue=true;
                                  e.checkGroup=[];
                                  if(e.child){
                                      addCheckValue(e.child)
                                  }
                              })
                          }
                          addCheckValue(this.accredit)

                          this.$axios.post('/s/getRoleResByRoleId',{roleId:this.role.id}).then((res2)=>{
                              if(res2.status==200){
                                  this.getRoleRes=res2.data.msg
                                  let data=[]
                                  res2.data.msg.forEach((e)=>{
                                      data.push(e.resId)
                                  })
                              $("#role").find("input").each(function (i,ele) {
                                  $(data).each(function (j,e) {
                                      if(e==ele.value){
                                          $(ele).prop("checked", true)
                                      }

                                  })
                                  })
                              }
                          })

                  }
                  )

              },
             cancelAccredit(){
                 this.accreditData=[];
                 this.dialogFormVisible1 = false;
             },
             sendAccredit(){


                 let data=[]
                 $("#role").find("input:checkbox").each(function (i,e) {
                     if($(this).prop("checked")){
                         data.push($(this).val())
                     }
                 })
                 if(data.length){
                     this.$axios.post("/s/grantPermission",{roleId:this.role.id,res:data}).then((res)=>{
                         if(res.status==200){
                            this.cancelAccredit();
                         }
                     })
                 }else{
                     this.$message.error('请选择权限！');
                 }
             },

		       handleSizeChange(val) {
               this.pagination.pageSize=val;
                 this.initRoleTable()
		      },
		      handleCurrentChange(val) {
                  this.pagination.pageNow=val;
                 this.initRoleTable()
		      },
             addRoleHandle(formName){
                 this.$refs[formName].validate((valid) => {
                     if (valid) {
                         this.$axios.post('/s/addRole',this.addRole).then((res)=>{
                             if(res.status==200){
                                 this.initRoleTable()
                                 this.dialogFormVisible = false
                                 this.$refs['addRole'].resetFields()
                             }
                         })
                     } else {
                         this.$message.error('请填写必要信息！');
                         return false;
                     }
                 });
             },
             resetAddRole() {
                 this.$refs['addRole'].resetFields();
                 this.dialogFormVisible = false;
             },
             initRoleTable(){
                 let data={
                     "pageNow":this.pagination.pageNow,
                     "pageSize":this.pagination.pageSize
                 }
                 this.$axios.post('/s/rolePage',data).then((res)=>{
                 if(res.status==200){
                     this.pagination.total=res.data.msg.total;
                     this.pagination.pageNum=res.data.msg.pageNum;
                     this.pagination.pageSize=res.data.msg.pageSize;
                     this.rolesTable=res.data.msg.list
                 }
             })
             },
             formTime(row){
                 return formatTime(row.createTime)
             },
             accreditDataAll(index,event){
                 let targetEle=$(event.target)
                 if(targetEle.prop('checked')){
                     targetEle.closest('.el-card').find(".el-card__header").find('input').prop("checked", true)
                     if(targetEle.hasClass('all-checked')){
                         targetEle.closest('.el-card').find('input').prop("checked", true)
                     }else {
                         targetEle.closest(".system_row").find('.el-col').eq(0).find('input').prop("checked", true)
                     }
                 }else{
                     if(targetEle.hasClass('all-checked')){
                         targetEle.closest('.el-card').find('input').prop("checked", false)
                     }else if(targetEle.hasClass('sec-checked')){
                         targetEle.closest(".system_row").find('.el-col').eq(1).find('input').prop("checked", false)
                     }
                 }
             },
             getRoleResByRoleId(roleId){
               this.$axios.post('/s/getRoleResByRoleId',{roleId:roleId}).then((res)=>{
                   if(res.status==200){
                       this.getRoleRes=res.data.msg
                   }
               })
             }
	   		 },
        data: function(){
            return {
                pagination:{
                    pageNow:0,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                rolesTable:[],
                addRolePermission:false,
                addRole:{
                  roleName:'',
                    roleKey:'',
                    roleType:1
                },
                rules:{
                    roleName:[
                        {required: true, message: '请输入角色名', trigger: 'blur' },
                        { min: 2,max:50,message: '角色名长度应为2-50之间', trigger: 'blur' }

                    ],
                    roleKey:[
                        { required: true, message: '请输入角色key', trigger: 'blur' },
                        { min: 2,max:50,message: '角色key长度应为2-50之间', trigger: 'blur' }

                    ]
                },
                accredit:[],
                accreditData:[],
		         dialogFormVisible: false,
		         dialogFormVisible1: false,
		        role: {
		          name: '',
                    id:''
		        },
		        formLabelWidth: '80px',
			    value: '',
                getRoleRes:[],
                btnMsg:{
                    roleAdd:false,// 新增角色
                    roleAuthorization:false//角色授权
                }
            };
        },
        mounted(){
            this.initRoleTable();
            this.btnMsg.roleAdd=filterBtnPms(this.btnAllPms.roleAdd);
            this.btnMsg.roleAuthorization=filterBtnPms(this.btnAllPms.roleAuthorization);
        },
        computed:{
            ...mapGetters([
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
		border-bottom:1px solid #eee;
	}
 .text {
    font-size: 14px;
	border-bottom:1px solid #eee;
  }
  .box-card .el-card__header,  .box-card .el-card__body{
  	padding:0 20px
  }
  .box-card .el-card__header{
  	border-bottom:none;
  	background-color: rgba(0,0,0,0.1);
  }
  .box-card .el-card__body{
  	padding:10px 20px;
  }
    .box-card.el-card{
        margin-bottom: 20px;
    }
    .box-card input{
        margin-right: 5px;
    }
  .message_bottom{
	  	height:44px;
	  	line-height: 44px;
	  	font-size: 12px;
    	color: #999;
		text-align: center;
	}
	.el-checkbox+.el-checkbox {
		margin-left: 5px;
	}
	.er{
		display: inline-block;
	}
	.er:nth-child(n+2){
		margin-left:10px;
	}

</style>
