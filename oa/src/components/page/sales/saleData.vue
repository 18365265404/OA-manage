<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>BD销售管理</el-breadcrumb-item>
                <el-breadcrumb-item>销售管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row type="flex" justify="start"  class="researchSales" >
            <el-col :xs="8" :sm="6" :md="4" :lg="2"><el-button  type="primary" size="small" @click="dialogFormVisible = true" icon="plus" v-if="btnMsg.salesAdd">录入销售</el-button></el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="2"><el-button  type="primary" size="small" @click="dialogTableVisible2=true" icon="setting" v-if="btnMsg.salesUpdateBDDataCount">数据总量</el-button></el-col>
            <el-col :xs="8" :sm="6" :md="4" :lg="2"><el-button  type="primary" size="small" @click="dialogTableVisible4=true" icon="upload2" v-if="btnMsg.salesBatchAdd">批量录入</el-button></el-col>
            <el-col :md="23"  :lg="17" >

                <el-form :inline="true" :model="formInline" ref="formInline">
                    <el-form-item label="BD渠道"  prop="bdId">
                        <el-select v-model="formInline.bdId"  clearable placeholder="请选择" size="small">
                            <el-option
                                v-for="(item,i) in researchBdUser"
                                :key="i"
                                :label="item.account+'_'+item.nickName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据状态" prop="status">
                        <el-select v-model="formInline.status"  clearable placeholder="请选择" size="small">
                            <el-option
                                v-for="(item,i) in saleStatus"
                                :key="i"
                                :label="item.dicDesc"
                                :value="item.dicValue"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="操作状态" prop="operateStatus">
                        <el-select v-model="formInline.operateStatus"  clearable placeholder="请选择" size="small">
                            <el-option
                                v-for="(item,i) in operateStatus"
                                :key="i"
                                :label="item.dicDesc"
                                :value="item.dicValue"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="researchTable">查询</el-button>
                        <el-button type="primary" size="small" @click="emptyResearch">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-form :inline="true" :model="assignBd" ref="assignBd" v-if="btnMsg.salesAssign">
                    <el-form-item label="BD渠道" prop="bdId">
                        <el-select v-model="assignBd.bdId" placeholder="请选择" size="small">
                            <el-option
                                v-for="(item,i) in BdUser"
                                :key="i"
                                :label="item.account+'_'+item.nickName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" size="small" @click="assignBdHandle">分配</el-button>
                        </el-form-item>
                </el-form>
            </el-col>
        </el-row>
            <el-table
                ref="multipleTable"
                :data="saleDataTable"
                border
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="advisorAccount" label="APP账号" width="100"></el-table-column>
                <el-table-column prop="contacts" label="联系人" width="100" ></el-table-column>
                <el-table-column prop="mobile" label="电话" width="110"></el-table-column>
                <el-table-column prop="hotels" label="酒店" width="150"></el-table-column>
                <el-table-column prop="experience" label="职位" width="80"></el-table-column>
                <el-table-column prop="createTime" label="录入时间" width="110" :formatter="formTime"></el-table-column>
                <el-table-column prop="bdName" label="BD渠道"  width="80">
                    <template scope="scope">
                        {{scope.row.bdName||'未分配'}}
                        </template>
                </el-table-column>
                <el-table-column prop="statusText" label="数据状态" width="100"></el-table-column>
                <el-table-column prop="operatingText" label="操作状态" ></el-table-column>
                <el-table-column prop="operate" label="操作" width="150" fixed="right">
                    <template scope="scope">
                        <div v-show="scope.row.bdName&&userId==scope.row.bdId&&btnMsg.salesOperatingStatus">
                            <el-button type="text" size="small" v-if="scope.row.status!==2&&scope.row.status!==3&&scope.row.operatingStatus!==2" @click="handleGrant(scope.row,saleStatus,0)">跟进</el-button>
                            <el-button type="text" size="small" @click="handleGrant(scope.row,operateStatus2,2)">处理</el-button>
                        </div>
                        <div v-show="scope.row.operatingStatus==2&&btnMsg.salesCheck">
                            <el-button type="text" size="small" @click="handleInspector(scope.row,1)">确认无效</el-button>
                            <el-button type="text" size="small" @click="handleInspector(scope.row,0)">确认有效</el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="followupList" label="婚宴销售跟进记录" width="340" >
                    <template scope="scope">
                       <div @dblclick="tableList(scope.row.id,0,'婚宴销售跟进记录')">
                           <p v-if="index<3" v-for="(item, index) in scope.row.followupList" >{{index+1}}、({{item.operatorName||'空'}}),备注：{{item.remark}}--{{formatTime(item.createTime)}}</p>
                       </div>
                    </template>
        </el-table-column>
                <el-table-column prop="changeStatusList" label="婚宴销售操作记录"  width="340">
                    <template scope="scope">
                        <div @dblclick="tableList(scope.row.id,2,'婚宴销售操作记录')">
                        <p  v-if="index<3" v-for="(item, index) in scope.row.changeStatusList" :data="formatTime(item.createTime)">{{index+1}}、({{item.operatorName||'空'}}),备注：{{item.remark}}--{{formatTime(item.createTime)}}</p>
                          </div>
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
        <!--记录dialog-->
        <el-dialog :title="tableDialogTitle" :visible.sync="dialogTableVisible">
            <el-table :data="saleDialogTable">
                <el-table-column property="createTime" label="日期" :formatter="formTime"></el-table-column>
                <el-table-column property="operatorName" label="姓名" ></el-table-column>
                <el-table-column property="remark" label="详情"></el-table-column>
                <el-table-column property="statusText" label="状态"></el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="saleDialogHandleSizeChange"
                                       @current-change="saleDialogHandleCurrentChange"
                                       :current-page="saleDialogPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="saleDialogPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="saleDialogPagination.total">>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <!--销售dialog-->
        <el-dialog title="新增销售" :visible.sync="dialogFormVisible" size='tiny' :before-close="resetForm">
            <el-form :model="addSales" :rules="rules" ref="addSales">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="contacts">
                    <el-input v-model="addSales.contacts" placeholder='请输入姓名' auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
                    <el-input v-model="addSales.mobile" placeholder='请输入电话'  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="酒店" :label-width="formLabelWidth" prop="hotels">
                    <el-input v-model="addSales.hotels" placeholder='请输入酒店名'  auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="职位" :label-width="formLabelWidth" prop="experience">
                    <el-input v-model="addSales.experience" placeholder='请输入职位'  auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="addSalesHandle('addSales')">新增</el-button>
                <el-button  @click="resetForm">取 消</el-button>
            </div>
        </el-dialog>
        <!--设置BD总量-->
        <el-dialog title="设置BD总量" :visible.sync="dialogTableVisible2" size='tiny' :before-close="BD_AccountCancel">
            <el-form :model="BD_Account" :rules="rules2" ref="BD_Account">
                <el-form-item label="数量" :label-width="formLabelWidth" prop="Name">
                    <el-input v-model.number="BD_Account.Name" placeholder='请输入数量' auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="BD_AccountHandle('BD_Account')">设置</el-button>
                <el-button  @click="BD_AccountCancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--设置跟进-->
        <el-dialog :title="dealDataTitle" :visible.sync="dialogTableVisible3" :before-close="BD_DealCancel">
            <el-form :model="dealData" :rules="rulesToData3" ref="dealData" >
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    {{dealData.name}}
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
                   {{dealData.mobile}}
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="dealData.status" placeholder="请选择" size="small">
                        <el-option
                            v-for="(item,i) in dealData.state"
                            :key="item"
                            :label="item.dicDesc"
                            :value="item.dicValue"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="APP账号" :label-width="formLabelWidth" prop="advisorAccount" v-if="!dealData.type&&dealData.status==2">
                    <el-input
                        v-model="dealData.advisorAccount"
                        type="text"
                        placeholder="请输入内容"
                       >
                    </el-input>
                </el-form-item>
                <el-form-item label="创建时间" :label-width="formLabelWidth" prop="originalReserveTime" v-if="!dealData.type&&dealData.status==1">
                    <el-date-picker
                        v-model="dealData.originalReserveTime"
                        type="datetime"
                        size="small"
                        placeholder="选择日期"
                        :picker-options="pickerOptions0"
                        @change="dealDataReserveTime"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新备注" :label-width="formLabelWidth" prop="remark">
                    <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入内容"
                        v-model="dealData.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="BD_DealHandle('dealData')">确定处理</el-button>
                <el-button  @click="BD_DealCancel">返回</el-button>
            </div>
        </el-dialog>
        <!--批量导入-->
        <el-dialog title="批量导入" :visible.sync="dialogTableVisible4" :before-close="cancelUpload">
            <el-form :model="uploadData" ref="uploadData" :rules="uploadDataRules">
                <el-form-item label="城市" prop="cityCode">
                    <el-select v-model="uploadData.cityCode" placeholder="请选择" size="small">
                        <el-option
                            v-for="(item,i) in storeCitys"
                            :key="i"
                            :label="item.cityName"
                            :value="item.cityCode"
                        >
                        </el-option>
                    </el-select>
                    </el-form-item>
                <el-form-item label="上传">
            <el-upload
                ref="upload"
                action="/s/batchSaveWeddingSales"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="refreshTable"
                :file-list="fileList"
                :auto-upload="false"
                :data="{cityCode:uploadData.cityCode}"
                accept=".xls"
            >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
                </el-form-item>
                <el-form-item label="备注">
            <el-card>
                只允许excel97-2003格式以.xls结尾的excel文件,文件行数不得超过5千行，否则会无法导入！<br>
                第一列所有都会导入数据库，不允许有任何说明文字！ 第一行也会导入数据库，请不要做标记！<br>
                超过500行数据的建议分批导入，每500行一次，数据太多容易导入失败！
            </el-card>
                </el-form-item>
                <el-form-item label="范例">
                    <el-button type="info" size="small" ><a :href='uploadTemplate' target=_blank style="color: #fff">点击下载</a></el-button>
                    </el-form-item >
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button style="margin-left: 10px;"  type="success" @click="submitUpload">上传到服务器</el-button>
                <el-button @click="cancelUpload">返回</el-button>
            </div>
            </el-dialog>

    </div>
