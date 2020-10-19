<template>
    <div>
      <div class="wrap weddingEOStencil" id="print">
    <p class="top_title" style="margin-left: 0;text-align: center">婚宴最终确认单</p>
    <table class="table1" width="100%" cellspacing="0" cellpadding="0">
        <tr class='blackBottom'>
            <td class="boldText">合同号</td>
            <td colspan="3" id="agreementNo"></td>
        </tr>
        <tr class='blackBorder '>
            <td class="boldText">新郎</td>
            <td id="groomName"></td>
            <td class="boldText">档期</td>
            <td id="scheduleTime"></td>
            <td class="boldText">门店</td>
            <td colspan="3" id="storeName"></td>
        </tr>
        <tr class='blackBorder'>
            <td class="boldText">新娘</td>
            <td id="brideName"></td>
            <td class="boldText">场次</td>
            <td id="scheduleTimeTypeName"></td>
            <td class="boldText">宴会厅</td>
            <td colspan="3" id="hallName"></td>
        </tr>
        <tr class='blackBorder '>
            <td class="boldText">主桌</td>
            <td id="mainTable"></td>
            <td class="boldText">副桌</td>
            <td id="sideTable"></td>
            <td class="boldText">套系</td>
            <td colspan="3" id="packageName"></td>
        </tr>
        <tr class='blackBorder boldText' id="menu">
            <td class='centerText' colspan="8" >宴会菜品</td>
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
            <td >制单</td>
            <td id="plannerName"></td>
            <td>财务</td>
            <td ></td>
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
                    let  hsAgreementEOList = agreementEOVo.hsAgreementEOList;
                    //菜单详细信息
                    let  hsAgreementEOMenuList = agreementEOVo.hsAgreementEOMenuList;

                    for (var i in agreementEOVo) {
                        $("#" + i).text(agreementEOVo[i]);
                    }
                    var str ="";
                    var totalTable = 0;
                    var mainTable = 0;
                    var drinksStr =""; //饮料及点心;
                    var arrangementStr ="";//宴会布置
                    var otherStr = "";
                    if(hsAgreementEOList){
                        for(var i = 0; i < hsAgreementEOList.length; i++){
                            if(hsAgreementEOList[i]["type"] == 0){
                                totalTable =hsAgreementEOList[i]["content"];
                            }else if( hsAgreementEOList[i]["type"] == 1){
                                mainTable =hsAgreementEOList[i]["content"];
                            }

                            if(hsAgreementEOList[i]["species"] == 2 ){
                                drinksStr +=" <tr class='blackBorder'>";
                                drinksStr +="<td colspan='2' class='boldText'>"+hsAgreementEOList[i]["typeName"]+"</td>";
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
                    let scheduleTime=this.dicData.HS_SECHEDULE_TIME_TYPE //场次
                    scheduleTime.forEach((e)=>{
                        if(e.dicValue==agreementEOVo["scheduleTimeType"]) {
                            $('#scheduleTimeTypeName').text(e.dicDesc)
                        }
                    })
                    var tableCount = 4;//一行显示几列菜单
                    if(hsAgreementEOMenuList){
                        var str ="";
                        for(var i = 0 ; i<hsAgreementEOMenuList.length;i++){
                            if(i == 0 || i % tableCount == 0){
                                str +="<tr class='blackBorder'>";
                            }
                            if(!jQuery.isEmptyObject(hsAgreementEOMenuList[i]["adjustName"])){
                                str += "<td colspan='2'>" + hsAgreementEOMenuList[i]["adjustName"] + "(换)" + "</td>";
                            }else {
                                str += "<td colspan='2'>" + hsAgreementEOMenuList[i]["name"] + "</td>";
                            }
                            if((i+1)% tableCount != 0 && (i+1) == hsAgreementEOMenuList.length){
                                var num1 = tableCount- (hsAgreementEOMenuList.length % tableCount);
                                for(var j = 0;j<num1;j++){
                                    str += "<td colspan='2'></td>";
                                }
                            }
                            if((i+1)% tableCount == 0 && i != 0){
                                str +="</tr>";
                            }
                        }
                        $("#menu").after(str);
                    }
                    $("#mainTable").text(mainTable);
                    $("#sideTable").text(totalTable -mainTable);

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

