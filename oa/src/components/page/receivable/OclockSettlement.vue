<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>付款管理</el-breadcrumb-item>
                <el-breadcrumb-item>打卡结算</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table :data="duplicateDataList" border style="width: 100%" v-loading="loading.pageList" element-loading-text="拼命加载中" >
            <el-table-column prop="orderNo" label="顾问账号"></el-table-column>
            <el-table-column prop="partyA" label="打卡次数"></el-table-column>
            <el-table-column prop="creatorName" label="收益金额"></el-table-column>
            <el-table-column prop="creatorName" label="操作"></el-table-column>
            </el-table>
        <el-row :gutter="20" class='table_bottom' type='flex' justify='space-between'>
            <el-col>
            </el-col>
            <el-col >
                <div class="grid-content bg-purple">
                    <el-pagination class='page_pagination' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.pageNum" :page-sizes="[10, 25,50 ,100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next" :total="pagination.total">>
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
                loading:{
                    pageList:false,
                    detail:false
                },
                duplicateDataList:[],
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pagination.pageSize=val;
                this.getAllDuplicateDataList(this.tableData);
            },
            handleCurrentChange(val) {
                this.pagination.pageNow=val;
                this.getAllDuplicateDataList(this.tableData);
            },
            getAllDuplicateDataList(data){
                this.loading.pageList=true
                this.$axios.post('/b/getOclockBillingRecordsList',data).then((res)=>{
                    if(res.data.res == 0){
                    this.loading.pageList=false
                    this.duplicateDataList = res.data.msg.list
                    this.pagination.total=res.data.msg.total;
                    this.pagination.pageNum=res.data.msg.pageNum;
                    this.pagination.pageSize=res.data.msg.pageSize;
                }
            })
            },
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])

        },
        mounted(){
            this.getAllDuplicateDataList(this.tableData);
        }
    }
</script>
<style>
    .page_pagination{
        text-align: right;
    }
    </style>
