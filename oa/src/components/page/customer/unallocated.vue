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
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>未分配的数据</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='mobile' v-if='customerDuplicate'>
        	<el-input class='hiddenspan' v-model="cfMobile"></el-input>
        	<el-button type="primary" @click="check">查重</el-button>
        </div>
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
        	 <el-form-item v-show='customerCustDistribution'>
				<el-button type="primary" @click="assign(1)">指定分配</el-button>
			  </el-form-item>
			  <el-form-item v-show='customerCustAverageDistribution'>
				<el-button type="primary" @click="assign(2)">平均分配</el-button>
			  </el-form-item>
			  <el-form-item v-show='customerCustDistribution'>
				<el-button type="primary" @click="assign(3)">批量修改</el-button>
			  </el-form-item>
        	<el-form-item label="手机：" prop='mobile'>
				<el-input class='lengthInput' v-model="formInline.mobile"></el-input>
			</el-form-item>
		 <el-form-item label="渠道：" prop='channelId'>
				<el-select clearable v-model="formInline.channelId" clearable placeholder="请选择">
				    <el-option
				      v-for="type in channelIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
			</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="onSubmit">查询</el-button>
		</el-form-item>
		  <el-form-item class='formRightBtn'>
			<el-button type="primary" @click="batchImport">批量导入</el-button>
			<el-button type="primary" @click="oneImport">单条导入</el-button>
		  </el-form-item>
		</el-form>
		<div style='text-align: left;' v-show='customerChannelDistribution'>
			<el-select v-model="QuDaoSale" clearable placeholder="请选择">
				<el-option
				    v-for="type in salesss"
				    :key="type.id"
                    :label="type.nickName"
                    :value="type.id">
				</el-option>
			</el-select>
			<el-button type="primary" @click="assignQuDao">分配</el-button>
		</div>
		<el-dialog  title="单条录入" :visible.sync="dialogFormVisibleOne" :before-close="cancelimportOneHandle">
			  <el-form :model='oneImports' :rules='oneImportRules' ref="oneImports">

				<el-form-item v-show='isNotQuDao' label="来源渠道：" prop='channelId' :label-width="formLabelWidth">
				   <el-select clearable v-model="oneImports.channelId" placeholder="请选择" style="min-width:140px">
				    <el-option
				      v-for="p in channelIds"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="客户名：" prop='customerName' :label-width="formLabelWidth">
				    <el-input v-model="oneImports.customerName" style="min-width:140px"></el-input>
				</el-form-item>
				<el-form-item label="手机号：" prop='mobile' :label-width="formLabelWidth">
				    <el-input  v-model="oneImports.mobile" style="min-width:140px"></el-input>
				</el-form-item>
				<el-form-item label="桌数：" prop='tableNumber' :label-width="formLabelWidth">
				    <el-input  v-model="oneImports.tableNumber" style="min-width:140px"></el-input>
				</el-form-item>
				<el-form-item label="预算：" prop='budget' :label-width="formLabelWidth">
				    <el-input  v-model="oneImports.budget" style="min-width:140px"></el-input>
				</el-form-item>
				<el-form-item label="档期：" prop='bookingTime' :label-width="formLabelWidth">
					<el-input  v-model="oneImports.bookingTime" style="min-width:140px"></el-input>
				</el-form-item>
				<el-form-item label="类型：" prop='type' :label-width="formLabelWidth">
				   <el-select clearable v-model="oneImports.type" placeholder="请选择" style="min-width:140px">
				    <el-option
				      v-for="type in dec.data_type"
				      :key="type.dicDesc"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="备注：" prop='remark' :label-width="formLabelWidth">
				    <el-input  v-model="oneImports.remark" style="min-width:140px"></el-input>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="importOneHandle('oneImports')">确定</el-button>
			    <el-button @click="cancelimportOneHandle">取 消</el-button>
			  </div>
			</el-dialog>


			<el-dialog  title="批量录入" :visible.sync="dialogFormVisibleMore" :before-close="cancelimportMoreHandle">
			  <el-form :model='moreImports' :rules='moreImportRules' ref="moreImports">
				<el-form-item v-show='!customerSalesDistribution' label="来源渠道：" prop='channelId' :label-width="formLabelWidth">
				   <el-select clearable v-model="moreImports.channelId" placeholder="请选择">
				    <el-option
				      v-for="p in channelIds"
				      :key="p.id"
				      :label="p.nickName"
				      :value="p.id">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="类型：" prop='type' :label-width="formLabelWidth">
				   <el-select clearable v-model="moreImports.type" placeholder="请选择">
				    <el-option
				      v-for="type in dec.data_type"
				      :key="type.dicDesc"
                      :label="type.dicDesc"
                      :value="type.dicValue">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item label="文件：" prop='file' :label-width="formLabelWidth">
				   <el-upload class="upload-demo selectFile" ref="upload" accept=".xls" :on-error='uploadFileError' :on-success='uploadFileSuccess' action="/customer/batchSaveHsCustomer" :data='{cityCode:cityNames.city,channelId:moreImports.channelId,type:moreImports.type}' :auto-upload="false" :file-list="fileList">
	  					<el-button size="small" type="primary">选择文件</el-button>
	  					<div slot="tip" class="el-upload__tip">只能上传xls文件</div>
  					</el-upload>
				</el-form-item>
				<el-form-item label="注：" :label-width="formLabelWidth">
				  <div class='message'>
				只允许excel97-2003格式以.xls结尾的excel文件，且文件行数不得超过3千行，否则会无法导入！第一列所有都会导入数据库，不允许有任何说明文字！
				第一行也会导入数据库，请不要做标记！<span style="text-decoration: none;">超过300行数据的建议分批导入，每300行一次，数据太多容易导入失败！<span style="text-decoration: none;color:#79CDCD;font-size:18px">（建议您按每200行一次的数据分批导入，减轻服务器压力，谢谢配合，幸苦您，谢谢！）</span></span></div>
				</el-form-item>
				<el-form-item label="范例：" :label-width="formLabelWidth">
				 	<a :href="uploadTemplate" download>点击下载</a>
				</el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="importMoreHandle">确定</el-button>
			    <el-button @click="cancelimportMoreHandle">取 消</el-button>
			  </div>
			</el-dialog>



		 <template>
        	<el-table
        		v-loading="loading.pageList" element-loading-text="拼命加载中"
                ref="multipleTable"
                :data="unallocatedData"
                border
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="customerName" label="客户名"></el-table-column>
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
                <el-table-column prop="tableNumber" label="桌数"></el-table-column>
                <el-table-column prop="budget" label="预算"></el-table-column>
                <el-table-column prop="bookingTime" label="档期" ></el-table-column>
                <el-table-column prop="statusText" label="状态">
                	<template scope="scope">
			                <div>{{statusText(scope.row.status,'hs_customer_status')}}</div>
			            </template>
                </el-table-column>
                <el-table-column prop="channelName" label="来源渠道"></el-table-column>
                <el-table-column prop="creatorName" label="导入人" ></el-table-column>
                <el-table-column prop="createTime" label="录入时间" :formatter="formTime"></el-table-column>
           </el-table>
	     </template>
        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col >
                <div class="grid-content bg-purple">
                    <el-pagination class='page_pagination'
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="pagination.pageNum"
                                   :page-sizes="[10, 25,50 ,100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next" :total="pagination.total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <!--分配、修改-->
        <el-dialog  :title="turnOutTitle" :visible.sync="dialogFormVisible" :before-close="cancelTurnOutBtn">
			 <el-form :model='changeTurnOuts' ref = 'changeTurnOuts'>
			 	<el-form-item v-if='isShowCS' label="城市：" prop='cityCode'>
				   <el-select v-model="changeTurnOuts.cityCode" placeholder="请选择" @change="changeCity">
				    <el-option
				        v-for="type in storeCitys"
						:key="type.cityCode"
		                :label="type.cityName"
		                :value="type.cityCode">
				    </el-option>
				  </el-select>
				</el-form-item>
				<el-form-item v-if='isShowKF' label="客服：" prop='targetOperatorId1'>
				   <el-select v-model="changeTurnOuts.targetOperatorId1" clearable placeholder="请选择">
				    <el-option
				      v-for="type in custServiceIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
				</el-form-item>
				<el-form-item v-if='isShowXS' label="销售：" prop='targetOperatorId2'>
				   <el-select v-model="changeTurnOuts.targetOperatorId2" clearable placeholder="请选择">
				    <el-option
				      v-for="type in salesIds"
				      :key="type.id"
                      :label="type.nickName"
                      :value="type.id">
				    </el-option>
				</el-select>
				</el-form-item>
				<el-form-item v-if='isShowPj' label="平均分配给以下人员：" prop='targetOperatorId3'>
				  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				  <div style="margin: 15px 0;"></div>
				  <el-checkbox-group v-model="checkedCustservices" @change="handleCheckedCitiesChange">
				    	<el-checkbox v-for="item in custServiceIds" :label="item.id" :key="item.id">{{item.nickName}}</el-checkbox>
				  </el-checkbox-group>
				</el-form-item>

			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button type="primary" icon='document' @click="turnOutBtn('changeTurnOuts')">确定</el-button>
			    <el-button @click="cancelTurnOutBtn">取 消</el-button>
			  </div>
			</el-dialog>

		<el-dialog :title="tableDialogTitle" size='large' :visible.sync="dialogTableVisible" :before-close="guanbiBox">
        	<el-form :model="changeStatus">
        		<div>
        			<el-form-item class='inline-form' prop='customerName' label="客户：" :label-width="formLabelWidth2">
        				<span v-show='!isEdit' class='hiddenspan'>{{changeStatus.customerName}}</span>
				        <el-input class='hiddenspan' v-show='isEdit' v-model="changeStatus.customerName" auto-complete="off"></el-input>				 	                </el-form-item >
				    <el-form-item class='inline-form' prop='mobile' label="手机：" :label-width="formLabelWidth2">
				    	<span class='hiddenspan'>{{changeStatus.mobile}}</span>
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

		        <el-form-item label="跟进客服：" v-if='isShowKF && customerCustDistribution' prop='isShowKF' :label-width="formLabelWidth2">
				    <el-button type="primary" size="small" @click="handleGrant1(1)">转客服</el-button>
				</el-form-item>
				<el-form-item label="跟进销售：" v-if='isShowXS && customerSalesDistribution' prop='isShowXS' :label-width="formLabelWidth2">
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
	                <el-table-column property="operator" label="操作"></el-table-column>
	                <el-table-column property="status" label="提交状态">
	                	<template scope="scope">
			                <div>{{statusText(scope.row.status,'hs_customer_status')}}</div>
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
        <el-dialog :visible.sync="show" size="full">
            <swiper :options="swiperOption" v-show="show" >
                <swiper-slide v-for="slide in swiperSlides"><img :src="slide" alt=""></swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </el-dialog>

        <el-dialog title="重复详情" size='large' :visible.sync="checkTableVisible">
            <el-table :data="checkDetailsTable" border>
                <el-table-column property="id" label="id"></el-table-column>
                <el-table-column property="customerName" label="客户名" ></el-table-column>
                <el-table-column property="mobile" label="手机"></el-table-column>
               <el-table-column property="cityName" label="城市">
                	<template scope="scope">
			                <div>{{cityText(scope.row.cityCode)}}</div>
			            </template>
                </el-table-column>
                 <el-table-column property="tableNumber" label="桌数"></el-table-column>
                  <el-table-column property="budget" label="预算"></el-table-column>
                  <el-table-column property="channelName" label="来源"></el-table-column>
                  <el-table-column property="statusText" label="状态">
                	<template scope="scope" v-if='scope.row.source == 0'>
			            <div>{{statusText(scope.row.hsCustomerStatus,'hs_customer_status')}}</div>
			        </template>
			        <template scope="scope" v-if='scope.row.source == 1'>
			            <div>{{statusText(scope.row.customerStatus,'customer_status')}}</div>
			        </template>
                  </el-table-column>
                  <el-table-column property="customerId" label="关联ID"></el-table-column>
            </el-table>
            <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
                <el-col>
                </el-col>
                <el-col >
                    <div class="grid-content bg-purple">
                        <el-pagination class='page_pagination'
                                       @size-change="checkHandleSizeChange"
                                       @current-change="checkHandleCurrentChange"
                                       :current-page="checkPagination.pageNum"
                                       :page-sizes="[10, 25,50 ,100]"
                                       :page-size="checkPagination.pageSize"
                                       layout="total, sizes, prev, pager, next"
                                       :total="checkPagination.total">>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>


    </div>
