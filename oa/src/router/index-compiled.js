import Vue from 'vue';
import Router from 'vue-router';

var Login = function Login(resolve) {
    return require(['../components/page/Login.vue'], resolve);
};

var Readme = function Readme(resolve) {
    return require(['../components/common/Home.vue'], resolve);
};

//用户管理
var UserUser = function UserUser(resolve) {
    return require(['../components/page/system/UserUser.vue'], resolve);
};

var ResourcePage = function ResourcePage(resolve) {
    return require(['../components/page/system/ResourcePage.vue'], resolve);
};

var RolePageUI = function RolePageUI(resolve) {
    return require(['../components/page/system/RolePageUI.vue'], resolve);
};

var DeptDept = function DeptDept(resolve) {
    return require(['../components/page/system/DeptDept.vue'], resolve);
};

var PositionPosition = function PositionPosition(resolve) {
    return require(['../components/page/system/PositionPosition.vue'], resolve);
};

var SysShowDic = function SysShowDic(resolve) {
    return require(['../components/page/system/SysShowDic.vue'], resolve);
};


/**
 * 
 * 2019年2月22Smile写
 * 系统管理中添加新模块菜单
 */

var ChannelDate = function ChannelDate(resolve) {
    return require(['../components/page/system/ChannelDate.vue'], resolve);
};

//app管理
var appVerMag = function appVerMag(resolve) {
    return require(['../components/page/app/appVerMag.vue'], resolve);
};

//门店管理
var company = function company(resolve) {
    return require(['../components/page/store/company.vue'], resolve);
};
var city = function city(resolve) {
    return require(['../components/page/store/sysCityMgr.vue'], resolve);
};
var banquet = function banquet(resolve) {
    return require(['../components/page/store/banquet.vue'], resolve);
};
var calendar = function calendar(resolve) {
    return require(['../components/page/store/calendar.vue'], resolve);
};
var store = function store(resolve) {
    return require(['../components/page/store/store.vue'], resolve);
};

//BD数据管理

var saleData = function saleData(resolve) {
    return require(['../components/page/sales/saleData.vue'], resolve);
};
var interview = function interview(resolve) {
    return require(['../components/page/sales/interview.vue'], resolve);
};
var BDData = function BDData(resolve) {
    return require(['../components/page/sales/BDData.vue'], resolve);
};
var BDsalesList = function BDsalesList(resolve) {
    return require(['../components/page/sales/BDsalesList.vue'], resolve);
};
var followUp = function followUp(resolve) {
    return require(['../components/page/sales/followUp.vue'], resolve);
};
var weddingSales = function weddingSales(resolve) {
    return require(['../components/page/sales/weddingSales.vue'], resolve);
};

//客户管理
var unallocated = function unallocated(resolve) {
    return require(['../components/page/customer/unallocated.vue'], resolve);
};
var allCustomer = function allCustomer(resolve) {
    return require(['../components/page/customer/allCustomer.vue'], resolve);
};
var myTask = function myTask(resolve) {
    return require(['../components/page/customer/myTask.vue'], resolve);
};
var invalidData = function invalidData(resolve) {
    return require(['../components/page/customer/invalidData.vue'], resolve);
};
var customerService = function customerService(resolve) {
    return require(['../components/page/customer/customerServiceMag.vue'], resolve);
};
var duplicateData = function duplicateData(resolve) {
    return require(['../components/page/customer/duplicateDataList.vue'], resolve);
};

//顾问管理
var advisor = function advisor(resolve) {
    return require(['../components/page/advisor/advisor.vue'], resolve);
};
var advisorLocation = function advisorLocation(resolve) {
    return require(['../components/page/advisor/advisorLocation.vue'], resolve);
};

//用户管理
var relation = function relation(resolve) {
    return require(['../components/page/user/relation.vue'], resolve);
};

//素材管理
var errLogList = function errLogList(resolve) {
    return require(['../components/page/materials/errLogList.vue'], resolve);
};
var logList = function logList(resolve) {
    return require(['../components/page/materials/logList.vue'], resolve);
};
var record = function record(resolve) {
    return require(['../components/page/materials/record.vue'], resolve);
};

