<template>
	<div>
		<div class="wrap quotation" id="print">

			<p class="top" style="padding-top:5px;">
				<!--<img src="../jsimgcss/images/agreement/title.png" alt="" style="width:200px;float:left;margin-top:-10px;" />-->
				<span style="margin-left:320px; margin-right:20px;">附件2</span>
				<span>报价清单</span>
			</p>

			<table class="table1" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td width="110">婚礼举办日</td>
					<td width="280" style="font-weight: inherit"><label id="scheduleTime"></label></td>
					<td width="80">场次</td>
					<td width="280" style="font-weight: inherit"><label id="scheduleTimeTypeName"></label></td>
				</tr>
				<tr>
					<td width="110">预定桌数</td>
					<td width="280" style="font-weight: inherit"><label id="tableNumber"></label></td>
					<td width="80">宴会厅</td>
					<td width="280" style="font-weight: inherit"><label id="hallName"></label></td>
				</tr>
				<tr>
					<td width="110">所选套系</td>
					<td width="280" style="font-weight: inherit"><label id="packageName"></label></td>
					<td width="100" style="border-left:0"></td>
					<td width="280" style="border-left:0"></td>
				</tr>
			</table>
			<p class="base-price">基本价格</p>
			<table class="table2" width="100%" cellspacing="0" cellpadding="0">
			</table>

			<p class="base-price">追加项目和优惠项目</p>
			<table class="table3" width="100%" cellspacing="0" cellpadding="0">
			</table>

			<p class="count">合同金额</p>
			<table class="table4" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td colspan="6" style="text-align: end;">合计</td>
					<td>
						<lable id="totalAmount"></lable>
					</td>
				</tr>
			</table>

			<table class="table5" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;">
				<tr>
					<td></td>
					<td></td>
					<td>甲方确认签字</td>
					<td><input class="inputS"></td>
				</tr>

			</table>
		</div>

	</div>
</template>
<script type="text/ecmascript-6">
    import $ from 'jQuery'
    require("../../../utils/jquery.jqprint-0.3");
    import { mapGetters } from 'vuex';
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

            },
            ...mapGetters([
                'dicData'
            ])
        },
        methods:{
            initData(){

                this.$axios.post('/order/getServiceItemPrint',this.id).then((res)=> {  //获取所有套系
                    if(res.data.res == '0'){
                        //服务项目详细信息
                     let  serviceItemVo = res.data.msg;
                        //优惠
                      let  hsAgrPackageItemVo = serviceItemVo["hsAgrPackageItemList"];
                        //基本价格
                      let  hsAgrPkgServiceItemVo = serviceItemVo["hsAgrPkgServiceItemList"];

                        for (var i in serviceItemVo) {
                            $("#" + i).text(serviceItemVo[i]);

                        }
                        let scheduleTime=this.dicData.HS_SECHEDULE_TIME_TYPE //场次
                        scheduleTime.forEach((e)=>{
                            if(e.dicValue==serviceItemVo["scheduleTimeType"]) {
                                  $('#scheduleTimeTypeName').text(e.dicDesc)
                            }
                        })
                        let hall=serviceItemVo["hallName"]?serviceItemVo["hallName"]:''
                        let store=serviceItemVo["storeName"]?serviceItemVo["storeName"]:''
                        $("#hallName").text(hall+store);
                        if(hsAgrPkgServiceItemVo!=null){
                            var strTable1 ="";
                            strTable1 +='<tr>';
                            strTable1 +='<th>序号</th>';
                            strTable1 +='<th>项目名称</th>';
                            strTable1 +='<th>单位</th>';
                            strTable1 +='<th>数量</th>';
                            strTable1 +='<th>单价</th>';
                            strTable1 +='<th>金额</th>';
                            strTable1 +='</tr>';
                            var number = 1 ;
                            var maxAmount = 0.00;
                            for(var j = 0;j<hsAgrPkgServiceItemVo.length;j++){
                                strTable1 +='<tr>';
                                strTable1 +='<td>'+number+'</td>';
                                strTable1 +='<td>'+hsAgrPkgServiceItemVo[j]["name"]+'</td>';
                                strTable1 +='<td>'+hsAgrPkgServiceItemVo[j]["unit"]+'</td>';
                                strTable1 +='<td>'+hsAgrPkgServiceItemVo[j]["quantity"]+'</td>';
                                strTable1 +='<td>'+hsAgrPkgServiceItemVo[j]["unitPrice"]+'</td>';
                                strTable1 +='<td>'+hsAgrPkgServiceItemVo[j]["totalAmount"]+'</td>';
                                strTable1 +='</tr>';
                                number++
                                maxAmount = parseFloat(hsAgrPkgServiceItemVo[j]["totalAmount"]) + parseFloat(maxAmount);
                            }
                            strTable1 +='<tr class="none-bottom">';
                            strTable1 +='<td colspan="5" style="text-align: end;">小计</td>';
                            strTable1 +='<td style="text-align: right">'+maxAmount.toFixed(2)+'</td>';
                            strTable1 +='</tr>';
                            $(".table2").append(strTable1);
                        }
                        if(hsAgrPackageItemVo!=null){
                            var strTable2 ="";
                            strTable2 +='<tr>';
                            strTable2 +='<th>序号</th>';
                            strTable2 +='<th>类型</th>';
                            strTable2 +='<th>内容</th>';
                            strTable2 +='<th>单位</th>';
                            strTable2 +='<th>数量</th>';
                            strTable2 +='<th>单价</th>';
                            strTable2 +='<th>金额</th>';
                            strTable2 +='</tr>';
                            var number1 = 1 ;
                            var maxAmount1 = 0.00;
                            for(var j = 0;j<hsAgrPackageItemVo.length;j++){
                                hsAgrPackageItemVo[j]["itemType"]=hsAgrPackageItemVo[j]["itemType"]?hsAgrPackageItemVo[j]["itemType"]:''
                                strTable2 +='<tr>';
                                strTable2 +='<td>'+number1+'</td>';
                                strTable2 +='<td>'+hsAgrPackageItemVo[j]["name"]+'</td>';
                                strTable2 +='<td>'+hsAgrPackageItemVo[j]["content"]+'</td>';
                                strTable2 +='<td>'+hsAgrPackageItemVo[j]["unit"]+'</td>';
                                strTable2 +='<td>'+hsAgrPackageItemVo[j]["quantity"]+'</td>';
                                strTable2 +='<td>'+hsAgrPackageItemVo[j]["unitPrice"]+'</td>';
                                strTable2 +='<td>'+hsAgrPackageItemVo[j]["totalAmount"]+'</td>';
                                strTable2 +='</tr>';
                                number1++
                                maxAmount1 = parseFloat(hsAgrPackageItemVo[j]["totalAmount"]) + parseFloat(maxAmount1);
                            }
                            strTable2 +='<tr class="none-bottom">';
                            strTable2 +='<td colspan="6" style="text-align: end;">小计</td>';
                            strTable2 +='<td style="text-align: right">'+maxAmount1.toFixed(2)+'</td>';
                            strTable2 +='</tr>';
                            $(".table3").append(strTable2);
                            if(this.PrintPage){
                                $("#print").jqprint();
                            }
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

