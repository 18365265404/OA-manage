<template>
    <div>
         <el-table v-loading="loading.pageList" element-loading-text="拼命加载中" :data="serviceTableData" border style="width: 100%">
            <el-table-column prop="operatorName" label="姓名" ></el-table-column>
            <el-table-column prop="currentTask" label="当前任务数" ></el-table-column>>
            <el-table-column prop="planTask" label="计划任务数"></el-table-column>
            <el-table-column prop="yesterdayLegacyTask" label="昨日遗留任务" ></el-table-column>
            <el-table-column prop="salesFollowupCount" label="销售跟进数"></el-table-column>
            <el-table-column prop="currentMonthArrivalStoreCount" label="本月到店"></el-table-column>
            <el-table-column prop="currentMonthOrderCount" label="本月成单"></el-table-column>
            <el-table-column prop="lastMonthArrivalStoreCount" label="上月到店"></el-table-column>
            <el-table-column prop="lastMonthOrderCount" label="上月成单"></el-table-column>
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
                                   :total="pagination.total">
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
            	loading:{
                    pageList:false,
                    detail:false
                },
                serviceTableData:[],//顾问列表
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                storeCitys:[],
                citys:[],
                cityNames:{
                    city:''
                },
                channelIds:{},
                cusIds:{}
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initServiceList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initServiceList(this.tableData)
            },
            initServiceList(data){
            	this.loading.pageList=true
                this.$axios.post('/customer/countCustomerServiceStaff',data).then((res)=> {
                    if (res.data.res == 0) {
                        this.pagination.total=res.data.msg.total;
                        this.pagination.pageNum=res.data.msg.pageNum;
                        this.pagination.pageSize=res.data.msg.pageSize;
                        this.serviceTableData=res.data.msg.list
                        this.loading.pageList=false
                    }
                     else{
                    	this.loading.pageList=false
                        this.$notify.error({
                            title: '错误',
                            message: res.data.msg,
                            offset: 100
                        });
                    }
                })
            }
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
            this.initServiceList(this.tableData)
        }

    }
</script>
<style>
	.page_pagination{
		text-align: right;
	}
</style>