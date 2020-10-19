<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>资源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

          <el-button type="text" @click="dialogFormVisible = true" v-if="addRecoursePermission">
          	<el-button type="primary" icon="plus" >新增资源</el-button>
          </el-button>

          <el-dialog title="新增资源" :visible.sync="dialogFormVisible" size='tiny' :before-close="resetForm" :close-on-click-modal="false">
			  <el-form :model="addResourceData" :rules="rules" ref="addResourceData">
			    <el-form-item label="资源名" :label-width="formLabelWidth" prop="resourceName">
			      <el-input v-model="addResourceData.resourceName" placeholder='请输入资源名' auto-complete="off"></el-input>
			    </el-form-item>
				<el-form-item label="资源URL" :label-width="formLabelWidth" prop="url">
				    <el-input v-model="addResourceData.url" placeholder='请输入资源URL'  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="父节点" :label-width="formLabelWidth" prop="selectionData">
				     <el-cascader :options="recourseData"
                                  v-model="addResourceData.selectionData"
                                  :change-on-select="true"
                                  @change="handleChange"
                                  :props="props"
                                  :show-all-levels="false"
                     ></el-cascader>
				</el-form-item>
				<el-form-item label="类型" :label-width="formLabelWidth" prop="resType">
				     <el-select v-model="addResourceData.resType" placeholder="目录" >
					    <el-option
					      v-for="(item,i) in dicDesc"
					      :key="i"
					      :label="item.type"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="权限key" :label-width="formLabelWidth" prop="permission">
				    <el-input v-model="addResourceData.permission" placeholder='请输入权限key'  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" :label-width="formLabelWidth" prop="message">
				    <el-input v-model="addResourceData.message" placeholder='请输入备注'  auto-complete="off"></el-input>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">

			    <el-button type="primary" icon='document' @click="addResourceHandle('addResourceData')">新增</el-button>
			    <el-button  @click="resetForm">取 消</el-button>
			  </div>
			</el-dialog>



	    <el-table :data="table" border style="width: 100%">
			<el-table-column prop="resourceName" label="资源名">
                <template scope="scope">
                    <span v-for="(item,index) in scope.row.indexNum" name="more" style="width: 25px;display: inline-block;height: 1px;background: #000;vertical-align: middle" :key="index"></span>
                <span  v-bind:style="{fontSize:fontSize(scope.row.indexNum)}" style="vertical-align: middle">{{ scope.row.resourceName }}</span>
            </template></el-table-column>
		    <el-table-column prop="url" label="资源URL"></el-table-column>
		    <el-table-column prop="resType" label="资源类型">
                <template scope="scope">
                    <span v-if="scope.row.resType=='0'">目录</span>
                    <span v-if="scope.row.resType=='1'">菜单</span>
                    <span v-if="scope.row.resType=='2'">按钮</span>
                </template>
            </el-table-column>
		    <el-table-column prop="sourceMessage" label="备注"></el-table-column>
		    <el-table-column prop="permission" label="极限"></el-table-column>

		</el-table>
    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {filterBtnPms} from '../../utils/common'
    export default {
        data: function(){
            return {
                 table:[],
                rules:{
                    resourceName:[
                        {required: true, message: '请输入资源名', trigger: 'blur' }
                    ],
                    selectionData:[
                        { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
                    ],
                    permission:[
                        {required: true, message: '请输入key', trigger: 'blur' }
                    ],
                    resType:[
                        {type: 'number',required: true, message: '请选择一个', trigger: 'change' }
                    ],
                    recourseData :[
                        {type: 'array',required: true, message: '请选择一个', trigger: 'change' }
                    ]
                },
                form:{
                    resourceName:'',
                    url:'',
                    selectionData:[],
                    resType:null,
                    permission:'',
                    message:''
                },
                 dicDesc:[],
		         dialogFormVisible: false,
                 recourseData:[
                     {
                         "id":"0",
                         "resourceName":"根节点",
                         "permission":'root',
                         "child":[]

                     }
                 ],
                 addRecoursePermission:false,
                 props: {
                    label: 'resourceName',
                    children: 'child',
                    value:'permission'
                 },
                addResourceData:{
                     resourceName:'',
                     url:'#',
                     permission:'',
                     platform:0,
                     resType:'',
                     parentId:'',
                     isShow:1,
                     message:'',
                    recourseData:[]
                 },
		        formLabelWidth: '120px'
            };
        },
         methods: {
	      handleChange(value) {
               let nodeEle= this.table.some((ele)=> {
                   if(ele.permission==value[value.length-1]){
                       this.addResourceData.parentId=ele.id;
                       return true
                   }
              })
              if(!nodeEle){
                  this.addResourceData.parentId=0;
              }
	      },
             addResourceHandle(formName){
                 let data= this.addResourceData;
                 this.$refs[formName].validate((valid) => {
                     if (valid) {
                         this.$axios.post('/s/addResource',data).then((res)=>{
                             if(res.data.msg=="success"){
                                 this.initTable()
                                this.resetForm()
                             }
                         });

                     } else {
                         this.$message.error('请填写必要信息！')
                         return false;
                     }
                 });
             },
             resetForm() {
                 this.$refs['addResourceData'].resetFields();
                 this.dialogFormVisible = false;
             },
             initTable(){
                 let self=this;
                 this.$axios.post("/s/findResourceByPlatform").then(function (res) {
                     self.table=[];
                     self.recourseData[0].child=res.data.msg;
                     function forEachTable(ele) {
                         ele.forEach(function (value) {
                             if(!value.indexNum){
                                 value.indexNum=0
                             }
                             self.table.push(value)
                             if(value.child||value.child.length){
                                 value.child.forEach(function (eleChild) {
                                     eleChild.indexNum=value.indexNum+1;
                                 })
                                 forEachTable(value.child)
                             }
                         })
                     }
                     forEachTable(res.data.msg)
                     self.initAddRecourse();
                 })


             },
             //初始化类型
             initAddRecourse(){
//                 按钮权限
                 this.dicDesc=[];
            this.addRecoursePermission=filterBtnPms(this.btnAllPms.recourseAdd);
                 this.dicData.RESOURCE_TYPE.forEach((ele,i)=>{
                     let newEle={
                         type:ele.dicDesc,
                         value:ele.dicValue
                     };
                     this.dicDesc.push(newEle)
                 })

             },
             fontSize(n){
                 return (18-n*2)+"px"
             }
	    },
        watch:{
        },
        computed:{
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])

    },
        mounted(){
           this.initTable();
        }
    }
</script>
<style>
	 .message_bottom{
	  	height:44px;
	  	line-height: 44px;
	  	font-size: 12px;
    	color: #999;
		text-align: center;
	}
</style>
