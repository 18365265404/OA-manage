<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>待确认收款列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row type="flex" justify="end" v-if='btnP.receivableExport'>
            <el-col :span="3">
                <el-button  size="small" type="primary" @click="getAgreementExcel" >导出EXL</el-button>
            </el-col>
        </el-row>
        <el-form :inline="true" :model="researchReceivablesConfirmList" ref="researchReceivablesConfirmList" class="demo-form-inline">
            <el-row type="flex" justify="center" style="width:90%;margin: 20px auto" >
                <el-col :span="9">
                    <el-form-item  prop='payeeName' :label-width="researchReceivablesConfirmListWidth">
                        <el-input  v-model="researchReceivablesConfirmList.payeeName" placeholder="付款方" size="small"></el-input>
                    </el-form-item>
                    <el-form-item  prop='receiptNo' :label-width="researchReceivablesConfirmListWidth">
                        <el-input  v-model="researchReceivablesConfirmList.receiptNo" placeholder="收据号" size="small"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="researchReceivablesConfirmListWidth">
                        <el-select @change='changeCityHandle' v-model="researchReceivablesConfirmList.cityCode" placeholder="城市" size="small">
                            <el-option
                                v-for="item in storeCitys"
                                :key="item.cityCode"
                                :label="item.cityName"
                                :value="item.cityCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop='scheduleTime' :label-width="researchReceivablesConfirmListWidth">
                        <div class="block">
                            <el-date-picker
                                v-model="researchReceivablesConfirmList.scheduleTime"
                                type="date"
                                :editable="false"
                                placeholder="档期"
                                format="yyyy-MM-dd"
                                size="small"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item :label-width="researchReceivablesConfirmListWidth" prop="hallId">
                        <el-select  size="small" v-model="researchReceivablesConfirmList.hallId" placeholder="宴会厅">
                            <el-option v-for="hall in hallList"
                                       :key="hall.id"
                                       :label="hall.hallName"
                                       :value="hall.id">

                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item  prop='dateTimeStart' :label-width="researchReceivablesConfirmListWidth">
                        <div class="block">
                            <el-date-picker
                                v-model="researchReceivablesConfirmList.dateTimeStart"
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
                    <el-form-item  prop='dateTimeStop' :label-width="researchReceivablesConfirmListWidth">
                        <el-tooltip class="item" effect="dark" content="终止日期为60天以内" placement="top-end">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchReceivablesConfirmList.dateTimeStop"
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
                        <el-select v-model="researchReceivablesConfirmList.fundsType" placeholder="收款项" size="small">
                            <el-option
                                v-for="item in dec.funds_receipt_type"
                                :key="item.dicDesc"
                                :label="item.dicDesc"
                                :value="item.dicValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop="orderType">
                        <el-select v-model="researchReceivablesConfirmList.orderType" placeholder="订单状态" size="small">
                            <el-option
                                v-for="item in dec.data_type"
                                :key="item.dicDesc"
                                :label="item.dicDesc"
                                :value="item.dicValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop="paymentType">
                        <el-select v-model="researchReceivablesConfirmList.paymentType" placeholder="付款方式明细" size="small">
                            <el-option
                                v-for="item in paymentModeList"
                                :key="item.id"
                                :label="item.paymentDetail"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-button size="small" type="primary" @click="submitNeedReceivableList">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button  size="small" type="primary" @click="resetForm('researchReceivablesConfirmList')">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="ReceivablesConfirmList" border style="width: 100%" v-loading="loading.pageList" element-loading-text="拼命加载中" >
            <el-table-column prop="receiptNo" label="收据号" width="120px" ></el-table-column>
            <el-table-column prop="dayeeName" label="付款方" >
            </el-table-column>
            <el-table-column prop="orderType" label="订单类型"  >
                <template scope="scope">
                    {{statusText(scope.row.orderType,'data_type')}}
                </template>
            </el-table-column>
            <el-table-column prop="scheduleTime" label="档期" width="130px">

            </el-table-column>
            <el-table-column prop="hallName" label="宴会厅" >
            </el-table-column>
            <el-table-column prop="type" label="收款项" >
                <template scope="scope">
                    {{statusText(scope.row.type,'funds_receipt_type')}}
                </template>
            </el-table-column>
            <el-table-column prop="receiptType" label="收款方式" >
                <template scope="scope">
                    {{scope.row.receiptType?'手工':'机打'}}
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="收款金额" >
            </el-table-column>
            <el-table-column prop="receiptRemark" label="收款方式明细" width="150px"  v-if='userPms!=="财务部"'>

            </el-table-column>
            <el-table-column prop="receivedTime" label="收款时间" width="180px">
                <template scope="scope">
                    {{formTime(scope.row.receivedTime)}}
                </template>

            </el-table-column>
            <el-table-column prop="creatorName" label="收款人" >

            </el-table-column>
            <el-table-column prop="lastPaymentTime" label="收据" v-if='btnP.receivablePrintAndShow'>
                <template scope="scope">
                    <el-button size="mini" type="text" @click="previewTemplateReceipt(scope.row)" >预览</el-button>
                    <el-button size="mini" type="text" @click="printTemplateReceipt(scope.row)" >打印</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="合同详情" v-if='btnP.receivableShowDetails'>
                <template scope="scope">
					<el-button size="mini" type="primary" @click="checkDetailsRow(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="操作" v-if='btnP.receivableConfirm'>
                <template scope="scope">
                    <el-button  v-if='userPms!=="财务部"' size="mini" type="primary" @click="confirmFunds(scope.row)" >确认</el-button>
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





         <el-dialog :title="hsOrderDialogTitle" size='large' :visible.sync="dialogNewContract" :before-close="closeFinanceDetail">
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
                <div>
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
                                <el-col v-show="hsTypeFundsList1.length"><span>已收{{hsTypeFundsList1.length?hsTypeFundsList1[0]['paymentStatus']?'小定':'意向金':''}}：{{hsTypeFundsList1.length?hsTypeFundsList1[0]['amount']:''}}</span></el-col>
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
                                                {{formTime1(scope.row.receiptTime)}}
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
                                        <el-table-column prop="receiptRemark" label="开据详情" >
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
                paymentRows:{},
                writeReceiptsData:{},
                loading:{
                    pageList:false,
                    detail:false
                },
                FinanceDetailList:[],
                hsAgreementFundsList:[],
                hsAgrFundsReceiptList:[],
                hsTypeFundsList1:[
                ],
                hsTypeFundsList2:[],
                userPms:'',
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                ReceivablesConfirmList:[],
                researchReceivablesConfirmList:{
                    dateTimeStart:'',
                    dateTimeStop:'',
                    receiptNo:'',
                    payeeName:'',
                    orderType:'',
                    hallId:'',
                    fundsType:'',
                    cityCode:'',
                    paymentType:'',
                    scheduleTime:''
                },
                openCity:[],
                storeCitys:[],
                hallList:[],
                hsOrderId:'',
                dec:{
                    data_type:[],
                    funds_receipt_type:[],
                    agreement_status:[],
                    order_status:[],
                    order_type:[],
                    schedule_status:[],
                    schedule_time_type:[],
                    print_item:[],
                    payment_item:[],
                    funds_type:[],
                    agreement_funds_type:[],
                    agreement_funds_payment_status:[],
                    payment_invoice_type:[],
                    payment_type:[]

                },
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }
                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchReceivablesConfirmList.dateTimeStart;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                researchReceivablesConfirmListWidth:'100px',






                 //创建订单
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
                	agreementStatus:'',
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
                rowFinanceDetailData:{
                    hsOrderId:''
                },
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
					}
				],
                scheduleTime:'',
                isPrintPage:false,
                allComponents: [],
                componentName: '',
                printHsOrderId:'',
                btmVisible:false,
                btnP:{
                	receivableExport: "",  //导出excel
            		receivableConfirm: "",  //确认
            		receivablePrintAndShow: "",  //打印预览
            		receivableShowDetails: "",  //查看详情
                },
                paymentModeList:[]
            }
        },
        methods: {
            formTime1(row){
                if(row == null){
                    return null
                }
                else{
                    return moment(row).format('YYYY-MM-DD')
                }
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
            rowFinanceDetail(row){
                this.scheduleTime=row.scheduleTime
                this.$axios.post('/order/getFinanceDetail',{hsOrderId:row.hsOrderId}).then((res)=> {
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
            },
            getAgreementExcel(){
                this.$confirm('此操作将下载EXL, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.researchReceivablesConfirmList.dateTimeStart=this.researchReceivablesConfirmList.dateTimeStart?moment(this.researchReceivablesConfirmList.dateTimeStart).format('YYYY-MM-DD'):''
                    this.researchReceivablesConfirmList.dateTimeStop=this.researchReceivablesConfirmList.dateTimeStop?moment(this.researchReceivablesConfirmList.dateTimeStop).format('YYYY-MM-DD'):''
                    this.researchReceivablesConfirmList.scheduleTime=this.researchReceivablesConfirmList.scheduleTime?moment(this.researchReceivablesConfirmList.scheduleTime).format('YYYY-MM-DD'):''
                    window.open(this.exlUrl)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            confirmFunds(row){
                this.$confirm('此操作将确认收款, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/order/confirmHsAgreementFunds',{hsAgrFundsRcpPayId:row.hsAgrFundsRcpPayId}).then((res)=>{
                        if(res.status==200){
                            this.$message({
                                type: 'success',
                                message: '确认成功!'
                            });
                            this.initReceivablesConfirmList(this.tableData)
                        }else {
                            this.$message({
                                type: 'info',
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
            submitNeedReceivableList(){
                this.researchReceivablesConfirmList.dateTimeStart=this.researchReceivablesConfirmList.dateTimeStart?moment(this.researchReceivablesConfirmList.dateTimeStart).format('YYYY-MM-DD'):''
                this.researchReceivablesConfirmList.dateTimeStop=this.researchReceivablesConfirmList.dateTimeStop?moment(this.researchReceivablesConfirmList.dateTimeStop).format('YYYY-MM-DD'):''
                this.researchReceivablesConfirmList.scheduleTime=this.researchReceivablesConfirmList.scheduleTime?moment(this.researchReceivablesConfirmList.scheduleTime).format('YYYY-MM-DD'):''
                if(getDays(this.researchReceivablesConfirmList.dateTimeStart,this.researchReceivablesConfirmList.dateTimeStop)>60){
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为60天！',
                        offset: 100
                    });
                }else {
                    this.initReceivablesConfirmList(this.tableData)
                }
            },
            dateTimeStartChange(val){
                this.researchReceivablesConfirmList.dateTimeStart = val
            },
            dateTimeStopChange(val){
                this.researchReceivablesConfirmList.dateTimeStop = val
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            initCity(){ //初始化默认用户城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.researchReceivablesConfirmList.cityCode=this.storeCitys[0].cityCode
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
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initReceivablesConfirmList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initReceivablesConfirmList(this.tableData)
            },
            initReceivablesConfirmList(data){
                this.loading.pageList=true
                this.$axios.post('/order/getReceivablesConfirmList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.ReceivablesConfirmList=res.data.msg.list;
                        this.initDec()
                        this.loading.pageList=false
                    }else {
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });

                    }
                    this.loading.pageList=false
                })
            },
            formTime(row){
                if(row == null){
                    return null
                }
                else{
                    return moment(row).format('YYYY-MM-DD HH:mm:ss')
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
            changeCityHandle(){
            	this.getAllBanquets()
            	this.initReceivablesConfirmList(this.tableData)
            },
            initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
                this.dec.funds_receipt_type=this.dicData.HS_AGR_FUNDS_RECEIPT_TYPE //待确认收款类型
                  this.dec.order_status=this.dicData.HS_ORDER_STATUS//订单状态
                  this.dec.order_type = this.dicData.MOBILE_HS_ORDER_TYPE  //订单意向
                  this.dec.schedule_status=this.dicData.HS_SCHEDULE_STATUS //档期状态
                  this.dec.agreement_status=this.dicData.HS_AGREEMENT_STATUS//合同状态
                  this.dec.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
                this.dec.agreement_funds_payment_status=this.dicData.HS_AGREEMENT_FUNDS_PAYMENT_STATUS//收款状态
                this.dec.payment_invoice_type=this.dicData.HS_PAYMENT_INVOICE_TYPE//发票类型
                  this.dec.print_item=this.dicData.HS_PRINT_ITEM//打印名称
                  this.dec.payment_item=this.dicData.HS_AGREEMENT_FUNDS_TYPE  //付款名称
                this.dec.payment_type=this.dicData.HS_PAYMENT_TYPE//付款方式
                this.dec.agreement_funds_type=this.dicData.HS_AGREEMENT_FUNDS_TYPE//收款项目类型
            },
            closeFinanceDetail(){
                this.dialogNewContract=false
                this.FinanceDetailList=[]
                this.hsAgreementFundsList=[]
                this.hsAgrFundsReceiptList=[]
                this.hsTypeFundsList1=[]
                this.hsTypeFundsList2=[]
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
				else if(tab.name == 3){
					console.log(this.applyContactRow)
					this.rowFinanceDetail(this.applyContactRow)
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
            	this.$axios.get('/store/getHallList',{params:{'pageSize':100,'cityCode':this.researchReceivablesConfirmList.cityCode,'status':0}}).then((res)=>{  //获取所有宴会厅
                    if(res.data.res == '0'){
                    	this.banquetHalls = res.data.msg.list;
                    	this.hallList=res.data.msg.list
                    }
             	 })
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
            printTemplateReceipt(row){//打印
                this.btmVisible=true
                this.componentName='receiptStencil'
                this.printHsOrderId=row.hsAgrFundsReceiptId
                this.isPrintPage=true
                this.initReceipt(row.hsAgrFundsReceiptId);
            },
            previewTemplateReceipt(row){ //预览
                this.btmVisible=true
                this.componentName='receiptStencil'
                this.printHsOrderId=row.hsAgrFundsReceiptId
                this.isPrintPage=false
                this.initReceipt(row.hsAgrFundsReceiptId);
            },
            initPaymentModeList(){  //付款方式明细
                this.$axios.post('/order/getHsPaymentList',).then((res)=> {
                  console.log(res)
                    this.paymentModeList=res.data.msg.list
                })
            },
            initReceipt(id){
                this.$axios.post('/order/getReceiptPrint',{'hsAgrFundsReceiptId':id}).then((res)=>{
                    if(res.data.res == '0'){
                       console.log(res.data.msg)
                        let row={
                            dayeeName:res.data.msg.drawee,
                            agreementNo:res.data.msg.number,
                            scheduleTime:res.data.msg.scheduleTime,
                            storeName:res.data.msg.storeName ,
                            hallName:res.data.msg.banquetHallName,
                        }
                        let writeReceiptsData={
                            receiptNo:res.data.msg.receiptNo,
                            receiptArray:[],
                            remark:res.data.msg.remark
                        }
                        res.data.msg.hsAgrFundsRcpPayDTOList.forEach((e)=>{
                            writeReceiptsData.receiptArray.push({type:e.paymentType,money:e.amount})
                        })
                      this.paymentRows=row
                        this.writeReceiptsData=writeReceiptsData
                    }
                })
            }
        },
        computed:{
            tableData(){
                return {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'cityCode':this.researchReceivablesConfirmList.cityCode,
                    dateTimeStart:this.researchReceivablesConfirmList.dateTimeStart,
                    dateTimeStop:this.researchReceivablesConfirmList.dateTimeStop,
                    receiptNo:this.researchReceivablesConfirmList.receiptNo,
                    payeeName: this.researchReceivablesConfirmList.payeeName,
                    orderType:this.researchReceivablesConfirmList.orderType,
                    hallId:this.researchReceivablesConfirmList.hallId,
                    fundsType:this.researchReceivablesConfirmList.fundsType,
                    hsAgrFundsRcpPayId:this.researchReceivablesConfirmList.paymentType,
                    scheduleTime:this.researchReceivablesConfirmList.scheduleTime
                }
            },
            exlUrl(){
                return 'http://'+this.dicExlUrl+'/order/getReceivablesConfirmExcel?'+
                    'cityCode='+this.researchReceivablesConfirmList.cityCode+
                    '&orderType='+this.researchReceivablesConfirmList.orderType+
                    '&hallId='+this.researchReceivablesConfirmList.hallId+
                    '&dateTimeStart='+this.researchReceivablesConfirmList.dateTimeStart+
                    '&dateTimeStop='+this.researchReceivablesConfirmList.dateTimeStop+
                    '&payeeName='+this.researchReceivablesConfirmList.payeeName+
                    '&receiptNo='+this.researchReceivablesConfirmList.receiptNo+
                    '&fundsType='+this.researchReceivablesConfirmList.fundsType+
                    '&hsAgrFundsRcpPayId='+this.researchReceivablesConfirmList.paymentType+
                        '&scheduleTime='+this.researchReceivablesConfirmList.scheduleTime
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms',
                'dicExlUrl'
            ]),
        },
        mounted(){
        	this.btnP = {
                	receivableExport: filterBtnPms(this.btnAllPms.receivableExport),  //导出excel
            		receivableConfirm: filterBtnPms(this.btnAllPms.receivableConfirm),  //确认
            		receivablePrintAndShow: filterBtnPms(this.btnAllPms.receivablePrintAndShow),  //打印预览
            		receivableShowDetails: filterBtnPms(this.btnAllPms.receivableShowDetails),  //查看详情
                }
            this.userPms= JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptName?JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptName:''
            this.initCity()
            this.initOpenCity()
            this.getAllBanquets()
            this.initReceivablesConfirmList(this.tableData)
            this.initPaymentModeList()

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
        margin-right:5px;
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
