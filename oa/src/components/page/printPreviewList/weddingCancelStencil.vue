<template>
    <div>
      <div class="wrap weddingCancelSt" id="print">
			<p class="top" style="padding-top:5px;padding-left:15px;padding-right:5px">
				<!--<img src="../jsimgcss/images/agreement/title.png" alt="" style="width:200px;float:left;margin-top:-10px;"/>-->
				<span style="float:right">婚宴取消同意书</span>
			</p>
			<table class="table1" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td width="110">合同号</td>
					<td width="260" style="font-weight: inherit"><label id="agreementNo"></label></td>
					<td width="100">合同金额</td>
					<td width="260" style="font-weight: inherit"><label id="totalAmount"></label></td>
				</tr>

			</table>


			<p class="base-price">基本信息</p>
			<table class="table2" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td width="110px">新郎</td>
					<td width="240px" style="font-weight: inherit"><label id="groomName"></label></td>
					<td width="120px">新娘</td>
					<td  width="260px" style="font-weight: inherit"><label id="brideName"></label></td>

				</tr>
				<tr>
					<td>宴会厅</td>
					<td style="font-weight: inherit"><label id="hallName"></label></td>
					<td>婚礼日</td>
					<td style="font-weight: inherit"><label id="scheduleTime"></label></td>
				</tr>
				<tr>
					<td>套系</td>
					<td style="font-weight: inherit" ><label id="packageName"></label></td>
					<td >已收金额</td>
					<td style="font-weight: inherit"><label id="receiptAmount"></label></td>
				</tr>
				<tr>
					<td>乙方</td>
					<!--<td  style="border:none"> </td>-->
					<td colspan="3" style="border:none;font-weight: inherit" ><label id="partyB"></label></td>

				</tr>

			</table>

			<p class="base-price" style="margin-bottom:10px;margin-top:50px;padding-left:10px;">经过双方平等协商，现决定取消婚宴合同，处理办法如下</p>
			<table class="table3" width="100%" cellspacing="0" cellpadding="0">

				<tr>
					<td>是否取消婚礼</td>
					<td style="font-weight: inherit"><label id="isCancelWedding"></label></td>
					<td>是否退款</td>
					<td style="font-weight: inherit"><label id="isRefundsName"></label></td>
				</tr>
				<tr>
					<td>退款金额</td>
					<td colspan="3" style="border:none;font-weight: inherit"><label id="refundsAmount"></label></td>
				</tr>

			</table>


			<table class="table5" width="100%" cellspacing="0" cellpadding="0" style="margin-top:270px;">
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
                this.$axios.post('/order/getCancelPrint',this.id).then((res)=> {  //获取所有套系
                    //订单详细信息
                 let   orderVo =res.data.msg;
                    //订单详细信息
                    for(var i in orderVo){
                        $("#"+i).text(orderVo[i]);
                    }
                    $("#partyB").text(orderVo["companyRegistrationName"]);
                    //取消合同信息
                    let cancel = orderVo.hsAgreementCancelDTO;
                    $("#isCancelWedding").text("是");
                    if(cancel) {
                        $("#refundsAmount").text(cancel["refundsAmount"]);
                        if(cancel["isRefunds"] == 0){
                            $("#isRefundsName").text("否")
                        }else{
                            $("#isRefundsName").text("是")
                        }
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

