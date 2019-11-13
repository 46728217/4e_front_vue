import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state={   //要设置的全局访问的state对象
    wenjuanCurrHeight:0, //高度
    //要设置的初始属性值
};
const getters = {   //实时监听state值的变化(最新状态)

};
const mutations = {

    list_w_wenjuan_a_store(state,ststus){
        state.wenjuanCurrHeight=ststus;
    },

};
const actions = {
};
const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
export default store;