//订单管理
var paperReceipt = function paperReceipt(resolve) {
    return require(['../components/page/order/paperReceipt.vue'], resolve);
};
var Allorder = function Allorder(resolve) {
    return require(['../components/page/order/Allorder.vue'], resolve);
};
var paymentModeList = function paymentModeList(resolve) {
    return require(['../components/page/order/paymentModeList.vue'], resolve);
};
var createNewOrder = function createNewOrder(resolve) {
    return require(['../components/page/order/createNewOrder.vue'], resolve);
};
var cancelOrder = function cancelOrder(resolve) {
    return require(['../components/page/order/cancelOrder.vue'], resolve);
};
var notAssignedOrder = function notAssignedOrder(resolve) {
    return require(['../components/page/order/notAssignedOrder.vue'], resolve);
};
var assignedOrder = function assignedOrder(resolve) {
    return require(['../components/page/order/assignedOrder.vue'], resolve);
};
var agreementList = function agreementList(resolve) {
    return require(['../components/page/order/agreementList.vue'], resolve);
};
var needReceivablesList = function needReceivablesList(resolve) {
    return require(['../components/page/order/needReceivablesList.vue'], resolve);
};
var receivablesConfirmList = function receivablesConfirmList(resolve) {
    return require(['../components/page/order/receivablesConfirmList.vue'], resolve);
};
var agreementAuditList = function agreementAuditList(resolve) {
    return require(['../components/page/order/agreementAuditList.vue'], resolve);
};
var CommissionContractMgr = function CommissionContractMgr(resolve) {
    return require(['../components/page/order/CommissionContractMgr.vue'], resolve);
};
var myOrder = function myOrder(resolve) {
    return require(['../components/page/order/myOrder.vue'], resolve);
};
var finalCirformAudit = function finalCirformAudit(resolve) {
    return require(['../components/page/order/finalCirformAudit.vue'], resolve);
};

//档期管理
var scheduleView = function scheduleView(resolve) {
    return require(['../components/page/schedule/scheduleView.vue'], resolve);
};
var maySignTheBill = function maySignTheBill(resolve) {
    return require(['../components/page/schedule/maySignTheBill.vue'], resolve);
};

//数据管理
var saleFollowUp = function saleFollowUp(resolve) {
    return require(['../components/page/data/salesFollowUp.vue'], resolve);
};
var channel = function channel(resolve) {
    return require(['../components/page/data/channel.vue'], resolve);
};
var statisticsCityDateList = function statisticsCityDateList(resolve) {
    return require(['../components/page/data/statisticsCityDateList.vue'], resolve);
};
var consultationList = function consultationList(resolve) {
    return require(['../components/page/data/consultationList.vue'], resolve);
};
var CustomerStatistics = function CustomerStatistics(resolve) {
    return require(['../components/page/data/CustomerStatistics.vue'], resolve);
};
var channelCustomerList = function channelCustomerList(resolve) {
    return require(['../components/page/data/channelCustomerList.vue'], resolve);
};

//结算管理
var appSettleAccounts = function appSettleAccounts(resolve) {
    return require(['../components/page/receivable/appSettleAccounts.vue'], resolve);
};
// const OclockSettlement=resolve => require(['../components/page/receivable/OclockSettlement.vue'], resolve);


Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if hidden:true will not show in the sidebar
 * redirect : if redirect:noredirect will not redirct in the levelbar
 * noDropdown : if noDropdown:true will not has submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export var constantRouterMap = [{ path: '/login', component: Login, hidden: true }, { path: '/', redirect: '/login' }, { path: '/readme', component: Readme, hidden: true, meta: { allowBack: false } }];
export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: function scrollBehavior() {
        return { y: 0 };
    },
    routes: constantRouterMap
});

