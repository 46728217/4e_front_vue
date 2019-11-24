// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'//引入store
import $ from 'jquery'
import layer from 'vue-layer'
import vPage from 'v-page';
import echarts from 'echarts'
import 'babel-polyfill'

import 'vue-layer/lib/vue-layer.css';


var baseKey = "base"

localStorage.setItem(baseKey, 'http://localhost')
//localStorage.setItem(baseKey, 'http://117.78.16.42') //jieda
//localStorage.setItem(baseKey, 'http://t4e.skyengine.cn')

//localStorage.setItem(baseKey, 'http://4e.skyengine.cn')
//localStorage.setItem(baseKey, 'https://4em.cig.com.cn');



var themeKey = '4e-front-theme'
var theme = localStorage.getItem(themeKey)
theme = null
if (theme == null) {
  //theme = 'jieda';
  theme = '4e'
  localStorage.setItem(themeKey, theme)
}

function adaptePath (path, name, view, keepAlive) {
  return {
    path: path,
    name: name,
    component: function(resolve) { return require(['@/pages' + '/' + theme + '/' + view + '.vue'], resolve)},
    meta: {
      keepAlive: keepAlive
    }
  }
}

function dz(value) {
  var languageType = localStorage.getItem("languageType");
  if (languageType==null) {
    languageType = 0;
  }
  var dz_list = localStorage.getItem("dz_list");
  var dz_list_time = localStorage.getItem("dz_list_time");
  var currentTime = (new Date()).getTime();
  if (dz_list_time==null || dz_list_time<currentTime-60*60) {
    dz_list = null;
  } 
  if (dz_list === null || dz_list === undefined) {
    $.ajax({
      url: localStorage.getItem(baseKey)+'/api/translatelist',
      xhrFields: {
          withCredentials: true
      },
      crossDomain: true,
      async: false,
      success: function(data) {
        console.log(data.data);
        localStorage.setItem("dz_list", JSON.stringify(data.data));
        localStorage.setItem("dz_list_time", (new Date()).getTime());
        dz_list = data.data;
      }
    })
  }else{
    dz_list = $.parseJSON(dz_list);
  }
  if (languageType==1) {
    var ret = dz_list[languageType][value];
    if (ret==null) {
      return value;
    }
    return ret;
  }
  return value;
}

Vue.filter('dz', function (value) {
  return dz(value);
})
Vue.filter('sub', function (value, length) {
    if (!value) return ''
    if (value.length > length) {
        return value.substring(0,length);
    }
    return value
})
Vue.filter('de', function (value, length) {
  if (!value) return ''
  if (value.length > length) {
    return value.slice(0,length) + '...'
  }
  return value
})

//全局过滤器 保留两位小数
Vue.filter('addZero',function(value){
    return value.toFixed(2)
})

function onInput(el, ele, binding, vnode) {
  function handle() {
    var val = ele.value
    // modifiers为修饰符对象，传入了float，则其float属性为true
    if (binding.modifiers.float) {
      // 清除"数字"和"."以外的字符
      val = val.replace(/[^\d.]/g, '')
      // 只保留第一个, 清除多余的
      val = val.replace(/\.{2,}/g, '.')
      // 第一个字符如果是.号，则补充前缀0
      val = val.replace(/^\./g, '0.')
     } else {
      val = ele.value.replace(/[^\d]/g, '')
    }
    if (ele.value != val) {
      window.$vm.showMsg("请您输入数字");
    }
    ele.value = val
  }

  return handle
}
const numberInput = {
  inserted(el, binding, vnode) {
    console.log(el.tagName);
    const ele = el.tagName === 'TEXTAREA' ? el : el.querySelector('textarea')
    ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
  },
}
Vue.directive('number-input', numberInput)



var routes = []

//首页
routes.push(adaptePath('/', 'index', 'index', true))
//登录页
routes.push(adaptePath('/login', 'login', 'login', true))
//e-office
routes.push(adaptePath('/office', 'office', 'office', true))
//e-library
routes.push(adaptePath('/library', 'library', 'library', true))
//e-study
routes.push(adaptePath('/study', 'study', 'study', true))
//e-shop
routes.push(adaptePath('/shop', 'shop', 'shop', true))
//个人中心
routes.push(adaptePath('/my', 'my', 'my', true))
//列表子页
routes.push(adaptePath('/list', 'list', 'list', true))

routes.push(adaptePath('/list_file', 'list_file', 'list_file', true))

routes.push(adaptePath('/list_o', 'list_o', 'list_o', true))

routes.push(adaptePath('/list_t', 'list_t', 'list_t', true))

routes.push(adaptePath('/list_t_edit', 'list_t_edit', 'list_t_edit', true))

routes.push(adaptePath('/list_t_show', 'list_t_show', 'list_t_show', true))

routes.push(adaptePath('/list_t_verify', 'list_t_verify', 'list_t_verify', true))

routes.push(adaptePath('/list_g', 'list_g', 'list_g', true))

routes.push(adaptePath('/list_g_edit', 'list_g_edit', 'list_g_edit', true))

routes.push(adaptePath('/list_g_show', 'list_g_show', 'list_g_show', true))

routes.push(adaptePath('/list_g_verify', 'list_g_verify', 'list_g_verify', true))

routes.push(adaptePath('/list_w_unanswer', 'list_w_unanswer', 'list_w_unanswer', true))

routes.push(adaptePath('/list_w_answered', 'list_w_answered', 'list_w_answered', true))

routes.push(adaptePath('/list_w_manage', 'list_w_manage', 'list_w_manage', true))

routes.push(adaptePath('/list_w_charts', 'list_w_chart', 'list_w_charts', true))

routes.push(adaptePath('/list_w_wenjuan', 'list_w_wenjuan', 'list_w_wenjuan', true))

routes.push(adaptePath('/list_w_wenjuan_c', 'list_w_wenjuan_c', 'list_w_wenjuan_c', true))

routes.push(adaptePath('/list_w_wenjuan_w', 'list_w_wenjuan_w', 'list_w_wenjuan_w', true))

routes.push(adaptePath('/list_w_wenjuan_a', 'list_w_wenjuan_a', 'list_w_wenjuan_a', true))


routes.push(adaptePath('/list_activity', 'list_activity', 'activity_list', true))

routes.push(adaptePath('/material_detail', 'material_detail', 'material_detail', true))


routes.push(adaptePath('/platform_standard', 'platform_standard', 'platform_standard', true))

routes.push(adaptePath('/platform_best', 'platform_best', 'platform_best', true))

routes.push(adaptePath('/platform_notbest', 'platform_notbest', 'platform_notbest', true))
routes.push(adaptePath('/preview', 'preview', 'preview', true))

routes.push(adaptePath('/iframe', 'iframe', 'iframe', true))


router.afterEach((to, from) => {
  ga('set', 'page', to.path);
})

Vue.prototype.$layer = layer(Vue);
Vue.use(vPage);


Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
window.$vm = new Vue({
  el: '#app',
  router,
    store,
  components: { App },
  template: '<App/>',
  beforeCreate: function () {
    this.$router.addRoutes(routes)
  }
})