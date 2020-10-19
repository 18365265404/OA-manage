<template>
    <div>
    <div class="wrap wedTime" id="print" >
    <p class="top" style="padding-top:5px;">
        <!--<img src="../jsimgcss/images/agreement/title.png" alt="" style="width:200px;float:left;margin-top:-10px;"/>-->
        <span style="margin-left:240px; margin-right:20px;">附件1</span>
        <span>服务项目</span>
    </p>

     <div class="weddingRemarkDiv "></div>
     <div class="weddingArrangementDiv"></div>

    <table class="table5" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;">
        <tr>
            <td></td>
            <td></td>
            <td>甲方确认签字</td>
            <td><input class ="inputS"></td>
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
                    //服务项目详细信息
                    let  serviceItemVo = res.data.msg;
                    let hsAgrPkgServiceContentVo =serviceItemVo["hsAgrPkgServiceContentList"];
                    let  hsAgrPackageMenuVo =serviceItemVo["hsAgrPackageMenuList"];
                    let  hsAgrPkgSupplementMattersVo = serviceItemVo["hsAgrPkgSupplementMattersList"];
                    var cityCode = serviceItemVo["cityCode"];
                    //加载服务项目
                    for(var i in serviceItemVo){
                        $("#"+i).text(serviceItemVo[i]);
                    }
                    let wedType=this.dicData.HS_PACKAGE_SERVICE_CONTENT_TYPE
                    if(hsAgrPkgServiceContentVo != null){
                        var strRemark ="";//婚宴内容
                        var strDiscount ="";//优惠内容
                        var number =1;//婚宴内容
                        var strOther ="";//其它服务项目
                        var numberArrangement =1;
                        var type = 1;
                        var inumber  = 1;
                        var strOtherDiscount="";
                        for(var j = 0;j<hsAgrPkgServiceContentVo.length;j++){
                            let weedingType =hsAgrPkgServiceContentVo[j]["type"];//婚宴服务项目类型
                            let weddingContent  = hsAgrPkgServiceContentVo[j]["content"];//婚宴服务项目名
                            let weddingRemark  = jQuery.isEmptyObject(hsAgrPkgServiceContentVo[j]["remark"]) ? "":hsAgrPkgServiceContentVo[j]["remark"];//婚宴服务项目备注
                            console.log(weddingRemark)
                            let weedingTypeName = '';//婚宴服务项目类型名字典类型
                            wedType.map(function (e) {
                                if(e.dicValue==weedingType){
                                    weedingTypeName=e.dicDesc
                                }
                            })
                            let weddingAdustable = hsAgrPkgServiceContentVo[j]["adjustable"];//是否可修改服务内容
                            let weddingAmount =jQuery.isEmptyObject(hsAgrPkgServiceContentVo[j]["quantity"])? "":hsAgrPkgServiceContentVo[j]["quantity"];//修改后价格
                            let weddingMinAmount =jQuery.isEmptyObject(hsAgrPkgServiceContentVo[j]["minQuantity"])? "":hsAgrPkgServiceContentVo[j]["minQuantity"];//修改前价格
                            let weddingUnit = hsAgrPkgServiceContentVo[j]["unit"]?hsAgrPkgServiceContentVo[j]["unit"]:'';//婚宴服务项目单位
                            let  weddingRemarkStr ="";
                            if(weedingType == 0 || (weedingType == 9 && cityCode =='110100')){//婚宴内容
                                if(number == 1){
                                    strRemark += '<p class="con">'+weedingTypeName+'</p>';
                                }
                                if(weddingContent.indexOf("喜宴菜品") >= 0){
                                    if(hsAgrPackageMenuVo != null){
                                        var menu ="";
                                        for(var k =0;k<hsAgrPackageMenuVo.length;k++){

                                            menu += hsAgrPackageMenuVo[k]["name"] ;
                                            if(k != hsAgrPackageMenuVo.length -1 ){
                                                menu +="、";
                                            }
                                            if(hsAgrPackageMenuVo[k]["adjustName"]!=null && hsAgrPackageMenuVo[k]["adjustName"]!=""){
                                                strDiscount += "," + hsAgrPackageMenuVo[k]["name"]+"升级为" +hsAgrPackageMenuVo[k]["adjustName"] ;
                                            }
                                        }
                                    }
                                    strRemark +='<p class="con-thing"> '+number+' '+weddingContent + ": "+ menu + '</p>';
                                }else{
                                    var str ="";
                                    var amount ="";
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
                                    strRemark += '<p class="con-thing"> ' + number + ' ' + weddingContent +  weddingRemarkStr + str + '</p>';


                                }
                                number++;

                            }else {//其它
                                if(numberArrangement == 1){
                                    type = weedingType;
                                }
                                if(weedingType == type){
                                    if(numberArrangement == 1){
                                        strOther += '<p class="con">'+weedingTypeName+'</p><p class="con-thing">'+inumber +" ";
                                    }

                                    if(weddingRemark !=null && weddingRemark != ""){
                                        weddingRemarkStr = "("+weddingRemark+")";
                                    }
                                    strOther +=  weddingContent + weddingRemarkStr ;
                                    if(weddingAmount != null && weddingAmount != ""){
                                        if(weddingAmount != weddingMinAmount) {
                                            strOtherDiscount += weddingContent +"多送"+(weddingAmount - weddingMinAmount) + weddingUnit +",";
                                            strOther += weddingMinAmount + weddingUnit;
                                        }else{
                                            strOther += weddingMinAmount + weddingUnit;
                                        }
                                    }
                                    if( j != hsAgrPkgServiceContentVo.length -1 ){
                                        strOther +=",";
                                    }else{
                                        strOtherDiscount = (strOtherDiscount.slice(strOtherDiscount.length-1)==',')?strOtherDiscount.slice(0,-1):strOtherDiscount;
                                        if(strOtherDiscount!="") {
                                            strOther += '<p class="con-thing">2 免费升级或赠送项：' + strOtherDiscount + '</p>';
                                            strOtherDiscount = "";
                                        }
                                    }

                                    numberArrangement++;
                                }else {

                                    strOther=(strOther.slice(strOther.length-1)==',')?strOther.slice(0,-1):strOther;
                                    if(strOtherDiscount!=""){
                                        strOtherDiscount = (strOtherDiscount.slice(strOtherDiscount.length-1)==',')?strOtherDiscount.slice(0,-1):strOtherDiscount;
                                        strOther += '<p class="con-thing">2 免费升级或赠送项：' + strOtherDiscount  + '</p>';
                                        strOtherDiscount = "";
                                    }

                                    strOther += '</p><p class="con">'+weedingTypeName+'</p><p class="con-thing">'+inumber+" ";
                                    strOther += weddingContent ;
                                    if(weddingAmount != null && weddingAmount != ""){
                                        if(weddingAmount != weddingMinAmount) {
                                            strOtherDiscount += weddingContent +"多送"+(weddingAmount - weddingMinAmount) + weddingUnit +",";
                                            strOther += weddingMinAmount + weddingUnit;
                                        }else{
                                            strOther += weddingMinAmount + weddingUnit;
                                        }
                                    }
                                    strOther +=",";
                                    type = weedingType;

                                }

                            }
                        }
                    }
                    //婚宴内容优惠不为空
                    if(strDiscount != ""){
                        strRemark += '<p class="con-thing">' + number + ' 免费升级或赠送项：' + strDiscount + '</p>';
                    }
                    $(".weddingRemarkDiv").append(strRemark);//婚宴内容
                    $(".weddingArrangementDiv").append(strOther);//其它
                    var supplement = "";
                    if(hsAgrPkgSupplementMattersVo != null && hsAgrPkgSupplementMattersVo != "" ){
                        supplement += '<p class="con">补充事项</p>';
                        var number = 1;
                        for(var i = 0;i<hsAgrPkgSupplementMattersVo.length;i++){
                            supplement += '<p class="con-thing">'+number +'、' + hsAgrPkgSupplementMattersVo[i]["content"]+'</p>';
                            number++;
                        }
                    }
                    $(".weddingArrangementDiv").append(supplement);//补充事项
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

