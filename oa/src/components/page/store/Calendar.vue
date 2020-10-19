<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>门店管理</el-breadcrumb-item>
                <el-breadcrumb-item>吉日查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <vue-event-calendar
            :events="demoEvents"
            @day-changed="handleDayChanged"
            @month-changed="handleMonthChanged"
        >
            <template scope="props">
                <div v-for="(event, index) in props.showEvents" class="event-item">
                    <!-- In here do whatever you want, make you owner event template -->
                    <div class="CaleLe">
                        <el-row type="flex" class="row-bg" justify="space-between">
                            <el-col :span="12" style="font-size: 34px">{{event.day}}</el-col>
                            <el-col :span="6" style="font-size: 14px"><p>{{event.date}} {{event.weekday}} <br> 农历 {{event.lunar}}</p></el-col>
                        </el-row>
                        <div class="tips">
                            <ul v-if="event.suit">
                                <li class="yi">宜</li>
                                <li class="tipLiLe">{{event.suit}}</li>
                            </ul>

                            <ul v-if="event.avoid">
                                <li class="ji">忌</li>
                                <li class="floatL" >{{event.avoid}}</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </template>
        </vue-event-calendar>
    </div>
</template>

<script type="text/ecmascript-6">
    let today = new Date()
    export default {
        data () {
            return {
                demoEvents: []
            }
        },
        methods: {
            handleDayChanged (data) {
                console.log('date-changed', data)
            },
            handleMonthChanged (data) {
               let date=data.replace(/\//gi,'-')
                console.log(date)
                this.initCalendar(date)

            },
            initCalendar(date){
                
                let lastData=date.replace("年","-").replace("月","")
               
                
                this.$axios.get('/store/getLuckDayList',{params:{pageNow:1,pageSize:31,yearMonths:lastData}}).then((res)=>{

                    console.log()
                    res.data.msg.list.forEach((e)=>{
                        e.date=e.date.replace(/-/gi,'\/')
                        if(e.isWedding!=='0'){
                            e.title='宜婚嫁'
                        }else {
                            e.title='不适婚嫁'
                        }
                        let m=e.date.replace(/\/0/gi,"/");
                        let n= m.split("/")
                        e.day=n[n.length-1]
                    })
                    this.demoEvents=res.data.msg.list
                })
            },
            getThisDate(){
                let date=new Date;
                let year=date.getFullYear();
                let month=date.getMonth()+1;
                month =(month<10 ? "0"+month:month);
                return (year.toString()+'-'+month.toString());
            },
            mGetDate(){
                let date=new Date;
                let year=date.getFullYear();
                let month=date.getMonth()+1;
                let d = new Date(year, month, 0);
                return d.getDate();
    }
        },
        mounted(){
            this.initCalendar(this.getThisDate());
        },
        created(){
            this.initCalendar(this.getThisDate());
        }
    }

</script>

<style>

    .__vev_calendar-wrapper .cal-wrapper .cal-body .dates .item .is-event.isWedding{
        background:#ffa5bf;
        border: 1px solid #ffa5bf;
        /*border: 1px solid #ff679a;*/
    }
    .t-center{
        text-align: center;
        margin: 20px;
    }
    .mt150{
        margin-top: 150px;
    }
    .showday{
        font-size: 20px;
    }
    .tips ul{
        margin-top: 10px;
        border-radius: 5px;
    }
    .tips li{
        padding: 5px;
        font-size: 14px;
    }
    .tipLiLe{
        background: #ffe7ee;
        color:#ff8faf;
    }
    .yi{
        color:#fff;
       background:#ffa5bf;
    }
    .ji{
        background:#dddddd
    }
    .floatL{
        background: #f5f5f5;
        color:#999
    }
</style>
