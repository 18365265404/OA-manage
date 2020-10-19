<template>
    <div>
        <!--查询录音!-->
        <el-row>
            <el-col>
                <el-form :inline="true">
                    <el-form-item label="账号">
                        <el-input v-model="research.account"></el-input></el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="researchTable">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--录音列表-->
        <el-table
            ref="multipleTable"
            :data="logTable"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column prop="account" label="账号" ></el-table-column>
            <el-table-column prop="operatorName" label="账号名" ></el-table-column>>
            <el-table-column prop="positionName" label="角色"></el-table-column>
            <el-table-column prop="positionCitys" label="城市" >
                <template scope="scope">
                    <div>{{cityText(scope.row.positionCitys)}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="210px">
                <template scope="scope">
                    <span>{{formTime(scope.row.createTime)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="localFiles" label="本地文件数"></el-table-column>
            <el-table-column prop="dbLatestCreateTime" label="数据库最新一条创建时间" width="210px">
                <template scope="scope">
                    <span>{{formTime(scope.row.dbLatestCreateTime)}}</span>
                </template>
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
                logTable:[],//顾问列表
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                research:{
                    account:''
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initLogList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initLogList(this.tableData)
            },
            initLogList(data){
                this.$axios.post('/customer/getRecordingFileErrorLogList',data).then((res2)=> {
                    if (res2.status == 200) {
                        this.pagination.total=res2.data.msg.total;
                        this.pagination.pageNum=res2.data.msg.pageNum;
                        this.pagination.pageSize=res2.data.msg.pageSize;
                        this.logTable=res2.data.msg.list
                    }
                })
            },
            researchTable(){
                this.initLogList(this.tableData)
            },
            formTime(row){
                return row?formatTime(row):row
            },
            cityText(data){
                if(data){
                    let cityGroup=data.split(',')
                    let cityGroupName=[]
                    cityGroup.forEach((n)=>{
                        this.CityLists.forEach((b)=>{
                            if(b.cityCode==n){
                                cityGroupName.push(b.cityName)
                            }
                        })
                    })
                    cityGroupName=cityGroupName.join(',')
                    return cityGroupName
                }else {

                }

            },
            initCityList(){
                this.$axios.get('/b/getOpenCityLists').then((res2)=>{
                    if(res2.status==200){
                        this.CityLists=res2.data.msg
                    }
                })
            }
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow, "pageSize":this.pagination.pageSize,account:this.research.account}
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
            this.initLogList(this.tableData)
            this.initCityList()

        }

    }
</script>
