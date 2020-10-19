<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> BD数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>面谈统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
        	<el-form-item label="账户：" prop='bdAccount' :label-width="formLabelWidth">
				<el-input v-model="formInline.bdAccount" ></el-input>
			</el-form-item>
		  <el-form-item label="起始日期：" prop='startDate'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.startDate"
			      type="date"
                  :editable="false"
			      placeholder="选择日期"
                  format="yyyy-MM-dd"
			      :picker-options="pickerBeginDateBefore">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item label="终止日期：" prop='endDate'>
              <el-tooltip class="item" effect="dark" content="终止日期为7天以内" placement="top-end">

		     <div class="block">
			    <el-date-picker
			      v-model="formInline.endDate"
			      type="date"
                  :editable="false"
			      placeholder="选择日期"  format="yyyy-MM-dd"
			      :picker-options="pickerBeginDateAfter">
			    </el-date-picker>
			  </div>
              </el-tooltip>
		  </el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
		  </el-form-item>
		</el-form>

		  <el-table :data="interviewTableData" border style="width: 100%">
			<el-table-column prop="bdName" label="BD账户"></el-table-column>
		    <el-table-column prop="bdAccount" label="账号"></el-table-column>
		    <el-table-column prop="salesCount" label="全部销售">
                <template scope="scope">
                    <div v-if="scope.row.salesCount==0">{{scope.row.salesCount}}</div>
                    <div v-else="" @click="showDetail(scope.row.bdId)" style="cursor: pointer;color: #20a0ff">{{scope.row.salesCount}}</div>
                </template>
            </el-table-column>
		    <el-table-column prop="cooperationCount" label="合作销售">
                <template scope="scope">
                    <div v-if="scope.row.cooperationCount==0">{{scope.row.cooperationCount}}</div>
                    <div v-else="" @click="showDetail(scope.row.bdId,1)" style="cursor: pointer;color: #20a0ff">{{scope.row.cooperationCount}}</div>
                </template>
            </el-table-column>
              -
		    <el-table-column prop="totalCount" label="合计">
                <template scope="scope">
                    <div v-if="scope.row.totalCount==0">{{scope.row.totalCount}}</div>
                    <div v-else="" @click="showFollowDetail(scope.row,'all',true)" style="cursor: pointer;color: rgb(255, 73, 73)">{{scope.row.totalCount}}</div>
                </template>
            </el-table-column>
              <el-table-column prop="resultMap" label="面谈数量" width="950px">
                  <template scope="scope">
                      <!--{{scope.row.resultMap}}-->
                      <el-row>
                      <el-col :span="3" v-for=" p in objectToArray(scope.row.resultMap)" style="margin:5px 5px 5px 0">
                                 <el-button   size="small" :plain="true"  type="danger" style="min-width: 82px" @click="showFollowDetail(scope.row,p[0],p[1])">{{moment(p[0])}}</el-button> <span style="cursor:pointer" @click="showFollowDetail(scope.row,p[0],p[1])" :style="p[1]?'color: rgb(255, 73, 73)':''"> : {{p[1]}}</span>
                      </el-col>
                      </el-row>
                  </template>

              </el-table-column>

		</el-table>
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
                                   :total="pagination.total">>
                    </el-pagination>
                </div>
            </el-col>
		 </el-row>
        <el-dialog  :visible.sync="dialogTableVisible">
            <el-table :data="saleDialogTable">
                <el-table-column prop="contacts" label="姓名" ></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template scope="scope">
                        {{statusText(scope.row.status)}}
                    </template>
                </el-table-column>
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
        <el-dialog  :visible.sync="dialogFollowUpVisible">
            <el-table :data="followUpDialogTable">
                <el-table-column prop="contacts" label="姓名" ></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="hotels" label="酒店"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template scope="scope">
                        {{statusText(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column prop="reserveTime" label="处理时间" width="110px" >
                    <template scope="scope">
                    {{form(scope.row.reserveTime)}}
                </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="followDialogHandleSizeChange"
                                       @current-change="followDialogHandleCurrentChange"
                                       :current-page="followDialogPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="followDialogPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="followDialogPagination.total">>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
    import  moment from 'moment'
    moment.locale('zh-cn');
    function getDays(strDateStart,strDateEnd){
        var strSeparator = "-"; //日期分隔符
        var oDate1;
        var oDate2;
        var iDays;
        oDate1= strDateStart.split(strSeparator);
        oDate2= strDateEnd.split(strSeparator);
        var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
        var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
        return iDays ;
    }
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data() {
            return {
            	formLabelWidth:'80px',
                followUpDialogTable:[],
            	 pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
              },
                dialogFollowUpVisible:false,
		        interviewTableData: [],
		        formInline:{
		        	bdAccount:'',
		        	startDate:'',
		        	endDate:''
		        },
		        bdAccounts:[],
                pickerOptions0: {

		        },
                dialogTableVisible:false,
                saleDialogPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                followDialogPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                saleDataTable:[],
                saleDialogTable:[],
                SalesByBdId:{
                    bdId:'',
                    status:''
                },
                saleStatus:[],
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }

                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.formInline.startDate;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                followUpDetail:{
                    bdAccount:'',
                    startDate:"",
                    endDate:''
                },
                btnMsg:{
                    interviewCountDetails:false
                }
            }
        },
        methods: {
            showDetail(bdId,status){
              if( this.btnMsg.interviewCountDetails){
                  this.SalesByBdId.bdId=bdId;
                  this.SalesByBdId.status=status;
                  this.initShowDetail()
              }
            },
            initShowDetail(){
                this.$axios.get('/s/getSalesByBdId',{params:this.showDetailData}).then((res)=>{
                    if(res.status==200){
                        this.dialogTableVisible=true
                        this.saleDialogTable=res.data.msg.list
                        this.saleDialogPagination.total=res.data.msg.total
                        this.saleDialogPagination.pageSize=res.data.msg.pageSize
                        this.saleDialogPagination.pageNum=res.data.msg. pageNum
                    }
                })
            },

            followDialogHandleSizeChange(val) {
            this.followDialogPagination.pageSize=val;
                this.getInterviewDetails(this.followDetailData)
             },
            followDialogHandleCurrentChange(val) {
            this.followDialogPagination.pageNow=val;
                this.getInterviewDetails(this.followDetailData)
             },
             saleDialogHandleSizeChange(val) {
                this.saleDialogPagination.pageSize=val;
                this.initShowDetail();
             },
             saleDialogHandleCurrentChange(val) {
                this.saleDialogPagination.pageNow=val;
                this.initShowDetail();
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
                 this.formInline.startDate=this.formInline.startDate?moment(this.formInline.startDate).format('YYYY-MM-DD'):''
                 this.formInline.endDate=this.formInline.endDate?moment(this.formInline.endDate).format('YYYY-MM-DD'):''
               if(getDays(this.formInline.startDate,this.formInline.endDate)>7){
                   console.log(getDays(this.formInline.startDate,this.formInline.endDate))
                   this.$notify.error({
                       title: '错误',
                       message: '请重新选择时间范围，选取范围最多为7天！',
                       offset: 100
                   });
               }else if(this.formInline.startDate&&!this.formInline.endDate||!this.formInline.startDate&&this.formInline.endDate){
                   this.$notify.error({
                       title: '错误',
                       message: '请同时选择开始日期和结束日期！',
                       offset: 100
                   });
               }else {
                   this.initCityTable(this.tableData);
               }
		      },
		   resetForm(formName) {  //重置
		        this.$refs[formName].resetFields();
		   },
	      initCityTable(data){  //获取表格内容
              this.$loading({text:'拼命加载中'})
                 this.$axios.get('/s/countInterview',{params:data}).then((res)=>{
					this.pagination.total=res.data.msg.total;
                     this.pagination.pageNum=res.data.msg.pageNum;
                     this.pagination.pageSize=res.data.msg.pageSize;
                     this.interviewTableData=res.data.msg.list;
                     this.$loading().close()
             	})
              this.saleStatus=this.dicData.WEDDING_SALES_STATUS;
           },
            statusText(status){
                let n;
                this.saleStatus.forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            },
            objectToArray(O){
                let {keys, values, entries} = Object;
                let ary=[];
                for (let [key, value] of entries(O)) {
                    ary.push([key, value])
                }
                return ary
            },
            moment(n){
               return moment(n).calendar(null,{
                   sameDay: '[今天]',
                   nextDay: '[明天]',
                   nextWeek: 'YYYY/MM/DD',
                   lastDay: '[昨天]',
                   lastWeek: 'YYYY/MM/DD',
                   sameElse: 'YYYY/MM/DD'
               })
            },
         getInterviewDetails(data){
             this.$axios.get('/s/getInterviewDetails',{params:data}).then((res)=>{
                 this.followDialogPagination.total=res.data.msg.total;
                 this.followDialogPagination.pageNum=res.data.msg.pageNum;
                 this.followDialogPagination.pageSize=res.data.msg.pageSize;
                 this.followUpDialogTable=res.data.msg.list;
             })
         },
            showFollowDetail(row,status,activate){
                if(this.btnMsg.interviewCountDetails){
                    this.followUpDetail.bdAccount=row.bdAccount
                    if(status=='all') {
                        let dataTime = Object.keys(row.resultMap)
                        this.followUpDetail.endDate = dataTime[0]
                        this.followUpDetail.startDate = dataTime[dataTime.length - 1]
                    }else{
                        this.followUpDetail.endDate = status
                        this.followUpDetail.startDate = status
                    }
                    if(activate){
                        this.dialogFollowUpVisible=true
                        this.getInterviewDetails(this.followDetailData)
                    }

                }

            },
            form(n){
                return formatTime(Number(n))
            }
       },
        mounted(){
            this.initCityTable(this.tableData);
            this.btnMsg.interviewCountDetails=filterBtnPms(this.btnAllPms.interviewCountDetails);

        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    bdAccount:this.formInline.bdAccount,
		        	startDate:this.formInline.startDate,
		        	endDate:this.formInline.endDate}
            },
            showDetailData(){
                return{
                    "pageNow":this.saleDialogPagination.pageNow,
                    "pageSize":this.saleDialogPagination.pageSize,
                    bdId:this.SalesByBdId.bdId,
                    operatingStatus:this.SalesByBdId.status
                }
            },
            followDetailData(){
               return{
                   "pageNow":this.followDialogPagination.pageNow,
                   "pageSize":this.followDialogPagination.pageSize,
                   bdAccount:this.followUpDetail.bdAccount,
                   startDate:this.followUpDetail.startDate,
                   endDate:this.followUpDetail.endDate

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
