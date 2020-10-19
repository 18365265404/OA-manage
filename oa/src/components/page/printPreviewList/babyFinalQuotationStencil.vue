<template>
	<div>
		<div class="wrap babyFinalQuo" id="print">
			<p class="top_title" style="margin-left: 0;text-align: center">宝宝宴最终报价单</p>
			<table class="table1" width="100%" cellspacing="0" cellpadding="0" id="table1">
				<tr class='blackBottom '>
					<td class="boldText">合同号</td>
					<td colspan="3" id="agreementNo"></td>
				</tr>
				<tr class='blackBorder'>
					<td class="boldText">甲方</td>
					<td id="partyA" colspan="3"></td>
					<td class="boldText">门店</td>
					<td id="storeName" colspan="3"></td>
				</tr>
				<tr class='blackBorder '>
					<td class="boldText">联系人</td>
					<td id="partyAContacts" colspan="3"></td>
					<td class="boldText">宴会厅</td>
					<td id="hallName" colspan="3"></td>

				</tr>
				<tr class='blackBorder '>

					<td class="boldText">档期</td>
					<td id="scheduleTime"></td>
					<td class="boldText">桌数</td>
					<td id="tableNumber"></td>
					<td class="boldText">套系</td>
					<td colspan="3" id="packageName"></td>
				</tr>
				<tr class='blackBorder '>
					<td colspan="8"></td>
				</tr>
				<tr class='blackBorder '>
					<td class="boldText">序号</td>
					<td class="boldText">类别</td>
					<td colspan="3" class="boldText">内容</td>
					<td class="boldText">单价</td>
					<td class="boldText">数量</td>
					<td class="boldText">金额</td>
				</tr>

				<tr class='blackBorder '>
					<td class="boldText">小计</td>
					<td colspan="7" id="subtotal"></td>
				</tr>
				<tr class='blackBorder'>
					<td class='centerText boldText' colspan="4">原始合同金额</td>
					<td colspan="4" id="totalAmount"></td>
				</tr>
				<tr class='blackBorder '>
					<td class='centerText boldText' colspan="4">最终结算金额</td>
					<td colspan="4" id="finalAmount"></td>
				</tr>
				<tr class='blackBorder '>
					<td class='centerText boldText' colspan="4">已付金额</td>
					<td colspan="4" id="unconfirmedAmount"></td>
				</tr>
				<tr class='blackBorder '>
					<td class='centerText boldText' colspan="4">最终款项收取</td>
					<td colspan="4" id="finalConfirmedAmunt"></td>
				</tr>
				<tr class='blackBottom'>
					<td>客户</td>
					<td></td>
					<td>制单</td>
					<td id="plannerName"></td>
					<td>财务</td>
					<td></td>
					<td>日期</td>
					<td id="presentTime"></td>
				</tr>

			</table>
		</div>

	</div>
</template>
<script type="text/ecmascript-6">
    import moment from 'moment'
    import $ from 'jQuery'
    require("../../../utils/jquery.jqprint-0.3");
    export default {
        props:{
            hsOrderId:{
                type:String
            },
            isPrintPage:{
                type:Boolean
            }
        },
        computed:{
            id(){
                return {
                    "hsOrderId":this.hsOrderId
                }
            },
            PrintPage(){
                return this.isPrintPage

            }
        },
        methods:{
            initData(){
                this.$axios.post('/order/getHsAgreementDetailsPrint',this.id).then((res)=> {  //获取所有套系
                    if(res.data.res == '0') {
                        //最终报价单详细信息
                        finalQuotationVo = res.data.msg;
                        //最终报价单列表
                        finalQuotationList = finalQuotationVo.finalQuotationList;
                        //优惠
                        hsAgrPackageItemVo = finalQuotationVo["hsAgrPackageItemList"];
                        //基本价格
                        hsAgrPkgServiceItemVo = finalQuotationVo["hsAgrPkgServiceItemList"];
                        for (var i in finalQuotationVo) {
                            $("#" + i).text(finalQuotationVo[i]);
                        }
                        $("#tableNumber").text(finalQuotationVo.tableNumber);
                        $("#presentTime").text(moment(finalQuotationVo.presentTime).format('YYYY-MM-DD') );
                        //$("#hallName").text(serviceItemVo["hallName"] +"("+serviceItemVo["storeName"]+")");
                        //alert(data.msg.unconfirmedAmount)
                        $("#unconfirmedAmount").text(parseInt(finalQuotationVo.receivedAmount));
                        var addTotalAmount = parseInt(0);
                        if(finalQuotationList != null && finalQuotationList != ""){
                            var str ="";
                            var num = 0;
                            for(var i = 0;i<hsAgrPkgServiceItemVo.length;i++){
                                num = i +1;
                                str += "<tr class='blackBorder'>";
                                str += "<td>" + num + "</td>";
                                str += "<td>" + hsAgrPkgServiceItemVo[i].name + "</td>";
                                str += "<td colspan='3'>" + hsAgrPkgServiceItemVo[i].content +"</td>";
                                str += "<td>" + (hsAgrPkgServiceItemVo[i].unitPrice) +"</td>";
                                str += "<td>" + (hsAgrPkgServiceItemVo[i].amount) +"</td>";
                                str += "<td>" + hsAgrPkgServiceItemVo[i].totalAmount +"</td>";
                                str += "</tr>";
                            }
                            for(var i = 0;i<hsAgrPackageItemVo.length;i++){
                                num = num+1;
                                str += "<tr class='blackBorder'>";
                                str += "<td>" + num + "</td>";
                                str += "<td>" + hsAgrPackageItemVo[i].typeName + "</td>";
                                str += "<td colspan='3'>" + hsAgrPackageItemVo[i].content +"</td>";
                                str += "<td>" + (hsAgrPackageItemVo[i].unitPrice) +"</td>";
                                str += "<td>" + (hsAgrPackageItemVo[i].amount) +"</td>";
                                str += "<td>" + hsAgrPackageItemVo[i].totalAmount +"</td>";
                                str += "</tr>";
                            }
                            for(var i = 0;i<finalQuotationList.length;i++){
                                num = num+1;
                                str += "<tr class='blackBorder'>";
                                str += "<td>" + num + "</td>";
                                str += "<td>" + finalQuotationList[i].typeName + "</td>";
                                str += "<td colspan='3'>" + finalQuotationList[i].remark +"</td>";
                                str += "<td>" + (finalQuotationList[i].unitPrice) +"</td>";
                                str += "<td>" + (finalQuotationList[i].quantity) +"</td>";
                                str += "<td>" + finalQuotationList[i].amount +"</td>";
                                str += "</tr>";

                                addTotalAmount +=  parseInt(finalQuotationList[i].amount);
                            }
                            $("#table1 tr:eq(5)").after(str);
                        }
                        $("#subtotal").text(addTotalAmount);
                        $("#totalAmount").text(finalQuotationVo["totalAmount"] -  addTotalAmount);
                        $("#finalAmount").text(parseInt(finalQuotationVo["totalAmount"]));
                        $("#finalConfirmedAmunt").text(finalQuotationVo["totalAmount"] -finalQuotationVo.receivedAmount);
                        if(this.PrintPage){
                            $("#print").jqprint();
                        }
                    }
                    })
            }
        },
        mounted(){
            this.initData();
        }
    }
</script>

