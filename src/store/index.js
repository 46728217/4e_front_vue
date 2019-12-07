
import Vue from 'vue'
import Vuex from './vuex' // 引入我们的自己编写的文件

Vue.use(Vuex) // 安装store
// 实例化store，参数数对象
export default new Vuex.Store({
    modules: {
        // 模块a
        a: {
            state: {
                count: 4000
            },
            actions: {
                actionschange ({state}) {
                    state.count += 21
                },
            }
        },
        // 模块b
        b: {
            state: {
                count: 10000
            },
            actions: {
                actionssubtraction ({state}) {
                    state.count= state.count-10;
                },
            }
        },
        // 模块c
        c: {
            state: {
                count: 100000
            },
            actions: {
                chengfa ({state}) {
                    // 模拟异步
                    setTimeout(() => {
                        state.count = state.count * 2;
                    },500);
                },
            },
            mutations:{
                chufa(state){
                    state.count= state.count/2;
                }
            }
        }
    },
    state: {//state => 基本数据
        count : 1000
    },
    getters : {//getters => 从基本数据派生的数据
        newCount (state) {
            return state.count + 100
        }
    },
    mutations: {//mutations => 提交更改数据的方法，同步！
        mutationschange (state) {
           // console.log(state.count)
            state.count += 10
        },
       subtraction (state) {
           state.count --;
        },
    },
    actions: {//actions => 像一个装饰器，包裹mutations，使之可以异步。
        actionschange ({commit}) {
            // 模拟异步
            setTimeout(() => {
                commit('mutationschange')
            }, 1000)
        },
        actionssubtraction ({commit}) {
             commit('subtraction')
        },
    }
})
