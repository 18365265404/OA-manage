<template>
	<div>
        <div class="viewReceipt" id="print"  v-show="!isPrintPage" >
            <p class="number "><label style="font-weight:bold; ">编号</label> <label style="padding-right: 30px;font-weight: inherit;text-align: left"  id="receiptNo">            {{writeReceiptsData.receiptNo}}
            </label></p>
            <p class="top_title">
                <!--<img src="../jsimgcss/images/agreement/minTitle.png" alt="" />-->
                <span>收款收据</span>
            </p>
            <table class="table1" width="100%" cellspacing="0" cellpadding="0">
                <tr class="tr1">
                    <td>付款方</td>
                    <td colspan="4" style="font-weight: inherit"><label   id="drawee">{{row.dayeeName}}</label></td>
                    <td style="width:140px">订单（合同）编号</td>
                    <td colspan="2"  style="font-weight: inherit;text-align: left"><label   id="number">{{row.agreementNo}}</label></td>
                </tr>
                <tr>
                    <td colspan="6">付款方式</td>
                    <td colspan="2">金额</td>
                </tr>
                <tr v-for="item in writeReceiptsData.receiptArray" v-show="item.type!==4&&item.type!==5">
                    <td colspan="6" style="font-weight: inherit;text-align: center">{{statusText(item.type,'HS_PAYMENT_TYPE')}}</td>
                    <td colspan="2" style="font-weight: inherit;text-align: center">{{item.money}}</td>
                </tr>

                <tr>
                    <td>合计</td>
                    <td style="font-weight:100">大写</td>
                    <td colspan="4" style="font-weight: inherit;text-align: center" id="dxTotalAmount">{{DX(totalAmount)}}</td>
                    <td colspan="2" style="font-weight: inherit;text-align: center"  id="totalAmount">{{totalAmount}}</td>
                </tr>
                <tr>
                    <td>档期</td>
                    <td colspan="2" style="font-weight: inherit"><label id="scheduleTime">{{row.scheduleTime}}</label></td>
                    <td>门店</td>
                    <td  colspan="2"  style="font-weight: inherit"><label id="storeName">{{row.storeName}}</label></td>
                    <td style="width: 10px">厅</td>
                    <td  style="font-weight: inherit"><label id="banquetHallName">{{row.hallName}}</label></td>
                </tr>
                <tr>
                    <td>备注</td>
                    <td colspan="7" style="font-weight: inherit"><label id="remark" v-for="item in writeReceiptsData.receiptArray" v-show="item.type==4||item.type==5">{{statusText(item.type,'HS_PAYMENT_TYPE')}}{{item.money}}元{{row.remark}}</label>({{writeReceiptsData.remark}})</td>
                </tr>
                <tr>
                    <td>收款日期</td>
                    <td colspan="4" style="font-weight: inherit"> <label id="createTime">{{nowDay()}}</label></td>
                    <td>经办人</td>
                    <td colspan="2" style="font-weight: inherit"> <label id="creatorName">{{userName}}</label></td>
                </tr>
            </table>
        </div>

        <div class="viewReceipt" id="print1" v-show="isPrintPage"  style="padding-top: 0">
            <p class="number " ><label style="font-weight:bold; "></label> <label style="padding-right: 30px;font-weight: inherit;"  ></label></p>
            <p class="number "> </p>
            <table class="table2" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 20px">
                <tr class="tr1">
                    <td></td>
                    <td colspan="2" class="print " style="font-weight: inherit;width: 200px;"><label   id="drawee1">{{row.dayeeName}}</label></td>
                    <td style="width:50px"></td>
                    <td colspan="4"  style="font-weight: inherit;width: 200px;padding-right: 70px;text-align: right"><label   id="number1">{{row.agreementNo}}</label></td>
                </tr>
                <tr style="height: 45px">
                    <td colspan="6"></td>
                    <td colspan="2"></td>
                </tr>
                <tr v-for="item in writeReceiptsData.receiptArray" style="height: 32px">
                    <td></td>
                    <td colspan="5">{{statusText(item.type,'HS_PAYMENT_TYPE')}}</td>
                    <td colspan="3" style="font-weight: inherit;text-align: left;;padding-left: 10px">{{item.money}}</td>
                <tr v-show="3-writeReceiptsData.receiptArray.length" style="height: 32px"><td></td></tr>
                <tr v-show="2-writeReceiptsData.receiptArray.length>0" style="height: 32px"><td></td></tr>
                <tr class="printAmountClass">
                    <td></td>
                    <td colspan="5" style="font-weight: inherit;" id="dxTotalAmount1" >{{DX(totalAmount)}}</td>
                    <td colspan="1" style="font-weight: inherit;text-align: left"  id="totalAmount1">{{totalAmount}}</td>
                </tr>
                <tr>
                    <td colspan="1"></td>
                    <td colspan="1" style="font-weight: inherit"><label id="scheduleTime1">{{row.scheduleTime}}</label></td>
                    <td  colspan="4"  style="font-weight: inherit;text-align: left;width: 60px"><label id="storeName1" style="text-align: left; display: block;">{{row.storeName}}</label></td>
                    <td colspan="1" style="font-weight: inherit;text-align: left">&nbsp;&nbsp;<label id="banquetHallName1"  style="width: 86px; display: block;">{{row.hallName}}</label></td>
                    <td ></td>
                </tr>
                <tr style="height: 40px">
                    <td colspan="1"></td>
                    <td colspan="7" style="font-weight: inherit">
                        <label id="remark1" v-for="item in writeReceiptsData.receiptArray" v-show="item.type==4||item.type==5">{{statusText(item.type,'HS_PAYMENT_TYPE')}}{{item.money}}元{{row.remark}}</label>{{(writeReceiptsData.remark)}}</label></td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="4" style="font-weight: inherit"> <label id="createTime1">{{nowDay()}}</label></td>
                    <td  style="font-weight: inherit;width: 100px"></td>
                    <td colspan="3" style="text-align: left" ><label id="creatorName1">{{userName}}</label> </td>
                </tr>
            </table>
        </div>

	</div>

