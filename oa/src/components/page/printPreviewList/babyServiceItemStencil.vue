<template>
	<div>
		<div class="wrap bodyService" id="print">
			<p class="top" style="padding-top:5px;text-align:right;margin-bottom:10px;">
				<span>附件</span>
				<span>服务项目与报价清单</span>
			</p>
			<table class="table1" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td width="110">宴会举办日</td>
					<td width="250" style="font-weight: inherit"><label id="scheduleTime"></label></td>
					<td width="110">场次</td>
					<td width="250" style="font-weight: inherit"><label id="scheduleTimeTypeName"></label></td>
				</tr>
				<tr>
					<td width="110">预定桌数</td>
					<td width="250" style="font-weight: inherit"><label id="tableNumber"></label></td>
					<td width="110">宴会厅</td>
					<td width="250" style="font-weight: inherit"><label id="hallName"></label></td>
				</tr>
				<tr>
					<td width="110">甲方联系人</td>
					<td width="250" style="font-weight: inherit"><label id="partyAContacts"></label></td>
					<td width="110">乙方联系人</td>
					<td width="250" style="font-weight: inherit"><label id="partyBContacts"></label></td>
				</tr>
				<tr>
					<td width="110">联系电话</td>
					<td width="250" style="font-weight: inherit"><label id="partyAMobile">{{serviceItemVo.partyAMobile}}</label></td>
					<td width="110">联系电话</td>
					<td width="250" style="font-weight: inherit"><label id="partyBMobile"></label></td>
				</tr>
				<tr class="table1_tr">
					<td width="110">举办地址</td>
					<td width="250" style="font-weight: inherit"><label id="address">{{serviceItemVo.companyAddress}}</label></td>
					<td width="110" style="border-left:0"></td>
					<td width="250" style="border-left:0"></td>
				</tr>
				<tr class="table1_tr">
					<td width="110">所选套系</td>
					<td width="250" style="font-weight: inherit"><label id="packageName"></label></td>
					<td width="110" style="border-left:0"></td>
					<td width="250" style="border-left:0"></td>
				</tr>
			</table>

			<div class="weddingRemarkDiv"></div>
			<div class="weddingArrangementDiv"></div>

			<p class="count">项目报价</p>
			<p>基本项目价格如下表所示</p>
			<table class="table2" width="100%" cellspacing="0" cellpadding="0">

			</table>

			<p style="margin-top:40px;">追加项目和优惠项目</p>
			<table class="table3" width="100%" cellspacing="0" cellpadding="0">

			</table>

			<p class="count" style="margin-top:50px;">合同金额</p>
			<table class="table4" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td colspan="6" style="text-align: end;">合计</td>
					<td id="totalAmount"></td>
				</tr>
			</table>
			<div class="supplementDiv"></div>
			<p class="count" style="margin-top:50px;">注意事项</p>
			<p class="care-thing">
				1、请在阅读完毕并详细了解以上报价明细后签字确认。</br>
				2、《服务项目及报价清单》中未出现的赠送或优惠项目公司一律不予认可。
			</p>

			<table class="table5" width="100%" cellspacing="0" cellpadding="0" style="margin-top:200px;">
				<tr>
					<td>甲方</td>
					<td></td>
					<td>乙方（签章）</td>
					<td></td>
				</tr>
				<tr>
					<td>代表人</td>
					<td></td>
					<td>代表人</td>
					<td></td>
				</tr>
				<tr>
					<td>日期</td>
					<td></td>
					<td>日期</td>
					<td></td>
				</tr>
			</table>
		</div>

	</div>
