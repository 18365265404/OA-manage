<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>部门管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

          <el-button type="text" @click="dialogFormVisible = true"  v-if="btnMsg.deptAdd">
          	<el-button type="primary" icon="plus">新增部门</el-button>
          </el-button>

          <!--新增部门弹框-->
          <el-dialog title="新增部门" :visible.sync="dialogFormVisible" :before-close="cancelDeptHandle" :close-on-click-modal="false">
			  <el-form :model="role" :rules="rules" ref="role">
			    <el-form-item label="部门名" :label-width="formLabelWidth" prop="name">
			      <el-input v-model="role.name" placeholder='请输入角色名称' auto-complete="off"></el-input>
			    </el-form-item>
				<el-form-item label="组织类型" :label-width="formLabelWidth" prop="value">
				    <el-select v-model="role.value" placeholder="公司">
					    <el-option v-for="type in types"
                                   :key="type.dicDesc"
                                   :label="type.dicDesc"
                                   :value="type.dicValue"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上级部门" :label-width="formLabelWidth" prop="selectedOptions">
				    <el-cascader :options="deptTree"
                                 v-model="role.selectedOptions"
                                 :props="props"
                                 :change-on-select="true"
                    ></el-cascader>
				</el-form-item>

				<el-form-item label="部门key" :label-width="formLabelWidth" prop="departmentKey">
			      <el-input v-model="role.departmentKey" placeholder='请输入部门key' auto-complete="off"></el-input>
			    </el-form-item>
                  <el-form-item label="权限标识" :label-width="formLabelWidth" prop="departmentPermission">
                      <el-input v-model="role.departmentPermission" placeholder='请输入部门权限标识' auto-complete="off"></el-input>
                  </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="addDeptHandle('role')">新增</el-button>
			    <el-button @click="cancelDeptHandle">取 消</el-button>
			  </div>
			</el-dialog>


		 <el-table :data="deptTable" border style="width: 100%">
		   <el-table-column prop="deptName" label="部门名" ></el-table-column>
    		<el-table-column prop="parentDeptName" label="上级部门" ></el-table-column>
    		<el-table-column prop="type" label="组织类型">
                <template scope="scope">
                    {{typesData(scope.row.type)}}
                </template>

            </el-table-column>
    		<el-table-column prop="deptKey" label="部门key"></el-table-column>

		    <el-table-column label="授权">
		      <template scope="scope">
		      	<el-button type="text" @click="dialogFormVisible1 = true">
		          	 <el-button v-show="btnMsg.deptAuthorization" size="small" type="info" @click="handleGrant(scope.$index, scope.row)">授权</el-button>
		       </el-button>



		      </template>
		    </el-table-column>
		  </el-table>

		  <!--分页-->
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

			<!--授权内部的小弹框-->
			<el-dialog title="选择" :visible.sync="dialogFormVisibleOk1" class='smallBox' size='tiny'>
				  <el-form>
				    <el-form-item label="部门角色级别" label-width="150px">
				       <el-select v-model="commentValue" placeHolder="系统管理员" >
					    <el-option v-for="comment in comments" :key="comment.dicDesc" :label="comment.dicDesc" :value="comment.dicValue">
					    </el-option>
					  </el-select>
				    </el-form-item>
				  </el-form>
				  <div slot="footer" class="dialog-footer">
				    <el-button type="primary" @click="changeLevel">确定</el-button>
				    <el-button @click="cancelChangeLevel">取 消</el-button>
				  </div>
				</el-dialog>

        <!--授权弹框-->
        <el-dialog title="部门授权" :visible.sync="dialogFormVisible1" size='large' >
            <el-form>
                <el-form-item label="部门名" :label-width="formLabelWidth">
                    <h3>{{accreditName}}</h3>
                </el-form-item>
                <el-form-item label="部门角色" :label-width="formLabelWidth">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">选择部门角色</span>
                        </div>
                        <div class="text item">
                            <el-row>
                                <el-col :span="5"  v-for="(item,index) in accreditRadio" :key="item.roleName">
                                    <div class="grid-content bg-purple">
                                        <el-checkbox  @change="handleCheckChange(item,index,$event)"  v-model="item.checked">{{item.roleName}}</el-checkbox>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="sendRolesAccredit">授权</el-button>
                <el-button @click="dialogFormVisible1 = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6" >
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data: function(){
            return {
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                deptTable:[],
                deptTree:[
                    {
                        "id":"0",
                        "deptName":"根节点",
                        "child":[],
                        "parentDeptIds": null
                    }
                ],
                props:{
                    label: 'deptName',
                    children: 'child',
                    value:'newId'
                },
            	 currentPage4: 4,
		         dialogFormVisible: false,
		         dialogFormVisible1: false,
		         dialogFormVisibleOk1: false,
		        role: {
		          name: '',
		          type: [],
                    departmentKey:'',
                    value:'',
                    selectedOptions:[],
                    departmentPermission:''
		        },
                rules:{
                    name:[
                        {required: true, message: '请输入部门名', trigger: 'blur' }
                    ],
                    selectedOptions:[
                        { type: 'array', required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    departmentKey:[
                        {required: true, message: '请输入key', trigger: 'blur' }
                    ],
                    value :[
                        {type: 'number',required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    departmentPermission:[
                        {required: true, message: '请输入权限标识', trigger: 'blur' }
                    ]
                },
                accreditName:'',
                accreditRadio:[],
		        formLabelWidth: '80px',
			     comments: [],
			     commentValue: '请选择',
		        selectedOptions2: [],
                roleIndex:'',
                deptId:'',
                types:[],
                btnMsg:{
                    deptAdd:false,//新增部门
                    deptAuthorization:false//部门授权
                }
            };
        },

         methods: {
		      handleGrant(index, row) {
                  this.accreditRadio=[];
                  this.deptId=this.deptTable[index].id;
		        this.accreditName = this.deptTable[index].deptName;
                  this.$axios.post('/s/getRoleByParentDeptId',{parentDeptId:this.deptTable[index].parentDeptIds}).then((res)=>{
                      this.$axios.post('/s/getRoleByDeptId',{deptId:this.deptTable[index].id}).then((childRes)=>{
                          childRes.data.msg.forEach((n)=>{
                              res.data.msg.forEach((p)=>{
                                  if(n.id==p.id){
                                      p.checked=true
                                          p.level=n.level
                                  }
                              })

                          })
                          this.accreditRadio=res.data.msg
                      })
                  })

		      },
		       handleSizeChange(val) {
                   this.pagination.pageSize=val;
                   this.initDeptTable();
		      },
		      handleCurrentChange(val) {
                  this.pagination.pageNow=val;
                  this.initDeptTable();
		      },
		      handleCheckChange(item,index,event){
                  this.roleIndex=index;
                  if(event.target.checked){
                      this.dialogFormVisibleOk1=true;
                  }else {

                  }

		      },
             initDeptTable(){
                 let data={
                     "pageNow":this.pagination.pageNow,
                     "pageSize":this.pagination.pageSize
                 }
                 this.$axios.post('/s/page',data).then((res)=>{
                     if(res.status==200){
                         this.pagination.total=res.data.msg.total;
                         this.pagination.pageNum=res.data.msg.pageNum;
                         this.pagination.pageSize=res.data.msg.pageSize;
                         this.deptTable=res.data.msg.list

                     }
                 })
             },
             initAddDept(){
                 this.$axios.post("/s/deptTree",{parentIds:0}).then((res)=>{
                     if(res.status==200){
                         this.types=this.dicData.DEPT_TYPE
                         this.deptTree[0].child=res.data.msg;
                         this.addNewDeptId(this.deptTree)
                     }
                 })
             },
             addNewDeptId(n){
                 n.forEach((e)=>{
                     if(e.parentDeptIds){
                         e.newId=e.parentDeptIds+"_"+e.id
                     }else {
                         e.newId=e.id;
                     }
                     if(e.child){
                         this.addNewDeptId(e.child)
                     }

                 })
             },
             addDeptHandle(formName){
                 let data={
                     deptName:this.role.name,
                     parentDeptIds:this.role.selectedOptions[this.role.selectedOptions.length-1],
                     type:this.role.value,
                     deptKey:this.role.departmentKey,
                     deptPermission:this.role.departmentPermission
                 }
                 this.$refs[formName].validate((valid) => {
                     if (valid) {
                         this.$axios.post("/s/addDept",data).then((res)=>{
                             if(res.status==200){
                                 this.dialogFormVisible = false;
                                 this.initDeptTable()
                                 this.cancelDeptHandle()
                             }
                         });
                     } else {
                         this.$message.error('请填写必要信息！')
                         return false;
                     }
                 });
             },
             cancelDeptHandle(){
                 this.$refs['role'].resetFields();
                 this.dialogFormVisible = false;

             },
             initRoleLevel(){
                 this.comments=this.dicData.LEVEL
                 console.log(this.dicData)
             },
             sendRolesAccredit(){
                 let data={
                     deptId: this.deptId,
                     roleIdLevel:[]
                 };
                 this.accreditRadio.forEach((e)=>{
                    if(e.checked){
                       data.roleIdLevel.push(e.id+'_'+e.level)
                    }
                 })
                 this.$axios.post("/s/grantRole",data).then((res)=>{
                     this.dialogFormVisible1 = false
                 });
             },
             changeLevel(){
                if(typeof (this.commentValue)=='number'){
                    this.accreditRadio[this.roleIndex].level=this.commentValue;
                    this.accreditRadio[this.roleIndex].checked=true;
                    this.dialogFormVisibleOk1=false;
                    this.commentValue='请选择'
                }
             },
             cancelChangeLevel(){
                 this.commentValue='请选择'
                 this.dialogFormVisibleOk1=false;
                 this.accreditRadio[this.roleIndex].checked=false;
                 this.$set(this.accreditRadio[this.roleIndex],'checked',false)
             },
             typesData(types){
                 let n;
                 this.types.forEach((e)=>{
                     if(e.dicValue==types) {
                      n=e.dicDesc
                     }
                     })
                 return n
             }
	    },
        mounted(){
            this.initDeptTable();
            this.initAddDept();
            this.initRoleLevel();
            this.btnMsg.deptAdd=filterBtnPms(this.btnAllPms.deptAdd);
            this.btnMsg.deptAuthorization=filterBtnPms(this.btnAllPms.deptAuthorization);
        },
        computed:{
            ...mapGetters([
                'dicData',
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
    margin-left:20px;
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
  .smallBox .el-dialog{
  	margin-top:60px !important;
  }
   .message_bottom{
	  	height:44px;
	  	line-height: 44px;
	  	font-size: 12px;
    	color: #999;
		text-align: center;
	}
</style>
