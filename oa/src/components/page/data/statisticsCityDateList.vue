<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>数据管理</el-breadcrumb-item>
            <el-breadcrumb-item>城市数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="saleFollowUpTips">
            查询日期: {{saveDate.startDate}}--------{{saveDate.endDate}}
            <span> （默认查询当前7天内的数据）</span>
        </div>
        <div>
            <el-form :inline="true" :model="researchCityCustomerList" ref="researchCityCustomerList" class="demo-form-inline">
                <el-row>
                    <el-col>
                        <el-form-item  prop='startDate' :label-width="researchCityCustomerListWidth">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchCityCustomerList.startDate"
                                    type="date"
                                    :editable="false"
                                    placeholder="起始日期"
                                    format="yyyy-MM-dd"
                                    :picker-options="pickerBeginDateBefore"
                                    size="small"
                                >
                                </el-date-picker>
                            </div>
                        </el-form-item>
                        <el-form-item  prop='endDate' :label-width="researchCityCustomerListWidth">
                            <el-tooltip class="item" effect="dark" content="终止日期为7天以内" placement="top-end">

                                <div class="block">
                                    <el-date-picker
                                        v-model="researchCityCustomerList.endDate"
                                        type="date"
                                        :editable="false"
                                        placeholder="终止日期"  format="yyyy-MM-dd"
                                        :picker-options="pickerBeginDateAfter"
                                        size="small"
                                    >
                                    </el-date-picker>
                                </div>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitChannelsTable">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>


            </el-form>
        </div>

        <el-table :data="ReceivablesConfirmList" border style="width: 100%"
                  v-loading="loading2"
                  element-loading-text="拼命加载中">
            <el-table-column prop="cityName" label="城市" width="120px" ></el-table-column>
            <el-table-column prop="statusName" label="状态" >
            </el-table-column>
            <el-table-column v-for="col in cols" :prop="col.prop" :label="col.label">
                <template scope="scope">
                    {{initRowText(scope.row,col.prop)}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="累积量">
                <template scope="scope">
                    {{addCount(scope.row)}}
                </template>
            </el-table-column>
        </el-table>
        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col>
                <div class="grid-content bg-purple">
                    <el-pagination class='page_pagination'
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="pagination.pageNum"
                                   :page-sizes="[10, 25,50 ,100]"
                                   :page-size="pagination.pageSize"
                                   layout="total, sizes, prev, pager, next"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<style>
    .saleFollowUpTips{
        font-size: 14px;
        margin: 10px 0;
    }
    .saleFollowUpTips span{
        color: red;
    }
</style>
<script type="text/ecmascript-6">
    import  moment from 'moment'
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    function getDays(strDateStart,strDateEnd){
        var strSeparator = "-"; //日期分隔符
        var oDate1;
        var oDate2;
        var iDays;
        oDate1= strDateStart.split(strSeparator);
        oDate2= strDateEnd.split(strSeparator);
        var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
        var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
        iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
        return iDays ;
    }
    export default{
        data(){
            return {
                loading2: true,
                ReceivablesConfirmList:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                cols:[],
                saveDate:{
                    endDate:'',
                    startDate:''
                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.researchCityCustomerList.startDate;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }
                },
                researchCityCustomerList:{
                    startDate:'',
                    endDate:''
                },
                researchCityCustomerListWidth:'120px',
                citys:[],
                cityCount:[
                ]
            }
        },
       methods: {
           initRowText(row,name){
             return  row[name]?row[name]:0
           },
           submitChannelsTable(){
               this.researchCityCustomerList.startDate=this.researchCityCustomerList.startDate?moment(this.researchCityCustomerList.startDate).format('YYYY-MM-DD'):''
               this.researchCityCustomerList.endDate=this.researchCityCustomerList.endDate?moment(this.researchCityCustomerList.endDate).format('YYYY-MM-DD'):''
               if(getDays(this.researchCityCustomerList.startDate,this.researchCityCustomerList.endDate)>7){
                   this.$notify.error({
                       title: '错误',
                       message: '请重新选择时间范围，选取范围最多为7天！',
                       offset: 100
                   });
                   this.resetForm('researchCityCustomerList')
               }else {
                   this.initCityHsCustomerStatisticsList(this.tableData)
                   this.saveDate.startDate=this.researchCityCustomerList.startDate
                   this.saveDate.endDate=this.researchCityCustomerList.endDate
                   this.resetForm('researchCityCustomerList')

               }
           },
           resetForm(formName){
               this.$refs[formName].resetFields();
           },
           endDateChange(val){
               this.researchCityCustomerList.endDate = val
           },
           objectToArray(item){
               this.cols=[]
               let {keys, values, entries} = Object;
               let ary=[];
               for (let [key, value] of entries(item)) {
                   if(key.length==10&&key!=='statusName'){
                       ary.push([key, value]);
                       let a = {prop:key,label:key}
                       this.cols.push(a)
                   }


               }},
           addCount(row){
               let {keys, values, entries} = Object;
               let num=null;
               for (let [key, value] of entries(row)) {
                   if(key.length==10&&key!=='statusName'){
                       num+=value
                   }}
               return   num

           },
           handleSizeChange(val) {
               this.pagination.pageSize = val;
               this.initCityHsCustomerStatisticsList(this.tableData)
           },
           handleCurrentChange(val) {
               this.pagination.pageNow = val;
               this.initCityHsCustomerStatisticsList(this.tableData)
           },
           initCityHsCustomerStatisticsList(data){
               this.$axios.post('/customer/cityHsCustomerStatisticsList',data).then((res)=> {
                   this.loading2=false;
                   if (res.data.res == '0') {
                       this.pagination.total=res.data.msg.total;
                       this.pagination.pageNum=res.data.msg.pageNum;
                       this.pagination.pageSize=res.data.msg.pageSize;
                       this.ReceivablesConfirmList=res.data.msg.list;
                       this.objectToArray(res.data.msg.list[0])
                   }else {
                       this.$notify.error({
                           title: '错误',
                           message: res.data.msg,
                           offset: 100
                       });
                   }
               })
               this.loading2=true;
           }
       },
        computed:{
            tableData(){
                return {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'dateTimeStar':this.researchCityCustomerList.startDate,
                    'dateTimeStop':this.researchCityCustomerList.endDate}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
            this.researchCityCustomerList.startDate=moment().subtract(6,'days').format('YYYY-MM-DD');
            this.researchCityCustomerList.endDate=moment().format('YYYY-MM-DD');
            this.saveDate.startDate=this.researchCityCustomerList.startDate
            this.saveDate.endDate=this.researchCityCustomerList.endDate
            this.initCityHsCustomerStatisticsList(this.tableData)
        }
    }
</script>