</template>
<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
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
        data(){
            return{
                serviceItemVo:[],
                dec:{
                    schedule_time_type:[]
                }
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
                    //服务项目详细信息
                    this.dec.schedule_time_type=this.dicData.HS_SECHEDULE_TIME_TYPE//场次
                    this.dec.schedule_time_type.forEach((e)=>{
                        if(e.dicValue==res.data.msg.scheduleTimeType) {
                            $("#scheduleTimeTypeName").text(e.dicDesc)
                        }
                    })
                  let  serviceItemVo = res.data.msg;
                     this.serviceItemVo=res.data.msg
                    let  hsAgrPkgServiceContentVo =serviceItemVo["hsAgrPkgServiceContentList"];

                    let  hsAgrPackageMenuVo =serviceItemVo["hsAgrPackageMenuList"];

                    //优惠
                    let  hsAgrPackageItemVo = serviceItemVo["hsAgrPackageItemList"];
                    //基本价格
                    let   hsAgrPkgServiceItemVo = serviceItemVo["hsAgrPkgServiceItemList"];
                    //补充事项
                    let  hsAgrPkgSupplementMattersVo = serviceItemVo["hsAgrPkgSupplementMattersList"];
                    //加载服务项目
                    for(let i in serviceItemVo){
                        $("#"+i).text(serviceItemVo[i]);
                    }
                    $("#scheduleTimeTypeName").text()
                    if(hsAgrPkgServiceContentVo != null){
                        let strRemark ="";//宴会内容
                        let strDiscount ="";//优惠内容
                        let number =1;//宴会内容
                        let strOther ='<p class="count">'+"服务内容"+'</p><p class="care-thing">';//其它服务项目
                        let numberArrangement =1;
                        let type = 1;
                        let inumber  = 1;
                        let strOtherDiscount="";
                        let wedType=this.dicData.HS_PACKAGE_SERVICE_CONTENT_TYPE
                        for(let j = 0;j<hsAgrPkgServiceContentVo.length;j++){
                            let weedingType =hsAgrPkgServiceContentVo[j]["type"];//宴会服务项目类型
                            let weddingContent  = hsAgrPkgServiceContentVo[j]["content"];//宴会服务项目名
                            let weddingRemark  = hsAgrPkgServiceContentVo[j]["remark"];//婚宴服务项目备注
                            let weedingTypeName = hsAgrPkgServiceContentVo[j]["type"];//宴会服务项目类型名
                            let weddingAdustable = hsAgrPkgServiceContentVo[j]["adjustable"];//是否可修改服务内容
                            let weddingAmount =hsAgrPkgServiceContentVo[j]["amount"];//修改后价格
                            let weddingMinAmount =hsAgrPkgServiceContentVo[j]["minAmount"];//修改前价格
                            let weddingUnit = hsAgrPkgServiceContentVo[j]["unit"];//宴会服务项目单位
                            let weddingRemarkStr ="";
                            wedType.map(function (e) {
                                if(e.dicValue==weedingType){
                                    weedingTypeName=e.dicDesc
                                }
                            })
                            if(weedingType == 8){//宴会内容
                                if(number == 1){
                                    strRemark += '<p class="count">'+weedingTypeName+'</p>';
                                }
                                if(weddingContent == "宴会菜品"){
                                    if(hsAgrPackageMenuVo != null){
                                        let menu ="";
                                        for(let k =0;k<hsAgrPackageMenuVo.length;k++){
                                            menu += hsAgrPackageMenuVo[k]["name"] ;
                                            if(k != hsAgrPackageMenuVo.length -1 ){
                                                menu +="、";
                                            }
                                        }
                                        strRemark +='<p class="care-thing">'+number+' '+weddingContent + ": "+ menu + '</p>';
                                    }
                                }else{
                                    let str ="";
                                    let amount ="";
                                    if(weddingAmount != null && weddingAmount != "") {
                                        if(weddingAmount != weddingMinAmount){
                                            amount =weddingMinAmount;
                                            strDiscount +=  weddingContent +"多送"+ (weddingAmount- weddingMinAmount) +weddingUnit;
                                        }else{
                                            amount =weddingAmount;
                                        }
                                        str += amount + weddingUnit;
                                    }

                                    if(weddingRemark !=null && weddingRemark != ""){
                                        weddingRemarkStr = "("+weddingRemark+")";
                                    }
                                    strRemark += '<p class="care-thing">' + number + ' ' + weddingContent + weddingRemarkStr + str + '</p>';


                                }
                                number++;

                            }else {//其它
                                if(weedingType == type){

                                    if(weddingRemark !=null && weddingRemark != ""){
                                        weddingRemarkStr = "("+weddingRemark+")";
                                    }
                                    strOther += weddingContent + weddingRemarkStr;
                                    if(weddingAmount != null && weddingAmount != ""){
                                        strOther += weddingMinAmount + weddingUnit;
                                    }
                                    if( j != hsAgrPkgServiceContentVo.length -1 ){
                                        strOther +=",";
                                    }else{
                                        strOtherDiscount = "";
                                    }
                                    numberArrangement++;
                                }else {
                                    strOther=(strOther.slice(strOther.length-1)==',')?strOther.slice(0,-1):strOther;
                                    strOther +="</p>";
                                    strOther += '<p class="care-thing">'+inumber+" "+weedingTypeName+':' +weddingContent;
                                    inumber ++;
                                    type = weedingType;

                                }

                            }
                        }
                        $(".weddingRemarkDiv").append(strRemark);//婚宴内容
                        $(".weddingArrangementDiv").append(strOther);//其它
                    }


                    if(hsAgrPkgServiceItemVo!=null){
                        let strTable1 ="";
                        strTable1 +='<tr>';
                        strTable1 +='<th>序号</th>';
                        strTable1 +='<th>项目名称</th>';
                        strTable1 +='<th>单位</th>';
                        strTable1 +='<th>数量</th>';
                        strTable1 +='<th>单价</th>';
                        strTable1 +='<th>金额</th>';
                        strTable1 +='</tr>';
                        var number = 1 ;
                        let maxAmount = 0.00;
                        for(let j = 0;j<hsAgrPkgServiceItemVo.length;j++){
                            strTable1 +='<tr>';
                            strTable1 +='<td>'+number+'</td>';
                            strTable1 +='<td>'+hsAgrPkgServiceItemVo[j]["name"]+'</td>';
                            hsAgrPkgServiceItemVo[j]["unit"]=hsAgrPkgServiceItemVo[j]["unit"]?hsAgrPkgServiceItemVo[j]["unit"]:' ';
                            hsAgrPkgServiceItemVo[j]["quantity"]=hsAgrPkgServiceItemVo[j]["quantity"]?hsAgrPkgServiceItemVo[j]["quantity"]:' ';
                            hsAgrPkgServiceItemVo[j]["unitPrice"]=hsAgrPkgServiceItemVo[j]["unitPrice"]?hsAgrPkgServiceItemVo[j]["unitPrice"]:' ';
                            hsAgrPkgServiceItemVo[j]["totalAmount"]=hsAgrPkgServiceItemVo[j]["totalAmount"]?hsAgrPkgServiceItemVo[j]["totalAmount"]:0;
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
                        let strTable2 ="";
                        strTable2 +='<tr>';
                        strTable2 +='<th width="100px">序号</th>';
                        strTable2 +='<th width="100px">类型</th>';
                        strTable2 +='<th width="100px">内容</th>';
                        strTable2 +='<th width="100px">单位</th>';
                        strTable2 +='<th>数量</th>';
                        strTable2 +='<th>单价</th>';
                        strTable2 +='<th>金额</th>';
                        strTable2 +='</tr>';
                        let number1 = 1 ;
                        let maxAmount1 = 0.00;
                        for(let j = 0;j<hsAgrPackageItemVo.length;j++){
                            hsAgrPackageItemVo[j]["typeName"]=hsAgrPackageItemVo[j]["typeName"]?hsAgrPackageItemVo[j]["typeName"]:''
                            strTable2 +='<tr>';
                            strTable2 +='<td>'+number1+'</td>';
                            strTable2 +='<td>'+hsAgrPackageItemVo[j]["content"]+'</td>';
                            strTable2 +='<td>'+hsAgrPackageItemVo[j]["name"]+'</td>';
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
                    }
                    let supplement = "";
                    if(hsAgrPkgSupplementMattersVo != null){
                        supplement += '<p class="con">补充事项</p>';
                        let number = 1;
                        for(let i = 0;i<hsAgrPkgSupplementMattersVo.length;i++){
                            supplement += '<p class="con-thing">'+number +'、' + hsAgrPkgSupplementMattersVo[i]["content"]+'</p>';
                            number++;
                        }
                    }
                    $(".supplementDiv").append(supplement);//补充事项
                    if(this.PrintPage){
                        $("#print").jqprint();
                    }
                })
                }
        },
        mounted(){
            this.initData();
        }
    }
</script>
