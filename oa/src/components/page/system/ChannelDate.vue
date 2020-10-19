<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>渠道来源管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <div style="margin-bottom:50px">


        	<div style='float:right'>
            	<el-form :inline="true" :model="cityNames" class="demo-form-inline grayForm" >
            		<el-form-item label="城市:" prop='city'>
						<el-select v-model='cityNames.city' @visible-change='changeCityVisible' @change='changeCity' placeholder="请选择">
						    <el-option
						      v-for="type in storeCitys"
						      :key="type.cityCode"
		                      :label="type.cityName"
		                      :value="type.cityCode">
						    </el-option>
						</el-select>
					</el-form-item>
				</el-form>
                
            </div>
        </div>
        
        <div style="width:100%;height:600px;overflow-Y:auto;">
        <el-table :data="deptTable" border style="width: 100%">
		   <el-table-column  type="index" label="" width="150px"></el-table-column>
    		<el-table-column  label="来源" >
                <template slot-scope="scope">


                    <div >
                        
                        <div style="overflow:hidden">
                            <div v-show="!scope.row.isEdit">
                                {{scope.row.nickName}}
                            </div>
                            <input 
                            
                            v-model="scope.row.nickName"
                            v-show="scope.row.isEdit"
                            v-focus="focusState"
                            @blur="lostBlur(scope.$index)"
                            style= "display:block;height:28px; border:none;float:left;" type="text" />
                            <div style="float:left;margin-left:15px" v-show="scope.row.isEdit">

                                <el-button class='btn'
                                    
                                    size="small" @click="changeOk(scope.$index, deptTable)">
                                    确认修改
                                </el-button>
                                <el-button class='btn'
                                    size="small" @click="changeCancel(scope.$index, deptTable)">
                                    取消修改
                                </el-button>
                            </div>
                        </div>
                    </div>

                </template>

            </el-table-column>
    		<el-table-column prop="statusText" label="操作">
	            <template scope="scope">
	                <el-button class='btn'
	                type="text"
                    :disabled="ifClick"
				    size="small" @click="changetRow(scope.$index, deptTable)">
				    修改来源
				   </el-button>
                   <el-button class='btn'
	                type="text"
                    :disabled="ifClick"
				    size="small" @click="deletRow(scope.$index, deptTable)">
				    删除来源
				   </el-button>
	            </template>
	        </el-table-column>


		  </el-table>
        </div>
		






    </div>
</template>

