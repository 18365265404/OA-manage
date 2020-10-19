import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'
import "babel-polyfill";
import  'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
import { Loading,Message} from 'element-ui';


axios.defaults.withCredentials=true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.transformRequest=[function (data) {
    // Do whatever you want to transform the data
    let ret = ''
    for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}]
axios.defaults.timeout = 600000
// http请求拦截器

axios.interceptors.request.use(config => {
    // element ui Loading方法
    return config
}, error => {
    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => {// 响应成功关闭loading
    if(data.data.res==-401){
        store.dispatch('logOut');
        router.push('/login').then(()=>{
        })
    }

    return data
}, error => {
    Message.error({
        message: '加载失败'
    })
    return Promise.reject(error)
})




const whiteList = ['/login'];/// 不重定向白名单
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (whiteList.indexOf(to.path) !== -1){ //首页
        if( localStorage.getItem("userInfo")){ //切换用户 强制刷新
            localStorage.removeItem('userInfo')
        }
        if(from.path=="/readme"&&store.getters.status){ //首页禁止后退
            next(false);
            NProgress.done()
        }else{
            next()
        }
    }else {
        if(from.path=="/login"&&(!store.getters.status)){ //登录页禁止后退
            next(false);
            NProgress.done()
        }else{
            //拉取字典
            // console.log(isEmptyObject(store.state.dic.dicData))
            if(store.state.dic.empty){
                console.log("字典加载！！！")
                axios.get("/b/getAllDictionary").then((res)=>{
                    if(res.status==200){
                        store.dispatch("loadingDictionaryData",res.data.msg)
                    }
                })
            }
            //进入内容页
            //拉取侧边栏路由
            if(from.path=='/'||from.path=="/login"){
                axios.post("/s/findResourceByPlatform").then( function (res) {
                    // 登录判断
                    if(res.data.res!==-401){
                        //匹配路由权限
                        let roles=[];
                        function filterData(data) {
                            data.forEach(function (value) {
                                roles.push(value.permission)
                                if(value.child){
                                    filterData(value.child)
                                }

                            })
                        }
                        filterData(res.data.msg)
                        store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
                            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                            next();
                        })
                        // 保存按钮权限
                        store.dispatch('setAllPermission',roles);
                        // 刷新用户名
                        store.dispatch('refreshUserID');

                    }else {
                        // 登录过期 退出
                        store.dispatch('logOut');
                        next({
                            path: '/login'
                        })
                    }

                })
            }
            next();
        }

    }
})


router.afterEach(() => {
    NProgress.done(); // 结束Progress
});



Vue.use(ElementUI);
Vue.use(vueEventCalendar,{local:'ch',color: '#ff679a'});
Vue.prototype.$axios = axios;
new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
