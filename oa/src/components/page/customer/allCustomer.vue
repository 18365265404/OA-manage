<template>
    <div>
        <div class="crumbs">
        	<div style='float:right'>
            	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm" v-if='!staticCustomer.salesId'>
            		<el-form-item label="城市:" prop='city'>
						<el-select v-model='cityNames.city' @visible-change='changeCityVisible' @change='changeCity' placeholder="请选择">
						    <el-option
						      v-for="type in storeCitys"
						      :key="type.cityCode"
		                      :label="type.cityName"
		                      :value="type.cityCode">
						    </el-option>
						</el-select>
					</el-form-item>
				</el-form>
                <el-button v-if='staticCustomer.salesId' type="primary" @click="toStaticCustomerListPage">返回统计</el-button>
            </div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>全部客户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <el-form v-if='!staticCustomer.salesId' :inline="true" :model="formInline" ref="formInline" class="demo-form-inline grayForm">
        	<el-form-item label="用户名：" prop='customerName'>
		    <el-input class='lengthInput' v-model="formInline.customerName" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item label="手机：" prop='mobile'>
		    <el-input class='lengthInput' v-model="formInline.mobile" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item label="状态：" prop='status'>
				<el-select v-model="formInline.status" clearable placeholder="请选择">
				    <el-option
				      v-for="type in storeStatus"
				      :key="type.dicDesc"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="来源：" prop='channelId'>
				<el-select v-model="formInline.channelId" clearable placeholder="请选择">
				    <el-option
				      v-for="type in channelIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-show='ByCustService' label="客服：" prop='custServiceId'>
				<el-select v-model="formInline.custServiceId" clearable placeholder="请选择">
					<el-option value="unassigned" label="未分配"></el-option>
				    <el-option
				      v-for="type in custServiceIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="销售：" prop='salesId'>
				<el-select v-model="formInline.salesId" clearable placeholder="请选择">
					<el-option value="assigned" label="已分配"></el-option>
					<el-option value="unassigned" label="未分配"></el-option>
				    <el-option
				      v-for="type in salesIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型：" prop='type'>
	            <el-select clearable v-model="formInline.type" placeholder="选择类型">
	            	<el-option value="-99" label="未分类"></el-option>
	                <el-option
	                    v-for="type in dec.data_type"
	                    :key="type.dicDesc"
	                    :label="type.dicDesc"
	                    :value="type.dicValue">
	                </el-option>
	            </el-select>
	        </el-form-item>
			<el-form-item label="起始日期：" prop='startDate'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.startDate"
			      type="date"
			      placeholder="选择日期" @change="startDateChange"
			      :picker-options="pickerOptions0">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item label="终止日期：" prop='endDate'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.endDate"
			      type="date"
			      placeholder="选择日期" @change="endDateChange"
			      :picker-options="pickerOptions0">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item label="分配开始日期：" prop='startDate'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.assignStartDate"
			      type="date"
			      placeholder="选择日期" @change="assignStartDateChange"
			      :picker-options="pickerOptions0">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item label="分配结束日期：" prop='endDate'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.assignEndDate"
			      type="date"
			      placeholder="选择日期" @change="assignEndDateChange"
			      :picker-options="pickerOptions0">
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		   <el-form-item>
			<el-button type="primary" @click="resetForm('formInline')">重置</el-button>
		  </el-form-item>
		</el-form>
        <el-row>
            <el-col>
                <el-form :inline="true" :model="assignBd" ref="assignBd">
                    <el-form-item>
                    	<el-button type="primary" @click="assignsaleHandle(1)" v-if='customerCustOut'>转客服</el-button>
                    	<el-button type="primary" @click="assignsaleHandle(2)" v-if='customerSalesOut'>转销售</el-button>
						<el-button type="primary" @click="popCusterShow" v-if='customerSalesOut'>查看客户信息统计</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

	            <el-table
	            	v-loading="loading.pageList" element-loading-text="拼命加载中"
	                ref="multipleTable"
	                :data="allCustomers"
	                border
	                tooltip-effect="dark"
	                style="width: 100%"
	                @selection-change="handleSelectionChange">
	                <el-table-column v-if='isXS' type="selection"></el-table-column>

	                <el-table-column v-if='isXS1' prop="isImportant">
	                	<template scope="scope">
	                    	<img v-show='scope.row.isImportant == 1' src="../../../../static/img/vip.png" alt="" />
	                    </template>
	                </el-table-column>
	                <el-table-column prop="customerName" label="客户"></el-table-column>

	                <el-table-column prop="mobile" label="手机">
	                	<template scope="scope">
	                    		<el-button class='btn'
	                    				type="text"
				                        size="small" @click="followUpDetails(scope.$index, scope.row,1)">
				                       {{scope.row.mobile}}
				                    </el-button>
	                    	</template>
	                </el-table-column>
	                <el-table-column prop="cityName" label="城市">
	                	<template scope="scope">
			                <div>{{cityText(scope.row.cityCode)}}</div>
			            </template>
	                </el-table-column>
	                <el-table-column prop="statusText" label="状态">
	                	<template scope="scope">
			                <div>{{statusText(scope.row.status)}}</div>
			            </template>
	                </el-table-column>
	                <el-table-column prop="type" label="类型">
	                	<template scope="scope">
			                <div>{{typeText(scope.row.type,'data_type')}}</div>
			            </template>
	                </el-table-column>
	                <el-table-column prop="channelName" label="来源"></el-table-column>
	                <el-table-column prop="createTime" label="创建时间" :formatter="formTime"></el-table-column>
	                <el-table-column prop="assignDate" label="分配时间" :formatter="formTimeAssign"></el-table-column>
	                <el-table-column prop="lastOperatingDate" label="上次操作时间" :formatter="formTime1"></el-table-column>
	                <el-table-column prop="custServiceName" label="客服"></el-table-column>
	                <el-table-column prop="salesName" label="销售"></el-table-column>
	                <el-table-column prop="creatorName" label="录入人"></el-table-column>
	                <el-table-column prop="statusText" label="跟进">
	                    	<template scope="scope">
	                    		<el-button class='btn'
	                    				type="text"
				                        size="small" @click="followUpDetails(scope.$index, scope.row, 2)">
				                       跟进详情
				                    </el-button>
	                    	</template>
	                    </el-table-column>
	                <el-table-column prop="operate" label="操作" v-if='!staticCustomer.salesId'>
	                    <template scope="scope">
	                        <div>
	                        	<p class='btn'>
	                        		<el-button v-if = 'scope.row.custServiceId !=null && customerCustOut && scope.row.status !=10' type="primary" size="small" @click="handleGrant(scope.$index, scope.row,1)">转客服</el-button>
	                        	</p>
	                            <p class='btn'>
	                            	<el-button v-if = 'scope.row.salesId !=null && customerSalesOut && scope.row.status !=10' type="primary" size="small" @click="handleGrant(scope.$index, scope.row,2)">转销售</el-button>
	                            </p>

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


		<el-dialog :title="tableDialogTitle" size='large' :visible.sync="dialogTableVisible" :before-close="closeTableDialogTitleHandle">
        	<el-form :model="changeStatus" ref='changeStatus'>
        		<div>
        			<el-form-item class='inline-form' prop='customerName' label="客户：" :label-width="formLabelWidth2">
        				<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.customerName}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.customerName" auto-complete="off"></el-input>				 	               
        			</el-form-item >
				    <el-form-item class='inline-form' prop='mobile' label="手机：" :label-width="formLabelWidth2">
				    	<span class='hiddenspan'>{{changeStatus.mobile}}</span>				        
				    </el-form-item>
				     <el-form-item class='inline-form' :label-width="formLabelWidth2">
				      <el-button v-show='!isEdit' class='btn' type="primary" @click="editHandle">编辑</el-button>
				      <el-button v-show='isEdit' class='btn' type="primary" @click="editHandle">确定</el-button>
				    </el-form-item>
				    <el-form-item class='inline-form' v-if='allCustomerVip'>
				      <el-button v-show='isimportant' class='btn' type="primary" @click="editVipHandle(1)">标记为vip</el-button>
				      <el-button v-show='!isimportant' class='btn' type="primary" @click="editVipHandle(2)">取消标记vip</el-button>
				    </el-form-item>
        		</div>
	        	<div>
        			<el-form-item class='inline-form' label="城市：" prop='cityName' :label-width="formLabelWidth2">
				    	 <span class='hiddenspan'>
				    	 	{{changeStatus.cityName}}
				    	 </span>
		        	</el-form-item >
				    <el-form-item class='inline-form' label="预算：" prop='budget' :label-width="formLabelWidth2">
				    	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.budget}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.budget" auto-complete="off"></el-input>
				    </el-form-item>
				     <el-form-item class='inline-form' label="桌数：" prop='tableNumber' :label-width="formLabelWidth2">
				     	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.tableNumber}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.tableNumber" auto-complete="off"></el-input>
				    </el-form-item>
				     <el-form-item class='inline-form' label="档期：" prop='bookingTime' :label-width="formLabelWidth2">
				     	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.bookingTime}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.bookingTime" auto-complete="off"></el-input>
				    </el-form-item>
        		</div>
        		<el-form-item  label="数据备注" :label-width="formLabelWidth2" prop='DataRemark'>
				    <el-input class='textarea' type='textarea' disabled v-model="changeStatus.DataRemark" auto-complete="off"></el-input>
		        </el-form-item>

		        <el-form-item label="跟进客服：" v-if='isShowKF && customerCustOut' prop='isShowKF' :label-width="formLabelWidth2">
				    <el-button type="primary" size="small" @click="handleGrant1(1)">转客服</el-button>
				</el-form-item>
				<el-form-item label="跟进销售：" v-if='isShowXS && customerSalesOut' prop='isShowXS' :label-width="formLabelWidth2">
				     <el-button type="primary" size="small" @click="handleGrant1(2)">转销售</el-button>
				</el-form-item>
        	</el-form >


        	<el-tabs v-model="editableTabsValue" @tab-click="handleClick">
		        <el-tab-pane
		                :key="item.name"
		                v-for="(item, index) in editableTabs"
		                :label="item.title"
		                :name="item.name"
		            >
	            <el-table :data="followDetailsTable" border>
	                <el-table-column property="createTime" label="更新时间" :formatter="formTime"></el-table-column>
	                <el-table-column property="operatorName" label="操作人" ></el-table-column>
	                <el-table-column property="source" label="操作">
	                	<template scope="scope">
		                    <div>{{statusTextHandle(scope.row.source)}}</div>
		                </template>
	                </el-table-column>
	                <el-table-column property="status" label="提交状态">
	                	<template scope="scope">
			                <div>{{statusTextHandle1(scope.row.status)}}</div>
			            </template>
	                </el-table-column>
	                <el-table-column property="source" label="图片">
	                	<template scope="scope">
	                    		<el-button class='btn'
	                    			type="text"
	                    			v-if='scope.row.commonFileList.length && scope.row.source !=4'
				                    size="small" @click="showImgDial(scope.row)">
				                       查看
				                </el-button>
				                <span v-if='!scope.row.commonFileList.length && scope.row.source !=4'>
				                	空
				                </span>
	                    	</template>
	                </el-table-column>
	                <el-table-column label="内容" width='300'>
	                  	<template scope="scope">
	                  		<span v-if='scope.row.source !=4'>{{scope.row.remark}}</span>
		                    <audio v-if='scope.row.source ==4' controls style="vertical-align: middle;width:100%">
		                        <source :src="`${QiNiuUrl}/${scope.row.audioAdress}`" type="audio/mpeg">
		                        <embed height="50" width="100" :src="`${QiNiuUrl}/${scope.row.audioAdress}`">
		                    </audio>
		                </template>
	                  </el-table-column>
	            </el-table>
                </el-tab-pane>
        	</el-tabs>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="followHandleSizeChange"
                                       @current-change="followHandleCurrentChange"
                                       :current-page="followPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="followPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="followPagination.total">>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>

		<el-dialog title="跟进详情" size='large' :visible.sync="dialogTableVisible1">
            <el-table :data="followDetailsTable" border>
                <el-table-column property="createTime" label="更新时间" :formatter="formTime"></el-table-column>
                <el-table-column property="operatorName" label="操作人" ></el-table-column>
                <el-table-column property="source" label="操作">
	                <template scope="scope">
		                <div>{{statusTextHandle(scope.row.source)}}</div>
		            </template>
	            </el-table-column>
                <el-table-column property="status" label="提交状态">
                	<template scope="scope">
		                <div>{{statusTextHandle1(scope.row.status)}}</div>
		            </template>
                </el-table-column>
                 <el-table-column property="commonFileList" label="图片">
                     <template scope="scope">
                         <el-button type="text" v-if="scope.row.commonFileList.length && scope.row.source !=4" @click="showImgDial(scope.row)">

                             查看
                         </el-button>
                        <span v-if='!scope.row.commonFileList.length && scope.row.source !=4'>
				                                空
				        </span>
                     </template>
                 </el-table-column>
                  <el-table-column label="内容" width='300'>
                  	<template scope="scope">
                  		<span v-if='scope.row.source !=4'>{{scope.row.remark}}</span>
	                    <audio v-if='scope.row.source ==4' controls style="vertical-align: middle;width:100%">
	                        <source :src="`${QiNiuUrl}/${scope.row.audioAdress}`" type="audio/mpeg">
	                        <embed height="50" width="100" :src="`${QiNiuUrl}/${scope.row.audioAdress}`">
	                    </audio>
	                </template>
                  </el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="followHandleSizeChange"
                                       @current-change="followHandleCurrentChange"
                                       :current-page="followPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="followPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="followPagination.total">>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog :visible.sync="show" size="full">
            <swiper :options="swiperOption" v-show="show" >
                <swiper-slide v-for="slide in swiperSlides"><img :src="slide" alt=""></swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>

        </el-dialog>


        <el-dialog  :title="turnOutTitle" :visible.sync="dialogFormVisible" :before-close="cancelTurnOutBtn">
			 <el-form :model='changeTurnOuts' ref = 'changeTurnOuts'>
				<el-form-item v-if='isShowKF1' label="客服：" prop='targetOperatorId' :label-width="formLabelWidth2">
				   <el-select v-model="changeTurnOuts.targetOperatorId" clearable placeholder="请选择">
				    <el-option
				      v-for="type in custServiceIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
				</el-form-item>
				<el-form-item v-if='isShowXS1' label="销售：" prop='targetOperatorId' :label-width="formLabelWidth2">
				   <el-select v-model="changeTurnOuts.targetOperatorId" clearable placeholder="请选择">
				    <el-option
				      v-for="type in salesIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="turnOutBtn('changeTurnOuts')">确定</el-button>
			    <el-button @click="cancelTurnOutBtn">取 消</el-button>
			  </div>
			</el-dialog>
			<!-- 要导出Excel的表格弹窗 -->
			
			<el-dialog  title="客户信息统计表" center :visible.sync="dialogtabExcelVisible" >
				<el-button style="margin:0 auto" type="primary" @click="exportExcel" v-show="tableExcelList.length!=0" >导出Excel表格</el-button>

				<div style="position: relative;">

					<h3 style="text-align: center; margin-bottom:20px" >您查询的日期区间：
						<el-date-picker
						v-model="excelStartDate"
						type="date"
						placeholder="选择日期" @change="excelStartDateChange"
						>
						</el-date-picker>
						 ~ 
						<el-date-picker
						v-model="excelEndDate"
						type="date"
						placeholder="选择日期" @change="excelEndDateChange"
						>
						</el-date-picker>
						<el-button style="" type="primary" @click="selectExcel"  >查询</el-button>
					</h3> 
				</div>
				<!-- <div style="text-align:center;font-size:12px;color:#F83244;line-height:30px">(最多只能查询7天数据)</div> -->
				
				<el-table
					id="out-table"
					v-loading="loading.pageExcelList" element-loading-text="拼命加载中"
					ref="multipleTable"
					:data="tableExcelList"
					tooltip-effect="dark"
					style="width: 96%;margin:0 auto"
					border
					:header-cell-style="{background:'#EEF1F6'}"
					size="small"
					>
					
				

					<el-table-column
					prop="city"
					label="城市"
					show-overflow-tooltip>
					</el-table-column>
					<el-table-column
					prop="zsj"
					label="总数据"
					show-overflow-tooltip>
					</el-table-column>
				

					<el-table-column
					prop="dqd"
					label="待确定"
					show-overflow-tooltip>
					</el-table-column>
					<el-table-column
					prop="yx"
					label="有效"
					>
					</el-table-column>

					<el-table-column
					prop="yxzwx"
					label="有效转无效"
					>
					</el-table-column>

					<el-table-column
					prop="qrwx"
					label="确认无效"
					>
					</el-table-column>

					<el-table-column
					prop="yxdd"
					label="意向到店"
					>
					</el-table-column>

					<el-table-column
					prop="ydd"
					label="已到店"
					>
					</el-table-column>

					<el-table-column
					prop="ddwx"
					label="到店无效"
					>
					</el-table-column>

					<el-table-column
					prop="yqd"
					label="已签单"
					>
					</el-table-column>

					

					
				</el-table>
			</el-dialog>
    </div>
