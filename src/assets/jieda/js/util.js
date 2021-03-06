export default {
    install(Vue, options) {
    	Vue.prototype.ccc = function(obj) {
    		return JSON.parse(JSON.stringify(obj));
    	},
    	Vue.prototype.getNumber = function(str) {
			return str.replace(/[^0-9]/ig,""); 
    	},
        Vue.prototype.showMsg = function (msg) {
            this.$layer.msg(msg, {time: 1});
        }
        Vue.prototype.title = function (title) {
        	$("title").html(title);
        }
        Vue.prototype.get = function(url, params, cb) {
        	$.ajax({
				url: url,
				data: params,
				dataType: 'json',
				xhrFields: {
	                withCredentials: true
	            },
	            crossDomain: true,
				success: function(data){
					cb(data);
				}
			});
        },
        Vue.prototype.post = function(url, params, cb) {
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