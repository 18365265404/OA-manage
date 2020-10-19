/**
 * Created by User on 2017/7/31.
 */
import { asyncRouterMap, constantRouterMap } from 'src/router';


 function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone');
    }
    const targetObj = source.constructor === Array ? [] : {};
    for (const keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(source[keys]);
            } else {
                targetObj[keys] = source[keys];
            }
        }
    }
    return targetObj;
}


/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true
        }
        return false
    })
    return accessedRouters
}


const permission = {
    state: {
        routers: constantRouterMap,//默认路由
        addRouters: [],//权限加载路由
        allPermission:[],//权限加载按钮
        btnAllPms:{ //用户按钮权限总表
            //客户管理-我的任务
            customerCompletingVisit:'customer:myTask:complete:visit',//完成回访
            customerTurnValid:'customer:myTask:turn:valid',//转有效
            customerProcessInvalid:'customer:myTask:process:invalid',//处理无效数据
            customerVip:'customer:myTask:vip',//标记vip
            customerPushBrand:'customer:myTask:push:brand',//推送商家
            customerAddRemark:'customer:myTask:add:remark',//新增客户备注
            customerPuahHlr:'customer:myTask:push:hlr',//推送婚礼人
            customerAddNewplan:'customer:myTask:add:newplan',//新增客户计划
            customerAssign:'customer:myTask:assign',//客户数据分配
            customerModifyStatus:'customer:myTask:modify:status',//客户数据更改状态
            customerApplyVisit:'customer:myTask:apply:visit',//申请回访
            customerConfirmInvalid:'customer:myTask:confirm:invalid', //确认无效
            customerVisiting:'customer:myTask:visiting:visit', //回访中
            customerAdvanceFinish:'customer:myTask:turn:advanceFinish',  //提前完成

            //客户管理-全部客户
            customerSalesOut:'customer:allCustomer:sales:out',  //转销售---
            customerCustOut:'customer:allCustomer:cust:out',  //转客服---
            allCustomerVip:'customer:allCustomer:vip',//标记vip
            ByCustService:'allCustomer:ByCustService',//根据客服查询

            //未分配数据
            customerSalesDistribution:'customer:unallocated:channel_assign:cust',  //分销售
            customerCustDistribution:'customer:unallocated:appoint_assign:cust',  //分客服
            customerCustAverageDistribution:'customer:unallocated:avg_assign:cust',  //平均分客服
            customerChannelDistribution:'customer:unallocated:channel_assign:cust',  //渠道分配销售
            customerBatchUpdate:'customer:unallocated:batch:update',  //批量修改
            customerDuplicate:'customer:unallocated:duplicate',  //重复数据

            //无效数据确认
            invalidDataConfirm:'customer:InvalidData:confirm',  //无效数据确认
            invalidDataBatchConfirm:'customer:InvalidData:batchConfirm',  //批量确认无效
            invalidDataTurnEffective:'customer:InvalidData:turnEffective',  //转有效

            //BD销售管理
            salesSaleDataControl: "sales:saleData:followUpControl",//处理和跟进

            //订单
            //全部订单
            allOrderApplyOrder: "order:applyOrder",  //申请订单  1
            allOrderApplyAgreement: "order:applyAgreement",  //申请合同  1
            allOrderChangeOrder: "order:change",  //变更合同  1
            allOrderApplyOrderSchedule: "order:applySchedule",  //申请档期  1
            allOrderSupplementReceipt: "order:receipt",  //补开收据  1
            allOrderCanelOrder: "order:canelOrder",  //取消订单  1
            allOrderEditOrder: "order:editOrder",  //编辑合同  1
            allOrderchangeSchdule: "order:changeSchedule",  //修改档期  1
            allOrderApprovalStatus: "order:approvalStatus",  //审批状态  1
            allOrderReceiptByHand: "order:receiptByHand",  //手工开收据  1
            allOrderAuditRecord: "order:auditRecord",  //审核记录  1
            allOrderTurnOutSale: "order:turnoutSale",  //转出销售  1
            //付款方式管理
            resourcePageDisabled: "resourcePage:resourcePageDisabled",  //禁用  1
            resourcePageCreate: "resourcePage:resourcePageCreate",  //新增付款方式  1
            resourcePageEdit: "resourcePage:resourcePageEdit",  //编辑  1
            //合同取消变更申请
            cancelOrderShowOrderDetails: "cancelOrder:cancelOrderShowOrderDetails",  //查看详情  1
            cancelOrderApplyReview: "order:review",  //申请项目审核
            cancelOrderChangeMoney: "order:updateAmount",  //修改退款金额

            //待收款列表
            needReceivablesReceipt: "order:operreceipt",  //开收据  1
            needReceivablesReceiptPrint: "order:print",  //打印收据  1
            needReceivablesCancelContract: "order:financeCancel",  //撤销合同  1
            needReceivablesExcel: "order:excel",  // 导出待收款Excel  1
            needReceivablesShowMoneyDetails: "needReceivables:showMoneyDetails",  //财务详情  1
            needReceivablesAuditRecord:'needReceivables:showAuditRecord',//变更详情
            //待确认收款
            receivableExport: "receivable:receivableExport",  //导出excel  (已有)
            receivableConfirm: "order:confirm",  //确认  （已有）
            receivablePrintAndShow: "order:receivable:printAndShow",  //打印预览
            receivableShowDetails: "order:receivable:showDetails",  //查看详情

            //我的订单策划师
            myOrderChangeEO:"order:myOrder:changeEO",  //查看EO单
            myOrderEditEO:"order:myOrder:editEO",  //编辑EO单
            myOrderAddFinalForm:"order:myOrder:addFinalForm",  //最终确认单添加
            myOrderShowFinal:"order:myOrder:showFinal",  //查看最终报价单
            myOrderPrint:"order:myOrder:print",  //打印



            //纸质收据管理
            paperReceiptCreate:"order:paperReceipt:createNewpaper", //新建纸质收据
            //待分配合同订单
            notAssignedAssign:"order:asdistribution", //分配（已有）
            notAssignedShowDetails:"order:resourcePage:showDetails", //查看详情
            //已分配合同订单
            assignedOrderSecondAssign:"order:distribution", //重新分配（已有）
            assignedOrdershowDetails:"order:assignedOrder:showDetails", //查看详情
            //合同订单
            agreementListExcel:"order:agreementList:excel", //导出excel
            //合同待审核
            agreementAudShowDetails:"order:agreementAud:showDetails", //查看详情
            agreementAudShowMoneyDetails:"order:agreementAud:showMoneyDetails", //查看财务详情
            agreementAudExamine:"order:agreementAud:examine", //审核
            //返佣合同管理
            commissionShowDetails:"order:Commission:showDetails",//查看详情
            commissionShowMoneyDetails:"order:Commission:showMoneyDetails",//查看财务详情
            commissionUploadMoney:"order:Commission:uploadMoney",//上传菜金/查看






            ////顾问管理
            //顾问列表
            newAderControlAssign:"newAder:newAderControl:assign",//分配顾问
            newAderControlAdd:"newAder:newAderControl:add",//添加顾问
            newAderControlAddoffine:"newAder:newAderControl:addoffine",// 增加下线
            newAderControlEdit:'newAder:newAderControl:edit',//修改

            ////门店管理
            //公司信息管理
            storeCompanyAdd:"store:companyAdd",//新增公司信息
            storeCompanyLocked:'store:companyLocked',//锁定
            storeCompanyUnlocked:"store:companyUnlocked",//解锁

            //门店管理
            storeStoreMgrEnable:"store:storeMgrEnable",//启用
            storeStoreMgrEdit:"store:storeMgrEdit",//修改门店
            storeStoreMgrAdd:"store:storeMgrAdd",//添加门店
            storeStoreMgrDisable:'store:storeMgrDisable',//禁用

            //宴会厅管理
            storeBanquetEdit:'store:banquetEdit',//修改宴会厅
            storeBanquetAdd:'store:banquetAdd',//新增宴会厅
            storeBanquetDisable:'store:banquetDisable',//禁用
            storeBanquetEnable:'store:banquetEnable',//启用

            //城市管理
            storeCityOpen: 'store:cityOpen',//开通新城市
            storeCityDel: 'store:cityDel',//删除
            storeCityEdit: 'store:cityEdit',//修改


            //app管理
            appVersionAdd:'app:appVersionAdd',//添加新版本
            appVersionDel:'app:appVersionDel',//删除版本

            //用户关系管理
            relationApply:'user:relation:apply',//关系申请
            relationReview:'user:relation:review',//关系审核,
            relationRemoveBinding:'user:relation:removeBinding',//解除绑定

            ////收款管理
            //结婚圈结算
            appSettleAccountsAdvanceDetails:'receivable:appSettleAccounts:AdvanceDetails',//本次预支详情
            appSettleAccountsCommissionDetails:'receivable:appSettleAccounts:CommissionDetails',//佣金详情
            appSettleAccountsConfirm:'receivable:appSettleAccounts:confirm',//确认结算


            ////BD数据管理
            //销售管理
            salesOperatingStatus:'bd:salesOperatingStatus',//操作状态处理
            salesAdd:'bd:salesAdd',//录入销售
            salesBatchAdd:'bd:salesBatchAdd',//批量录入销售
            salesUpdateBDDataCount:'bd:salesUpdateBDDataCount',//更新BD数据总量
            salesAssign:'bd:salesAssign',//分配BD
            salesCheck:'bd:salesCheck',//核查(确认有效/确认无效)
            salesFollowStatus:'bd:salesFollowStatus',//跟进状态处理
            //跟进统计
            followupCountDetails:'bd:followupCountDetails',//跟进统计详情
            //销售统计
            salesCountDetails:'bd:salesCountDetails',//销售统计详情
            //面谈统计
            interviewCountDetails:'bd:interviewCountDetails',//面谈统计详情

            ////系统管理
            //部门管理
            deptAdd:'system:deptAdd',//新增部门
            deptAuthorization:'system:deptAuthorization',//部门授权
            // 岗位管理
            positionAdd:'system:positionAdd',//新增岗位
            positionAuthorization:'system:positionAuthorization',// 岗位授权
            positionBusinessRule:'system:positionBusinessRule',//业务规则
            // 用户管理
            userAdd:'system:userAdd',// 新增用户
            userLocked:'system:userLocked',//锁定用户
            userUnlocked:'system:userUnlocked',// 解锁用户
            userResetpassword:'system:userResetpassword',//重置密码
            // 角色管理
            roleAdd:'system:roleAdd',// 新增角色
            roleAuthorization:'system:roleAuthorization',//角色授权
            // 资源管理
            recourseAdd:'system:recourseAdd'// 新增资源
        }
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = deepClone(routers)
            state.routers = deepClone(constantRouterMap.concat(routers))
        },
        SET_AllPermission:(state,data)=>{
          state.allPermission= data;
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                let accessedRouters
                if (roles.indexOf('admin') >= 0) {
                    accessedRouters = asyncRouterMap
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
                }
                commit('SET_ROUTERS', accessedRouters);
                resolve();
            })
        },
        //拉取用户所有按钮权限
        setAllPermission({commit},data){
            console.log(data)
            commit('SET_AllPermission', data);
}
    }
};

export default permission;
