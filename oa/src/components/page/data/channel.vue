<template>
    <div>
        <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>BD数据管理</el-breadcrumb-item>
            <el-breadcrumb-item>渠道统计报表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="saleFollowUpTips">
            查询日期: {{saveDate.startDate}}--------{{saveDate.endDate}}
            <span> （默认查询当前7天内的数据）</span>
        </div>
        <div>
            <el-form :inline="true" :model="researchChannelsTable" ref="researchChannelsTable" class="demo-form-inline">
                <el-row>
                    <el-col>
                        <el-form-item  prop='startDate' :label-width="researchChannelsTableWidth">
                            <div class="block">
                                <el-date-picker
                                    v-model="researchChannelsTable.startDate"
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
                        <el-form-item  prop='endDate' :label-width="researchChannelsTableWidth">
                            <el-tooltip class="item" effect="dark" content="终止日期为7天以内" placement="top-end">

                                <div class="block">
                                    <el-date-picker
                                        v-model="researchChannelsTable.endDate"
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

        <el-table :data="channelsTable" border style="width: 100%;" v-loading="loading2" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="渠道">
            </el-table-column>
            <el-table-column prop="cityName" label="城市">
                <template scope="scope">
                    <div>{{cityText(scope.row.cityCode)}}</div>
                </template>
            </el-table-column>
            <el-table-column v-for="col in cols" :prop="col.prop" :label="col.label">
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
        <el-table :data="cityCount" border style="width: 100%;margin-top: 30px" show-summary v-loading="loading2" element-loading-text="拼命加载中">
            <el-table-column prop="cityName" label="城市">
                <template scope="scope">
                    <div>{{cityText(scope.row.cityCode)}}</div>
                </template>
            </el-table-column>
            <el-table-column v-for="col in cols" :prop="col.prop" :label="col.label">
            </el-table-column>
        </el-table>





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
                beforeTime:'',
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                    this.beforeTime=time.getTime()
            }
        },
                loading2:false,
                saveDate:{
                    endDate:'',
                    startDate:''
                },
            pickerBeginDateAfter:{
                disabledDate:(time)=>{
                    let beginDateVal = this.researchChannelsTable.startDate;
                    if (beginDateVal) {
                        return time.getTime() < beginDateVal;
                    }
                }
            },
                researchChannelsTable:{
                    startDate:'',
                    endDate:''
                },
                scheduleTableData:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                channelsTable:[],
                cols:[
                ],
                researchChannelsTableWidth:'120px',
                citys:[],
                cityCount:[
                ]
            }
        },
        methods: {
            submitChannelsTable(){
                this.researchChannelsTable.startDate=this.researchChannelsTable.startDate?moment(this.researchChannelsTable.startDate).format('YYYY-MM-DD'):''
                this.researchChannelsTable.endDate=this.researchChannelsTable.endDate?moment(this.researchChannelsTable.endDate).format('YYYY-MM-DD'):''
                if(getDays(this.researchChannelsTable.startDate,this.researchChannelsTable.endDate)>7){
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为7天！',
                        offset: 100
                    });
                }else {
                    this.initChannelList(this.tableData)
                    this.saveDate.startDate=this.researchChannelsTable.startDate
                    this.saveDate.endDate=this.researchChannelsTable.endDate
                }
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            startDateChange(val){
                this.researchChannelsTable.startDate = val
            },
            endDateChange(val){
                this.researchChannelsTable.endDate = val
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initChannelList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initChannelList(this.tableData)
            },
            initChannelList(data){
                this.loading2=true
                this.$axios.post('/customer/getChannelStatisticsList',data).then((res)=>{
                    if(res.data.res == '0'){
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.channelsTable=res.data.msg.list
                        this.objectToArray(res.data.msg.list[0])
                        this.initCityChild();
                        this.count();
                    }
                    this.loading2=false
                })
            },
            initCityChild(){
                this.cityCount=this.citys
                let {keys, values, entries} = Object;
                for (let [key, value] of entries(this.channelsTable[0])) {
                    if (key.length == 10) {
                        this.cityCount.forEach((e)=>{
                            e[key]=0
                            this.$set(this.cityCount, key, 0 )
                        })
                    }
                }
            },
            objectToArray(item){
                this.cols=[]
                let {keys, values, entries} = Object;
                let ary=[];
                for (let [key, value] of entries(item)) {
                    if(key.length==10){
                        ary.push([key, value]);
                        let a = {prop:key,label:key}
                        this.cols.push(a)
                    }


                }
            }


            ,
            addCount(row){
                let {keys, values, entries} = Object;
                let num=null;
                for (let [key, value] of entries(row)) {
                    if(key.length==10){
                        num+=value
                    }}
              return   num

            },
            cityText(data){
                let cityName;
                this.citys.forEach((n)=>{
                    if( n.cityCode==data){
                        cityName = n.cityName
                    }
                })
                return cityName

            },
            initCities(){
                this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
                        if(res2.status == 200){
                            this.citys =  res2.data.msg;
                            this.cityCount=res2.data.msg;
                            }})
            },
            count(){
                let {keys, values, entries} = Object;
                this.channelsTable.forEach((e)=>{
                    this.cityCount.forEach((n)=>{
                        if(e.cityCode==n.cityCode){
                            for (let [key, value] of entries(e)) {
                                if (key.length == 10) {
                                    this.$set(this.cityCount, key, n[key]+=e[key] )
                                }
                            }
                        }
                    })
                })
                this.cityCount=this.cityCount.concat([])
            }
        },
        mounted(){
            this.researchChannelsTable.startDate=moment().subtract(6,'days').format('YYYY-MM-DD');
            this.researchChannelsTable.endDate=moment().format('YYYY-MM-DD');
            this.saveDate.startDate=this.researchChannelsTable.startDate
            this.saveDate.endDate=this.researchChannelsTable.endDate
            this.initChannelList(this.tableData)
            this.initCities();
        },
        computed:{
            tableData(){
                return {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    'dateTimeStar':this.researchChannelsTable.startDate,
                    'dateTimeStop':this.researchChannelsTable.endDate}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        }
    }
</script>
