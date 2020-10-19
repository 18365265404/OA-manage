<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>全部订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style='text-align: right;'>
            <el-button size="small" v-if='btnP.allOrderApplyOrder' type="primary" @click="orderApplyHandle">订单申请</el-button>
        </div>
        <el-dialog :title="hsOrderDialogTitle" size='large' :visible.sync="dialogNewContract" :before-close="cancelNewContractHandle">
           <div v-show='!isCreateOrderHandle'>
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
	                        <span class='hiddenspan'>{{hallListText(hsOrderDetailList.hsSchedule.banquetHallList)}}</span>
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
	            <div v-show='isTabsValide1'>
	                <el-button v-show="btnPms('SHENGHE',hetongDetailsTable) && btnP.allOrderApplyAgreement" :disabled='isHaveSchduletime' @click='applyContactHandle' size="mini" type="primary">申请合同</el-button>
	                <el-button v-show="btnPms('BIANHE',hetongDetailsTable) && btnP.allOrderEditOrder" :disabled='isHaveSchduletime' @click='editContactHandle' size="mini" type="primary">编辑合同</el-button>
	                <el-button v-show="btnPms('GENGHE',hetongDetailsTable) && btnP.allOrderChangeOrder" :disabled='isHaveSchduletime' size="mini" type="primary" @click="hetongChangRow1">变更合同</el-button>
	                <el-button v-show="btnPms('SHENGDANG',hetongDetailsTable) && btnP.allOrderApplyOrderSchedule" :disabled='isHaveSchduletime' size="mini" type="info" @click="dangqiAddRow(hetongDetailsTable,0)">申请档期</el-button>
	                <el-button v-show="btnPms('XIUDANG',hetongDetailsTable) && btnP.allOrderchangeSchdule" :disabled='isHaveSchduletime' size="mini" type="info" @click="dangqiChangRow(hetongDetailsTable,1)">修改档期</el-button>
	                <el-button v-show="btnPms('QUDING',hetongDetailsTable) && btnP.allOrderCanelOrder" :disabled='isHaveSchduletime' size="mini" type="danger" @click="deleteRow(hetongDetailsTable)">取消订单</el-button>
	                <el-button v-show="btnPms('SHENGPI',hetongDetailsTable) && btnP.allOrderApprovalStatus" :disabled='isHaveSchduletime' size="mini" type="warning" @click="auditRow(hetongDetailsTable)">审批状态</el-button>
	                <el-button v-show="btnPms('KAIPIAO',hetongDetailsTable) && paymentStatus>=1 && btnP.allOrderReceiptByHand" :disabled='isHaveSchduletime' size="mini" type="success" @click="shoujuRow(hetongDetailsTable)">手工开收据</el-button>
	            </div>
           </div>

           <div v-show='isCreateOrderHandle'>
				<el-form class='newContractBox' :model='createNewContracts' ref="createNewContracts">
	                <div>
	                    <el-form-item class='inline-form'  prop='customer'>
	                        <el-select clearable v-model="createNewContracts.customer" placeholder="选择客户">
	                            <el-option
	                                v-for="p in customers"
	                                :key="p.id"
	                                :label="p.customerNames"
	                                :value="p.id">
	                            </el-option>
	                        </el-select>
	                    </el-form-item>

	                    <el-form-item class='inline-form'  prop='type'>
	                        <el-select clearable v-model="createNewContracts.type" @change='changeTypeHandle' placeholder="选择类型">
	                            <el-option
	                                v-for="type in dec.data_type"
	                                :key="type.dicDesc"
	                                :label="type.dicDesc"
	                                :value="type.dicValue">
	                            </el-option>
	                        </el-select>
	                    </el-form-item>
	                    <el-form-item class='inline-form'  prop='contrantIdea'>
	                        <el-select clearable v-model="createNewContracts.contrantIdea" @change='changeContrantIdea' placeholder="选择订单意向">
	                            <el-option
	                                v-for="type in dec.order_type"
	                                :key="type.dicDesc"
	                                :label="type.dicDesc"
	                                :value="type.dicValue">
	                            </el-option>
	                        </el-select>
	                    </el-form-item>
	                </div>
	                <div class='dangqi' v-show='isTabsValide'>
	                    <el-form-item prop='saveDay'>
	                        <el-select clearable v-model="createNewContracts.saveDay" placeholder="保留天数">
	                            <el-option v-for="n in saveDays" :value="n" :label='n+"天"' :key='n'>{{n}}天</el-option>
	                        </el-select>
	                    </el-form-item>
	                    <el-form-item prop='schedulesType'>

	                        <el-radio-group v-model="radioSchedules" @change='changeSchedulesHandle'>
	                            <el-radio class="radio" label="0">申请档期</el-radio>
	                            <el-radio class="radio" label="1">不申请档期</el-radio>
	                        </el-radio-group>
	                    </el-form-item>
	                    <div v-show='isScheduleValide'>
	                        <el-form-item class='inline-form' prop='schedule'>
	                            <div class="block">
	                                <el-date-picker
	                                    v-model="createNewContracts.schedule"
	                                    type="date"
	                                    placeholder="档期" @change="startDateChange"
	                                    :picker-options="pickerOptionsScheduleFirst">
	                                </el-date-picker>
	                            </div>
	                        </el-form-item>
	                        <el-form-item class='inline-form' prop='scheduleTimeType'>
	                            <el-select clearable v-model="createNewContracts.scheduleTimeType" placeholder="场次">
	                                <el-option
	                                    v-for="item in dec.schedule_time_type"
	                                    :key="item.dicValue"
	                                    :label="item.dicDesc"
	                                    :value="item.dicValue">
	                                </el-option>
	                            </el-select>
	                        </el-form-item>
	                        <el-form-item prop='banquetHall'>
	                            <el-select v-model="createNewContracts.banquetHall" @change='createChangeBanquetHandle' multiple placeholder="宴会厅">
	                                <el-option
	                                    v-for="item in banquetHalls"
	                                    :key="item.id"
	                                    :label="item.hallName"
	                                    :value="item.id"
	                                    >
	                                </el-option>
	                            </el-select>
	                        </el-form-item>
	                    </div>

	                    <el-form-item prop='statusType' >
	                        <el-radio-group v-model="radioStatus" @change='changeReceiptHandle'>
	                            <el-radio class="radio"  label="0">驻店财务开收据</el-radio>
	                            <el-radio class="radio"  label="1">手工收据</el-radio>
	                        </el-radio-group>
	                    </el-form-item>
	                    <el-form-item class='inline-form' prop='receiptId' v-show='isShoujuValide'>
	                        <el-select clearable v-model="createNewContracts.receiptId" placeholder="请选择纸质收据编号">
	                            <el-option
	                                v-for="item in shoujuNumbers"
	                                :key="item.id"
	                                :label="item.receiptNo"
	                                :value="item.id">
	                            </el-option>
	                        </el-select>
	                    </el-form-item>
	                     <el-form-item>
	                        <el-button type="primary" icon='document' :disabled='repeatedCommit' @click="confirmNewContractHandle(1)">提交</el-button>
	                        <el-button @click="cancelNewContractHandle">返回</el-button>
	                     </el-form-item>

	                </div>
				</el-form>
		   </div>






                <div  v-show='!isTabsValide'>
                    <div class='rightTopBtn' v-show='isCreateOrderHandle2'>
                        <el-button class='btn1' v-show='!isCreateOrderHandle' :disabled='repeatedCommit' type="primary" @click="cancelNewContractHandle">放弃</el-button>
                        <el-button class='btn1' type="primary" :disabled='repeatedCommit'  @click="confirmNewContractHandle(0)">暂存</el-button>
                        <el-button class='btn1' type="primary" :disabled='repeatedCommit'  @click="confirmNewContractHandle(7)">提交</el-button>
                    </div>
                    <el-tabs v-model="activeName" @tab-click="handleClick">

                        <el-tab-pane label="基本信息" name="1">
                        	<el-form class='newContractBox' :model='createEssentialInformations' ref='createEssentialInformations' :rules='createEssentialInformationsrules'>
                            <div>
                               <el-form-item class='inline-form' prop='schedule'>
                            		<div class="block">
                               			 <el-date-picker
                                    		v-model="createNewContracts.schedule"
                                    		type="date"
                                   			 placeholder="档期" :disabled='!isCreateOrderHandle1' @change="startDateChange"
                                    		:picker-options="pickerOptionsScheduleFirst">
                                		</el-date-picker>
                            		</div>
                       		 	</el-form-item>
                       			 <el-form-item class='inline-form' prop='scheduleTimeType'>
                           			 <el-select clearable :disabled='!isCreateOrderHandle1' v-model="createNewContracts.scheduleTimeType" placeholder="场次">
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
                            		 <el-select :disabled='!isCreateOrderHandle1' v-model="createNewContracts.banquetHall" @change='createChangeBanquetHandle' multiple placeholder="宴会厅">
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
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations.groomName" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新郎联系手机：' prop='groomMobile'>
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations.groomMobile" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新郎联系地址：' prop='groomAddress'>
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations.groomAddress" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item class='inline-form inline-form1' label='新娘姓名：' prop='brideName'>
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations.brideName" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新娘联系手机：'  prop='brideMobile'>
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations.brideMobile" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='新娘联系地址：' prop='brideAddress'>
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations.brideAddress" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item class='inline-form inline-form1' label='甲方：' prop='partyA'>
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan2' v-model="createEssentialInformations.partyA" auto-complete="off"></el-input>
                                    </el-form-item >
                                    <el-form-item class='inline-form inline-form1' label='甲方身份证：' prop='partyAId'>
                                        <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations.partyAId" auto-complete="off"></el-input>
                                    </el-form-item >
                                </div>

                            </div>
                        </el-form>
                        <div v-show='!isWeddingType'>
                            <el-form :model="createEssentialInformations1"  :rules='createEssentialInformationsrules1' ref='createEssentialInformations1'>
	                            <div>
	                                <el-form-item class='inline-form inline-form1' label="甲方：" prop='partyA'>
	                                    <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations1.partyA" auto-complete="off"></el-input>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='甲方联系人：' prop='partyAContacts'>
	                                    <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations1.partyAContacts" auto-complete="off"></el-input>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='联系人手机号：' prop='partyAMobile'>
	                                    <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations1.partyAMobile" auto-complete="off"></el-input>
	                                </el-form-item>
	                            </div>
	                            <div>
	                                <el-form-item class='inline-form inline-form1' label='乙方联系人：' prop='partyBContacts'>
	                                    <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations1.partyBContacts" auto-complete="off"></el-input>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='乙方联系人手机：'  prop='partyBMobile'>
	                                    <el-input :disabled='!isCreateOrderHandle1' class='hiddenspan1' v-model="createEssentialInformations1.partyBMobile" auto-complete="off"></el-input>
	                                </el-form-item >
	                            </div>
	                            <div>


	                                <el-form-item class='inline-form inline-form1' label='开始时间：' prop='startTime'>
	                                  <el-time-select
									    placeholder="开始时间"
									    :disabled='!isCreateOrderHandle1' class='hiddenspan1'
									    v-model="createEssentialInformations1.startTime"
									    format='HH:mm' @change='changeStartTimeHandle'
									    :picker-options="{
									      start: '00:00',
									      step: '00:05',
									      end: '23:55'
									    }">
									  </el-time-select>
	                                </el-form-item >
	                                <el-form-item class='inline-form inline-form1' label='结束时间：' prop='endTime'>
	                                     <el-time-select
										  	:disabled='!isCreateOrderHandle1' class='hiddenspan1'
										    placeholder="结束时间"
										    v-model="createEssentialInformations1.endTime"
										    format='HH:mm' @change='changeEndTimeHandle'
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
                                    <el-select :disabled='!isCreateOrderHandle1' style='width:250px' clearable @change='createChangeSetHandle'  @visible-change='createChangeSetVisibleHandle' v-model="createPriceContents.hsPackageId" placeholder="请选择套系">
                                        <el-option
                                            v-for="item in newCreateContractsets"
                                            :key="item.id"
                                            :label="item.packageName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show='!isWeddingType' class='inline-form' label='预计桌数' prop='estimateTableNumber' :label-width="formLabelWidth">
                                    <el-input :disabled='!isCreateOrderHandle1 || isDontEat' type='number' placeholder='0'  v-model="createPriceContents.estimateTableNumber" auto-complete="off"></el-input>
                                </el-form-item>
                                <el-form-item class='inline-form' :label='tableTitle' prop='tableNumber' :label-width="formLabelWidth">
	                                <el-input :disabled='!isCreateOrderHandle1 || isDontEat' type='number' placeholder='0'  @change='createTableNumberHandle1' v-model="createPriceContents.tableNumber" auto-complete="off"></el-input>
	                            </el-form-item>
	                            <el-form-item v-show='!isWeddingType' class='inline-form' label='餐桌形式' prop='diningTableForm' :label-width="formLabelWidth">
	                                <el-select :disabled='!isCreateOrderHandle1 || isDontEat' clearable v-model="createPriceContents.diningTableForm" placeholder="请选择餐桌形式">
	                                    <el-option
	                                        v-for="item in dec.dinnerTable_type"
	                                        :key="item.dicValue"
	                                        :label="item.dicDesc"
	                                        :value="item.dicValue">
	                                    </el-option>
	                                </el-select>
	                            </el-form-item>
                            </el-form>



                            <div>
                                <p class='tableTitle'>服务内容
                                    <el-button style='float:right' v-show='isWeddingType1 && isCreateOrderHandle2' class='btn1' type="primary" @click="createAddServiceContentHandle">增加</el-button>
                                </p>
                                <el-table style='width: 100%' :data="hsPackageServiceItemList" border >
                                    <el-table-column property="name" label="名称"></el-table-column>
                                    <el-table-column property="quantity" v-if='createNewContracts.type != 1' label="数量" ></el-table-column>
                                    <el-table-column property="unit" v-if='createNewContracts.type != 1' label="单位"></el-table-column>
                                    <el-table-column property="content" label="内容"></el-table-column>
                                    <el-table-column property="unitPrice" v-if='createNewContracts.type != 1' label="单价"></el-table-column>
                                    <el-table-column property="totalAmount" v-if='createNewContracts.type != 1' label="总价"></el-table-column>
                                    <el-table-column v-if='isCreateOrderHandle2' prop="operation" label="操作">
								    	<template scope="scope">
								    		<div class="btnDiv">
								    			<p>
								    				<el-button
											          type="primary" style='margin-bottom:5px' size="small" v-show='scope.$index == 0'
											          @click="createLookContractHandle(scope.$index, scope.row)">
											          	查看菜单
											         </el-button>
								    			</p>
								    			<p>
								    				<el-button
								                        type="primary"
								                        v-show=""
								                        size="small" v-show='scope.$index ==0 && createNewContracts.type != 1 && createApplyShow'
								                        @click="createApplyDiscountHandle(scope.$index, scope.row)">
								                       	 申请优惠
								                    </el-button>
								    			</p>
								    			<p>
								    				<el-button
								                        type="primary"
								                        v-show=""
								                        size="small" v-show='scope.$index != 3 && createNewContracts.type != 1 && scope.$index !=0 && scope.row.applyTrue'
								                        @click="createApplyDiscountHandle(scope.$index, scope.row)">
								                       	 申请优惠
								                    </el-button>
								    			</p>
										        <p>
										        	<el-button
								                        type="primary"
								                        v-show=""
								                        size="small" v-show='scope.$index == 3 && (createNewContracts.type == 0 || createNewContracts.type == 2)'
								                        @click="createLookContentHandle(scope.$index, scope.row)">
								                      	  查看内容
								                    </el-button>
										        </p>
							                    <div>
							                        <el-button
								                        type="primary"
								                        v-show="scope.$index != 0 && createNewContracts.type == 1"
								                        size="small"
								                        @click="createEditHandle(scope.$index, scope.row)">
								                      	  编辑
								                    </el-button>
								                     <el-button
								                        type="primary"
								                        v-show="scope.$index != 0 && createNewContracts.type == 1"
								                        size="small"  @click.native.prevent="deleteRow5(scope.$index, hsPackageServiceItemList)">
								                      	  删除
								                    </el-button>
							                    </div>


								    		</div>
									      </template>
								    </el-table-column>
                                </el-table>
                            </div>
                            <div>

                                <p class='tableTitle'>项目
                                    <el-button style='float:right' v-show='createNewContracts.type ==1 && isCreateOrderHandle2' class='btn1' type="primary" @click="addIncreaseConferenceOfferHandle">增加</el-button>
                                    <el-button style='float:right' v-show='createNewContracts.type ==0 && isCreateOrderHandle2' class='btn1' type="primary" @click="addCreateServiceItemHandle">增加项目</el-button>
                                    <el-button style='float:right' v-show='createNewContracts.type !=0 && isCreateOrderHandle2 && allDiscountBtn && isHaveAllDiscount' class='btn1' type="primary" @click="createApplyDiscountHandle(0,0)">总优惠</el-button>
                                </p>
                                <el-table style='width: 100%' :data="hsPackageItemList" border>
                                    <el-table-column property="name" v-if='createNewContracts.type != 1' label="名称"></el-table-column>
                                    <el-table-column property="content" label="内容" ></el-table-column>
                                    <el-table-column property="creatorName" v-if='createNewContracts.type != 1' label="添加人"></el-table-column>
                                    <el-table-column property="quantity" label="数量"></el-table-column>
                                    <el-table-column property="unit" label="单位"></el-table-column>
                                    <el-table-column property="unitPrice" label="单价"></el-table-column>
                                    <el-table-column property="totalAmount" label="总价"></el-table-column>
                                     <el-table-column v-if='isCreateOrderHandle2' prop="operation" label="操作">
								    	<template scope="scope">
								    		<div class="btnDiv">
										        <p>
										        	<el-button
								                        type="primary"
								                        v-show=""
								                        size="small" v-show='scope.$index == 0 && createNewContracts.type == 1'
								                        @click="createEditItemListHandle1(scope.$index, scope.row)">
								                      	  编辑
								                    </el-button>
										        </p>
							                    <div>
							                        <el-button
								                        type="primary"
								                        v-show="scope.$index != 0 && createNewContracts.type == 1 && scope.row.content != '总优惠'"
								                        size="small"
								                        @click="createEditItemListHandle2(scope.$index, scope.row)">
								                      	  编辑
								                    </el-button>
								                     <el-button
								                        type="primary"
								                        v-show="(scope.$index != 0 && createNewContracts.type == 1) || (createNewContracts.type == 0 || createNewContracts.type == 2)"
								                        size="small"  @click.native.prevent="deleteRow1(scope.$index, scope.row)">
								                      	  删除
								                    </el-button>
							                    </div>


								    		</div>
									      </template>
								    </el-table-column>
                                </el-table>
                            </div>
                            <div v-show='isNotMetting'>
                                <p class='tableTitle'>补充事项
                                    <el-button v-show='isCreateOrderHandle2' style='float:right' class='btn1' type="primary" @click="createAddSupplementItemsHandle">增加补充事项</el-button>
                                </p>
                                <el-table style='width: 100%' :data="createSupplementaryItems" border>
	                                <el-table-column property="content" label="内容"></el-table-column>
	                                <el-table-column v-if='isCreateOrderHandle2' property="operation" label="操作" >
	                                	<template scope="scope">
								    		<div class="btnDiv">
							                    <div>
							                        <el-button
								                        type="primary"
								                        size="small"
								                        @click="createEditSuppleItemListHandle(scope.$index, scope.row)">
								                      	  编辑
								                    </el-button>
								                     <el-button
								                        type="primary"
								                        size="small"  @click.native.prevent="deleteRow3(scope.$index, scope.row)">
								                      	  删除
								                    </el-button>
							                    </div>


								    		</div>
									      </template>
	                                </el-table-column>

	                            </el-table>

                            </div>
                            <p style='text-align: right;margin-top:30px;font-weight:bold'>
                                <span>当前合同总金额:</span><span class='allAcount'>{{createAllAcount}}</span>
                            </p>
                        </el-tab-pane>
                        <el-tab-pane label="付款约定" name="3">
                            <div class='moneyText'>
                                <span>当前合同总金额:</span><span class='allAcount'>{{createAllAcount}}</span><span>已收金额:</span><span class='allAcount'>{{createAllReceivedAcount}}</span>
                                <span class='redText'> (注意:因为百分比会四舍五入掉金额的小数部分,所以金额和百分比之和在计算的时候可能会有1的差错,具体数字以付款金额为准)</span>
                            </div>
                            <el-table style='width: 100%' :data="createPaymentConventionList" border>
                                <el-table-column property="paymentItem" label="付款项目"></el-table-column>
                                <el-table-column property="percentageOfPayment" label="付款百分比" ></el-table-column>
                                <el-table-column property="amount" label="付款金额"></el-table-column>
                                <el-table-column property="lastPaymentTime" label="约定最晚付款时间"></el-table-column>
                                <el-table-column v-if='isCreateOrderHandle2' prop="operation" label="操作">
								    	<template scope="scope">
								    		<div class="btnDiv">
							                    <div>
							                        <el-button
								                        type="primary"
								                        size="small"
								                        @click="createPaymentConventionListHandle(scope.$index, scope.row)">
								                      	  编辑
								                    </el-button>
								                    <el-button
								                        type="primary"
								                        size="small"
								                        v-show='scope.$index == 0 && createNewContracts.type !=1'
								                        @click="createAddPaymentConventionListHandle(scope.$index, scope.row)">
								                      	  添加
								                    </el-button>
								                     <el-button
								                        type="primary"
								                        v-show='createPaymentConventionList.length>3 && scope.row.paymentItem == "定金" && scope.$index !=0'
								                        size="small"  @click="deleteRow2(scope.$index, createPaymentConventionList)">
								                      	  删除
								                    </el-button>
							                    </div>


								    		</div>
									      </template>
								    </el-table-column>
                            </el-table>
                            <el-form :model="createPaymentConventions" ref='createPaymentConventions'>
                                <el-form-item label='定金收据'>
                                    <el-radio-group :disabled = '!isCreateOrderHandle1' v-model="radioStatus1" @change='changeReceiptHandle1'>
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
                                    <el-radio-group :disabled = '!isCreateOrderHandle1' v-model="createPaymentConventions.paymentConvention" @change='changeInvoiceHandle'>
			                            <el-radio class="radio"  label="0">不开发票</el-radio>
			                            <el-radio class="radio"  label="1">需要开发票</el-radio>
			                        </el-radio-group>
                                </el-form-item>
                                <div  v-show='isInvoiceValide'>
                                    <el-form-item class='inline-form' prop='paymentConventionType' :label-width="formLabelWidth">
	                                    <el-select clearable v-model="createPaymentConventions.paymentConventionType" placeholder="请选择发票类型">
	                                        <el-option
	                                            v-for="type in dec.involice_type"
	                                            :key="type.dicValue"
						                        :label="type.dicDesc"
						                        :value="type.dicValue">
	                                        </el-option>
	                                    </el-select>
	                                </el-form-item>
                                    <el-form-item prop='invoiceRemark ' :label-width="formLabelWidth">
                                        <el-input style='width:60%' type='textarea' placeholder='填写备注' v-model="createPaymentConventions.invoiceRemark" auto-complete="off"></el-input>
                                    </el-form-item>
                                </div>

                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="打印" name="4">
                            <el-table style='width: 100%' :data="followDetailsTable" border>
                                <el-table-column property="type" label="项目">
                                	<span class='hiddenspan'>{{statusText(followDetailsTable.type,'print_item')}}</span>
                                </el-table-column>
                                <el-table-column property="remark" label="内容"></el-table-column>
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
        <el-dialog title="申请优惠" :visible.sync="dialogApplyDiscountFormVisible" :before-close='cancelApplyDiscountHandle'>
			<el-form :model="applyDiscounts" ref='applyDiscounts' :rules='applyDiscountRules'>
				<el-form-item prop='discount'>
					<el-input v-model="applyDiscounts.discount" @change='changeDiscountHandle' :placeholder='applyDiscountPlaceholder' auto-complete="off"></el-input>
				</el-form-item>
				<div v-show='createNewContracts.type == 0'>
					<p class='discountP'>套系当期价格:{{createAllAcount}}</p>
					<p class='discountP'>套系优惠后价格:{{createDiscountAllAcount}}</p>
				</div>
				<div v-show='createNewContracts.type != 0'>
					<p class='discountP'>当前合同总金额:{{createAllAcount}}</p>
					<p class='discountP'>优惠后总金额:{{createDiscountAllAcount}}</p>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelApplyDiscountHandle">取 消</el-button>
				<el-button type="primary" @click="confirmApplyDiscountHandle('applyDiscounts')">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="菜单" :visible.sync="dialogPackageMenuTableVisible" size='large'>
			<el-table style='width: 100%' :data="createHsPackageMenuList" border>
                <el-table-column property="name" label="商品名称"></el-table-column>
                <el-table-column property="pakename" label="所属套系" ></el-table-column>
                <el-table-column property="alternateName" label="调整后菜名"></el-table-column>
                <el-table-column property="alterPakename" label="所属套系"></el-table-column>
                <el-table-column prop="operation" v-if='createNewContracts.type !=2' label="操作">
					<template scope="scope">
						<div class="btnDiv">
							<p>
								<el-button
								    type="primary"
								    size="small"
								    @click="createAdjustmentHandle(scope.$index, scope.row)">
								          调整
								</el-button>
								<el-button
								    type="primary"
								    size="small"
								    v-show='scope.row.alternateName != ""'
								    @click="createReductionHandle(scope.$index, scope.row)">
								          还原
								</el-button>
								<el-button
								    type="primary"
								    size="small"
								    v-show='scope.row.isTrue && createNewContracts.type ==0'
								    @click.native.prevent="deleteRow4(scope.$index, scope.row)">
								          删除
								</el-button>
							</p>
						</div>
					</template>
				</el-table-column>
            </el-table>
            <div slot="footer" v-show='createNewContracts.type ==0' class="dialog-footer">
				<el-button type="primary" @click="createAddHsPackageMenuList">添加菜品</el-button>
			</div>
		</el-dialog>
			<el-dialog title="添加菜品" :visible.sync="dialogAddmentFormVisible" size='large' :before-close='cancelAddmentHandle'>
			<el-form class='newContractBox' :model='addmentLists' ref='addmentLists'>
                <el-form-item class='inline-form' prop='hsPackageId'>
                    <el-select clearable v-model="addmentLists.hsPackageId" @change='createChangeAddmentSetHandle' placeholder="选择套系">
                        <el-option
                            v-for="item in newCreateContractsets"
                            :key="item.id"
                            :label="item.packageName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop='varietyOfDishe'>
                    <el-select clearable v-model="addmentLists.varietyOfDishe" placeholder="选择菜品">
                        <el-option
                            v-for="item in varietyOfDishes"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item prop='unitPrice'>
                   <el-input v-model="addmentLists.unitPrice" placeholder='单价' auto-complete="off"></el-input>
                </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddmentHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAddmentHandle">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="调整菜品" :visible.sync="dialogAdjustmentFormVisible" size='large' :before-close='cancelAdjustmentHandle'>
			<el-form class='newContractBox' :model='adjustmentLists' ref='adjustmentLists'>
                <el-form-item class='inline-form' prop='hsPackageId'>
                    <el-select clearable v-model="adjustmentLists.hsPackageId" @change='createChangeAdjustmentSetHandle' placeholder="选择套系">
                        <el-option
                            v-for="item in newCreateContractsets"
                            :key="item.id"
                            :label="item.packageName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop='varietyOfDishe'>
                    <el-select clearable v-model="adjustmentLists.varietyOfDishe" placeholder="选择菜品">
                        <el-option
                            v-for="item in varietyOfDishes"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAdjustmentHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAdjustmentHandle">确 定</el-button>
			</div>
		</el-dialog>

		 <el-dialog title="编辑服务项目" :visible.sync="dialogEditServiceFormVisible" :before-close='cancelEditServiceHandle'>
			<el-form :model="editServiceContents">
				<el-form-item :label-width="formLabelWidth">
					<el-input v-model="editServiceContents.name" disabled auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item :label-width="formLabelWidth">
					<el-input type='textarea' class='lengthInput'v-model="editServiceContents.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelEditServiceHandle"
					>取 消</el-button>
				<el-button type="primary" @click="confirmEditServiceHandle">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="增加服务项目" :visible.sync="dialogAddServiceFormVisible" :before-close='cancelAddServiceHandle'>
			<el-form :model="addServiceContents" ref='addServiceContents'>
				<el-form-item :label-width="formLabelWidth" prop='name'>
					<el-select clearable v-model="addServiceContents.name" placeholder="请选择">
                        <el-option
                            v-for="item in createServiceNames"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
				</el-form-item>
				<el-form-item :label-width="formLabelWidth" prop='content'>
					<el-input type='textarea' class='lengthInput'v-model="addServiceContents.content"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddServiceHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAddServiceHandle">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="增加报价" :visible.sync="dialogIncreaseConferenceOfferFormVisible" :before-close='cancelIncreaseConferenceOfferHandle'>
			<el-form :model="IncreaseConferenceOffers" ref='IncreaseConferenceOffers' :rules='IncreaseConferenceOffersRules'>
				<el-form-item label='内容' :label-width="formLabelWidth" prop='content'>
					<el-input v-model="IncreaseConferenceOffers.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label='单位'  :label-width="formLabelWidth" prop='unit'>
					<el-input v-model="IncreaseConferenceOffers.unit" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label='数量'  :label-width="formLabelWidth" prop='quantity'>
					<el-input v-model="IncreaseConferenceOffers.quantity" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label='单价'  :label-width="formLabelWidth" prop='unitPrice'>
					<el-input v-model="IncreaseConferenceOffers.unitPrice" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelIncreaseConferenceOfferHandle">取 消</el-button>
				<el-button type="primary" @click="confirmIncreaseConferenceOfferHandle('IncreaseConferenceOffers')">确 定</el-button>
			</div>
		</el-dialog>
        <el-dialog title="查看内容" :visible.sync="dialogPackageServiceContentTableVisible" size='large'>
			<el-table style='width: 100%' :data="createPackageServiceContentList" border>
                <el-table-column property="content" label="服务内容"></el-table-column>
                <el-table-column property="typeText" label="类别" ></el-table-column>
                <el-table-column property="quantity"label="数量">
                	<template scope="scope">
                		<div class='noBorderInput'>
                			<el-input :type='scope.row.adjustable == 0 ? "number":"text"' :disabled = 'scope.row.adjustable != 0' :min='scope.row.minquantity' v-model="scope.row.quantity" auto-complete="off"></el-input>
                		</div>
					</template>
                </el-table-column>
                <el-table-column property="unit" label="单位"></el-table-column>
            </el-table>
		</el-dialog>
		<el-dialog title="编辑单价" :visible.sync="dialogEditunitPricesFormVisible" size='small' :before-close='cancelEditunitPriceHandle'>
			<el-form :model="editunitPrices" ref='editunitPrices'>
				<el-form-item label='原单价' disabled :label-width="formLabelWidth" prop='oldUnitPrice'>
					<el-input v-model="editunitPrices.oldUnitPrice" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label='新单价'  :label-width="formLabelWidth" prop='newUnitPrice'>
					<el-input v-model="editunitPrices.newUnitPrice" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelEditunitPriceHandle">取 消</el-button>
				<el-button type="primary" @click="confirmEditunitPriceHandle">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="增加项目" :visible.sync="dialogAddServiceItemFormVisible" size='small' :before-close='cancelAddServiceItemHandle'>
			<el-form :model="createAddServiceItems" ref='createAddServiceItems'>
				<el-checkbox-group v-model="checkedConfirmItems" @change="handleCheckedItemsChange">
					<p v-show='createAddServiceItemShows[0]'>
						<el-checkbox label="0">
					    	<div style='display:inline-block'>
					    		<el-form-item label='赠送红酒：'  :label-width="formLabelWidth" prop='freeRedWinNumber'>
									<el-input v-model="createAddServiceItems.freeRedWinNumber" auto-complete="off"></el-input> 瓶
								</el-form-item>
					    	</div>
					    </el-checkbox>
					</p>
				    <p v-show='createAddServiceItemShows[1]'>
				    	 <el-checkbox label="1">
					    	<div style='display:inline-block'>
					    		<el-form-item label='赠送黄酒：'  :label-width="formLabelWidth" prop='freeYellowWinNumber'>
									<el-input v-model="createAddServiceItems.freeYellowWinNumber" auto-complete="off"></el-input> 瓶
								</el-form-item>
					    	</div>
					    </el-checkbox>
				    </p>
				    <p v-show='createAddServiceItemShows[2]'>
				    	<el-checkbox label="2">
					    	<div style='display:inline-block'>
					    		<el-form-item label='赠送婚房：'  :label-width="formLabelWidth" prop='freeWeddingRoomNumber'>
									<el-input disabled v-model="createAddServiceItems.freeWeddingRoomNumber" auto-complete="off"></el-input> 套
								</el-form-item>
					    	</div>
					    </el-checkbox>
				    </p>
				    <p v-show='createAddServiceItemShows[3]'>
				    	<el-checkbox label="3">
					    	<div style='display:inline-block'>
					    		<el-form-item label='赠送婚车：'  :label-width="formLabelWidth" prop='freeWeddingCarNumber'>
									<el-input disabled v-model="createAddServiceItems.freeWeddingCarNumber" auto-complete="off"></el-input> 辆
								</el-form-item>
					    	</div>
					    </el-checkbox>
				    </p>
				    <p v-show='createAddServiceItemShows[4]'>
				    	<el-checkbox label="4">
					    	<div style='display:inline-block'>
					    		<el-form-item label='总优惠：'  :label-width="formLabelWidth" prop='allDiscount'>
									<el-input v-model="createAddServiceItems.allDiscount" auto-complete="off"></el-input> 元
								</el-form-item>
					    	</div>
					    </el-checkbox>
				    </p>
				     <p>
				    	<el-checkbox label="5">
					    	<span class='addItemLable'>二销项目</span></el-input>
					    </el-checkbox>
				    </p>

				</el-checkbox-group>
				<div v-show='isSecondItem' style='margin-top:10px;'>
					<el-form-item label='内容' :label-width="formLabelWidth" prop='content'>
						<el-input v-model="createAddServiceItems.content" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label='单位'  :label-width="formLabelWidth" prop='unit'>
						<el-input v-model="createAddServiceItems.unit" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label='数量'  :label-width="formLabelWidth" prop='quantity'>
						<el-input v-model="createAddServiceItems.quantity" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label='单价'  :label-width="formLabelWidth" prop='unitPrice'>
						<el-input v-model="createAddServiceItems.unitPrice" auto-complete="off"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddServiceItemHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAddServiceItemHandle">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog :title="createSuppleItemTitle" :visible.sync="dialogAddSuppleItemFormVisible" size='small' :before-close='cancelAddSuppleItemHandle'>
			<el-form :model="createAddSuppleItemForms" ref='createAddSuppleItemForms' :rules='createAddSuppleItemFormsRules'>
				<el-form-item prop='content'>
					<el-input type="textarea" v-model="createAddSuppleItemForms.content" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddSuppleItemHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAddSuppleItemHandle('createAddSuppleItemForms')">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="createPaymentConventionListTitle" :visible.sync="dialogPaymentConventionListFormVisible" size='small' :before-close='cancelPaymentConventionListHandle'>
			<el-form :model="createPaymentConventionListForms" ref='createPaymentConventionListForms'>
				<el-form-item prop='percentage' :label-width="formLabelWidth">
					<el-input value='number' max="100" min='0' :disabled='isLastPercentage' :maxlength='3' class='hiddenspan1' v-model="createPaymentConventionListForms.percentage" placeholder='百分比' auto-complete="off" @change='createPaymentPercentChangeHandle'></el-input> %
				</el-form-item>
				<el-form-item prop='money' :label-width="formLabelWidth">
					<el-input value='number' class='hiddenspan1' :disabled='isLastPercentage' v-model="createPaymentConventionListForms.money" placeholder='金额' @change='changePaymentMoneyHandle' auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop='time' :label-width="formLabelWidth">
					 <div class="block">
                        <el-date-picker
                            v-model="createPaymentConventionListForms.time"
                            type="date"
                            :disabled='(createNewContracts.type ==0 || createNewContracts.type ==2) && isPaymentConventListShow'
                            placeholder="最晚付款时间" @change="createPaymentDataChange"
                            :picker-options="pickerOptionsSchedule">
                       </el-date-picker>
                    </div>

				</el-form-item>
				<el-form-item prop='daysRange' :label-width="formLabelWidth">
					<!--<el-input v-model="createPaymentConventionListForms.daysRange" auto-complete="off"></el-input>-->
					 <el-select :disabled='(createNewContracts.type ==0 || createNewContracts.type ==2) && isPaymentConventListShow' clearable v-model="createPaymentConventionListForms.daysRange" @change='changeDaysRangeHandle' @visible-change='changeDaysRangeHandle1' placeholder="请选择日期范围">
                            <el-option v-for="n in daysRanges" :value="n.time" :label='n.text'>{{n.text}}</el-option>
                        </el-select>
				</el-form-item>
				<el-form-item prop='remark' :label-width="formLabelWidth" v-show='isPaymentRemarkShow'>
					<el-input class='hiddenspan1' v-model="createPaymentConventionListForms.remark" placeholder='输入' auto-complete="off"></el-input>前
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelPaymentConventionListHandle">取 消</el-button>
				<el-button type="primary" @click="confirmPaymentConventionListHandle">确 定</el-button>
			</div>
		</el-dialog>



        <!--筛选列表-->
        <el-form :inline="true" :model="researchOrderTable" ref="researchOrderTable" class="demo-form-inline">
            <el-row>
                <el-col>
                    <el-form-item :label-width="researchOrderTableWidth">
                        <el-select v-model="researchOrderTable.cityCode" @change='changeCityHandle' placeholder="城市">
                            <el-option
                                v-for="item in storeCitys"
                                :key="item.cityCode"
                                :label="item.cityName"
                                :value="item.cityCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
		            <el-form-item  prop='orderNo' :label-width="researchOrderTableWidth">
		                <el-input clearable size="small" v-model="researchOrderTable.orderNo" placeholder="订单号" ></el-input>
		            </el-form-item>
		            <el-form-item  prop='agreementNo' :label-width="researchOrderTableWidth">
		                <el-input clearable size="small" v-model="researchOrderTable.agreementNo" placeholder="合同号" ></el-input>
		            </el-form-item>
		            <el-form-item  prop='mobile' :label-width="researchOrderTableWidth">
		                <el-input clearable size="small" v-model="researchOrderTable.mobile" placeholder="客户电话" ></el-input>
		            </el-form-item>
                </el-col>
                <el-col>
                	<el-form-item  prop='scheduleTime' :label-width="researchOrderTableWidth">
		                <div class="block">
		                    <el-date-picker
		                        size="small"
		                        v-model="researchOrderTable.scheduleTime"
		                        type="date"
		                        :editable="false"
		                        placeholder="档期"
		                        format="yyyy-MM-dd"
		                    >
		                    </el-date-picker>
		                </div>
		            </el-form-item>
                	<el-form-item  prop="hallId">
		                <el-select clearable v-model="researchOrderTable.hallId" placeholder="宴会厅" size="small">
		                    <el-option v-for="hall in hallList"
		                        :key="hall.id"
		                        :label="hall.hallName"
		                        :value="hall.id"
		                	></el-option>
		                </el-select>
		            </el-form-item>
		            <el-form-item  prop="scheduleStatus">
		              	<el-select clearable v-model="researchOrderTable.scheduleStatus" placeholder="档期状态" size="small">
		                	<el-option
		                   		 v-for="item in dec.schedule_status"
		                    	 :key="item.dicDesc"
		                   		 :label="item.dicDesc"
		                   		 :value="item.dicValue">
		                	</el-option>
		               	</el-select>
		            </el-form-item>
		            <el-form-item  prop="orderStatus">
		                <el-select clearable v-model="researchOrderTable.orderStatus" placeholder="订单状态" size="small">
		                    <el-option
		                        v-for="item in dec.order_status"
		                        :key="item.dicDesc"
		                        :label="item.dicDesc"
		                        :value="item.dicValue">
		                    </el-option>
		                </el-select>
		            </el-form-item>
		        </el-col>
		        <el-col>
		        	<el-form-item  prop="agreementStatus">
                        <el-select clearable v-model="researchOrderTable.agreementStatus" placeholder="合同状态" size="small">
                            <el-option
                                v-for="item in dec.agreement_status"
                                :key="item.dicDesc"
                                :label="item.dicDesc"
                                :value="item.dicValue">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  prop="startHsAgreementDate">
                         <div class="block">
		                    <el-date-picker
		                        size="small"
		                        v-model="researchOrderTable.startHsAgreementDate"
		                        type="date"
		                        :editable="false"
		                        placeholder="合同开始日期"
		                        format="yyyy-MM-dd"
		                    >
		                    </el-date-picker>
		                </div>
                    </el-form-item>
                    <el-form-item  prop="endHsAgreementDate">
                        <div class="block">
		                    <el-date-picker
		                        size="small"
		                        v-model="researchOrderTable.endHsAgreementDate"
		                        type="date"
		                        :editable="false"
		                        placeholder="合同结束日期"
		                        format="yyyy-MM-dd"
		                    >
		                    </el-date-picker>
		                </div>
                    </el-form-item>
                    <el-form-item>
		                <el-button size="small" type="primary" @click="submitResearchOrderTable">查询</el-button>
		            </el-form-item>
		            <el-form-item>
		                <el-button  size="small" type="primary" @click="resetForm('researchOrderTable')">重置</el-button>
		            </el-form-item>
		        </el-col>
		    </el-row>
        </el-form>
        <!--列表-->
        <el-table :data="allOrderTableData" border style="width: 100%" v-loading="loading.pageList" element-loading-text="拼命加载中">
        	<el-table-column v-if='isShowMoney' prop="orderNo" label="订单号"></el-table-column>
        	<el-table-column v-if='isShowMoney' prop="agreementNo" label="合同号"></el-table-column>
            <el-table-column prop="customerName" label="客户名称"></el-table-column>
            <el-table-column prop="mobileNumber" label="客户电话"></el-table-column>
            <el-table-column prop="type" label="类型" >
                <template scope="scope">
                {{statusText(scope.row.type,'data_type')}}
                </template>
            </el-table-column>
            <el-table-column v-if='isShowMoney' prop="totalAmount" label="总金额"></el-table-column>
            <el-table-column v-if='isShowMoney' prop="dueAmount" label="未收金额"></el-table-column>
            <el-table-column v-if='isShowMoney' prop="receivedAmount" label="已收金额"></el-table-column>
            <el-table-column v-if='isShowMoney' prop="confirmAmount" label="确认金额"></el-table-column>
            <el-table-column prop="scheduleTime" label="档期" width='120px' ></el-table-column>
            <el-table-column prop="scheduleTimeType" label="场次">
                <template scope="scope">
                    {{statusText(scope.row.scheduleTimeType,'schedule_time_type')}}
                </template>
            </el-table-column>
            <el-table-column prop="scheduleStatus" label="档期状态">
                <template scope="scope">
                    {{statusText(scope.row.scheduleStatus,'schedule_status')}}
                </template>
            </el-table-column>
            <el-table-column prop="hallName" label="宴会厅"></el-table-column>
            <el-table-column prop="status" label="订单状态">
                <template scope="scope">
                    {{statusText(scope.row.status,'order_status')}}
                </template>
            </el-table-column>
            <el-table-column prop="agreementTime" label="合同日期" width='120px'>
            	<template scope="scope">
                    {{formTime1(scope.row.agreementTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="agreementStatus" label="合同状态">
                <template scope="scope">
                    {{statusText(scope.row.agreementStatus,'agreement_status')||'无'}}
                </template>
            </el-table-column>
            <el-table-column prop="plannerName" label="策划师"></el-table-column>
            <el-table-column prop="scheduleTime" label="操作" width="120px">
                <template scope='scope'>
                    <div style="padding: 5px 0">
                        <el-button size="mini" type="primary" @click="checkDetailsRow(scope.row)">查看详情</el-button>
						<el-button v-show="scope.row.scheduleStatus==0 || scope.row.scheduleStatus==2 || scope.row.scheduleStatus==5 ||localStorageV!='admin' ? false:true" size="mini" type="danger" @click="checkCalendarRow(scope.row)">直接锁定档期</el-button>
                        <el-button v-show="btnPms('SHENGHE',scope.row) && btnP.allOrderApplyAgreement" @click='applyContactHandle1(scope.row)' size="mini" type="primary">申请合同</el-button>
                        <el-button v-show="btnPms('BIANHE',scope.row) && btnP.allOrderEditOrder" @click='editContactHandle1(scope.row)' size="mini" type="primary">编辑合同</el-button>
                        <el-button v-show="btnPms('GENGHE',scope.row) && btnP.allOrderChangeOrder" size="mini" type="primary" @click="hetongChangRow(scope.row)">变更合同</el-button>
                        <el-button v-show="btnPms('SHENGDANG',scope.row) && btnP.allOrderApplyOrderSchedule" size="mini" type="info" @click="dangqiAddRow(scope.row,0)">申请档期</el-button>
                        <el-button v-show="btnPms('XIUDANG',scope.row) && btnP.allOrderchangeSchdule" size="mini" type="info" @click="dangqiChangRow(scope.row,1)">修改档期</el-button>
                        <el-button v-show="btnPms('QUDING',scope.row) && btnP.allOrderCanelOrder" size="mini" type="danger" @click="deleteRow(scope.row)">取消订单</el-button>
                        <el-button v-show="btnPms('SHENGPI',scope.row) && btnP.allOrderApprovalStatus" size="mini" type="warning" @click="auditRow(scope.row)">审批状态</el-button>
                        <el-button v-show="btnPms('KAIPIAO',scope.row) && scope.row.paymentStatus>=1 && btnP.allOrderReceiptByHand" size="mini" type="success" @click="shoujuRow(scope.row)">手工开收据</el-button>
                         <el-button v-show="btnP.allOrderTurnOutSale && scope.row.status!==4" size="mini" type="success" @click="turnOutSalesHandle(scope.row)">转出</el-button>
                        <el-button v-show="btnP.allOrderTurnOutSale && scope.row.status!==4" size="mini" type="success" @click="directDeleteHandle(scope.row)">直接取消订单</el-button>
                        <el-button v-show="btnP.allOrderTurnOutSale && scope.row.status!==4" size="mini" type="success" @click="directChangeHsHandle(scope.row,2)">直接修改档期</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="审核记录" v-if='btnP.allOrderAuditRecord'>
                <template scope='scope'>
                    <el-button size="mini" type="info" @click="shenghejiluRow(scope.row)">审核记录</el-button>
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
        <el-dialog title="转出给销售" :visible.sync="turnOutSalesVisible" :before-close='cancelTurnOut'>
            <el-form :model="turnOutSlaesData" ref='turnOutSlaesData' :rules="turnOutSlaesRules" label-width="150px">
                <el-form-item label="销售：" prop='salesId'>
					<el-select v-model="turnOutSlaesData.salesId" clearable placeholder="请选择">
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
                <el-button type="primary" @click="confirmTurnOut('turnOutSlaesData')">确定</el-button>
                <el-button @click="cancelTurnOut">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="手工开具纸质收据" :visible.sync="shoujuRowVisible">
            <el-form :model="shoujuRowData" ref='shoujuRowData' :rules="houjuRowRules" label-width="150px">
                <el-form-item label="请选择纸质收据编号" prop='hsPaperReceiptId'>
                    <el-select v-model="shoujuRowData.hsPaperReceiptId" placeholder="请选择">
                        <el-option
                            v-for="item in shoujuNumbers"
                            :key="item.id"
                            :label="item.receiptNo"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="shoujuRowSure('shoujuRowData')">确定</el-button>
                <el-button @click="shoujuRowCancel">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="申请取消合同"  :visible.sync="hetongCancelVisible" :before-close="cancelHetongCancel">
            <el-form>
                <div>
                    <el-form-item class='inline-form' label="合同金额：" :label-width="hetongDetailsWidth">
                        <span class='hiddenspan'>{{hetongCancelData.totalAmount}}</span>
                    </el-form-item >
                    <el-form-item class='inline-form' label="已付：" :label-width="hetongDetailsWidth">
                        <span class='hiddenspan'>{{hetongCancelData.receivedAmount}}</span>
                    </el-form-item >
                    <el-form-item class='inline-form' label="确认已付：" :label-width="hetongDetailsWidth">
                        <span class='hiddenspan'>{{hetongCancelData.confirmAmount}}</span>
                    </el-form-item >
                </div>
                <div>
                    <el-form-item class='inline-form' label="审核流程：" :label-width="hetongDetailsWidth">
                        <span class='hiddenspan' style="width: 500px">{{hetongCancelData.msg}}</span>
                    </el-form-item >
                </div>
                <div>
                    <el-form-item class='inline-form' label="处理意见：" :label-width="hetongDetailsWidth" style="width:500px" >
                        <el-input type="textarea" :maxlength="200" :rows="2" v-model="hetongCancelData.remark"></el-input>
                    </el-form-item >
                </div>
                <el-form-item class='inline-form' label="是否需要退款：" :label-width="hetongDetailsWidth" label-suffix="11111">
                    <el-row>
                        <el-col :span="4"><el-checkbox v-model="hetongCancelData.refundChecked"></el-checkbox></el-col>
                        <el-col :span="20"><el-input
                            placeholder="请输入退款金额"
                            :disabled="!hetongCancelData.refundChecked"
                            size="mini"
                            v-model="hetongCancelData.refundsAmount"
                        >
                        </el-input></el-col>
                    </el-row>
                    </el-form-item>
                <div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitHetongCancel" >确定</el-button>
                <el-button @click="cancelHetongCancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="变更合同"  :visible.sync="hetongChangeVisible" :before-close='cancelSubmitChangeHandle'>
            <el-row style="margin-bottom: 15px">
                <el-col>
                    原合同信息
                </el-col>
            </el-row>

            <el-table :data='changeOrderTableData' border style="width: 100%">
                <el-table-column prop="scheduleTime" label="婚礼日"></el-table-column>
                <el-table-column prop="storeName" label="门店"></el-table-column>
                <el-table-column prop="hallName" label="宴会厅"></el-table-column>
                <el-table-column prop="scheduleTimeType" label="场次">
                	<template scope="scope">
	                    {{statusText(scope.row.scheduleTimeType,'schedule_time_type')}}
	                </template>
                </el-table-column>
            </el-table>
            <el-row style="margin: 30px 0">
              <el-col>
                <el-switch
                    v-model="hetongDelaySwitch"
                    on-text="延期"
                    off-text="不延期"
                    :width="75"
                >
                </el-switch>
            </el-col>
            </el-row>
            <div>
                <el-row style="margin: 20px 0" v-show="hetongDelaySwitch">
                    <el-col>
                        <p style="color:red">按照公司规定，办理延期，婚礼前6个月免费，婚礼前1个月到6个月需要收取违约金，婚礼前不到一个月不允许延期。</p>
                        <br>
                        <p>延期申请提交后，首先需要财务确认已收未确认款项</p>
                    </el-col>
                </el-row>
                <el-row style="margin: 20px 0">
                    <el-col>
		                <el-form :model='changeOrderFormsData' ref='changeOrderFormsData' :rules='changeOrderFormsDataRules'>
		                    <div v-show="!hetongDelaySwitch" >
		                        <el-form-item prop='schedule' class='inline-form'>
		                            	<div class="block">
						                    <el-date-picker
			                                    v-model="changeOrderFormsData.schedule"
			                                    type="date"
			                                    placeholder="档期"
			                                    format="yyyy-MM-dd">
			                                </el-date-picker>
		                            	</div>
		                        </el-form-item>
		                        <el-form-item prop='scheduleTimeType' class='inline-form' >
		                            <el-select clearable v-model="changeOrderFormsData.scheduleTimeType" placeholder="场次">
                                		<el-option
                                    		v-for="item in dec.schedule_time_type"
                                    		:key="item.dicValue"
                                   		    :label="item.dicDesc"
                                   		    :value="item.dicValue">
                               		    </el-option>
                            	   </el-select>
		                        </el-form-item>
		                        <el-form-item prop='banquetHall' class='inline-form'>
		                            <el-select clearable v-model="changeOrderFormsData.banquetHall" @change='createChangeBanquetHandle2' multiple placeholder="宴会厅">
		                                <el-option
		                                    v-for="item in banquetHalls"
		                                    :key="item.id"
		                                    :label="item.hallName"
		                                    :value="item.id"
		                                    >
		                                </el-option>
		                            </el-select>
		                        </el-form-item>
		                    </div>
		                    <el-form-item label="延期时间" prop='delayType' v-show="hetongDelaySwitch" >
		                        <el-select v-model="changeOrderFormsData.delayType" placeholder="请选择">
		                            <el-option
		                                v-for="item in dec.delay_type"
		                                :key="item.dicValue"
                                   		:label="item.dicDesc"
                                   		:value="item.dicValue">
		                            </el-option>
		                        </el-select>
		                    </el-form-item>
		                    <el-form-item label="变更费用" prop='changeAmount' label-width='68px' style="width:220px">
		                        <el-input v-model='changeOrderFormsData.changeAmount' placeholder="请添加变更费用" size="small"></el-input>
		                    </el-form-item>
		                    <el-form-item prop='remark' label="变更原因" label-width="68px" style="width:500px" v-show="!hetongDelaySwitch">
		                        <el-input v-model='changeOrderFormsData.remark' type="textarea" :maxlength="200" :rows="2" placeholder="填写变更原因"></el-input>
		                    </el-form-item >
		                </el-form>
	                </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click='cirfirmSubmitChangeHandle("changeOrderFormsData")'>确定</el-button>
                <el-button @click="cancelSubmitChangeHandle">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="审核记录"  :visible.sync="shenghejiluVisible" >
            <el-table  border style="width: 100%" :data="shenghejiluTable">
                <el-table-column prop="type" label="审核事项">
                    <template scope="scope">
                        {{statusText(scope.row.type,'HS_REVIEW_TYPE')}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="审核内容"></el-table-column>
                <el-table-column prop="checkTime" label="审核时间">
                    <template scope="scope">
                        {{format12(scope.row.checkTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="checkStatus" label="审核状态">
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
        <el-dialog title="档期"  :visible.sync="dangqiVisible" :before-close='cancelSubmitSchduleHandle'>
            <el-form :model='dangqiChangRowData' ref='dangqiChangRowData' :rules='dangqiChangRowDataRules'>
	            <el-form-item class='inline-form' prop='scheduleTime'>
	                <div class="block">
	                    <el-date-picker
                            v-model="dangqiChangRowData.scheduleTime"
                            type="date"
                            :editable="false"
                            placeholder="档期">
                        </el-date-picker>
	                </div>
	            </el-form-item>
	            <el-form-item class='inline-form' prop='scheduleTimeType'>
	                <el-select clearable v-model="dangqiChangRowData.scheduleTimeType" placeholder="场次">
	                    <el-option
	                        v-for="item in dec.schedule_time_type"
	                        :key="item.dicValue"
	                        :label="item.dicDesc"
	                        :value="item.dicValue">
	                    </el-option>
	                </el-select>
	            </el-form-item>
                <el-form-item class='inline-form' prop='banquetHall'>
                    <el-select
                        v-model='dangqiChangRowData.banquetHall'
                        multiple
                        placeholder="宴会厅"
                        @change="changeBanquetRow"
                        >
                        <el-option
                            v-for="hall in banquetHalls"
                            :key="hall.id"
                            :label="hall.hallName"
                            :value="hall.id"
                        ></el-option>
                    </el-select>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click='submitSchduleHandle("dangqiChangRowData")'>提交</el-button>
                <el-button @click="cancelSubmitSchduleHandle">取 消</el-button>
            </div>

        </el-dialog>
        <el-dialog :visible.sync="btmVisible" size='full' :before-close="pageClose">
                    <component :is="componentName" :hsOrderId="hsOrderId" :isPrintPage='isPrintPage'></component>
        </el-dialog>



    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue'
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




	import $ from 'jQuery'
    import  moment from 'moment'
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
        	var validateMobile = (rule, value, callback) => {
	            if (!/^1(3|4|5|7|8)\d{9}$/.test(value)){
	                callback(new Error('手机号不正确'));
	            } else {
	                callback();
	            }
	        }

            return {

				localStorageV:localStorage.getItem("UserId"),
            	isHaveAllDiscount:true,
            	editunitPriceIsTrue:true,
            	createChangeSetVisible:true,
            	pickerOptionsScheduleFirst:{
            		
            	},
            	turnOutSalesVisible:false,
            	salesIds:[],
            	turnOutSlaesRow:'',
            	turnOutSlaesData:{
            		salesId:'',
            	},
            	turnOutSlaesRules:{
            		salesId:[
                        {required: true, message: '请选择销售', trigger: 'change'}
                    ],
            	},

            	isDontEat:false,
            	isShowMoney:false,
                loading:{
                    pageList:false,
                    detail:false
                },
            	changeOrderTableData:[],
            	changeOrderId:'',
            	changeOrderFormsData:{
            		schedule:'',
            		scheduleTimeType:'',
            		banquetHall:[],
            		delayType:'',
            		changeAmount:'',
            		remark:'',
            	},
            	changeOrderFormsDataRules:{
            		schedule:[
                        {type: 'date', required: true, message: '请选择档期', trigger: 'change'}
                    ],
                    scheduleTimeType:[
                        {type:'number', required: true, message: '请选择场次', trigger: 'change'}
                    ],
                    banquetHall:[
                        {type:'array', required: true, message: '请选择宴会厅', trigger: 'change'}
                    ],
            	},
            	paymentHistory:[
            		{'index':0,'time':'','text':'','remark':''},
            		{'index':1,'time':'','text':'','remark':''},
            		{'index':2,'time':'','text':'','remark':''},
            		{'index':3,'time':'','text':'','remark':''},
            	],
            	isHaveSchduletime:false,
            	isHaveMoney:false,
                hetongCancelData:{
                    msg:'',
                    totalAmount:'',
                    receivedAmount:"",
                    confirmAmount:"",
                    refundChecked:false,
                    refundsAmount:'',
                    hsOrderId:'',
                    remark:""
                },
            	tableTitle:'桌数',
            	applyDiscountPlaceholder:'',
            	estimateTableNumber:'',
            	oldestimateTableNumber:'',
            	tableNumber:'',
            	oldtableNumber:'',
            	allDiscountBtn:true,
            	createApplyDiscountIndex:'',
            	repeatedCommit:false,
            	paymentOk:false,
            	paymentOk1:true,
            	allOrderTableDataRow:'',
                isPrintPage:false,
                allComponents: [],
                componentName: '',
                hsOrderId:'',
                btmVisible:false,
                researchOrderTableWidth:"100px",
                researchOrderTable:{
                    cityCode:'',
                    scheduleStatus:'',
                    agreementStatus:'',
                    orderStatus:'',
                    hallId:"",
                    orderNo:'',
                    agreementNo:'',
                    mobile:'',
                    scheduleTime:'',
                    startHsAgreementDate:'',
					endHsAgreementDate:'',
                },
                allOrderTableData:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                shenghejiluTable:[],
                shengheTableData:{
                    hsOrderId:''
                },
                storeCitys:[],
                hallList:[],
                hallListCopy:[],
                openCity:[],
                dec:{
                    data_type:[],
                    order_status:[],
                    schedule_status:[],
                    agreement_status:[],
                    schedule_time_type:[],
                    print_item:[],
                    payment_item:[],
                    order_type:[],
                    involice_type:[],
                    delay_type:[],
                    dinnerTable_type:[],
                    VERIFY_STATUS:[],
                    HS_REVIEW_TYPE:[]
                },
                shoujuNumbers:[],
                shoujuRowVisible:false,
                shoujuRowData:{
                    hsOrderId:'',
                    hsPaperReceiptId:''
                },
                houjuRowRules:{
                    hsPaperReceiptId:[
                        {required: true, message: '请选择一张', trigger: 'change'}
                    ]
                },
                hetongRowVisible:false,
                hsOrderDialogTitle:'',
                isCreateOrderHandle:'',
                isCreateOrderHandle1:'',
                isCreateOrderHandle2:'',
                hetongDetailsTable:{},
                hetongDetailsWidth:'100px',
                hetongCancelVisible:false,
                refundChecked:false,
                hetongChangeVisible:false,
                hetongDelaySwitch:false,
                shenghejiluVisible:false,
                shenghePagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                dangqiVisible:false,
                dangqiChangRowData:{
                    hsOrderId:'',
                    hallId:'',
                    scheduleTime:'',
                    banquetHall:[],
                    scheduleTimeType:'',
                    storeId:''

                },
                dangqiChangRowDataRules: {
                	scheduleTime: [
			            {  type: 'date', required: true, message: '请选择档期', trigger: 'change' },
			          ],
			          scheduleTimeType: [
			            {  type: 'number', required: true, message: '请选择场次', trigger: 'change' },
			          ],
			          banquetHall: [
			          	{ type:'array', required: true, message: '请选择宴会厅', trigger: 'change' },
			          ]
                },
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
                paymentStatus:'',



               	 //创建订单
               	 oldApplyIdea:'',
               	 isSecondApplyOrder:'',
               	 dataId:'',
				 hsAgreementDTOId:'',
               	 orderHandleNumber:'',
               	 isLookOrder:false,
               	 applyContactRow:'',
               	 isSubmitOrClear:false,
               	 isShowFinishOrder:true,
                customers:{},
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
                oldTableNumber:'',
                involiceTypes:{},
                saveDays:{},
                banquetHalls:[],
                pickerOptions0:{},
                dialogNewContract:false,
                isScheduleValide:true,
                isTabsValide:true,
                isTabsValide1:true,
                isShoujuValide:false,
                isNotMetting:true,
                screeningType:'',
                screeningIdea:'',


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
				createEssentialInformationsrules:{
			        groomName: [
			            { required: true, message: '请输入新郎姓名', trigger: 'blur' },
			        ],
			        groomMobile: [
			            { required: true, message: '请输入新郎手机号', trigger: 'blur' },
			            { max:11,message: '手机号码为11位', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
			        ],
			        brideName: [
			            { required: true, message: '请输入新娘姓名', trigger: 'blur' },
			        ],
			        brideMobile: [
			            { required: true, message: '请输入新娘手机号', trigger: 'blur' },
			            { max:11,message: '手机号码为11位', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
			        ],
			      	partyA: [
			            { required: true, message: '请输入甲方姓名', trigger: 'blur' },
			        ],
			        partyAId: [
			            { required: true, message: '请输入甲方身份证号', trigger: 'blur' }
			        ],
				},
				createEssentialInformationsrules1:{
			        partyA: [
			            { required: true, message: '请输入甲方姓名', trigger: 'blur' },
			        ],
			        partyAContacts: [
			            { required: true, message: '请输入甲方联系人', trigger: 'blur' },
			        ],
			        partyAMobile: [
			        	{ required: true, message: '请输入甲方联系人手机号', trigger: 'blur' },
			        	{ max:11,message: '手机号码为11位', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
			        ],
			        partyBContacts: [
			            { required: true, message: '请输入乙方姓名', trigger: 'blur' },
			        ],
			        partyBMobile: [
			            { required: true, message: '请输入乙方联系人手机号', trigger: 'blur' },
			            { max:11,message: '手机号码为11位', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
			        ],
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
				applyDiscountRules:{
					discount:[
						{ required: true, message: '请输入优惠金额', trigger: 'blur' },
					]
				},

				createHsPackageMenuList:[],  //菜单
				hsPackageItemList:[],
				dialogApplyDiscountFormVisible:false,
				dialogPackageMenuTableVisible:false,



                formLabelWidth:'80px',
                activeName: '1',
                isWeddingType:true,
                isWeddingType1:false,

                isInvoiceValide:false,
                hsPackageServiceItemList:[],  //价格内容/服务内容
                followDetailsTable:[],
                radioStatus:'0',
                radioStatus1:'0',
                radioSchedules:'0',
                dialogEditServiceFormVisible:false,
                editServiceContents:{  //编辑服务内容
                	name:'',
                	content:''
                },
                editServiceIndex:'',
                dialogAddServiceFormVisible:false,
                addServiceContents:{
                	name:'',
                	content:''
                },
                dialogIncreaseConferenceOfferFormVisible:false,
				IncreaseConferenceOffers:{  //会务增加报价
					content:'',
					unit:'',
					quantity:'',
					unitPrice:''
				},
				IncreaseConferenceOffersRules:{
					content:[
						{ required: true, message: '请输入内容', trigger: 'blur' },
					],
					unit:[
						{ required: true, message: '请输入单位', trigger: 'blur' },
					],
					quantity:[
						{ required: true, message: '请输入数量', trigger: 'blur' },
					],
					unitPrice:[
						{ required: true, message: '请输入单价', trigger: 'blur' },
					],
				},
				dialogPackageServiceContentTableVisible:false,
				createPackageServiceContentList:[],
				createPackageServiceContentList1:[],

				dialogEditunitPricesFormVisible:false,
				editunitPrices:{  //编辑报价
					oldUnitPrice:'',
					newUnitPrice:'',
				},
				editUnitPriceIndex:'',

				dialogAdjustmentFormVisible:false,
				varietyOfDishes:[],
				adjustmentLists:{  //调整菜品
					hsPackageId:'',
					varietyOfDishe:''
				},
				dialogAddmentFormVisible:false,
				addmentLists:{  //添加菜品
					hsPackageId:'',
					varietyOfDishe:'',
					unitPrice:''
				},
				adjustmentListIndex:'',
				createAllAcount:0,  //总金额
				createAllReceivedAcount:0,  //已收金额
				createDiscountAllAcount:0,

				createServiceNames:[],  //增加服务项目
				banquetHalls1:[],

				dialogAddServiceItemFormVisible:false,
				checkedConfirmItems:[],
				createAddServiceItems:{
					freeRedWinNumber:1,
					freeYellowWinNumber:1,
					freeWeddingRoomNumber:'1',
					freeWeddingCarNumber:'1',
					allDiscount:'',
					content:'',
					unit:'',
					quantity:'',
					unitPrice:''
				},
				isSecondItem:false,

				createAddServiceItemShows:[true,true,true,true,true],

				createSupplementaryItems:[],  //补充事项
				dialogAddSuppleItemFormVisible:false,
				createAddSuppleItemForms:{
					content:'',
				},
				createAddSuppleItemFormsRules:{
					content: [
			            { required: true, message: '请输入内容', trigger: 'blur' },
			        ],
				},
				createEditSuppleItemIndex:'',
				createSuppleItemTitle:'',

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
						paymentItem:'定金',
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
				createPaymentConventionListForms:{
					percentage:'',
					money:'',
					time:'',
					daysRange:'',
					remark:'',
				},
				isPaymentRemarkShow:false,
				createPaymentConventionListTitle:'',
				createPaymentConventionListRow:'',
				createPaymentConventionListIndex:'',
				createIsAddPayment:false,
				isLastPercentage:false,
				createIsChangePaymentTime:false,
				dialogPaymentConventionListFormVisible:false,
				daysRanges:[],
				daysRange1:[
					{time:0,text:'婚礼举办当天'},
					{time:1,text:'婚礼举办前1日内'},
					{time:2,text:'婚礼举办前2日内'},
					{time:3,text:'婚礼举办前3日内'},
					{time:4,text:'婚礼举办前4日内'},
					{time:5,text:'婚礼举办前5日内'},
					{time:6,text:'婚礼举办前6日内'},
					{time:7,text:'婚礼举办前7日内'},
				],
				daysRange2 : [
					{time:6,text:'婚礼举办前6个月内'},
					{time:5,text:'婚礼举办前5个月内'},
					{time:4,text:'婚礼举办前4个月内'},
					{time:3,text:'婚礼举办前3个月内'},
					{time:2,text:'婚礼举办前2个月内'},
					{time:1,text:'婚礼举办前1个月内'},
					{time:28,text:'婚礼举办前4周内'},
					{time:21,text:'婚礼举办前3周内'},
					{time:14,text:'婚礼举办前2周内'},
				],
				daysRange3:[
					{time:0,text:'签约当日'},
					{time:1,text:'签约后1日'},
					{time:2,text:'签约后2日'},
					{time:3,text:'签约后3日'},
					{time:4,text:'签约后4日'},
					{time:5,text:'签约后5日'},
					{time:6,text:'签约后6日'},
					{time:7,text:'签约后7日'},
					{time:8,text:'签约后8日'},
					{time:9,text:'签约后9日'},
					{time:10,text:'签约后10日'},
				],
				daysRange4:[
					{time:0,text:'会议活动当日'},
					{time:1,text:'会议活动前1日内'},
					{time:2,text:'会议活动前2日内'},
					{time:3,text:'会议活动前3日内'},
					{time:4,text:'会议活动前4日内'},
					{time:5,text:'会议活动前5日内'},
					{time:6,text:'会议活动前6日内'},
					{time:7,text:'会议活动前7日内'},
				],
				daysRange5 : [
					{time:6,text:'会议活动前6个月内'},
					{time:5,text:'会议活动前5个月内'},
					{time:4,text:'会议活动前4个月内'},
					{time:3,text:'会议活动前3个月内'},
					{time:2,text:'会议活动前2个月内'},
					{time:1,text:'会议活动前1个月内'},
					{time:28,text:'会议活动前4周内'},
					{time:21,text:'会议活动前3周内'},
					{time:14,text:'会议活动前2周内'},
				],
				daysRange6:[
					{time:0,text:'签约当日'},
					{time:1,text:'签约后1日内'},
					{time:2,text:'签约后2日内'},
					{time:3,text:'签约后3日内'},
					{time:4,text:'签约后4日内'},
					{time:5,text:'签约后5日内'},
					{time:6,text:'签约后6日内'},
					{time:7,text:'签约后7日内'},
				],
				isPaymentConventListShow:false,
				pickerOptionsSchedule:{},
				btnP:{
					allOrderApplyOrder: "",  //申请订单
		            allOrderApplyAgreement: "",  //申请合同
		            allOrderChangeOrder: "",  //变更合同
		            allOrderApplyOrderSchedule: "",  //申请档期
		            allOrderSupplementReceipt: "",  //补开收据
		            allOrderCanelOrder: "",  //取消订单
		            allOrderEditOrder: "",  //编辑合同
		            allOrderchangeSchdule: "",  //修改档期
		            allOrderApprovalStatus: "",  //审批状态
		            allOrderReceiptByHand: "",  //手工开收据
		            allOrderAuditRecord: "",  //审核记录
		            allOrderTurnOutSale:'',  //转出销售
				}
            }
        },
        methods: {
        	formTime1(row){
        		if(row == null){
					return '空'
                }
                else{
                	console.log(row.length)
                    return moment(Number(row)).format('YYYY-MM-DD')
                }
        	},
        	changeStartTimeHandle(val){
        		this.createEssentialInformations1.startTime = val
        		console.log(this.createEssentialInformations1.startTime)
        	},
        	changeEndTimeHandle(val){
        		this.createEssentialInformations1.endTime = val
        	},
            pageClose(){
                this.btmVisible=false
                this.componentName=''
            },
            printTemplate(row){//打印
                this.btmVisible=true
                this.componentName=row.formatAddress
                this.hsOrderId=row.hsOrderId
                this.isPrintPage=true
            },
            previewTemplate(row){ //预览
                this.btmVisible=true
                this.componentName=row.formatAddress
                this.hsOrderId=row.hsOrderId
                this.isPrintPage=false
            },
            changeBanquetRow(val){ //申请或修改档期弹框-改变宴会厅
               this.changeBanquetMetnods(val,this.dangqiChangRowData.banquetHall)
            },
            dangqiAddRow(row,number){//申请档期按钮
            	this.allOrderTableDataRow = number
                this.dangqiVisible=true;
                this.dangqiChangRowData.hsOrderId=row.id;
            },
            submitSchduleHandle(formName){  //提交申请档期
            	let data = []
            	for(var i=0;i<this.dangqiChangRowData.banquetHall.length;i++){
            		let a = {
            			'storeId':this.dangqiChangRowData.storeId,
	                	'scheduleTime':moment(this.dangqiChangRowData.scheduleTime).format('YYYY-MM-DD'),
	                	'scheduleTimeType':this.dangqiChangRowData.scheduleTimeType,
	                	'hallId':this.dangqiChangRowData.banquetHall[i],
            		}
            		data.push(a)
            	}
            	if(this.allOrderTableDataRow == 0){
            		this.$refs[formName].validate((valid) => {
				        if (valid) {
				        	let self = this
			                self.$axios({
								url: "/order/saveOrderSchedule?hsOrderId="+self.dangqiChangRowData.hsOrderId,
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
									self.initAllOrderList(self.tableData)
									self.cancelSubmitSchduleHandle()
								}else {
									self.$message.error(res.data.msg)
								}
							});
				        } else {
				             this.$message.error('请填写必要信息！')
		                     return false;
				        }
			        });
            	}
            	else if(this.allOrderTableDataRow == 1){
            		let self = this
            		self.$axios({
								url: "/order/saveOrderSchedule?hsOrderId="+self.dangqiChangRowData.hsOrderId,
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
									self.initAllOrderList(self.tableData)
									self.cancelSubmitSchduleHandle()
								}else {
									self.$message.error(res.data.msg)
								}
							});
            	}else if(this.allOrderTableDataRow == 2){
                    let self = this
                    self.$axios({
                        url: "/order/directChangeHsSchedule?hsOrderId="+self.dangqiChangRowData.hsOrderId,
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
                            self.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            self.initAllOrderList(self.tableData)
                        }else {
                            self.$message.error(res.data.msg)
                        }
                    });
                }

            },
            cancelSubmitSchduleHandle(){  //取消提交档期
            	 this.$refs['dangqiChangRowData'].resetFields();
            	 this.dangqiVisible=false;
            	 this.dangqiChangRowData = {
                    hsOrderId:'',
                    hallId:'',
                    scheduleTime:'',
                    banquetHall:[],
                    scheduleTimeType:'',
                    storeId:''
                }
            },
            directChangeHsHandle(row,number){//直接档期按钮
                this.dangqiVisible=true;
                this.allOrderTableDataRow = number
                this.dangqiChangRowData.hsOrderId=row.id
                this.dangqiChangRowData.scheduleTime = row.scheduleTime
                this.dangqiChangRowData.scheduleTimeType=row.scheduleTimeType
                let arr = row.hallId.split(',')
                for(var i=0;i<arr.length;i++){
                    if(arr[i] != ''){
                        this.dangqiChangRowData.banquetHall.push(arr[i])
                    }
                }
            },
            dangqiChangRow(row,number){//修改档期按钮
                this.dangqiVisible=true;
                this.allOrderTableDataRow = number
                this.dangqiChangRowData.hsOrderId=row.id
				this.dangqiChangRowData.scheduleTime = row.scheduleTime
                this.dangqiChangRowData.scheduleTimeType=row.scheduleTimeType
                if(row.hallId){
                    let arr = row.hallId.split(',')
                    for(var i=0;i<arr.length;i++){
                        if(arr[i] != ''){
                            this.dangqiChangRowData.banquetHall.push(arr[i])
                        }
                    }
                    this.changeBanquetMetnods(this.dangqiChangRowData.banquetHall[0],this.dangqiChangRowData.banquetHall)
                }else {
                    row.hsSchedule.banquetHallList.forEach((e)=>{
                        if(e.id!=''){
                            this.dangqiChangRowData.banquetHall.push(e.id)
                        }
                    })
                    this.changeBanquetMetnods(this.dangqiChangRowData.banquetHall[0],this.dangqiChangRowData.banquetHall)
                }

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
                this.shengheTableData.hsOrderId=row.id
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
            btnPms(btnName,row){//列表按钮权限
                let a=row.status
                let b=row.scheduleStatus
                let c=row.agreementStatus
                let btnPms;
                if(a==0&&b==0&&c==null){
                    btnPms='btn-1'
                }else if(a==0&&b==0&&c==0){
                    btnPms='btn-2'
                }else if(a==1&&b==0&&c==null){
                    btnPms='btn-3'
                }else if(a==2&&b==0&&c==null){
                    btnPms='btn-4'
                }else if(a==1&&b==0&&c==0){
                    btnPms='btn-5'
                }else if(a==2&&b==0&&c==0){
                    btnPms='btn-6'
                }else if(a==0&&b==1&&c==null){
                    btnPms='btn-7'
                }else if(a==0&&b==1&&c==0){
                    btnPms='btn-8'
                }else if(a==3&&b==1&&c==7){
                    btnPms='btn-9'
                }else if(a==1&&b==3&&c==null){
                    btnPms='btn-10'
                }else if(a==2&&b==3&&c==null){
                    btnPms='btn-11'
                }else if(a==1&&b==3&&c==0){
                    btnPms='btn-12'
                }else if(a==2&&b==3&&c==0){
                    btnPms='btn-13'
                }else if(a==1&&b==5&&c==null){
                    btnPms='btn-14'
                }else if(a==4&&b==5&&c==null){
                    btnPms='btn-15'
                }else if(a==1&&b==5&&c==0){
                    btnPms='btn-16'
                }else if(a==4&&b==5&&c==0){
                    btnPms='btn-17'
                }else if(a==3&&b==2&&c==1){
                    btnPms='btn-18'
                }else if(a==3&&b==2&&c==3){
                    btnPms='btn-19'
                }else if(a==3&&b==2&&c==2){
                    btnPms='btn-20'
                }else if(a==3&&b==4&&c==4){
                    btnPms='btn-21'
                }else if(a==3&&b==2&&c==4){
                    btnPms='btn-22'
                }else if(a==3&&b==2&&c==5){
                    btnPms='btn-23'
                }else if(a==4&&b==5&&c==6){
                    btnPms='btn-24'
                }else if(a==3&&b==4&&c==5){
                    btnPms='btn-25'
                }else if(b==5&&c==5){
                    btnPms='btn-26'}
                else if(a==3&&b==3&&c==7){
                        btnPms='btn-27'
                    }
                else if(c==9){
                    btnPms='btn-28'
                }
                else if(c==8){
                    btnPms='btn-29'
                }
                switch (btnName){
                    case 'KAIPIAO': //手工开收据
                        switch (btnPms){
                            case 'btn-1':
                                return true;
                                break;
                            case 'btn-7':
                                return true;
                                break;
                            case 'btn-9':
                                return true;
                                break;
                            case 'btn-18':
                                return true;
                                break;
                            case 'btn-27':
                                return true;
                                break;
                            default:
                                return false;
                        }
                        break;
                    case 'SHENGPI'://审批状态
                        switch (btnPms){
                            case 'btn-19':
                                return true;
                                break;
                            case 'btn-23':
                                return true;
                                break;
                            case 'btn-25':
                                return true;
                                break;
                            case 'btn-26':
                                return true;
                                break;
                            default:
                                return false;
                        }
                        break;
                    case 'SHENGDANG'://申请档期
                    switch (btnPms){
                        case 'btn-1':
                            return true;
                            break;
                        case 'btn-2':
                            return true;
                            break;
                        case 'btn-3':
                            return true;
                            break;
                        case 'btn-4':
                            return true;
                            break;
                        case 'btn-5':
                            return true;
                            break;
                        case 'btn-6':
                            return true;
                            break;
                        default:
                            return false;
                    }
                    break;
                    case 'SHENGHE'://申请合同
                        switch (btnPms){
                            case 'btn-1':
                                return true;
                                break;
                            case 'btn-3':
                                return true;
                                break;
                            case 'btn-4':
                                return true;
                                break;
                            case 'btn-7':
                                return true;
                                break;
                            case 'btn-10':
                                return true;
                                break;
                            case 'btn-11':
                                return true;
                                break;
                            default:
                                return false;
                        }
                        break;
                    case 'XIUDANG'://修改档期
                        switch (btnPms){
                            case 'btn-7':
                                return true;
                                break;
                            case 'btn-8':
                                return true;
                                break;
                            default:
                                return false;
                        }
                        break;
                    case 'BIANHE'://编辑合同
                        switch (btnPms){
                            case 'btn-2':
                                return true;
                                break;
                            case 'btn-5':
                                return true;
                                break;
                            case 'btn-6':
                                return true;
                                break;
                            case 'btn-8':
                                return true;
                                break;
                            case 'btn-12':
                                return true;
                                break;
                            case 'btn-13':
                                return true;
                                break;
                            default:
                                return false;
                        }
                        break;
                    case 'GENGHE'://变更合同
                        switch (btnPms){
                            case 'btn-18':
                                return true;
                                break;
                            case 'btn-20':
                                return true;
                                break;
                            case 'btn-21':
                                return true;
                                break;
                            case 'btn-22':
                                return true;
                                break;
                            default:
                                return false;
                        }
                        break;
                    case 'QUDING'://取消订单
                        switch (btnPms){
                            case 'btn-1':
                                return true;
                                break;
                            case 'btn-2':
                                return true;
                                break;
                            case 'btn-3':
                                return true;
                                break;
                            case 'btn-5':
                                return true;
                                break;
                            case 'btn-7':
                                return true;
                                break;
                            case 'btn-8':
                                return true;
                                break;
                            case 'btn-10':
                                return true;
                                break;
                            case 'btn-11':
                                return true;
                                break;
                            case 'btn-12':
                                return true;
                                break;
                            case 'btn-14':
                                return true;
                                break;
                            case 'btn-16':
                                return true;
                                break;
                            case 'btn-18':
                                return true;
                                break;
                            case 'btn-20':
                                return true;
                                break;
                            case 'btn-21':
                                return true;
                                break;
                            case 'btn-22':
                                return true;
                                break;
                            case 'btn-27':
                                return true;
                                break;
                            case 'btn-28':
                                return true;
                                break;
                            default:
                                return false;
                        }
                        break;
                    default:
                        return false;

                }
            },
            hetongChangRow(row){//变更合同按钮
            	this.changeOrderId = row.id
            	this.hetongChangeVisible=true
            	if(row.hallName != '' || row.hallName !=null){
            		var sArr = row.hallName.split(" ")
	                for(var i=0;i<sArr.length;i++){
	                	if(sArr[i] != ''){
	                		let a = {
		                 		'scheduleTime':row.scheduleTime,
		                 		'storeName':row.storeName,
		                 		'hallName':sArr[i],
		                 		'scheduleTimeType':row.scheduleTimeType
		                 	}
		                 	 this.changeOrderTableData.push(a)
	                	}
	                }
            	}


            },
            hetongChangRow1(){
            	this.hetongChangRow(this.applyContactRow)
            },
            cancelSubmitChangeHandle(){
            	this.$refs['changeOrderFormsData'].resetFields();
            	this.changeOrderTableData = []
				this.hetongChangeVisible = false
            },
            cirfirmSubmitChangeHandle(roleForm){  //确定提交变更合同
            	if(this.hetongDelaySwitch){
            		let self = this
            		let data = []
					if(self.changeOrderFormsData.changeAmount === '' || self.changeOrderFormsData.delayType === ''){
						if(self.changeOrderFormsData.changeAmount == ''){
							self.$message.error('请填写变更金额！')
							return
						}
						if(self.changeOrderFormsData.delayType === ''){
							self.$message.error('请选择延期类型！')
							return
						}
					}
					else{
						self.$axios({
							url: "/order/changeAgreement?isDelay="+1+'&delayType='+self.changeOrderFormsData.delayType+'&hsOrderId='+self.changeOrderId+'&changeAmount='+self.changeOrderFormsData.changeAmount,
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
									message: '成功变更',
									type: 'success'
								});
								self.initAllOrderList(self.tableData)
								self.cancelSubmitChangeHandle()
							}else {
								self.$message.error(res.data.msg)
							}
						});
					}
            	}
            	else{
            		let self = this
					self.$refs[roleForm].validate((valid) => {
						if (valid) {
							let data = []
							if(self.changeOrderFormsData.changeAmount === '' || self.changeOrderFormsData.remark == ''){
								if(self.changeOrderFormsData.changeAmount == ''){
									self.$message.error('请填写变更金额！')
									return
								}
								if(self.changeOrderFormsData.remark == ''){
									self.$message.error('请填写变更原因！')
									return
								}
							}
							else{
								let data = []
								for(var i=0;i<self.changeOrderFormsData.banquetHall.length;i++){
									let a = {
										"hallId":self.changeOrderFormsData.banquetHall[i],
										"scheduleTimeType":self.changeOrderFormsData.scheduleTimeType,
										"scheduleTime": moment(self.changeOrderFormsData.schedule).format('YYYY-MM-DD'),
										'storeId':self.banquetHalls[0].storeId,
										'hsOrderId':self.changeOrderId,
									}
									data.push(a)
								}
								self.$axios({
									url: "/order/changeAgreement?changeAmount="+self.changeOrderFormsData.changeAmount+'&isDelay='+0+'&remark='+self.changeOrderFormsData.remark+'&hsOrderId='+self.changeOrderId+'&delayType='+self.changeOrderFormsData.delayType,
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
										self.$message({
											message: '成功变更',
											type: 'success'
										});
										self.initAllOrderList(self.tableData)
										self.cancelSubmitChangeHandle()
									}else {
										self.$message.error(res.data.msg)
									}
								});
							}
						} else {
							self.$message.error('请填写必要的基本信息！')
							self.activeName = '1'
							return false;
						}
					})

            	}
            },
            applyContactHandle(){  //申请合同
            	this.checkDetailsRow1(this.applyContactRow)
            	this.isSecondApplyOrder = true
            	this.isCreateOrderHandle1 = true
            	this.isCreateOrderHandle2 = true
                this.isCreateOrderHandle = false
            	this.hsOrderDialogTitle = '申请合同'
            	this.isTabsValide = false
            	this.isTabsValide1 = false
            	this.repeatedCommit = false
            },
            editContactHandle(){  //编辑合同
            	this.checkDetailsRow1(this.applyContactRow)
            	this.isSecondApplyOrder = true
            	this.isCreateOrderHandle = false
            	this.isCreateOrderHandle1 = true
            	this.isCreateOrderHandle2 = true
            	this.hsOrderDialogTitle = '编辑合同'
                this.isTabsValide = false
                this.isTabsValide1 = false
                this.repeatedCommit = false
            },
			applyContactHandle1(row){  //申请合同
				this.isSecondApplyOrder = true
            	this.checkDetailsRow1(row)
            	this.isCreateOrderHandle1 = true
            	this.isCreateOrderHandle2 = true
                this.isCreateOrderHandle = false
            	this.hsOrderDialogTitle = '申请合同'
            	this.isTabsValide = false
            	this.isTabsValide1 = false
            	this.repeatedCommit = false
            	this.createNewContracts.customer = row.hsCustomerId;
            	this.createNewContracts.type = row.type;
            	this.createNewContracts.contrantIdea = row.intentionStatus;
            	this.createAllAcount = row.totalAmount
            	if(row.scheduleTime !=null){
            		this.isHaveSchduletime = true
            	}
            	else{
            		this.isHaveSchduletime = false
            	}
            	this.isLookOrder = false
            },
            editContactHandle1(row){  //编辑合同
            	this.isSecondApplyOrder = true
            	this.checkDetailsRow1(row)
            	this.isCreateOrderHandle = false
            	this.isCreateOrderHandle1 = true
            	this.isCreateOrderHandle2 = true
            	this.hsOrderDialogTitle = '编辑合同'
                this.isTabsValide = false
                this.isTabsValide1 = false
                this.repeatedCommit = false
                this.createNewContracts.customer = row.hsCustomerId;
                this.createNewContracts.type = row.type;
                this.createNewContracts.contrantIdea = row.intentionStatus;
                this.createAllAcount = row.totalAmount
                this.isLookOrder = false
            },
            cancelHetongCancel(){ //取消申请合同
                this.hetongCancelVisible=false
                this.hetongCancelData.refundChecked=false
                this.hetongCancelData.refundsAmount=null
                this.hetongCancelData.remark=''
            },
            submitHetongCancel(){
                let data={
                    hsOrderId:this.hetongCancelData.hsOrderId,
                    totalAmount:this.hetongCancelData.totalAmount,
                    refundsAmount:this.hetongCancelData.refundsAmount
                }
                data.isRefunds=this.hetongCancelData.refundChecked?'1':'0'
                data.refundsAmount=this.hetongCancelData.refundChecked?data.refundsAmount:' '
                if(this.hetongCancelData.refundChecked){
                    if(!data.refundsAmount){
                        alert("退款金额不能为空")
                    } else if(data.refundsAmount>data.totalAmount){
                        alert("退款金额不能大于总金额")
                    }else {
                        this.$axios.post('/order/cancelAgreement',data).then((res)=>{
                            if(res.data.res==0){
                                this.initAllOrderList(this.tableData);
                                this.hetongCancelVisible=false
                                this.$message({
                                    type: 'success',
                                    message: '取消订单成功!'
                                });
                            }else {
                                alert(res.data.msg)
                            }
                        })
                    }
                }else {
                    this.$axios.post('/order/cancelAgreement',data).then((res)=>{
                        if(res.data.res==0){
                            this.initAllOrderList(this.tableData);
                            this.hetongCancelVisible=false
                            this.$message({
                                type: 'success',
                                message: '取消订单成功!'
                            });
                        }else {
                            alert(res.data.msg)
                        }
                    })
                }

            },//提交订单按钮
            deleteRow(row){ //取消订单按钮
                let deleteType=row.agreementStatus
                switch (deleteType){
                    case 1:
                    case 2:
                    case 4:
                    case 9:
                        this.hetongCancelVisible=true;
                        this.hetongCancelData.totalAmount=row.totalAmount
                        this.hetongCancelData.receivedAmount=row.receivedAmount
                        this.hetongCancelData.confirmAmount=row.confirmAmount
                        this.hetongCancelData.hsOrderId=row.id
                        this.$axios.post('/order/getAgreementCancelDetails',{hsOrderId:row.id}).then((res)=>{
                            if(res.data.res==0){
                              this.hetongCancelData.msg=res.data.msg
                            }else {
                                alert(res.data.msg)
                            }
                        })
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
                                    this.cancelNewContractHandle()
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
                        break;
                }
            },
            directDeleteHandle(row){ ////直接取消订单按钮
                this.$confirm('此操作将直接取消订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/order/directCancelOrder',{hsOrderId:row.id}).then((res)=>{
                        if(res.data.res==0){
                            this.initAllOrderList(this.tableData);
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
            getAllHsPackageList(){
            	this.$axios.post('/order/getHsPackageList',{'type':this.createNewContracts.type,'cityCode':this.researchOrderTable.cityCode}).then((res)=>{  //获取所有套系
	                if(res.data.res == '0'){
	                    this.newCreateContractsets = res.data.msg;

	                }
	            })
            },
            sortarrFundsList(arr){
			    for(var i=0;i<arr.length-1;i++){
		            for(var j=0;j<arr.length-1-i;j++){
		                let a = arr[j].type
			            let b = arr[j+1].type
			            if(a>b){
			                var c = arr[j]
			                arr[j] = arr[j+1]
			                arr[j+1] = c
			            }
		            }
		        }
			    return arr;
			},
            checkDetailsRow(row){  //查看合同详情按钮
            	this.applyContactRow = row
            	this.checkDetailsRow1(row)
            	this.isCreateOrderHandle = false
            	this.repeatedCommit = true
	            this.isLookOrder = true
	            this.isTabsValide1 = true
	            this.hsOrderDialogTitle = '合同详情'
	            this.isCreateOrderHandle1 = false
	            this.isCreateOrderHandle2 = false
	            this.isHaveSchduletime = false
	            if(row.agreementStatus === null || row.agreementStatus === ''){
	                this.isTabsValide = true
	            }
	            else{
	                this.isTabsValide = false
	            }
            },

			// 修改当期状态事件
			checkCalendarRow(row){
			// console.log("33333333",row)
			
			var mymessage=confirm("您确定要修改档期状态吗?");
			if(mymessage==true){
				this.$axios.post('/order/updHsOrderStatus',{'id':row.id}).then((res)=>{  //获取所有套系
			    	// console.log("11111111111",res)
				})
				this.initAllOrderList(this.tableData)
			}else{
				
			}
			

			
			},

            checkDetailsRow1(row){
            	this.createChangeSetVisible = false;
                this.$loading({text:'拼命加载中'})
                this.createNewContracts.banquetHall = []
                this.createAllAcount = row.totalAmount
                this.dataId = row.id
                this.dialogNewContract=true
                this.screeningType  = row.type
                this.createNewContracts.customer = row.hsCustomerId;
                this.createNewContracts.type = row.type;
                this.createNewContracts.contrantIdea = row.intentionStatus;
                this.paymentStatus=row.paymentStatus
                this.getAllHsPackageList()
                this.getAllBanquets()
                if(row.type == 0){
                	this.isWeddingType = true
                }else{
                	this.isWeddingType = false
                }
                this.$axios.post('/order/getHsOrderDetail',{hsOrderId:row.id}).then((res)=>{
                	let self = this
                    if(res.data.res=='0'){
                    	self.hetongDetailsTable=res.data.msg
	                    self.hsOrderDetailList = res.data.msg
	                    self.createAllReceivedAcount = res.data.msg.receivedAmount
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
							self.createNewContracts.schedule = row.scheduleTime
			        		self.createNewContracts.scheduleTimeType =
			        		row.scheduleTimeType
				            self.hsOrderDetailList.hsSchedule.scheduleTime = moment(row.scheduleTime).format('YYYY-MM-DD')
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
					        self.createNewContracts.banquetHall = []
			            }
		                if(res.data.msg.hsAgreementFundsList.length){
		                	res.data.msg.hsAgreementFundsList = this.sortarrFundsList(res.data.msg.hsAgreementFundsList)
		                	if(self.hsOrderDialogTitle === '申请合同'){
		                		self.radioStatus1 = '0'
								self.createNewContracts.receiptId=''
								if(self.screeningType == 0 || self.screeningType == 2){
									self.createPaymentConventionList = self.createPaymentConventionList1
								}
								else{
									self.createPaymentConventionList = self.createPaymentConventionList2
								}
		                	}
		                	else{
		                		let length1 = ''
		                		let length2 = ''
		                		let length3 = ''
		                		self.radioStatus1 = String(res.data.msg.hsAgreementFundsList[0].receiptType)
			                    self.shoujuNumbers.forEach((n)=>{
									if(n.id==res.data.msg.hsAgreementFundsList[0].hsPaperReceiptId) {
									    self.createNewContracts.receiptId=n.receiptNo
									}
								})
								self.createPaymentConventionList = []
				                	for(var i=0;i<res.data.msg.hsAgreementFundsList.length;i++){
					                    let amount = res.data.msg.hsAgreementFundsList[i].amount
					                    let type = res.data.msg.hsAgreementFundsList[i].type
					                    let lastPaymentTime = res.data.msg.hsAgreementFundsList[i].lastPaymentTime
					                    let percentage = res.data.msg.hsAgreementFundsList[i].percentage
		                                if(type ==2 || type ==3 || type == 4){

		                                    let a = {
		                                        paymentItem:'',
		                                        amount:amount,
		                                        percentageOfPayment:percentage,
		                                        lastPaymentTime:'',
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
		                                    if(lastPaymentTime ==null){
		                                        a.lastPaymentTime = ''
		                                    }
		                                    else{
		                                        a.lastPaymentTime = moment(lastPaymentTime).format('YYYY-MM-DD')
		                                    }
		                                    self.createPaymentConventionList.push(a)
		                                }
					                }
		                	}
		                }
		                else{
		                	if(self.screeningType == 0 || self.screeningType == 2){
								self.createPaymentConventionList = self.createPaymentConventionList1
							}
							else{
								self.createPaymentConventionList = self.createPaymentConventionList2
							}
		                }
	                    if(res.data.msg.hsAgreementDTO !=null){
				 			self.hsAgreementDTOId = res.data.msg.hsAgreementDTO.id
	                    	res.data.msg.agreementNo = res.data.msg.hsAgreementDTO.agreementNo
							self.createAllAcount = res.data.msg.hsAgreementDTO.totalAmount
		                    res.data.msg.partyA = res.data.msg.hsAgreementDTO.partyA
		                    self.createEssentialInformations = res.data.msg.hsAgreementDTO  //婚宴基本信息
		                    self.createEssentialInformations1 = res.data.msg.hsAgreementDTO  //会务，宝宝宴基本信息
		                    self.hsPackageServiceItemList = res.data.msg.hsAgreementDTO.hsAgrPkgServiceItemList //服务内容
		                    self.hsPackageItemList = res.data.msg.hsAgreementDTO.hsAgrPackageItemList //项目
		                    self.createSupplementaryItems = res.data.msg.hsAgreementDTO.hsAgrPkgSupplementMattersList //补充事项
		                    self.createHsPackageMenuList = res.data.msg.hsAgreementDTO.hsAgrPackageMenuList  //菜单
		                    self.createPackageServiceContentList = res.data.msg.hsAgreementDTO.hsAgrPkgServiceContentList
		                    self.createPackageServiceContentList1 = res.data.msg.hsAgreementDTO.hsAgrPkgServiceContentList
		                    console.log(self.createPackageServiceContentList)
		                    let hsPackageItemListNumber = 0
		                    self.hsPackageItemList.forEach((n)=>{
								if(n.content != '总优惠'){
									hsPackageItemListNumber++
									if(hsPackageItemListNumber == self.hsPackageItemList.length){
										this.isHaveAllDiscount = true
									}
									else{
										this.isHaveAllDiscount = false
									}
								}
								else{
									this.isHaveAllDiscount = false
								}

							})
		                    self.hsPackageServiceItemList.forEach((n)=>{
									Vue.set(n,'applyTrue',true)
								})
							self.createHsPackageMenuList.forEach((e)=>{
								Vue.set(e,'alterPakename','')
								e.alternateName = e.adjustName
								self.newCreateContractsets.forEach((n)=>{
									if( e.hsPackageId==n.id){
									    e.pakename = n.packageName
									}
									if(e.adjustPackageId==n.id){
									    e.alterPakename = n.packageName
									}
								})
							})
							let hsPackageServiceContentTypes = self.dicData.HS_PACKAGE_SERVICE_CONTENT_TYPE;
					        self.createPackageServiceContentList.forEach((e)=>{
					        	e.minquantity = e.quantity
								hsPackageServiceContentTypes.forEach((n)=>{
								    if( e.type==n.dicValue){
									    e.typeText = n.dicDesc
									}

								})

							})



		                    if(res.data.msg.hsAgreementDTO.hsAgrPackageDTO != null){
		                    	if(res.data.msg.hsAgreementDTO.hsAgrPackageDTO.id !=null && res.data.msg.hsAgreementDTO.hsAgrPackageDTO.id !=''){
		                    		self.hsAgrPackageId = res.data.msg.hsAgreementDTO.hsAgrPackageDTO.id
		                    	}
		                    	else{
		                    		self.hsAgrPackageId = ''
		                    	}
		                    	self.createPriceContents = res.data.msg.hsAgreementDTO.hsAgrPackageDTO  //套系信息
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
	                    	self.hsAgreementDTOId = ''
	                    }
                    	let data = [0,1,2,3,4,5]

                    	self.$axios({
							url: "/order/getAgreementPrintList?hsOrderId="+row.id,
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

									if(res1.data.msg != null && res1.data.msg.length){
										self.followDetailsTable =  res1.data.msg
										for(var i=0;i<self.followDetailsTable.length;i++){
											self.dec.print_item.forEach((n)=>{
							                    if(n.dicValue==self.followDetailsTable[i].type) {
							                        res1.data.msg[i].type=n.dicDesc
							                    }
							                })
							                self.followDetailsTable[i].createTime = moment(self.followDetailsTable[i].createTime).format('YYYY-MM-DD')
										}
									}

								}else {
									alert(res1.data.msg)
								}
							});
                	}else {
                    	alert(res.data.msg)
                	}
                    this.$loading().close()
                })

            },
            auditRow(row){ //审核状态按钮
                this.shoujuRowData.hsOrderId=row.id
                this.$axios.post('/order/getReviceStatus',{hsOrderId:row.id}).then((res)=>{
                    if(res.status==200){
                        this.$notify.info({
                            title: '消息',
                            message: res.data.msg.reviceStatusStr,
                            offset: 200
                        });
                    }else {
                        alert(res.data.msg)
                    }
                })
            },
            getUsedHsPaperReceiptList(){
            	this.$axios.post('/order/getUsedHsPaperReceiptList',{'salesId':JSON.parse(localStorage.getItem("userInfo")).id}).then((res)=>{
                    if(res.data.res == '0'){
                        this.shoujuNumbers = res.data.msg
                    }
                })
            },
            turnOutSalesHandle(row){  //转出销售
            	this.turnOutSlaesRow = row
            	this.turnOutSalesVisible = true
	            this.$axios.post('/s/getSalesList',{'cityCode':this.researchOrderTable.cityCode}).then((res4)=>{
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
            },
            confirmTurnOut(formName){
            	this.turnOutSalesVisible = false
            	 this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/order/hsOrderTollOutSalesId',{'salesId':this.turnOutSlaesData.salesId,'hsOrderId':this.turnOutSlaesRow.id}).then((res)=>{
                            if(res.data.res==0){
                                this.initAllOrderList(this.tableData)
                                this.cancelTurnOut()
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        })
                    }
                })
            },
            cancelTurnOut(){
            	this.turnOutSalesVisible = false
            	this.$refs['turnOutSlaesData'].resetFields()
            },
            shoujuRow(row){ //手工开取收据按钮
                this.shoujuRowVisible=true
                this.shoujuRowData.hsOrderId=row.id
            },
            shoujuRowSure(formName){//手工开取收据按钮-提交
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/order/renewHsPaperReceipt',this.shoujuRowData).then((res)=>{
                            if(res.data.msg=="success"){
                                this.initAllOrderList(this.tableData)
                                this.shoujuRowCancel()
                            }else{
                                this.$message.error(res.data.msg)
                            }
                        })
                    }})
            },
            shoujuRowCancel(){//手工开取收据按钮-取消
                this.shoujuRowVisible=false
                this.$refs['shoujuRowData'].resetFields()
            },
            submitResearchOrderTable(){//提交条件筛选表格
                this.researchOrderTable.scheduleTime?this.researchOrderTable.scheduleTime=moment(this.researchOrderTable.scheduleTime).format('YYYY-MM-DD'):''
                this.researchOrderTable.startHsAgreementDate?this.researchOrderTable.startHsAgreementDate=moment(this.researchOrderTable.startHsAgreementDate).format('YYYY-MM-DD'):''
                this.researchOrderTable.endHsAgreementDate?this.researchOrderTable.endHsAgreementDate=moment(this.researchOrderTable.endHsAgreementDate).format('YYYY-MM-DD'):''
                this.initAllOrderList(this.tableData)
            },
            resetForm(formName){//重置表格筛选条件
                this.$refs[formName].resetFields();
            },
            handleSizeChange(val) {//订单列表分页
                this.pagination.pageSize = val;
                this.initAllOrderList(this.tableData)
            },
            handleCurrentChange(val) { //订单列表分页
                this.pagination.pageNow = val;
                this.initAllOrderList(this.tableData)
            },
             initAllOrderList(data){//初始化订单列表
                 this.loading.pageList=true
                this.$axios.post('/order/getOrderList',data).then((res)=> {
					console.log("查询搜友数据",res)
                    if (res.data.res == '0') {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.allOrderTableData=res.data.msg.list;
                    }else{
                        this.$message.error(res.data.msg)
                    }
                    this.loading.pageList=false
                })
            },
            initCity(){ //初始化默认用户第一个城市
                this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
                this.researchOrderTable.cityCode=this.storeCitys[0].cityCode
            },
            initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
                this.dec.order_status=this.dicData.HS_ORDER_STATUS//订单状态
                this.dec.schedule_status=this.dicData.HS_SCHEDULE_STATUS //档期状态
                this.dec.agreement_status=this.dicData.HS_AGREEMENT_STATUS//合同状态
                this.dec.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
                this.dec.print_item=this.dicData.HS_PRINT_ITEM//打印名称
                this.dec.payment_item=this.dicData.HS_AGREEMENT_FUNDS_TYPE  //付款名称
                this.dec.order_type = this.dicData.MOBILE_HS_ORDER_TYPE  //订单意向
                this.dec.involice_type = this.dicData.HS_PAYMENT_INVOICE_TYPE
                this.dec.delay_type = this.dicData.HS_AGREEMENT_CHANGE_DEALY_TYPE //延期时间类型
                this.dec.dinnerTable_type = this.dicData.DINING_TABLE_FORM_TYPE  //餐桌形式
                this.dec.VERIFY_STATUS = this.dicData.VERIFY_STATUS //审核状态
                this.dec.HS_REVIEW_TYPE = this.dicData.HS_REVIEW_TYPE  //审核类型

            },
            changeCityHandle(){
            	this.getAllBanquets()
            	this.initAllOrderList(this.tableData)
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







            //创建订单方法
            hallListText(e){
            	let text = ''
            	if(e.length){
            		for(var i=0;i<e.length;i++){
            			text = text + ' ' + e[i].hallName
            		}
            	}
            	return text
            },
        	createTableNumberHandle1(val){
        		if(this.createNewContracts.type != 1){
        			if(this.isWeddingType){
	        			if(this.createNewContracts.type == 0){
		            		let isTrue=''
		            		if(val<this.tableNumber){
		            			isTrue = true
		            		}

		            		if(val >= this.tableNumber){
		            			if(val == this.tableNumber && this.oldtableNumber>this.tableNumber){
		            				this.$confirm('桌数小于等于套系默认桌数时，会清除套系外的项目，是否确认?', '提示', {
				                        confirmButtonText: '确定',
				                        cancelButtonText: '取消',
				                        type: 'warning'
				                   }).then(() => {
				                        this.$message({
				                        	type: 'success',
				                            message: '操作成功!'
				                        });
				                    }).catch(() => {
				                        this.$message({
				                            type: 'info',
				                            message: '已取消操作'
				                        });
				                        return false
				                    });
		            			}
			                    this.hsPackageServiceItemList.forEach((n)=>{
									if(n.name.substring(0,3) == '套系外'){
										n.quantity = val - this.oldTableNumber
										n.totalAmount = n.quantity*n.unitPrice
									}
								})
								this.hsPackageItemList.forEach((n)=>{
									if(n.content.substring(0,3) == '套系外' || n.name == '免'){
										n.quantity = val - this.oldTableNumber
										n.totalAmount = n.quantity*n.unitPrice
									}
									if(n.content == '升级菜单'){
										n.quantity = val
										n.totalAmount = n.quantity*n.unitPrice
									}
								})
		            		}
		            	}
	        		}
	        		else{
	        			if(val >= this.tableNumber){
		        			if(val == this.tableNumber && this.oldtableNumber>this.tableNumber){
		        				this.$confirm('桌数小于等于套系默认桌数时，会清除套系外的项目，是否确认?', '提示', {
			                        confirmButtonText: '确定',
			                        cancelButtonText: '取消',
			                        type: 'warning'
			                   }).then(() => {
			                        this.$message({
			                        	type: 'success',
			                            message: '操作成功!'
			                        });
			                    }).catch(() => {
			                        this.$message({
			                            type: 'info',
			                            message: '已取消操作'
			                        });
			                        return false
			                    });
		        			}
			                if(this.createNewContracts.type == 2){
			            		this.hsPackageServiceItemList.forEach((n)=>{
									if(n.name.substring(0,3) == '套系外'){
										n.quantity = val - this.oldTableNumber
										n.totalAmount = n.quantity*n.unitPrice
									}
								})
			            	}
			            	this.hsPackageItemList.forEach((n)=>{
								if(n.content.substring(0,3) == '套系外' || n.name == '免'){
									n.quantity = val - this.oldTableNumber
									n.totalAmount = n.quantity*n.unitPrice
								}
								else{
									if(n.packageType == '0'){
										n.quantity = val
										n.totalAmount = n.quantity*n.unitPrice
									}
								}
							})
		        		}
	        		}
        		}
        		else{
        			if(this.createNewContracts.type == 1){
        				this.editunitPriceIsTrue = true
        			}
        			if(this.createNewContracts.type == 2){
			            this.hsPackageServiceItemList.forEach((n)=>{
							if(n.name.substring(0,3) == '套系外'){
								n.quantity = val - this.oldTableNumber
								n.totalAmount = n.quantity*n.unitPrice
							}
						})
			        }
			        this.hsPackageItemList.forEach((n)=>{
						if(n.content.substring(0,3) == '套系外' || n.name == '免'){
							n.quantity = val - this.oldTableNumber
							n.totalAmount = n.quantity*n.unitPrice
						}
						else{
							if(n.packageType != 1){
								n.quantity = val
								n.totalAmount = n.quantity*n.unitPrice
							}
						}
					})
        		}

        		this.createReturnAllAcount()
	        	this.oldtableNumber = val
        	},

            orderApplyHandle(){  //申请订单按钮
            	this.isCreateOrderHandle = true
            	this.isCreateOrderHandle1 = true
            	this.isCreateOrderHandle2 = true
                this.dialogNewContract = true;
                this.isSecondApplyOrder = false
                this.repeatedCommit = false
                this.isTabsValide = true;
                this.isLookOrder = false;
                this.isDontEat = false
                this.hsAgrPackageId = '';
                this.isHaveAllDiscount = true;
                this.createPaymentConventions.paymentConvention = '0'
                this.hsOrderDialogTitle = '创建订单'
                this.createPaymentConventionList1 = [
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
				]
				this.createPaymentConventionList2 = [
					{
						paymentItem:'定金',
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
				]
                this.involiceTypes = this.dec.involice_type
                let newData = {}
                if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey=== 'DEPT:SALES'){
 					newData = {
 						'salesId':JSON.parse(localStorage.getItem("userInfo")).id
 					}
 				}
 				else{
 					newData = {}
 				}
 				if(self.screeningType == ''){
 					this.createPaymentConventionList = this.createPaymentConventionList1
 				}

                this.$axios.post('/customer/getHsCustomerStoreList',newData).then((res)=>{  //获取所有客户
                    if(res.data.res == '0'){
                        this.customers = res.data.msg
                        for(var i=0;i<this.customers.length;i++){
                        	this.$set(this.customers[i], 'customerNames', this.customers[i].customerName+'-'+this.customers[i].mobile)
                            if(this.customers[i].customerName == null && this.customers[i].mobile !=''){
                                this.$set(this.customers[i], 'customerNames', ''+'-'+this.customers[i].mobile)
                            }
                        }
                    }
                })

             	 this.createNewContracts = {
                    customer:'',
                    type:'',
                    contrantIdea:'',
                    saveDay:'',
                    schedule:'',
                    scheduleTimeType:'',
                    banquetHall:[],
                    receiptId:''
                }
            },
            getAllBanquets(){
            	this.$axios.get('/store/getHallList',{params:{'pageSize':100,'cityCode':this.researchOrderTable.cityCode,'status':0}}).then((res)=>{  //获取所有宴会厅
                    if(res.data.res == '0'){
                    	this.banquetHalls = res.data.msg.list;
                    	this.banquetHalls1 = res.data.msg.list;
                    	this.hallList=res.data.msg.list
                        this.hallListCopy=res.data.msg.list
                    }
             	 })
            },
            changeBanquetMetnods(val,e){  //改变宴会厅通用方法
            	let arr = [];
            	if(val.length){
	            	for(var i=0;i<this.banquetHalls.length;i++){
	            		if(this.banquetHalls[i].id == e[e.length-1]){
	            			let storeId = this.banquetHalls[i].storeId
	            			console.log(this.banquetHalls)
	            			this.banquetHalls.forEach((n)=>{
							    if( n.storeId==storeId){
							        arr.push(n)
							    }
							})
	            		}
	            	}
	            	this.banquetHalls = arr
            	}
            	else{
					this.banquetHalls = this.banquetHalls1
            	}
            },
            createChangeBanquetHandle(val){  //改变宴会厅
            	this.changeBanquetMetnods(val,this.createNewContracts.banquetHall)
            },
            createChangeBanquetHandle2(val){  //改变宴会厅2
            	this.changeBanquetMetnods(val,this.changeOrderFormsData.banquetHall)
            },
            startDateChange(val){  //档期
				this.createNewContracts.schedule = val
				if(this.isCreateOrderHandle){
					this.createPaymentConventionList.forEach((m)=>{
		                m.amount = ''
		                m.percentageOfPayment = ''
		                m.lastPaymentTime = ''
		            })
				}
            },
			changeOrderDateChange(val){
				this.changeOrderFormsData.schedule = val
			},

            changeContrantIdea(val){  //改变订单意向
            	if(!this.isLookOrder){
	                this.createNewContracts.receiptId = '';
	                if((this.oldApplyIdea == 1 || this.oldApplyIdea == 2) && (val == 1 || val == 2)){

	                }
	                else{
	                	if(!this.isCreateOrderHandle){
	                		this.createNewContracts.saveDay = '';
			                this.createNewContracts.schedule = '';
			                this.createNewContracts.scheduleTimeType = ''
			                this.createNewContracts.banquetHall = [];
	                	}
	                }
            	}
				if(this.isCreateOrderHandle){
					if(val == 1){
	                    this.saveDays = 7;
	                    this.isTabsValide = true;
	                }
	                else if(val == 2){
	                    this.saveDays = 15;
	                    this.isTabsValide = true;
	                }
	                else if(val == ''){
	                    this.saveDays = [];
	                    this.isTabsValide = true;

	                }
	                else{
	                    this.saveDays = [];
	                    this.activeName = '1';
	                    this.isTabsValide = false;
	                }
				}

                if(this.isSubmitOrClear){
                	if((val == '1' || val == '2') && this.screeningIdea == '3' && this.isShowFinishOrder){
	                    this.$confirm('确定放弃之前对合同所做的所有操作?', '提示', {
	                        confirmButtonText: '确定',
	                        cancelButtonText: '取消',
	                        type: 'warning'
	                    }).then(() => {
	                        this.screeningIdea = val;
	                        this.$refs['createEssentialInformations'].resetFields();
	                        this.$refs['createEssentialInformations1'].resetFields();
	                        this.hsPackageServiceItemList = [];
	                        this.hsPackageItemList = [];
	                        this.createSupplementaryItems = [];
	                        if(this.createNewContracts.type === 1){
			                	this.createPaymentConventionList = this.createPaymentConventionList2
			                }
			                else{
			                	this.createPaymentConventionList = this.createPaymentConventionList1
			                }
	                        this.followDetailsTable = [];
	                        this.createHsPackageMenuList = [];
	                        this.createPackageServiceContentList = [];
	                        this.$message({
	                        	type: 'success',
	                            message: '操作成功!'
	                        });
	                    }).catch(() => {
	                        this.$message({
	                            type: 'info',
	                            message: '已取消操作'
	                        });
	                        return false
	                    });
	                }
	                else{
	                    this.screeningIdea = val;
	                }
                }
                else{
                	this.screeningIdea = val;
	                this.$refs['createEssentialInformations'].resetFields();
	                this.$refs['createEssentialInformations1'].resetFields();
	                this.hsPackageServiceItemList = [];
	                this.hsPackageItemList = [];
	                this.createSupplementaryItems = [];
	                if(this.createNewContracts.type === 1){
	                	this.createPaymentConventionList = this.createPaymentConventionList2
	                }
	                else{
	                	this.createPaymentConventionList = this.createPaymentConventionList1
	                }
	                this.followDetailsTable = [];
	                this.createHsPackageMenuList = [];
	                this.createPackageServiceContentList = [];
                }

				this.oldApplyIdea = val
            },
            changeReceiptHandle(val){  //改变是否开收据
                if(val == 1){
                    this.isShoujuValide = true
                }
                else{
                    this.isShoujuValide = false;
                    this.createNewContracts.receiptId = ''
                }
            },
            changeReceiptHandle1(val){  //改变是否开收据
                if(val == 1){
                    this.isShoujuValide = true
                }
                else{
                    this.isShoujuValide = false;
                    this.createNewContracts.receiptId = ''
                }
            },
            changeInvoiceHandle(val){  //是否开发票
                if(val == '1'){
                    this.isInvoiceValide = true
                }
                else{
                    this.isInvoiceValide = false;
                    this.createPaymentConventions.paymentConventionType = ''
                    this.createPaymentConventions.invoiceRemark  = ''
                }
            },
            changeSchedulesHandle(val){  //改变档期
                if(val == 0){
                    this.isScheduleValide = true
                }
                else{
                	this.isScheduleValide = false;
	                this.createNewContracts.schedule = '';
					this.createNewContracts.scheduleTimeType='';
					this.createNewContracts.banquetHall=[]
                }
            },
            changeTypeHandle(val){  //改变类型
            	if(!this.isLookOrder){
            		this.createAllAcount = 0;
	            	this.createNewContracts.saveDay = '';
	                this.createNewContracts.receiptId = '';
	            	this.$refs['createPriceContents'].resetFields();
	                this.activeName = '1'
            	}

                if(val == '0'){
                    this.isWeddingType = true;
                    this.tableTitle = '桌数'
                }
                else{
                    this.isWeddingType = false
                    this.tableTitle = '保证桌数'
                    if(val == '1'){
	                    this.isNotMetting = false;
	                    this.isWeddingType1 = true;

	                }
	                else{
	                    this.isNotMetting = true;
	                    this.isWeddingType1 = false;
	                }
                }
				this.getAllHsPackageList()

				if(this.isSubmitOrClear){
					 if( (this.screeningType=='0' || this.screeningType == '1' || this.screeningType=='2') && this.screeningIdea == '3' && this.isShowFinishOrder){
	                    this.$confirm('确定放弃之前对合同所做的所有操作?', '提示', {
	                        confirmButtonText: '确定',
	                        cancelButtonText: '取消',
	                        type: 'warning'
	                    }).then(() => {
	                        this.screeningType = val;
	                        this.$refs['createEssentialInformations'].resetFields();
	                        this.$refs['createEssentialInformations1'].resetFields();
	                        this.hsPackageServiceItemList = [];
	                        this.hsPackageItemList = [];
	                        this.createSupplementaryItems = [];
	                        if(this.createNewContracts.type === 1){
			                	this.createPaymentConventionList = this.createPaymentConventionList2
			                }
			                else{
			                	this.createPaymentConventionList = this.createPaymentConventionList1
			                }
	                        this.followDetailsTable = [];
	                        this.createHsPackageMenuList = [];
	                        this.createPackageServiceContentList = [];
	                        this.$message({
	                            type: 'success',
	                            message: '操作成功!'
	                        });
	                    }).catch(() => {
	                        this.$message({
	                            type: 'info',
	                            message: '已取消操作'
	                        });
	                    });
	                }
	                else{
	                    this.screeningType = val;
	                }
				}
				else{
					this.screeningType = val;
	                this.$refs['createEssentialInformations'].resetFields();
	                this.$refs['createEssentialInformations1'].resetFields();
	                this.hsPackageServiceItemList = [];
	                this.hsPackageItemList = [];
	                this.createSupplementaryItems = [];
	                if(this.createNewContracts.type === 1){
	                	this.createPaymentConventionList = this.createPaymentConventionList2
	                }
	                else{
	                	this.createPaymentConventionList = this.createPaymentConventionList1
	                }
	                this.followDetailsTable = [];
	                this.createHsPackageMenuList = [];
	                this.createPackageServiceContentList = [];
				}

            },
			createLookContractHandle(index,row){  //查看订单
				this.dialogPackageMenuTableVisible = true
			},
			 handleClick(tab, event) {  //改变分页
				if(tab.name == 3 && this.isCreateOrderHandle){
					if(this.createNewContracts.type === 1){
	                	this.createPaymentConventionList = this.createPaymentConventionList2
	                }
	                else{
	                	this.createPaymentConventionList = this.createPaymentConventionList1
	                }
				}


            },
            createAddHsPackageMenuList(){  //添加菜品
            	this.dialogAddmentFormVisible = true
            },
            createChangeAddmentSetHandle(val){  //改变菜品套系
            	this.$axios.post('/order/getHsPackageDetail',{'type':this.createNewContracts.type,'hsPackageId':this.addmentLists.hsPackageId}).then((res)=>{  //获取所有套系数据
	                    if(res.data.res == '0'){
	                    	this.varietyOfDishes = res.data.msg.hsPackageMenuList;

	                    }
	             })
            },
            confirmAddmentHandle(){  //确定添加菜品
            	let data = {
            		name:'',
            		pakename:'',
            		alternateName:'',
            		alterPakename:'',
            		isTrue:true,
            		type:1,
            	}
            	let newNata = {
					name:'',
					content:'',
					creatorName:'',
					quantity:'',
					unit:'',
					unitPrice:'',
					totalAmount:''
				};
				data.creatorName = JSON.parse(localStorage.getItem("userInfo")).nickName;
				data.name = '升级';
				data.quantity = this.createPriceContents.tableNumber;
				data.unit = '桌';
				data.content = '升级菜单';
				data.unitPrice =  Math.round(this.addmentLists.unitPrice);
				data.totalAmount = this.createPriceContents.tableNumber*Math.round(this.addmentLists.unitPrice);
				this.hsPackageItemList.push(data)
				this.createReturnAllAcount();
            	 this.newCreateContractsets.forEach((n)=>{
					    if( this.addmentLists.hsPackageId==n.id){
					        data.pakename = n.packageName
					    }
					})
					this.varietyOfDishes.forEach((n)=>{
					    if( this.addmentLists.varietyOfDishe==n.id){
					        data.name = n.name
					    }
					})
					this.createHsPackageMenuList.push(data)
				this.cancelAddmentHandle();
            },
            cancelAddmentHandle(){  //取消添加菜品
            	this.$refs['addmentLists'].resetFields();
				this.dialogAddmentFormVisible = false
            },
            createAdjustmentHandle(index,row){  //调整菜品按钮
            	this.adjustmentListIndex = row;
            	this.dialogAdjustmentFormVisible = true
            },
			cancelAdjustmentHandle(){  //取消调整菜品
				this.$refs['adjustmentLists'].resetFields();
				this.dialogAdjustmentFormVisible = false
			},
			confirmAdjustmentHandle(){  //确定调整菜品
				this.newCreateContractsets.forEach((n)=>{
					if(this.adjustmentLists.hsPackageId==n.id){
					    this.adjustmentListIndex.alterPakename = n.packageName
					}
				})
				this.varietyOfDishes.forEach((n)=>{
					if(this.adjustmentLists.varietyOfDishe==n.id){
					    this.adjustmentListIndex.alternateName = n.name
					}
				})
				this.cancelAdjustmentHandle();
			},
			createChangeAdjustmentSetHandle(val){  //改变调整菜单的套系
				if(this.adjustmentLists.hsPackageId != ''){
					this.$axios.post('/order/getHsPackageDetail',{'type':this.createNewContracts.type,'hsPackageId':this.adjustmentLists.hsPackageId}).then((res)=>{  //获取所有套系数据
		                if(res.data.res == '0'){
		                    this.varietyOfDishes = res.data.msg.hsPackageMenuList;

		                }
		            })
				}

			},
			createReductionHandle(index,row){  //还原菜单按钮
				row.alternateName = '';
				row.alterPakename = ''
			},
			applyIndex(e){
				return e
			},
			createApplyDiscountHandle(index,row){  //申请优惠
				this.createApplyDiscount = row;
				this.createApplyDiscountIndex = index;
				this.createDiscountAllAcount = this.createAllAcount;
				if(this.createPriceContents.hsPackageId == ''){
					this.$message.error('请先选择套系')
				}
				else{
					if(row.quantity == 0){
						this.$message.error('套系外的桌数为0,不可申请优惠')
					}
					else{
						if(row != 0 && index !=0){
							this.applyDiscountPlaceholder = '请输入套系外每桌优惠价格'
						}
						else{
							this.applyDiscountPlaceholder = '请输入优惠立减金额'
						}
						if(index !=3 && index !=1 && index !=0 && (this.createNewContracts.type == 0 || this.createNewContracts.type == 2)){
							this.$confirm('确定免去'+row.name+'的费用?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					        }).then(() => {
					        	let data = {
									name:'',
									content:'',
									creatorName:'',
									quantity:'',
									unit:'',
									unitPrice:'',
									totalAmount:'',
									type:2,
								};
								data.creatorName = JSON.parse(localStorage.getItem("userInfo")).nickName;
								data.name = '免';
								data.quantity = row.quantity;
								data.unit = '桌';
								data.content = '免去'+row.name+'的费用';
								data.unitPrice = 0-row.unitPrice;
								data.totalAmount = 0-row.quantity*row.unitPrice;
								this.hsPackageItemList.push(data)
								this.createReturnAllAcount();
								row.applyTrue = false
					        	this.$message({
					            	type: 'success',
					           	 	message: '成功申请优惠!'
					          	});
					        }).catch(() => {
					         	this.$message({
					           		 type: 'info',
					           		 message: '已取消操作'
					         	});
					       	});
						}
						else{
							if(this.createPriceContents.hsPackageId == ''){
					     		this.$message.error('请选择套系')
					     	}
					     	else{
					     		this.editServiceIndex = row;
					     		this.dialogApplyDiscountFormVisible = true;
								this.applyDiscounts.totalAmount = this.createAllAcount;
								this.applyDiscounts.discountsTotalAmount = this.createAllAcount - this.applyDiscounts.discount
					     	}
						}

					}
				}


			},
			cancelApplyDiscountHandle(){ //取消申请优惠
				this.$refs['applyDiscounts'].resetFields();
				this.dialogApplyDiscountFormVisible = false
			},
			confirmApplyDiscountHandle(roleForm){  //确定申请优惠
				this.$refs[roleForm].validate((valid) => {
					if (valid) {
						let data = {
							name:'',
							content:'',
							creatorName:'',
							quantity:'',
							unit:'',
							unitPrice:'',
							totalAmount:'',
							type:0,
						};
						data.creatorName = JSON.parse(localStorage.getItem("userInfo")).nickName;
						data.name = '立减';
						data.quantity = this.createApplyDiscount.quantity;
						data.unit = '套';
						data.unitPrice = 0 - Math.round(this.applyDiscounts.discount);
						data.totalAmount = 0 - Math.round(this.applyDiscounts.discount);
						if(this.createApplyDiscount !=0 && this.createApplyDiscountIndex !=0){
							data.unitPrice = 0 - Math.round(this.applyDiscounts.discount);
							data.totalAmount = 0 - data.quantity*Math.round(this.applyDiscounts.discount);
						}
						if(this.applyDiscountPlaceholder == '请输入套系外每桌优惠价格'){
							data.unit = '桌';
						}
						if(this.createApplyDiscount == 0){
							this.allDiscountBtn = false;
							data.content = '总优惠';
							data.quantity = 1;
						}
						else{
							if(this.createApplyDiscountIndex == 0){
								this.createApplyShow = false
								if(this.createNewContracts.type == 0){
									data.content = '婚宴套系'
								}
								else{
									data.content = '宴会套系'
								}
							}
							else{
								this.createApplyDiscount.applyTrue = false
								data.content = this.createApplyDiscount.name;
							}
						}
						if(this.createNewContracts.type == 1){
							this.editunitPriceIsTrue = true
							data.name = '';
							Vue.set(data,'packageType',1)
						}
						this.hsPackageItemList.push(data)
						this.createReturnAllAcount();
						this.cancelApplyDiscountHandle();
					} else {
						return false;
					}
				})
			},


			changeDiscountHandle(val){  //改变优惠值
  				val = String(Math.abs(Math.round(val)))
				this.applyDiscounts.discount = val
				if(this.createApplyDiscount !=0 && this.createApplyDiscountIndex !=0){
					this.createDiscountAllAcount = this.createAllAcount - this.createApplyDiscount.quantity*val;
				}
				else{
					this.createDiscountAllAcount = this.createAllAcount - val;
				}
			},


			createEditHandle(index,row){  //编辑报价模块
				this.editServiceIndex = index;
				this.dialogEditServiceFormVisible = true;
				this.editServiceContents.name = this.hsPackageServiceItemList[index].name
				this.editServiceContents.content = this.hsPackageServiceItemList[index].content
			},
			confirmEditServiceHandle(){  //确定编辑服务内容
				this.dialogEditServiceFormVisible = false;
				this.hsPackageServiceItemList[this.editServiceIndex].content = this.editServiceContents.content;
			},
			cancelEditServiceHandle(){  //放弃编辑服务内容
				this.dialogEditServiceFormVisible = false;
			},


           deleteRow5(index, rows) {  //删除编辑服务内容变革的某行
		        rows.splice(index, 1);
		        this.createReturnAllAcount();

		    },
		    deleteRow1(index, row){

		    	if(row.content == '婚宴套系' || row.content == '宴会套系' || row.content.substring(0,3) == '套系内' || row.content.substring(0,3) == '套系外'){
		    		this.createApplyShow = true
		    	}
		    	else{
		    		if(row.content == '总优惠'){
		    			this.allDiscountBtn = true;
		    			this.isHaveAllDiscount = true;
					}
					if(row.content == '升级菜单'){
						for(var i=0;i<this.createHsPackageMenuList.length;i++){
							if(this.createHsPackageMenuList[i].name === row.name){
								this.createHsPackageMenuList.splice(i,1)
							}
						}
					}
		    	}

		    	for(var i=0;i<this.hsPackageServiceItemList.length;i++){
		    		if(row.content == this.hsPackageServiceItemList[i].name){
		    			this.hsPackageServiceItemList[i].applyTrue = true
		    		}
		    		if(row.content.substring(0,5) == '免去套系外'){
		    			this.hsPackageServiceItemList[i].applyTrue = true
		    		}
		    	}

		    	this.hsPackageItemList.splice(index,1)
		    	this.editunitPriceIsTrue = true
		    	this.createReturnAllAcount();
		    },
		    deleteRow3(index, rows){
		    	this.createSupplementaryItems.splice(index,1)
		    },
		     deleteRow4(index, rows){
		    	this.createHsPackageMenuList.splice(index,1)
		    },
		    createAddServiceContentHandle(){  //添加服务内容
		     	if(this.createPriceContents.hsPackageId == ''){
		     		this.$message.error('请选择套系')
		     	}
		     	else{
		     		this.dialogAddServiceFormVisible = true;
		     		this.$axios.post('/order/getHsPackageDetail',{'type':this.createNewContracts.type,'hsPackageId':this.createPriceContents.hsPackageId}).then((res)=>{
	                    if(res.data.res == '0'){
	                    	this.createServiceNames = res.data.msg.hsPackageServiceItemModuleList;
	                    }
	             	})

		     	}
            },
		    confirmAddServiceHandle(){  //确定添加服务内容
		    	let name = '';
		    	this.createServiceNames.forEach((n)=>{
                    if( n.id==this.addServiceContents.name){
                        name = n.name
                    }
                })
				this.hsPackageServiceItemList.push({'name': name,'content': this.addServiceContents.content})
				this.cancelAddServiceHandle();
				this.createReturnAllAcount();
			},
			cancelAddServiceHandle(){  //放弃添加服务内容
				this.$refs['addServiceContents'].resetFields();
				this.dialogAddServiceFormVisible = false;
			},

			addCreateServiceItemHandle(){  //增加项目
				let arr = ['赠送红酒','赠送黄酒','赠送婚房','赠送婚车','总优惠'];
				this.dialogAddServiceItemFormVisible = true;
				for(var i=0;i<this.hsPackageItemList.length;i++){
					for(var j=0;j<arr.length;j++){
						if(this.hsPackageItemList[i].content == arr[j]){
							this.createAddServiceItemShows[j] = false
						}
					}
				}
			},
			handleCheckedItemsChange(val){  //增加项目复选框变化
				if(this.checkedConfirmItems.join().indexOf(5) != -1){
					this.isSecondItem = true
				}
				else{
					this.isSecondItem = false
				}
			},
			cancelAddServiceItemHandle(){  //放弃添加服务内容
				this.dialogAddServiceItemFormVisible = false;
				this.checkedConfirmItems = [];
				this.isSecondItem = false;
				this.$refs['createAddServiceItems'].resetFields();
			},
			confirmAddServiceItemHandle(){  //确定添加服务内容

				this.checkedConfirmItems.forEach((n)=>{
					let data = {
						name:'',
						content:'',
						creatorName:'',
						quantity:'',
						unit:'',
						unitPrice:'',
						totalAmount:'',
						type:'',
					};
					data.creatorName = JSON.parse(localStorage.getItem("userInfo")).nickName
					if(n == 0 || n == 1 || n == 2 || n == 3){
						data.name = '赠送';
						data.quantity = this.createAddServiceItems.freeRedWinNumber;
						data.unitPrice=0;
						data.totalAmount=0;
						data.type = 3;
						if(n == 0 || n == 1){
							data.unit= '瓶';
							if(n == 0){
								data.quantity = this.createAddServiceItems.freeRedWinNumber;
								data.content = '赠送红酒';
							}
							else{
								data.quantity = this.createAddServiceItems.freeYellowWinNumber;
								data.content = '赠送黄酒'
							}
						}
						else{
							if(n == 2){
								data.quantity = this.createAddServiceItems.freeWeddingRoomNumber;
								data.content = '赠送婚房';
								data.unit= '套';
							}
							else{
								data.quantity = this.createAddServiceItems.freeWeddingCarNumber;
								data.content = '赠送婚车'
								data.unit= '部';
							}
						}
					}


					else if(n == 4){
						data.name = '立减';
						data.content = '总优惠';
						data.quantity = 1;
						data.unit= '套';
						data.type = 0;
						data.unitPrice= 0 - Math.round(this.createAddServiceItems.allDiscount);
						data.totalAmount= 0 - Math.round(this.createAddServiceItems.allDiscount);
					}
					else{
						data.name = '追加'
						data.type = 5;
						data.quantity = this.createAddServiceItems.quantity;
						data.unit= this.createAddServiceItems.unit;
						data.content = this.createAddServiceItems.content;
						data.unitPrice= Math.round(this.createAddServiceItems.unitPrice);
						data.totalAmount= this.createAddServiceItems.quantity*Math.round(this.createAddServiceItems.unitPrice);
					}
					this.hsPackageItemList.push(data)
				})

				this.cancelAddServiceItemHandle();
				this.createReturnAllAcount();
			},



		    addIncreaseConferenceOfferHandle(){  //添加会务报价
		    	this.editUnitPriceIndex = 0;
		    	this.dialogIncreaseConferenceOfferFormVisible = true;
		    	this.IncreaseConferenceOffers.content = '';
		    	this.IncreaseConferenceOffers.unit = '';
		    	this.IncreaseConferenceOffers.quantity = '';
		    	this.IncreaseConferenceOffers.unitPrice = '';
		    },
		    confirmIncreaseConferenceOfferHandle(roleForm){  //确定会务报价
		    	this.IncreaseConferenceOffers.quantity = String(this.IncreaseConferenceOffers.quantity)
		    	this.IncreaseConferenceOffers.unitPrice = String(this.IncreaseConferenceOffers.unitPrice)
		    	this.$refs[roleForm].validate((valid) => {
					if (valid) {

						if(this.editUnitPriceIndex == 0){
				    		this.hsPackageItemList.push({
					    		'content': this.IncreaseConferenceOffers.content,
					    		'unit': this.IncreaseConferenceOffers.unit,
					    		'quantity':this.IncreaseConferenceOffers.quantity,
					    		'unitPrice':Math.round(this.IncreaseConferenceOffers.unitPrice),
					    		'packageType':1,			    								'totalAmount':this.IncreaseConferenceOffers.quantity*Math.round(this.IncreaseConferenceOffers.unitPrice),
					    		'type':4,
					    	})

				    	}
				    	else{
				    		this.hsPackageItemList[this.editUnitPriceIndex].content = this.IncreaseConferenceOffers.content;
				    		this.hsPackageItemList[this.editUnitPriceIndex].unit = this.IncreaseConferenceOffers.unit;
				    		this.hsPackageItemList[this.editUnitPriceIndex].quantity = this.IncreaseConferenceOffers.quantity;
				    		this.hsPackageItemList[this.editUnitPriceIndex].unitPrice = Math.round(this.IncreaseConferenceOffers.unitPrice);
				    		this.hsPackageItemList[this.editUnitPriceIndex].totalAmount = this.IncreaseConferenceOffers.quantity*Math.round(this.IncreaseConferenceOffers.unitPrice);
				    	}
				    	this.editunitPriceIsTrue = true
				    	this.cancelIncreaseConferenceOfferHandle();

					} else {
						this.$message.error('请填写必要信息')
						return false;
					}
				})
				this.createReturnAllAcount();
		    },
		    cancelIncreaseConferenceOfferHandle(){  //取消会务报价
		    	this.dialogIncreaseConferenceOfferFormVisible = false;
		    	this.$refs['IncreaseConferenceOffers'].resetFields();
		    },


		    createLookContentHandle(index,row){  //查看内容
		    	this.dialogPackageServiceContentTableVisible = true;

		    },

		    createAddSupplementItemsHandle(){  //增加补充事项按钮
		    	this.createSuppleItemTitle = '增加补充事项';
		    	this.dialogAddSuppleItemFormVisible = true;
		    	this.createAddSuppleItemForms.content = ''
		    },
		    confirmAddSuppleItemHandle(roleForm){  //确定添加补充事项
		    	this.$refs[roleForm].validate((valid) => {
					if (valid) {
						if(this.createSuppleItemTitle == '编辑补充事项'){
				    		this.createEditSuppleItemIndex.content = this.createAddSuppleItemForms.content
				    	}
				    	else{
				    		this.createSupplementaryItems.push({content:this.createAddSuppleItemForms.content})
				    	}
				    	this.cancelAddSuppleItemHandle()
					} else {
						self.$message.error('请填写必要信息')
						return false;
					}
				})
		    },
		    cancelAddSuppleItemHandle(){  //取消添加补充事项
		    	this.dialogAddSuppleItemFormVisible = false;
		    	this.$refs['createAddSuppleItemForms'].resetFields();
		    },
		    createEditSuppleItemListHandle(index, row){  //编辑补充事项
		    	this.createSuppleItemTitle = '编辑补充事项';
		    	this.dialogAddSuppleItemFormVisible = true;
		    	this.createEditSuppleItemIndex = row;
		    	this.createAddSuppleItemForms.content = row.content
		    },

		    createReturnAllAcount(){  //获取总金额
		    	let allMoney2 = 0;

				if(this.createNewContracts.type != 1){
					this.createAllAcount = 0
					this.hsPackageServiceItemList.forEach((n)=>{
						allMoney2 += Number(n.totalAmount)
					})
					this.hsPackageItemList.forEach((n)=>{
						allMoney2 += Number(n.totalAmount)
					})
		    		this.createAllAcount += allMoney2
		    	}
				else{
					if(this.editunitPriceIsTrue){
						this.hsPackageItemList.forEach((n)=>{
							allMoney2 += Number(n.totalAmount)
						})
						this.createAllAcount = allMoney2
						this.editunitPriceIsTrue = false
					}
					else{
						this.createAllAcount = this.createAllAcount
					}

				}
		    },
		    createEditItemListHandle1(index,row){  //编辑报价变革第一行
		    	this.dialogEditunitPricesFormVisible = true;
		    	this.editunitPrices.oldUnitPrice=this.hsPackageItemList[index].unitPrice;
		    	this.hsPackageItemList[0].quantity*this.hsPackageItemList[0].unitPrice
		    },
		    confirmEditunitPriceHandle(){  //确定编辑报价变革第一行
		    	this.hsPackageItemList[0].totalAmount = this.hsPackageItemList[0].quantity*Math.round(this.editunitPrices.newUnitPrice);
		    	this.hsPackageItemList[0].unitPrice = Math.round(this.editunitPrices.newUnitPrice);
		    	this.editunitPriceIsTrue = true
		    	this.createReturnAllAcount();
		    	this.cancelEditunitPriceHandle()
		    },
		    cancelEditunitPriceHandle(){  //取消编辑报价变革第一行
		    	this.dialogEditunitPricesFormVisible = false;
		    	 this.$refs['editunitPrices'].resetFields();
		    },
		    createEditItemListHandle2(index,row){  //编辑报价变革非第一行
		    	this.editUnitPriceIndex = index;
		    	this.dialogIncreaseConferenceOfferFormVisible = true;
		    	this.IncreaseConferenceOffers.content = this.hsPackageItemList[index].content;
		    	this.IncreaseConferenceOffers.unit = this.hsPackageItemList[index].unit;
		    	this.IncreaseConferenceOffers.quantity = this.hsPackageItemList[index].quantity;
		    	this.IncreaseConferenceOffers.unitPrice = this.hsPackageItemList[index].unitPrice;
		    },
		    createPaymentConventionListHandle(index,row){  //编辑付款约定表格
		    	this.isPaymentConventListShow = false
		    	this.isPaymentRemarkShow = false
		    	this.isLastPercentage = false
		    	this.createIsAddPayment = false
				this.createPaymentConventionListForms.time = '';
				this.createPaymentConventionListForms.daysRange = ''
				if(this.createAllAcount == 0){
			    	this.$message.error('合同金额为0, 请先编辑好合同价格内容')
			    	return
			    }
			    else{
			    	if(this.createNewContracts.schedule == '' || this.createNewContracts.schedule == undefined){
			    		this.$message.error('档期为空,请先选择好档期')
			    		return
			    	}
			    	else{
			    		let self = this;
			    		this.pickerOptionsSchedule = {
			               	disabledDate(time) {
						        return (new Date(moment(self.createNewContracts.schedule).format('YYYY-MM-DD') + ' ' +'00:00:00').getTime())<time.getTime() || time.getTime()<=  new Date(moment().add('days',-1).format('YYYY-MM-DD') + ' ' +'00:00:00').getTime();
							}
				        }

			    		self.createPaymentConventionListRow = row;
			    		self.createPaymentConventionListIndex = index;
			    		self.dialogPaymentConventionListFormVisible = true;
			    		self.createPaymentConventionListTitle = '编辑'+row.paymentItem;
			    		let a = String(row.lastPaymentTime).length

						if(row.lastPaymentTime !='') {
							this.isHaveMoney = true
							self.createPaymentConventionListForms.percentage = row.percentageOfPayment
							self.createPaymentConventionListForms.money = row.amount
							if(this.isCreateOrderHandle){
								self.createPaymentConventionListForms.time = self.paymentHistory[index].time
								self.createPaymentConventionListForms.daysRange = self.paymentHistory[index].text
								if(self.paymentHistory[index].remark !='' && row.paymentItem == '尾款'){
									this.isLastPercentage = true
									self.createPaymentConventionListForms.remark = self.paymentHistory[index].remark
								}
							}
							else{
								self.createPaymentConventionListForms.time = row.lastPaymentTime
								this.createPaymentDataChange(row.lastPaymentTime)
							}


						}
						else{
							this.isHaveMoney = false
							if(row.percentageOfPayment !='' && row.lastPaymentTime ==''){
								self.createPaymentConventionListForms.percentage = row.percentageOfPayment
								self.createPaymentConventionListForms.money = row.amount
								self.createPaymentConventionListForms.time = ''
								self.createPaymentConventionListForms.daysRange = ''
							}
							else{
								self.createPaymentConventionListForms.percentage = ''
								self.createPaymentConventionListForms.money = ''
								self.createPaymentConventionListForms.time = ''
								self.createPaymentConventionListForms.daysRange = ''
							}

						}


			    		if(self.createNewContracts.type !=1){ //除会务外
			    			if(self.screeningType == 0){
			    				if(row.paymentItem == '中款'){
			    					this.isLastPercentage = false
			    					self.daysRanges = self.daysRange2
			    				}
			    				else{
			    					if(index == 0){
			    						this.isLastPercentage = false
			    						self.daysRanges = self.daysRange3
				    					self.isPaymentConventListShow = true
				    					self.createPaymentConventionListForms.time = moment().format('YYYY-MM-DD');
								    	self.createPaymentConventionListForms.daysRange = moment(self.createPaymentConventionListForms.time).diff(moment(), 'days')
				    				}
				    				else{
				    					if(row.paymentItem == '定金'){
				    						this.isLastPercentage = false
				    						self.daysRanges = self.daysRange5
				    					}
				    					else{
				    						if(row.paymentItem == '尾款'){
				    							this.isLastPercentage = true
				    						}
				    						else{
				    							this.isLastPercentage = false
				    							self.isPaymentConventListShow = false
				    						}
				    						self.daysRanges = self.daysRange1
				    					}

				    				}
			    				}
							}
							else{
								if(index == 1){
			    					self.daysRanges = self.daysRange5
			    				}
			    				else{
			    					if(index == 0){
			    						this.isLastPercentage = false
			    						self.daysRanges = self.daysRange3
				    					self.isPaymentConventListShow = true
				    					self.createPaymentConventionListForms.time = moment().format('YYYY-MM-DD');
								    	self.createPaymentConventionListForms.daysRange = moment(self.createPaymentConventionListForms.time).diff(moment(), 'days')
				    				}
				    				else{
				    					if(row.paymentItem == '尾款'){
				    						this.isLastPercentage = true
				    					}
				    					else{
				    						this.isLastPercentage = false
				    						self.isPaymentConventListShow = false
				    					}
				    					self.daysRanges = self.daysRange4
				    				}

			    				}
							}
			    		}
			    		else{
							if(index == 0){
			    				self.daysRanges = self.daysRange3
			    				this.isLastPercentage = false
			    			}
			    			else if(index == 1){
			    				this.isLastPercentage = true
				    			self.daysRanges = self.daysRange4
				    		}
						}
			    	}
				}

		    },
		    cancelPaymentConventionListHandle(){  //取消编辑付款约定表格
		    	this.dialogPaymentConventionListFormVisible = false
		    	this.$refs['createPaymentConventionListForms'].resetFields();
		    	this.createPaymentConventionListForms.daysRange =''
				this.createPaymentConventionListForms.time = ''
				this.createPaymentConventionListForms.percentage = ''
				this.createPaymentConventionListForms.money = ''
				this.createIsAddPayment = false;
		    },
		    deleteRow2(index, e){
		    	this.createPaymentConventionList.splice(index,1)
		    	let haneNumberList = ''
		    	let lastPercentage = 100
		    	let length = this.createPaymentConventionList.length-1
		    	this.createPaymentConventionList.forEach((n)=>{
					 if( n.percentageOfPayment != ''){
						haneNumberList ++
						lastPercentage = lastPercentage - n.percentageOfPayment
						if(haneNumberList == length){
							this.createPaymentConventionList[length].percentageOfPayment = lastPercentage
							this.createPaymentConventionList[length].amount = this.createAllAcount*lastPercentage/100
						}
					}
				})
		    },
		    confirmPaymentConventionListHandle(){  //确定编辑付款约定表格
		    	let haneNumberList = ''
		    	let lastPercentage = 100
		    	let lastMoney = this.createAllAcount
		    	let length = this.createPaymentConventionList.length-1
		    	let percentage = this.createPaymentConventionListForms.percentage
		    	let money = this.createPaymentConventionListForms.money
		    	let time = this.createPaymentConventionListForms.time
		    	let daysRange = this.createPaymentConventionListForms.daysRange
		    	this.daysRanges.forEach((n)=>{
					    if( n.time==daysRange){
					        daysRange = n.text
					    }
					})


		    	if((this.createPaymentConventionListRow.percentageOfPayment == 0 || percentage == '') && percentage == 0 || percentage == ''){

		    		this.$message.error('请填写付款百分比，且不能小于0')
		    		return
		    	}
		    	else{

		    		if(time == '' || time == undefined){
		    			this.$message.error('请选择最后付款时间')
		    			return
                    }
                    else{
                    	if(this.createIsAddPayment){
                    		length++
                    		if(percentage == 0 || percentage == ''){
					    		this.$message.error('请填写付款百分比，且不能小于0')
					    		return
					    	}
					    	else{
					    		if(time == 0 && time == '' || time == undefined){
					    			this.$message.error('请选择最后付款时间')
					    			daysRange = ''
					    			return
			                    }
			                    else{
			                    	let a = {'paymentItem':'定金',
		                    			'percentageOfPayment':percentage,
		                    			'amount':money,
		                    			'lastPaymentTime':time+'('+ daysRange+')'
		                    			}
			                    									this.createPaymentConventionList.splice(this.createPaymentConventionList.length-2, 0, a);
			                    	this.paymentHistory[1].text = daysRange
			                    	this.paymentHistory[1].time = time
			                    	this.paymentHistory[1].remark = ''
		                    		this.cancelPaymentConventionListHandle()
		                    		this.createIsAddPayment = !this.createIsAddPayment
			                    }
					    	}

                    	}
                    	else{
                    		if(this.isPaymentRemarkShow){
                    			if(this.createPaymentConventionListForms.remark == ''){
                    				this.$message.error('请填写最晚付款时间备注')
                    			}
                    			else{
                    				this.createPaymentConventionListRow.percentageOfPayment = percentage;
							        this.createPaymentConventionListRow.amount = money;
							        this.createPaymentConventionListRow.lastPaymentTime = time+'('+ daysRange+' '+ this.createPaymentConventionListForms.remark+"前"+')';
								     this.paymentHistory[this.createPaymentConventionListIndex].text = daysRange
							    	this.paymentHistory[this.createPaymentConventionListIndex].time = time
							    	 this.paymentHistory[this.createPaymentConventionListIndex].remark = this.createPaymentConventionListForms.remark
							    	this.cancelPaymentConventionListHandle()
                    			}
                    		}
                    		else{
                    			this.createPaymentConventionListRow.percentageOfPayment = percentage;
							    this.createPaymentConventionListRow.amount = money;
							    this.createPaymentConventionListRow.lastPaymentTime = time+'('+ daysRange+')';
							    this.paymentHistory[this.createPaymentConventionListIndex].text = daysRange
							    this.paymentHistory[this.createPaymentConventionListIndex].time = time
							    this.paymentHistory[this.createPaymentConventionListIndex].remark = ''
								this.cancelPaymentConventionListHandle()
                    		}

                    	}

                    	 this.createPaymentConventionList.forEach((n)=>{

							    if( n.percentageOfPayment != ''){
							        haneNumberList ++
							        lastPercentage = Math.round(lastPercentage - n.percentageOfPayment)
							        lastMoney = Math.round(lastMoney-n.amount)
							        if(haneNumberList == length){
							        	 this.createPaymentConventionList[length].amount = lastMoney
							        	 this.createPaymentConventionList[length].percentageOfPayment = Math.round(Number(lastMoney/this.createAllAcount)*100)
							        }
							    }
							})

                    }
		    	}







		    },
		    createAddPaymentConventionListHandle(index,row){  //添加付款约定表格
		    	if(row.percentageOfPayment == ''){
		    		this.$message.error('编辑完第1笔定金,才能添加新的定金')
		    		return
		    	}
		    	else{
		    		this.createIsAddPayment = true;
		    		this.daysRanges = this.daysRange1
		    		this.dialogPaymentConventionListFormVisible = true;
				    this.isPaymentConventListShow = false
					this.createPaymentConventionListForms.time = '';
					this.daysRanges = this.daysRange6
					this.createPaymentConventionListForms.daysRange = ''
					this.createPaymentConventionListTitle = '添加定金';
		    	}
		    },
			createPaymentPercentChangeHandle(val){  //改变百分比
				if(val == ''){
					this.createPaymentConventionListForms.percentage = 0
					this.createPaymentConventionListForms.money = 0
				}
				else{
					this.createPaymentConventionListForms.percentage = Math.round(val)
					this.createPaymentConventionListForms.money = Math.round(this.createAllAcount*val/100)
				}
			},
			changePaymentMoneyHandle(val){  //改变金额
				if(val == ''){
					this.createPaymentConventionListForms.percentage = 0
					this.createPaymentConventionListForms.money = 0
				}
				else{
					this.createPaymentConventionListForms.money = Math.round(val)
					this.createPaymentConventionListForms.percentage = Math.round(val/this.createAllAcount*100)
				}
			},

			getDateRange(paymentType, startDate, endDate, orderType) {  //根据时间差计算日期范围
				 var days

				if(paymentType == 2){
					days = moment(startDate).diff(moment().format('YYYY-MM-DD'), 'days');
				}
			    else{
			    	days = moment(endDate).diff(moment(startDate), 'days');
			    }
			    var str = "";
			    if (paymentType == 2) {

			        if (days == 0) {
			            str = "签约当日";
			        } else {
			            str = "签约后" + days + "日内";
			        }
			    } else if (paymentType == 3 && orderType == 0) {

			        if (days == 0) {
			            str = "婚礼举办当日";
			        } else if (days % 30 == 0) {
			            str = "婚礼举办前" + (days / 30) + "个月内";
			        } else if (days % 7 == 0) {
			            str = "婚礼举办前" + (days / 7) + "周内";
			        } else {
			            str = "婚礼举办前" + days + "日内";
			        }
			    } else if (paymentType == 3 && (orderType == 1|| orderType == 2)) {

			        if (days == 0) {
			            str = "会议活动当日";
			        } else if (days % 30 == 0) {
			            str = "会议活动前" + (days / 30) + "个月内";
			        } else if (days % 7 == 0) {
			            str = "会议活动前" + (days / 7) + "周内";
			        } else {
			            str = "会议活动前" + days + "日内";
			        }
			    } else if (paymentType == 4 && (orderType == 1|| orderType == 2)) {
			        if (days == 0) {
			            str = "会议活动当日";
			        } else {
			            str = "会议活动前" + days + "日内";
			        }
			    } else if (paymentType == 4 && orderType == 0) {
			        if (days == 0) {
			            str = "婚礼举办当日";
			        } else {
			            str = "婚礼举办前" + days + "日内";
			        }
			    }

			    return str;
			},
            createPaymentDataChange(val){
            	let paymentType
            	let startDate = val
            	let endDate = this.createNewContracts.schedule
            	let orderType = this.createNewContracts.type
            	if(this.createPaymentConventionListRow.paymentItem == '定金'){
            		paymentType = 2
            	}
            	else if(this.createPaymentConventionListRow.paymentItem == '中款'){
            		paymentType = 3
            	}
            	else{
            		paymentType = 4
            	}
            	let momentDays = moment(this.createNewContracts.schedule).diff(moment(val), 'days');
            	 this.createPaymentConventionListForms.time = val;
            	 if(this.createPaymentConventionListRow.paymentItem == '尾款' && momentDays == 0){
            	 	this.isPaymentRemarkShow = true
            	 }
            	 else{
            	 	this.isPaymentRemarkShow = false
            	 }
            	 if(!this.createIsChangePaymentTime){
            	 	console.log(val)
            	 	if(val == null || val == '' || val == undefined){
            			this.createPaymentConventionListForms.daysRange = ''
            		}
            		else{
            			this.createPaymentConventionListForms.daysRange = this.getDateRange(paymentType, startDate, endDate, orderType)
            		}

            	 }
            },
            changeDaysRangeHandle1(val){
            	this.createIsChangePaymentTime = val

            },


            changeDaysRangeHandle(val){  //改变日期范围
            	if(this.createIsChangePaymentTime){
            		if((this.createNewContracts.type ==0 || this.createNewContracts.type ==2) && !this.createIsAddPayment){
            			if(this.createNewContracts.type ==2 && this.createPaymentConventionListRow.paymentItem == '尾款' ){
            				this.createPaymentConventionListForms.time = moment(this.createNewContracts.schedule).subtract(val,'days').format('YYYY-MM-DD')
            			}
            			else if(this.createNewContracts.type ==0 && this.createPaymentConventionListRow.paymentItem == '尾款' ){
            				this.createPaymentConventionListForms.time = moment(this.createNewContracts.schedule).subtract(val,'days').format('YYYY-MM-DD')
            			}
            			else{
            				if(val>10){
			            		this.createPaymentConventionListForms.time = moment(this.createNewContracts.schedule).subtract(val,'days').format('YYYY-MM-DD')
			            	}
			            	else{
			            		this.createPaymentConventionListForms.time = moment(this.createNewContracts.schedule).subtract(val,'months').format('YYYY-MM-DD')
			            	}
            			}

            		}

            		else{
            			if(this.createPaymentConventionListRow.paymentItem == '定金'){
            				this.createPaymentConventionListForms.time = moment().add(val,'days').format('YYYY-MM-DD')
            			}
            			else{
            				this.createPaymentConventionListForms.time = moment(this.createNewContracts.schedule).subtract(val,'days').format('YYYY-MM-DD')
            			}

            		}


            	}
            },








			sortarr(arr){
			    for(var i=0;i<arr.length-1;i++){
		            for(var j=0;j<arr.length-1-i;j++){
		                let a = arr[j].sortNumber
			            let b = arr[j+1].sortNumber
			            if(a>b){
			                var c = arr[j]
			                arr[j] = arr[j+1]
			                arr[j+1] = c
			            }
		            }
		        }
			    return arr;
			},
			createChangeSetVisibleHandle(){
				this.createChangeSetVisible = true
			},
            createChangeSetHandle(val){  //改变套餐
            	this.createPriceContents.hsPackageId = val
            	this.createApplyShow = true
            	this.allDiscountBtn = true;
            	if(val == '' || val == undefined || val == null){
            		this.createAllAcount = 0
            		this.createPaymentConventionList.forEach((m)=>{
			            m.amount = ''
			            m.percentageOfPayment = ''
			            m.lastPaymentTime = ''
			        })
			        this.createPriceContents.estimateTableNumber = '';
		            this.oldTableNumber = '';
		            this.createPriceContents.tableNumber = '';
		            this.createHsPackageMenuList = [];
		            this.hsPackageItemList = [];
		            this.hsPackageServiceItemList = [];
		            this.createPackageServiceContentList = [];
		            this.createPackageServiceContentList1 = [];
            	}
            	else{
            		if(this.isCreateOrderHandle){
	            		this.createPaymentConventionList.forEach((m)=>{
			                m.amount = ''
			                m.percentageOfPayment = ''
			                m.lastPaymentTime = ''
			            })
	            	}
	            	if(this.createNewContracts.type === '' || this.createPriceContents.hsPackageId ===''){
						this.createPriceContents.estimateTableNumber = '';
		                this.oldTableNumber = '';
		                this.createPriceContents.tableNumber = '';
		                this.createHsPackageMenuList = [];
		                this.hsPackageItemList = [];
		                this.hsPackageServiceItemList = [];
		                this.createPackageServiceContentList = [];
		                this.createPackageServiceContentList1 = [];
	            	}
	            	else{
	            		let hsPackageServiceContentTypes = this.dicData.HS_PACKAGE_SERVICE_CONTENT_TYPE;
	            		if(this.createChangeSetVisible){
	            			this.$axios.post('/order/getHsPackageDetail',{'type':this.createNewContracts.type,'hsPackageId':this.createPriceContents.hsPackageId}).then((res)=>{  //获取所有套系
			                    if(res.data.res == '0'){
			                    	this.createPriceContents.estimateTableNumber = res.data.msg.hsPackage.tableNumber;
			                    	if(res.data.msg.hsPackage.tableNumber == 0){
			                    		this.isDontEat=true
			                    	}
			                    	else{
			                    		this.isDontEat=false
			                    	}
			                    	this.oldTableNumber = res.data.msg.hsPackage.tableNumber;
			                    	this.oldtableNumber = res.data.msg.hsPackage.tableNumber;
		        					this.oldestimateTableNumber = res.data.msg.hsPackage.tableNumber
			                    	this.createPriceContents.tableNumber = res.data.msg.hsPackage.tableNumber;
			                    	this.estimateTableNumber = res.data.msg.hsPackage.tableNumber;
		            				this.tableNumber = res.data.msg.hsPackage.tableNumber;
			                    	this.createHsPackageMenuList = res.data.msg.hsPackageMenuList;
			                    	this.hsPackageItemList = res.data.msg.hsPackageItemList;
			                    	this.hsPackageServiceItemList = this.sortarr(res.data.msg.hsPackageServiceItemList)
			                    	this.createPackageServiceContentList = res.data.msg.hsPackageServiceContentList
			                    	this.createPackageServiceContentList1 = res.data.msg.hsPackageServiceContentList;
			                    	this.createAllAcount = res.data.msg.hsPackage.totalAmount
			                    	this.createPackageServiceContentList.forEach((n)=>{
										n.minquantity = n.quantity
									})
									this.hsPackageServiceItemList.forEach((n)=>{
										Vue.set(n,'applyTrue',true)
									})
						            this.createHsPackageMenuList.forEach((e)=>{
									    this.newCreateContractsets.forEach((n)=>{
										    if( e.hsPackageId==n.id){
										        e.pakename = n.packageName
										    }
										})
									})

						            this.createPackageServiceContentList.forEach((e)=>{
									    hsPackageServiceContentTypes.forEach((n)=>{
										    if( e.type==n.dicValue){
										        e.typeText = n.dicDesc
										    }

										})

									})
			                    }
			             	})

	            		}
	            		else{
	            			this.createPackageServiceContentList.forEach((n)=>{
								n.minquantity = n.quantity
							})
							this.hsPackageServiceItemList.forEach((n)=>{
								Vue.set(n,'applyTrue',true)
							})
				            this.createHsPackageMenuList.forEach((e)=>{
							    this.newCreateContractsets.forEach((n)=>{
								    if( e.hsPackageId==n.id){
								        e.pakename = n.packageName
								    }
								})
							})

				            this.createPackageServiceContentList.forEach((e)=>{
							    hsPackageServiceContentTypes.forEach((n)=>{
								    if( e.type==n.dicValue){
								        e.typeText = n.dicDesc
								    }

								})

							})
	            		}

	            	}
            	}



            },




			 cancelNewContractHandle(){  //放弃提交
                this.dialogNewContract = false;
                this.repeatedCommit = false
                this.radioStatus='0';
			    this.radioStatus1='0';
			    this.radioSchedules='0';
			    this.isDontEat = false
			    this.isSubmitOrClear = false;
			    this.isTabsValide = false;
			    this.createApplyShow = true;
			    this.paymentHistory = [
            		{'index':0,'time':'','text':'','remark':''},
            		{'index':1,'time':'','text':'','remark':''},
            		{'index':2,'time':'','text':'','remark':''},
            		{'index':3,'time':'','text':'','remark':''},
            	]
			    this.newCreateContractsets = [],
				this.$refs['createNewContracts'].resetFields();
				this.$refs['createEssentialInformations'].resetFields();
				this.$refs['createEssentialInformations1'].resetFields();
				this.createAllAcount = 0  //总金额
                this.hsPackageServiceItemList = []  //服务内容
                this.hsPackageItemList = [] //项目
                this.createPaymentConventionList =  []
                this.createSupplementaryItems = []  //补充事项
                this.followDetailsTable = []  //打印内容
				this.hsOrderDetailList = {}
				this.hsOrderDetailList.hsSchedule = {
					"banquetHallList":[],
					"scheduleTime":'',
					"scheduleType":'',
					"storeName":''
				}
				this.createPriceContents = {
					hsPackageId:'',
					estimateTableNumber:'',
					tableNumber:'',
					diningTableForm:''
				}
            },
            paymentIsOk(){
            	let allMoney = 0;
            	if(this.createPaymentConventionList.length){
            		for(var i=0;i<this.createPaymentConventionList.length;i++){
						if(this.createPaymentConventionList[i].amount === '' || this.createPaymentConventionList[i].lastPaymentTime === ''){

							this.$message.error("请编辑好"+this.createPaymentConventionList[i].paymentItem)
							this.activeName = '3'
							this.paymentOk = false
							this.repeatedCommit = false
							return false
						}
						else{
							this.paymentOk = true
							this.repeatedCommit = true
						}
						allMoney +=Number(this.createPaymentConventionList[i].amount)
					}
					if(allMoney != this.createAllAcount){
						this.$message.error("款项总金额和合同总金额不相符，请修改")
						this.activeName = '3'
						this.paymentOk = false
						this.repeatedCommit = false
					}
					return this.paymentOk
            	}

            },
            format12(time){
                return moment(time).format('YYYY-MM-DD')
            },
            paymentIsOk1(){
            	if(this.isCreateOrderHandle && this.orderHandleNumber !=1){
            		for(var i=1;i<this.createPaymentConventionList.length;i++){
						let a = this.createPaymentConventionList[i-1].lastPaymentTime.length
	            		let b = this.createPaymentConventionList[i].lastPaymentTime.length
	            		let a1 = this.createPaymentConventionList[i-1].lastPaymentTime.substring(0,10)
	            		let b1 = this.createPaymentConventionList[i].lastPaymentTime.substring(0,10)
						if(moment(b1).isBefore(a1)){
							this.$message.error(this.createPaymentConventionList[i].paymentItem+'时间不能小于'+this.createPaymentConventionList[i-1].paymentItem+'时间')
							this.activeName = '3'
							this.paymentOk1 = false
							this.repeatedCommit = false
							return false
						}
						else{
							this.paymentOk1 = true
							this.repeatedCommit = true
						}
					}
            	}
            	else{
            		this.paymentOk1 = true
            	}
				return this.paymentOk1
            },
            confirmNewContractHandle(number){  //提交
            	this.orderHandleNumber = number
            	this.repeatedCommit = true
            	this.paymentIsOk1()
            	if(this.paymentOk1){
            		var self = this;
	            	let submitTrue = ''
			        let roleForm = ''
			        let data = {}
	            	if(self.createNewContracts.customer == '' && self.createNewContracts.type !=1 && this.isCreateOrderHandle){
	            		self.$message.error('客户不能为空！')
	            		self.activeName = '1'
	            		self.repeatedCommit = false
	            		return
	            	}
	            	else{
	            		if(self.createNewContracts.type === ''){
	            			self.$message.error('类型不能为空！')
		            		self.activeName = '1'
		            		self.repeatedCommit = false
		            		return
	            		}
	            		else{
	            			if(self.createNewContracts.contrantIdea === ''){
	            				self.$message.error('订单意向不能为空！')
			            		self.activeName = '1'
			            		self.repeatedCommit = false
			            		return
	            			}
	            			else{
	            				if(self.createNewContracts.contrantIdea != 3 && self.createNewContracts.saveDay === '' && this.isCreateOrderHandle){
		            				self.$message.error('请选择保留天数！')
							        self.repeatedCommit = false
							        self.activeName = '1'
							        return
		            			}
	            				else{
	            					if(this.radioSchedules == 0 && number != 0 && (self.createNewContracts.schedule === '' || self.createNewContracts.scheduleTimeType === '' || self.createNewContracts.banquetHall.length === 0)){
			            				if((self.createNewContracts.schedule == '' || self.createNewContracts.schedule == undefined) && self.radioSchedules !=1){
								            self.$message.error('请选择档期！')
								            self.activeName = '1'
								            self.repeatedCommit = false
								            return
								        }
								        else if((self.createNewContracts.scheduleTimeType == '' || self.createNewContracts.scheduleTimeType == undefined) && self.createNewContracts.scheduleTimeType != '0' && self.radioSchedules !=1){
								         	self.$message.error('请选择场次！')
								         	self.repeatedCommit = false
								         	self.activeName = '1'
								            return
								        }
								        else if(self.createNewContracts.banquetHall == '' && self.radioSchedules !=1){
								            self.$message.error('请选择宴会厅！')
								            self.repeatedCommit = false
								            self.activeName = '1'
								            return
								        }
			            			}
				            		else{
				            			if(number == 1){
					            			data = {
						            			"creator":JSON.parse(localStorage.getItem("userInfo")).id,
							            		"hsCustomerId":self.createNewContracts.customer,
							            		"type":self.createNewContracts.type,
							            		"status":self.createNewContracts.contrantIdea,
							            		"intentionStatus":self.createNewContracts.contrantIdea,
							            		"cityCode":self.researchOrderTable.cityCode,
							            		"retainDays":self.createNewContracts.saveDay,
							            		"receiptId": self.createNewContracts.receiptId,
							            		"hsScheduleList":[],
						            		}
						            		if(self.createNewContracts.banquetHall){
							            		for(var i=0;i<self.createNewContracts.banquetHall.length;i++){
							            			let a = {
							            				"hallId":self.createNewContracts.banquetHall[i],
							            				"scheduleTimeType":self.createNewContracts.scheduleTimeType,
							            				"scheduleTime": self.createNewContracts.schedule,
							            				'storeId':self.banquetHalls[0].storeId,
							            			}
							            			data.hsScheduleList.push(a)
							            		}
							            	}
							            	if(self.radioStatus !=0 && self.createNewContracts.receiptId === ''){
							            		self.$message.error('请选择纸质收据！')
									            self.repeatedCommit = false
									            return
							            	}
							            	else{
							            		self.$axios({
													url: "/order/saveHsOrder?scheuleType="+self.radioSchedules+'&receiptType='+self.radioStatus,
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
													if(res.statue == 500){
														self.repeatedCommit = false
													}
													if(res.data.res=='0'){
													    self.$message({
													        message: '恭喜你，成功创建',
													        type: 'success'
													    });
													    self.initAllOrderList(self.tableData)
														self.cancelNewContractHandle()
														self.repeatedCommit = false
													}else {
													    self.$message.error(res.data.msg)
													    self.repeatedCommit = false
													}
												});
							            	}
					            		}
					            		else{

					            			data = {
						            			"creator":JSON.parse(localStorage.getItem("userInfo")).id,
								            	"hsCustomerId":self.createNewContracts.customer,
								            	"type":self.createNewContracts.type,
								            	"status":self.createNewContracts.contrantIdea,
								            	"cityCode":self.researchOrderTable.cityCode,
								            	"retainDays":self.createNewContracts.saveDay,
								            	"id":'',
								            	"invoiceType":self.createPaymentConventions.paymentConventionType,
								            	"invoiceRemark":self.createPaymentConventions.invoiceRemark,
								            	"intentionStatus":self.createNewContracts.contrantIdea,
											    "scheduleStatus": self.createNewContracts.schedulesType,
											    "totalAmount": self.createAllAcount,
								           		"hsScheduleList": [],
											  	"hsAgreementDTO": {
											  		"id":'',
												    "brideAddress": self.createEssentialInformations.brideAddress,
												    "brideMobile": self.createEssentialInformations.brideMobile,
												    "brideName": self.createEssentialInformations.brideName,
												    "creator":JSON.parse(localStorage.getItem("userInfo")).id,
													"endTime": self.createEssentialInformations1.endTime,
												    "status":number,
												    "groomAddress":self.createEssentialInformations.groomAddress,
												    "groomMobile": self.createEssentialInformations.groomMobile,
												    "groomName": self.createEssentialInformations.groomName,
												    "hsAgrPackageDTO": {
													    "creator": JSON.parse(localStorage.getItem("userInfo")).id,
													    "diningTableForm": self.createPriceContents.diningTableForm,
													    "estimateTableNumber": self.createPriceContents.estimateTableNumber,
													    "hsPackageId": self.createPriceContents.hsPackageId,
													    "id":self.hsAgrPackageId,
														"tableNumber": self.createPriceContents.tableNumber,
													    "totalAmount": self.createAllAcount,
													    "type": self.createNewContracts.type,
													},
													"hsAgrPackageItemList": [],
													"hsAgrPackageMenuList": [],//查看菜单的列表
													"hsAgrPkgServiceContentList": [],//查看内容
												    "hsAgrPkgServiceItemList": [],//项目
													"hsAgrPkgSupplementMattersList": [],  //补充事项
													"hsAgreementFundsList": [],    //付款约定
													"hsCustomerId": self.createNewContracts.customer,
													"partyA": self.createEssentialInformations.partyA,
													"partyAId": self.createEssentialInformations.partyAId,
													"partyAContacts": self.createEssentialInformations1.partyAContacts,
													"partyAMobile": self.createEssentialInformations1.partyAMobile,
													"partyBContacts": self.createEssentialInformations1.partyBContacts,
													"partyBMobile": self.createEssentialInformations1.partyBMobile,
													"startTime": self.createEssentialInformations1.startTime,
													"totalAmount": self.createAllAcount,
												}
											}
											if(self.isSecondApplyOrder){
												data.intentionStatus = 3
												data.status = 3
											}
											if(self.isCreateOrderHandle){
												data.id = ''
												data.hsAgreementDTO.id = ''
											}
											else{
												data.id = self.dataId
												data.hsAgreementDTO.id = self.hsAgreementDTOId
											}
											if(self.hsPackageServiceItemList.length){
								           		for(var i=0;i<self.hsPackageServiceItemList.length;i++){
								           			let a =  {
													    "content": self.hsPackageServiceItemList[i].content,
													    "creator":JSON.parse(localStorage.getItem("userInfo")).id,
													    "hsPackageId": self.createPriceContents.hsPackageId,
													    "name": self.hsPackageServiceItemList[i].name,
													    "quantity": self.hsPackageServiceItemList[i].quantity,
													    "totalAmount": self.hsPackageServiceItemList[i].totalAmount,
														"type": self.createNewContracts.type,
														"unit": self.hsPackageServiceItemList[i].unit,
														"unitPrice": self.hsPackageServiceItemList[i].unitPrice
													}
													data.hsAgreementDTO.hsAgrPkgServiceItemList.push(a)
								            	}
								            }
								            if(self.createHsPackageMenuList.length){
								            	for(var i=0;i<self.createHsPackageMenuList.length;i++){
								            		let adjustPackageId = ''
								            		let packageId = ''
								            			for(var j=0;j< self.newCreateContractsets.length;j++){
								            				if(self.createHsPackageMenuList[i].alterPakename == self.newCreateContractsets[j].packageName){
								            					adjustPackageId = self.newCreateContractsets[j].id
								            				}
								            				if(self.createHsPackageMenuList[i].pakename == self.newCreateContractsets[j].packageName){
								            					packageId = self.newCreateContractsets[j].id
								            				}
								            			}
								            			let a =  {
														    "adjustName": self.createHsPackageMenuList[i].alternateName,
														    "name":self.createHsPackageMenuList[i].name,
														    "adjustPackageId": adjustPackageId,
														    "hsPackageId": packageId,
														    "isAdded": 1,
														}
														if(self.createHsPackageMenuList[i].alternateName !=''){
															a.isAdded = 0
														}
														else{
															a.adjustPackageId = ''
														}
														data.hsAgreementDTO.hsAgrPackageMenuList.push(a)
								            		}
								            	}
								            	if(self.createPackageServiceContentList.length){
								            		for(var i=0;i<self.createPackageServiceContentList.length;i++){
								            			let a =  {
														    "adjustable": self.createPackageServiceContentList[i].adjustable,
														    "content": self.createPackageServiceContentList[i].content,
														    "hsPackageId":self.createPriceContents.hsPackageId,
														    "quantity": self.createPackageServiceContentList[i].quantity,
														    "minQuantity": self.createPackageServiceContentList1[i].quantity,
														    "unit": self.createPackageServiceContentList[i].unit,
														    "remark": self.createPackageServiceContentList[i].remark,
														    "type":self.createPackageServiceContentList[i].type,
														    "unitPrice":self.createPackageServiceContentList[i].unitPrice,
														}
														data.hsAgreementDTO.hsAgrPkgServiceContentList.push(a)
								            		}
								            	}
								            	if(self.hsPackageItemList.length){
								            		for(var i=0;i<self.hsPackageItemList.length;i++){
								            			let a = {
														    "content": self.hsPackageItemList[i].content,
														    "creator":JSON.parse(localStorage.getItem("userInfo")).id,
														    "hsPackageId": self.createPriceContents.hsPackageId,
														    "name": self.hsPackageItemList[i].name,
														    "quantity":self.hsPackageItemList[i].quantity,
														    "totalAmount": self.hsPackageItemList[i].totalAmount,
														    "unit": self.hsPackageItemList[i].unit,
														    "unitPrice":self.hsPackageItemList[i].unitPrice,
														    "packageType":self.hsPackageItemList[i].packageType,
														    "type":self.hsPackageItemList[i].type,
														}
														data.hsAgreementDTO.hsAgrPackageItemList.push(a)
								            		}
								            	}
								            	if(self.createSupplementaryItems.length){
								            		for(var i=0;i<self.createSupplementaryItems.length;i++){
								            			let a = {
								            				"content": self.createSupplementaryItems[i].content,
														    "creator":JSON.parse(localStorage.getItem("userInfo")).id,
														    "hsPackageId": self.createPriceContents.hsPackageId,
								            			}
								            			data.hsAgreementDTO.hsAgrPkgSupplementMattersList.push(a)
								            		}
								            	}
								            	if(self.createPaymentConventionList.length){
								            		for(var i=0;i<self.createPaymentConventionList.length;i++){
								            			let name = ''
								            			for(var j=0;j<self.dec.payment_item.length;j++){
								            				if(self.createPaymentConventionList[i].paymentItem == self.dec.payment_item[j].dicDesc){
								            					name = self.dec.payment_item[j].dicValue
								            				}
								            			}
								            			let a =  {
														    "amount": self.createPaymentConventionList[i].amount,
														    "creator":JSON.parse(localStorage.getItem("userInfo")).id,
															"hsPackageId": self.createPriceContents.hsPackageId,
														    "hsCustomerId":self.createNewContracts.customer,
														    "hsPaperReceiptId": self.createNewContracts.receiptId,
														    "lastPaymentTime": self.createPaymentConventionList[i].lastPaymentTime.substring(0,10),
														    "percentage": self.createPaymentConventionList[i].percentageOfPayment,
														    "type":name,
														    "receiptType":0
														}
													    data.hsAgreementDTO.hsAgreementFundsList.push(a)
								            		}
								            		if(self.radioStatus1== 1){
								            			data.hsAgreementDTO.hsAgreementFundsList[0].receiptType = 1
								            			data.hsAgreementDTO.hsAgreementFundsList[0].hsPaperReceiptId = self.createNewContracts.receiptId
								            		}
								            	}
								            	if(self.createNewContracts.banquetHall){
								            		for(var i=0;i<self.createNewContracts.banquetHall.length;i++){
								            			let a = {
								            				"hallId":self.createNewContracts.banquetHall[i],
								            				"scheduleTimeType":self.createNewContracts.scheduleTimeType,
								            				"scheduleTime": self.createNewContracts.schedule,
								            				'storeId':self.banquetHalls[0].storeId,
								            			}
								            			data.hsScheduleList.push(a)
								            		}
								            	}
								            	if(self.createNewContracts.type == 0){
									            	roleForm = 'createEssentialInformations'
									            	data.hsAgreementDTO.partyA = self.createEssentialInformations.partyA
									            }
									            else{
									            	roleForm = 'createEssentialInformations1'
									            	data.hsAgreementDTO.partyA = self.createEssentialInformations1.partyA
									            }
									            if(number == 0){
							            			self.$axios({
														url: "/order/saveHsOrder?scheuleType="+0+'&receiptType='+0,
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
														if(res.statue == 500){
															self.repeatedCommit = false
														}
														if(res.data.res=='0'){
															self.$message({
															    message: '恭喜你，成功创建',
															    type: 'success'
															});
															self.isSubmitOrClear = false;
															self.initAllOrderList(self.tableData)
															self.cancelNewContractHandle()
															self.repeatedCommit = false
														}else {
															self.$message.error(res.data.msg)
															self.repeatedCommit = false
														}
													});
							            		}
							            		else{
							            			self.$refs[roleForm].validate((valid) => {
														if (valid) {
															if(self.createPriceContents.hsPackageId===''){
																self.$message.error('请选择套系！')
												            	self.repeatedCommit = false
												            	self.activeName = '2'
												            	return
															}
															else{
																if((self.createPriceContents.diningTableForm==='' || self.createPriceContents.diningTableForm===null) && self.createNewContracts.type != 0 && !self.isDontEat){
																	self.$message.error('请选择餐桌形式！')
													            	self.repeatedCommit = false
													            	self.activeName = '2'
													            	return
																}
																else{
																	self.paymentIsOk()
																	if(self.paymentOk){
																		if(self.createPaymentConventions.paymentConvention == 1 && (self.createPaymentConventions.paymentConventionType === '' || self.createPaymentConventions.invoiceRemark === '')){
																			if(self.createPaymentConventions.paymentConventionType === ''){
																				self.$message.error('请选择发票类型！')
																            	self.repeatedCommit = false
																            	self.activeName = '3'
																            	return
																			}
																			if(self.createPaymentConventions.invoiceRemark === ''){
																				self.$message.error('请填写发票备注！')
																            	self.repeatedCommit = false
																            	self.activeName = '3'
																            	return
																			}
																		}
																		else{
																			self.$axios({
																		        url: "/order/saveHsOrder?scheuleType="+0+'&receiptType='+0,
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
																		    	if(res.statue == 500){
																					self.repeatedCommit = false
																				}
																		        if(res.data.res=='0'){
																		            self.isShowFinishOrder = false
																		            self.initAllOrderList(self.tableData)
																		            self.cancelNewContractHandle()
																		            self.repeatedCommit = false
																			        self.$message({
																				        message: '恭喜你，成功创建',
																				        type: 'success'
																				    });
																		        }else {
																		            self.$message.error(res.data.msg)
																		            self.repeatedCommit = false
																		        }
																		    })
																		}

																	}
																}
															}


														} else {
															self.$message.error('请填写必要的基本信息！')
															self.activeName = '1'
															self.repeatedCommit = false
												            return false;
														}
													})
					            			}

					            		}
				            		}
	            				}
	            			}

	            		}

	            	}
            	}

			}
        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    "cityCode":this.researchOrderTable.cityCode,
                    "scheduleStatus":this.researchOrderTable.scheduleStatus,
                    "agreementStatus":this.researchOrderTable.agreementStatus,
                    "orderStatus":this.researchOrderTable.orderStatus,
                    "hallId":this.researchOrderTable.hallId,
                    "orderNo":this.researchOrderTable.orderNo,
                    "agreementNo":this.researchOrderTable.agreementNo,
                    "mobile":this.researchOrderTable.mobile,
                    "scheduleTime":this.researchOrderTable.scheduleTime,
                    "startHsAgreementDate":this.researchOrderTable.startHsAgreementDate,
					"endHsAgreementDate":this.researchOrderTable.endHsAgreementDate,
                }
            },
            shengheTable(){
             return{
                 "pageNow":this.shenghePagination.pageNow,
                 "pageSize":this.shenghePagination.pageSize,
                 'hsOrderId':this.shengheTableData.hsOrderId
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
					allOrderApplyOrder : filterBtnPms(this.btnAllPms.allOrderApplyOrder),  //申请订单
		            allOrderApplyAgreement : filterBtnPms(this.btnAllPms.allOrderApplyAgreement),   //申请合同
		            allOrderChangeOrder : filterBtnPms(this.btnAllPms.allOrderChangeOrder),  //变更合同
		            allOrderApplyOrderSchedule : filterBtnPms(this.btnAllPms.allOrderApplyOrderSchedule),  //申请档期
		            allOrderSupplementReceipt : filterBtnPms(this.btnAllPms.allOrderSupplementReceipt),  //补开收据
		            allOrderCanelOrder : filterBtnPms(this.btnAllPms.allOrderCanelOrder),  //取消订单
		            allOrderEditOrder : filterBtnPms(this.btnAllPms.allOrderEditOrder),  //编辑合同
		            allOrderchangeSchdule : filterBtnPms(this.btnAllPms.allOrderchangeSchdule),  //修改档期
		            allOrderApprovalStatus : filterBtnPms(this.btnAllPms.allOrderApprovalStatus),  //审批状态
		            allOrderReceiptByHand : filterBtnPms(this.btnAllPms.allOrderReceiptByHand),  //手工开收据
		            allOrderAuditRecord : filterBtnPms(this.btnAllPms.allOrderAuditRecord),  //审核记录
		            allOrderTurnOutSale : filterBtnPms(this.btnAllPms.allOrderTurnOutSale),  //转出销售
				}
        	console.log( JSON.parse(localStorage.getItem("userInfo")).deptDetail)
			if(jQuery.isEmptyObject(JSON.parse(localStorage.getItem("userInfo")).deptDetail) ||JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:FINANCIAL'){
				this.isShowMoney = true
			}
			else{
				this.isShowMoney = false
			}
			this.initDec()
            this.initCity()
            this.initOpenCity()
            this.getUsedHsPaperReceiptList()
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
        watch:{
        	createPaymentConventionList:function(val,oldValue){
		        console.log(val)
		        console.log(oldValue)
		    }

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
        min-width:100px;
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
