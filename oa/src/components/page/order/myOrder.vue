<template>
    <div>
        <div class="crumbs">
        	<div style='float:right'>
            	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm">
            		<el-form-item label="城市:" prop='city'>
						<el-select v-model='cityNames.city' @change='changeCity' placeholder="请选择">
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
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的订单(策划师)</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
       <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline grayForm">
       	<el-form-item label="合同日期" prop='dateTimeStart'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.dateTimeStart"
			      type="date" @change="startDateChange"
			      :picker-options="pickerOptions0" size="small" clearable>
			    </el-date-picker>
			  </div>
		  </el-form-item>
		  <el-form-item label="到" prop='dateTimeStop'>
		     <div class="block">
			    <el-date-picker
			      v-model="formInline.dateTimeStop"
			      type="date" @change="endDateChange"
			      :picker-options="pickerOptions0" size="small" clearable>
			    </el-date-picker>
			  </div>
		  </el-form-item>
          <el-form-item prop='customerMobile'>
                <el-input v-model="formInline.customerMobile" placeholder="客户电话" auto-complete="off" size="small"></el-input>
          </el-form-item>
          <el-form-item prop='name'>
                <el-input v-model="formInline.name" placeholder="新郎或新娘" auto-complete="off" size="small"></el-input>
          </el-form-item>
           <el-form-item prop='mobile'>
                <el-input v-model="formInline.mobile" placeholder="新浪或新娘电话" auto-complete="off" size="small"></el-input>
          </el-form-item>
			<el-form-item  prop='orderType'>
	            <el-select clearable v-model="formInline.orderType" placeholder="类型" size="small">
	                <el-option
	                    v-for="type in dec.data_type"
	                    :key="type.dicDesc"
	                    :label="type.dicDesc"
	                    :value="type.dicValue">
	                </el-option>
	             </el-select>
	       </el-form-item>
            <el-form-item prop="salesId">
                <el-select  size="small" v-model="formInline.salesId" placeholder="销售">
                    <el-option
                        v-for="item in salesIds"
                        :key="item.id"
                        :label="item.nickName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item  prop="hallId">
                <el-select clearable v-model="formInline.hallId" placeholder="宴会厅" size="small">
                    <el-option v-for="hall in hallList"
                               :key="hall.id"
                               :label="hall.hallName"
                               :value="hall.id"
                    ></el-option>
                </el-select>
            </el-form-item>
          <el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		  </el-form-item>
		    <el-form-item>
			   <el-button type="primary" @click="resetForm('formInline')">重置</el-button>
			</el-form-item>
		</el-form>


	            <el-table :data="commissionContractMgrDataList" border style="width: 100%" v-loading="loading.pageList" element-loading-text="拼命加载中">
	                <el-table-column prop="customerName" label="客户名称"></el-table-column>
	                <el-table-column prop="mobile" label="客户电话"></el-table-column>
	                <el-table-column prop="orderType" label="类型">
	                	<template scope="scope">
			                <div>{{statusText(scope.row.orderType,'data_type')}}</div>
			            </template>
	                </el-table-column>
	                <el-table-column prop="groomName" label="新郎"></el-table-column>
	                <el-table-column prop="groomMobile" label="新郎电话"></el-table-column>
	                <el-table-column prop="brideName" label="新娘"></el-table-column>
	                <el-table-column prop="brideMobile" label="新娘电话"></el-table-column>
	                <el-table-column prop="scheduleTime" label="档期"></el-table-column>
	                <el-table-column prop="hallName" label="宴会厅"></el-table-column>
	                <el-table-column prop="hsAgrPackageName" label="套系名" width="150px"></el-table-column>
	                <el-table-column label="打印" v-if='btnP.myOrderPrint'>
	                	<template scope="scope">
		                    <el-button size="mini" type="primary" @click="printRow(scope.row)">打印</el-button>
		                </template>
	                </el-table-column>
	                <el-table-column label="合同详情">
	                	<template scope="scope">
		                    <el-button size="mini" type="primary" @click="checkDetailsRow(scope.row)">合同详情</el-button>
		                </template>
	                </el-table-column>
	                <el-table-column label="最终商谈">
	                	<template scope="scope">
		                    <el-button v-if='btnP.myOrderChangeEO' size="mini" type="primary" @click='openEODataHandle(scope.row)'>EO单</el-button>
		                    <el-button v-if='btnP.myOrderShowFinal' size="mini" type="primary"@click='openfinalQuotationHandle(scope.row)'>最终报价单</el-button>
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

        <el-dialog title="EO单" size='large' :visible.sync="EOVasible" :before-close='cancelEOHandle'>
			<el-form :model="EOData" ref='EOData'  class='EODiv'>
			    <div>
	                <el-form-item class='inline-form' prop='orderNo' label="客户：" :label-width="hetongDetailsWidth">
	                    <span class='hiddenspan'>{{EOData.customerName}}</span>
	                </el-form-item>
	                <el-form-item class='inline-form' prop='type' label="客户手机：" :label-width="hetongDetailsWidth">
	                    <span class='hiddenspan'>{{EOData.mobile}}</span>
	                </el-form-item>
	                <el-form-item class='inline-form' prop='type' label="订单类型：" :label-width="hetongDetailsWidth">
	                    <span class='hiddenspan'>{{statusText(EOData.orderType,'data_type')}}</span>
	                </el-form-item>
	            </div>
	             <div>
	                <el-form-item class='inline-form' prop='orderNo' label="新郎：" :label-width="hetongDetailsWidth">
	                    <span class='hiddenspan'>{{EOData.groomName}}</span>
	                </el-form-item>
	                <el-form-item class='inline-form' prop='type' label="新郎电话：" :label-width="hetongDetailsWidth">
	                    <span class='hiddenspan'>{{EOData.groomMobile}}</span>
	                </el-form-item>
	                <el-form-item class='inline-form' prop='type' label="新娘：" :label-width="hetongDetailsWidth">
	                    <span class='hiddenspan'>{{EOData.brideName}}</span>
	                </el-form-item>
	                <el-form-item class='inline-form' prop='type' label="新娘电话：" :label-width="hetongDetailsWidth">
	                    <span class='hiddenspan'>{{EOData.brideMobile}}</span>
	                </el-form-item>
	            </div>
			</el-form>
			<div  class='EODiv'>
				<p class='centerTitle'>{{statusText(weddingContentData[0].species,'agreementEO_species')}}</p>
				<el-table :data="weddingContentData" border style="width: 100%">
	                <el-table-column prop="typeName" label="类别"></el-table-column>
	                <el-table-column prop="content" label="内容"></el-table-column>
	                <el-table-column label="操作" v-if='btnP.myOrderEditEO'>
	                	<template scope="scope">
		                    <el-button size="mini" v-show='scope.$index != 2' type="primary" @click='editEOTableDataHandle(scope.$index,scope.row,1)'>编辑</el-button>
		                    <el-button size="mini" v-show='scope.$index == 2' type="primary" @click='editEOTableDataMenuHandle(scope.row)'>编辑</el-button>
		                </template>
	                </el-table-column>
	                <el-table-column prop="remark" label="备注"></el-table-column>
	            </el-table>
			</div>

			<div  class='EODiv'>
				<p class='centerTitle'>{{statusText(drinkAndSnackData[0].species,'agreementEO_species')}}</p>
				<el-table :data="drinkAndSnackData" border style="width: 100%">
	                <el-table-column prop="typeName" label="类别"></el-table-column>
	                <el-table-column prop="content" label="内容"></el-table-column>
	                <el-table-column label="操作" v-if='btnP.myOrderEditEO'>
	                	<template scope="scope">
		                    <el-button size="mini" type="primary" @click='editEOTableDataHandle(scope.$index,scope.row,0)'>编辑</el-button>
		                </template>
	                </el-table-column>
	                <el-table-column prop="remark" label="备注"></el-table-column>
	            </el-table>
			</div>

			<div  class='EODiv'>
				<p class='centerTitle'>{{statusText(banquetArrangeData[0].species,'agreementEO_species')}}</p>
				<el-table :data="banquetArrangeData" border style="width: 100%">
	                <el-table-column prop="typeName" label="类别"></el-table-column>
	                <el-table-column prop="content" label="内容"></el-table-column>
	                <el-table-column label="操作" v-if='btnP.myOrderEditEO'>
	                	<template scope="scope">
		                    <el-button size="mini" type="primary" @click='editEOTableDataHandle(scope.$index,scope.row,0)'>编辑</el-button>
		                </template>
	                </el-table-column>
	                <el-table-column prop="remark" label="备注"></el-table-column>
	            </el-table>
			</div>
			<div  class='EODiv'>
				<p class='centerTitle'>优惠</p>
				<p v-if='btnP.myOrderEditEO' style='text-align: right;margin-bottom:5px'><el-button @click='applyDiscountHandle' size="mini" type="primary">申请优惠</el-button></p>
				<el-table :data="discountData" border style="width: 100%">
	                <el-table-column prop="amount" label="金额"></el-table-column>
	                <el-table-column prop="remark" label="备注"></el-table-column>
	                <el-table-column prop="reviewStatus" label="审核状态">
	                	<template scope="scope">
			                {{statusText(scope.row.reviewStatus,'review_status')}}
			            </template>
	                </el-table-column>
	                <el-table-column label="操作" v-if='btnP.myOrderEditEO'>
	                	<template scope="scope">
		                    <el-button
								    type="primary"
								    size="small"
								    v-show='scope.row.reviewStatus ==0'
								    @click.native.prevent="deleteDiscountRow(scope.$index, scope.row)">
								          删除
								</el-button>
		                </template>
	                </el-table-column>
	            </el-table>
			</div>

			<div  class='EODiv'>
				<p class='centerTitle'>其他</p>
				<el-button v-if='btnP.myOrderEditEO' style='float:right' size="mini" type="primary" @click='editEOTableDataHandle(10,10,2)'>添加</el-button>
				<el-table :data="anotherThingData" border style="width: 100%">
	                <el-table-column prop="typeName" label="类别"></el-table-column>
	                <el-table-column prop="content" label="内容"></el-table-column>
	                <el-table-column label="操作" v-if='btnP.myOrderEditEO'>
	                	<template scope="scope">
		                    <el-button size="mini" type="primary" @click='editEOTableDataHandle(scope.$index,scope.row,0)'>编辑</el-button>
		                </template>
	                </el-table-column>
	                <el-table-column prop="remark" label="备注"></el-table-column>
	            </el-table>
			</div>

		</el-dialog>

		<el-dialog title="申请优惠" :visible.sync="dialogApplyDiscountFormVisible" :before-close='cancelApplyDiscountHandle'>
			<el-form :model="applyDiscounts" ref='applyDiscounts' :rules='applyDiscountRules'>
				<el-form-item prop='amount' label='优惠金额'>
					<el-input style='width:100px' v-model="applyDiscounts.amount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item prop='remark' label='优惠备注'>
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style='width:70%' v-model="applyDiscounts.remark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelApplyDiscountHandle">取 消</el-button>
				<el-button type="primary" @click="confirmApplyDiscountHandle('applyDiscounts')">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="EO单" :visible.sync="EditEOVasible" :before-close='cancelEditEOHandle'>
			<p style='height:40px;line-height:40px;font-size:18px;' v-show='addAnther'>编辑{{EODialogTitle}}</p>
			<p style='height:40px;line-height:40px;font-size:18px;' v-show='!addAnther'>添加其他</p>
			<el-form :model="EditEODataList" ref='EditEODataList'>
	            <el-form-item v-if='editEoTanmeNumber' prop='tableNumber'>
	                <el-input style='width:100px' :min='0' type='number' placeholder='0' v-model="EditEODataList.tableNumber" auto-complete="off"></el-input>
	            </el-form-item>
	            <el-form-item v-if='arrayNameIndex == 2' prop='typeName'>
	                <el-input style='width:200px' placeholder='输入类别' v-model="EditEODataList.typeName" auto-complete="off"></el-input>
	            </el-form-item>
	             <el-form-item v-if='!editEoTanmeNumber' prop='content'>
	                <el-input style='width:400px' type="textarea" v-model="EditEODataList.content" auto-complete="off"></el-input>
	            </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click='confirmEOHandle("EditEODataList")'>确定</el-button>
			    <el-button type="primary" icon='document' @click='cancelEditEOHandle'>取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="菜单" :visible.sync="dialogEOMenuTableVisible" size='large'>
			<el-table style='width: 100%' :data="EOMenuList" border>
                <el-table-column property="name" label="商品名称"></el-table-column>
                <el-table-column property="packageName" label="所属套系" ></el-table-column>
                <el-table-column property="adjustName" label="调整后菜名"></el-table-column>
                <el-table-column property="adjustPackageName" label="所属套系"></el-table-column>
                <el-table-column prop="operation" label="操作">
					<template scope="scope">
						<div class="btnDiv">
							<p>
								<el-button
								    type="primary"
								    size="small"
								    @click="adjustEOmentHandle(scope.$index, scope.row)">
								          调整
								</el-button>
								<el-button
								    type="primary"
								    size="small"
								    v-show="scope.row.adjustName != '' && scope.row.adjustPackageName == ''"
								    @click="reductionEOHandle(scope.$index, scope.row)">
								          还原
								</el-button>
								<el-button
								    type="primary"
								    size="small"
								    v-show='scope.row.isTrue'
								    @click.native.prevent="deleteRow4(scope.$index, scope.row)">
								          删除
								</el-button>
							</p>
						</div>
					</template>
				</el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addEOHsPackageMenuList">添加菜品</el-button>
			</div>
		</el-dialog>
		<el-dialog title="添加菜品" :visible.sync="dialogAddmentEOFormVisible" size='large' :before-close='cancelAddmentEOHandle'>
			<el-form class='newContractBox' :model='addmentEOLists' ref='addmentEOLists'>
                <el-form-item class='inline-form' prop='hsPackageId'>
                    <el-select clearable v-model="addmentEOLists.hsPackageId" @change='ChangeAddmentEOSetHandle' placeholder="选择套系">
                        <el-option
                            v-for="item in newCreateContractsets"
                            :key="item.id"
                            :label="item.packageName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop='varietyOfDishe'>
                    <el-select clearable v-model="addmentEOLists.varietyOfDishe" placeholder="选择菜品">
                        <el-option
                            v-for="item in varietyOfDishes"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item prop='unitPrice'>
                   <el-input v-model="addmentEOLists.unitPrice" placeholder='单价' auto-complete="off"></el-input>
                </el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddmentEOHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAddmenteoHandle">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="调整菜品" :visible.sync="dialogAdjustmentEOFormVisible" size='large' :before-close='cancelAdjustmentEOHandle'>
			<el-form class='newContractBox' :model='adjustmenteoLists' ref='adjustmenteoLists'>
                <el-form-item class='inline-form' prop='hsPackageId'>
                    <el-select clearable v-model="adjustmenteoLists.hsPackageId" @change='ChangeAdjustmentEOSetHandle' placeholder="选择套系">
                        <el-option
                            v-for="item in newCreateContractsets"
                            :key="item.id"
                            :label="item.packageName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop='varietyOfDishe'>
                    <el-select clearable v-model="adjustmenteoLists.varietyOfDishe" placeholder="选择菜品">
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
				<el-button @click="cancelAdjustmentEOHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAdjustmentEOHandle">确 定</el-button>
			</div>
		</el-dialog>


		<el-dialog title="最终报价单" :visible.sync="finalQuotationVisible" size='large' :before-close='cancelfinalQuotationHandle'>
			<p style='color:red'>编辑最终报价单</br>请在尾款约定的最晚付款时间前提交"最终报价单"。单据提交前可以保存，保存期间都可修改提交后不能修改</p>
			<p style='text-align:right' v-if='btnP.myOrderAddFinalForm'><el-button type="primary" @click="addfinalQuotationHandle">添加</el-button></p>
			<el-table style='width: 100%' :data="finalQuotationList" border>
                <el-table-column property="typeText" label="类别">
                	<template scope="scope">
                		<span>{{statusText(scope.row.type,'final_quotation_type')}}</span>
                	</template>
                </el-table-column>
                <el-table-column property="quantity" label="数量" ></el-table-column>
                <el-table-column property="remark" label="内容"></el-table-column>
                <el-table-column property="unitPrice" label="单价"></el-table-column>
                <el-table-column property="amount" label="金额"></el-table-column>
                <el-table-column prop="operation" label="操作">
					<template scope="scope">
						<div class="btnDiv">
								<el-button
								    type="primary"
								    size="small"
								    v-show='scope.row.status != 1'
								    @click.native.prevent="deleteRow5(scope.$index, scope.row)">
								          删除
								</el-button>
						</div>
					</template>
				</el-table-column>
            </el-table>

			<div slot="footer" class="dialog-footer">
				<el-button style='float:left' v-if='btnP.myOrderAddFinalForm' type="primary" @click="confirmfinalQuotationHandle(0)">保存并关闭</el-button>
				<el-button style='float:left' @click="cancelfinalQuotationHandle">直接关闭</el-button>
				<el-button v-if='btnP.myOrderAddFinalForm' type="primary" @click="confirmfinalQuotationHandle(1)">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="添加最终报价单" :visible.sync="addFinalQuotationVisible" :before-close='cancelAddFinalQuotationHandle'>
			<el-form class='newContractBox' :model='addFinalQuotationLists' ref='addFinalQuotationLists'>
                <el-form-item prop='quantity' label='数量'>
                     <el-input style='width:200px' v-model="addFinalQuotationLists.quantity" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop='remark' label='内容'>
                     <el-input style='width:200px' v-model="addFinalQuotationLists.remark" auto-complete="off"></el-input>
                </el-form-item>
                 <el-form-item prop='unitPrice' label='单价'>
                     <el-input style='width:200px' v-model="addFinalQuotationLists.unitPrice" auto-complete="off"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancelAddFinalQuotationHandle">取 消</el-button>
				<el-button type="primary" @click="confirmAddFinalQuotationHandle">确 定</el-button>
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
                       			 <el-form-item class='inline-form' prop='scheduleTimeType'>
                           			 <el-select clearable disabled v-model="createNewContracts.scheduleTimeType" placeholder="场次">
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
                                 <span>当前合同总金额:</span><span class='allAcount'>{{createAllAcount}}</span><span>已收金额:</span><span class='allAcount'>{{createAllReceivedAcount}}</span>
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
        <el-dialog :visible.sync="printRowVisible">
            <el-table style='width: 100%' :data="printRowTable" border>
                <el-table-column property="filesName" label="文件名">
                </el-table-column>
                <el-table-column property="operatorStatus" label="操作">
                    <template scope="scope">
                        <el-button type='text' @click="previewTemplateRow(scope.row)" >预览</el-button>
                        <el-button type='text' @click="printTemplateRow(scope.row)" >打印</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    export default {
        data() {
            return {
                printRowTable:[
                    {
                        filesName:'EQ单',
                        printName:'EOStencil'
                    },
                    {
                        filesName:'最终报价单',
                        printName:'FinalQuotationStencil'
                    }
                ],
                loading:{
                    pageList:false,
                    detail:false
                },
            	addAnther:true,
            	cityNames:{
            		city:''
            	},
            	storeCitys:[],
            	dec:{
                    data_type:[],
                    funds_receipt_type:[],
                    agreement_status:[],
                    order_status:[],
                    schedule_status:[],
                    schedule_time_type:[],
                    print_item:[],
                    payment_item:[],
                    review_type:[],
                    order_type:[],
                    agreementEO_species:[],
                    final_quotation_type:[],
                    review_status:[],
                },
                salesIds:[],
                hallList:[],
            	storeStatus:[],
            	channelIds:[],
            	custServiceIds:[],
            	formInline:{
                    dateTimeStart:'',
                    dateTimeStop:'',
                    mobile:'',
                    customerMobile:'',
                    name:'',
                    hallId:'',
                    orderType:'',
                    salesId:''
                },
                EOVasible:false,
               EOData:{
                	remark:''
                },
                clickApplyItemTypeRow:'',
                citys:[],
            	commissionContractMgrDataList:[],
            	arrayNameIndex:'',
            	arrayNameRow:'',
            	arrayNames:['weddingContentData','drinkAndSnackData','banquetArrangeData'],
            	editEoTanmeNumber:'',
            	weddingContentData:[
	            	{
	            		species:'1',
	            		type:'0',
	            		content:'',
	            		remark:'',
	            		typeName:'总桌数'
	            	},
	            	{
	            		species:'1',
	            		type:'1',
	            		content:'',
	            		remark:'',
	            		typeName:'主桌数'
	            	},
	            	{
	            		species:'1',
	            		type:'2',
	            		content:'',
	            		remark:'',
	            		typeName:'菜单'
	            	}
            	],
            	drinkAndSnackData:[
            		{
	            		species:'2',
	            		type:'3',
	            		content:'',
	            		remark:'',
	            		typeName:'蛋糕'
	            	},
	            	{
	            		species:'2',
	            		type:'4',
	            		content:'',
	            		remark:'',
	            		typeName:'正餐'
	            	},
	            	{
	            		species:'2',
	            		type:'5',
	            		content:'',
	            		remark:'',
	            		typeName:'下午茶'
	            	}
            	],
            	banquetArrangeData:[
            		{
	            		species:'3',
	            		type:'6',
	            		content:'',
	            		remark:'',
	            		typeName:'桌布'
	            	},
	            	{
	            		species:'3',
	            		type:'7',
	            		content:'',
	            		remark:'',
	            		typeName:'椅背'
	            	},
	            	{
	            		species:'3',
	            		type:'8',
	            		content:'',
	            		remark:'',
	            		typeName:'口布'
	            	}
            	],
            	discountData:[],
            	dialogApplyDiscountFormVisible:false,
            	applyDiscounts:{
            		amount :'',
            		remark:'',
            	},
            	applyDiscountRules:{
					amount:[
						{ required: true, message: '请输入优惠金额', trigger: 'blur' },
					],
					remark:[
						{ required: true, message: '请输入申请备注', trigger: 'blur' },
					]
				},
            	anotherThingData:[],
            	weddingContentData1:[],
				drinkAndSnackData1:[],
				banquetArrangeData1:[],
            	pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                EditEOVasible:false,
                EODialogTitle:'',
                EditEODataList:{
                	tableNumber:'',
                	typeName:'',
                	content:''
                },
                dialogAdjustmentEOFormVisible:false,
				varietyOfDishes:[],
				adjustmenteoLists:{  //调整菜品
					hsPackageId:'',
					varietyOfDishe:''
				},
				adjustmentListIndex:'',
				dialogAddmentEOFormVisible:false,
				addmentEOLists:{  //添加菜品
					hsPackageId:'',
					varietyOfDishe:'',
					unitPrice:''
				},
				finalQuotationList:[],
				finalQuotationVisible:false,
				addFinalQuotationVisible:false,
				addFinalQuotationLists:{
					quantity:'',
					remark:'',
					unitPrice:''
				},










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
				hsPackageItemList:[],
				dialogApplyDiscountFormVisible:false,
				dialogEOMenuTableVisible:false,
				EOMenuList:[],



                formLabelWidth:'80px',
                activeName: '1',
                isWeddingType:true,
                isInvoiceValide:false,
                hsPackageServiceItemList:[],  //价格内容/服务内容
                followDetailsTable:[],
                radioStatus:'0',
                shoujuNumbers:[],
				createAllAcount:0,  //总金额
				createAllReceivedAcount:'',



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
                printRowVisible:false,
                printType:'',
                btnP:{
                	myOrderChangeEO:"",  //查看EO单
                	myOrderEditEO:"",  //编辑EO单
		            myOrderAddFinalForm:"",  //最终确认单添加
		            myOrderShowFinal:"",  //查看最终报价单
		            myOrderPrint:"",  //打印
                }
            }
        },

        methods: {
            printRow(row){
                this.printRowVisible=true
                this.printHsOrderId=row.hsOrderId
                switch (row.orderType){
                    case 0:
                        this.printType='wedding'
                    break;
                    case 1:
                        this.printType='seance'
                        break;
                    case 2:
                        this.printType='baby'
                        break;
                }

            },
            pageClose(){
                this.btmVisible=false
                this.componentName=''
            },
            printTemplateRow(row){//打印
                this.btmVisible=true
                this.componentName=this.printType+row.printName
                this.isPrintPage=true
            },
            previewTemplateRow(row){ //预览
                this.btmVisible=true
                this.componentName=this.printType+row.printName
                this.isPrintPage=false
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
        	initDec(){ //初始化字典值
                this.dec.data_type= this.dicData.HS_DATA_TYPE  //订单类型
                this.dec.funds_type=this.dicData.HS_AGREEMENT_FUNDS_TYPE//收款类型
                this.dec.order_status=this.dicData.HS_ORDER_STATUS//订单状态
                this.dec.schedule_status=this.dicData.HS_SCHEDULE_STATUS //档期状态
                this.dec.agreement_status=this.dicData.HS_AGREEMENT_STATUS//合同状态
                this.dec.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
                this.dec.agreement_funds_type=this.dicData.HS_AGREEMENT_FUNDS_TYPE//收款项目类型
                this.dec.agreement_funds_payment_status=this.dicData.HS_AGREEMENT_FUNDS_PAYMENT_STATUS//收款状态
                this.dec.payment_invoice_type=this.dicData.HS_PAYMENT_INVOICE_TYPE//发票类型
                this.dec.print_item=this.dicData.HS_PRINT_ITEM//打印名称
                this.dec.payment_item=this.dicData.HS_AGREEMENT_FUNDS_TYPE  //付款名称
                this.dec.review_type = this.dicData.HS_REVIEW_TYPE  //审核状态
                this.dec.order_type = this.dicData.MOBILE_HS_ORDER_TYPE  //订单意向
                this.dec.agreementEO_species = this.dicData.HS_AGREEMENT_EO_SPECIES  //EO单名字
                this.dec.final_quotation_type = this.dicData.FINAL_QUOTATION_TYPE  //最终报价单类型
                this.dec.review_status=this.dicData.REVIEW_STATUS  //EO单审核状态
            },
			getcommissionContractList(data){
                this.loading.pageList=true
                this.$axios.post('/order/getHsOrderPlannerList',data).then((res)=>{
                    this.loading.pageList=false
                    if(res.data.res == 0){
						this.storeStatus = this.dicData.HS_CUSTOMER_STATUS;
                    	this.lastOprations = this.dicData.HS_CUSTOMER_OPERATION_SOURCE;
						this.commissionContractMgrDataList = res.data.msg.list
						this.pagination.total = res.data.msg.total;
                        this.pagination.pageNum = res.data.msg.pageNum;
                        this.pagination.pageSize = res.data.msg.pageSize;
					}
					else{
						this.loading.pageList=false
						alert(res.data.msg)
					}
				}).catch(()=>{
                    this.loading.pageList=false
                })
			},
			handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.getcommissionContractList(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.getcommissionContractList(this.tableData);
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
            statusText(status,statusName){ //状态值匹配
                let n;
                this.dec[statusName].forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            },
            agreementStatusText(data){
            	let statusText1;
		            this.dec.agreement_status.forEach((n)=>{
		                if( n.dicValue==data){
		                    statusText1 = n.dicDesc
		                }

		            })
		      return statusText1
            },
            onSubmit(){
				this.getcommissionContractList(this.tableData)

            },
             resetForm(formName){
            	this.$refs[formName].resetFields();
            },
		    changeCity(){
            	this.getAllBanquets()
            	this.getcommissionContractList(this.tableData)
	            this.$axios.post('/s/getSalesListByUser',{'cityCode':this.cityNames.city}).then((res4)=>{    //获取所有销售
					if(res4.data.res == '0'){
						if(res4.data.msg.length ==1 && res4.data.msg[0].id == '-999'){
								this.salesIds = []
							}
							else{
								this.salesIds = res4.data.msg;
							}

						}
	              })
			},
            formTime(row){
            	if(row.createTime !=null){
            		return formatTime(row.createTime)
            	}
            	else{
            		return ''
            	}

            },
            startDateChange(val){
				this.formInline.dateTimeStart = val
            },
			endDateChange(val){
				this.formInline.dateTimeStop = val
			},
			openEODataHandle(row){  //打开EO单
				this.EOVasible = true
				this.EOData = row
				this.$axios.post('/order/getHsPackageList',{'type':row.orderType}).then((res)=>{  //获取所有套系
	                    if(res.data.res == '0'){
	                    	this.newCreateContractsets = res.data.msg;

	                    }
	             	})
	            this.getEODetails()
	            this.getDiscountList()
				this.createNewContracts.type = row.orderType

			},
			getDiscountList(){
				let data = [0,1,2]
				let self = this
	            self.$axios({
					url: "/order/getHsAgreementEoFavourable?hsOrderId="+self.EOData.hsOrderId,
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
			getEODetails(){
				this.$axios.post('/order/getHsAgreementEODetail',{'hsOrderId':this.EOData.hsOrderId}).then((res)=>{  //获取所有套系数据
		            if(res.data.res == '0'){
		            	let arr1 = [];
				        let arr2 = [];
				        let arr3 = [];
		                this.EOMenuList = res.data.msg.hsAgreementEOMenuList;
		                if(res.data.msg.hsAgreementEOList.length){
		                	res.data.msg.hsAgreementEOList.forEach((n)=>{
							    if(n.species==1){
							        arr1.push(n)
							    }
							    else if(n.species==2){
							    	arr2.push(n)
							    }
							    else if(n.species==3){
							    	arr3.push(n)
							    }
							    else if(n.species==0){
							    	this.anotherThingData.push(n)
							    }
							})
							console.log(arr1)
							console.log(arr2)
							console.log(arr3)
							if(arr1.length){
								for(var i=0;i<arr1.length;i++){
									this.weddingContentData[i].species = arr1[i].species
									this.weddingContentData[i].content = arr1[i].content
									this.weddingContentData[i].remark = arr1[i].remark
									this.weddingContentData[i].id = arr1[i].id

								}
							}
							else{
								this.weddingContentData = [
					            	{species:'1',type:'0',content:'',remark:'',typeName:'总桌数'},
					            	{species:'1',type:'1',content:'',remark:'',typeName:'主桌数'},
					            	{species:'1',type:'2',content:'',remark:'',typeName:'菜单'}
				            	];
							}
							if(arr2.length){
								for(var i=0;i<arr2.length;i++){
									this.drinkAndSnackData[i].species = arr2[i].species
									this.drinkAndSnackData[i].content = arr2[i].content
									this.drinkAndSnackData[i].remark = arr2[i].remark
									this.drinkAndSnackData[i].id = arr1[i].id
								}
							}
							else{
								this.drinkAndSnackData = [
				            		{species:'2',type:'3',content:'',remark:'',typeName:'蛋糕'},
					            	{species:'2',type:'4',content:'',remark:'',typeName:'正餐'},
					            	{species:'2',type:'5',content:'',remark:'',typeName:'下午茶'}
				            	];
							}
							if(arr3.length){
								for(var i=0;i<arr3.length;i++){
									this.banquetArrangeData[i].species = arr3[i].species
									this.banquetArrangeData[i].content = arr3[i].content
									this.banquetArrangeData[i].remark = arr3[i].remark
									this.banquetArrangeData[i].id = arr1[i].id
								}
							}
							else{
								this.banquetArrangeData = [
				            		{species:'3',type:'6',content:'',remark:'',typeName:'桌布'},
					            	{species:'3',type:'7',content:'',remark:'',typeName:'椅背'},
					            	{species:'3',type:'8',content:'',remark:'',typeName:'口布'}
				            	];
							}
		                }
		                else{
		                	this.weddingContentData = [
				            	{species:'1',type:'0',content:'',remark:'',typeName:'总桌数'},
				            	{species:'1',type:'1',content:'',remark:'',typeName:'主桌数'},
				            	{species:'1',type:'2',content:'',remark:'',typeName:'菜单'}
			            	];
							this.drinkAndSnackData = [
			            		{species:'2',type:'3',content:'',remark:'',typeName:'蛋糕'},
				            	{species:'2',type:'4',content:'',remark:'',typeName:'正餐'},
				            	{species:'2',type:'5',content:'',remark:'',typeName:'下午茶'}
			            	];
							this.banquetArrangeData = [
			            		{species:'3',type:'6',content:'',remark:'',typeName:'桌布'},
				            	{species:'3',type:'7',content:'',remark:'',typeName:'椅背'},
				            	{species:'3',type:'8',content:'',remark:'',typeName:'口布'}
			            	];
		                }

		            }
		        })
			},
			applyDiscountHandle(){  //申请优惠按钮
				this.dialogApplyDiscountFormVisible = true
			},
			cancelApplyDiscountHandle(){
				this.$refs['applyDiscounts'].resetFields();
				this.dialogApplyDiscountFormVisible = false
			},
			confirmApplyDiscountHandle(roleForm){
				this.$refs[roleForm].validate((valid) => {
					if (valid) {
						let data = {
							remark:this.applyDiscounts.remark,
							amount:this.applyDiscounts.amount,
							hsOrderId:this.EOData.hsOrderId
						};
						if(data.amount>0){
							data.amount = 0 - data.amount
						}
						this.$axios.post('/order/saveHsAgreementEOFavourable',data).then((res)=>{  //调整EO单
				            if(res.data.res == '0'){
								this.getDiscountList()
								this.getcommissionContractList(this.tableData);
				            }
				            else{
				                alert(res.data.msg)
				            }
				        })
						this.cancelApplyDiscountHandle();
					} else {
						return false;
					}
				})
			},
			deleteDiscountRow(index, rows){

				this.$confirm('此操作将删除此优惠, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/order/deleteHsAgreementEOFavourable',{hsAgreementEOFavourableId:rows.id}).then((res)=>{
                        if(res.data.res==0){
                            this.getcommissionContractList(this.tableData);
                            this.getDiscountList()
                            this.$message({
                                type: 'success',
                                message: '已成功删除!'
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
			cancelEOHandle(){
				this.EOVasible = false
				this.anotherThingData = []
			},
			editEOTableDataMenuHandle(row){  //编辑打开菜单
				this.dialogEOMenuTableVisible = true
			},
			addEODataHandle(){  //添加EO单
				this.EditEOVasible = true
			},
			editEOTableDataHandle(index,row,number){  //普通编辑
				this.EditEOVasible = true
				this.EODialogTitle = row.typeName
				this.arrayNameIndex = number
				this.arrayNameRow = row
				console.log(row)
				this.addAnther = true
				if(number === 1){
					this.editEoTanmeNumber = true
					this.EditEODataList.tableNumber = row.content
				}
				else{
					this.EditEODataList.content = row.content
					this.editEoTanmeNumber = false
					if(number === 2){
						this.addAnther = false
						this.EditEODataList.typeName = ''
						this.EditEODataList.content = ''
					}
				}
			},
			confirmEOHandle(forName){  //确定编辑
				let newData = {
					type:this.arrayNameRow.type,
					content:this.EditEODataList.content,
					species:this.arrayNameRow.species,
					typeName:this.arrayNameRow.typeName,
					hsOrderId:this.EOData.hsOrderId,
					id:''
				}
				if(this.arrayNameRow.id !='' || this.arrayNameRow.id !=null && this.arrayNameRow.id !=undefined){
					newData.id=this.arrayNameRow.id
				}
				else{
					newData.id=''
				}
				if(this.arrayNameIndex == 2 || this.arrayNameRow.typeName == '其他'){
					if(this.EditEODataList.typeName === '' || this.EditEODataList.content === ''){
						if(this.EditEODataList.typeName === ''){
							this.$message.error('类型不能为空！')
	            			return false
						}
						else{
							this.$message.error('内容不能为空！')
	            			return false
						}
					}
					else{

						newData.type = ''
						newData.species = 0
						newData.typeName = this.EditEODataList.typeName
						this.$axios.post('/order/adjustEO',newData).then((res)=>{  //调整EO单
				            if(res.data.res == '0'){
								this.getEODetails()
								this.getcommissionContractList(this.tableData);
				                this.cancelEditEOHandle()
				            }
				                else{
				                    alert(res.data.msg)
				                }
				           })

					}
				}
				else{
					let isTableNumber = ''
					if(this.arrayNameIndex == 1){
						newData.content = this.EditEODataList.tableNumber
						if(this.arrayNameRow.typeName == '总桌数' && this.EditEODataList.tableNumber<this.EOData.tableNumber){
							isTableNumber = false
							this.$confirm('总桌数不能少于合同桌数?', '提示', {
		                        confirmButtonText: '确定',
		                        cancelButtonText: '取消',
		                        type: 'warning'
		                   }).then(() => {
		                   }).catch(() => {

		                    });

		                    return false
						}
						else{
								isTableNumber = true
						}
						if(this.arrayNameRow.typeName == '主桌数' && this.weddingContentData[0].content==''){
							isTableNumber = false
							this.$confirm('请先编辑总桌数?', '提示', {
		                        confirmButtonText: '确定',
		                        cancelButtonText: '取消',
		                        type: 'warning'
		                   	}).then(() => {

		                    }).catch(() => {

		                    });

		                    return false
						}
						else{
								isTableNumber = true
						}
						if(this.arrayNameRow.typeName == '主桌数' && this.EditEODataList.content>this.weddingContentData[0].content){
							 isTableNumber = false
							this.$confirm('主桌数不能大于总桌数?', '提示', {
		                        confirmButtonText: '确定',
		                        cancelButtonText: '取消',
		                        type: 'warning'
		                   	}).then(() => {

		                    }).catch(() => {

		                    });
		                   return false
						}
						else{
								isTableNumber = true
						}
					}
					else{
						isTableNumber = true
					}
					if(this.arrayNameRow.species === 0){
						newData.type = ''
					}
					if(isTableNumber){
						this.$axios.post('/order/adjustEO',newData).then((res)=>{  //调整EO单
			                if(res.data.res == '0'){
								this.getEODetails()
								this.getcommissionContractList(this.tableData);
			                  	this.cancelEditEOHandle()
			                }
			                else{
			                    alert(res.data.msg)
			                }
			            })
					}

				}

			},
			cancelEditEOHandle(){  //取消普通编辑
				this.$refs['EditEODataList'].resetFields();
				this.EditEOVasible = false
			},
			addEOHsPackageMenuList(){  //添加菜品
				if(Number(this.weddingContentData[0].content <= 0)){
					this.$message.error('请先编辑总桌数，切总桌数不能小于0！')
	            	return
				}
				else{
					this.dialogAddmentEOFormVisible = true
				}

            },
            ChangeAddmentEOSetHandle(val){  //改变菜品套系
            	this.$axios.post('/order/getHsPackageDetail',{'type':this.createNewContracts.type,'hsPackageId':this.addmentEOLists.hsPackageId}).then((res)=>{  //获取所有套系数据
	                    if(res.data.res == '0'){
	                    	this.varietyOfDishes = res.data.msg.hsPackageMenuList;

	                    }
	             })
            },
            confirmAddmenteoHandle(){  //确定添加菜品
            	let data = {
            		name:'',
            		packageName:'',
            		adjustName:'',
            		adjustPackageName:'',
            		isTrue:true,
            		adjustType:1
            	}
            	 this.newCreateContractsets.forEach((n)=>{
					    if( this.addmentEOLists.hsPackageId==n.id){
					        data.packageName = n.packageName
					    }
					})
					this.varietyOfDishes.forEach((n)=>{
					    if( this.addmentEOLists.varietyOfDishe==n.id){
					        data.name = n.name
					    }
					})

				let newData = {
					name:data.name,
					hsPackageId:this.addmentEOLists.hsPackageId,
            		adjustName:'',
            		adjustPackageId:'',
            		hsOrderId:this.EOData.hsOrderId,
            		isAdded:1,
            		quantity:this.weddingContentData[0].content,
            		unitPrice:this.addmentEOLists.unitPrice,
            		adjustType:1
				}
				this.$axios.post('/order/adjustEOMenu',newData).then((res)=>{  //调整菜单提交
	                    if(res.data.res == '0'){
	                    	this.EOMenuList.push(data)
	                    	this.cancelAddmentEOHandle();
	                    }
	                    else{
	                    	alert(res.data.msg)
	                    }
	             })

            },
            cancelAddmentEOHandle(){  //取消添加菜品
            	this.$refs['addmentEOLists'].resetFields();
				this.dialogAddmentEOFormVisible = false
            },
            adjustEOmentHandle(index,row){  //调整菜品按钮
            	this.adjustmentListIndex = row;
            	this.dialogAdjustmentEOFormVisible = true
            },
			cancelAdjustmentEOHandle(){  //取消调整菜品
				this.$refs['adjustmenteoLists'].resetFields();
				this.dialogAdjustmentEOFormVisible = false
			},
			confirmAdjustmentEOHandle(){  //确定调整菜品
				let adjustName = ''
				let hsPackageId = ''
				let adjustPackageName = ''
				this.newCreateContractsets.forEach((n)=>{
					    if( this.adjustmenteoLists.hsPackageId==n.id){
					        this.adjustmentListIndex.adjustPackageName = n.packageName
					        adjustPackageName = n.packageName
					    }
					})
					this.varietyOfDishes.forEach((n)=>{
					    if( this.adjustmenteoLists.varietyOfDishe==n.id){
					        this.adjustmentListIndex.adjustName = n.name
					        adjustName = n.name
					    }
					})

				let newData = {
					name:this.adjustmentListIndex.name,
					hsAgreementEOMenuId:this.adjustmentListIndex.id,
            		adjustName:adjustName,
            		adjustPackageId:this.adjustmenteoLists.hsPackageId,
            		hsOrderId:this.EOData.hsOrderId,
            		isAdded:0,
            		unitPrice:100,
            		adjustType:0
				}
				this.$axios.post('/order/adjustEOMenu',newData).then((res)=>{  //添加菜单提交
	                    if(res.data.res == '0'){
	                    	this.cancelAdjustmentEOHandle();
	                    }
	                    else{
	                    	alert(msg)
	                    }
	             })


			},
			ChangeAdjustmentEOSetHandle(val){  //改变调整菜单的套系
				this.$axios.post('/order/getHsPackageDetail',{'type':this.createNewContracts.type,'hsPackageId':this.adjustmenteoLists.hsPackageId}).then((res)=>{  //获取所有套系数据
	                    if(res.data.res == '0'){
	                    	this.varietyOfDishes = res.data.msg.hsPackageMenuList;
	                    }
	             })
			},
			reductionEOHandle(index,row){  //还原菜单按钮
				row.alternateName = '';
				row.alterPakename = ''
			},
			deleteRow4(index, rows){
		    	this.EOMenuList.splice(index,1)
		    },
		    openfinalQuotationHandle(row){  //打开最终报价单
		    	this.EOData = row;
				this.finalQuotationVisible = true
				this.$axios.post('/order/getHsOrderFinalQuotationList',{'hsOrderId':this.EOData.hsOrderId}).then((res)=>{  //获取所有最终报价单
	                    if(res.data.res == '0'){
	                    	this.finalQuotationList = res.data.msg;
	                    }
	             })
		    },
		    cancelfinalQuotationHandle(){  //关闭最终报价单
		    	this.finalQuotationVisible = false
		    },
		    confirmfinalQuotationHandle(number){  //提交最终报价单
		    	let data = []
			    if(this.finalQuotationList.length){
			    	for(var i=0;i<this.finalQuotationList.length;i++){
			    		let a = {
				   			"amount": this.finalQuotationList[i].amount,
					   		"hsOrderId": this.EOData.hsOrderId,
					    	"status":this.finalQuotationList[i].status,
							"quantity": this.finalQuotationList[i].quantity,
							"id":this.finalQuotationList[i].id,
							"remark": this.finalQuotationList[i].remark,
							"type": this.finalQuotationList[i].type,
							"unitPrice": this.finalQuotationList[i].unitPrice,
				    	}
				    	data.push(a)
			    	}
			    }
	
			    let self = this
			    let submitStatus = number
		    	if(number == 1){
		    		this.$confirm('提交完成后不能删除, 请确认是否提交?', '提示', {
	                    confirmButtonText: '是',
	                    cancelButtonText: '否',
	                    type: 'warning'
	                }).then(() => {
	                    this.$axios({
							url: "/order/saveHsOrderFinalQuotationList?submitStatus="+submitStatus+'&hsOrderId='+self.EOData.hsOrderId,
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
							if(res.data.res==0){
								self.cancelfinalQuotationHandle()
								self.finalQuotationVisible = false
								self.finalQuotationList = []
								self.$message({
			                        type: 'success',
			                        message: '提交成功!'
			                    });
							}else {
								self.$message.error(res.data.msg)
							}
						});
	               	}).catch(() => {
	                   	this.$message({
	                       	type: 'info',
	                        message: '已取消操作'
	                    });
	                });
		    	}
		    	else{
	                this.$axios({
						url: "/order/saveHsOrderFinalQuotationList?submitStatus="+submitStatus+'&hsOrderId='+self.EOData.hsOrderId,
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
						if(res.data.res==0){
							self.cancelfinalQuotationHandle()
							self.finalQuotationVisible = false
							self.finalQuotationList = []
							self.$message({
								type: 'success',
				                message: '提交成功!'
				            });
						}else {
							self.$message.error(res.data.msg)
						}
					});
		    	}
		    },
		    addfinalQuotationHandle(){  //添加最终报价单
		    	this.addFinalQuotationVisible = true
		    },
		    cancelAddFinalQuotationHandle(){  //取消添加最终报价单
		    	this.$refs['addFinalQuotationLists'].resetFields();
		    	this.addFinalQuotationVisible = false
		    },
		    confirmAddFinalQuotationHandle(){  //确定添加最终报价单
		    	let a = {
		    		type:2,
		    		typeText:'追加',
		    		id:'',
		    		status:'',
		    		quantity:this.addFinalQuotationLists.quantity,
		    		remark:this.addFinalQuotationLists.remark,
		    		unitPrice:this.addFinalQuotationLists.unitPrice,
		    		amount:this.addFinalQuotationLists.quantity*this.addFinalQuotationLists.unitPrice,
		    		canDelet:true,
		    	}
		    	this.finalQuotationList.push(a)
		    	this.cancelAddFinalQuotationHandle()
		    },
			deleteRow5(index,row){
				this.finalQuotationList.splice(index,1)
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
            getAllSet(){
            	this.$axios.post('/order/getHsPackageList',{'type':this.createNewContracts.type}).then((res)=>{  //获取所有套系
	                    if(res.data.res == '0'){
	                    	this.newCreateContractsets = res.data.msg;

	                    }
	             	})
            },
             handleClick(tab, event) {  //改变分页
				if(tab.name == 2){
					this.createTableForms = this.dicData.DINING_TABLE_FORM_TYPE;
					this.getAllSet()
				}
				else if(tab.name == 3){
					if(this.hsOrderDialogTitle != '合同详情'){
						if(this.screeningType == 0 || this.screeningType == 2){
							this.createPaymentConventionList = this.createPaymentConventionList1

						}
						else{
							this.createPaymentConventionList = this.createPaymentConventionList2
						}
					}
					else{
						this.createPaymentConventionList = this.createPaymentConventionList
					}


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
            	this.$axios.get('/store/getHallList',{params:{'pageSize':100,'cityCode':this.cityNames.city,'status':0}}).then((res)=>{  //获取所有宴会厅
                    if(res.data.res == '0'){
                    	this.banquetHalls = res.data.msg.list;
                    	this.hallList=res.data.msg.list
                    }
             	 })
            },
            checkDetailsRow(row){//查看合同详情按钮
            	this.getAllBanquets();
                this.$loading({text:'拼命加载中'})
            	let shouNumbewr = []
            	 this.$axios.post('/order/getHsPaperReceiptList',{'salesId':JSON.parse(localStorage.getItem("userInfo")).id}).then((res)=>{
                    if(res.data.res == '0'){
                    	shouNumbewr = res.data.msg.list
                    }else {
                        this.$loading().close()
                    }
             	 })
            	this.involiceTypes = this.dicData.HS_PAYMENT_INVOICE_TYPE
                this.dialogNewContract=true
                this.hsOrderDialogTitle = '合同详情',
                this.screeningType  = row.orderType
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

                this.$axios.post('/order/getHsOrderDetail',{hsOrderId:row.hsOrderId}).then((res)=>{
                	let self = this
                    if(res.data.res=='0'){
                    	self.hetongDetailsTable=res.data.msg
	                    self.hsOrderDetailList = res.data.msg
	                    self.createAllReceivedAcount = res.data.msg.receivedAmount
	                     self.radioStatus = res.data.msg.hsAgreementFundsList[0].receiptType
	                    shouNumbewr.forEach((n)=>{
						    if(n.id==res.data.msg.hsAgreementFundsList[0].hsPaperReceiptId) {
						        self.createNewContracts.receiptId=n.receiptNo
						    }
						})
                    	let data = [0,1,2,3,4,5]
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







                    	self.$axios({
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
                                    self.$loading().close()
								}else {
                                    self.$loading().close()
									alert(res1.data.msg)
								}
							}
						);


                    	if(res.data.msg.hsAgreementDTO !=null){
	                        self.hsOrderDetailList.partyA = res.data.msg.hsAgreementDTO.partyA
	                        self.createEssentialInformations = res.data.msg.hsAgreementDTO  //婚宴基本信息
	                        self.createEssentialInformations1 = res.data.msg.hsAgreementDTO  //会务，宝宝宴基本信息
	                        self.createAllAcount = res.data.msg.hsAgreementDTO.totalAmount  //总金额
	                        self.hsPackageServiceItemList = res.data.msg.hsAgreementDTO.hsAgrPkgServiceItemList  //服务内容
	                        self.hsPackageItemList = res.data.msg.hsAgreementDTO.hsAgrPackageItemList  //项目

	                        self.createSupplementaryItems = res.data.msg.hsAgreementDTO.hsAgrPkgSupplementMattersList  //补充事项
	                        self.createPriceContents = res.data.msg.hsAgreementDTO.hsAgrPackageDTO  //套系信息
	                        self.createPriceContents.estimateTableNumber = self.createPriceContents.tableNumber
                    	}
                    	 if(res.data.msg.hsSchedule != null && res.data.msg.hasOwnProperty('hsSchedule')){
	                        	self.hsOrderDetailList.hsSchedule = res.data.msg.hsSchedule
	                        	if(self.hsOrderDetailList.hsSchedule.banquetHallList.length==0){
		                        	self.hsOrderDetailList.hsSchedule.banquetHallList = ''
		                        }
		                        self.hsOrderDetailList.hsSchedule.scheduleTime = moment(self.hetongDetailsTable.hsSchedule.scheduleTime).format('YYYY-MM-DD')
		                        self.hsOrderDetailList.hsSchedule.banquetHallList.forEach((n)=>{
									self.createNewContracts.banquetHall.push(n.id)
								})
			                	self.createNewContracts.schedule = row.scheduleTime
						        self.createNewContracts.scheduleTimeType = row.scheduleTimeType
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

                    }else {
                        alert(res.data.msg)
                        self.$loading().close()
                    }
                })
            },
            getAllCity(){
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
            }
        },
        mounted(){
        	this.cityNames.city = JSON.parse(localStorage.getItem("userInfo")).positionCitys[0].cityCode
        	this.btnP = {
                myOrderChangeEO:filterBtnPms(this.btnAllPms.myOrderChangeEO),  //调整EO单
		        myOrderAddFinalForm:filterBtnPms(this.btnAllPms.myOrderAddFinalForm),  //最终确认单添加
		        myOrderShowFinal:filterBtnPms(this.btnAllPms.myOrderShowFinal),  //查看最终报价单
		        myOrderPrint:filterBtnPms(this.btnAllPms.myOrderPrint),  //打印
		        myOrderEditEO:filterBtnPms(this.btnAllPms.myOrderEditEO),  //打印
            }
            this.getAllCity()
            this.changeCity()
            this.getAllSet()
            this.initDec()
			this.getAllBanquets()
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    "dateTimeStart":this.formInline.dateTimeStart,
                    "dateTimeStop":this.formInline.dateTimeStop,
                    "orderType":this.formInline.orderType,
                    "mobile":this.formInline.mobile,
                    "name":this.formInline.name,
                    "hallId":this.formInline.hallId,
                    "customerMobile":this.formInline.customerMobile,
                    "salesId":this.formInline.salesId,
                    "cityCode":this.cityNames.city

                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
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
	.page_pagination{
        text-align: right;
    }
    .table_bottom{
        margin-top:13px;
    }

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

    .EODiv{
    	margin-bottom:30px;
    }
    .centerTitle{
    	text-align: center;
    	height:50px;
    	line-height: 50px;
    }
</style>
