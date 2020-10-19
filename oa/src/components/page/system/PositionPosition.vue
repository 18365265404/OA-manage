<template>
    <div class="position">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>岗位管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
          <el-button type="text" @click="addPosition"  v-if="btnMsg.positionAdd">
          	<el-button type="primary" icon="plus">新增岗位</el-button>
          </el-button>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
			  <el-form-item label="关键字：">
			    <el-input class='lengthInput' v-model="formInline.condition" placeholder="请输入岗位名" @keyup.enter.native="onSubmit"></el-input>
			  </el-form-item>
			  <el-form-item>
				<el-button type="primary" @click="onSubmit" icon="search"></el-button>
			  </el-form-item>
		</el-form>

          <!--新增岗位弹框-->
          <el-dialog title="新增岗位" size='full' :visible.sync="dialogFormVisible" class='positionBox' :before-close="cancelAddPosition">
			  <el-form :model="role" :rules="rules" ref="role">
			    <el-form-item label="岗位名" :label-width="formLabelWidth1" prop="name">
			      <el-input v-model="role.name" placeholder='请输入岗位名称' auto-complete="off"></el-input>
			    </el-form-item>
				<el-form-item label="类型(LEVEL)" :label-width="formLabelWidth1" prop="value">
                    <el-select v-model="role.value" placeholder="管理者">
                        <el-option v-for="type in types"
                                   :key="type.dicDesc"
                                   :label="type.dicDesc"
                                   :value="type.dicValue"
                        ></el-option>
                    </el-select>
				</el-form-item>
				<el-form-item label="归属部门(deptId)" label-width="150px" prop="selectedOptions">
				    <el-row>
                        <el-col :span="10">
                            <el-cascader
                                :options="deptTree"
                                v-model="role.selectedOptions"
                                :props="props"
                                :change-on-select="true"
                                :show-all-levels="false"
                                @change="handleChange"
                            ></el-cascader></el-col>
                        <el-col :span="4">继承部门权限</el-col>
                         <el-col :span="6">
                             <el-switch
                                 v-model="role.radio"
                                 on-text="是"
                                 off-text="否"
                                 on-value="1"
                                 off-value="0"
                             >
                             </el-switch>
                         </el-col>
                    </el-row>
				</el-form-item>
                  <el-form-item label="父级岗位" label-width="150px" prop="parentPositionId">
                          <el-select v-model="role.parentPositionId">
                              <el-option v-for="type in fatherDept"
                                         :key="type.id"
                                         :label="type.positionName"
                                         :value="type.id"
                              ></el-option>
                          </el-select>
                  </el-form-item>
                  <el-form-item label="城市" :label-width="formLabelWidth1" prop="checkedCities">
                      <el-card class="box-card">
                          <div class="text item">
                              <el-row>
                                  <el-col>
                                      <div class="grid-content bg-purple">
                                          <el-checkbox-group v-model="role.checkedCities">
                                              <el-checkbox   v-for="city in cities" :label="city.cityCode" :key="city.cityCode">{{city.cityName}}</el-checkbox>
                                          </el-checkbox-group>
                                      </div>
                                  </el-col>
                              </el-row>
                          </div>
                      </el-card>
                  </el-form-item>
                   <el-form-item  label="业务规则" :label-width="formLabelWidth1" >
                   	 <el-card class="box-card row_card" v-for='(item,index) in objects' :key="index" style="margin-bottom: 15px">
                         <div slot="header" class="clearfix">
                             <span>规则-{{index}}</span>
                             <el-button style="float: right; margin: 5px" type="primary" size='mini' :plain="true" @click="item.ruleIds=''" >重置</el-button>
                         </div>
                      <div class="text item">
                            <el-row class='system_row'>
                                <el-col>
                                    <div>
                                    	<el-radio-group v-model="item.ruleIds" >
                                                    <el-radio class='radio' :value="secItem.id" v-for="secItem in item.child" :label="secItem.id" :key="secItem.id" style="margin: 8px">{{secItem.desc}}</el-radio>
										  </el-radio-group>
                                    </div>
                                </el-col>

                            </el-row>
                        </div>
                    </el-card>
                  </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">

			    <el-button type="primary" icon='document' @click="sendAddPosition('role')">新增</el-button>
			    <el-button @click="cancelAddPosition">取 消</el-button>
			  </div>
			</el-dialog>


		 <el-table :data="positionTable" border style="
		 width: 100%">
		   <el-table-column prop="positionName" label="岗位名" ></el-table-column>
    		<el-table-column prop="parentPositionName" label="上级部门" ></el-table-column>
    		<el-table-column  label="可管理部门"></el-table-column>
    		<el-table-column prop="level" label="岗位类型">
                <template scope="scope">
                    {{typesData(scope.row.level)}}
                </template>
            </el-table-column>
		    <el-table-column label="授权">
		      <template scope="scope">
		          	 <el-button size="small" type="info" v-show="btnMsg.positionAuthorization" @click="handleGrant(scope.$index, scope.row)">授权</el-button>
                  <el-button size="small" type="info" v-show="btnMsg.positionBusinessRule" @click="handleRulesGrant(scope.$index, scope.row)">业务规则</el-button>
		      </template>
		    </el-table-column>
		  </el-table>

        <!--授权弹框-->
        <el-dialog title="岗位授权" :visible.sync="dialogFormVisible1"  :before-close="cancelAccreditHandle">
            <el-form >
                <el-form-item label="岗位" :label-width="formLabelWidth">
                    <h3>{{accredit.name}}</h3>
                </el-form-item>
                <el-form-item label="部门继承列表" :label-width="formLabelWidth">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>选择部门角色</span>
                        </div>
                        <div class="text item">
                            <el-row>
                                <el-col >
                                    <div class="grid-content bg-purple">
                                        <el-checkbox-group v-model="checkedRoles">
                                            <el-checkbox v-for="role in roles" :label="role.id" :key="role.id" v-model="role.checked">{{role.roleName}}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="sendAccreditHandle">授权</el-button>
                <el-button @click="cancelAccreditHandle">取 消</el-button>
            </div>
        </el-dialog>
        <!--业务规则-->
        <el-dialog title="业务规则" :visible.sync="dialogFormVisible2"  :before-close="closeSimpleRules">
            <el-form >
                <el-form-item label="岗位" :label-width="formLabelWidth">
                    <h3>{{accredit.name}}</h3>
                </el-form-item>

                <el-form-item  label="业务规则" :label-width="formLabelWidth1"  class="simpleRuleBox">
                    <el-card class="box-card row_card" v-for='(item,index) in objects' :key="index" style="margin-bottom: 15px">
                        <div slot="header" class="clearfix">
                            <span>规则-{{index}}</span>
                            <el-button style="float: right; margin: 5px" type="primary" size='mini' :plain="true" @click="item.ruleIds=''" >重置</el-button>
                        </div>
                        <div class="text item">
                            <el-row class='system_row'>
                                <el-col>
                                    <div>
                                        <el-radio-group v-model="item.ruleIds" >
                                            <el-radio class='radio'
                                                      :value="secItem.id"
                                                      v-for="secItem in item.child"
                                                      :label="secItem.id"
                                                      :key="secItem.id" style="margin: 8px">{{secItem.desc}}</el-radio>
                                        </el-radio-group>
                                    </div>
                                </el-col>

                            </el-row>
                        </div>
                    </el-card>
                </el-form-item>


                </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="sendSimpleRules">更改</el-button>
                <el-button @click="closeSimpleRules">取 消</el-button>
            </div>
            </el-dialog>
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
    </div>
