<template>
    <div>



        <!--var orderDTO;-->
        <!--var hsAgreementDTO;-->
        <!--var hsAgreementFundsDTOList;-->
        <!--var hsScheduleDTO;-->
        <!--var companyInformation;-->
        <!--var	hsAgrPackage;-->
        <!--var serviceItemDTO;-->
        <!--var hsAgrPkgServiceContentList;-->
        <!--var hsAgrPackageItemDTO;-->
        <!--var hsAgrPkgServiceItemDTO;-->
        <!--var hsAgrPackageMenuDTO;-->
        <!--this.$axios.post('/order/getHsAgreementDetailsPrint',this.id).then((res)=>{  //获取所有套系-->
        <!--if(res.data.res == '0'){-->
        <!--//订单详细信息-->
        <!--orderDTO =res.data.msg;-->
        <!--//公司信息-->
        <!--companyInformation = orderDTO.companyInformation;-->
        <!--//套系信息-->
        <!--hsAgrPackage = orderDTO.hsAgrPackage;-->
        <!--//合同信息-->
        <!--hsAgreementDTO = orderDTO["hsAgreementDTO"];-->
        <!--//款项信息-->
        <!--hsAgreementFundsDTOList = orderDTO["hsAgreementFundsDTOList"];-->
        <!--//档期信息-->
        <!--hsScheduleDTO = orderDTO["hsScheduleDTO"];-->
        <!--//服务项目详细信息-->
        <!--serviceItemDTO = orderDTO['hsAgreementDTO'];-->
        <!--//套系-->
        <!--hsAgrPkgServiceContentList =serviceItemDTO["hsAgrPkgServiceContentList"];-->
        <!--//菜品-->
        <!--hsAgrPackageMenuDTO =serviceItemDTO["hsAgrPackageMenuList"];-->
        <!--//优惠和报价-->
        <!--hsAgrPackageItemDTO = serviceItemDTO["hsAgrPackageItemList"];-->
        <!--//基本价格-->
        <!--hsAgrPkgServiceItemDTO = serviceItemDTO["hsAgrPkgServiceItemList"];-->
        <!--//加载合同信息-->
        <!--for(var i in hsAgreementDTO){-->
        <!--$("#"+i).text(hsAgreementDTO[i]);-->
        <!--}-->
        <!--$("#partyB").text(orderDTO.companyRegistrationName);-->
        <!--//                        $("#partyBAddress").text(orderDTO["address"]);-->

        <!--//加载套系信息-->
        <!--for(var i in hsAgrPackage){-->
        <!--$("#"+i).text(hsAgrPackage[i]);-->
        <!--}-->
        <!--var  arrList = [];-->
        <!--var str ='';-->
        <!--var strMideele ="";-->
        <!--var scheduleTime ="";-->
        <!--var strDiscount = "";-->
        <!--if(hsScheduleDTO != null && hsScheduleDTO!="") {-->
        <!--scheduleTime = new Date(hsScheduleDTO[0]["scheduleTime"]).format('yyyy-MM-dd');-->
        <!--}-->
        <!--var banquetHallName ="";-->
        <!--for(var i in hsScheduleDTO){-->
        <!--banquetHallName += hsScheduleDTO[i]["banquetHallName"];-->
        <!--}-->
        <!--$("#banquetHallName").text(banquetHallName);-->
        <!--$("#scheduleTime").text(scheduleTime);-->
        <!--$("#time").text(hsAgreementDTO["startTime"]+"-"+hsAgreementDTO["endTime"]);-->
        <!--if(hsAgreementFundsDTOList != null ){-->
        <!--var number= 1;-->
        <!--for(var j = 0;j<hsAgreementFundsDTOList.length; j++){-->
        <!--if(hsAgreementFundsDTOList[j]["type"] == 2){//款项目为订金-->
        <!--if(hsAgreementFundsDTOList[j]["amount"] !=null ){-->
        <!--arrList.push('<p class="bady_care_p">2.' + number + ' 本协议签订当日向乙方支付定金人民币'+hsAgreementFundsDTOList[j]["amount"]+'元（大写：人民币'+DX(hsAgreementFundsDTOList[j]["amount"])+'）。</p>');-->
        <!--}else{-->
        <!--arrList.push('<p class="bady_care_p">2.' + number + ' 本协议签订当日向乙方支付定金人民币0元（大写：人民币零元）。</p>');-->
        <!--}-->
        <!--number++;-->
        <!--}-->
        <!--}-->

        <!--for(var j = 0;j<hsAgreementFundsDTOList.length; j++){-->
        <!--if (hsAgreementFundsDTOList[j]["type"] == 4){//款项为尾款-->
        <!--if(hsAgreementFundsDTOList[j]["lastPaymentTime"] !=null ) {-->
        <!--var lastPaymentTime4 = new Date(hsAgreementFundsDTOList[j]["lastPaymentTime"]).format('yyyy-MM-dd');-->
        <!--var days4 = DateDiff(lastPaymentTime4,scheduleTime);-->
        <!--if(days4 > 0) {-->
        <!--strMideele += '<p class="bady_care_p">2.' + parseInt(arrList.length + 1) + ' 宴会举办日前'+days4+'日，甲方需确认最终出席人数，以最终确认的服务金额为依据，付清剩余款项。</p>';-->
        <!--}else {-->
        <!--strMideele += '<p class="bady_care_p">2.' + parseInt(arrList.length + 1) + ' 宴会举办当日{'+scheduleTime+'}开始前，以最终确认的服务金额为依据，付清剩余款项。</p>';-->
        <!--}-->
        <!--strMideele += '<p class="bady_care_p">2.' + parseInt(arrList.length + 2) + ' 宴会举办当日，甲方实际消费金额超过最终确认服务金额的部分，甲方应在宴会结束时';-->
        <!--strMideele +='一次性支付给乙方。</p>';-->

        <!--strMideele +=' <p class="bady_care_p" style="margin-bottom:30px;">2.'+parseInt(arrList.length + 3) +'乙方收款账户信息如下： ';-->
        <!--strMideele +='</p>';-->
        <!--strMideele +=' <p class="bady_care_p"';-->
        <!--strMideele +='<br/>开户名：'+companyInformation["companyAccountName"];-->
        <!--strMideele +='<br/>开户行：'+companyInformation["bankName"];-->
        <!--strMideele +='<br/>帐 号：'+companyInformation["bankAccount"];-->
        <!--strMideele +='</p>';-->
        <!--}-->
        <!--}-->
        <!--}-->
        <!--}-->
        <!--for(var i = 0 ;i<arrList.length;i++){-->
        <!--str +=arrList[i];-->
        <!--}-->
        <!--str += strMideele;-->
        <!--$(".dataGoldDiv").append(str);-->
        <!--//服务项目和报价清单-->
        <!--var number = 1;-->
        <!--var strRemark ="";-->

        <!--if(hsAgrPkgServiceItemDTO != null){-->
        <!--for(var i = 0;i<hsAgrPkgServiceItemDTO.length;i++){-->
        <!--if(hsAgrPkgServiceItemDTO[i]["name"] == "宴会菜品"){-->
        <!--if(hsAgrPackageMenuDTO != null){-->
        <!--var menu ="";-->

        <!--for(var k =0;k<hsAgrPackageMenuDTO.length;k++){-->
        <!--menu += hsAgrPackageMenuDTO[k]["name"] ;-->
        <!--if(k != hsAgrPackageMenuDTO.length -1 ){-->
        <!--menu +="、";-->
        <!--}-->
        <!--if(hsAgrPackageMenuDTO[k]["adjustName"]!=null && hsAgrPackageMenuDTO[k]["adjustName"]!=""){-->
        <!--strDiscount += "," + hsAgrPackageMenuDTO[k]["name"]+"升级为" +hsAgrPackageMenuDTO[k]["adjustName"] ;-->
        <!--}-->
        <!--}-->

        <!--}-->
        <!--strRemark +='<p class="bady_care_p"> 3.'+number+' '+hsAgrPkgServiceItemDTO[i]["name"] + ": "+ menu + '</p>';-->
        <!--//婚宴内容优惠不为空-->
        <!--if(strDiscount != ""){-->
        <!--strRemark += '<p class="bady_care_p"> 3.' + ++number + ' 免费升级或赠送项：' + strDiscount + '</p>';-->
        <!--}-->

        <!--}else{-->
        <!--strRemark += '<p class="bady_care_p">3.'+number +' '+hsAgrPkgServiceItemDTO[i]["content"] +'</p>' ;-->
        <!--}-->
        <!--number ++;-->
        <!--}-->

        <!--}-->

        <!--strRemark +='<p class="bady_care_p bady_care_p0">3.'+number+' 报价见下表格所示</p><div style="page-break-after: always;"></div>';-->

        <!--$(".weddingRemarkDiv").append(strRemark);//服务内容及报价-->

        <!--if(hsAgrPackageItemDTO!=null){-->
        <!--var strTable2 ="";-->
        <!--strTable2 +='<tr>';-->
        <!--strTable2 +='<th>序号</th>';-->
        <!--strTable2 +='<th>内容</th>';-->
        <!--strTable2 +='<th>单位</th>';-->
        <!--strTable2 +='<th>数量</th>';-->
        <!--strTable2 +='<th>单价</th>';-->
        <!--strTable2 +='<th>金额</th>';-->
        <!--strTable2 +='</tr>';-->
        <!--var number1 = 1 ;-->
        <!--var maxAmount1 = 0.00;-->
        <!--for(var j = 0;j<hsAgrPackageItemDTO.length;j++){-->
        <!--strTable2 +='<tr>';-->
        <!--strTable2 +='<td style="font-weight: inherit">'+number1+'</td>';-->
        <!--strTable2 +='<td style="font-weight: inherit">'+hsAgrPackageItemDTO[j]["name"]+'</td>';-->
        <!--strTable2 +='<td style="font-weight: inherit">'+hsAgrPackageItemDTO[j]["unit"]+'</td>';-->
        <!--strTable2 +='<td style="font-weight: inherit">'+hsAgrPackageItemDTO[j]["amount"]+'</td>';-->
        <!--strTable2 +='<td style="font-weight: inherit">'+hsAgrPackageItemDTO[j]["unitPrice"]+'</td>';-->
        <!--strTable2 +='<td style="font-weight: inherit">'+hsAgrPackageItemDTO[j]["totalAmount"]+'</td>';-->
        <!--strTable2 +='</tr>';-->
        <!--number++-->
        <!--maxAmount1 = parseFloat(hsAgrPackageItemDTO[j]["totalAmount"]) + parseFloat(maxAmount1);-->
        <!--}-->
        <!--strTable2 +='<tr class="none-bottom">';-->
        <!--strTable2 +='<td colspan="5" style="text-align: end;">小计</td>';-->
        <!--strTable2 +='<td style="font-weight: inherit">'+maxAmount1.toFixed(2)+'</td>';-->
        <!--strTable2 +='</tr>';-->
        <!--$(".table3").append(strTable2);-->
        <!--}-->

        <!--}-->
        <!--if(res.data.res == '0'){-->
        <!--console.log(res)-->
        <!--}-->
        <!--})     -->
        <!---->
        <!---->













    </div>
</template>

<script>

    export default{
        data(){
            return {}
        },
        components: {}
    }
</script>