</template>
<style scoped>
    .el-table{
        font-size: 13px;
    }
</style>
<style>

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
    .btn{
    	margin-bottom:5px
    }
    .inline-form{
    	display:inline-block
    }
    .textarea{
    	width:60%
    }
    .hiddenspan{
    	width:130px;
    	display:inline-block
    }
</style>
<script type="text/ecmascript-6">
    require('swiper/dist/css/swiper.css')
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import { mapGetters } from 'vuex';
	import {formatTime,filterBtnPms} from '../../utils/common'
	import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        data() {
            return {
				excelStartDate:"",
				excelEndDate:"",
				dialogtabExcelVisible:false, 
				tableExcelList:[],
            	isChangeCity:false,
            	dec:{
                    data_type:[],
                },
            	loading:{
					pageList:false,
					pageExcelList:false,
                    detail:false
               },
            	batchTurnOut:'',
                swiperOption: {
                    pagination : '.swiper-pagination',
                    paginationClickable :true,
                    mousewheelControl : true,
                    zoom: true,
                    zoomMax :2
                },
                swiperSlides: [],
                dialogImgVisible:false,
                imageIndex: 0,
                show:false,
            	isXS:'',
            	isXS1:'',
                citys:[],
                customerCustOut:false,
                customerSalesOut:false,
	            allCustomerVip:false,
	            ByCustService:false,
                userInfo:{},

                editableTabsValue: '1',
                cityNames:{
                	city:''
                },
                indexs:'',
                isimportant:true,
                isImportant:false,
                rows:'',
                index1:'',
                row1:'',
                storeCitys:{},
                isShowKF:'',
                isShowXS:'',
                isShowKF1:'',
                isShowXS1:'',
                formInline: {
                    customerName:'',
                    mobile: '',
                    status: '',
                    channelId:'',
                    custServiceId:'',
                    salesId:'',
                    startDate:'',
                    endDate:'',
                    type:'',
                    assignStartDate:'',
                    assignEndDate:'',
                    
                },
                storeStatus:[],
                lastOprations:[],
                channelIds:[],
                custServiceIds:[],
                salesIds:[],
                assignBd:{
                    bdId:'',
                    salesIds:'',
                    operatorId:''
                },

                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },

                allCustomers: [],
                multipleSelection: [],
                pickerOptions0: {
					
		        },
		        tableDialogTitle:'',
				dialogTableVisible:false,
				dialogTableVisible1:false,
				dialogFormVisible:false,
				formLabelWidth2:'100px',
				followDetailsTable:[],
                storeStatuValues:[],
                 weddingSelects:{},
                isEdit:false,
                radioStatus:'1',
                changeweddingTypes:'1',
                followPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                 changeStatus:{
                	customerName:'',
                	mobile:'',
                	cityName:'',
                	budget:'',
                	tableNumber:'',
                	bookingTime:'',
                	hsCustomerId:'',
                	id:'',
                	status:'',
                	salesId:'',
                	statusType:'',
                	weddingType:'',
                	planDate:''
                },
                string:'',
                turnOutTitle:'',
                changeTurnOuts:{
                	targetOperatorId:'',
                	type:'',
                	id:''
                },
                QiNiuUrl:'',
                editableTabs: [{
                    title: '所有',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: '客服',
                    name: '2',
                    content: 'Tab 2 content'
                },{
                    title: '销售',
                    name: '3',
                    content: 'Tab 3 content'
                }
                ],
                salesIds:{},
                tabData:{
                	type:''
                },
                staticCustomer:{
                    salesId:"",
                    status:'',
                    startDate:'',
                    endDate:'',
                    saveStatus:false,
                    oldStatus:''
				},
				showPages:[], //显示checkbox在哪些页面选中过
				allPageSelection:[],//所有页面选中的checkbox
            }
        },

        methods: {
			selectExcel(){
				let startTime=this.translateTime(this.excelStartDate)
				let endTime=this.translateTime(this.excelEndDate)
				if(startTime && endTime && endTime-startTime<=2000518400000 && endTime-startTime>=0){
					this.loading.pageExcelList=true
					let tableDates={
						"cityCode":this.cityNames.city,
						"customerName":this.formInline.customerName,
						"mobile":this.formInline.mobile,
						"status":this.formInline.status,
						"channelId":this.formInline.channelId,
						"custServiceId":this.formInline.custServiceId,
						"salesId":this.formInline.salesId,
						"startDate":this.excelStartDate,
						"endDate":this.excelEndDate,
						"type":this.formInline.type,
						"assignStartDate":this.formInline.assignStartDate,
						"assignEndDate":this.formInline.assignEndDate,
					}

					this.initSaleDataNew(tableDates);
					
					
				}else{
					this.$message({
						type: 'info',
						message: '请输入正确的查询区间'
					});
				}
				// console.log(endTime-startTime)
			},

			excelStartDateChange(val){
				this.excelStartDate=val
				console.log()
			},
			excelEndDateChange(val){
				this.excelEndDate=val
				console.log(this.excelEndDate)
			},

			translateTime(dateObj){
				var date = new Date(dateObj)
				// 有三种方式获取
				var times = date.getTime();
	
				return times
				
			},


        	initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
            },
            toStaticCustomerListPage(){
                this.$store.dispatch("loadingCustomerData",this.staticCustomer)
                this.$router.push({path:'/data/CustomerStatisticst', query: {
                    t: +parseInt(500*Math.random()) //保证每次点击路由的query项都是不一样的，确保会重新刷新view
                }})
            },
            startDateChange(val){
		      	this.formInline.startDate = val
		    },
		    endDateChange(val){
		      	this.formInline.endDate = val
		    },
		    assignStartDateChange(val){
		    	this.formInline.assignStartDate = val
		    },
		    assignEndDateChange(val){
		    	this.formInline.assignEndDate = val
		    },
		    editVipHandle(number){
		    	if(number == 1){
		    		this.$confirm('确定标记为vip?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				      }).then(() => {
				        	let data={
			            		 'hsCustomerId':this.rows.id,
			            		 'status':1
			            }
			            	 this.$axios.post('/customer/isImportant',data).then((res)=>{
			            	 	if(res.status == 200){
			            	 		this.isimportant = !this.isimportant ;
			            	 	}
				             })

				          this.$message({
				            type: 'success',
				            message: '成功标记为vip!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消操作'
				          });
				        });


		    	}
		    	else{
		    		this.$confirm('确定取消标记为vip?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 'hsCustomerId':this.rows.id,
			            		 'status':0
			            	}
			            	 this.$axios.post('/customer/isImportant',data).then((res)=>{
								this.isimportant = !this.isimportant
				             })

				        this.$message({
				            type: 'success',
				            message: '已成功取消标记为vip!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消操作'
				          });
				        });
		    	}

		    },
		    changeCityVisible(){
            	this.isChangeCity = true
            },
			changeCity(){
				console.log(this.tableData,"=================================")
				if(this.isChangeCity){
					this.initSaleData(this.tableData);
					this.isChangeCity = false
				}
				
				let url = ''
				let dataNew = {
					
				}
				if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey === 'DEPT:SALES'){
					url = '/s/getSalesListByUser'
					dataNew = {
						'cityCode':this.cityNames.city
					}
				}
				else{
					url = '/s/getSalesList'
					dataNew = {
						'cityCode':this.cityNames.city
					}
				}
				
	            this.$axios.post(url,dataNew).then((res4)=>{    //获取所有销售
					if(res4.data.res == '0'){
						this.salesIds = res4.data.msg;
						for(var i=0;i<this.salesIds.length;i++){
							if(this.salesIds[i].id== '-999'){
			                    this.salesIds.splice(i,1)
			                }
						}
					}
					else{
						this.salesIds = []
					}
	            })
	            
	            let cusUrl=''
	            let newData = {
	            	
	            }
	            if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:CUSTSERVICE'){
	            	cusUrl = '/s/getCustServiceListByUser'
	            	newData = {
	            		'cityCode':this.cityNames.city
	            	}
	            }
	            else{
	            	cusUrl = '/s/getCustServiceList'
	            	newData = {
	            		'cityCode':this.cityNames.city
	            	}
	            }
	            this.$axios.post(cusUrl,newData).then((res5)=>{    //获取所有客服
					if(res5.data.res == '0'){
						this.custServiceIds = res5.data.msg;
						for(var i=0;i<this.custServiceIds.length;i++){
							if(this.custServiceIds[i].id== '-999'){
				                this.custServiceIds.splice(i,1)
				            }
						}
					}
					else{
						this.custServiceIds = []
					}
	            })
                this.$axios.post('/s/getChannelList',{'cityCode':this.cityNames.city}).then((res3)=>{
					console.log("来源数据",res3)
                    if(res3.data.res == '0'){
						this.channelIds = res3.data.msg;
						for(var i=0;i<this.channelIds.length;i++){
							if(this.channelIds[i].id== '-999'){
				                this.channelIds.splice(i,1)
				            }
						}
                    }
                    else{
                    	this.channelIds = []
                    }
		        })
			},


            toggleSelection(rows) {

            },

            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initSaleData(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initSaleData(this.tableData);
            },

            initSaleData(data){
				// console.log("表单的参数",data)
            	this.storeStatus = []
            	this.lastOprations = []
            	this.loading.pageList=true
            	
		        if(filterBtnPms(this.btnAllPms.allCustomerVip)){
				//标记vip
					this.isImportant = true;
				}
				else{
					this.isImportant = false;
				}
                this.$axios.post('/customer/queryAllHsCustomerList',data).then((res)=>{
                   if(res.data.res==0){
					   	console.log("表格数据",res)

                        this.dicData.HS_CUSTOMER_STATUS.forEach((m)=>{
	                        if( m.dicStatus==0){
	                            this.storeStatus.push(m)
	                        }
	                    })
	                    this.dicData.HS_CUSTOMER_OPERATION_SOURCE.forEach((m)=>{
	                        if( m.dicStatus==0){
	                            this.lastOprations.push(m)
	                        }
	                    })
                       this.allCustomers=res.data.msg.list;
                       this.pagination.total=res.data.msg.total;
                       this.pagination.pageNum=res.data.msg.pageNum;
                       this.pagination.pageSize=res.data.msg.pageSize;
                       this.loading.pageList=false
                       this.allCustomers.forEach((n)=>{
			                if( n.salesId== null){
			                    n.salesName = '未分配';
			                }
			                if( n.custServiceId== null){
			                    n.custServiceName = '未分配';
			                }
			            })
		            	if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey === 'DEPT:SALES'){
				           	this.isXS1 = true
				           	this.isXS = false
				        }
				        else{
				            this.isXS = true
				            this.isXS1 = false
				        }

                   }
                   else{
                   		this.loading.pageList=false
                   		this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                   }
                })
			},
				// 汪老师新写的导出excel表格
				
			initSaleDataNew(data){
			
				console.log("表单的参数",data)
            	
                this.$axios.post('/customer/queryAllHsCustomerListTwo',data).then((res)=>{
					this.loading.pageExcelList=false

					
					if(res.data.msg=="服务端异常, 请稍后再试"){
						 this.tableExcelList==[]
						 alert("查询异常，请重新查询")
					}else{
						this.tableExcelList=res.data.msg
					}


					this.matchDate(res.data.msg)
					




					console.log("查询后的数据111",res.data.msg,"211312312")
					
				})
				

				


				// let pammasStr="";
				// // for(let vals in data){
				// // 	pammasList.push(vals)
				// // }
				// // pammasStr='startDate='+data.startDate+'&endDate='+data.endDate+'&channelId='+data.channelId
				
				// pammasStr = 'startDate=' + data.startDate + "&" + "endDate=" + data.endDate + "&" + "channelId=" + data.channelId
				
				// console.log("参数",pammasStr)
				// window.location.href ='http://wr.huashenghl.com/HsCustomerController/queryAllHsCustomerCount?'+pammasStr

			},

			// 整合数据

			matchDate(list){

				//             
			this.excelList=[
				{city:'北京市',allTimes:'0',bjDQD:'0',bjYX:'0',bjYXZWX:'0',bjQRWX:'0',bjYXDD:'0',bjYDD:'0',bjDDWX:'0',bjYQD:'0'},
				{city:'厦门市',allTimes:'0',bjDQD:'0',bjYX:'0',bjYXZWX:'0',bjQRWX:'0',bjYXDD:'0',bjYDD:'0',bjDDWX:'0',bjYQD:'0'},
				{city:'佛山市',allTimes:'0',bjDQD:'0',bjYX:'0',bjYXZWX:'0',bjQRWX:'0',bjYXDD:'0',bjYDD:'0',bjDDWX:'0',bjYQD:'0'},
				{city:'宁波市',allTimes:'0',bjDQD:'0',bjYX:'0',bjYXZWX:'0',bjQRWX:'0',bjYXDD:'0',bjYDD:'0',bjDDWX:'0',bjYQD:'0'},
				{city:'温州市',allTimes:'0',bjDQD:'0',bjYX:'0',bjYXZWX:'0',bjQRWX:'0',bjYXDD:'0',bjYDD:'0',bjDDWX:'0',bjYQD:'0'},
				{city:'湖州市',allTimes:'0',bjDQD:'0',bjYX:'0',bjYXZWX:'0',bjQRWX:'0',bjYXDD:'0',bjYDD:'0',bjDDWX:'0',bjYQD:'0'},
				{city:'绍兴市',allTimes:'0',bjDQD:'0',bjYX:'0',bjYXZWX:'0',bjQRWX:'0',bjYXDD:'0',bjYDD:'0',bjDDWX:'0',bjYQD:'0'},
			]
			list.map(item=>{
				
					switch (item.cityCode) {
						case '110100':
							
							item.cityName='北京市'
							this.getStatus(item.status,0)
							break;

						case '350200':
							item.cityName='厦门市'
							this.getStatus(item.status,1)
							break;

						case '440600':
							item.cityName='佛山市'
							this.getStatus(item.status,2)
							break;

						case '330200':
							item.cityName='宁波市'
							this.getStatus(item.status,3)
							break;
							
						case '330300':
							item.cityName='温州市'
							this.getStatus(item.status,4)
							break;
						
						case '330500':
							item.cityName='湖州市'
							
							this.getStatus(item.status,5)
							break;

						case '330600':
							item.cityName='绍兴市'
							this.getStatus(item.status,6)
							break;	
						default:
							break;
					}
					// excelList.push(item)
				})
				
				
			},
			// 统计状态
			getStatus(status,indexs){
				switch (status) {
					case 18: //待确定
						this.excelList[indexs].bjDQD ++;
						break;
						
					case 0: //有效
					alert()
					console.log("有效的统计",this.excelList[indexs].bjYX)
						this.excelList[indexs].bjYX ++;
						break;
						
					case 1: //有效转无效
						this.excelList[indexs].bjYXZWX ++;
						break;
						
					case 10: //确认无效
						this.excelList[indexs].bjQRWX ++;
						break;
						
					case 8: //意向到店
						this.excelList[indexs].bjYXDD ++;
						break;
						
					case 4: //已到店
						this.excelList[indexs].bjYDD  ++;
						break;
						
					case '6': //到店无效
						this.excelList[indexs].bjDDWX  ++;
						break;
						
					case '5': //已签单
						this.excelList[indexs].bjYQD  ++;
						break;
				
					default:
						break;
				}

				console.log("list",this.excelList)
			},
		
			
            getOpenCity(){
            	this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
					   	if(res2.data.res == 0){
							   console.log("9999999999999999999999",JSON.parse(localStorage.getItem("userInfo")).positionCitys)
							   this.citys =  res2.data.msg;
							//    let nullCity ={cityName: "全部城市", cityPinyin: "", cityCode: "", provinceCode: ""} 
							   let allCIty=JSON.parse(localStorage.getItem("userInfo")).positionCitys
							//    allCIty.unshift(nullCity)
	  							this.storeCitys = allCIty
	  							this.storeCitys.forEach((e)=>{
						                this.citys.forEach((n)=>{
							                if( n.cityCode==e.cityCode){
							                    e.cityName = n.cityName
							                     this.cityNames.city = this.storeCitys[0].cityCode
							                }

							            })
 
								   })
								
								
								  
						        }
						        else{
						        	alert(msg)
						        }

					   		})
            },
             cityText(data){  //城市显示
            	let cityName;
		            this.citys.forEach((n)=>{
		                if( n.cityCode==data){
		                    cityName = n.cityName
		                }

		            })
		      return cityName
            },
            statusText(data){  //状态显示
            	let statusText1;
		            this.dicData.HS_CUSTOMER_STATUS.forEach((n)=>{
		                if( n.dicValue==data){
		                    statusText1 = n.dicDesc
		                }

		            })
		      return statusText1
            },
            typeText(status,statusName){ //状态值匹配
                let n;
                this.dec[statusName].forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            },
            onSubmit(){
				this.initSaleData(this.tableData)

            },



			 editHandle(){
		    	if(this.isEdit == true){
		    		let data = {
		    			'id':this.changeStatus.id,
		    			'customerName':this.changeStatus.customerName,
		    			'mobile':this.changeStatus.mobile,
		    			'tableNumber':this.changeStatus.tableNumber,
		    			'budget':this.changeStatus.budget,
		    			'bookingTime':this.changeStatus.bookingTime,
		    		}
		    		if(this.changeStatus.bookingTime == 'null'){
		    			data.bookingTime = ''
		    		}
		    		if(this.changeStatus.tableNumber == 'null'){
		    			data.tableNumber = ''
		    		}
		    		if(this.changeStatus.budget == 'null'){
		    			data.budget = ''
		    		}
		    		this.$axios.post('/customer/updateHsCustomer',data).then((res)=>{    //获取客户所有操作集合
		  				if(res.data.res == 0){
		  					this.initSaleData(this.tableData)
		  				}
			        });
		    	}
		    	this.isEdit = !this.isEdit
		    },
		    changeselectRadioDataAll(){

		    },

		    handleGrant(index,row,number){  //转客服转销售
		    	this.dialogFormVisible = true
		    	this.batchTurnOut = false
		    	if(number == 1){
		    		this.isShowKF1 = true,
		    		this.isShowXS1 = false,
		    		this.indexs = index;
		    		this.changeTurnOuts.type = 1
		    	}
		    	else{
		    		this.isShowKF1 = false,
		    		this.isShowXS1 = true,
		    		this.indexs = index;
		    		this.changeTurnOuts.type = 0
		    	}
		    },
		    handleGrant1(number){  //转客服转销售
		    	this.dialogFormVisible = true
		    	this.batchTurnOut = false
		    	if(number == 1){
		    		this.isShowKF1 = true,
		    		this.isShowXS1 = false,
		    		this.changeTurnOuts.type = 1
		    	}
		    	else{
		    		this.isShowKF1 = false,
		    		this.isShowXS1 = true,
		    		this.changeTurnOuts.type = 0
		    	}
		    },
		    turnOutBtn(form){
		    	let data = {
		    		'hsCustomerIds':'',
		    		'targetOperatorId':this.changeTurnOuts.targetOperatorId,
		    		'type':this.changeTurnOuts.type
		    	}
		    	if(this.batchTurnOut){
		    		data.hsCustomerIds = this.string
		    	}
		    	else{
		    		data.hsCustomerIds = this.allCustomers[this.indexs].id
		    	}

		    	this.$axios.post('/customer/targetHsCustomer',data).then((res)=>{    //获取客户所有操作集合
		  				if(res.data.res == 0){
		  					this.initSaleData(this.tableData)
		  					this.$refs['changeTurnOuts'].resetFields();
		  					this.dialogFormVisible = false
		  				}
		  				else{
							this.$alert(res.data.msg, '', {
						        confirmButtonText: '确定',
						        callback: action => {

						    	}
						    });
		  				}
			        });
		    },
		    cancelTurnOutBtn(){
		    	this.$refs['changeTurnOuts'].resetFields();
		    	this.dialogFormVisible = false
		    },
		    handleSelectionChange(val) {
                this.multipleSelection=val;
                if(this.multipleSelection.length == 0){
                	this.string = ''
                }
                else if(this.multipleSelection.length == 1){
                	this.string = this.multipleSelection[0].id
                }
                else{
                	this.string = ''
                	for(var i=0;i<this.multipleSelection.length;i++){
	                	this.string = this.string + ',' + this.multipleSelection[i].id
	                }
                }
            },
			assignsaleHandle(number){  //转客服转销售
				this.batchTurnOut = true
				if(this.string == ''){
					 this.$alert('请至少选择一条客户数据', '', {
			          confirmButtonText: '确定',
			          callback: action => {

			          }
			        });
				}
				else{
					if(number == 1){
						this.isShowKF1 = true,
		    			this.isShowXS1 = false,
						this.dialogFormVisible = true;
						this.changeTurnOuts.type = 1
					}
					else{
						this.isShowKF1 = false,
		    			this.isShowXS1 = true,
						this.dialogFormVisible = true;
						this.changeTurnOuts.type = 0
					}
				}


			},

			//显示导出excel表格弹窗
			popCusterShow(){
				this.dialogtabExcelVisible=true
				this.excelStartDate=""
				this.excelEndDate=""
				this.tableExcelList=[]
				// console.log("checkbox选中的条数",this.multipleSelection,'当前的页数',this.pagination.pageNum)
				
				// console.log("所有页面的checkbox数据2",this.allPageSelection)
				
				// this.initSaleDataNew(this.tableData);

            
			},

			// // 导出Excel
				exportExcel(){

					
					 /* generate workbook object from table */
					var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
					/* get binary string as output */
					var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
					try {
						FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '客户信息统计表.xlsx')
					} catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
					return wbout

			},
					
		     statusTextHandle(data){
            	let statusName;
		            this.lastOprations.forEach((n)=>{
		                if( n.dicValue==data){
				            statusName=n.dicDesc
				        }

		            })
		      return statusName
            },
            statusTextHandle1(data){
            	let statusName;
		            this.dicData.HS_CUSTOMER_STATUS.forEach((n)=>{
		                if( n.dicValue==data){
				            statusName=n.dicDesc
				        }

		            })
		      return statusName
            },
		    handleClick(tab, event) {
		        this.editableTabsValue = tab.name;
		        let self = this;

		    	if(self.editableTabsValue == 1){
            		self.tabData.type = ''
            	}else if(self.editableTabsValue == 2){
            		self.tabData.type = 1
            	}else if(self.editableTabsValue == 3){
            		self.tabData.type = 0
            	}
		    	self.$axios({
	                url: "/customer/getHsCustomerOperationList?pageNow="+self.followPagination.pageNow+'&pageSize='+self.followPagination.pageSize+'&hsCustomerId='+self.allCustomers[self.indexs].id+'&type='+self.tabData.type,
	                method: 'post',
	                data: null,
	                transformRequest: [function (data) {
	                    let ret = ''
	                    return ret
	                }],
	                headers: {
	                    'Content-Type': 'application/json;charset=UTF-8'
	                }
	           }).then(
	                function (res) {
	                  if(res.data.res=='0'){
							self.followDetailsTable = res.data.msg.list;
							self.followPagination.total=res.data.msg.total;
                       		self.followPagination.pageNum=res.data.msg.pageNum;
                      		self.followPagination.pageSize=res.data.msg.pageSize;
                      		var audio = document.getElementsByTagName('audio')
			                for(var i=0;i<audio.length;i++){
			                    audio[i].load()
			                }
                      		
                      		
		  					res.data.msg.list.forEach((e)=>{
		  						self.lastOprations.forEach((n)=>{
				                    if( n.dicValue==e.type){
				                        e.operator=n.dicDesc
				                    }
				                })
				                self.dicData.HS_CUSTOMER_STATUS.forEach((n)=>{
			                        if( n.dicValue==e.status){
			                            e.operatorStatus=n.dicDesc
			                        }
			                    })
			                    if(e.source == 4 && e.commonFileList.length){
			                    	self.$set(e, 'audioAdress', e.commonFileList[0].address)
			                    }
			                    else{
			                    	self.$set(e, 'audioAdress', '')
			                    }
		  					})

	                  }else {
	                      alert(res.data.msg)
	                  }
	                }
	            )
		    },

			followUpDetails(index, row , number){  //手机号按钮
				let self = this;
				self.indexs = index;
				self.rows = row;
				if(row.isImportant == 1){
					this.isimportant = false
				}
				else{
					this.isimportant = true
				}
				if(row.custServiceId !=null && row.status !=10){

			        this.isShowKF = true
				}
				else{
					this.isShowKF = false
				}
				if(row.salesId !=null && row.status !=10){
					this.isShowXS = true
				}
				else{
					this.isShowXS = false
				}
				if(number == 1){
					self.dialogTableVisible = true
				}
				else{
					self.dialogTableVisible1 = true;
				}
		    	self.changeStatus.customerName = row.customerName;
		    	self.changeStatus.mobile = row.mobile;
		    	self.changeStatus.budget = row.budget;
		    	self.changeStatus.tableNumber = row.tableNumber;
		    	self.changeStatus.bookingTime = row.bookingTime;
		    	self.changeStatus.DataRemark = row.remark;
				if(row.budget == 'null'){					
					self.changeStatus.budget = ''
				}
				if(row.tableNumber == 'null'){
					self.changeStatus.tableNumber = ''
				}
				if(row.bookingTime == 'null'){
					self.changeStatus.bookingTime = ''
				}
		    	self.changeStatus.id = row.id;
		    	self.citys.forEach((n)=>{
			        if( n.cityCode==row.cityCode){
			            self.changeStatus.cityName = n.cityName
			        }
			    })



		    	if(self.editableTabsValue == 1){
            		self.tabData.type = ''
            	}else if(self.editableTabsValue == 2){
            		self.tabData.type = 1
            	}else if(self.editableTabsValue == 3){
            		self.tabData.type = 0
            	}
		    	self.$axios({
	                url: "/customer/getHsCustomerOperationList?pageNow="+self.followPagination.pageNow+'&pageSize='+self.followPagination.pageSize+'&hsCustomerId='+self.allCustomers[self.indexs].id+'&type='+self.tabData.type,
	                method: 'post',
	                data: null,
	                transformRequest: [function (data) {
	                    let ret = ''
	                    return ret
	                }],
	                headers: {
	                    'Content-Type': 'application/json;charset=UTF-8'
	                }
	           }).then(
	                function (res) {
	                  if(res.data.res=='0'){
							self.followDetailsTable = res.data.msg.list;
							self.followPagination.total=res.data.msg.total;
                       		self.followPagination.pageNum=res.data.msg.pageNum;
                      		self.followPagination.pageSize=res.data.msg.pageSize;
                      		var audio = document.getElementsByTagName('audio')
			                for(var i=0;i<audio.length;i++){
			                    audio[i].load()
			                    audio[i].addEventListener("canplaythrough",function(){
			                        audio[i].paused && (audio[i].play());
			                    },false);
			                }
		  					res.data.msg.list.forEach((e)=>{
		  						self.lastOprations.forEach((n)=>{
				                    if( n.dicValue==e.type){
				                        e.operator=n.dicDesc
				                    }
				                })
				                self.dicData.HS_CUSTOMER_STATUS.forEach((n)=>{
			                        if( n.dicValue==e.status){
			                            e.operatorStatus=n.dicDesc
			                        }
			                    })
			                    if(e.source == 4 && e.commonFileList.length){
			                    	self.$set(e, 'audioAdress', e.commonFileList[0].address)
			                    }
			                    else{
			                    	self.$set(e, 'audioAdress', '')
			                    }
		  					})
	                  }else {
	                      alert(res.data.msg)
	                  }
	                }
	            )
		    },

		    closeTableDialogTitleHandle(){
		   	    this.dialogTableVisible = false
		   	    this.isEdit = false
		   	    this.initSaleData(this.tableData);
		   	    this.$refs['changeStatus'].resetFields();

		    },


			followHandleSizeChange(val){
		    	this.followPagination.pageSize=val;
		    },
		    followHandleCurrentChange(val){
		    	this.followPagination.pageNow=val;
		    },
			formTime1(row){
				if(row.lastOperatingDate != null){
					return formatTime(row.lastOperatingDate)
				}
                else{
                	return
                }
            },
            formTime(row){
            	if(row.createTime !=null){
            		return formatTime(row.createTime)
            	}
            	else{
            		return
            	}

            },
            formTimeAssign(row){
            	if(row.assignDate !=null){
            		return formatTime(row.assignDate)
            	}
            	else{
            		return
            	}
            },
            resetForm(formName) {  //重置
		        this.$refs[formName].resetFields();
		    },
            getQiNiuUrlUsingGET(){
                this.$axios.get('/b/getQiNiuUrl').then((res2)=>{    //获取所有城市列表
                    if(res2.data.res == 0){
                        this.QiNiuUrl=res2.data.msg
                    }
                    else{
                        alert(res2.data.msg)
                    }
                })
            },
            showImgDial(row){
                this.swiperSlides=[],
                row.commonFileList.map((n)=>{
                	if(n.address.indexOf('http://') >=0){
                		this.swiperSlides.push(n.address)
                	}
                	else{
                		this.swiperSlides.push(this.QiNiuUrl+'/'+n.address)
                	}
                    
                })
                this.show = true
            },
            hideImageView(){
                this.show = false
            },
        },
        components: {
            swiper,
            swiperSlide
        },
        mounted(){
        	this.customerSalesOut=filterBtnPms(this.btnAllPms.customerSalesOut);
            this.customerCustOut=filterBtnPms(this.btnAllPms.customerCustOut);
            this.allCustomerVip=filterBtnPms(this.btnAllPms.allCustomerVip);
            this.ByCustService=filterBtnPms(this.btnAllPms.ByCustService);
            
        	this.getOpenCity()
        	this.cityNames.city = JSON.parse(localStorage.getItem("userInfo")).positionCitys[0].cityCode
                if(this.customer.salesId){
                    let data={
                        "pageNow":this.pagination.pageNow,
                        "pageSize":this.pagination.pageSize,
                        "salesId":this.customer.salesId,
                        "cityCode":this.cityNames.city,
                        "startDate":this.customer.startDate,
                        "endDate":this.customer.endDate,
                        "status":this.customer.status
                    }

                    this.initSaleData(data);
                    this.staticCustomer.salesId=this.customer.salesId
                    this.staticCustomer.startDate=this.customer.startDate
                    this.staticCustomer.endDate=this.customer.endDate
                    this.staticCustomer.status=this.customer.status
                    this.staticCustomer.saveStatus=this.customer.saveStatus
                    this.staticCustomer.oldStatus=this.customer.oldStatus
                    this.$store.dispatch("removeCustomerData")
                }else {
                    this.initSaleData(this.tableData);
                }
            this.getQiNiuUrlUsingGET()
            this.initDec()

        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    "cityCode":this.cityNames.city,
                    "customerName":this.formInline.customerName,
                    "mobile":this.formInline.mobile,
                    "status":this.formInline.status,
                    "channelId":this.formInline.channelId,
                    "custServiceId":this.formInline.custServiceId,
                    "salesId":this.formInline.salesId,
                    "startDate":this.formInline.startDate,
                    "endDate":this.formInline.endDate,
                    "type":this.formInline.type,
                    "assignStartDate":this.formInline.assignStartDate,
                    "assignEndDate":this.formInline.assignEndDate,
                    }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms',
                'customer'
            ])
        }
    }
</script>
