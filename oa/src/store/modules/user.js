/**
 * Created by User on 2017/7/25.
 */
import axios from 'axios'
axios.default.withCredentials=true;
const  user={
    state: {
        user: '',
        status: '',
        res:'',
        userInfo:{
        },
        userId:"",
        outTime:false
    },
    mutations: {
        SET_ROLES_RES:(state,res)=>{
            state.res=res;
        },
        SET_ROLES_USERINFO:(state,userInfo)=>{
            state.userInfo=userInfo;
        },
        SET_ROLES_USERID:(state,userId)=>{
            state.userId=userId;
        },
        REMOVE_ROLES_USERID:(state)=>{
            state.userId='';
            localStorage.removeItem('UserId')
        },
        SET_ROLES_STATUS:(state,status)=>{
            state.status=status;
        },
        REMOVE_ROLES_STATUS:(state)=>{
            state.status=0;
            localStorage.removeItem('status')
        },
        SET_OUT_TIME:(state,status)=>{
            state.outTime=status
        }
    },
    actions:{
        //登录
        login({commit},userInfo){
            axios({
                url: "/s/login",
                method: 'post',
                data: userInfo,
                transformRequest: [function (data) {
                    // Do whatever you want to transform the data
                    let ret = ''
                    for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }],
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                function (res) {
                    commit('SET_ROLES_RES',res.data.res)
                  if(res.data.res=="0"){
                      localStorage.setItem('UserId',res.data.msg.account)
                      localStorage.setItem('status',1)
                      //保存用户名 用户信息
                      localStorage.setItem('userInfo',JSON.stringify(res.data.msg))
                      commit('SET_ROLES_USERINFO',res.data.msg)
                      commit('SET_ROLES_USERID',localStorage.getItem('UserId'))
                      //保存登录状态
                      commit('SET_ROLES_STATUS',localStorage.getItem('status'))
                      //登录状态保持中
                      commit('SET_OUT_TIME',true)
                  }else {
                      alert(res.data.msg)
                  }
                }
            )
        },
        // 登出
        logOut({ commit}) {
            return new Promise((resolve, reject) => {
                commit('REMOVE_ROLES_USERID')
                commit('REMOVE_ROLES_STATUS')
                commit('SET_OUT_TIME',false)
                
                resolve();
            });
        },
        //刷新用户名
        refreshUserID({commit}){
            return new Promise((resolve, reject) => {
                commit('SET_ROLES_USERID',localStorage.getItem('UserId'))
                resolve();
            });
        }
    }


}
export default user;
