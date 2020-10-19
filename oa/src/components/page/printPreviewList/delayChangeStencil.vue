<template>
	<div>
		<div class="wrap delayChangeStencil" id="print">
			<p class="number">Bg<label id="agreementNo"></label></p>
			<p class="title">婚礼仪式及宴会服务延期协议书</p>
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

			<p style="line-height:20px;">甲、乙双方于<label id="year" style="text-decoration:underline"></label>年<label id="month" style="text-decoration:underline"></label>月<label id="date" style="text-decoration:underline"></label>日 的《婚礼仪式及宴会服务协议书》</p>
			<p style="line-height:20px;">（下称“原协议”），现甲、乙双方就婚礼仪式及宴会服务延期一事达成如下协议，并共同遵照执行：</p>

			<ul>
				<li>一、甲方提出、乙方同意将婚礼延期<label name="delayTypeName"></label>，（截止日期，<label id="delayTime"></label>）甲方<label name="delayTypeName"></label>内可以预定乙方现有的宴会厅和档期，须遵循甲方的宴会厅消费限定，以乙方当时的售价为准。</li>
				<li>二、原合同取消。</li>
				<li>三、乙方自愿承担合同违约金人民币
					<lable id="changeAmount"></lable>元整</li>
				<li>四、乙方确认甲方原合同已付金额人民币<label id="unconfirmedAmount"></label>元在延期期限内签订新合同时自动进入已付款项。 </li>
				<li>五、甲方新合同预定金额不得低于原合同金额人民币
					<lable id="depositAmount"></lable>元。</li>
				<li>六、如甲方再次违约，须支付乙方原合同金额20%的违约金。 </li>
				<li>七、本协议书一式二份，甲、乙双方各执一份，经甲、乙双方签署即生效。</li>
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
                this.$axios.post('/order/getChangeDelayPrint',this.id).then((res)=> {  //获取所有套系
                    if(res.data.res == '0') {
                        //订单详细信息
                      let orderVo =res.data.msg;
                        //档期详细信息
                        var scheduleVo = res.data.msg.hsScheduleList;
                        //合同延期详细信息
                        var agreementDelayVo = orderVo.hsAgreementDelayDTO;
                        //合同详细信息
                        var agreementVo =orderVo["hsAgreementDTO"];

                        for(var i in agreementVo){
                            $("#"+i).text(agreementVo[i]);
                        }
                        $("#agreementNo").text(agreementVo["agreementNo"]);
                        $("#depositAmount").text(agreementVo["totalAmount"]);
                        $("#partyB").text(orderVo["companyRegistrationName"]);
                        $("#unconfirmedAmount").text(parseInt(orderVo.receivedAmount));
                        $("#changeAmount").text(parseInt(agreementDelayVo["changeAmount"]));
                        $("label[name='delayTypeName']").text(agreementDelayVo["delayTypeName"]);
                        var scheduleTime = scheduleVo[0]["scheduleTime"];

                        //date.setFullYear(date.getFullYear()+(parseInt(agreementDelayVo["delayType"])+1));

                        var createTime = agreementVo["createTime"];
                        var date=moment(createTime);
                        $("#delayTime").text(date.format('YYYY-MM-DD'));
                        let year = "    " + date.format('YYYY') +"    ";
                        let month =  "    "+date.format('MM') +"    ";
                        let date1 = "    " + date.format('DD')+ "    " ;
                        $("#year").text(year);
                        $("#month").text(month);
                        $("#date").text(date1);
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
