const getters = {
  sidebar: state => state.app.sidebar,
    userId: state => state.user.userId,
  userInfo: state => state.user.userInfo,
    outTime: state => state.user.outTime,
    status: state => state.user.status,
  addRouters: state => state.permission.addRouters,
    permission_routers: state => state.permission.routers,
    res: state => state.user.res,
    dicData: state=>state.dic.dicData,
    allPermission:state=>state.permission.allPermission,
    btnAllPms:state=>state.permission.btnAllPms,
    customer:state=>state.customer,
    dicExlUrl:state=>state.dic.exlUrl
};
export default getters
