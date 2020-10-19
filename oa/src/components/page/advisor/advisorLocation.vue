<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 顾问管理</el-breadcrumb-item>
                <el-breadcrumb-item>顾问定位</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="saleFollowUpTips">
            <span> （默认查询当前7天内的数据）</span>
        </div>
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            <el-form-item label="账户：" prop='account' >
                <el-input v-model="formInline.account" ></el-input>
            </el-form-item>
            <el-form-item label="起始日期：" prop='startDate'>
                <div class="block">
                    <el-date-picker
                        v-model="formInline.startDate"
                        type="date"
                        :editable="false"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        :picker-options="pickerBeginDateBefore">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="终止日期：" prop='endDate'>
                <el-tooltip class="item" effect="dark" content="终止日期为7天以内" placement="top-end">

                    <div class="block">
                        <el-date-picker
                            v-model="formInline.endDate"
                            type="date"
                            :editable="false"
                            placeholder="选择日期"  format="yyyy-MM-dd"
                            :picker-options="pickerBeginDateAfter">
                        </el-date-picker>
                    </div>
                </el-tooltip>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="locationList" border style="width: 100%">
            <el-table-column prop="userName" label="客户名称" ></el-table-column>
            <el-table-column prop="account" label="用户账号" ></el-table-column>
            <el-table-column prop="createTime" label="定位时间" :formatter="formTime" ></el-table-column>
            <el-table-column prop="address" label="地址"  width="300px"></el-table-column>
            <el-table-column prop="modelType" label="机型" ></el-table-column>
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

<script type="text/ecmascript-6">
    import  moment from 'moment'
    import { mapGetters } from 'vuex';
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
                locationList:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                formInline:{
                    account:'',
                    startDate:'',
                    endDate:''
                },
                pickerOptions0: {

                },
                pickerBeginDateBefore:{
                    disabledDate:(time)=>{
                        this.beforeTime=time.getTime()
                    }

                },
                pickerBeginDateAfter:{
                    disabledDate:(time)=>{
                        let beginDateVal = this.formInline.startDate;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                },
            }
        },
        methods: {
            onSubmit() {
                this.formInline.startDate=this.formInline.startDate?moment(this.formInline.startDate).format('YYYY-MM-DD'):''
                this.formInline.endDate=this.formInline.endDate?moment(this.formInline.endDate).format('YYYY-MM-DD'):''
                if(getDays(this.formInline.startDate,this.formInline.endDate)>7){
                    console.log(getDays(this.formInline.startDate,this.formInline.endDate))
                    this.$notify.error({
                        title: '错误',
                        message: '请重新选择时间范围，选取范围最多为7天！',
                        offset: 100
                    });
                }else {
                    this.initLocationList(this.tableData)
                }
            },
            resetForm(formName) {  //重置
                this.$refs[formName].resetFields();
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initLocationList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initLocationList(this.tableData)
            },
            initLocationList(data){
                this.$axios.get('/s//getUserGpsLogList',{params:data}).then((res)=> {
                    if (res.data.res == '0') {
                    this.pagination.total=res.data.msg.total;
                    this.pagination.pageNum=res.data.msg.pageNum;
                    this.pagination.pageSize=res.data.msg.pageSize;
                    this.locationList=res.data.msg.list;
                }
            })
            },
            formTime(row){
                return moment(row.createTime).format('YYYY-MM-DD')
            }
        },
        computed: {
            tableData(){
                return {
                    "pageNow": this.pagination.pageNow,
                    "pageSize": this.pagination.pageSize,
                    "account":this.formInline.account,
                    "startDate":this.formInline.startDate,
                    "endDate":this.formInline.endDate
                    }
                },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
       mounted(){
           this.formInline.startDate=moment().subtract(6,'days').format('YYYY-MM-DD');
           this.formInline.endDate=moment().format('YYYY-MM-DD');
           this.initLocationList(this.tableData)
       }
    }
</script>
