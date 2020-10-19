<template>
	<div>
		<div class="wrap seanceEQ" id="print">
			<p class="top_title" style="margin-left: 0;text-align: center">会务最终确认单</p>
			<table class="table1" width="100%" cellspacing="0" cellpadding="0">
				<tr class='blackBottom'>
					<td class="boldText">合同号</td>
					<td colspan="3" id="agreementNo"></td>
				</tr>
				<tr class='blackBorder '>
					<td class="boldText">甲方</td>
					<td id="partyA"></td>
					<td class="boldText">档期</td>
					<td id="scheduleTime"></td>
					<td class="boldText">场次</td>
					<td colspan="3" id="scheduleTimeTypeName"></td>
				</tr>
				<tr class='blackBorder'>
					<td class="boldText">联系人</td>
					<td id="partyAContacts"></td>
					<td class="boldText">门店</td>
					<td id="storeName"></td>
					<td class="boldText">桌数</td>
					<td colspan="3" id="tableNumber"></td>
				</tr>
				<tr class='blackBorder '>
					<td class="boldText">宴会厅</td>
					<td id="hallName"></td>
					<td class="boldText">套系</td>
					<td colspan="5" id="packageName"></td>
				</tr>
				<tr class='blackBorder boldText' id="menu">
					<td class='centerText' colspan="8">宴会菜品</td>
				</tr>

				<tr class='blackBorder boldText' id="drinks">
					<td class='centerText' colspan="8">饮料及点心</td>
				</tr>

				<tr class='blackBorder boldText' id="arrangement">
					<td class='centerText' colspan="8">宴会布置</td>
				</tr>

				<tr class='blackBorder boldText' id="other">
					<td class='centerText' colspan="8">其它</td>
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
    import  moment from 'moment'
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
                this.$axios.post('/order/getHsOrderEOPrint',this.id).then((res)=> {  //获取所有套系
                    //EO单基本信息
                  let  agreementEOVo = res.data.msg;
                    //EO单详细信息
                    let   hsAgreementEOList =agreementEOVo.hsAgreementEOList;
                    //菜单详细信息
                    let  hsAgreementEOMenuList = agreementEOVo.hsAgreementEOMenuList;

                    for (let i in agreementEOVo) {
                        $("#" + i).text(agreementEOVo[i]);
                    }
                    let scheduleTime=this.dicData.HS_SECHEDULE_TIME_TYPE //场次
                    scheduleTime.forEach((e)=>{
                        if(e.dicValue==agreementEOVo["scheduleTimeType"]) {
                            $('#scheduleTimeTypeName').text(e.dicDesc)
                        }
                    })
                    let str ="";
                    let totalTable = 0;
                    let mainTable = 0;
                    let drinksStr =""; //饮料及点心;
                    let arrangementStr ="";//宴会布置
                    let otherStr = "";
                    if(hsAgreementEOList){
                        for(let i = 0; i < hsAgreementEOList.length; i++){
                            if(hsAgreementEOList[i]["type"] == 0){
                                totalTable =hsAgreementEOList[i]["content"];
                            }else if( hsAgreementEOList[i]["type"] == 1){
                                mainTable =hsAgreementEOList[i]["content"];
                            }

                            if(hsAgreementEOList[i]["species"] == 2 ){
                                drinksStr +=" <tr class='blackBorder'>";
                                drinksStr +="<td colspan='2' class='boldText'>"+hsAgreementEOList[i]["type"]+"</td>";
                                drinksStr +="<td colspan='6'>"+hsAgreementEOList[i]["content"]+"</td>";
                                drinksStr +="</tr>";
                            }
                            if(hsAgreementEOList[i]["species"] == 3 ){
                                arrangementStr +=" <tr class='blackBorder'>";
                                arrangementStr +="<td colspan='2' class='boldText'>"+hsAgreementEOList[i]["typeName"]+"</td>";
                                arrangementStr +="<td colspan='6'>"+hsAgreementEOList[i]["content"]+"</td>";
                                arrangementStr +="</tr>";
                            }
                            if(hsAgreementEOList[i]["species"] == 0 ){
                                otherStr +=" <tr class='blackBorder'>";
                                otherStr +="<td colspan='2' class='boldText'>"+hsAgreementEOList[i]["typeName"]+"</td>";
                                otherStr +="<td colspan='6'>"+hsAgreementEOList[i]["content"]+"</td>";
                                otherStr +="</tr>";
                            }
                        }
                        $("#drinks").after(drinksStr);
                        $("#arrangement").after(arrangementStr);
                        $("#other").after(otherStr);
                        //$(".table1 tr:eq(4)").after(str);
                    }
                    let tableCount = 4;//一行显示几列菜单
                    if(hsAgreementEOMenuList){
                        let str ="";
                        for(let i = 0 ; i<hsAgreementEOMenuList.length;i++){
                            if(i == 0 || i % tableCount == 0){
                                str +="<tr class='blackBorder'>";
                            }
                            if(!jQuery.isEmptyObject(hsAgreementEOMenuList[i]["adjustName"] )){
                                str += "<td colspan='2'>" + hsAgreementEOMenuList[i]["adjustName"] + "(换)" + "</td>";
                            }else {
                                str += "<td colspan='2'>" + hsAgreementEOMenuList[i]["name"] + "</td>";
                            }
                            if((i+1) % tableCount != 0 && (i+1) == hsAgreementEOMenuList.length){
                                let num1 = tableCount - (hsAgreementEOMenuList.length % tableCount);
                                for(let j = 0;j<num1;j++){
                                    str += "<td colspan='2'></td>";
                                }
                            }
                            if((i+1)  == 0 && i != 0){
                                str +="</tr>";
                            }
                        }
                        $("#menu").after(str);
                    }
                    //$("#mainTable").text(mainTable);
                    $("#tableNumber").text(totalTable);
                    $("#presentTime").text(moment(agreementEOVo.presentTime).format('YYYY-MM-DD'));
                    //EO单列表

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