</template>

<script type="text/ecmascript-6" >
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data: function(){
            return {
            	formInline:{
            		condition:''
            	},
                array:[],
                array1:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                dialogFormVisible2:false,
                positionTable:[],
                types:[],
                cities:[],
                checkedCities:[],
                ruleIds:[],
                ruleIdsGroup:{},
                deptTree:[],
                props:{
                    label: 'deptName',
                    children: 'child',
                    value:'id'
                },
                objects:[],


                rules:{
                    name:[
                        {max:50,required: true, message: '请输入岗位名(长度小于50个字符)', trigger: 'blur' }
                    ],
                    selectedOptions:[
                        { type: 'array', required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    value:[
                        { type: 'number',required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    resType:[
                        {type: 'number',required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    checkedCities :[
                        {type: 'array',required: true, message: '请选择一个', trigger: 'change' }
                    ]
                },
                selectedOptions:[],
                accredit:{
                    name:'',
                    deptId:'',
                    id:'',
                },
                roles:[],
                checkedRoles:[],
		         dialogFormVisible: false,
		         dialogFormVisible1: false,
		         role: {
		          name: '',
                    value: '',
                    selectedOptions:[],
                    radio:'1',
                    checkedCities:[],
                     parentPositionId:''
                 },
		        formLabelWidth: '120px',
		        formLabelWidth1: '150px',
				radio2:'',
                fatherDept:[],
                simpleRulesId:'',
                simpleRulesOpen:false,
                btnMsg:{
                    positionAdd:false,//新增岗位
                    positionAuthorization:false,// 岗位授权
                    positionBusinessRule:false//业务规则
                }
            };
        },

         methods: {
         	 onSubmit(){
         	 	this.initPositionTable(this.tableData)
         	 },
             sendSimpleRules(){
                 let ids= this.objects.map((e)=>{
                     return e.ruleIds
                 }).filter((n)=>{
                     return n
                 })
                 let ruleIds=[...new Set(ids)]
                 this.$axios.post('/s/modifyBusinessRules',{positionId:this.simpleRulesId,ruleIds:ruleIds}).then((res)=>{
                     if(res.data.res==0){
                       this.closeSimpleRules()
                     }
                 })
             },
             closeSimpleRules(){
                 this.dialogFormVisible2 = false
                 this.array = [];
                 this.array1 = [];
                 this.objects = [];
             },
             handleRulesGrant(index, row){
                 this.dialogFormVisible2 = true
                 this.accredit.name = this.positionTable[index].positionName
                 this.simpleRulesId=row.id
                 this.simpleRulesOpen=true
                 this.initRules()
             },
            getPositionRulesByPositionId(id){
                this.$axios.get('/s/getPositionRulesByPositionId',{params:{positionId:id}}).then((res)=>{
                    if(res.data.res==0 && typeof res.data.msg=='object'){
                        this.objects.forEach((e,i)=>{
                                e.child.forEach((n,j)=>{
                                    res.data.msg.forEach((k)=>{
                                        if(k.id==n.id){
                                            e.ruleIds=n.id
                                            this.$set(this.objects[i], 'ruleIds', n.id)
                                        }
                                    })
                                })

                        })
                    }
                })
            },
             handleChange(value) {
                 this.fatherDept=[]
                 this.role.parentPositionId=''
                 this.$axios.post('/s/findPositionByDeptId',{deptId:value[value.length-1]}).then((res)=>{
                         if(res.data.res==0){
                            this.fatherDept=res.data.msg
                         }
              })
             },
		      handleGrant(index, row) {
                  this.dialogFormVisible1 = true
		        this.accredit.name = this.positionTable[index].positionName
                  this.accredit.deptId= this.positionTable[index].deptId
                  this.accredit.id= this.positionTable[index].id
                  this.$axios.post('/s/getRoleByDeptId',{deptId:this.accredit.deptId}).then((res)=>{
                      if(res.data.res==0){
                          this.$axios.post('/s/getRoleByPositionId',{positionId:this.accredit.id}).then((res2)=>{
                          	if(res2.data.res == 0){
                          		res2.data.msg.forEach((n)=>{
                                  res.data.msg.forEach((p)=>{
                                      if(n.id==p.id){
                                          this.checkedRoles.push(p.id)
                                      }
                                  })
                              })
                              this.checkedRoles=[...new Set(this.checkedRoles)]
                              this.roles=res.data.msg
                          	}

                        })
                      }
                })
		      },
             handleSizeChange(val) {
                 this.pagination.pageSize=val;
                 this.initPositionTable(this.tableData);
             },
             handleCurrentChange(val) {
                 this.pagination.pageNow=val;
                 this.initPositionTable(this.tableData);
             },
             getDeptTree(){
             	this.$axios.post("/s/deptTree",{parentIds:0}).then((res)=>{
                     if(res.data.res==0){
                         this.deptTree=res.data.msg;
                         this.deptTreeNullChild(this.deptTree)
                     }
                 })
             },
             initPositionTable(data){
                 this.$axios.post('/s/positionPage',data).then((res)=>{
                     if(res.data.res==0){
                         this.pagination.total=res.data.msg.total;
                         this.pagination.pageNum=res.data.msg.pageNum;
                         this.pagination.pageSize=res.data.msg.pageSize;
                         this.positionTable=res.data.msg.list
                     }
                 })
                 this.types=this.dicData.LEVEL
             },
             deptTreeNullChild(e){
                 e.forEach((n)=>{
                     if(n.child.length){
                         this.deptTreeNullChild(n.child)
                     }else {
                         delete  n.child
                     }
                 })
             },
             addPosition(){
                 this.dialogFormVisible = true
                 this.simpleRulesOpen=false
                 this.initRules()
             },
                sendAddPosition(formName){
                  let ids= this.objects.map((e)=>{
                        return e.ruleIds
                    }).filter((n)=>{
                        return n
                    })
                 let data={
                     positionName:this.role.name,
                     isDeptAuth:this.role.radio,
                     level:this.role.value,
                     parentPositionId:this.role.parentPositionId,
                     citys:this.role.checkedCities,
                     ruleIds:ids,
                     deptId:this.role.selectedOptions[this.role.selectedOptions.length-1]

                 }
                 this.$refs[formName].validate((valid) => {
                     if (valid) {
                         this.$axios.post("/s/addPosition",data).then((res)=>{
                             if(res.data.res==0){
                                 this.cancelAddPosition()
                             }
                         });
                     } else {
                         this.$message.error('请填写必要信息！')
                         return false;
                     }
                 });
             },
             cancelAddPosition(){
             	this.array = [];
             	this.array1 = [];
             	this.objects = [];
                 this.$refs['role'].resetFields();
                 this.dialogFormVisible = false;
             },
             sendAccreditHandle(){
                 if(this.checkedRoles.length){
                     this.$axios.post('/s/positionGrantRole',{id:this.accredit.id,roleIds:this.checkedRoles}).then((res)=>{
                         this.checkedRoles=[];
                         this.dialogFormVisible1 = false

                     })
                 }else {
                     this.$message.error('请填写必要信息！')
                 }
             },
             cancelAccreditHandle(){
                 this.checkedRoles=[];
                 this.accredit.deptId=''
                 this.dialogFormVisible1 = false
             },
             typesData(types){
                 let n;
                 this.types.forEach((e)=>{
                     if(e.dicValue==types) {
                         n=e.dicDesc
                     }
                 })
                 return n
             },
             initRules(){
                 this.$axios.get('/s/listPositionRules',{params:{pageNow:1,pageSize:1000}}).then((res1)=>{

                     if(res1.data.res=='0'){
                         var allObjectList = res1.data.msg;
                         for (name in allObjectList){
                             this.array.push(name)
                             this.array1.push(allObjectList[name])
                         }
                         for(var i=0;i<this.array.length;i++){
                             var obj = {};
                             obj.ruleIds = '';
                             obj.titie = this.array[i];
                             obj.child = this.array1[i];
                             this.objects.push(obj)
                         }

                         if(this.simpleRulesOpen){
                             this.getPositionRulesByPositionId(this.simpleRulesId)
                         }
                     }
                 })
             },
             initCity(){
                 this.$axios.get('/b/getOpenCityLists',{params:{pageNow:1,pageSize:1000}}).then((res)=>{
                     if(res.data.res == 0){
                     	this.cities=res.data.msg
                     }
                 })
             }
	    },
        mounted(){
            this.initCity()
            this.getDeptTree()
            this.initPositionTable(this.tableData)
            this.btnMsg.positionAdd=filterBtnPms(this.btnAllPms.positionAdd);
            this.btnMsg.positionAuthorization=filterBtnPms(this.btnAllPms.positionAuthorization);
            this.btnMsg.positionBusinessRule=filterBtnPms(this.btnAllPms.positionBusinessRule);

        },
        computed:{
        	tableData(){
               return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize,condition:this.formInline.condition}
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
    .page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
        border-bottom:1px solid #eee;
    }
    .position .text {
        margin: 0;
        border-bottom:none;
  }
    .position .el-checkbox:first-child{
        margin-left: 15px;
    }
    .position .box-card .el-card__header{
  	padding:0 10px
  }
    .box-card .el-card__body{
        padding:10px 20px;
    }


	.radio:nth-of-type(1){
		margin-left:15px;
	}
</style>
