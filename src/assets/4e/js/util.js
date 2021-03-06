import {BASE} from './common';
export default {
    install(Vue, options) {
    	Vue.prototype.cc = function(obj) {
    		return JSON.stringify(obj);
    	}
    	Vue.prototype.ccc = function(obj) {
    		return JSON.parse(JSON.stringify(obj));
    	},
    	Vue.prototype.getNumber = function(str) {
			return str.replace(/[^0-9]/ig,""); 
    	},
        Vue.prototype.showMsg = function (msg) {
        	var top = this;
    		if(parent.$vm) {
    			top = parent.$vm;
    		}
            top.$layer.msg(msg, {time: 3});
        }
        Vue.prototype.$$confirm = function (msg,fun) {
    		var that = this;
    		var top = that;
    		if(parent.$vm) {
    			top = parent.$vm;
    		}
            top.$layer.confirm(msg,{btn: ['确定','取消'] }, fun, function (index) {
            	console.log("返回");
                top.$layer.close(index);

            });
        },
        Vue.prototype.isEmpty = function (obj) {
            return JSON.stringify(obj) == "{}";
        },
        Vue.prototype.title = function (title) {
        	$("title").html(title);
        },
        Vue.prototype.get = function(url, params, cb, async=true) {
        	$.ajax({
				url: BASE.timestamp(url),
				data: params,
				dataType: 'json',
				async: async,
				xhrFields: {
	                withCredentials: true
	            },
	            crossDomain: true,
				success: function(data){
        			if ((typeof data === 'string' || data instanceof String) && data.substr(0,2) == "/*") {
			          data = data.substring(2, txt.length - 2);
			          data = eval('('+data+')');
			        }
					cb(data);
				}
			});
        },
        Vue.prototype.post = function(url, params, cb) {
    		if(params==null){
                params={};
			}
			params.timestamp=new Date().getTime();
        	$.ajax({
				url: url,
				method: 'post',
				data: params,
				dataType: 'json',
				xhrFields: {
	                withCredentials: true
	            },
	            crossDomain: true,
				success: function(data){
        			if ((typeof data === 'string' || data instanceof String) && data.substr(0,2) == "/*") {
			          data = data.substring(2, txt.length - 2);
			          data = eval('('+data+')');
			        }
					cb(data);
				}
			});
        },
        Vue.prototype.json = function(url, params, cb) {
        	$.ajax({
                url: BASE.timestamp(url),
				method: 'post',
				data: params,
				contentType: "application/json;charset=utf-8",
				dataType: 'json',
				xhrFields: {
	                withCredentials: true
	            },
	            crossDomain: true,
				success: function(data){
        			if ((typeof data === 'string' || data instanceof String) && data.substr(0,2) == "/*") {
			          data = data.substring(2, txt.length - 2);
			          data = eval('('+data+')');
			        }
					cb(data);
				}
			});
        },
        Vue.prototype.dz = function(value) {
        	let languageType = localStorage.getItem("languageType");
			if (languageType==null) {
				languageType = 0;
			}
			let dz_list = localStorage.getItem("dz_list");
			if (dz_list === null || dz_list === undefined) {
				$.ajax({
					url: localStorage.getItem(baseKey)+'/api/translatelist',
					xhrFields: {
					  withCredentials: true
					},
					crossDomain: true,
					async: false,
					success: function(data) {
        				if ((typeof data === 'string' || data instanceof String) && data.substr(0,2) == "/*") {
				          data = data.substring(2, txt.length - 2);
				          data = eval('('+data+')');
				        }
						console.log(data.data);
						localStorage.setItem("dz_list", JSON.stringify(data.data));
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
    }

}