export var asyncRouterMap = [{
    path: '/system',
    component: Readme,
    icon: "#icon-xitong",
    name: '系统管理',
    meta: { role: ['system:system'] },
    children: [{ path: 'UserUser', component: UserUser, name: '用户管理', meta: { role: ['system:user'] } }, { path: 'ResourcePage', component: ResourcePage, name: '资源管理', meta: { role: ['system:recourse'] } }, { path: 'RolePageUI', component: RolePageUI, name: '角色管理', meta: { role: ['system:role'] } }, { path: 'DeptDept', component: DeptDept, name: '部门管理', meta: { role: ['system:dept'] } }, { path: 'PositionPosition', component: PositionPosition, name: '岗位管理', meta: { role: ['system:position'] } }, { path: 'SysShowDic', component: SysShowDic, name: '数字字典管理', meta: { role: ['system:dic'] } }, { path: 'ChannelDate', component: ChannelDate, name: '渠道来源管理', meta: { role: ['system:channel'] } }]
}, {
    path: '/app',
    component: Readme,
    icon: "#icon-APP",
    name: 'App管理',
    meta: { role: ['app:app'] },
    children: [{ path: 'appVerMag', component: appVerMag, name: 'App版本管理', meta: { role: ['app:appversion'] } }]
}, {
    path: '/store',
    component: Readme,
    icon: "#icon-mendian",
    name: '门店管理',
    meta: { role: ['store:store'] },
    children: [{ path: 'company', component: company, name: '公司信息管理', meta: { role: ['store:company'] } }, { path: 'city', component: city, name: '城市管理', meta: { role: ['store:city'] } }, { path: 'banquet', component: banquet, name: '宴会厅管理', meta: { role: ['store:banquet'] } }, { path: 'calendar', component: calendar, name: '吉日查询', meta: { role: ['store:Calendar'] } }, { path: 'store', component: store, name: '门店管理', meta: { role: ['store:storeMgr'] } }]
}, {
    path: '/sales',
    component: Readme,
    icon: "#icon-shuju",
    name: 'BD数据管理',
    meta: { role: ['bd:bd'] },
    children: [{ path: 'saleData', component: saleData, name: '销售管理', meta: { role: ['bd:sales'] } }, { path: 'interview', component: interview, name: '面谈统计', meta: { role: ['bd:interviewCount'] } }, { path: 'followUp', component: followUp, name: '跟进统计', meta: { role: ['bd:followup'] } }, { path: 'weddingSales', component: weddingSales, name: '销售统计', meta: { role: ['bd:salesCount'] } }, { path: 'BDsalesList', component: BDsalesList, name: 'BD销售数据统计', meta: { role: ['bd:bdSalesDataCount'] } }, { path: 'BDData', component: BDData, name: 'BD销售统计', meta: { role: ['bd:bdDataCount'] } }]
}, {
    path: '/data',
    component: Readme,
    icon: "#icon-shuju1",
    name: '数据管理',
    meta: { role: ['data:data'] },
    children: [{ path: 'saleFollowUp', component: saleFollowUp, name: '销售跟进统计', meta: { role: ['data:saleFollowUp'] } }, { path: 'channel', component: channel, name: '渠道统计报表', meta: { role: ['data:channel'] } }, { path: 'statisticsCityDateList', component: statisticsCityDateList, name: '城市统计报表', meta: { role: ['data:statisticsCityDateList'] } }, { path: 'consultationList', component: consultationList, name: '客服数据统计', meta: { role: ['data:consultationList'] } }, { path: 'CustomerStatisticst', component: CustomerStatistics, name: '客户数据统计', meta: { role: ['data:CustomerStatistics'] } }, { path: 'channelCustomerList', component: channelCustomerList, name: '渠道客户数据', meta: { role: ['data:channelCustomerList'] } }]
}, {
    path: '/customer',
    component: Readme,
    icon: "#icon-kehu",
    name: '客户管理',
    meta: { role: ['customer:customer'] },
    children: [{ path: 'unallocated', component: unallocated, name: '未分配数据', meta: { role: ['customer:unallocated'] } }, { path: 'allCustomer', component: allCustomer, name: '全部客户', meta: { role: ['customer:allCustomer'] } }, { path: 'myTask', component: myTask, name: '我的任务', meta: { role: ['customer:myTask'] } }, { path: 'invalidData', component: invalidData, name: '无效数据确认', meta: { role: ['customer:InvalidData:confirm'] } }, { path: 'customerService', component: customerService, name: '客服管理', meta: { role: ['customer:service'] } }, { path: 'duplicateData', component: duplicateData, name: '重复数据', meta: { role: ['customer:duplicate'] } }]
}, {
    path: '/advisor',
    component: Readme,
    icon: "#icon-edit",
    name: '顾问管理',
    meta: { role: ['newAder:newAder'] },
    children: [{ path: 'advisor', component: advisor, name: '顾问管理', meta: { role: ['newAder:newAderControl'] } }, { path: 'adLoctionList', component: advisorLocation, name: '定位日志', meta: { role: ['adLocList:adLocList'] } }]
}, {
    path: '/user',
    component: Readme,
    icon: "#icon-yonghu1",
    name: '用户管理',
    meta: { role: ['user:control'] },
    children: [{ path: 'relation', component: relation, name: '用户关系', meta: { role: ['user:relation'] } }]
}, {
    path: '/materials',
    component: Readme,
    icon: "#icon-sucai",
    name: '素材管理',
    meta: { role: ['materials:materials'] },
    children: [{ path: 'errLogList', component: errLogList, name: '录音文件错误日志', meta: { role: ['materials:errLogList'] } }, { path: 'record', component: record, name: '录音文件管理', meta: { role: ['materials:record'] } }, { path: 'logList', component: logList, name: '录音文件日志', meta: { role: ['materials:logList'] } }]
}, {
    path: '/order',
    component: Readme,
    icon: "#icon-dan",
    name: '订单管理',
    meta: { role: ['order:order'] },
    children: [{ path: 'paperReceipt', component: paperReceipt, name: '纸质收据管理', meta: { role: ['order:paperReceipt'] } }, { path: 'Allorder', component: Allorder, name: '全部订单', meta: { role: ['order:Allorder'] } }, { path: 'paymentModeList', component: paymentModeList, name: '付款方式管理', meta: { role: ['order:paymentModeList'] } }, { path: 'cancelOrder', component: cancelOrder, name: '合同取消变更申请', meta: { role: ['order:orderChannel'] } }, { path: 'notAssignedOrder', component: notAssignedOrder, name: '待分配合同订单', meta: { role: ['order:notAssignedOrder'] } }, { path: 'assignedOrder', component: assignedOrder, name: '已分配合同订单', meta: { role: ['order:assignedOrder'] } }, { path: 'agreementList', component: agreementList, name: '合同订单', meta: { role: ['order:agreementList'] } }, { path: 'needReceivablesList', component: needReceivablesList, name: '待收款列表', meta: { role: ['order:needReceivablesList'] } }, { path: 'receivablesConfirmList', component: receivablesConfirmList, name: '待确认收款列表', meta: { role: ['order:receivablesConfirmList'] } }, { path: 'agreementAuditList', component: agreementAuditList, name: '合同待审核列表', meta: { role: ['order:agreementAuditList'] } }, { path: 'CommissionContractMgr', component: CommissionContractMgr, name: '返佣合同管理', meta: { role: ['order:CommissionContractMgr'] } }, { path: 'myOrder', component: myOrder, name: '我的订单(策划师)', meta: { role: ['order:myOrder'] } }, { path: 'finalCirformAudit', component: finalCirformAudit, name: '最终确认单审核', meta: { role: ['order:finalCirformAudit'] } }]
}, {
    path: '/schedule',
    component: Readme,
    icon: "#icon-Shape",
    name: '档期管理',
    meta: { role: ['schedule:schedule'] },
    children: [{ path: 'scheduleView', component: scheduleView, name: '档期查看', meta: { role: ['schedule:scheduleView'] } }, { path: 'maySignTheBill', component: maySignTheBill, name: '我的签单', meta: { role: ['schedule:maySignTheBill'] } }]
}, {
    path: '/receivable',
    component: Readme,
    icon: "#icon-shoukuan",
    name: '收款管理',
    meta: { role: ['receivable:receivable'] },
    children: [{ path: 'appSettleAccounts', component: appSettleAccounts, name: '结婚圈结算', meta: { role: ['receivable:appSettleAccounts'] } }]
}];

//# sourceMappingURL=index-compiled.js.map