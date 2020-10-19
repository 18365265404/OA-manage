<template>
    <div>
        <!--查询录音!-->
        <el-row>
            <el-col>
                <el-form :inline="true">
                    <el-form-item label="手机号">
                        <el-input v-model="research.mobile"></el-input></el-form-item>
                    <el-form-item label="销售/客服">
                        <el-select v-model="research.salesId"  placeholder="请选择" clearable  filterable>
                            <el-option-group
                                v-for="group in salesList"
                                :key="group.label"
                                :label="group.label">
                            <el-option v-for="(item,i) in group.options"
                                       :key="i"
                                       :label="item.nickName"
                                       :value="item.id"></el-option>
                                </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="录音时间">
                        <el-date-picker
                            v-model="research.startDate"
                            type="date"
                            placeholder="选择日期"
                           @change="researchStartDate"
                        >
                        </el-date-picker>
                </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            v-model="research.endDate"
                            type="date"
                            placeholder="选择日期"
                            @change="researchEndDate"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="researchTable">查询</el-button>
                        <el-button type="danger" @click="resetResearch" >清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!--录音列表-->
        <el-table
            ref="multipleTable"
            :data="recordTable"
            border
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="loading2"
            element-loading-text="拼命加载中"
        >
            <el-table-column prop="operatorName" label="操作人员" width="150px"></el-table-column>
            <el-table-column prop="recordingTime" label="录音时间" width="200px" :formatter="formTime"></el-table-column>>
            <el-table-column prop="customerName" label="客户姓名" width="120px"></el-table-column>
            <el-table-column prop="mobile" label="客户手机号" width="150px"></el-table-column>
            <el-table-column prop="newName" label="录音文件名" >
            </el-table-column>
            <el-table-column prop="fileAddress" label="播放">
                <template scope="scope">
                    <audio controls style="vertical-align: middle;">
                        <source :src="`${QiNiuToken}/${scope.row.fileAddress}`" type="audio/mpeg">
                        <embed height="50" width="100" :src="`${QiNiuToken}/${scope.row.fileAddress}`">
                    </audio>
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
                loading2: false,
                recordTable:[],//顾问列表
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                research:{
                    mobile:'',
                    salesId:"",
                    startDate:'',
                    endDate:''
                },
                salesList:[
                    {
                        label: '客服',
                        options: []
                    },
                    {
                        label: '销售',
                        options: []
                    }
                ],
                QiNiuToken:''
            }
        },
        methods: {
            researchStartDate(val){
                this.research.startDate=val
            },
            researchEndDate(val){
                this.research.endDate=val
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.initRecordList(this.tableData)
            },
            handleCurrentChange(val) {
                this.pagination.pageNow = val;
                this.initRecordList(this.tableData)
            },
            initRecordList(data){
                this.$axios.post('/customer/getRecordingList',data).then((res2)=> {
                    this.loading2=true
                    if (res2.status == 200) {
                        this.pagination.total=res2.data.msg.total;
                        this.pagination.pageNum=res2.data.msg.pageNum;
                        this.pagination.pageSize=res2.data.msg.pageSize;
                        this.recordTable=res2.data.msg.list
                        this.loading2=false
                    }
                })
                var audio = document.getElementsByTagName('audio')
                for(var i=0;i<audio.length;i++){
                    audio[i].load()
                }
            },
            initSalesList(){




                this.$axios.post("/s/getSalesListByDeptKey").then((res)=>{
                    if(res.status==200){
                        this.salesList[1].options=res.data.msg
                    }
                })
                this.$axios.post("/s/getCustServiceListByDeptKey").then((res)=>{
                    if(res.status==200) {
                        this.salesList[0].options = res.data.msg
                    }
                })
            },
            researchTable(){
                this.initRecordList(this.tableData)
            },
            resetResearch(){
                this.research.mobile=''
                this.research.salesId=""
                this.research.startDate=''
                this.research.endDate=''
            },
            formTime(row){
                return formatTime(row.recordingTime)
            },
            getQiNiuToken(){
                this.$axios.get("/b/getQiNiuUrl").then((res)=>{
                    if(res.status==200){
                        this.QiNiuToken=res.data.msg
                    }
                })
            }
        },
        computed:{
            tableData(){
                return  {"pageNow":this.pagination.pageNow,
                    "pageSize":this.pagination.pageSize,
                    mobile:this.research.mobile,
                    salesId:this.research. salesId,
                    startDate:this.research.startDate,
                    endDate:this.research.endDate

                }
            },
            ...mapGetters([
                'dicData',
                'allPermission',
                'btnAllPms'
            ])
        },
        mounted(){
            this.initRecordList(this.tableData)
            this.initSalesList()
            this.getQiNiuToken()

        }

    }
</script>
