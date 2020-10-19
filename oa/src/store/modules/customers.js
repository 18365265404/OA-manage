/**
 * Created by User on 2017/10/22.
 */
const customer={
    state:{
        startDate:'',
        endDate:'',
        status:'',
        oldStatus:'',
        salesId:'',
        saveStatus:false,
        
    },
    mutations:{
        SAVE_CUSTOMER_STATE:(state,data)=>{
            state.startDate=data.startDate
            state.endDate=data.endDate
            state.status=data.status
            state.oldStatus=data.oldStatus
            state.salesId=data.salesId
            state.saveStatus=data.saveStatus
            
        },
        DELETE_CUSTOMER_STATE:(state)=>{
            state.startDate=''
            state.endDate=''
            state.status=''
            state.oldStatus=''
            state.salesId=''
            state.saveStatus=false
        },
        
    },
    actions:{
        loadingCustomerData({commit},data){
            commit('SAVE_CUSTOMER_STATE',data)
        },
        removeCustomerData({commit},data){
            commit('DELETE_CUSTOMER_STATE')
        }
    }
};

export default customer;
