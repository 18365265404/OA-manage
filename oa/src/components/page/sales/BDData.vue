<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> BD数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>BD销售统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="saleFollowUpTips">
            <span> （默认查询当前30天内的数据）</span>
        </div>
               <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
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
            <el-table-column prop="bdAccount" label="账号"></el-table-column>
            <el-table-column prop="bdName" label="账户名"></el-table-column>
            <el-table-column prop="batchCount" label="批量数据">
            </el-table-column>
            <el-table-column prop="accurateCount" label="精准数据">
            </el-table-column>
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
    import  moment from 'moment'
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
                    endDate:''
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
                this.$loading({text:'拼命加载中'})
                this.$axios.get('/s/countBdData',{params:data}).then((res)=>{
                    if(res.status==200){
                        this.dialogTableVisible=true
                        this.bDTableData=res.data.msg.list
                        this.pagination.total=res.data.msg.total
                        this.pagination.pageSize=res.data.msg.pageSize
                        this.pagination.pageNum=res.data.msg. pageNum
                    }
                    this.$loading().close()
                })
            }
        },
        computed:{
            tableData(){
                return  {
                    "pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    startDate:this.formInline.startDate,
                    endDate:this.formInline.endDate
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
            this.initBdData(this.tableData);
        }

    }
</script>
<style>
    .demo-form-inline{
        text-align: center;
    }
</style>
