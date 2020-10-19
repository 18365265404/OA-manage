<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> BD数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>BD销售数据统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
            <el-form-item label="账户：" prop='salesAccount' :label-width="formLabelWidth">
                <el-input v-model="formInline.salesAccount">
                </el-input>
            </el-form-item>
            <el-form-item label="起始日期：" prop='startDate'>
                <div class="block">
                    <el-date-picker
                        v-model="formInline.startDate"
                        type="date"
                        placeholder="选择日期" @change="startDateChange"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="终止日期：" prop='endDate'>
                <div class="block">
                    <el-date-picker
                        v-model="formInline.endDate"
                        type="date"
                        placeholder="选择日期" @change="endDateChange"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="bDTableData" border style="width: 100%">
            <el-table-column prop="bdName" label="BD名"></el-table-column>
            <el-table-column prop="salesName" label="销售名"></el-table-column>
            <el-table-column prop="salesAccount" label="销售账号"></el-table-column>
            <el-table-column prop="arrivalStoreCount" label="到店量"></el-table-column>
            <el-table-column prop="validCount" label="有效量"></el-table-column>
            <el-table-column prop="orderCount" label="成单量"></el-table-column>
        </el-table>
        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col >
                <div class="grid-content bg-purple">
                    <el-pagination class='page_pagination'
                                   @size-change="handleSizeChange"
                                   @current-change="handleCurrentChange"
                                   :current-page="pagination.pageNum"
                                   :page-sizes="[10, 25,50 ,100]"
                                   :page-size="pagination.pageSize"
                                   layout="total, sizes, prev, pager, next"
                                   :total="pagination.total">>
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script type="text/ecmascript-6">
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default{
        data(){
            return {
                bDTableData:[],
                formLabelWidth:'80px',
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                formInline:{
                    startDate:'',
                    endDate:'',
                    salesAccount:''
                },
                pickerOptions0: {

                }
            }
        },
        methods:{
            startDateChange(val){
                this.formInline.startDate = val
            },
            endDateChange(val){
                this.formInline.endDate = val
            },
            onSubmit() {
                this.initBdData(this.tableData);
                this.resetForm(this.formInline);
            },
            resetForm(formName) {  //重置
                this.$refs[formName].resetFields();
            },
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.initBdData(this.tableData)

            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.initBdData(this.tableData)
            },
            initBdData(data){
                this.$axios.get('/s/countBdSales',{params:data}).then((res)=>{
                    if(res.status==200){
                        this.dialogTableVisible=true
                        this.bDTableData=res.data.msg.list
                        this.pagination.total=res.data.msg.total
                        this.pagination.pageSize=res.data.msg.pageSize
                        this.pagination.pageNum=res.data.msg. pageNum
                    }
                })
            }
        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    startDate:this.formInline.startDate,
                    endDate:this.formInline.endDate,
                    salesAccount:this.formInline.salesAccount
                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
            this.initBdData(this.tableData);
        }

    }
</script>
<style>
    .demo-form-inline{
        text-align: center;
    }
</style>