</template>
<style scoped>
    .el-table{
        font-size: 13px;
    }
</style>
<style>
    .researchSales .el-form--inline .el-form-item__content{
        width: 130px;
    }
    .page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
    }
</style>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data() {
            var validateMobile = (rule, value, callback) => {
                if (!/^1(3|4|5|7|8)\d{9}$/.test(value)){
                    callback(new Error('手机号不正确'));
                } else {
                    callback();
                }
            }
            return {
                userId:'',
                uploadCity:[],
                fileList: [],
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                dealDataTitle:"",
                userInfo:{},
                formInline: {
                    bdId:'',
                    status: '',
                    operateStatus: ''
                },
                assignBd:{
                    bdId:'',
                    salesIds:'',
                    operatorId:''
                },
                operateStatus2:[
                    { "dicDesc": "无效", "dicName": "WEDDING_SALES_OPERATING_STATUS", "dicSort": null, "dicStatus": 0, "dicValue": 2, "id": "1b6624c8776811e793171418772e1d5a" },
                    { "dicDesc": "踢出", "dicName": "WEDDING_SALES_OPERATING_STATUS", "dicSort": null, "dicStatus": 0, "dicValue": 3, "id": "1b6647ee776811e793171418772e1d5a" } ],

                rules:{
                    contacts:[
                        {required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    mobile:[
                        {required: true, message: '请输入电话', trigger: 'blur' },
                        { max:11,message: '手机号码为11位', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
                    ],
                    hotels:[
                        {required: true, message: '请输入酒店名', trigger: 'blur' }
                    ],
                    experience:[
                        {required: true, message: '请输入职位', trigger: 'blur' }
                    ]
                },
                rules2:{
                    Name:[
                        {type:'number', required: true, message: '请设置正确BD总量', trigger: 'blur' }
                    ]},
                rulesToData3:{
                    remark:[
                        { required: true, message: '请填写备注', trigger: 'blur' }
                    ],
                    status:[
                        {type:'number',required: true, message: '请选择一项', trigger: 'change'}
                    ],
                    originalReserveTime:[{type: 'date',required:true, message: '请选择创建时间', trigger: 'change'}],
                    advisorAccount:[
                        {required: true, message: '请输入App账号', trigger: 'blur' }
                    ]
                },
                addSales:{
                    creator:'',
                    experience:'',
                    hotels:'',
                    mobile:'',
                    contacts:'',
                    cityCode:'310100'
                },
                BD_Account:{
                    Name:''
                },
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                saleDialogPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                saleDataTable: [],
                saleStatus:[],
                saleDialogTable:[],
                operateStatus:[],
                tableDialogTitle:'',
                multipleSelection: [],
                cell:{
                    salesId:'',
                    fellowType:'',
                    title:''
                },
                dialogTableVisible: false,
                dialogFormVisible: false,
                dialogTableVisible2:false,
                dialogTableVisible3:false,
                dialogTableVisible4:false,
                formLabelWidth:"80px",
                BdUser:[],
                researchBdUser:[{
                    account:"未分配",
                    id:0,
                    nickName:'数据'
                },{
                    account:"已分配",
                    id:1,
                    nickName:'数据'
                }],
                dealData:{
                    operatorId:'',
                    status:'',
                    remark:'',
                    reserveTime:'',
                    originalReserveTime:''
                },
                uploadTemplate:'',
                uploadData:{
                    cityCode:''
                },
                uploadDataRules:{
                    cityCode:[
                        {required: true, message: '请选择一项', trigger: 'change'}
                    ]
                },
                storeCitys:[],
                openCity:[],
                inspectorData:{
                    salesId:'',
                    confirmStatus:''
                },
                btnMsg:{
                    salesOperatingStatus:false,//操作状态处理
                    salesAdd:false,//录入销售
                    salesBatchAdd:false,//批量录入销售
                    salesUpdateBDDataCount:false,//更新BD数据总量
                    salesAssign:false,//分配BD
                    salesCheck:false,//核查(确认有效/确认无效)
                    salesFollowStatus:false//跟进状态处理
                }
            }
        },

        methods: {
            initBtnMsg(){
                this.btnMsg.salesOperatingStatus=filterBtnPms(this.btnAllPms.salesOperatingStatus);
                this.btnMsg.salesAdd=filterBtnPms(this.btnAllPms.salesAdd);
                this.btnMsg.salesBatchAdd=filterBtnPms(this.btnAllPms.salesBatchAdd);
                this.btnMsg.salesUpdateBDDataCount=filterBtnPms(this.btnAllPms.salesUpdateBDDataCount);
                this.btnMsg.salesAssign=filterBtnPms(this.btnAllPms.salesAssign);
                this.btnMsg.salesCheck=filterBtnPms(this.btnAllPms.salesCheck);
                this.btnMsg.salesFollowStatus=filterBtnPms(this.btnAllPms.salesFollowStatus);
            },
            refreshTable(response, file, fileList){
                   if(response.res==0){
                this.initSaleData(this.tableData);
                this.cancelUpload()
                   }else{
                       this.$message.error(response.msg);
                       this.fileList.pop()
                   }
            },
            submitUpload() {
                if(this.$refs['upload'].uploadFiles.length){
                    this.$refs['uploadData'].validate((valid) => {
                        if (valid) {
                            this.$refs.upload.submit();

                        }});
                }else{
                    this.$message.error('请选择上传文件');
                }

        },
            cancelUpload(){
                this.$refs.upload.clearFiles()
                this.$refs['uploadData'].resetFields()
                this.dialogTableVisible4=false
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file.response);
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
            ,
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initSaleData(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initSaleData(this.tableData);
            },
            saleDialogHandleSizeChange(val) {
                this.saleDialogPagination.pageSize=val;
                this.tableDialog();
            },
            saleDialogHandleCurrentChange(val) {
                this.saleDialogPagination.pageNow=val;
                this.tableDialog();
            },
            tableList(salesId,fellowType,title){
                    this.cell.salesId=salesId;
                    this.cell.fellowType=fellowType;
                    this.cell.title=title;
                    this.tableDialog(fellowType)
             },
             tableDialog(type){
                this.tableDialogTitle=this.cell.title;
                 this.dialogTableVisible=true;
                 this.$axios.get('/s/getFollowupList',
                     {params: {"pageNow":this.saleDialogPagination.pageNow,
                         "pageSize":this.saleDialogPagination.pageSize,
                         salesId:this.cell.salesId,
                         followupType:this.cell.fellowType}
                     }
                 ).then((res)=>{
                     if(res.status==200){
                         this.saleDialogTable=res.data.msg.list;
                         this.saleDialogPagination.total=res.data.msg.total;
                         this.saleDialogPagination.pageNum=res.data.msg.pageNum;
                         this.saleDialogPagination.pageSize=res.data.msg.pageSize;
                         this.saleDialogTable.forEach((e,i)=>{
                             if(!type){
                                 this.saleStatus.forEach((v)=>{
                                     if(v.dicValue==e.status){
                                         e.statusText=v.dicDesc
                                     }
                                 })
                             }else{
                                 this.operateStatus.forEach((n)=>{
                                     if(n.dicValue==e.operatingStatus){
                                         e.statusText=n.dicDesc
                                     }
                                 })
                             }
                         })

                     }
                 })
             },
            initSaleData(data){
                this.$loading({text:'拼命加载中'})
                this.$axios.get('/s/getWeddingList',{params:data}).then((res)=>{
                   if(res.status==200){
                       this.saleStatus=this.dicData.WEDDING_SALES_STATUS;
                       this.operateStatus=this.dicData.WEDDING_SALES_OPERATING_STATUS;
                       this.saleDataTable=res.data.msg.list;
                       this.pagination.total=res.data.msg.total;
                       this.pagination.pageNum=res.data.msg.pageNum;
                       this.pagination.pageSize=res.data.msg.pageSize;
                       this.saleDataTable.forEach((e,i)=>{
                           this.saleStatus.forEach((v)=>{
                               if(v.dicValue==e.status){
                                   e.statusText=v.dicDesc
                               }
                           })
                           this.operateStatus.forEach((n)=>{
                               if(n.dicValue==e.operatingStatus){
                                   e.operatingText=n.dicDesc
                               }
                           })
                       })
                   }
                    this.$loading().close()
                })
            },

            addSalesHandle(formName){
                let data= this.addSales;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.put('/s/saveWeddingSales',data).then((res)=>{
                            if(res.data.msg=="success"){
                                this.initSaleData(this.tableData);
                                this.resetForm()
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        });

                    } else {
                        this.$message.error('请填写正确的信息！')
                        return false;
                    }
                });
            },
            BD_AccountCancel(){
                this.initBd_Account();
                this.dialogTableVisible2 = false;
            },
            resetForm() {
                this.$refs['addSales'].resetFields();
                this.dialogFormVisible = false;
            },
            BD_AccountHandle(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/s/updateBdDataCount',{count:this.BD_Account.Name}).then((res)=>{
                            if(res.data.msg=="success"){
                               this.BD_AccountCancel();
                                this.dialogTableVisible2 = false;
                            }else {
                                this.$message.error(res.data.msg)
                            }
                        }).catch((error)=>{
                            this.$message.error(error)
                        });

                    } else {
                        this.$message.error('请填写必要信息！')
                        return false;
                    }
                });
            },
            BD_DealHandle(formName){
                let data={
                    operatorId:this.dealData.operatorId,
                    remark:this.dealData.remark,
                    weddingSalesId: this.dealData.weddingSalesId,
                    type:this.dealData.type
                }
                this.dealData.type?data.operatingStatus=this.dealData.status: data.status=this.dealData.status;
                this.dealData.reserveTime?data.reserveTime= this.dealData.reserveTime:"";
                this.dealData.advisorAccount?data.advisorAccount= this.dealData.advisorAccount:"";
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/s/saveFollowupInfo',data).then((res)=>{
                            if(res.data.msg=="success"){
                                this.BD_DealCancel();
                                this.initSaleData(this.tableData);

                            }else {
                                this.$message.error(res.data.msg)
                            }
                        });

                    } else {
                        this.$message.error('请填写必要信息！')
                        return false;
                    }
                });
            },
            BD_DealCancel(){
                this.$refs['dealData'].resetFields();
                this.dialogTableVisible3=false;

            },
            dealDataReserveTime(val){
                let timestamp2 = Date.parse(new Date(val));
               this.dealData.reserveTime=timestamp2;

            },
            researchTable(){
                this.initSaleData(this.tableData);
            },
            emptyResearch(){
                this.$refs['formInline'].resetFields();

            },
            formTime(row){
                if(row.createTime){
                    return formatTime(row.createTime)
                }

            },
            formatTime(data){
                return formatTime(data)
            },
            initBd_Account(){
                this.$axios.get("/s/getBdDataCount").then((res)=>{
                    if(res.status==200){
                        this.BD_Account.Name=res.data.msg;
                    }
                })
            },
            initBdDeptUser(){
                this.$axios.post("/s/getBdList").then((res)=>{
                    if(res.status==200){
                        this.BdUser=res.data.msg;
                        this.researchBdUser=this.researchBdUser.concat(res.data.msg)
                    }
                })
            },
            assignBdHandle(){
                this.assignBd.salesIds=this.multipleSelection.map((item)=>{
                    return item.id
                }).join(',');
                this.$axios.post('/s/assignBd',this.assignBd).then((res)=>{
                   if(res.data.res == '0'){
                       this.initSaleData(this.tableData);
                       this.$message.info('分配成功！')
                   }else {
                       this.$message.error(res.data.msg)
                   }
                })
            },
            handleGrant(row,data,type){
                this.dialogTableVisible3=true;
                this.dealDataTitle=type?'处理':'跟进';
                this.dealData.name=row.contacts;
                this.dealData.mobile=row.mobile;
                this.dealData.state=data;
                this.dealData.weddingSalesId=row.id;
                this.dealData.type=type
            },
            handleInspector(row,confirmStatus){
                this.inspectorData.confirmStatus=confirmStatus
                this.inspectorData.salesId=row.id
                let tips=confirmStatus?'无效':"有效"
                this.$confirm('确定此条数据'+tips+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/s/inspectorsWeddingSales',this.inspectorData).then((res)=>{
                      if(res.data.res=='0'){
                          this.$message({
                              type: 'success',
                              message: '操作成功!'
                          });
                          this.initSaleData(this.tableData);
                      }else{
                          this.$message({
                              type: 'error',
                              message: res.data.msg
                          });
                      }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            getSalesTemplate(){
                this.$axios.get('/s/getSalesTemplate').then((res)=>{
                   if(res.status==200){
                       this.uploadTemplate=res.data.msg
                   }
                })
            },
            initCity(){ //初始化默认用户城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.userId=JSON.parse(localStorage.getItem("userInfo")).id
            },
            initOpenCity(){ //所有开通城市
                this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
                    if(res2.status == 200){
                        this.openCity =  res2.data.msg;
                        this.storeCitys.forEach((e)=>{
                            this.openCity.forEach((n)=>{
                                if( n.cityCode==e.cityCode){
                                    e.cityName = n.cityName
                                }
                            })
                        })
                    }
                    else{
                        alert(msg)
                    }
                })
            }
        },
        mounted(){
            this.initCity()
            this.initOpenCity()
            this.initSaleData(this.tableData);
            this.initBdDeptUser();
            this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
            this.addSales.creator=this.userInfo.id;
            this.assignBd.operatorId=this.userInfo.id;
            this.dealData.operatorId=this.userInfo.id;
            this.uploadCity=this.userInfo.positionCitys;
            this.initBd_Account();
            this.getSalesTemplate();
            this.initBtnMsg()

        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    bdId:this.formInline.bdId,
                    status:this.formInline.status,
                    operatingStatus:this.formInline.operateStatus

                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        }
    }
</script>
