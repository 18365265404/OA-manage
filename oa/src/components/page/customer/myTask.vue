<template>
    <div>
        <div class="crumbs">
        	<div style='float:right'>
            	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm">
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
            </div>
        </div>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的任务</el-breadcrumb-item>
            </el-breadcrumb>



        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline grayForm">
		  <el-form-item label="手机：" prop='mobile'>
		    <el-input class='lengthInput' v-model="formInline.mobile" @keyup.enter.native="onSubmit"></el-input>
		  </el-form-item>
		  <el-form-item label="状态：" :label-width="formLabelWidth1" prop='status'>
				<el-select v-model="formInline.status" clearable placeholder="请选择">
				    <el-option
				      v-for="type in storeStatus"
				      :key="type.dicValue"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="上次操作：" :label-width="formLabelWidth1" prop='lastOperatingType'>
				<el-select v-model="formInline.lastOperatingType" clearable placeholder="请选择">
				    <el-option
				      v-for="type in lastOprations"
				      :key="type.dicValue"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="渠道：" :label-width="formLabelWidth1" prop='channelId'>
				<el-select v-model="formInline.channelId" clearable placeholder="请选择">
				    <el-option
				      v-for="type in channelIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="销售：" :label-width="formLabelWidth1" prop='salesId'>
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
            <el-form-item label="分配开始时间：" prop="startHsAgreementDate">
                <div class="block">
                    <el-date-picker
                        size="small"
                        v-model="formInline.assignStartDate"
                        type="date"
                        :editable="false"
                        format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="分配结束时间："  prop="endHsAgreementDate">
                <div class="block">
                    <el-date-picker
                        size="small"
                        v-model="formInline.assignEndDate"
                        type="date"
                        :editable="false"
                        format="yyyy-MM-dd">
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

        <el-tabs v-model="editableTabsValue" @tab-click="handleClick">
            <el-tab-pane
                :key="item.name"
                v-for="(item, index) in editableTabs"
                :label="item.title"
                :name="item.name"
            >
                <el-table v-loading="loading.pageList" element-loading-text="拼命加载中" :data="CurrentTaskList" border style="width: 100%">
                    <el-table-column prop="customerName" label="客户"></el-table-column>
                    <el-table-column prop="mobile" label="手机" >
                    	<template scope="scope">
                    		<span style='color:#4db3ff;cursor:pointer' @click="followUpDetails(scope.$index, scope.row,1)">
			                       {{scope.row.mobile}}
			                    </span>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="cityName" label="城市">
                    	<template scope="scope">
		                    <div>{{cityText(scope.row.cityCode)}}</div>
		                </template>
                    </el-table-column>
                    <el-table-column prop="statusText" label="状态"></el-table-column>
                    <el-table-column prop="channelName" label="来源"></el-table-column>
                    <el-table-column prop="lastOperateText"  v-if="editableTabsValue != 3" label="上次操作"></el-table-column>
                    <el-table-column prop="salesName" v-if="editableTabsValue == 2" label="销售"></el-table-column>
                    <el-table-column prop="assignDate" v-if="editableTabsValue == 2" label="分配时间">
                    	<template scope="scope">
		                    <div>{{formTimeAssign(scope.row)}}</div>
		                </template>
                    </el-table-column>
                    <el-table-column prop="lastOperatingDate" v-if="editableTabsValue != 3" label="上次操作时间">
                    	<template scope="scope">
		                    <div>{{formTime(scope.row)}}</div>
		                </template>
                    </el-table-column>
                    <el-table-column prop="createTime" v-if="editableTabsValue == 1" label="创建时间">
                    	<template scope="scope">
		                    <div>{{formTimeCreate(scope.row.createTime)}}</div>
		                </template>
                    </el-table-column>
                    <el-table-column prop="planDate" v-if="editableTabsValue == 3" label="计划操作时间">
                    	<template scope="scope">
		                    <div>{{formPlanDate(scope.row)}}</div>
		                </template>
                    </el-table-column>
                    <el-table-column prop="statusText" label="跟进">
                    	<template scope="scope">
                    		<el-button class='btn'
                    				type="text"
			                        size="small" @click="followUpDetails(scope.$index, scope.row,2)">
			                       跟进详情
			                    </el-button>
                    	</template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作">
				    	<template scope="scope">
				    		<div class="btnDiv">
				    			<p>
				    				<el-button class='btn'
						          type="primary" size="small" @click="confirmRemark(scope.$index, scope.row , 0)">
							          	备注
							        </el-button>
				    			</p>
				    			<p>
				    				<el-button class='btn'
						          type="primary" v-if='(scope.row.status == -1 || scope.row.status == 0 || scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5 || scope.row.status == 8 || scope.row.status == 11 || scope.row.status == 18 || scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 14 || scope.row.status == 17) && ((isKFB && scope.row.returnType !=4) || isXSB) && customerModifyStatus && ((editableTabsValue !=3 && editableTabsValue !=2) || isXSB)' size="small" @click="followUpDetails(scope.$index, scope.row,1)">
								          	改状态
								     </el-button>
				    			</p>
						     	<p>
						     		<el-button class='btn'
						          type="primary" v-if='(scope.row.status == -1 || scope.row.status == 0 || scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5 || scope.row.status == 8 || scope.row.status == 11 || scope.row.status == 18 || scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 14 || scope.row.status == 17) && ((isKFB && scope.row.returnType !=4) || isXSB) && (customerAddNewplan) && ((editableTabsValue !=3 && editableTabsValue !=2) || isXSB)' size="small" @click="confirmNewPlan(scope.$index, scope.row , 1)">
								          	新计划
								     </el-button>
						     	</p>
						        <p>
						        	<el-button class='btn'
						          type="primary" v-if='((scope.row.status == 0 || scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5 || scope.row.status == 8 || scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 14 || scope.row.status == 17) && (scope.row.returnType != 4 && isKFB) && (customerAssign && scope.row.salesId == null) && ((editableTabsValue !=3 && editableTabsValue !=2) || isXSB))' size="small" @click="distributionBtn(scope.$index, scope.row , 2)">
								          	分配
								     </el-button>
						        </p>
						     	<p>
						     		<el-button class='btn'
			                        type="primary"
			                        size="small" v-if='(scope.row.status == -1 || scope.row.status == 1 || scope.row.status == 6 || scope.row.status == 7 || scope.row.status == 9 || scope.row.status == 11 || scope.row.status == 18 || scope.row.status == 15 || scope.row.status == 16) && scope.row.returnType != 4 && customerConfirmInvalid' @click="confirmInvalid(scope.$index, scope.row)">
				                       	确认无效
				                    </el-button>
						     	</p>
						        <p>
						        	<el-button class='btn'
			                        type="primary"
			                        size="small" v-if='(scope.row.status == 1 || scope.row.status == 6 || scope.row.status == 7 || scope.row.status == 9 || scope.row.status == 10 || scope.row.status == 15 || scope.row.status == 16) && customerTurnValid && scope.row.returnType != 4 ' @click="confirmVisible(scope.$index, scope.row)">
				                      	  转有效
				                    </el-button>
						        </p>
						        <p>
						        	<el-button class='btn'
			                        type="primary" v-if='(scope.row.status == -1 || scope.row.status == 0 || scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4 || scope.row.status == 5 || scope.row.status == 8 || scope.row.status == 11 || scope.row.status == 18 || scope.row.status == 12 || scope.row.status == 13 || scope.row.status == 14 || scope.row.status == 17) && (scope.row.returnType !=4 ) && (customerApplyVisit) && ((editableTabsValue !=3 && editableTabsValue !=2) || isXSB || isAdmin) && scope.row.channelType !=2'
			                        size="small"  @click="applyForReturnVisit(scope.$index, scope.row)">
				                      	  申请回访
				                    </el-button>
						        </p>
			                    <p>
						        	<el-button class='btn'
			                        type="primary" v-if='(scope.row.returnType ==4 ) && (customerCompletingVisit) && (editableTabsValue !=3)'
			                        size="small"  @click="confirmRemark(scope.$index, scope.row,3)">
				                      	  完成回访
				                    </el-button>
						        </p>
						        <p>
						        	<el-button class='btn'
			                        type="primary" v-if='(scope.row.returnType ==4 ) && (customerVisiting) && (editableTabsValue !=3 || isXSB)'
			                        size="small" disabled>
				                      	 回访中
				                    </el-button>
						        </p>
				    		</div>


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
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="pagination.pageNum"
                                   :page-sizes="[10, 25,50 ,100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next" :total="pagination.total">>
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <el-dialog  :title="remarkTitle" :visible.sync="dialogRemarkVisible" :before-close="cancelRemarkHandle">
			 <el-form :model='remarks' ref="remarks" :rules='remarkRules' >
				<el-form-item label="姓名：" prop='customerName' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.customerName}}</span>
				</el-form-item>
				<el-form-item label="手机：" prop='mobile' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.mobile}}</span>
				</el-form-item>
				<el-form-item label="新计划：" v-if='isNewPlan' prop='planDate' :label-width="formLabelWidth">
				    <div class="block">
					    <el-date-picker
					      v-model="remarks.planDate"
					      type="date"
					      placeholder="选择日期" @change="startDateChange"
					      :picker-options="pickerOptions0">
					    </el-date-picker>
					  </div>
				</el-form-item>
				<el-form-item label="分配：" v-if='isDistribution' prop='assginSale' :label-width="formLabelWidth">
				    <el-select v-model="remarks.assginSale" clearable placeholder="请选择">
					    <el-option
					      v-for="type in salesIds"
					      :key="type.id"
	                      :label="type.nickName"
	                      :value="type.id">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注：" v-if='isRemark' prop='remark' :label-width="formLabelWidth">
				    <el-input type='textarea' class='lengthInput' v-model="remarks.remark"></el-input>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="remarkHandle('remarks')">确定</el-button>
			    <el-button @click="cancelRemarkHandle">取 消</el-button>
			  </div>
			</el-dialog>


        <el-dialog  title="确认无效" :visible.sync="dialogInvalidVisible" :before-close="cancelConfirmInvalidHandle">
			 <el-form :model='confirmInvalids' ref="confirmInvalids">
				<el-form-item label="姓名：" prop='customerName' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.customerName}}</span>
				</el-form-item>
				<el-form-item label="手机：" prop='mobile' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.mobile}}</span>
				</el-form-item>
				<el-form-item label="推送婚礼人：" prop='weddingType' :label-width="formLabelWidth">
				    <el-card class="box-card row_card">
                      <div class="text item">
                            <el-row class='system_row'>
                                <el-col>
                                    <div>
                                    	<el-radio-group v-model="weddingTypes" @change="selectRadioDataAll">
                                    		<el-radio>无效</el-radio>
										    <el-radio class='radio' v-bind:value="item.dicDesc" v-for="item in weddingSelects" :label="item.dicValue">{{item.dicDesc}}</el-radio>
										  </el-radio-group>

                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="confirmInvalidHandle">确定</el-button>
			    <el-button @click="cancelConfirmInvalidHandle">取 消</el-button>
			  </div>
			</el-dialog>


		<el-dialog  title="转有效" :visible.sync="dialogVisible" :before-close="cancelConfirmVisibleHandle">
			 <el-form :model='confirmVisibles' ref="confirmVisibles">
				<el-form-item label="姓名：" prop='customerName' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.customerName}}</span>
				</el-form-item>
				<el-form-item label="手机：" prop='mobile' :label-width="formLabelWidth">
				    <span>{{confirmInvalids.mobile}}</span>
				</el-form-item>
				<el-form-item label="分配：" prop='salesId' :label-width="formLabelWidth">
				    <el-select v-model="confirmVisibles.salesId" clearable placeholder="请选择">
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
			    <el-button type="primary" icon='document' @click="confirmVisibleHandle">确定</el-button>
			    <el-button @click="cancelConfirmVisibleHandle">取 消</el-button>
			  </div>
			</el-dialog>


        <el-dialog :title="tableDialogTitle" size='large' :visible.sync="dialogTableVisible" :before-close="cancelChangeVisibleHandle">
        	<el-form :model="changeStatus" ref='changeStatus' v-show='isMobile == 1'>
        		<div>
        			<el-form-item class='inline-form' label="客户：" :label-width="formLabelWidth2">
        				<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.customerName}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.customerName" auto-complete="off"></el-input>				 	                </el-form-item >
				    <el-form-item class='inline-form' label="手机：" :label-width="formLabelWidth2">
				    	<span class='hiddenspan'>{{changeStatus.mobile}}</span>
				    </el-form-item>
				     <el-form-item class='inline-form' :label-width="formLabelWidth2">
				      <el-button v-show='!isEdit' class='btn' type="primary" @click="editHandle">编辑</el-button>
				      <el-button v-show='isEdit' class='btn' type="primary" @click="editHandle">确定</el-button>
				    </el-form-item>
				    <el-form-item class='inline-form' v-if='isImportant'>
				      <el-button v-show='isimportant' class='btn' type="primary" @click="editVipHandle(1)">标记为vip</el-button>
				      <el-button v-show='!isimportant' class='btn' type="primary" @click="editVipHandle(2)">取消标记vip</el-button>
				    </el-form-item>
        		</div>
	        	<div>
        			<el-form-item class='inline-form' label="城市：" :label-width="formLabelWidth2">
				    	 <span class='hiddenspan'>{{changeStatus.cityName}}</span>
		        	</el-form-item >
				    <el-form-item class='inline-form' label="预算：" :label-width="formLabelWidth2">
				    	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.budget}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.budget" auto-complete="off"></el-input>
				    </el-form-item>
				     <el-form-item class='inline-form' label="桌数：" :label-width="formLabelWidth2">
				     	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.tableNumber}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.tableNumber" auto-complete="off"></el-input>
				    </el-form-item>
				     <el-form-item class='inline-form' label="档期：" :label-width="formLabelWidth2">
				     	<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.bookingTime}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.bookingTime" auto-complete="off"></el-input>
				    </el-form-item>
        		</div>
        		<el-form-item  label="数据备注" prop='DataRemark' :label-width="formLabelWidth2">
				    <el-input class='textarea' type='textarea' disabled v-model="changeStatus.DataRemark" auto-complete="off"></el-input>
		        </el-form-item >
		        <el-form-item v-show='editableTabsValue ==1' label="跟进备注" prop='remark' :label-width="formLabelWidth2">
				    <el-input class='textarea' type='textarea' v-model="changeStatus.remark" auto-complete="off"></el-input>
		        </el-form-item >
		        <el-form-item v-show='panduanStatus1 && editableTabsValue !=2 && editableTabsValue !=3' label="状态：" :label-width="formLabelWidth2" prop='status'>
					<el-select v-model="changeStatus.status" @change='changesatusHandle' clearable placeholder="请选择">
					    <el-option
					      v-for="type in storeStatuValues"
					      :key="type.dicDesc"
	                      :label="type.dicDesc"
	                      :value="type.dicValue">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-show='panduanStatus4 && editableTabsValue !=2 && editableTabsValue !=3' prop='statusType' :label-width="formLabelWidth2">
					<el-radio-group v-model="statusType" @change="changeselectRadiovalide">
						<el-radio class="radio" v-model="statusType" label="10">确认无效</el-radio>
	  					<el-radio class="radio" v-model="statusType" label="0">转有效</el-radio>
  					</el-radio-group>
				</el-form-item>
				<el-form-item v-show='panduanStatus2 && editableTabsValue !=2 && editableTabsValue !=3' label="分配：" :label-width="formLabelWidth2" prop='salesId'>
					<el-select v-model="changeStatus.salesId" @change='changeSalesIdHandle' clearable placeholder="请选择">
					    <el-option
					      v-for="type in salesIds"
					      :key="type.id"
	                      :label="type.nickName"
	                      :value="type.id">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-show='panduanStatus6 && editableTabsValue !=2 && editableTabsValue !=3' label="类型：" prop='type' :label-width="formLabelWidth2">
				   <el-select clearable v-model="changeStatus.type" placeholder="请选择">
				    <el-option
				      v-for="type in statuss"
				      :key="type.dicDesc"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item v-show='panduanStatus3 && editableTabsValue !=2 && editableTabsValue !=3' prop='planDate' label="新计划" :label-width="formLabelWidth2">
				     <div class="block">
					    <el-date-picker
					      v-model="changeStatus.planDate"
					      type="date"
					      placeholder="选择日期" @change="planDateChange"
					      :picker-options="pickerOptions0">
					    </el-date-picker>
					  </div>
				  </el-form-item>

		        <el-form-item v-show='panduanStatus5 && editableTabsValue !=2 && editableTabsValue !=3' label="推送婚礼人：" prop='weddingType' :label-width="formLabelWidth2">
				    <el-radio-group v-model="changeweddingTypes" @change="changeselectRadioDataAll">
                        <el-radio value='' label=''>不推送</el-radio>
						<el-radio class='radio' v-for="item in weddingSelects" :label="item.dicValue"  v-bind:value="item.dicDesc" >{{item.dicDesc}}</el-radio>
					 </el-radio-group>
				</el-form-item>
				 <el-form-item v-show='customerAdvanceFinish && editableTabsValue ==3' label="提示：" :label-width="formLabelWidth2">
				    <span>计划于{{NewPlanTime}}  完成 {{NewPlanRemark}}</span>   <el-button class='btn' type="text" @click="advanceFinishHandle">提前完成</el-button>
				</el-form-item>
				<el-form-item v-show='editableTabsValue ==1' class='inline-form' :label-width="formLabelWidth2">
				      <el-button class='btn' type="primary" @click="editSubmitHandle">提交</el-button>
				</el-form-item>
        	</el-form >



            <el-table :data="followDetailsTable" border>
                <el-table-column property="createTime" label="更新时间" :formatter="formTime1"></el-table-column>
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
    </div>
