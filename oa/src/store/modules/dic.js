/**
 * Created by User on 2017/8/3.
 */

const dic={
    state:{
        dicData:{},
        empty:true,
        exlUrl:'oa.huashenghl.com'


},
    mutations:{
        SAVE_DIC_STATE:(state,data)=>{
            state.dicData=data
            state.empty=false
        }
    },
    actions:{
        loadingDictionaryData({commit},data){
            // alert()
            commit('SAVE_DIC_STATE',data)
        }
    }
};

export default dic;
