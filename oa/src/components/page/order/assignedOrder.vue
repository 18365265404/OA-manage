<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>已分配合同订单</el-breadcrumb-item>
        </el-breadcrumb>
        <div>
            <el-form :inline="true" :model="researchAssignedOrder" ref="researchAssignedOrder" class="demo-form-inline">
                <el-row type="flex" justify="center" style="width: 90%;margin: 20px auto" >
                    <el-col :span="9">
                        <el-form-item  prop='mobile' :label-width="researchAssignedOrderWidth">
                            <el-input  v-model="researchAssignedOrder.mobile" placeholder="客户电话" size="small"></el-input>
                        </el-form-item>
                        <el-form-item  prop='name' :label-width="researchAssignedOrderWidth">
                            <el-input  v-model="researchAssignedOrder.name" placeholder="新郎或新娘名" size="small"></el-input>
                        </el-form-item>
                        <el-form-item  prop='customerMobile' :label-width="researchAssignedOrderWidth">
                            <el-input  v-model="researchAssignedOrder.customerMobile" placeholder="新郎或新娘电话" size="small"></el-input>
                        </el-form-item>
                        <el-form-item  prop='dateTimeStart' :label-width="researchAssignedOrderWidth">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchAssignedOrder.dateTimeStart"
                                    type="date"
                                    :editable="false"
                                    placeholder="档期起始日期"
                                    format="yyyy-MM-dd"
                                    :picker-options="pickerBeginDateBefore"
                                    size="small"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item  prop='dateTimeStop' :label-width="researchAssignedOrderWidth">
                            <el-tooltip class="item" effect="dark" content="终止日期为60天以内" placement="top-end">
                                <div class="block">
                                    <el-date-picker
                                        v-model="researchAssignedOrder.dateTimeStop"
                                        type="date"
                                        :editable="false"
                                        placeholder="档期结束日期"  format="yyyy-MM-dd"
                                        :picker-options="pickerBeginDateAfter"
                                        size="small"
                                    >
                                    </el-date-picker>
                                </div>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  prop="orderType">
                            <el-select v-model="researchAssignedOrder.orderType" placeholder="订单类型" size="small">
                                <el-option
                                    v-for="item in orderType2"
                                    :key="item.dicDesc"
                                    :label="item.dicDesc"
                                    :value="item.dicValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label-width="researchAssignedOrderWidth" prop="hallId">
                            <el-select  size="small" v-model="researchAssignedOrder.hallId" placeholder="宴会厅">
                                <el-option v-for="hall in hallList"
                                           :key="hall.id"
                                           :label="hall.hallName"
                                           :value="hall.id">

                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label-width="researchAssignedOrderWidth" prop="salesId">
                            <el-select  size="small" v-model="researchAssignedOrder.salesId" placeholder="销售">
                                <el-option
                                    v-for="item in salesList"
                                    :key="item.id"
                                    :label="item.nickName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label-width="researchAssignedOrderWidth">
                            <el-select @change='changeCityHandle' v-model="researchAssignedOrder.cityCode" placeholder="城市" size="small">
                                <el-option
                                    v-for="item in storeCitys"
                                    :key="item.cityCode"
                                    :label="item.cityName"
                                    :value="item.cityCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitAssignedOrder">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button  size="small" type="primary" @click="resetForm('researchAssignedOrder')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>
        </div>
        <el-table v-loading="loading.pageList" element-loading-text="拼命加载中" :data="assignedOrderTable" border style="width: 100%">
            <el-table-column prop="customerName" label="客户名称" ></el-table-column>
            <el-table-column prop="mobile" label="客户电话" >
            </el-table-column>
            <el-table-column prop="orderType" label="类型"  >
                <template scope="scope">
                    {{statusText(scope.row.orderType,'data_type')}}
                </template>
            </el-table-column>
            <el-table-column prop="groomName" label="新郎" >
            </el-table-column>
            <el-table-column prop="groomMobile" label="新郎电话" >
            </el-table-column>
            <el-table-column prop="brideName" label="新娘" >
            </el-table-column>
            <el-table-column prop="brideMobile" label="新娘电话" >
            </el-table-column>
            <el-table-column prop="scheduleTime" label="档期" :formatter="formTime1" >
            </el-table-column>
            <el-table-column prop="hallName" label="宴会厅" >
            </el-table-column>
            <el-table-column prop="plannerName" label="策划师">
            </el-table-column>
            <el-table-column prop="customerName" label="合同详情" v-if='btnP.assignedOrdershowDetails'>
                <template scope="scope">
					<el-button size="mini" type="primary" @click="checkDetailsRow(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
            <el-table-column  label="操作" v-if='btnP.assignedOrderSecondAssign'>
                <template scope="scope">
                    <el-button size="small" type="primary" @click="assignPlanner(scope.row)">重新分配</el-button>
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
        <el-dialog title="分配策划师" :visible.sync="assignPlannerVisible">
            <el-form  :model="assignPlannerData" :rules="assignPlannerRules" ref="assignPlannerData" >
                <el-form-item  prop="plannerId" label="分配策划师" label-width="120px">
                    <el-select v-model="assignPlannerData.plannerId" placeholder="请选择">
                        <el-option
                            v-for="item in plannerList"
                            :key="item.id"
                            :label="item.nickName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon='document' @click="submitAssignPlanner('assignPlannerData')">确定</el-button>
                <el-button @click="cancelAssignPlanner">取 消</el-button>
            </div>
        </el-dialog>







        <el-dialog :title="hsOrderDialogTitle" size='large' :visible.sync="dialogNewContract">
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
	                        <span class='hiddenspan'>{{statusText(hsOrderDetailList.intentionStatus,'order_status')}}</span>
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
                        <el-tab-pane label="付款约定" name="3">
                            <div class='moneyText'>
                                <span>当前合同总金额:</span><span class='allAcount'>{{createAllAcount}}</span><span>已收金额:</span><span class='allAcount'>0</span>
                                <span class='redText'> (注意:因为百分比会四舍五入掉金额的小数部分,所以金额和百分比之和在计算的时候可能会有1的差错,具体数字以付款金额为准)</span>
                            </div>
                            <el-table style='width: 100%' :data="createPaymentConventionList" border>
                                <el-table-column property="paymentItem" label="付款项目"></el-table-column>
                                <el-table-column property="percentageOfPayment" label="付款百分比" ></el-table-column>
                                <el-table-column property="amount" label="付款金额"></el-table-column>
                                <el-table-column property="lastPaymentTime" label="约定最晚付款时间"></el-table-column>
                            </el-table>
                            <el-form :model="createPaymentConventions" ref='createPaymentConventions'>
                                <el-form-item label='定金收据' prop='radioStatus'>
                                    <el-radio-group disabled v-model="radioStatus">
                                        <el-radio class="radio"  label="0">驻店财务开收据</el-radio>
                                        <el-radio class="radio"  label="1">手工收据</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item class='inline-form' label='' prop='receiptId' v-show='isShoujuValide' :label-width="formLabelWidth">
                                    <el-select clearable v-model="createNewContracts.receiptId" placeholder="请选择纸质收据编号">
                                        <el-option
                                            v-for="item in shoujuNumbers"
                                            :key="item.id"
                                            :label="item.receiptNo"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label='发票选项：' prop='paymentConvention'>
                                    <el-radio-group disabled v-model="createPaymentConventions.paymentConvention">
			                            <el-radio class="radio"  label="0">不开发票</el-radio>
			                            <el-radio class="radio"  label="1">需要开发票</el-radio>
			                        </el-radio-group>
                                </el-form-item>
                                <div  v-show='isInvoiceValide'>
                                    <el-form-item class='inline-form' prop='paymentConventionType' :label-width="formLabelWidth">
	                                    <el-select clearable v-model="createPaymentConventions.paymentConventionType" placeholder="请选择发票类型">
	                                        <el-option
	                                            v-for="type in involiceTypes"
	                                            :key="type.dicValue"
						                        :label="type.dicDesc"
						                        :value="type.dicValue">
	                                        </el-option>
	                                    </el-select>
	                                </el-form-item>
                                    <el-form-item prop='invoiceRemark ' :label-width="formLabelWidth">
                                        <el-input style='width:60%' type='textarea' placeholder='填写备注' v-model="createPaymentConventions.invoiceRemark " auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>

                            </el-form>
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
            <component :is="componentName" :hsOrderId="printHsOrderId" :isPrintPage='isPrintPage'></component>
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
                loading:{
                    pageList:false,
                    detail:false
                },
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                assignedOrderTable:[],
                dec:{
                    data_type:[],
                    order_status:[],
                    schedule_status:[],
                    agreement_status:[],
                    schedule_time_type:[],
                    print_item:[],
                    payment_item:[]
                },
                assignPlannerData:{
                    plannerId:'',
                    hsOrderId:''
                },
                assignPlannerRules:{
                    plannerId: [
                        { required: true, message:'请选择策划师', trigger: 'change' }
                    ]
                },
                researchAssignedOrder:{
                    dateTimeStart:"",
                    dateTimeStop:'',
                    mobile:'',
                    hallId:'',
                    orderType:'',
                    cityCode:"",
                    customerMobile:'',
                    salesId:'',
                    name:""
                },
                storeCitys:[],
                openCity:[],
                salesList:[],
                researchAssignedOrderWidth:'80px',
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }

                },
                orderType2:[
                    { "dicDesc": "婚宴", "dicName": "HS_DATA_TYPE", "dicSort": null, "dicStatus": 0, "dicValue": 0, "id": "187f68b9-91f6-11e7-9317-1418772e1d5a" },
                    { "dicDesc": "宝宝宴", "dicName": "HS_DATA_TYPE", "dicSort": null, "dicStatus": 0, "dicValue": 2, "id": "187faa73-91f6-11e7-9317-1418772e1d5a" } ],
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchAssignedOrder.dateTimeStart;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                hallList:[],
                assignPlannerVisible:false,
                plannerList:[],



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
                	assignedOrderSecondAssign:"", //重新分配
            		assignedOrdershowDetails:"", //查看详情
                }

            }
        },
        methods: {
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
            assignPlanner(row){
                this.assignPlannerVisible=true
                this.assignPlannerData.hsOrderId=row.hsOrderId
            },
            submitAssignPlanner(formName){
                let data={
                    plannerId:this.assignPlannerData.plannerId,
                    hsOrderId:this.assignPlannerData.hsOrderId
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/order/assignPlanner',data).then((res)=>{
                            if(res.data.res == '0'){
                                this.initAssignedOrder(this.tableData)
                                this.cancelAssignPlanner()
                            }
                            else{
                                this.$message.error(res.data.msg)
                                return false;
                            }

                        })
                    } else {
                        this.$message.error('请填写必要信息！')
                        return false;
                    }
                });
            },
            cancelAssignPlanner(){
                this.$refs['assignPlannerData'].resetFields();
                this.assignPlannerVisible=false
            },
            submitAssignedOrder(){
                this.researchAssignedOrder.dateTimeStart=this.researchAssignedOrder.dateTimeStart?moment(this.researchAssignedOrder.dateTimeStart).format('YYYY-MM-DD'):''
                this.researchAssignedOrder.dateTimeStop=this.researchAssignedOrder.dateTimeStop?moment(this.researchAssignedOrder.dateTimeStop).format('YYYY-MM-DD'):''
                if(getDays(this.researchAssignedOrder.dateTimeStart,this.researchAssignedOrder.dateTimeStop)>60){
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为60天！',
                        offset: 100
                    });
                }else {
                    this.initAssignedOrder(this.tableData)
                }
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            dateTimeStartChange(val){
                this.researchAssignedOrder.dateTimeStart = val
            },
            dateTimeStopChange(val){
                this.researchAssignedOrder.dateTimeStop = val
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initAssignedOrder(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initAssignedOrder(this.tableData)
            },
            initAssignedOrder(data){
                    this.loading.pageList=true
                this.$axios.post('/order/getAssignedHsOrderList',data).then((res)=> {
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.assignedOrderTable=res.data.msg.list;
                        this.initDec();
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
            initSalesList(){
                this.$axios.post('/s/getSalesListByUser').then((res)=>{
                    if(res.status==200){
                        this.salesList=res.data.msg
                    }
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
            hallListText(e){
            	let text = ''
            	if(e.length){
            		for(var i=0;i<e.length;i++){
            			text = text + ' ' + e[i].hallName
            		}
            	}
            	return text
            },
            formTime1(row){

                if(row.scheduleTime == null){

                }
                else{
                    return formatTime(row.scheduleTime)
                }
            },
            initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
                this.dec.order_status=this.dicData.HS_ORDER_STATUS//订单状态
                this.dec.schedule_status=this.dicData.HS_SCHEDULE_STATUS //档期状态
                this.dec.agreement_status=this.dicData.HS_AGREEMENT_STATUS//合同状态
                this.dec.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
                this.dec.print_item=this.dicData.HS_PRINT_ITEM//打印名称
                this.dec.payment_item=this.dicData.HS_AGREEMENT_FUNDS_TYPE  //付款名称
            },
            initCity(){ //初始化默认用户城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.researchAssignedOrder.cityCode=this.storeCitys[0].cityCode
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
            initPlannerList(){
                this.$axios.post('/s/getPlannerList',{cityCode:this.researchAssignedOrder.cityCode}).then((res2)=>{
                    if(res2.status == 200){
                        this.plannerList=res2.data.msg
                    }})
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

				}
				else if(tab.name == 3){

				}
				else{
				}

            },
            changeCityHandle(){
            	this.getAllBanquets()
            	this.initAssignedOrder(this.tableData)
            },
            getAllBanquets(){
            	this.createNewContracts.banquetHall = [];
            	this.$axios.get('/store/getHallList',{params:{'pageSize':100,'cityCode':this.researchAssignedOrder.cityCode,'status':0}}).then((res)=>{  //获取所有宴会厅
                    if(res.data.res == '0'){
                    	this.banquetHalls = res.data.msg.list;
                    	this.hallList=res.data.msg.list
                    }
             	})
            },
            getAllHsPackageList(type){
            	this.$axios.post('/order/getHsPackageList',{'type':type}).then((res)=>{  //获取所有套系
	                if(res.data.res == '0'){
	                    this.newCreateContractsets = res.data.msg;

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
                this.getAllHsPackageList(row.orderType)
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
        computed:{
            tableData(){
                return {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'dateTimeStart':this.researchAssignedOrder.dateTimeStart,
                    'dateTimeStop':this.researchAssignedOrder.dateTimeStop,
                    'mobile':this.researchAssignedOrder.mobile,
                    'hallId':this.researchAssignedOrder.hallId,
                    'orderType':this.researchAssignedOrder.orderType,
                    'cityCode':this.researchAssignedOrder.cityCode,
                    'customerMobile':this.researchAssignedOrder.customerMobile,
                    'salesId':this.researchAssignedOrder.salesId,
                    'name':this.researchAssignedOrder.name

                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
        	this.btnP = {
                	assignedOrderSecondAssign:filterBtnPms(this.btnAllPms.assignedOrderSecondAssign), //重新分配
            		assignedOrdershowDetails:filterBtnPms(this.btnAllPms.assignedOrdershowDetails), //查看详情
                }
            this.initSalesList()
            this.getAllBanquets()
            this.initCity()
            this.initOpenCity()
            this.initPlannerList()
            this.initAssignedOrder(this.tableData)
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
