<template>
	<div>
		<div class="wrap baby1" id="print">
			<p class="number">Bg<label id="agreementNo"></label></p>
			<p class="title">宝宝宴宴会服务协议变更协议书</p>
			<table class="table1" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td width="110">甲方</td>
					<td width="250"><label id="partyA"></label></td>
					<td width="140">身份证号码</td>
					<td width="250"> <label id="partyAId"></label></td>
				</tr>
				<tr>
					<td width="110">乙方</td>
					<td colspan="3" width="640"><label id="partyB"></label></td>

				</tr>
			</table>

			<p style="line-height:20px;">甲、乙双方于<label id="year" style="text-decoration:underline"></label>年<label id="month" style="text-decoration:underline"></label>月<label id="date" style="text-decoration:underline"></label>日 的《宴会仪式及宴会服务协议书》</p>
			<p style="line-height:20px;">（下称“原协议”），现甲、乙双方就宴会仪式及宴会服务变更一事达成如下协议，并共同遵照执行：</p>

			<ul>
				<li>一、甲方提出、乙方同意将宴会举办日由原定的&nbsp;<label id="oldScheduleTime" style="font-weight:bold"> </label>&nbsp;变更为 <label id="newScheduleTime" style="font-weight:bold"> </label></li>
				<li>二、宴会举办场地由原定的&nbsp;<label id="oldBanquetHallName" style="font-weight:bold"> </label>&nbsp;变更为 <label id="newBanquetHallName" style="font-weight:bold"> </label></li>
				<li>三、预订服务金额由原先的&nbsp;<label id="oldToatlAmount" style="font-weight:bold"> </label>&nbsp;变更为 <label id="newToatlAmount" style="font-weight:bold"> </label></li>
				<li>四、本协议书签订后，由新的附件替换原协议附件。 </li>
				<li>五、甲、乙双方确认，本协议书未涉及的事项仍按原协议约定执行。</li>
				<li>六、本协议书一式二份，甲、乙双方各执一份，经甲、乙双方签署即生效。 </li>
			</ul>

			<table class="table5" width="100%" cellspacing="0" cellpadding="0" style="margin-top:300px;">
				<tr>
					<td>甲方（签字）</td>
					<td></td>
					<td>乙方（签章）</td>
					<td></td>
				</tr>

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
    import  moment from 'moment'
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
                var orderVo;
                var change;

                this.$axios.post('/order/getChangePrint',this.id).then((res)=>{
                    //订单详细信息
                    orderVo =res.data.msg;
                    //合同详细信息
                    var agreementVo =orderVo["hsAgreementDTO"];
                    for(var i in agreementVo){
                        $("#"+i).text(agreementVo[i]);
                    }

                    $("#agreementNo").text(["agreementNo"]);
                    $("#partyB").text(orderVo["companyRegistrationName"]);
                    change = res.data.msg.hsAgreementChangeDTO;
                    var createTime = agreementVo["createTime"];

                    var date=moment(createTime);
                    var year = "    " + date.getFullYear() +"    ";
                    var month =  "    "+(date.getMonth()+1) +"    ";
                    var date1 = "    " + date.getDate()+ "    " ;
                    $("#year").text(year);
                    $("#month").text(month);
                    $("#date").text(date1);
                    if(change){
                        var totalAmount =agreementVo["totalAmount"];
                        var changeAmount =change["changeAmount"];
                        var oldSchedule =change["oldScheduleList"];
                        $("#oldScheduleTime").text(oldSchedule[0]["scheduleTime"].substr(0,10));
                        var oldBanquetHallName ="";
                        for(var i in oldSchedule){
                            oldBanquetHallName += oldSchedule[i]["hallName"];
                        }
                        $("#oldBanquetHallName").text(oldBanquetHallName);
                        $("#oldToatlAmount").text(totalAmount - changeAmount);
                        var newSchedule =change["newScheduleList"];
                        var newBanquetHallName ="";
                        for(var i in newSchedule){
                            newBanquetHallName += newSchedule[i]["hallName"];
                        }
                        $("#newScheduleTime").text(newSchedule[0]["scheduleTime"].substr(0,10));
                        $("#newBanquetHallName").text(newBanquetHallName);
                        $("#newToatlAmount").text(parseInt(totalAmount));
                    }

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