</template>
<style>
    .page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
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
    .btn{
    	margin-bottom:10px
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
    import  moment from 'moment'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
            	isChangeCity:false,
            	loading:{
                    pageList:false,
                    detail:false
               },
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
                QiNiuUrl:'',
            	NewPlanTime:'',
            	NewPlanRemark:'',
            	isKfB:true,
            	isKFB:true,
            	storeCitys:[],
            	cityNames:{
            		city:''
            	},
                CurrentTaskList:[],
                editableTabsValue: '1',
                dialogInvalidVisible:false,
                dialogRemarkVisible:false,
                dialogVisible:false,
                dialogNewPlanVisible:false,
                distributionVisible:false,
                formLabelWidth1:'100px',
                formLabelWidth:'100px',
                formLabelWidth2:'100px',
                storeStatus:[],
                storeStatuValues:[],
                lastOprations:[],
                 channelIds:{},
                 salesIds:{},
                 weddingTypes:undefined,
                 changeweddingTypes:'',
                 weddingSelects:{},
                editableTabs: [{
                    title: '当前任务',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: '分配给销售',
                    name: '2',
                    content: 'Tab 2 content'
                },{
                    title: '计划任务',
                    name: '3',
                    content: 'Tab 3 content'
                }
                ],
                remarkTitle:'备注',
                tabIndex: 3,
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                formInline:{
                	mobile:'',
                	status:'',
                	lastOperatingType:'',
                	channelId:'',
                	salesId:'',
                    assignStartDate:'',
                    assignEndDate:''
                },
                confirmInvalids:{
                	hsCustomerIds:'',
                	confirmStatus:'',
                	weddingType:''
                },
                newPlans:{
                	hsCustomerIds:'',
                	mobile:'',
                	remark:'',
                	planDate:''
                },
                isNewPlan:false,
                isDistribution:false,
                ischangeStatus:false,
                isRemark:false,
                remarks:{
                	hsCustomerId:'',
                	status:'',
                	planDate:'',
                	remark:'',
                	assginSale:''
                },
                confirmVisibles:{
                	salesId:''
                },
                tableDialogTitle:'',
                dialogTableVisible:false,
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
                	planDate:'',
                	type:'',
                    remark:''
                },
                followDetailsTable:[],
                isMobile:'',
                citys:[],
                isEdit:false,
                statusType:'10',
                panduanStatus1:'',
                panduanStatus2:'',
                panduanStatus3:'',
                panduanStatus4:'',
                panduanStatus5:'',
                panduanStatus6:'',
                isCirformTurnNouValidate:'',
                pickerOptions0: { },
                followPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                distributionVisibles:{
                	salesId:''
                },
                numberData:'',
                number:'',
                number1:'',
                numberIndex:'',
                statuss:[],
                isAdmin:false,
                visiting:false,
                isimportant:true,
                isImportant:false,
                customerCompletingVisit:'',
	            customerTurnValid:'',
	            customerProcessInvalid:'',
	            customerVip:'',
	            customerPushBrand:'',
	            customerAddRemark:'',
	            customerPuahHlr:'',
	            customerAddNewplan:'',
	            customerAssign:'',
	            customerModifyStatus:'',
	            customerApplyVisit:'',
	            customerVisiting:'',
	            customerConfirmInvalid:'',
	            customerAdvanceFinish:'',
	            remarkRules:{
	            	remark: [
			            { required: true, message: '请填写备注', trigger: 'blur' }
			          ],
	            },
	            isXSB:true
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        methods: {
            getQiNiuUrlUsingGET(){
                this.$axios.get('/b/getQiNiuUrl').then((res2)=>{    //获取所有城市列表
                    if(res2.status == 200){
                        console.log(res2)
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
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initCurrentTaskList(this.tablePagination)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initCurrentTaskList(this.tablePagination)
            },
            initCurrentTaskList(data){
            	this.storeStatus = []
            	this.lastOprations = []
            	this.loading.pageList=true
            	let url = '';
            	if(this.editableTabsValue == 1){
            		url = '/customer/queryCurrentTaskList'
            		console.log(url)
            	}else if(this.editableTabsValue == 2){
            		url = '/customer/queryAssginSalesList'
            	}else if(this.editableTabsValue == 3){
            		url = '/customer/queryNewPlanList'
            	}
                this.$axios.post(url,data).then((res)=>{
                    if(res.data.res==0){
                    	this.weddingSelects = this.dicData.HLR_CUSTOMER_TYPE;
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
	                    if(filterBtnPms(this.btnAllPms.customerModifyStatus) && this.isKfB){
						   	//改状态
							this.customerModifyStatus = true;
						}
						else{
							this.customerModifyStatus = false;
						}

						if(filterBtnPms(this.btnAllPms.customerAddNewplan) && this.isKfB){
							//新计划
							this.customerAddNewplan = true;
						}
						else{
							this.customerAddNewplan = false;
						}

						if(filterBtnPms(this.btnAllPms.customerAssign) && this.isKfB){
							//分配
							this.customerAssign = true;
						}
						else{
							this.customerAssign = false;
						}

					   	if(filterBtnPms(this.btnAllPms.customerVisiting) && !this.isKfB){
						   	//回访中
						   	this.customerVisiting = true
						}
						else{
						   	this.customerVisiting = false
						}

						if(filterBtnPms(this.btnAllPms.customerCompletingVisit) && this.isKfB){
						   	//完成回访
						   	this.customerCompletingVisit = true
						}
						else{
						   	this.customerCompletingVisit = false
						}

						if(filterBtnPms(this.btnAllPms.customerApplyVisit) && this.isKfB){
						   	//申请回访
						    this.customerApplyVisit = true;
						}
						else{
						   	this.customerApplyVisit = false
						}

						if(filterBtnPms(this.btnAllPms.customerConfirmInvalid) && this.isKfB){
						   	this.customerConfirmInvalid = true;
						}
						else{
						    this.customerConfirmInvalid = false;
						}

						if(filterBtnPms(this.btnAllPms.customerTurnValid) && this.isKfB){
						   	//转有效
						   	this.customerTurnValid = true;
						}
						else{
						   	this.customerTurnValid = false;
						}

						if(filterBtnPms(this.btnAllPms.customerVip)){
						   	//标记vip
						   	this.isImportant = true;
						}
						else{
						   	this.isImportant = false;
						}
						if(filterBtnPms(this.btnAllPms.customerAdvanceFinish)){
						   	this.customerAdvanceFinish = true
						}
						else{
						   	this.customerAdvanceFinish = false
						}
						if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
						   	this.isImportant = true;
						    this.customerVisiting = true
						}
                    	this.pagination.total=res.data.msg.total;
	                    this.pagination.pageNum=res.data.msg.pageNum;
	                    this.pagination.pageSize=res.data.msg.pageSize;
                        this.CurrentTaskList=res.data.msg.list;
                        this.CurrentTaskList.forEach((e)=>{
				            console.log(e.dicValue)
					        this.dicData.HS_CUSTOMER_STATUS.forEach((n)=>{
					            if( n.dicValue==e.status){
					                e.statusText=n.dicDesc
					            }
					        })
					        this.dicData.HS_CUSTOMER_OPERATION_SOURCE.forEach((n)=>{
					            if( n.dicValue==e.lastOperatingType){
					                e.lastOperateText=n.dicDesc
					            }
					        })

					    })
                        if(this.editableTabs.length == 3){
                        	this.editableTabs[this.editableTabsValue-1].title = this.editableTabs[this.editableTabsValue-1].title.substring(0,4)+'('+res.data.msg.total+')'
                        }
                        else{
                        	if(this.editableTabsValue == 1){
                        		if(this.editableTabs[0].title.indexOf('(') == '-1'){
                        			this.editableTabs[0].title = '当前任务'+'('+res.data.msg.total+')'
                        		}
	                        }
	                        else{
	                        	if(this.editableTabs[1].title.indexOf('(') == '-1'){
	                        		this.editableTabs[1].title = '计划任务'+'('+res.data.msg.total+')'
	                        	}
	                        }
                        }
						this.loading.pageList=false
						if(this.editableTabsValue =='1'){
							if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:CUSTSERVICE'){
								this.isKFB = true
								this.isXSB = false
				        	}
				        	else{
				        		this.isKFB = false
				        	}
						}
						else{
							this.isKFB = false
						}
                    }
                    else{
                    	this.loading.pageList=false
                    	this.CurrentTaskList = []
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            },
            getOpenCity(){
            	this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
					   		if(res2.data.res == 0){
					   			this.citys =  res2.data.msg;

	  							this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
	  							this.storeCitys.forEach((e)=>{
						            this.citys.forEach((n)=>{
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
            cityText(data){
            	let cityName;
		            this.citys.forEach((n)=>{
		                if( n.cityCode==data){
		                    cityName = n.cityName
		                }

		            })
		      return cityName

            },
            statusTextHandle(data){
            	let statusName;
		            this.dicData.HS_CUSTOMER_OPERATION_SOURCE.forEach((n)=>{
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
			changeCityVisible(){
            	this.isChangeCity = true
            },
            changeCity(val){
            	this.cityNames.city = val
            	if(this.isChangeCity){
            		this.initCurrentTaskList(this.tablePagination);
            		this.isChangeCity = false
            	}

            	let url = ''
            	let newData = {

            	}
				if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey === 'DEPT:SALES'){
					url = '/s/getSalesListByUser'
					newData = {
						'cityCode':this.cityNames.city
					}
				}
				else{
					url = '/s/getSalesList'
					newData = {
						'cityCode':this.cityNames.city
					}
				}

            	this.$axios.post(url,newData).then((res4)=>{    //获取所有销售
            		console.log(2)
					if(res4.data.res == '0'){
						this.salesIds = res4.data.msg;
					}
	            })
                this.$axios.post('/s/getChannelList',{'cityCode':this.cityNames.city}).then((res3)=>{
                    if(res3.data.res == '0'){
                        this.channelIds = res3.data.msg;
                    }
		        })
            },
            handleClick(tab, event) {
		        this.editableTabsValue = tab.name;
                this.formInline.assignStartDate?this.formInline.assignStartDate=moment(this.formInline.assignStartDate).format('YYYY-MM-DD'):''
                this.formInline.assignEndDate?this.formInline.assignEndDate=moment(this.formInline.assignEndDate).format('YYYY-MM-DD'):''
		        if(jQuery.isEmptyObject(JSON.parse(localStorage.getItem("userInfo")).deptDetail)){
		        	this.isKfB = true
		        	this.customerModifyStatus = true;
					this.customerAddNewplan = true;
					this.customerAssign = true;
					this.customerCompletingVisit = true;
					this.customerCompletingVisit = true
					this.customerApplyVisit = true
		        }
		        else{
		        	if(this.editableTabs.length == 3){
			        	if(tab.name == 2){
				        	this.isKfB = false
				      	}
				      	else{
				      		this.isKfB = true
				      		if(tab.name == 3){
				      			if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
					      			this.isXSB = true
					      			this.isKFB = false
					      			this.customerModifyStatus = true;
						      		this.customerAddNewplan = true;
						      		this.customerAssign = true;
						      		this.customerCompletingVisit = true;
						      		this.customerCompletingVisit = true
					      		}
					      		else{
					      			this.isXSB = false
					      			this.customerModifyStatus = false;
						      		this.customerAddNewplan = false;
						      		this.customerAssign = false;
						      		this.customerCompletingVisit = false;
						      		this.customerCompletingVisit = false
					      		}
				      		}
				      		else{
				      			this.isXSB = true
					      		this.isKFB = false
					      		this.customerModifyStatus = true;
						      	this.customerAddNewplan = true;
						      	this.customerAssign = true;
						      	this.customerCompletingVisit = true;
						      	this.customerCompletingVisit = true
				      		}

				      	}
			        }
			        else{
				      	this.isKfB = true
				      	if(tab.name == 2){
				      		if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
					      		this.isXSB = true
					      		this.isKFB = false
					      		this.customerModifyStatus = true;
						      	this.customerAddNewplan = true;
						      	this.customerAssign = true;
						      	this.customerCompletingVisit = true;
						      	this.customerCompletingVisit = true
					      	}
					      	else{
					      		this.isXSB = false
					      		this.customerModifyStatus = false;
						      	this.customerAddNewplan = false;
						      	this.customerAssign = false;
						      	this.customerCompletingVisit = false;
						      	this.customerCompletingVisit = false
					      	}
				      	}
				      	else{
				      		this.isXSB = true
					      	this.isKFB = false
					      	this.customerModifyStatus = true;
						    this.customerAddNewplan = true;
						    this.customerAssign = true;
						    this.customerCompletingVisit = true;
						    this.customerCompletingVisit = true
				      	}
			        }
		        }
		      	this.initCurrentTaskList(this.tablePagination);
		    },



		    confirmRemark(index, row , number){  //备注按钮
		    	this.numberIndex = index;
		    	this.dialogRemarkVisible = true;
                this.isRemark = true,
                this.isNewPlan = false,
                this.ischangeStatus = false,
                this.isDistribution = false,
                this.number = number;
                this.remarkTitle = '备注',
		    	this.confirmInvalids.customerName = this.CurrentTaskList[index].customerName;
		    	this.confirmInvalids.mobile = this.CurrentTaskList[index].mobile;
		    	this.confirmInvalids.hsCustomerIds = this.CurrentTaskList[index].id;
		    	this.remarks.status = this.CurrentTaskList[index].status
		    },
		    cancelRemarkHandle(formName){  //取消备注
		    	 this.$refs['remarks'].resetFields();
		    	this.dialogRemarkVisible = false
		    },
		    remarkHandle(formName){  //确定备注
		    	this.$refs[formName].validate((valid) => {
		          if (valid) {
		           	  let url='';
				    	let data = '';
				    	 if(this.number == 0){
				    	 	let self = this;
		                	data = {
		                		'hsCustomerId':self.confirmInvalids.hsCustomerIds,
		                		'remark':self.remarks.remark,
		                	}


						    	self.$axios({
					                url: "/customer/saveHsCustomerOperationRemark?hsCustomerId="+self.confirmInvalids.hsCustomerIds+'&remark='+self.remarks.remark+'&status='+self.remarks.status,
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
						                  	self.initCurrentTaskList(self.tablePagination);
						  					self.$refs['remarks'].resetFields();
						  					self.dialogRemarkVisible = false;

					                  }else {
					                      this.$message.error(res.data.msg);
					                      self.dialogRemarkVisible = false;
					                  }
					                }
					            )

		                }
		                else if(this.number == 1){
		                	url = '/customer/saveHsCustomerOperationPlan';
		                	data = {
		                		'hsCustomerId':this.confirmInvalids.hsCustomerIds,
		                		'remark':this.remarks.remark,
		                		'status':this.remarks.status,
		                		'planDate':this.remarks.planDate,
		                	}
		                	this.$axios.post(url,data).then((res)=>{
				  				if(res.data.res == '0'){
				  					this.initCurrentTaskList(this.tablePagination);
				  					this.$refs['remarks'].resetFields();
				  					this.dialogRemarkVisible = false;
				  				}
				  				else{
				  					this.$message.error(res.data.msg);
				  					self.dialogRemarkVisible = false;
				  				}
					        });
		                }
		                 else if(this.number == 3){
		                	url = '/customer/completeCustomerVisits';
		                	data = {
		                		'hsCustomerId':this.confirmInvalids.hsCustomerIds,
		                		'remark':this.remarks.remark,
		                	}
		                	this.$axios.post(url,data).then((res)=>{
				  				if(res.data.res == '0'){
				  					this.initCurrentTaskList(this.tablePagination);
				  					this.$refs['remarks'].resetFields();
				  					this.dialogRemarkVisible = false;
				  					if(this.number ==3){
				  						this.CurrentTaskList[this.numberIndex].visiting = false
				  					}
				  				}
				  				else{
				  					this.$message.error(res.data.msg);
				  					self.dialogRemarkVisible = false;
				  				}
					        });
		                }
		                else{
		                	url = '/customer/assignHsCustomer';
		                	data = {
		                		'hsCustomerIds':this.confirmInvalids.hsCustomerIds,
		                		'assignOwner':this.remarks.assginSale,
		                		'type':0,
		                	}
		                	this.$axios.post(url,data).then((res)=>{
				  				if(res.data.res == '0'){
				  					this.initCurrentTaskList(this.tablePagination);
				  					this.$refs['remarks'].resetFields();
				  					this.dialogRemarkVisible = false;

				  				}
				  				else{
				  					this.$message.error(res.data.msg);
				  					self.dialogRemarkVisible = false;
				  				}
					        });
		                }
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });



		    },

		    confirmNewPlan(index, row , number){  //新计划按钮
		    	this.dialogRemarkVisible = true;
		    	this.isNewPlan = true;
		    	this.isRemark = true;
                this.ischangeStatus = false;
                this.isDistribution = false;
                this.number = number;
                this.remarkTitle = '新计划',
                this.confirmInvalids.customerName = this.CurrentTaskList[index].customerName;
		    	this.confirmInvalids.mobile = this.CurrentTaskList[index].mobile;
		    	this.confirmInvalids.hsCustomerIds = this.CurrentTaskList[index].id;
		    	this.remarks.status = this.CurrentTaskList[index].status

		    },

		    confirmInvalid(index, row){  //确认无效按钮
		    	this.confirmInvalids.customerName = this.CurrentTaskList[index].customerName;
		    	this.confirmInvalids.mobile = this.CurrentTaskList[index].mobile;
		    	this.confirmInvalids.hsCustomerIds = this.CurrentTaskList[index].id;

		    	if(this.CurrentTaskList[index].type != 0){
		    		this.$confirm('确认无效后将无法撤销，请谨慎操作?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 'hsCustomerIds':this.confirmInvalids.hsCustomerIds,
			            		 'confirmStatus':10,

			            	}
			            	 this.$axios.post('/customer/confirmInvalidOrValid',data).then((res)=>{
								this.initCurrentTaskList(this.tablePagination);
				             })

				        this.$message({
				            type: 'success',
				            message: '已成功确认无效!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消操作'
				          });
				        });
		    	}
		    	else{
		    		this.dialogInvalidVisible = true;
		    	}
		    },
		    cancelConfirmInvalidHandle(){  //取消确认无效
		    	this.$refs['confirmInvalids'].resetFields();
		    	this.dialogInvalidVisible = false
		    },
		    confirmInvalidHandle(){  //确定无效
		    	if(this.weddingTypes == undefined){
		    		this.weddingTypes = ''
		    	}
		    	let data = {
			    	'hsCustomerIds':this.confirmInvalids.hsCustomerIds,
			    	'confirmStatus':10,
			    	'hlrType':this.weddingTypes
			    }

		    	this.$axios.post('/customer/confirmInvalidOrValid',data).then((res)=>{
	  				if(res.data.res == 0){
	  					this.initCurrentTaskList(this.tablePagination);
	  					this.$refs['confirmInvalids'].resetFields();
	  					this.dialogInvalidVisible = false
	  				}
		        });
		    },
		    selectRadioDataAll(){  //单选
		    },

		    distributionBtn(index, row , number){  //分配按钮
		    	this.dialogRemarkVisible = true;
		    	this.isDistribution = true;
		    	this.ischangeStatus = false;
                this.isNewPlan = false;
		    	this.isRemark = false;
		    	this.number = number;
		    	this.remarkTitle = '分配',
		    	this.confirmInvalids.customerName = this.CurrentTaskList[index].customerName;
		    	this.confirmInvalids.mobile = this.CurrentTaskList[index].mobile;
		    	this.confirmInvalids.hsCustomerIds = this.CurrentTaskList[index].id;
		    	this.remarks.status = this.CurrentTaskList[index].status
		    },


		    confirmVisible(index,row){  //确定转有效按钮
		    	this.dialogVisible = true;
		    	this.confirmInvalids.customerName = this.CurrentTaskList[index].customerName;
		    	this.confirmInvalids.mobile = this.CurrentTaskList[index].mobile;
		    	this.confirmInvalids.hsCustomerIds = this.CurrentTaskList[index].id;
		    },
		    cancelConfirmVisibleHandle(){  //取消转有效
		    	this.$refs['confirmVisibles'].resetFields();
		    	this.dialogVisible = false
		    },
		    confirmVisibleHandle(){  //确定转有效
		    	let data = {
			    	'hsCustomerId':this.confirmInvalids.hsCustomerIds,
			    	'assginSale':this.confirmVisibles.salesId
			    }

		    	this.$axios.post('/customer/transferValid',data).then((res)=>{
	  				if(res.data.res == 0){
	  					this.initCurrentTaskList(this.tablePagination);
	  					this.$refs['confirmVisibles'].resetFields();
	  				}
	  				this.dialogVisible = false
		        });
		    },

		    applyForReturnVisit(index,row){
		    	this.$confirm('是否确定申请回访?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 'hsCustomerId':this.CurrentTaskList[index].id,
			            	}
			            	 this.$axios.post('/customer/salesApplyCustomerVisits',data).then((res)=>{
								this.initCurrentTaskList(this.tablePagination);
								this.visiting = true
				             })

				        this.$message({
				            type: 'success',
				            message: '已成功申请回访!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消操作'
				          });
				        });
		    },

		    followUpDetails(index, row, number){  //跟进详情按钮
		    	this.numberData = index;
		    	this.number1 = number;
		    	this.isEdit = false;
		    	if(row.planDate != null && row.planDate !=''){
		    		this.NewPlanTime = moment(row.planDate).format('YYYY-MM-DD');
		    	}
            	this.NewPlanRemark = row.remark;
            	this.isimportant = row.isImportant==1?false:true;
				this.changeStatus.status=this.CurrentTaskList[index].status;
				this.isCirformTurnNouValidate = false;
		    	if(row.status == 4 || row.status == 0 || row.status == 8){

		    			this.panduanStatus1 = true;
				    	this.panduanStatus4 = false;
				    	this.panduanStatus5 = false;
				    	this.panduanStatus3 = true;
				    	if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
				    		this.panduanStatus2 = false;
				    	}
				    	else{
				    		this.panduanStatus2 = true;
				    	}

				    	if(row.status == 0 && (row.type == '') || row.type == null && JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey != 'DEPT:SALES'){
		    				this.panduanStatus6 = true

		    			}
		    			else{
		    				this.panduanStatus6 = false
		    			}
		    	}
		    	else if(row.status == 12){
		    		this.panduanStatus1 = true;
			    	this.panduanStatus2 = false;
			    	this.panduanStatus3 = true;
			    	this.panduanStatus4 = false;
			    	this.panduanStatus5 = false;
		    	}
		    	else if(row.status == 11 || row.status == 18 || row.status == -1){
		    		this.panduanStatus1 = true;
			    	this.panduanStatus2 = false;
			    	this.panduanStatus3 = true;
			    	this.panduanStatus4 = false;
			    	this.panduanStatus5 = false;
			    	if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
						this.panduanStatus2 = false;
					}
		    	}
		    	else if(row.status == 1 || row.status == 6 || row.status == 7 || row.status == 9 || row.status == 10 || row.status == 15  || row.status == 16){
					this.isCirformTurnNouValidate = true
		    		this.panduanStatus1 = false;
			    	this.panduanStatus2 = false;
			    	this.panduanStatus3 = false;
			    	this.panduanStatus4 = true;
			    	this.panduanStatus5 = false;
			    	this.panduanStatus6 = false;

		    	}
		    	if(this.isKFB && row.returnType == 4){
		    		this.panduanStatus1 = false;
			    	this.panduanStatus2 = false;
			    	this.panduanStatus3 = false;
			    	this.panduanStatus4 = false;
			    	this.panduanStatus5 = false;
			    	this.panduanStatus6 = false;
		    	}
		    	this.statuss = []
		    	this.dicData.HS_DATA_TYPE.forEach((m)=>{
	                if(m.dicStatus==0){
	                    this.statuss.push(m)
	                }
	           })
		    	if(row.customerName == null){
		    		this.changeStatus.customerName = '';
		    	}
		    	else{
		    		this.changeStatus.customerName = row.customerName;
		    	}
		    	if(row.mobile == null ){
		    		this.changeStatus.mobile = '';
		    	}
		    	else{
		    		this.changeStatus.mobile = row.mobile;
		    	}
		    	if(row.budget == null){
		    		this.changeStatus.budget = '';
		    	}
		    	else{
		    		this.changeStatus.budget = row.budget;
		    	}
		    	if(row.tableNumber == null){
		    		this.changeStatus.tableNumber = '';
		    	}
		    	else{
		    		this.changeStatus.tableNumber = row.tableNumber;
		    	}
		    	if(row.bookingTime == null){
		    		this.changeStatus.bookingTime = '';
		    	}
		    	else{
		    		this.changeStatus.bookingTime = row.bookingTime;
		    	}
		    	if(row.remark == null){
		    		this.changeStatus.DataRemark = '';
		    	}
		    	else{
		    		this.changeStatus.DataRemark = row.remark;
		    	}
		    	this.changeStatus.id = row.id;
		    	this.citys.forEach((n)=>{
			        if( n.cityCode==row.cityCode){
			            this.changeStatus.cityName = n.cityName
			        }

			    })
		    	if(number == 1){
		    		this.tableDialogTitle = '客户数据改状态';
		    		this.isMobile = 1;

		    		if(row.status == 0 ){
		    			if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
				    		this.panduanStatus3 = true
				    	}
				    	else{
				    		this.panduanStatus3 = false
				    	}

		    		}
		    	}
		    	else{
		    		this.tableDialogTitle = '跟进详情';
		    		this.isMobile = 0
		    	}
		    	this.$axios.post('/customer/getHsCustomerStatus',{status:row.status}).then((res1)=>{    //获取客户下一操作状态集合
	  				if(res1.data.res == '0'){
	  					this.storeStatuValues = [];
	  					if(res1.data.msg !=null){
	  						res1.data.msg.forEach((e)=>{
		  						this.dicData.HS_CUSTOMER_STATUS.forEach((n)=>{
				                    if( n.dicValue==e){
				                        this.storeStatuValues.push(n)
				                    }
				               })
				           })
	  					}
	  					else{

	  					}

	  				}
		        });

		    	this.gitAllOperations();
		    	this.dialogTableVisible = true
		    },
		    changeselectRadiovalide(val){
		    	if(val == 0){
		    		this.panduanStatus2 = true
		    		if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
						this.panduanStatus2 = false;
					}
		    	}
		    	else{
		    		this.panduanStatus2 = false
		    		this.changeStatus.salesId = ''
		    	}
		    },

		    changesatusHandle(val){
		    	if(val === 0 || val == 4 || val == 8){
		    		this.panduanStatus2 = true
			    	this.panduanStatus3 = true;

			    	if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
			    		this.panduanStatus3 = true;
			    		this.panduanStatus2 = false;
			    		this.panduanStatus6 = false
			    	}
			    	else{
			    		this.panduanStatus3 = false
			    		this.panduanStatus2 = true;
			    		if(this.changeStatus.status == 0 && this.CurrentTaskList[this.numberData].type == null){
				    		this.panduanStatus6 = true
				    	}
				    	else{
				    		this.panduanStatus6 = false
				    	}
			    	}
			    }
			    else{
			    	this.panduanStatus2 = false;
				    this.panduanStatus6 = false;
			    	if(val == -1 || val == 11 || val == 18){
			    		this.panduanStatus3 = true
			    	}
			    	else{
				    	this.panduanStatus3 = false
			    	}
			    }
		    },
		    changeSalesIdHandle(val){

		    },

		    gitAllOperations(){  //获取用户所有操作
		    	let self = this;
		    	let newdata = {
		    		'pageNow':self.followPagination.pageNow,
		    		'pageSize':self.followPagination.pageSize,
		    		'hsCustomerId':self.CurrentTaskList[self.numberData].id
		    	}
		    	self.$axios({
	                url: "/customer/getHsCustomerOperationList?pageNow="+self.followPagination.pageNow+'&pageSize='+self.followPagination.pageSize+'&hsCustomerId='+self.CurrentTaskList[self.numberData].id,
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
	                  		self.followPagination.total=res.data.msg.total;
	                     	self.followPagination.pageNum=res.data.msg.pageNum;
	                     	self.followPagination.pageSize=res.data.msg.pageSize;
	                  	    console.log(res)
							self.followDetailsTable = res.data.msg.list;
							var audio = document.getElementsByTagName('audio')
			                for(var i=0;i<audio.length;i++){
			                    audio[i].load()
			                }
							self.followDetailsTable.forEach((n)=>{
				                if(n.remark == 'undefined'){
				                    n.remark = ''
				                }
				                if(n.source == 4 && n.commonFileList.length){
			                    	self.$set(n, 'audioAdress', n.commonFileList[0].address)
			                    }
			                    else{
			                    	self.$set(n, 'audioAdress', '')
			                    }
				           })
	                  }else {
	                      this.$message.error(res.data.msg);
	                  }
	                }
	            )
		    },

		    editVipHandle(number){
		    	if(number == 1){
		    		this.$confirm('确定标记为vip?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				      }).then(() => {
				        	let data={
			            		 'hsCustomerId':this.CurrentTaskList[this.numberData].id,
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
			            		 'hsCustomerId':this.CurrentTaskList[this.numberData].id,
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
		    editHandle(){
		    	if(this.isEdit != false){
		    		console.log(this.changeStatus.tableNumber)
		    		console.log(this.changeStatus.budget)
		    		console.log(this.changeStatus.bookingTime)
		    		let data = {
		    			'id':this.changeStatus.id,
		    			'customerName':this.changeStatus.customerName,
		    			'mobile':this.changeStatus.mobile,
		    			'tableNumber':this.changeStatus.tableNumber,
		    			'budget':this.changeStatus.budget,
		    			'bookingTime':this.changeStatus.bookingTime,
		    		}
		    		console.log(data)
		    		this.$axios.post('/customer/updateHsCustomer',data).then((res)=>{
		  				if(res.data.res == 0){
		  					this.initCurrentTaskList(this.tablePagination);
		  				}
			        });
		    	}
		    	this.isEdit = !this.isEdit
		    },
		    changeselectRadioDataAll(){

		    },
		    advanceFinishHandle(){  //提前完成按钮
		    	this.$confirm('确定要提前完成该计划任务?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	let data={
			            		 'hsCustomerId':this.CurrentTaskList[this.numberData].id,
			            	}
			            	 this.$axios.post('/customer/advanceCompleteNewPlan ',data).then((res)=>{
								this.initCurrentTaskList(this.tablePagination)
						  		this.changeStatus.remark = ''
						  		this.cancelChangeVisibleHandle()
				             })

				        this.$message({
				            type: 'success',
				            message: '已成功实现提前完成计划任务操作!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消提起那完成计划任务操作'
				          });
				        });
		    },
		    editSubmitHandle(){  //提交处理客户
		    	if((this.changeStatus.remark == undefined || this.changeStatus.remark == '' ) && this.number1 == 1){
		    		this.$message.error('请填写备注')
                    return false;
		    	}
		    	else{
		    		if(this.isCirformTurnNouValidate){
						if(this.statusType == 10){
							this.$confirm('确认无效后将无法撤销，请谨慎操作?', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
					          type: 'warning'
					       }).then(() => {
					        	let data={
				            		 'hsCustomerIds':this.CurrentTaskList[this.numberData].id,
				            		 'confirmStatus':10,
				            	}
				            	 this.$axios.post('/customer/confirmInvalidOrValid',data).then((res)=>{
				            	 	if(res.data.res == 0){
				            	 		this.initCurrentTaskList(this.tablePagination);
										this.$refs['changeStatus'].resetFields();

								  		this.dialogTableVisible = false
				            	 	}
					             })

					        this.$message({
					            type: 'success',
					            message: '已成功确认无效!'
					          });
					        }).catch(() => {
					          this.$message({
					            type: 'info',
					            message: '已取消操作'
					          });
					        });
						}
						else{
							let data = {
						    	'hsCustomerId':this.CurrentTaskList[this.numberData].id,
						    	'assginSale':this.changeStatus.salesId
						    }

					    	this.$axios.post('/customer/transferValid',data).then((res)=>{
				  				if(res.data.res == 0){
				  					this.initCurrentTaskList(this.tablePagination);
				  					this.$refs['changeStatus'].resetFields();

							  		this.dialogTableVisible = false
				  				}
				  				this.dialogVisible = false
					        });
						}
					}
					else{
						if(this.changeStatus.type == '' && this.changeStatus.type !='0' && this.changeStatus.status == 0 && this.CurrentTaskList[this.numberData].type ==null && this.panduanStatus6){
			    			this.$message.error('请选择类型')
	                    	return false;
			    		}
			    		else{
			    			if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES' && this.changeStatus.planDate == '' && (this.changeStatus.status == 0 || this.changeStatus.status == 4 || this.changeStatus.status == 8)){
					    		this.$message.error('请选择新计划日期')
					    		return false;
					    	}else{
					    			let data = {
							    		'hsCustomerId':this.changeStatus.id,
							    		'status':this.changeStatus.status,
							    		'planDate':this.changeStatus.planDate,
							    		'remark':this.changeStatus.remark,
							    		'assginSale':this.changeStatus.salesId,
							    		'type':this.changeStatus.type,
							    	}
							    	this.$axios.post('/customer/processHsCustomer',data).then((res)=>{
							  				if(res.data.res == 0){
							  					this.initCurrentTaskList(this.tablePagination)
							  					this.$refs['changeStatus'].resetFields();

							  					this.dialogTableVisible = false
							  					this.$message({
											        message: '操作成功',
											        type: 'success'
											    });
							  				}
							  				else{
							  					this.$message.error(res.data.msg)
					                     		return false;
							  				}
								       });
					    		}



			    		}
					}




		    	}

		    },
		    cancelChangeVisibleHandle(){
		    	this.$refs['changeStatus'].resetFields();

		  		this.dialogTableVisible = false
		    },
		    followHandleSizeChange(val){
		    	this.followPagination.pageSize=val;
		    	this.gitAllOperations()
		    },
		    followHandleCurrentChange(val){
		    	this.followPagination.pageNow=val;
		    	this.gitAllOperations()
		    },
			formTimeCreate(time){
				if(time != null){
					return formatTime(time)
            	}
            	else{
            		return
            	}
			},
		    formTime(row){
		    	if(row.lastOperatingDate != null){
					return formatTime(row.lastOperatingDate)
            	}
            	else{
            		return
            	}

              },
            formTime1(row){

                 if(row.createTime != null){
					return formatTime(row.createTime)
            	}
            	else{
            		return
            	}
              },
              formTimeAssign(row){
              	 if(row.assignDate != null){
					return formatTime(row.assignDate)
            	}
            	else{
            		return
            	}
              },
			formPlanDate(row){
				if(row.planDate != null){
					return moment(row.planDate).format('YYYY-MM-DD')
            	}
            	else{
            		return
            	}
			},

              startDateChange(val){
		      	this.remarks.planDate = val
		      },
		      planDateChange(val){
		      	this.changeStatus.planDate = val
		      },

               onSubmit() {   //搜索
                   this.formInline.assignStartDate?this.formInline.assignStartDate=moment(this.formInline.assignStartDate).format('YYYY-MM-DD'):''
                   this.formInline.assignEndDate?this.formInline.assignEndDate=moment(this.formInline.assignEndDate).format('YYYY-MM-DD'):''
	               this.initCurrentTaskList(this.tablePagination)
		      },

		      resetForm(formName) {  //重置
		          this.$refs[formName].resetFields();
		      }
        },
        mounted(){
        	this.getOpenCity()
            this.getQiNiuUrlUsingGET()
            this.cityNames.city = JSON.parse(localStorage.getItem("userInfo")).positionCitys[0].cityCode
            this.initCurrentTaskList(this.tablePagination)
            console.log(JSON.parse(localStorage.getItem("userInfo")))
            if(jQuery.isEmptyObject(JSON.parse(localStorage.getItem("userInfo")).deptDetail)){
            	this.isAdmin = true
            }
            else{
            	this.isAdmin = false
            }
			if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:SALES'){
				this.editableTabs =  [{
                    title: '当前任务',
                    name: '1',
                    content: 'Tab 1 content'
                },{
                    title: '计划任务',
                    name: '3',
                    content: 'Tab 3 content'
                }]
			}
        },
        computed:{
            tablePagination(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize,"mobile":this.formInline.mobile,
"status":this.formInline.status, "lastOperatingType":this.formInline.lastOperatingType, "channelId":this.formInline.channelId, "salesId":this.formInline.salesId,"cityCode":this.cityNames.city,"assignStartDate":this.formInline.assignStartDate,"assignEndDate":this.formInline.assignEndDate}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        }

    }
</script>
