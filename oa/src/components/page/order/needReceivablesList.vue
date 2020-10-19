<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>待收款列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row type="flex" justify="end" v-if='btnP.needReceivablesExcel'>
            <el-col :span="3">
                <el-button  size="small" type="primary" @click="getAgreementExcel" >导出EXL</el-button>
            </el-col>
        </el-row>
        <el-form :inline="true" :model="researchNeedReceivableList" ref="researchNeedReceivableList" class="demo-form-inline">
            <el-row type="flex" justify="center" style="width: 90%;margin: 20px auto" >
                <el-col :span="9">
                    <el-form-item  prop='mobile' :label-width="researchNeedReceivableListWidth">
                        <el-input  v-model="researchNeedReceivableList.mobile" placeholder="客户电话" size="small"></el-input>
                    </el-form-item>
                    <el-form-item  prop='orderNo' :label-width="researchNeedReceivableListWidth">
                        <el-input  v-model="researchNeedReceivableList.orderNo" placeholder="订单号" size="small"></el-input>
                    </el-form-item>
                    <el-form-item  prop='partyA' :label-width="researchNeedReceivableListWidth">
                        <el-input  v-model="researchNeedReceivableList.partyA" placeholder="甲方" size="small"></el-input>
                    </el-form-item>
                    <el-form-item  prop='agreementNo' :label-width="researchNeedReceivableListWidth">
                        <el-input  v-model="researchNeedReceivableList.agreementNo" placeholder="合同号" size="small"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="researchNeedReceivableListWidth">
                        <el-select @change='changeCityHandle' v-model="researchNeedReceivableList.cityCode" placeholder="城市" size="small">
                            <el-option
                                v-for="item in storeCitys"
                                :key="item.cityCode"
                                :label="item.cityName"
                                :value="item.cityCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item  prop='dateTimeStart' :label-width="researchNeedReceivableListWidth">
                        <div class="block">
                            <el-date-picker
                                v-model="researchNeedReceivableList.dateTimeStart"
                                type="date"
                                :editable="false"
                                placeholder="收款起始日期"
                                format="yyyy-MM-dd"
                                :picker-options="pickerBeginDateBefore"
                                size="small"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item  prop='dateTimeStop' :label-width="researchNeedReceivableListWidth">
                        <el-tooltip class="item" effect="dark" content="终止日期为60天以内" placement="top-end">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchNeedReceivableList.dateTimeStop"
                                    type="date"
                                    :editable="false"
                                    placeholder="收款结束日期"  format="yyyy-MM-dd"
                                    :picker-options="pickerBeginDateAfter"
                                    size="small"
                                >
                                </el-date-picker>
                            </div>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item  prop="fundsType">
                        <el-select v-model="researchNeedReceivableList.fundsType" placeholder="收款项" size="small">
                            <el-option
                                v-for="item in dec.funds_type"
                                :key="item.dicDesc"
                                :label="item.dicDesc"
                                :value="item.dicValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop="agreementStatus">
                        <el-select v-model="researchNeedReceivableList.agreementStatus" placeholder="合同状态" size="small">
                            <el-option
                                v-for="item in dec.agreement_status"
                                :key="item.dicDesc"
                                :label="item.dicDesc"
                                :value="item.dicValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label-width="researchNeedReceivableListWidth" prop="hallId">
                        <el-select  size="small" v-model="researchNeedReceivableList.hallId" placeholder="宴会厅">
                            <el-option v-for="hall in hallList"
                                       :key="hall.id"
                                       :label="hall.hallName"
                                       :value="hall.id">

                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop='scheduleTime' :label-width="researchNeedReceivableListWidth">
                        <div class="block">
                            <el-date-picker
                                v-model="researchNeedReceivableList.scheduleTime"
                                type="date"
                                :editable="false"
                                placeholder="档期"
                                format="yyyy-MM-dd"
                                size="small"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-button size="small" type="primary" @click="submitNeedReceivableList">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  size="small" type="primary" @click="resetForm('researchNeedReceivableList')">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="NeedReceivableList" border style="width: 100%" v-loading="loading.pageList" element-loading-text="拼命加载中">
            <el-table-column prop="mobile" label="客户联系方式" ></el-table-column>
            <el-table-column prop="partyA" label="甲方名称" >
            </el-table-column>
            <el-table-column prop="orderType" label="类型"  >
                <template scope="scope">
                    {{statusText(scope.row.orderType,'data_type')}}
                </template>
            </el-table-column>
            <el-table-column prop="scheduleTime" label="档期">
                <template scope="scope">
                    {{formTime1(scope.row.scheduleTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="hallName" label="宴会厅" >
            </el-table-column>
            <el-table-column prop="type" label="收款项" >
                <template scope="scope">
                    {{statusText(scope.row.type,'funds_type')}}
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="收款金额" >
            </el-table-column>
            <el-table-column prop="lastPaymentTime" label="最晚收款日期" >
                <template scope="scope">
                    {{formTime1(scope.row.lastPaymentTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="操作">
                <template scope="scope">
                    <el-button size="mini" type="primary" v-show='scope.row.receiptType==0 &&  btnP.needReceivablesReceipt' @click="writeReceipt(scope.row,0)">开收据</el-button>
                    <el-button size="mini" type="primary" v-show='scope.row.receiptType==1 &&  btnP.needReceivablesReceipt' @click="writeReceipt(scope.row,1)">补开收据</el-button>
                    <el-button size="mini" type="primary"  v-show="scope.row.type==2 && scope.row.receiptType==0 &&  btnP.needReceivablesCancelContract" @click='cancelOrder(scope.row)'>撤销合同</el-button>
                </template>

            </el-table-column>
            <el-table-column prop="customerName" label="合同详情" >
                <template scope="scope">
					<el-button size="mini" type="primary" @click="checkDetailsRow(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
            <el-table-column  label="财务详情" v-if='btnP.needReceivablesShowMoneyDetails'>
                <template scope="scope">
                    <el-button size="mini" type="primary" @click="rowFinanceDetail(scope.row)">财务详情</el-button>
                </template>
            </el-table-column>
            <el-table-column label="变更明细" v-if='btnP.needReceivablesAuditRecord'>
                <template scope='scope'>
                    <el-button size="mini" type="info" @click="shenghejiluRow(scope.row)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column  label="优惠明细" v-if='btnP.needReceivablesShowMoneyDetails'>
                <template scope="scope">
                    <el-button size="mini" type="primary" @click="rowDiscountHandle(scope.row)">优惠明细</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col>
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
        <el-dialog title="优惠明细" :visible.sync="discountListVisible">
            <el-table :data="discountData" border style="width: 100%">
	            <el-table-column prop="amount" label="金额"></el-table-column>
	            <el-table-column prop="reviewStatus" label="审核状态">
	                <template scope="scope">
			            {{statusText(scope.row.reviewStatus,'review_status')}}
			        </template>
	            </el-table-column>
	            <el-table-column prop="remark" label="备注"></el-table-column>
	        </el-table>
        </el-dialog>
        <el-dialog  :title="writeReceiptVisibleTitle" :visible.sync="writeReceiptVisible" :before-close='cancelSubmitReceiptMethodsHandle'>
            <el-form :model='writeReceiptsData' ref="writeReceiptsData" :rules='writeReceiptsRule'>
                <el-form-item v-show='writeReceiptNumber === 0' prop='receiptNo' label="填写收据编号" :label-width="formLabelWidth" >
                    <el-input :maxlength='50' size="small" v-model='writeReceiptsData.receiptNo'></el-input>
                </el-form-item>
                <el-form-item v-show='writeReceiptNumber === 1' prop='receiptNo' :label-width="formLabelWidth" >
                    <span>{{writeReceiptsData.receiptNo}}</span>
                </el-form-item>
                <el-form-item prop='receiptArray' label="" :label-width="formLabelWidth">
                    <el-row>
                        <el-col :span="20">
                            <el-row type="flex" justify="start" v-for="(item,index) in cols" style="margin-bottom: 10px">
                                <el-col :span="8">
                                    <el-select clearable v-model='writeReceiptsData.receiptArray[index].type' @change='paymentMethodHandle(index)' size="small"  placeholder="付款方式">
                                        <el-option
                                            v-for="type in item.paymentMethods"
                                            :key="type.dicDesc"
                                            :label="type.dicDesc"
                                            :value="type.dicValue">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="8">
                                	<el-select clearable v-model='writeReceiptsData.receiptArray[index].id' size="small" @change='changePaymentThings(index)' placeholder="付款方式明细">
                                		<el-option
                                            v-for="type in item.paymentMethodThings"
                                            :key="type.paymentDetail"
                                            :label="type.paymentDetail"
                                            :value="type.id">
                                        </el-option>
                               		</el-select>
                                </el-col>
                                <el-col :span="7"> <el-input :disabled='writeReceiptsData.receiptArray[index].canChangeMoney' v-model='writeReceiptsData.receiptArray[index].money' :maxlength='50' size="small" placeholder="金额" ></el-input></el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" size="mini" icon="plus" @click="plusRow"></el-button>
                            <el-button v-show="cols.length>1" type="primary" size="mini" icon="minus" @click="delRow"></el-button>
                        </el-col>
                    </el-row>


                </el-form-item>
                <el-form-item v-show='writeReceiptNumber === 0' prop='remark' :label-width="formLabelWidth">
                    <el-input
                        type="textarea" v-model='writeReceiptsData.remark'
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                       >
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click='submitReceiptMethodsHandle("writeReceiptsData")'>确定</el-button>
                <el-button type="primary" @click="receiptView">预览</el-button>
                <el-button type="primary" v-if='btnP.needReceivablesReceiptPrint' @click="receiptPrint">打印</el-button>
                <el-button type="primary" @click='cancelSubmitReceiptMethodsHandle'>返回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="变更明细"  :visible.sync="shenghejiluVisible" >
            <el-table  border style="width: 100%" :data="shenghejiluTable">
                <el-table-column prop="type" label="审核事项" width="120px">
                    <template scope="scope">
                        {{statusText(scope.row.type,'HS_REVIEW_TYPE')}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="审核内容"></el-table-column>
                <el-table-column prop="checkTime" label="审核时间" width="120px">
                    <template scope="scope">
                        {{formTime1(scope.row.checkTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="checkStatus" label="审核状态" width="120px">
                    <template scope="scope">
                        {{statusText(scope.row.checkStatus,'VERIFY_STATUS')}}
                    </template>
                </el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col>
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="shenghehandleSizeChange"
                                       @current-change="shenghehandleCurrentChange"
                                       :current-page="shenghePagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="shenghePagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="shenghePagination.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>

        </el-dialog>
        <el-dialog  title="财务详情" :visible.sync="rowFinanceDetailVisible" :before-close="closeFinanceDetail">
            <h2>收款情况</h2>
            <el-row class="financeList">
                <el-col v-show="hsTypeFundsList1.length"><span>已收{{hsTypeFundsList1.length?hsTypeFundsList1[0].type?'小定':'意向金':''}}：{{hsTypeFundsList1.length?hsTypeFundsList1[0]['amount']:''}}</span></el-col>
                <el-col v-show="hsTypeFundsList1.length" style="margin-bottom:20px">
                    <el-table :data="hsTypeFundsList1" border style="width: 100%">
                        <el-table-column prop="amount" label="已收金额" >
                        </el-table-column>
                        <el-table-column prop="paymentStatus" label="收款状况" >
                            <template scope="scope">
                                {{statusText(scope.row.paymentStatus,'agreement_funds_payment_status')}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="receivedName" label="收款人" >
                        </el-table-column>
                        <el-table-column prop="receiptName" label="开据人" >
                        </el-table-column>
                        <el-table-column prop="receiptTime" label="开据时间" >
                            <template scope="scope">
                                {{formTime1(scope.row.receivedTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="confirmorName" label="确认人" >
                        </el-table-column>

                        </el-table>

                </el-col>
            </el-row>
            <el-row class="financeList">
                <el-col style="margin-bottom:10px">
                    <span>总金额: {{FinanceDetailList.totalAmount}}</span>
                    <span>未收金额: {{FinanceDetailList.dueAmount}} </span>
                    <span>已收金额: {{FinanceDetailList.receivedAmount}}</span>
                    <span>确认金额: {{FinanceDetailList.confirmAmount}}</span>
                </el-col>
                <el-col style="margin-bottom:20px">
                    <el-table :data="hsTypeFundsList2" border style="width: 100%">
                        <el-table-column prop="type" label="付款项目" >
                            <template scope="scope">
                                {{statusText(scope.row.type,'agreement_funds_type')}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="percentage" label="付款百分比(%)" >
                        </el-table-column>
                        <el-table-column prop="amount" label="付款金额"  >
                        </el-table-column>
                        <el-table-column prop="lastPaymentTime" label="约定最晚付款时间">
                            <template scope="scope">
                                {{formTime1(scope.row.lastPaymentTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="scheduleTime" label="约定付款表述" >
                            <template scope="scope">
                                {{PaymentTimeToLastTime(scope.row)}}
                                </template>
                        </el-table-column>
                        <el-table-column prop="paymentStatus" label="收款状况" >
                            <template scope="scope">
                                {{statusText(scope.row.paymentStatus,'agreement_funds_payment_status')}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col v-show='hsAgrFundsReceiptList.length' style="margin-bottom:20px">
                    <el-table :data="hsAgrFundsReceiptList" border style="width: 100%">
                        <el-table-column prop="receiptNo" label="收据编号" ></el-table-column>
                        <el-table-column prop="amount" label="金额" >
                        </el-table-column>
                        <el-table-column prop="receivedName" label="收款人"  >

                        </el-table-column>
                        <el-table-column prop="receiptName" label="开据人">

                        </el-table-column>
                        <el-table-column prop="receiptTime" label="开据时间" width="120px" >
                            <template scope="scope">
                                {{formTime1(scope.row.receiptTime)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="upReceiptName" label="补开据人" >
                        </el-table-column>
                        <el-table-column prop="receiptRemark" label="开据详情" width="200px">
                        </el-table-column>
                        <el-table-column prop="confirmorName" label="确认人" >
                        </el-table-column>
                    </el-table>


                </el-col>
            </el-row>
            <el-row class="financeList">
                <el-col>
                    <span>发票类型：{{statusText(FinanceDetailList.invoiceType,'payment_invoice_type')}}</span>
                    <span>备注：{{FinanceDetailList.invoiceRemark}}</span>
                </el-col>
            </el-row>
            </el-dialog>

        <el-dialog :title="hsOrderDialogTitle" size='large' :visible.sync="dialogNewContract" :before-close='closeDialogNewContract'>
           <div>
           		<el-form :model="hsOrderDetailList">
	                <div>
	                    <el-form-item class='inline-form' prop='status' label="订单状态：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{statusText(hsOrderDetailList.status,'order_status')}}</span>
	                    </el-form-item >
	                </div>
	                <div>
	                    <el-form-item class='inline-form' prop='orderNo' label="订单号：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.orderNo}}</span>
	                    </el-form-item >
	                    <el-form-item class='inline-form' prop='intentionStatus' label="订单意向：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{statusText(hsOrderDetailList.intentionStatus,'order_type')}}</span>
	                    </el-form-item>
	                    <el-form-item class='inline-form' prop='agreementNo' label="合同号：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.agreementNo}}</span>
	                    </el-form-item>
	                    <el-form-item class='inline-form' prop='type' label="订单类型：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{statusText(hsOrderDetailList.type,'data_type')}}</span>
	                    </el-form-item>
	                </div>
	                <div>
	                    <el-form-item class='inline-form' prop='customerName' label="客户：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.customerName}}</span>
	                    </el-form-item >
	                    <el-form-item class='inline-form' prop='mobileNumber' label="客户电话：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.mobileNumber}}</span>
	                    </el-form-item>
	                    <el-form-item class='inline-form' prop='partyA' label="甲方名称：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.partyA}}</span>
	                    </el-form-item>
	                    <el-form-item class='inline-form' prop='creatorName' label="创建人：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.creatorName}}</span>
	                    </el-form-item>
	                </div>
	                <div>
	                    <el-form-item class='inline-form' prop='scheduleStatus' label="档期状态：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{statusText(hsOrderDetailList.scheduleStatus,'schedule_status')}}</span>
	                    </el-form-item >
	                    <el-form-item class='inline-form' prop='retainDays' label="保留天数：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.retainDays}}</span>
	                    </el-form-item>
	                </div>
	                 <div>
	                    <el-form-item class='inline-form' prop='storeName' label="门店：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.hsSchedule.storeName}}</span>
	                    </el-form-item >
	                    <el-form-item class='inline-form' prop='banquetHallList' label="宴会厅：" :label-width="hetongDetailsWidth">
	                        <span >{{hallListText(hsOrderDetailList.hsSchedule.banquetHallList)}}</span>
	                    </el-form-item>
	                    <el-form-item class='inline-form' prop='scheduleTime' label="档期：" :picker-options="pickerOptions0" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{hsOrderDetailList.hsSchedule.scheduleTime}}</span>
	                    </el-form-item>
	                    <el-form-item class='inline-form' prop='orderNo' label="场次：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{statusText(hsOrderDetailList.hsSchedule.scheduleTimeType,'schedule_time_type')}}</span>
	                    </el-form-item>
	                </div>
	                <div>
	                    <el-form-item class='inline-form' prop='orderNo' label="合同状态：" :label-width="hetongDetailsWidth">
	                        <span class='hiddenspan'>{{statusText(hsOrderDetailList.agreementStatus,'agreement_status')}}</span>
	                    </el-form-item >
	                </div>
	                <div>
	                </div>
	            </el-form>
           </div>
                <div v-show='isHaveAggrement'>
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="基本信息" name="1">
                        	<el-form class='newContractBox' :model='createEssentialInformations' ref='createEssentialInformations'>
                            <div>
                               <el-form-item class='inline-form' prop='schedule'>
                            		<div class="block">
                               			 <el-date-picker
                                    		v-model="createNewContracts.schedule"
                                    		type="date"
                                   			 placeholder="档期" disabled
                                    		:picker-options="pickerOptions0">
                                		</el-date-picker>
                            		</div>
                       		 	</el-form-item>
                       			 <el-form-item class='inline-form' prop='screenings'>
                           			 <el-select clearable disabled v-model="createNewContracts.screenings" placeholder="场次">
                                		<el-option
                                    		v-for="item in dec.schedule_time_type"
                                    		:key="item.dicValue"
                                   		    :label="item.dicDesc"
                                   		    :value="item.dicValue">
                               		    </el-option>
                            	    </el-select>
                        	   </el-form-item>
                            </div>
                            <div>
                                 <el-form-item prop='banquetHall'>
                            		 <el-select disabled v-model="createNewContracts.banquetHall" :multiple-limit='3' multiple placeholder="宴会厅">
                                		<el-option
                                  		 	v-for="item in banquetHalls"
                                    		:key="item.id"
                                   			:label="item.hallName"
	                                   		:value="item.id">
                                  		</el-option>
                            		</el-select>
                       			 </el-form-item>
                            </div>
                            <div>
                                <div class='inline-form totalAmount'>
                                    <span>合计金额:</span><span>{{createAllAcount}}</span>
                                </div>
                                <div class='inline-form'>
                                    <span>合同金额:</span><span>{{createAllAcount}}</span>
                                </div>
                            </div>

                            <div v-show='isWeddingType'>
                                <div>
                                    <el-form-item class='inline-form inline-form1' label="新郎姓名：" prop='groomName'>
                                        <el-input disabled class='hiddenspan1' v-model="createEssentialInformations.groomName" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新郎联系手机：' prop='groomMobile'>
                                        <el-input disabled class='hiddenspan1' v-model="createEssentialInformations.groomMobile" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新郎联系地址：' prop='groomAddress'>
                                        <el-input disabled class='hiddenspan1' v-model="createEssentialInformations.groomAddress" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item class='inline-form inline-form1' label='新娘姓名：' prop='brideName'>
                                        <el-input disabled class='hiddenspan1' v-model="createEssentialInformations.brideName" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新娘联系手机：'  prop='brideMobile'>
                                        <el-input disabled class='hiddenspan1' v-model="createEssentialInformations.brideMobile" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新娘联系地址：' prop='brideAddress'>
                                        <el-input disabled class='hiddenspan1' v-model="createEssentialInformations.brideAddress" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item class='inline-form inline-form1' label='甲方：' prop='partyA'>
                                        <el-input disabled class='hiddenspan2' v-model="createEssentialInformations.partyA" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='甲方身份证：' prop='partyAId'>
                                        <el-input disabled class='hiddenspan1' v-model="createEssentialInformations.partyAId" auto-complete="off"></el-input>
                                    </el-form-item >
                                </div>

                            </div>
                        </el-form>
                        <div v-show='!isWeddingType'>
                            <el-form :model="createEssentialInformations1" ref='createEssentialInformations1'>
	                            <div>
	                                <el-form-item class='inline-form inline-form1' label="甲方：" prop='partyA'>
	                                    <el-input disabled class='hiddenspan1' v-model="createEssentialInformations1.partyA" auto-complete="off"></el-input>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='甲方联系人：' prop='partyAContacts'>
	                                    <el-input disabled class='hiddenspan1' v-model="createEssentialInformations1.partyAContacts" auto-complete="off"></el-input>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='联系人手机号：' prop='partyAMobile'>
	                                    <el-input disabled class='hiddenspan1' v-model="createEssentialInformations1.partyAMobile" auto-complete="off"></el-input>
	                                </el-form-item>
	                            </div>
	                            <div>
	                                <el-form-item class='inline-form inline-form1' label='乙方联系人：' prop='partyBContacts'>
	                                    <el-input disabled class='hiddenspan1' v-model="createEssentialInformations1.partyBContacts" auto-complete="off"></el-input>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='乙方联系人手机：'  prop='partyBMobile'>
	                                    <el-input disabled class='hiddenspan1' v-model="createEssentialInformations1.partyBMobile" auto-complete="off"></el-input>
	                                </el-form-item >
	                            </div>
	                            <div>
	                                <el-form-item class='inline-form inline-form1' label='开始时间：' prop='startTime'>
	                                  <el-time-select
									    placeholder="开始时间"
									    disabled class='hiddenspan1'
									    v-model="createEssentialInformations1.startTime"
									    format='HH:mm'
									    :picker-options="{
									      start: '00:00',
									      step: '00:05',
									      end: '23:55'
									    }">
									  </el-time-select>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='结束时间：' prop='endTime'>
	                                     <el-time-select
										  	disabled class='hiddenspan1'
										    placeholder="结束时间"
										    v-model="createEssentialInformations1.endTime"
										    format='HH:mm'
										    :picker-options="{
										      start: '00:00',
										      step: '00:05',
										      end: '23:55'
										    }">
										  </el-time-select>
	                                </el-form-item >
	                            </div>
							</el-form>
						</div>
                    </el-tab-pane>
                    <el-tab-pane label="价格内容" name="2">
                            <el-form :model="createPriceContents" ref='createPriceContents'>
                                <el-form-item class='inline-form' label='套系' prop='hsPackageId' :label-width="formLabelWidth">
                                    <el-select disabled style='width:250px' clearable  v-model="createPriceContents.hsPackageId" placeholder="请选择套系">
                                        <el-option
                                            v-for="item in newCreateContractsets"
                                            :key="item.id"
                                            :label="item.packageName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class='inline-form' label='预计桌数' prop='estimateTableNumber' :label-width="formLabelWidth">
                                    <el-input disabled type='number' placeholder='0' v-model="createPriceContents.estimateTableNumber"  auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item v-show='!isWeddingType' class='inline-form' label='保证桌数' prop='tableNumber' :label-width="formLabelWidth">
	                                <el-input disabled type='number' placeholder='0' v-model="createPriceContents.tableNumber" auto-complete="off"></el-input>
	                            </el-form-item>
	                            <el-form-item v-show='!isWeddingType' class='inline-form' label='餐桌形式' prop='diningTableForm' :label-width="formLabelWidth">
	                                <el-select disabled clearable v-model="createPriceContents.diningTableForm" placeholder="请选择餐桌形式">
	                                    <el-option
	                                        v-for="item in createTableForms"
	                                        :key="item.dicValue"
	                                        :label="item.dicDesc"
	                                        :value="item.dicValue">
	                                    </el-option>
	                                </el-select>
	                            </el-form-item>
                            </el-form>



                            <div>
                                <p class='tableTitle'>服务内容</p>
                                <el-table style='width: 100%' :data="hsPackageServiceItemList" border>
                                    <el-table-column property="name" label="名称"></el-table-column>
                                    <el-table-column property="content" label="内容"></el-table-column>
                                    <el-table-column property="quantity" v-if='createNewContracts.type != 1' label="数量" ></el-table-column>
                                    <el-table-column property="unit" v-if='createNewContracts.type != 1' label="单位"></el-table-column>
                                    <el-table-column property="unitPrice" v-if='createNewContracts.type != 1' label="单价"></el-table-column>
                                    <el-table-column property="totalAmount" v-if='createNewContracts.type != 1' label="总价"></el-table-column>
                                </el-table>
                            </div>
                            <div>

                                <p class='tableTitle'>项目</p>
                                <el-table style='width: 100%' :data="hsPackageItemList" border>
                                    <el-table-column property="name" v-if='createNewContracts.type != 1' label="名称"></el-table-column>
                                    <el-table-column property="content" label="内容" ></el-table-column>
                                    <el-table-column property="creatorName" v-if='createNewContracts.type != 1' label="添加人"></el-table-column>
                                    <el-table-column property="quantity" label="数量"></el-table-column>
                                    <el-table-column property="unit" label="单位"></el-table-column>
                                    <el-table-column property="unitPrice" label="单价"></el-table-column>
                                    <el-table-column property="totalAmount" label="总价"></el-table-column>
                                </el-table>
                            </div>
                            <div v-show='isNotMetting'>
                                <p class='tableTitle'>补充事项</p>
                                <el-table style='width: 100%' :data="createSupplementaryItems" border>
	                                <el-table-column property="content" label="内容"></el-table-column>
	                            </el-table>

                            </div>
                            <p style='text-align: right;margin-top:30px;font-weight:bold'>
                                <span>当前合同总金额:</span><span class='allAcount'>{{createAllAcount}}</span>
                            </p>
                        </el-tab-pane>
                        <el-tab-pane label="财务详情" name="3">
                            <h2>收款情况</h2>
				            <el-row class="financeList">
				                <el-col v-show="hsTypeFundsList1.length"><span>已收{{hsTypeFundsList1.length?hsTypeFundsList1[0]['type']?'小定':'意向金':''}}：{{hsTypeFundsList1.length?hsTypeFundsList1[0]['amount']:''}}</span></el-col>
				                <el-col v-show="hsTypeFundsList1.length" style="margin-bottom:20px">
				                    <el-table :data="hsTypeFundsList1" border style="width: 100%">
				                        <el-table-column prop="amount" label="已收金额" >
				                        </el-table-column>
				                        <el-table-column prop="paymentStatus" label="收款状况" >
				                            <template scope="scope">
				                                {{statusText(scope.row.paymentStatus,'agreement_funds_payment_status')}}
				                            </template>
				                        </el-table-column>
				                        <el-table-column prop="receivedName" label="收款人" >
				                        </el-table-column>
				                        <el-table-column prop="receiptName" label="开据人" >
				                        </el-table-column>
				                        <el-table-column prop="receiptTime" label="开据时间" >
				                            <template scope="scope">
				                                {{formTime1(scope.row.receivedTime)}}
				                            </template>
				                        </el-table-column>
				                        <el-table-column prop="confirmorName" label="确认人" >
				                        </el-table-column>

				                        </el-table>

				                </el-col>
				            </el-row>
				            <el-row class="financeList">
				                <el-col style="margin-bottom:10px">
				                    <span>总金额: {{FinanceDetailList.totalAmount}}</span>
				                    <span>未收金额: {{FinanceDetailList.dueAmount}} </span>
				                    <span>已收金额: {{FinanceDetailList.receivedAmount}}</span>
				                    <span>确认金额: {{FinanceDetailList.confirmAmount}}</span>
				                </el-col>
				                <el-col style="margin-bottom:20px">
				                    <el-table :data="hsTypeFundsList2" border style="width: 100%">
				                        <el-table-column prop="type" label="付款项目" >
				                            <template scope="scope">
				                                {{statusText(scope.row.type,'agreement_funds_type')}}
				                            </template>
				                        </el-table-column>
				                        <el-table-column prop="percentage" label="付款百分比(%)" >
				                        </el-table-column>
				                        <el-table-column prop="amount" label="付款金额"  >
				                        </el-table-column>
				                        <el-table-column prop="lastPaymentTime" label="约定最晚付款时间">
				                            <template scope="scope">
				                                {{formTime1(scope.row.lastPaymentTime)}}
				                            </template>
				                        </el-table-column>
				                        <el-table-column prop="scheduleTime" label="约定付款表述" >
				                            <template scope="scope">
				                                {{PaymentTimeToLastTime(scope.row)}}
				                                </template>
				                        </el-table-column>
				                        <el-table-column prop="paymentStatus" label="收款状况" >
				                            <template scope="scope">
				                                {{statusText(scope.row.paymentStatus,'agreement_funds_payment_status')}}
				                            </template>
				                        </el-table-column>
				                    </el-table>
				                </el-col>
				                <el-col v-show='hsAgrFundsReceiptList.length' style="margin-bottom:20px">
				                    <el-table :data="hsAgrFundsReceiptList" border style="width: 100%">
				                        <el-table-column prop="receiptNo" label="收据编号" ></el-table-column>
				                        <el-table-column prop="amount" label="金额" >
				                        </el-table-column>
				                        <el-table-column prop="receivedName" label="收款人"  >

				                        </el-table-column>
				                        <el-table-column prop="receiptName" label="开据人">

				                        </el-table-column>
				                        <el-table-column prop="receiptTime" label="开据时间" >
				                            <template scope="scope">
				                                {{formTime1(scope.row.receiptTime)}}
				                            </template>
				                        </el-table-column>
				                        <el-table-column prop="upReceiptName" label="补开据人" >
				                        </el-table-column>
				                        <el-table-column prop="receiptRemark" label="开据详情" width="200px">
				                        </el-table-column>
				                        <el-table-column prop="confirmorName" label="确认人" >
				                        </el-table-column>
				                    </el-table>


				                </el-col>
				            </el-row>
				            <el-row class="financeList">
				                <el-col>
				                    <span>发票类型：{{statusText(FinanceDetailList.invoiceType,'payment_invoice_type')}}</span>
				                    <span>备注：{{FinanceDetailList.invoiceRemark}}</span>
				                </el-col>
				            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="打印" name="4">
                            <el-table style='width: 100%' :data="followDetailsTable" border>
                                <el-table-column property="type" label="项目"></el-table-column>
                                <el-table-column property="operatorName" label="内容" ></el-table-column>
                                <el-table-column property="createTime" label="最新修改时间" :picker-options="pickerOptions0"></el-table-column>
                                <el-table-column property="operatorStatus" label="操作">
                                	<template scope="scope">
                                        <el-button type='text' @click="previewTemplate(scope.row)" >预览</el-button>
                                        <el-button type='text' @click="printTemplate(scope.row)" >打印</el-button>
							        </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="btmVisible" size='full' :before-close="pageClose">
            <component :is="componentName" :hsOrderId="printHsOrderId" :isPrintPage='isPrintPage' :paymentRows="paymentRows" :writeReceiptsData="writeReceiptsData"></component>
        </el-dialog>
    </div>
</template>
<style>
    .financeList span{
        display: inline-block;
        margin-right:15px;
        font-size: 18px;
        min-width: 140px;
    }
</style>

<script type="text/ecmascript-6">
    import babyAgreementStencil from '../printPreviewList/babyAgreementStencil.vue'
    import babyAgreementChangeStencil from '../printPreviewList/babyAgreementChangeStencil.vue'
    import babyAndMeetCancelStencil from '../printPreviewList/babyAndMeetCancelStencil.vue'
    import babyEOStencil from '../printPreviewList/babyEOStencil.vue'
    import babyServiceItemStencil from '../printPreviewList/babyServiceItemStencil.vue'
    import babyFinalQuotationStencil from '../printPreviewList/babyFinalQuotationStencil.vue'
    import delayChangeStencil from '../printPreviewList/delayChangeStencil.vue'
    import quotationListStencil from '../printPreviewList/quotationListStencil.vue'
    import receiptStencil from '../printPreviewList/receiptStencil.vue'
    import seanceAgreementChangeStencil from '../printPreviewList/seanceAgreementChangeStencil.vue'
    import seanceAgreementStencil from '../printPreviewList/seanceAgreementStencil.vue'
    import seanceEOStencil from '../printPreviewList/seanceEOStencil.vue'
    import seanceFinalQuotationStencil from '../printPreviewList/seanceFinalQuotationStencil.vue'
    import weddingAgreementStencil from '../printPreviewList/weddingAgreementStencil.vue'
    import weddingCancelStencil from '../printPreviewList/weddingCancelStencil.vue'
    import weddingChangeStencil from '../printPreviewList/weddingChangeStencil.vue'
    import weddingEOStencil from '../printPreviewList/weddingEOStencil.vue'
    import weddingFinalQuotationStencil from '../printPreviewList/weddingFinalQuotationStencil.vue'
    import weddingServiceTimeStencil from '../printPreviewList/weddingServiceTimeStencil.vue'
    import  moment from 'moment'
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
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

    export default{
        data(){
            return {
            	discountListVisible:false,
            	discountData:[],
                loading:{
                    pageList:false,
                    detail:false
                },
            	moneyIsOk:'',
            	writeReceiptNumber:'',
            	writeReceiptVisibleTitle:'',
                cols:[
                    {
                    	"paymentMethods":[],
                    	"paymentMethodThings":[]
                    }
                ],
                paymentRows:{},
                receiptsDataList:[],
                receiptsDataList0:[],
                writeReceiptsData:{
                	receiptNo:'',
                	remark:'',
                	receiptArray:[
	                	{
							type:'',
							id:'',
							money:'',
							canChangeMoney:false
						}
                	]
                },
                writeReceiptsRule:{
					 receiptNo: [
			            { required: true, message: '请填写收据编号', trigger: 'blur' }
			          ]
                },
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                NeedReceivableList:[],
                researchNeedReceivableList:{
                    cityCode:'',
                    fundsType:'',
                    agreementStatus:'',
                    hallId:'',
                    scheduleTime:'',
                    partyA:'',
                    mobile:'',
                    agreementNo:'',
                    orderNo:'',
                    dateTimeStart:'',
                    dateTimeStop:''
                },
                openCity:[],
                storeCitys:[],
                dec:{
                    data_type:[],
                    funds_type:[],
                    order_status:[],
                    order_type:[],
                    schedule_status:[],
                    schedule_time_type:[],
                    agreement_status:[],
                    agreement_funds_type:[],
                    agreement_funds_payment_status:[],
                    payment_invoice_type:[],
                    print_item:[],
                    payment_item:[],
                    payment_type:[],
                    VERIFY_STATUS:[],
                    HS_REVIEW_TYPE:[],
                    review_status:[]
                },
                shenghejiluVisible:false,
                shenghePagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                shenghejiluTable:[],
                shengheTableData:{
                    hsOrderId:''
                },
                writeReceiptVisible:false,
                researchNeedReceivableListWidth:'100px',
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }
                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchNeedReceivableList.dateTimeStart;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                hallList:[],
                rowFinanceDetailVisible:false,
                rowFinanceDetailData:{
                    hsOrderId:''
                },
                FinanceDetailList:[],
                hsAgreementFundsList:[],
                hsAgrFundsReceiptList:[],
                hsTypeFundsList1:[
                ],
                hsTypeFundsList2:[],
                scheduleTime:'',





                //创建订单
                lookOrderRow:{},
                isHaveAggrement:true,
                hetongDetailsWidth:'100px',
                hsOrderDialogTitle:'',
                 hsOrderDetailList:{
                	status:'',
                	orderNo:'',
                	intentionStatus:'',
                	agreementNo:'',
                	type:'',
                	customerName:'',
                	mobileNumber:'',
                	partyA:'',
                	creatorName:'',
                	scheduleStatus:'',
                	retainDays:'',
                	"hsSchedule":{
						"banquetHallList":'',
						"scheduleTime":'',
						"scheduleType":'',
						"storeName":''
					},
                	agreementStatus:''
                },

                createNewContracts:{
                    customer:'',
                    type:'',
                    contrantIdea:'',
                    saveDay:'',
                    schedule:'',
                    scheduleTimeType:'',
                    banquetHall:[],
                    receiptId:''
                },
                involiceTypes:{},
                banquetHalls:{},
                pickerOptions0:{},
                dialogNewContract:false,
                isShoujuValide:false,  //
                isNotMetting:true,
                screeningType:'',
                screeningIdea:'',
                createTableForms:[],


				createEssentialInformations:{  //基本信息
					groomName:'',
					groomMobile:'',
					groomAddress:'',
					brideName:'',
					brideMobile:'',
					brideAddress:'',
					partyA:'',
					partyAId:'',

				},


				createEssentialInformations1:{
					partyA:'',
					partyAContacts:'',
					partyAMobile:'',
					partyBContacts:'',
					partyBMobile:'',
					startTime:'',
					endTime:''
				},
				createPriceContents:{
					hsPackageId:'',
					estimateTableNumber:'',
					tableNumber:'',
					diningTableForm:''
				},
				createPaymentConventions:{	//付款方式
					paymentConvention:'0',
					receiptId:'',
					invoiceRemark :'',
					paymentConventionType:'',
                },
				newCreateContractsets:[],
				createApplyShow:true,
				createApplyDiscount:'',
				applyDiscounts:{  //申请优惠
					discount:'',
					totalAmount:'',
					discountsTotalAmount:''
				},
				createHsPackageMenuList:[],  //菜单
				hsPackageItemList:[],
				dialogApplyDiscountFormVisible:false,
				dialogPackageMenuTableVisible:false,



                formLabelWidth:'80px',
                activeName: '1',
                isWeddingType:true,
                isInvoiceValide:false,
                hsPackageServiceItemList:[],  //价格内容/服务内容
                followDetailsTable:[],
                radioStatus:'0',
                shoujuNumbers:[],
				createAllAcount:0,  //总金额



				createSupplementaryItems:[],  //补充事项

				createPaymentConventionList:[],  //付款约定
				createPaymentConventionList1:[
					{
						paymentItem:'定金',
						percentageOfPayment:'',
						amount:'',
						lastPaymentTime:''
					},
					{
						paymentItem:'中款',
						percentageOfPayment:'',
						amount :'',
						lastPaymentTime:''
					},
					{
						paymentItem:'尾款',
						percentageOfPayment:'',
						amount:'',
						lastPaymentTime:''
					},
				],
				createPaymentConventionList2:[
					{
						paymentItem:'中款',
						percentageOfPayment:'',
						amount:'',
						lastPaymentTime:''
					},
					{
						paymentItem:'尾款',
						percentageOfPayment:'',
						amount:'',
						lastPaymentTime:''
					},
				],
                isPrintPage:false,
                allComponents: [],
                componentName: '',
                printHsOrderId:'',
                btmVisible:false,
                btnP:{
                	needReceivablesReceipt: "",  //开收据  1
		            needReceivablesReceiptPrint: "",  //打印收据  1
		            needReceivablesCancelContract: "",  //撤销合同  1
		            needReceivablesExcel: "",  // 导出待收款Excel  1
		            needReceivablesShowMoneyDetails: "",  //财务详情  1
                    needReceivablesAuditRecord: "",  //审核记录
                }
            }
        },
        methods: {
        	rowDiscountHandle(row){
        		this.discountListVisible = true
        		let data = [1]
				let self = this
	            self.$axios({
					url: "/order/getHsAgreementEoFavourable?hsOrderId="+row.hsOrderId,
					method: 'post',
					data: data,
					transformRequest: [function (data) {
						let ret = data
						return JSON.stringify(data);
					}],
					headers: {
						'Content-Type': 'application/json;charset=UTF-8'
					}
				}).then(function (res) {
					if(res.data.res=='0'){
						self.discountData = res.data.msg
					}else {
						alert(res.data.msg)
					}
				});
        	},
            shenghehandleSizeChange(val) {//审核记录列表分页
                this.shenghePagination.pageSize = val;
                this.initShenghejiluRow(this.shengheTable)
            },
            shenghehandleCurrentChange(val) { //审核记录列表分页
                this.shenghePagination.pageNow = val;
                this.initShenghejiluRow(this.shengheTable)
            },
            shenghejiluRow(row){//审核记录按钮
                this.shenghejiluVisible=true
                this.shengheTableData.hsOrderId=row.hsOrderId
                this.initShenghejiluRow(this.shengheTable)
            },
            initShenghejiluRow(data){
                this.$axios.post('/order/getReviewList',data).then((res)=>{
                    if(res.data.res==0){
                        this.shenghePagination.total=res.data.msg.total;
                        this.shenghePagination.pageNum=res.data.msg.pageNum;
                        this.shenghePagination.pageSize=res.data.msg.pageSize;
                        this.shenghejiluTable=res.data.msg.list;
                    }else {

                    }
                })
            },
            receiptView(){
                this.btmVisible=true
                this.isPrintPage=false
                this.componentName='receiptStencil'
            },
            receiptPrint(){
                this.btmVisible=true
                this.isPrintPage=true
                this.componentName='receiptStencil'
            },
            pageClose(){
                this.btmVisible=false
                this.componentName=''
            },
            printTemplate(row){//打印
                this.btmVisible=true
                this.componentName=row.formatAddress
                this.printHsOrderId=row.hsOrderId
                this.isPrintPage=true
            },
            previewTemplate(row){ //预览
                this.btmVisible=true
                this.componentName=row.formatAddress
                this.printHsOrderId=row.hsOrderId
                this.isPrintPage=false
            },
            cancelOrder(row){
                this.$confirm('是否确认撤销合同? 撤销合同需要和销售协商', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/order/financeCancelAgreement',{hsOrderId:row.hsOrderId}).then((res)=>{
                        if(res.data.res==0){
                            this.initNeedReceivableList(this.tableData);
                            this.$message({
                                type: 'success',
                                message: '取消订单成功!'
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
            getAccount(id){
                this.$axios.post('/order/getAgreementCancelDetails',{hsOrderId:id}).then((res)=> {
                    if (res.data.res == '0') {
                        this.FinanceDetailList=res.data.msg
                        this.initAgreementFundsList()
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            getAgreementExcel(){
                this.$confirm('此操作将下载EXL, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    window.open(this.exlUrl)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            closeFinanceDetail(){
                this.rowFinanceDetailVisible=false
                this.FinanceDetailList=[]
                this.hsAgreementFundsList=[]
                this.hsAgrFundsReceiptList=[]
                this.hsTypeFundsList1=[]
                this.hsTypeFundsList2=[]
            },
            PaymentTimeToLastTime(row){
                if(row.lastPaymentTime){
                    let time=moment(this.scheduleTime).diff(row.lastPaymentTime, 'days');
                    let timeContent
                        if(time<30){
                            timeContent ='举办前'+time+'天'
                        }else{
                            timeContent='举办前'+moment(this.scheduleTime).diff(row.lastPaymentTime, 'weeks')+'周';
                        }
                    if(this.FinanceDetailList.type==0){
                        timeContent='婚礼'+timeContent
                    }else  if(this.FinanceDetailList.type==1){
                        timeContent='会务'+timeContent
                    }else if(this.FinanceDetailList.type==2){
                        timeContent='宝宝宴'+timeContent
                    }
                    if(row.type==2){
                        timeContent='签约当日'
                    }
                    return timeContent
                }

            },
            plusRow(){
                if(this.cols.length>=3){
                    return false
                }else {
                    this.cols.push(
	                    {
	                    	"paymentMethods":[],
	                    	"paymentMethodThings":[],
	                    }
                    )
                    this.writeReceiptsData.receiptArray.push(
                    	{
							type:'',
							id:'',
							money:'',
							canChangeMoney:false
                    	}
                    )
                    let data = ''
                    for(var i=0;i<this.cols.length;i++){
	            		if(this.writeReceiptsData.receiptArray[i].type == 4 || this.writeReceiptsData.receiptArray[i].type == 5){
	            			data = i
	            		}
                    }
                    if(data ===''){
                    	for(var i=0;i<this.cols.length;i++){
                    		this.cols[i].paymentMethods = this.receiptsDataList0
	                    }
                    }
                    else{
                    	for(var i=0;i<this.cols.length;i++){
                    		if(i == data){
                    			this.cols[i].paymentMethods = this.receiptsDataList0
                    		}
                    		else{
                    			this.cols[i].paymentMethods = this.receiptsDataList
                    		}
	                    }
                    }
                    console.log(this.receiptsDataList)
                }
            },
            delRow(){
              this.cols.pop()
              this.writeReceiptsData.receiptArray.pop()
            },
            rowFinanceDetail(row){
                this.rowFinanceDetailVisible=true
                this.$loading({text:'拼命加载中'})
                this.rowFinanceDetailData.hsOrderId=row.hsOrderId
                this.scheduleTime=row.scheduleTime
                this.$axios.post('/order/getFinanceDetail',{hsOrderId:this.rowFinanceDetailData.hsOrderId}).then((res)=> {
                    if (res.data.res == '0') {
                        this.FinanceDetailList=res.data.msg
                        this.initAgreementFundsList()
                    }else {
                        this.$loading().close()
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            initAgreementFundsList(){
                this.hsAgreementFundsList=this.FinanceDetailList.hsAgreementFundsList
                this.hsAgrFundsReceiptList=this.FinanceDetailList.hsAgrFundsReceiptList
                this.hsAgreementFundsList.forEach((e)=>{
                    if(e){
                        if(e.type==1||e.type==0){
                            this.hsTypeFundsList1.push(e)
                        }else {
                            this.hsTypeFundsList2.push(e)
                        }
                    }

                })
                this.$loading().close()
            },
            submitNeedReceivableList(){
                this.researchNeedReceivableList.dateTimeStart=this.researchNeedReceivableList.dateTimeStart?moment(this.researchNeedReceivableList.dateTimeStart).format('YYYY-MM-DD'):''
                this.researchNeedReceivableList.dateTimeStop=this.researchNeedReceivableList.dateTimeStop?moment(this.researchNeedReceivableList.dateTimeStop).format('YYYY-MM-DD'):''
                this.researchNeedReceivableList.scheduleTime=this.researchNeedReceivableList.scheduleTime?moment(this.researchNeedReceivableList.scheduleTime).format('YYYY-MM-DD'):''

                if(getDays(this.researchNeedReceivableList.dateTimeStart,this.researchNeedReceivableList.dateTimeStop)>60){
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为60天！',
                        offset: 100
                    });
                }else {
                    this.initNeedReceivableList(this.tableData)
                }
            },
            dateTimeStartChange(val){
                this.researchNeedReceivableList.dateTimeStart = val
            },
            dateTimeStopChange(val){
                this.researchNeedReceivableList.dateTimeStop = val
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            writeReceipt(row,number){
            	this.paymentRows = row
            	this.writeReceiptNumber = number
            	if(number === 0){
            		this.writeReceiptVisibleTitle = '开收据'
            	}
            	else{
            		this.writeReceiptVisibleTitle = '补开收据'
            		this.writeReceiptsData.receiptNo = row.hsPaperReceiptNo
            	}
                this.writeReceiptVisible=true
                this.$axios.post('/order/getHsPaymentMode',{"hsOrderId":row.hsOrderId,"fundsType":row.type}).then((res)=> {
                    if (res.data.res == '0') {
                        this.receiptsDataList = res.data.msg
                        this.cols[0].paymentMethods = res.data.msg
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
                this.getAllData()
            },
            getAllData(){
            	this.$axios.post('/order/getHsPaymentMode',{"hsOrderId":this.paymentRows.hsOrderId,"fundsType":this.paymentRows.type}).then((res)=> {
                    if (res.data.res == '0') {
                        this.receiptsDataList0= res.data.msg
                    }
                })
            },
            changePaymentThings(index){

            },
            paymentMethodHandle(index){
            	this.writeReceiptsData.receiptArray[index].id = ''
            	console.log(this.receiptsDataList0)
            	for(var i=0;i<this.receiptsDataList.length;i++){
            		if(this.receiptsDataList[i].dicValue == 4 || this.receiptsDataList[i].dicValue == 5){
            			this.receiptsDataList.splice(i,1)
            		}
            	}
            	this.cols[index].paymentMethodThings = []
            	let paymentType = this.writeReceiptsData.receiptArray[index].type
            	if(paymentType == 4 || paymentType == 5){
            		this.$axios.post('/order/getHsPaymentAmount',{"hsOrderId":this.paymentRows.hsOrderId,"fundsType":paymentType}).then((res2)=> {
		                if (res2.data.res == '0') {
		                    this.writeReceiptsData.receiptArray[index].money = res2.data.msg;
		                    this.writeReceiptsData.receiptArray[index].canChangeMoney = true
		                }else {
		                    this.$notify.error({
		                        title: '错误',
		                        message: res.data.msg,
		                        offset: 100
		                    });
		                }
		            })
		            for(var i=0;i<this.cols.length;i++){
			            if(i != index){
						    this.cols[i].paymentMethods = this.receiptsDataList
			            }
			            else{
			            	 this.cols[i].paymentMethods = this.receiptsDataList0
			            }
			        }
            	}
            	else{
            		this.writeReceiptsData.receiptArray[index].money = '';
            		this.writeReceiptsData.receiptArray[index].canChangeMoney = false
            		let data = ''
                    for(var i=0;i<this.cols.length;i++){
	            		if(this.writeReceiptsData.receiptArray[i].type == 4 || this.writeReceiptsData.receiptArray[i].type == 5){
	            			data = i
	            		}
                    }

                    if(data ===''){
                    	for(var i=0;i<this.cols.length;i++){
                    		this.cols[i].paymentMethods = this.receiptsDataList0
	                    }
                    }
                    else{
                    	for(var i=0;i<this.cols.length;i++){
                    		if(i == data){
                    			this.cols[i].paymentMethods = this.receiptsDataList0
                    		}
                    		else{
                    			this.cols[i].paymentMethods = this.receiptsDataList
                    		}
	                    }
                    }
            	}



            	this.$axios.post('/order/getHsPaymentList',{"pageSize":100,}).then((res)=> {
	                if (res.data.res == '0') {
	                	res.data.msg.list.forEach((n)=>{
                            if(paymentType == n.paymentType){
                            	this.cols[index].paymentMethodThings.push(n)
                            }
                      })
	                }else {
	                    this.$notify.error({
	                        title: '错误',
	                        message: res.data.msg,
	                        offset: 100
	                    });
	                }
	            })
            },
            cancelSubmitReceiptMethodsHandle(){  //放弃开收据
            	this.writeReceiptVisible=false
            	this.cols = [
                    {
                    	"paymentMethods":[],
                    	"paymentMethodThings":[]
                    }
                ],
            	this.writeReceiptsData = {
                	receiptNo:'',
                	remark:'',
                	receiptArray:[
	                	{
							type:'',
							id:'',
							money:'',
							canChangeMoney:false
						}
                	]
                }
            },
            panduanMoneyHandle(){
            	let allMoney = 0
            	this.writeReceiptsData.receiptArray.forEach((n)=>{
            		allMoney += Number(n.money)
	            })
            	if(this.paymentRows.type === 2){
	                if(allMoney != this.paymentRows.amount){
	                	this.$alert('收据金额跟收款金额不一致', '信息', {
				        	confirmButtonText: '确定',
				          	callback: action => {
				          	}
				        });
				        this.moneyIsOk = false
	                }
	                else{
	                	this.moneyIsOk = true
	                }
            	}
            	else{
            		this.moneyIsOk = true
            	}
            },
            submitReceiptMethodsHandle(formName){  //提交开收据
            	if(this.writeReceiptNumber === 0){
	            	this.$refs[formName].validate((valid) => {
		                if (valid) {
		                    let data = []
			                let self = this
			                let returnTrue = false;
			                self.writeReceiptsData.receiptArray.forEach((n)=>{
			                    if( n.type ==='' || n.id === '' || n.money === ''){
			                        console.log(self.writeReceiptsData.receiptArray)
			                        self.$message.error('请填写完整付款内容！');
			                        returnTrue = false
			                    }
			                    else{
			                        returnTrue = true
			                    }
			                })
			                if(returnTrue){
			                    this.panduanMoneyHandle()
			                    if(this.moneyIsOk){
			                        if(self.writeReceiptsData.remark == ''){
				                        self.$message.error('请填写备注！');
				                        returnTrue = false
				                    }
				                    else{
				                        let allMoney = 0
					                    if(self.writeReceiptsData.receiptArray.length){
								            for(var i=0;i<self.writeReceiptsData.receiptArray.length;i++){
								            	allMoney =Number(allMoney)+ Number(self.writeReceiptsData.receiptArray[i].money)
								            	let a =  {
													"paymentType":self.writeReceiptsData.receiptArray[i].type,
													"paymentDetail":self.writeReceiptsData.receiptArray[i].id,
													"amount":self.writeReceiptsData.receiptArray[i].money,
												}
												data.push(a)
								            }
								        }
					                    self.$axios({
											url:"/order/saveOpenRecript?hsAgreementFundsId="+self.paymentRows.id+'&hsOrderId='+self.paymentRows.hsOrderId+'&receiptNo='+self.writeReceiptsData.receiptNo+'&remark='+self.writeReceiptsData.remark+'&totalAmount='+allMoney,
											method: 'post',
											data: data,
											transformRequest: [function (data) {
												let ret = data
												console.log(JSON.stringify(data))
												return JSON.stringify(data);
											}],
											headers: {
												'Content-Type': 'application/json;charset=UTF-8'
											}
										}).then(function (res) {
											if(res.data.res=='0'){
												self.$message({
													message: '操作成功',
													type: 'success'
												});
												self.cancelSubmitReceiptMethodsHandle()
												self.initNeedReceivableList(self.tableData)

											}else {
												self.$message.error(res.data.msg)
											}
										})
				                    }
			                    }
			                }
		                } else {
		                    this.$message.error('请填写必要信息！');
		                    return false;
		                }
		            })
		        }else{
	            	let data = []
			        let self = this
			        let returnTrue = false;
			        self.writeReceiptsData.receiptArray.forEach((n)=>{
			            if( n.type ==='' || n.id === '' || n.money === ''){
			                console.log(self.writeReceiptsData.receiptArray)
			                self.$message.error('请填写完整付款内容！');
			                returnTrue = false
			            }
			            else{
			                returnTrue = true
			            }
			        })
			        if(returnTrue){
			        	this.panduanMoneyHandle()
			            if(this.moneyIsOk){
			                let allMoney = ''
					        if(self.writeReceiptsData.receiptArray.length){
								for(var i=0;i<self.writeReceiptsData.receiptArray.length;i++){
								    allMoney+=self.writeReceiptsData.receiptArray[i].money
								    let a =  {
										"paymentType":self.writeReceiptsData.receiptArray[i].type,
										"paymentDetail":self.writeReceiptsData.receiptArray[i].id,
										"amount":self.writeReceiptsData.receiptArray[i].money,
									}
									data.push(a)
								}
							}
					        self.$axios({			                								url:"/order/saveOpenRecript?hsAgreementFundsId="+self.paymentRows.id+'&hsOrderId='+self.paymentRows.hsOrderId+'&receiptNo='+self.paymentRows.hsPaperReceiptNo+'&remark='+'&totalAmount='+allMoney,
									method: 'post',
									data: data,
									transformRequest: [function (data) {
										let ret = data
										console.log(JSON.stringify(data))
										return JSON.stringify(data);
									}],
									headers: {
										'Content-Type': 'application/json;charset=UTF-8'
									}
								}).then(function (res) {
									if(res.data.res=='0'){
										self.$message({
											message: '操作成功',
											type: 'success'
										});
										self.writeReceiptVisible=false
										self.cancelSubmitReceiptMethodsHandle()
										self.initNeedReceivableList(self.tableData)
									}else {
										self.$message.error(res.data.msg)
									}
								})
			               }
			            }
	            	}
            },



            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initNeedReceivableList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initNeedReceivableList(this.tableData)
            },
            initNeedReceivableList(data){
                this.loading.pageList=true
                this.$axios.post('/order/getNeedReceivablesList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.NeedReceivableList=res.data.msg.list;
                        this.initDec()
                        this.loading.pageList=false
                    }else {
                        this.loading.pageList=false
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            changeCityHandle(){
            	this.getAllBanquets()
            	this.initNeedReceivableList(this.tableData)
            },
            initCity(){ //初始化默认用户城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.researchNeedReceivableList.cityCode=this.storeCitys[0].cityCode
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
            },
            formTime1(row){
                if(row == null){
                    return null
                }
                else{
                    return moment(row).format('YYYY-MM-DD')
                }
            },
            statusText(status,statusName){ //状态值匹配
                let n;
                this.dec[statusName].forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            },
            initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
                this.dec.funds_type=this.dicData.HS_AGREEMENT_FUNDS_TYPE//收款类型
                this.dec.order_status=this.dicData.HS_ORDER_STATUS//订单状态
                this.dec.order_type = this.dicData.MOBILE_HS_ORDER_TYPE  //订单意向
                this.dec.schedule_status=this.dicData.HS_SCHEDULE_STATUS //档期状态
                this.dec.agreement_status=this.dicData.HS_AGREEMENT_STATUS//合同状态
                this.dec.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
                this.dec.agreement_funds_type=this.dicData.HS_AGREEMENT_FUNDS_TYPE//收款项目类型
                this.dec.agreement_funds_payment_status=this.dicData.HS_AGREEMENT_FUNDS_PAYMENT_STATUS//收款状态
                this.dec.payment_invoice_type=this.dicData.HS_PAYMENT_INVOICE_TYPE//发票类型
                this.dec.print_item=this.dicData.HS_PRINT_ITEM//打印名称
                this.dec.payment_item=this.dicData.HS_AGREEMENT_FUNDS_TYPE  //付款名称
                this.dec.payment_type=this.dicData.HS_PAYMENT_TYPE//付款方式
                this.dec.VERIFY_STATUS = this.dicData.VERIFY_STATUS //审核状态
                this.dec.HS_REVIEW_TYPE = this.dicData.HS_REVIEW_TYPE  //审核类型
                this.dec.review_status=this.dicData.REVIEW_STATUS  //EO单审核状态
            },













            deleteRow(row){ //取消订单按钮
                let deleteType=row.agreementStatus
                switch (deleteType){
                    case 1:
                    case 2:
                    case 4:
                    case 7:
                        this.hetongCancelVisible=true
                        break;
                    default:
                        this.$confirm('此操作将取消订单, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$axios.post('/order/cancelOrder',{hsOrderId:row.id}).then((res)=>{
                                if(res.data.res==0){
                                    this.initAllOrderList(this.tableData);
                                }else {
                                    alert(res.data.msg)
                                }
                            })
                            this.$message({
                                type: 'success',
                                message: '取消订单成功!'
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                        });
                        break;
                }
            },
             handleClick(tab, event) {  //改变分页
				if(tab.name == 2){
					this.createTableForms = this.dicData.DINING_TABLE_FORM_TYPE;
					this.$axios.post('/order/getHsPackageList',{'type':this.createNewContracts.type}).then((res)=>{  //获取所有套系
	                    if(res.data.res == '0'){
	                    	this.newCreateContractsets = res.data.msg;

	                    }
	             	})
				}
				else{
				}

            },
            hallListText(e){
            	let text = ''
            	if(e.length){
            		for(var i=0;i<e.length;i++){
            			text = text + ' ' + e[i].hallName
            		}
            	}
            	return text
            },
            getAllBanquets(){
            	this.createNewContracts.banquetHall = [];
            	this.$axios.get('/store/getHallList',{params:{'pageSize':100,'cityCode':this.researchNeedReceivableList.cityCode,'status':0}}).then((res)=>{  //获取所有宴会厅
                    if(res.data.res == '0'){
                    	this.banquetHalls = res.data.msg.list;
                    	this.hallList=res.data.msg.list
                    }
             	 })
            },
            closeDialogNewContract(){  //关闭合同详情
            	this.FinanceDetailList=[]
            	this.hsAgreementFundsList=[]
            	this.hsAgrFundsReceiptList=[]
            	this.hsTypeFundsList1=[]
            	this.hsTypeFundsList2=[]
            	this.dialogNewContract=false
            },
            checkDetailsRow(row){//查看合同详情按钮
            	this.$loading({text:'拼命加载中'})
                if(row.orderType == 0){
                	this.isWeddingType = true
                }else{
                	this.isWeddingType = false
                	if(row.orderType == 1){
                		this.isNotMetting = true
                	}
                	else{
                		this.isNotMetting = false
                	}

                }

                this.dialogNewContract=true
                this.hsOrderDialogTitle = '合同详情',
                this.createNewContracts.banquetHall = []
                this.dataId = row.id
                this.involiceTypes = this.dicData.HS_PAYMENT_INVOICE_TYPE
            	let shouNumbewr = []
            	 this.$axios.post('/order/getHsPaperReceiptList',{'salesId':JSON.parse(localStorage.getItem("userInfo")).id}).then((res)=>{
                    if(res.data.res == '0'){
                    	shouNumbewr = res.data.msg.list
                    }
             	 })
            	this.applyContactRow = row
                this.screeningType  = row.orderType
                this.createNewContracts.customer = row.hsCustomerId;
                this.createNewContracts.type = row.orderType;
                this.createNewContracts.contrantIdea = row.intentionStatus;
                this.paymentStatus=row.paymentStatus

				this.getAllBanquets();
                this.$axios.post('/order/getHsOrderDetail',{hsOrderId:row.hsOrderId}).then((res)=>{
                	let self = this
                    if(res.data.res=='0'){
                    	self.createNewContracts.banquetHall = []
                    	self.hetongDetailsTable=res.data.msg
	                    self.hsOrderDetailList = res.data.msg
						console.log(self.hsOrderDetailList.hsSchedule)
						if((res.data.msg.invoiceRemark !=null && res.data.msg.invoiceRemark !='') || (res.data.msg.invoiceType !=null && res.data.msg.invoiceType !='') ){
		                    self.createPaymentConventions.paymentConvention = '1'
		                    self.createPaymentConventions.invoiceRemark = res.data.msg.invoiceRemark
		                    self.createPaymentConventions.paymentConventionType = res.data.msg.invoiceType
						}
						else{
							self.createPaymentConventions.paymentConvention = '0'
							self.createPaymentConventions.invoiceRemark = ''
		                    self.createPaymentConventions.paymentConventionType = ''
						}
						if( self.hsOrderDetailList.hsSchedule != null){
			                if( self.hsOrderDetailList.hsSchedule.banquetHallList.length==0){
				                self.hsOrderDetailList.hsSchedule.banquetHallList = ''
				            }
				            self.hsOrderDetailList.hsSchedule.banquetHallList.forEach((n)=>{
								self.createNewContracts.banquetHall.push(n.id)
							})
							self.createNewContracts.schedule = self.hsOrderDetailList.hsSchedule.scheduleTime
			        		self.createNewContracts.screenings =
			        		self.statusText(self.hsOrderDetailList.hsSchedule.scheduleTimeType,'schedule_time_type')
				            self.hsOrderDetailList.hsSchedule.scheduleTime = moment( self.hsOrderDetailList.hsSchedule.scheduleTime).format('YYYY-MM-DD')
			            }
			            else{
			                self.hsOrderDetailList.hsSchedule = {
								"banquetHallList":'',
								"scheduleTime":'',
								"scheduleType":'',
								"storeName":''
							}
							self.createNewContracts.schedule = ''
					        self.createNewContracts.scheduleTimeType = ''
					        self.createNewContracts.banquetHall = ''
			            }
		                if(res.data.msg.hsAgreementFundsList.length){

		                	self.radioStatus = String(res.data.msg.hsAgreementFundsList[0].receiptType)
			                self.shoujuNumbers.forEach((n)=>{
								if(n.id==res.data.msg.hsAgreementFundsList[0].hsPaperReceiptId) {
									self.createNewContracts.receiptId=n.receiptNo
								}
							})
                            self.createPaymentConventionList = []
							if(res.data.msg.hsAgreementFundsList !=null){
			                    for(var i=0;i<res.data.msg.hsAgreementFundsList.length;i++){
			                    	let amount = res.data.msg.hsAgreementFundsList[i].amount
			                    	let type = res.data.msg.hsAgreementFundsList[i].type
			                    	let lastPaymentTime = res.data.msg.hsAgreementFundsList[i].lastPaymentTime
			                    	let percentage = res.data.msg.hsAgreementFundsList[i].percentage
			                    	if(amount !=null && lastPaymentTime !=null){
                                        if(type ==2 || type ==3 || type == 4){
                                            let a = {
                                                paymentItem:'',
                                                amount:amount,
                                                percentageOfPayment:percentage,
                                                lastPaymentTime:moment(lastPaymentTime).format('YYYY-MM-DD'),
                                            }
                                            if(type == 2){
                                                a.paymentItem = '定金'
                                            }
                                            else if(type == 3){
                                                a.paymentItem = '中款'
                                            }
                                            else{
                                                a.paymentItem = '尾款'
                                            }
                                            self.createPaymentConventionList.push(a)
                                        }
			                    	}

			                    }
			                    console.log(self.createPaymentConventionList[0])
			                }
			                else{
			                    if(self.screeningType == 0 || self.screeningType == 2){
									self.createPaymentConventionList = self.createPaymentConventionList1
								}
								else{
									self.createPaymentConventionList = self.createPaymentConventionList2
								}
			                }
		                }
	                    if(res.data.msg.hsAgreementDTO !=null){
	                    	console.log(res.data.msg.hsAgreementDTO)
	                    	self.createAllAcount = res.data.msg.hsAgreementDTO.totalAmount
				 			self.hsAgreementDTOId = res.data.msg.hsAgreementDTO.id
	                    	self.hsOrderDetailList.agreementNo = res.data.msg.hsAgreementDTO.agreementNo
							this.createAllReceivedAcount = res.data.msg.receivedAmount
		                    res.data.msg.partyA = res.data.msg.hsAgreementDTO.partyA
		                    self.createEssentialInformations = res.data.msg.hsAgreementDTO  //婚宴基本信息
		                    self.createEssentialInformations1 = res.data.msg.hsAgreementDTO  //会务，宝宝宴基本信息
		                    self.hsPackageServiceItemList = res.data.msg.hsAgreementDTO.hsAgrPkgServiceItemList //服务内容
		                    self.hsPackageItemList = res.data.msg.hsAgreementDTO.hsAgrPackageItemList //项目
		                    self.createSupplementaryItems = res.data.msg.hsAgreementDTO.hsAgrPkgSupplementMattersList //补充事项


		                    if(res.data.msg.hsAgreementDTO.hsAgrPackageDTO != null){
		                    	self.createPriceContents = res.data.msg.hsAgreementDTO.hsAgrPackageDTO  //套系信息
		                    	self.createPriceContents.estimateTableNumber = self.createPriceContents.tableNumber
		                    }
		                    else{
		                    	self.createPriceContents = {
									hsPackageId:'',
									estimateTableNumber:'',
									tableNumber:'',
									diningTableForm:''
								}
		                    }

	                    }
	                    else{
	                    	self.hsAgreementDTOId = null
	                    }
						let data = [0,1,2,3,4,5]

                    	this.$axios({
							url: "/order/getAgreementPrintList?hsOrderId="+row.hsOrderId,
							method: 'post',
							data: data,
							transformRequest: [function (data) {
								let ret = data
								return JSON.stringify(data);
							}],
							headers: {
								'Content-Type': 'application/json;charset=UTF-8'
							}
						}).then(function (res1) {
							if(res1.data.res=='0'){
								self.followDetailsTable =  res1.data.msg
								for(var i=0;i<self.followDetailsTable.length;i++){
									self.dec.print_item.forEach((n)=>{
						                if(n.dicValue==self.followDetailsTable[i].type) {
						                    res1.data.msg[i].type=n.dicDesc
						                }
						            })
						            self.followDetailsTable[i].createTime = moment(self.followDetailsTable[i].createTime).format('YYYY-MM-DD')
								}
							}else {
								alert(res1.data.msg)
							}
						}
					)
                }else {
                    alert(res.data.msg)
                }
                this.$loading().close()
            })
            }

        },
        components:{
            babyAgreementStencil,
            babyAgreementChangeStencil,
            babyAndMeetCancelStencil,
            babyEOStencil,
            babyServiceItemStencil,
            babyFinalQuotationStencil,
            delayChangeStencil,
            quotationListStencil,
            receiptStencil,
            seanceAgreementChangeStencil,
            seanceAgreementStencil,
            seanceEOStencil,
            seanceFinalQuotationStencil,
            weddingAgreementStencil,
            weddingCancelStencil,
            weddingChangeStencil,
            weddingEOStencil,
            weddingFinalQuotationStencil,
            weddingServiceTimeStencil
        },
        computed:{
            tableData(){
                return {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'cityCode':this.researchNeedReceivableList.cityCode,
                    'fundsType':this.researchNeedReceivableList.fundsType,
                    'agreementStatus':this.researchNeedReceivableList.agreementStatus,
                    'hallId':this.researchNeedReceivableList.hallId,
                    'scheduleTime':this.researchNeedReceivableList.scheduleTime,
                    'partyA':this.researchNeedReceivableList.partyA,
                    'mobile':this.researchNeedReceivableList.mobile,
                    'agreementNo':this.researchNeedReceivableList.agreementNo,
                    'orderNo':this.researchNeedReceivableList.orderNo,
                    'dateTimeStart':this.researchNeedReceivableList.dateTimeStart,
                    'dateTimeStop':this.researchNeedReceivableList.dateTimeStop
                }
            },
            exlUrl(){
                return 'http://'+this.dicExlUrl+'/order/getNeedReceivablesExcel?'+
                    'cityCode='+this.researchNeedReceivableList.cityCode+
                    '&fundsType='+this.researchNeedReceivableList.fundsType+
                    '&agreementStatus='+this.researchNeedReceivableList.agreementStatus+
                    '&hallId='+this.researchNeedReceivableList.hallId+
                    '&partyA='+this.researchNeedReceivableList.partyA+
                    '&mobile='+this.researchNeedReceivableList.mobile+
                    '&agreementNo='+this.researchNeedReceivableList.agreementNo+
                    '&orderNo='+this.researchNeedReceivableList.orderNo+
                    'dateTimeStart='+this.researchNeedReceivableList.dateTimeStart+
                    '&dateTimeStop='+this.researchNeedReceivableList.dateTimeStop+
                    '&scheduleTime='+this.researchNeedReceivableList.scheduleTime
            },
            shengheTable(){
                return{
                    "pageNow":this.shenghePagination.pageNow,
                    "pageSize":this.shenghePagination.pageSize,
                    'hsOrderId':this.shengheTableData.hsOrderId,
                    'type':1
                }},
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms',
                'dicExlUrl'
            ])
        },
        mounted(){
        	this.btnP={
                needReceivablesReceipt: filterBtnPms(this.btnAllPms.needReceivablesReceipt),  //开收据
		        needReceivablesReceiptPrint: filterBtnPms(this.btnAllPms.needReceivablesReceiptPrint),  //打印收据
		        needReceivablesCancelContract: filterBtnPms(this.btnAllPms.needReceivablesCancelContract),  //撤销合同
		        needReceivablesExcel:filterBtnPms(this.btnAllPms.needReceivablesExcel),  //打印
		        needReceivablesShowMoneyDetails: filterBtnPms(this.btnAllPms.needReceivablesShowMoneyDetails),  //财务详情
                needReceivablesAuditRecord:filterBtnPms(this.btnAllPms.needReceivablesAuditRecord)  //审核记录
            }
            this.initCity()
            this.initOpenCity()
            this.getAllBanquets()
            this.initNeedReceivableList(this.tableData)

        }
    }
</script>
<style>
	.el-button {
        margin-left: 10px;
    }
    .demo-form-inline{
        text-align: center;
    }
    .inline-form{
        margin-top:10px;
        display:inline-block;
    }
    .inline-form1{
        margin-right:50px;
    }
    .hiddenspan{
        width:130px;
        display:inline-block
    }
   .newContractBox{
        padding-left:20px;
    }
    .newContractBox .inline-form{
        margin-right:30px;
        display:inline-block;
    }

    .hiddenspan1{
        width:205px;
        display:inline-block
    }
    .hiddenspan2{
        width:465px;
        display:inline-block
    }
    .totalAmount{
        margin-left:60%;
    }
    .rightTopBtn{
    	text-align: right;
    	z-index: 100000;
	    right: 20px;
	    position: absolute;
    }
    .tableTitle{
        margin-top:30px;
        line-height:30px;
    }
    .supplementaryContent{
        padding:8px 5px;
        font-size:12px;
        border:1px solid #bfcbd9;
    }
    .moneyText{
        max-width:700px;
    }
    .redText{
        color:red;
    }
    .allAcount{
        margin-right:10px;
    }
    .discountP{
    	text-align: right;
    }
    .addItemLable{
    	width:80px;
    	display:inline-block
    }
    .noBorderInput input{
    	border:none !important
    }
</style>