<script type="text/ecmascript-6" >
    import { mapGetters } from 'vuex';
    import {formatTime,filterBtnPms} from '../../utils/common'
    export default {
        data: function(){
            return {
                nameV:"",//记录点击修改之前的值;
                ifClick:false,
                focusState:false,
                formInline: {
		          user: '',
		          region: ''
		        },
                pagination:{
                    pageNow:1,
                    total:0,
                    pageNum:1,
                    pageSize:10
                },
                staticCustomer:{

                },
                cityNames:{
                	city:''
                },
                storeCitys:{},
                deptTable:[],
                citys:[], 
                channelIds:[],               
            	 currentPage4: 4,
		         dialogFormVisible: false,

                isChangeCity:false,



                types:[],

            };
        },
         directives:{
             focus:{
                 update:function(el,{value}){
                     if(value){
                        el.focus()
                     }   
                 }
             }
         },
         methods: {

             lostBlur(index){
                //  console.log("失去焦点触发",index)
                if(this.deptTable[index].isEdit){
                        this.ifClick=true
                }
                return
                 

             },
            //  取消修改数据
             changeCancel(index){
                this.focusState=false;
                this.deptTable[index].isEdit=false;
                this.deptTable[index].nickName=this.nameV
                this.ifClick=false
                        
                
             },
            //  确定修改数据
             changeOk(index){
                 this.ifClick=false
                 this.focusState=false;
                 this.deptTable[index].isEdit=false;
                //  console.log("table表的值",this.nameV,"改变后的值",this.deptTable[index].nickName);

                 this.$axios.post('/s/updNickName',{'userId':this.deptTable[index].id,"nickName":this.deptTable[index].nickName}).then((res3)=>{
					// console.log("来源数据",res3)
                    
                    
		        })
             },

              
                getOpenCity(){
            	
            },
            

// 点击修改数据
            changetRow(index,table){
                for(let i=0;i<this.deptTable.length;i++){
                    this.focusState=false;
                    this.deptTable[i].isEdit=false
                }
                
                this.focusState=true;
                this.deptTable[index].isEdit=true;
                this.nameV=this.deptTable[index].nickName;
                return
                
            },
//点击删除            
            deletRow(index,table){

                

                // console.log("要删除的一行",table[index].nickName)
                if(confirm("是否确定删除")){

                }else{
                    return
                }
                 this.$axios.post('/s/updNickName',{'userId':this.deptTable[index].id,"nickName":""}).then((res3)=>{
                    // console.log("来源数据",res3)
                    
                    this.deptTable.splice(index,1);
                })
                
            },
              changeCity(){
				if(this.isChangeCity){
					this.ifClick=false
					this.isChangeCity = false
                }
                
                this.$axios.post('/s/getChannelList',{'cityCode':this.cityNames.city}).then((res3)=>{
                    // console.log("来源数据111111111",res3)
                   
                   
                    

                    if(res3.data.res == '0'){
                        let tabList= res3.data.msg;
                        //  console.log("11111111111111",tabList)
                   
                        let newArr=[];
                        for(let i=0;i<tabList.length;i++){
                                if(tabList[i].nickName!=""&&tabList[i].nickName!=null){
                                // console.log("要添加的下标",i)
                                newArr.push(tabList[i])
                                }
                            }
                        // console.log("删除后的数据",newArr)  
                         this.deptTable=newArr
                        //  console.log("22222222",newArr)
						 
						for(var i=0;i<this.channelIds.length;i++){
							if(this.channelIds[i].id== '-999'){
				                this.channelIds.splice(i,1)
				            }
						}
                    }
                    else{
                    	this.deptTable = []
                    }
		        })

			},
		    changeCityVisible(){
            	this.isChangeCity = true
            },


             initDeptTable(){
                 let data={
                     "pageNow":this.pagination.pageNow,
                     "pageSize":this.pagination.pageSize
                 }
                 this.$axios.post('/s/page',data).then((res)=>{
                    //  console.log("1111111111111111".res)
                     if(res.status==200){
                         
                        

                         this.pagination.total=res.data.msg.total;
                         this.pagination.pageNum=res.data.msg.pageNum;
                         this.pagination.pageSize=res.data.msg.pageSize;
                         this.deptTable=res.data.msg.list
                         
                         
                     }
                 })
             },






             typesData(types){
                 let n;
                 this.types.forEach((e)=>{
                     if(e.dicValue==types) {
                      n=e.dicDesc
                     }
                     })
                 return n
             }
	    },
        mounted(){
            this.initDeptTable();

        },
        computed:{
            ...mapGetters([

            ])

        },
        created(){
            this.$axios.get('/b/getOpenCityLists',{params:{'pageSize':100}}).then((res2)=>{    //获取所有城市列表
					   	if(res2.data.res == 0){
							//    console.log("9999999999999999999999",JSON.parse(localStorage.getItem("userInfo")).positionCitys)
							   this.citys =  res2.data.msg;
							   let allCIty=JSON.parse(localStorage.getItem("userInfo")).positionCitys
	  							this.storeCitys = allCIty
	  							this.storeCitys.forEach((e)=>{
						                this.citys.forEach((n)=>{
							                if( n.cityCode==e.cityCode){
							                    e.cityName = n.cityName
							                     this.cityNames.city = this.storeCitys[0].cityCode
							                }

							            })
 
								   })
								
								
								  
						        }
						        else{
						        	alert(msg)
						        }

					   		})
        }
    }
</script>
<style>
	.page_pagination{
		text-align: right;
	}
	.table_bottom{
		margin-top:13px;
		border-bottom:1px solid #eee;
	}

 .text {
    font-size: 14px;
    margin-left:20px;
	border-bottom:1px solid #eee;
  }
  .box-card .el-card__header,  .box-card .el-card__body{
  	padding:0 20px
  }
  .box-card .el-card__header{
  	border-bottom:none;
  	background-color: rgba(0,0,0,0.1);
  }
  .box-card .el-card__body{
  	padding:10px 20px;
  }
  .smallBox .el-dialog{
  	margin-top:60px !important;
  }
   .message_bottom{
	  	height:44px;
	  	line-height: 44px;
	  	font-size: 12px;
    	color: #999;
		text-align: center;
	}
</style>