</template>
<script type="text/ecmascript-6">
    require('swiper/dist/css/swiper.css')
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
        	var validateMobile = (rule, value, callback) => {
                if (!/^1\d{10}$/.test(value)){
                    callback(new Error('手机号不正确'));
                } else {
                    callback();
                }
            }
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
            	customerSalesDistribution:'',
			    customerCustDistribution:'',
			    customerCustAverageDistribution:'',
			    customerChannelDistribution:'',  //渠道分配销售
	            customerBatchUpdate:'',  //批量修改
	            customerDuplicate:'',  //重复数据
			    salesss:{},
			    QuDaoSale:'',
            	cfMobile:'',
            	checkAll: false,
            	checkedCustservices:[],
            	 isIndeterminate: true,
            	 custServiceIds:{},
            	 salesIds:{},
            	dialogFormVisibleOne:false,
            	dialogFormVisibleMore:false,
            	dialogFormVisible:false,
            	checkTableVisible:false,
            	checkDetailsTable:[],
            	turnOutTitle:'',
            	isShowXS:'',
            	isShowKF:'',
            	isShowCS:'',
            	isShowPj:'',
            	number:'',
            	citys:[],
            	storeCitys:{},
            	changeTurnOuts:{
                	targetOperatorId1:'',
                	targetOperatorId2:'',
                	isIndeterminate3:'',
                	type:'',
                	id:'',
                	cityCode:''
                },
            	formLabelWidth:'100px',
            	formInline:{
            		mobile:'',
            		channelId:''
            	},
            	isNotQuDao:true,
            	oneImports:{
            		cityCode:'',
            		channelId:'',
            		customerName:'',
            		mobile:'',
            		tableNumber:'',
            		budget:'',
            		bookingTime:'',
            		type:'',
            		remark:'',
            	},
            	moreImports:{
            		cityCode:'',
            		channelId:'',
            		type:'',
            	},
            	cityNames:{
            		city:''
            	},
            	channelIds:{},
            	unallocatedData:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                oneImportRules:{
			          channelId: [
			            {required: true, message: '请选择来源渠道', trigger: 'change' },
			          ],
			          customerName: [
			          	{ message: '请输入客户名', trigger: 'blur' },
			          ],
			          mobile: [
			            {required: true, message: '请输入手机号码', trigger: 'blur' },
                        { max:11,message: '手机号码为11位', trigger: 'blur' },
                        { validator: validateMobile, trigger: 'blur' }
			          ],
			          tableNumber: [
			             { message: '请输入桌数', trigger: 'blur' },
			          ],
			          budget: [
			             { message: '请输入预算', trigger: 'blur' },
			          ],
			           bookingTime: [
			            { message: '请输入档期', trigger: 'blur' },
			          ],
			           remark: [
			            { message: '请输入备注', trigger: 'blur' },
			          ],
                },

                moreImportRules:{
			          channelId: [
			            { required: true, message: '请选择来源渠道', trigger: 'change' },
			          ],
			          status: [
			             {type:'number',  message: '请选择类型', trigger: 'change' }
			          ]
                },
                 fileList: [],
                 string:'',
                 uploadTemplate:'http://xitong.huashenghl.com/hsCustomerModel.xls',
                 tableDialogTitle:'',
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
                 followPagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                editableTabsValue: '1',
                formLabelWidth2:'100px',
                isEdit:false,
                dialogTableVisible:false,
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
                followDetailsTable:[],
                checkPagination:{
                	pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                tabUrl:'',
                tabData:{
                	type:''
                },
                dec:{
                	customer_status:[],
                	hs_customer_status:[],
                	operation_source:[],
                	data_type:[],
                }
            }
        },
        methods: {
        	getAllDec(){
        		this.dec.customer_status = this.dicData.CUSTOMER_STATUS
        		this.dec.hs_customer_status = this.dicData.HS_CUSTOMER_STATUS
        		this.dec.operation_source = this.dicData.HS_CUSTOMER_OPERATION_SOURCE
        		this.dec.data_type =this.dicData.HS_DATA_TYPE;
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
        	check(){
        		this.getCheckData()
        	},
        	onSubmit(){
        		this.initunallocatedData(this.tablePagination);
        	},
        	getCheckData(){
        		if(this.cfMobile == ''){
        			this.$message({
				        message: '请输入想要查重的手机号',
				        type: 'warning'
			        });
        		}
        		else{
        			if (/^1(3|4|5|7|8)\d{9}$/.test(this.cfMobile) || /^\d{4}$/.test(this.cfMobile)){
	                    this.checkTableVisible = true;
        				this.$axios.post('/customer/queryHsCustomerRepeatedList',{'pageNow':this.checkPagination.pageNow,'pageSize':this.checkPagination.pageSize,'mobile':this.cfMobile}).then((res)=>{    //获取所有手机重复数据
							if(res.data.res == 0){
								 this.checkPagination.total=res.data.msg.total;
			                     this.checkPagination.pageNum=res.data.msg.pageNum;
			                     this.checkPagination.pageSize=res.data.msg.pageSize;
							   	this.checkDetailsTable = res.data.msg.list;
							}

						})
	                } else {
	                   this.$message.error('错了哦，只允许输入11位手机号或者手机后四位');
	                }
        		}
        	},
        	checkHandleSizeChange(val){
        		this.checkPagination.pageSize = val;
        		this.getCheckData()
        	},
        	checkHandleCurrentChange(val){
        		this.checkPagination.pageNow = val;
        		this.getCheckData()
        	},
        	handleCheckAllChange(event) {  //更改总多选
        		let array = event.target.checked ? this.custServiceIds : [];

		        this.isIndeterminate = false;

		        if(event.target.checked){
		        	if(array.length){
			        	for (var i=0;i<array.length;i++){
			        		this.checkedCustservices.push(array[i].id)
			        	}
			        }
		        }
		        else{
		        	array = [];
		        	this.checkedCustservices = []
		        }
		      },
		      handleCheckedCitiesChange(value) {  //更改多选
		        let checkedCount = value.length;
		        this.checkAll = checkedCount === this.custServiceIds.length;
		        this.isIndeterminate = checkedCount > 0 && checkedCount < this.custServiceIds.length;
		      },
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                 this.initunallocatedData(this.tablePagination);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                 this.initunallocatedData(this.tablePagination);
            },
            getOpenCity(){
            	this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
					if(res2.data.res == 0){
					   	this.citys =  res2.data.msg;
	  					this.storeCitys = JSON.parse(localStorage.getItem("userInfo")).positionCitys
	  					console.log(JSON.parse(localStorage.getItem("userInfo")).positionCitys)
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
            getUserList(){
            	this.$axios.post('/s/getUserListByChannelId').then((res1)=>{    //所有销售
					if(res1.data.res == 0){
					   	this.salesss =  res1.data.msg;
					}
					else{
						alert(msg)
					}
				})
            },
            initunallocatedData(data){  //获取页面列表
            	this.loading.pageList=true
                this.$axios.post("/customer/queryNotAssignHsCustomerList",data).then((res)=>{
                    if(res.data.res==0){
                        this.pagination.total=res.data.msg.total;
	                    this.pagination.pageNum=res.data.msg.pageNum;
	                    this.pagination.pageSize=res.data.msg.pageSize;
	                    this.unallocatedData=res.data.msg.list;
	                    this.loading.pageList=false
	                    if(JSON.parse(localStorage.getItem("userInfo")).deptDetail.deptKey == 'DEPT:CHANNEL_EXTERNAL'){
			        		this.isNotQuDao = false
			        	}
			        	else{
			        		this.isNotQuDao = true
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
            assignQuDao(){
            	if(this.string == ''){
					 this.$alert('请至少选择一条客户数据', '', {
			          confirmButtonText: '确定',
			          callback: action => {

			          }
			        });
				}
				else{
						let data = {
	              			'hsCustomerIds':this.string,
				    		'assignOwner':this.QuDaoSale,
				    		'type':0
	              		}
	              		this.$axios.post('/customer/assignHsCustomer',data).then((res3)=>{
		                    if(res3.data.res == '0'){
		                    	this.$message({
									message: '操作成功！',
									type: 'success'
								});
		                    	this.QuDaoSale = ''
		                         this.initunallocatedData(this.tablePagination);
		                    }
		                    else{
		                    	this.$message.error(res3.data.msg)
		                    	return
		                    }
	                   })

				}
            },
            assign(number){  //分配，修改按钮
            	if(this.string == ''){
					 this.$alert('请至少选择一条客户数据', '', {
			          confirmButtonText: '确定',
			          callback: action => {

			          }
			        });

				}
				else{
					this.dialogFormVisible = true;
	            	this.number = number;
	            	if(number == 1){
	            		this.isShowCS = false;
	            		this.isShowKF = true;
	            		this.isShowXS = false;
	            		this.isShowPj = false;
	            	}
	            	else if(number == 2){
	            		this.isShowPj = true;
	            		this.isShowCS = false;
	            		this.isShowKF = false;
	            		this.isShowXS = false;
	            	}
	            	else{
	            		this.isShowCS = true;
	            		this.isShowKF = true;
	            		this.isShowXS = true;
	            		this.isShowPj = false;
	            		this.changeTurnOuts.cityCode = this.cityNames.city
	            	}
				}

            },
             turnOutBtn(form){  //确定分配
              	let data = {};
              	let url='';
              	if(this.number == 1){
              		data = {
              			'hsCustomerIds':this.string,
			    		'assignOwner':this.changeTurnOuts.targetOperatorId1,
			    		'type':1
              		}
              		url='/customer/assignHsCustomer'
              	}
              	else if(this.number == 2){
              		data = {
              			'hsCustomerIds':this.string,
			    		'assignOwner':this.checkedCustservices,
			    		'type':1
              		}
              		url='/customer/assignMeanHsCustomer'
              	}
              	else{
              		data = {
              			'hsCustomerIds':this.string,
			    		'cityCode':this.changeTurnOuts.cityCode,
			    		'salesId':this.changeTurnOuts.targetOperatorId1,
			    		'custServiceId':this.changeTurnOuts.targetOperatorId2
              		}
              		url='/customer/batchUpdate'
              	}
				 this.$axios.post(url,data).then((res3)=>{
                    if(res3.data.res == '0'){
                    	this.$message({
							message: '操作成功！',
							type: 'success'
						});
                    	this.cancelTurnOutBtn();
                    	this.checkedCustservices = []
                         this.initunallocatedData(this.tablePagination);
                    }
                    else{
                    	this.$message.error(res3.data.msg)
                    }
		        })

		    },
		    cancelTurnOutBtn(){  //取消分配
		    	this.$refs['changeTurnOuts'].resetFields();
		    	this.checkedCustservices = []
		    	this.dialogFormVisible = false
		    },
			batchImport(){  //批量导入按钮
				this.dialogFormVisibleMore = true;
//				 this.getSalesTemplate();
			},
			oneImport(){  //单条导入按钮
				this.dialogFormVisibleOne = true;
			},
			handleSelectionChange(val){  //列表左侧选择
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
	                this.string.substr(0,1)
                }
                console.log(this.string)
			},
			 formTime(row){
                 return formatTime(row.createTime)
              },
              cancelimportOneHandle(){  //取消单条导入
              	this.$refs['oneImports'].resetFields();
              	this.dialogFormVisibleOne = false;
              },
              importOneHandle(form){  //确定单条导入
              	this.oneImports.cityCode = this.cityNames.city;
              	if(this.isNotQuDao){
              		this.$refs[form].validate((valid) => {
			          if (valid) {
			              	this.$axios.put('/customer/saveHsCustomer',this.oneImports).then((res2)=>{

								  console.log(res2)
			                    if(res2.data.res == '0' && res2.data.msg != '数据重复'){
			                    	this.initunallocatedData(this.tablePagination)
			                    	this.cancelimportOneHandle()
			                        this.$message({
							        message: '恭喜你，添加成功',
							        type: 'success'
							        });
			                    }
			                    else{
			                    	 this.$message.error(res2.data.msg);
			                    	 return false;
			                    }
					        })
			          } else {
			            this.$message.error('请填写必要信息!!');
			            return false;
			          }
			        });
              	}
              	else{
              		this.oneImports.channelId = JSON.parse(localStorage.getItem("userInfo")).id
              		if(this.oneImports.type == '' && this.oneImports.type !='0'){
              			this.$message.error('类型不能为空');
              			return false;
              		}
              		else{
              			this.$axios.put('/customer/saveHsCustomer',this.oneImports).then((res3)=>{
				            if(res3.data.res == '0'){
				                this.initunallocatedData(this.tablePagination)
				                this.cancelimportOneHandle()
				                this.$message({
								    message: '恭喜你，添加成功',
								    type: 'success'
								});
				            }
				            else{
				                this.$message.error(res3.data.msg);
				                return false;
				            }
						})
              		}

              	}


              },
              cancelimportMoreHandle(){  //取消批量导入
              	this.$refs['moreImports'].resetFields();
              	this.dialogFormVisibleMore = false;
              	this.$refs.upload.clearFiles();
              },
              importMoreHandle(){  //确定批量导入
              	this.$loading({text:'拼命加载中'})
              	if(this.customerSalesDistribution){
              		if(this.$refs['upload'].uploadFiles.length){
	                    this.$refs.upload.submit();
	                    this.initunallocatedData(this.tablePagination)
              		}
              		else{
              			this.$message.error('请选择上传文件');
              		}
              	}
              	else{
              		if(this.$refs['upload'].uploadFiles.length){
	                    this.$refs['moreImports'].validate((valid) => {
	                        if (valid) {
	                            this.$refs.upload.submit();
	                            this.initunallocatedData(this.tablePagination)
	                        }
	                        else{
	                        	this.$message.error('请填写必要信息');
	                        }
	                    });
	                }else{
	                    this.$message.error('请选择上传文件');
	                }
              	}


              },
              uploadFileError(err, file, fileList){
              	this.$loading().close()
              	this.$message.error(err.msg)
                return false;
              },
              uploadFileSuccess(response, file, fileList){
              	this.$loading().close()
              	if(response.res=='0'){
              		this.initunallocatedData(this.tablePagination);
              		 this.$refs.upload.clearFiles();
              		 this.cancelimportMoreHandle()
              	}
              	else{
              		 this.$message.error(response.msg)
                     return false;
              	}
              },
              getSalesTemplate(){  //获取模板下载链接
                this.$axios.get('/s/getSalesTemplate').then((res)=>{
                   if(res.data.res==0){
                       this.uploadTemplate=res.data.msg
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
            changeCityVisible(){
            	this.isChangeCity = true
            },
            changeCity(){
              	this.$axios.post('/s/getSalesListByUser',{'cityCode':this.cityNames.city}).then((res4)=>{    //获取所有销售
					if(res4.data.res == '0'){
								this.salesIds = res4.data.msg;
						}
	                })
	                let cusUrl=''
	                let newData = {}
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
							console.log(0)
							console.log(this.custServiceIds.length)
						}
	                })
                    this.$axios.post('/s/getChannelList',{'cityCode':this.cityNames.city}).then((res3)=>{
                        if(res3.data.res == '0'){
                         		this.channelIds = res3.data.msg;
                         	}
		             	})
		        if(this.isChangeCity){
		        	this.initunallocatedData(this.tablePagination);
		        	this.isChangeCity = false
		        }
            },
            followHandleSizeChange(val){
		    	this.followPagination.pageSize=val;
		    	this.getTabData();
		    },
		    followHandleCurrentChange(val){
		    	this.followPagination.pageNow=val;
		    	this.getTabData();
		    },
		     handleClick(tab, event) {
		        console.log(tab.name);
		        this.editableTabsValue = tab.name;
		        this.getTabData();

		    },

		    getTabData(){
		    	let self = this;
		    	if(self.editableTabsValue == 1){
            		self.tabData.type = ''
            	}else if(self.editableTabsValue == 2){
            		self.tabData.type = 1
            	}else if(self.editableTabsValue == 3){
            		self.tabData.type = 0
            	}
		    	self.$axios({
	                url: "/customer/getHsCustomerOperationList?pageNow="+self.followPagination.pageNow+'&pageSize='+self.followPagination.pageSize+'&hsCustomerId='+self.unallocatedData[self.indexs].id+'&type='+self.tabData.type,
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

	                  	    console.log(res)
							self.followDetailsTable = res.data.msg.list;
							var audio = document.getElementsByTagName('audio')
			                for(var i=0;i<audio.length;i++){
			                    audio[i].load()
			                }
		  					res.data.msg.list.forEach((e)=>{
		  						self.dec.operation_source.forEach((n)=>{
				                    if( n.dicValue==e.type){
				                        e.operator=n.dicDesc
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
		    guanbiBox(){
		    	this.dialogTableVisible = false;
		    	this.isEdit = false;
		    },
		    followUpDetails(index, row , number){  //手机号按钮
				this.indexs = index;
				this.rows = row;
				if(number == 1){
					this.dialogTableVisible = true
				}
				else{
					this.dialogTableVisible1 = true;
				}
		    	this.changeStatus.customerName = this.unallocatedData[index].customerName;
		    	this.changeStatus.mobile = this.unallocatedData[index].mobile;
		    	this.changeStatus.budget = this.unallocatedData[index].budget;
		    	this.changeStatus.tableNumber = this.unallocatedData[index].tableNumber;
		    	this.changeStatus.bookingTime = this.unallocatedData[index].bookingTime;
		    	this.changeStatus.DataRemark = this.unallocatedData[index].remark;

		    	this.changeStatus.id = this.unallocatedData[index].id;
		    	this.citys.forEach((n)=>{
			        if( n.cityCode==this.unallocatedData[index].cityCode){
			            this.changeStatus.cityName = n.cityName
			        }

			    })

		    	this.getTabData();

		    },
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
            }
        },
        mounted(){
        	this.getAllDec()
        	this.getOpenCity()
        	this.getUserList()
            this.getQiNiuUrlUsingGET()
            this.cityNames.city = JSON.parse(localStorage.getItem("userInfo")).positionCitys[0].cityCode
            this.initunallocatedData(this.tablePagination);
            this.customerSalesDistribution = filterBtnPms(this.btnAllPms.customerSalesDistribution)  //分销售
			this.customerCustDistribution = filterBtnPms(this.btnAllPms.customerCustDistribution)  //分客服
			this.customerCustAverageDistribution = filterBtnPms(this.btnAllPms.customerCustAverageDistribution) //平均分客服
			this.customerChannelDistribution = filterBtnPms(this.btnAllPms.customerChannelDistribution) //渠道分配销售
            this.customerBatchUpdate = filterBtnPms(this.btnAllPms.customerBatchUpdate)  //批量修改
            this.customerDuplicate = filterBtnPms(this.btnAllPms.customerDuplicate)  //重复数据
        },
        computed:{
            tablePagination(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize,"mobile":this.formInline.mobile,"channelId":this.formInline.channelId, 'cityCode':this.cityNames.city}
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


    .formRightBtn{
    	float:right
    }
    .message{
    	color:red;
    	line-height:20px;
    }
    .message span{
    	text-decoration: underline;
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
    .mobile{
    	padding-bottom:10px;
    	margin-bottom:10px;
    	border-bottom:2px solid #eef1f6;
    }
</style>
