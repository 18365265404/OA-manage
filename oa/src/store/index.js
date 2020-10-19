/**
 * Created by User on 2017/7/25.
 */

import Vue from 'vue';
import user from './modules/user'
import permission from './modules/permission'
import dic from './modules/dic'
import customer from './modules/customers'
import Vuex from 'vuex'
import getters from './getters';

Vue.use(Vuex)


const store = new Vuex.Store({
    modules: {
        user,
        permission,
        dic,
        customer
    },
    getters
});

export default store