</template>
<script type="text/ecmascript-6">
    import $ from 'jQuery'
    require("../../../utils/jquery.jqprint-0.3");
    import  moment from 'moment'
    import { mapGetters } from 'vuex';
    export default {
        props:{
            hsOrderId:{
                type:String
            },
            isPrintPage:{
                type:Boolean
            },
            paymentRows:{
                type:Object
            },
            writeReceiptsData:{
                type:Object
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
            row(){
                return this.paymentRows
            },
            receiptsData(){
                return this.writeReceiptsData
            },
            ...mapGetters([
                'dicData'
            ]),
            userName(){
                return JSON.parse(localStorage.getItem("userInfo")).nickName
            },
            totalAmount(){
                let account=0;
                    this.writeReceiptsData.receiptArray.forEach((e)=>{
                    account+=parseInt(e.money)
                })
                return account
            }
        },
        methods:{
            DX(n) {
                if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)){return "数据非法"};
                var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
                n += "00";
                var p = n.indexOf('.');
                if (p >= 0)
                    n = n.substring(0, p) + n.substr(p+1, 2);
                unit = unit.substr(unit.length - n.length);
                for (var i=0; i < n.length; i++)
                    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
                return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元（圆）整");
            },
            nowDay(){
                return moment().format('YYYY-MM-DD')
            },
            statusText(status,statusName){ //状态值匹配
                let n;
                this.dicData[statusName].forEach((e)=>{
                    if(e.dicValue==status) {
                        n=e.dicDesc
                    }
                })
                return n
            },
            initData(){

                if(this.PrintPage){
                    $("#print1").jqprint();
                    }

//                //加载收据信息
//                for (var i in hsReceipt) {
//
//                    $("#" + i).text(hsReceipt[i]);
//                    if (i == "createTime") {
//                        $("#" + i).text(getSmpFormatDateByLong(hsReceipt[i], false));
//                    }
//                }
//                //加载收据信息
//                for (var i in hsReceipt) {
//                    $("#" + i + "1").text(hsReceipt[i]);
//                    if (i == "createTime") {
//                        $("#" + i + "1").text(getSmpFormatDateByLong(hsReceipt[i], false));
//                    }
//                }
//                var details = hsReceipt["hsAgrFundsRcpPayVo"];
//                //收据明细
//                var trNumber = 2;
//                var totalAmount = 0;
//                if (details) {
//                    var num  = 0 ;
//                    for (var j = 0; j < details.length; j++) {
//                        if(details[j]["paymentType"] != 4 && details[j]["paymentType"] != 5) {
//                            totalAmount += parseFloat(details[j]["amount"] == "" ? 0 : details[j]["amount"]);
//                            $(".table1 tr:eq(" + (trNumber + num) + ")  td:nth-child(1)").text(details[j]["paymentTypeName"]);
//                            $(".table1 tr:eq(" + (trNumber + num) + ")  td:nth-child(2)").text(details[j]["amount"]);
//                            $(".table2 tr:eq(" + (trNumber + num) + ")  td:nth-child(1)").text(details[j]["paymentTypeName"]);
//                            $(".table2 tr:eq(" + (trNumber + num) + ")  td:nth-child(2)").text(details[j]["amount"]);
//                            num++;
//                        }else{
//                            $("#remark").text(hsReceipt["supportReceiptNo"] +"+"+details[j]["paymentTypeName"]+"已抵用"+details[j]["amount"] +"元;"+hsReceipt["remark"]);
//                            $("#remark1").text(hsReceipt["supportReceiptNo"] +"+"+details[j]["paymentTypeName"]+"已抵用"+details[j]["amount"] +"元;"+hsReceipt["remark"]);
//                        }
//                    }
//                }
//
//                $("#dxTotalAmount").text(DX(totalAmount));
//                $("#totalAmount").text(totalAmount);
//                $("#dxTotalAmount1").text(DX(totalAmount));
//                $("#totalAmount1").text(totalAmount);
//                if (this.GetQueryString("operate") == 0) {
//                    if(this.PrintPage){
//                        printJS({
//                            printable:'print1',
//                            type:'html',
//                            font_size:'11pt',
//                            honorColor:true,
//                            font:'SimSun'
//                        })
//                    }
//                    $("#print1").hide();
//                } else {
//                    $("#print1").hide();
//                }
            },
        },
        mounted(){
            this.initData();
        }
    }
</script>

