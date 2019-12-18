<!--问卷调查问卷-->
<template>
<div class="w-list-wenjuan" id="w-list-wenjuan"v-cloak>
	<div class="nav">
		<div class="back">
			<img src="../../assets/4e/img/back.png"/>
			<span>返回</span>
		</div>
	</div>

	<div class="wenjuan">
		<div class="title"><span>{{info.title}}</span></div>
		<div class="list" id="wenjuan_list">
			<ul>
				<li v-for="(item, index) in data">
					<div class="item" :data-id="item.id" :data-type="item.type">
						<div v-if="item.type==1 && info.category=='月度活动提报'" class="cccc">
							<div class="des">
								<span>{{index+1}}. </span>
								<span>{{item.title}}</span>
								<span class="type">(问答题)</span>
							</div>
							<div class="contents">
								<input type="text" class="input" placeholder="请填写答案(数字)" v-number-input.float></input>
							</div>
						</div>
						<div v-if="item.type==1 && info.category!='月度活动提报'" class="cccc">
							<div class="des">
								<span>{{index+1}}. </span>
								<span>{{item.title}}</span>
								<span class="type">(问答题)</span>
							</div>
							<div class="contents">
								<textarea class="textarea" placeholder="请填写答案"></textarea>
							</div>
						</div>
						<div v-if="item.type==13" class="cccc">
							<div class="des">
								<span>{{index+1}}. </span>
								<span>{{item.title}}</span>
								<span class="type">(单选题)</span>
							</div>
							<div class="contents" style="margin: 20px 10px">
								<div v-for="(n, index) in item.optionList" style="display: inline-block;margin-left: 20px">
									<input type="radio" :value="n.optionNumber"  name="radio" class="radio"/>
									<label style="color: #333">{{n.optionNumber}}.{{n.content}}</label>
								</div>
							</div>
						</div>
						<div v-if="item.type==11" class="cccc">
							<div class="des">
								<span>{{index+1}}. </span>
								<span>{{item.title}}</span>
								<span class="type">(多选题)</span>
							</div>
							<div class="contents" style="margin: 20px 10px">
								<div v-for="(n, index) in item.optionList" style="display: inline-block;margin-left: 20px">
									<input type="checkbox" :value="n.optionNumber" name="option" class="radio"/>
									<label style="color: #333">{{n.optionNumber}}.{{n.content}}</label>
								</div>
							</div>
						</div>
						<div v-if="item.type==2" class="cccc">
							<div class="des">
								<span>{{index+1}}. </span>
								<span>{{item.title}}</span>
								<span class="type">(支持图片，word，excel，ppt，pdf，zip，rar格式的文件,上传文件不能超过20M)</span>
							</div>
							<div class="progress" style="display: none"><span class="line"></span><span class="nums">0</span>%</div>
							<div class="contents">
								<form enctype="multipart/form-data" method="post">
									<input name="file" type="file" class="upload_h"/>
									<input type="button" value="上传文件" class="upload"/>
								</form>
								<div class="uploadinfo">
									<div>
									<span>上传文件名称：</span>
									<span class="filename"></span>
									</div>
									<div>
									<span>上传文件大小：</span>
									<span class="filesize"></span>
									</div>
									<div>
									<span>上传文件类型：</span>
									<span class="filetype"></span>
									<span class="download">
										<a href="" target=_blank>下载</a>
										<a class="close" style="background:none !important;">删除</a>
									</span>
									</div>
								</div>
							</div>
							<div class="preview">
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div class="submit">
		<div @click="submit" style="background-color: #001e50;color: white;">
			<span >上传提交</span>
		</div>
	</div>
</div>
</template>

<script>
	import Vue from 'vue'
	var base = localStorage.getItem("base")
    import util_js from '@/assets/4e/js/util.js'
    import font_css from '@/assets/4e/css/font.css'
    import global_css from '@/assets/4e/css/global.css'
    Vue.use(util_js);

	export default {
		data: function(){
			return {
				base: base,
				info: {},
				qaUser: {},
				data: [],
				qaId: 0
			}
		},
		created: function() {
			var that = this;
			this.qaId = this.$route.query.qaId;
			this.get(this.base+"/api/user/islogin", null, function(data){
				if (data.code==0) {
					parent.window.location = "/login";
					return;
				}
				that.user = data.data;
			});
			this.getInfo();
			this.getData();
			$("body").on("change", "textarea,input[type=text]", function(){
				var text = $.trim($(this).val());
				var item = $(this).parent().parent().parent();
				if (text!="") {
					item.addClass("ok");
					item.attr("answer", text);
				}else{
					item.removeClass("ok");
					item.removeAttr("answer");
				}
			});

			$("body").on("change", ".radio", function(){
				var ischeck = $(this).is(':checked');
				var text = "";
				$(this).parent().parent().find("input:checked").each(function(){
					text += $(this).val()+",";
				});
				if (text.length>0) {
					text = text.substr(0, text.length-1);
				}
				var item = $(this).parent().parent().parent().parent();
				if (text.length>0) {
					item.addClass("ok");
					item.attr("answer", text);
				}else{
					item.removeClass("ok");
					item.removeAttr("answer");
				}
			});

			$("body").on("click", ".uploadinfo .close", function(){
				$(this).parent().parent().parent().hide();
				var item = $(this).parent().parent().parent().parent().parent().parent();
				item.removeClass("ok");
				item.removeAttr("answer");
				item.find(".preview").hide();
                var o = document.getElementById("wenjuan_list");
                var h = o.clientHeight||o.offsetHeight;
                $(this).parent().parent().parent().parent().siblings(".progress").hide();
                $(this).parent().parent().parent().parent().siblings(".progress").find(".line").css("width",0);
                $(this).parent().parent().parent().parent().siblings(".progress").find(".nums").html(0);
                $("#main_frame" , parent.parent.document).css('height', (h+150)+"px");
			});

			$("body").on("change", ".upload_h", function(){
                var dom=$(this);
				var form = $(this).parent();
				var formData = new FormData(form[0]);
                var size=form.prevObject[0].files[0].size;
                var name=form.prevObject[0].files[0].name;
				var names=name.split(".")[0];
                var reg = /^[A-Za-z0-9_\u4e00-\u9fa5]+$/gi;
                if (!reg.test(names)) {
                    window.$vm.showMsg("请修改文件名称（只能是汉字，字母，数字，下划线组合的名称）");
                    $(".upload_h").val("");//获取文件后清空值
                    return;
				}
				if(names.length>45){
                    window.$vm.showMsg("文件名称过长，请截取到45位以内");
                    $(".upload_h").val("");//获取文件后清空值
                    return;
				}
                if(!((name.indexOf("jpg")>-1)||
                        (name.indexOf("gif")>-1)||
                        (name.indexOf("png")>-1)||
                        (name.indexOf("jpeg")>-1)||
                        (name.indexOf("doc")>-1)||
						(name.indexOf("wps")>-1)||
						(name.indexOf("xls")>-1)||
                        (name.indexOf("xlsx")>-1)||
						(name.indexOf("pptx")>-1)||
						(name.indexOf("pdf")>-1)||
                        (name.indexOf("rar")>-1)||
						(name.indexOf("zip")>-1))){
                    window.$vm.showMsg("请上传图片，word，excel，ppt，pdf，zip，rar格式的文件");
                        $(".upload_h").val("");//获取文件后清空值
                    return;
                }
                if(size>(1024*1024*10*2)){
                    window.$vm.showMsg("请上传小于20M的文件");
                    $(".upload_h").val("");//获取文件后清空值
                    return;
                }
                form.parent().siblings(".progress").show();
                form.parent().siblings(".progress").find(".line").css("width",0);
                form.parent().siblings(".progress").find(".nums").html(0);
				$.ajax({
	                type: 'post',
	                url: that.base+"/api/image/upload",
	                data: formData,
	                cache: false,
	                processData: false,
	                contentType: false,
                    xhr: function () { //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                        var myXhr = $.ajaxSettings.xhr();
                        myXhr.upload.onload = function (){
                            //  alert('finish downloading')
                        }
                        myXhr.upload.onprogress = function (ev) {
                            if(ev.lengthComputable) {
                                var percent = ((100 * ev.loaded/ev.total).toString().split(".")[0]);
                                var random= Math.floor(Math.random()*5+1);
                                var end=  percent-1;
                                console.log(percent,ev);
                                form.parent().siblings(".progress").find(".line").css("width",end+"px");
                                form.parent().siblings(".progress").find(".nums").html(end);

                            }
                        }
                        return myXhr; //xhr对象返回给jQuery使用
                    },
	            	success: function (data) {
                        if(data){
                            form.parent().siblings(".progress").find(".nums").html(100);
                        }
	            		var info = form.next(".uploadinfo");
	            		info.show();
	            		//var name="";
                        // if(that.getBLen(data.data.name)>18){
                         //   name=  data.data.name=data.data.name.substring(0,18)+"..."
						// }else{
                         //     name=data.data.name;
						// }

	            		info.find(".filename").text(data.data.name);
	            		info.find(".download").html("<a href='"+data.data.path+"' target=_blank>下载</a><a class='close' style='background: none'>删除</a>");
	            		info.find(".filesize").text(data.data.sizeStr);
	            		info.find(".filetype").text(data.data.type);
	            		var item = info.parent().parent().parent();
	            		item.addClass("ok");
	            		item.attr('answer', JSON.stringify(data.data));
	            		form.find("input[type=file]").val("");
	            		if ($.inArray(data.data.type, ['jpg','jpeg','png','gif'])!=-1) {
	            			info.parent().next(".preview").show();
	            			info.parent().next(".preview").css({backgroundImage: 'url(\'' + data.data.path + '\')', backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center center'})
	            		}else{
	            			info.parent().next(".preview").hide();
	            		}
                        var o = document.getElementById("wenjuan_list");
                        var h = o.clientHeight||o.offsetHeight;
                        $("#main_frame" , parent.parent.document).css('height', (h+150)+"px");
	            	},
	            	error: function () {
	                	window.$vm.showMsg("上传失败");
	            	}
	            });
			});
			$("body").on("click", '.nav div', function(){
				history.go(-1);
			})


            that.$nextTick(function(){
                setTimeout(function () {
                    var o = document.getElementById("wenjuan_list");
                    var h = o.clientHeight||o.offsetHeight;
                  $("#main_frame" , parent.parent.document).css('height', (h+150)+"px");
                },1000);

            })


		},
		methods: {
            getInfo: function() {
				var that = this;
				this.get(this.base+"/api/policy/detail?qaId="+this.qaId, null, function(data){
					if (data.code==200) {
						that.info = data.data.info;
						that.qaUser = data.data.qaUser;
					}
				});
			},
			getData: function() {
				var that = this;
				this.get(this.base+"/api/policy/qstn/list?qaId="+this.qaId, null, function(data){
					if (data.code==200) {
						that.data = data.data;
						setTimeout(function () {
                            that.parentHeight();
                        },1000);
					}
				});
			},
			submit: function() {
			    var that=this;
				var params = {};
				params.qaId = this.qaId;
				var item_length = $(".item").length;
				var ok_length = $(".ok").length;
				if (ok_length!=item_length) {
					this.showMsg("您有题目未完成，请完成回答后提交");
					return;
				}
				var list = [];
				var items = $(".ok");
				items.each(function(){
					var item = $(this);
					var tmp = {};
					tmp.id = item.attr('data-id');
					tmp.type = item.attr('data-type');
					tmp.answer = item.attr('answer');
					list.push(tmp);
				});
				params.data = list;
				console.log(params);
                that.$$confirm("确认提交?",function (index) {
                    var top = that;
                    if(parent.$vm) {
                        top = parent.$vm;
                    }
                    top.$layer.close(index);
                    that.json(that.base+"/api/policy/answer", that.cc(params), function(data){
                        if (data.code==200) {
                            //window.location = "/list_w_answered";
                            $(parent.document).find("li[data-id='.683']").click();
                            $(parent.document).find("li[data-id='.674']").click();
                        }else{
                            parent.window.location = "/login";
                        }
                    });
                });


			},
			parentHeight: function() {
				$(window.parent.document).find("iframe").height(($(".w-list-wenjuan").height()+100)+'px');
			}
		}
	}

</script>


<style lang="scss" scope>

	.w-list-wenjuan {
		min-height: 600px;
		.nav {
			height: 30px;
			width: 100px;
			display: inline-block;
			.back {
				cursor: pointer;
				img {
					margin-top: -5px;
					display: inline-block;
				}
				span {
					display: inline-block;
					margin-left: 3px;
					color: #193461;
				}
			}
		}
		.submit {
			display: inline-block;
			width: 100%;
			margin: auto;
			margin-top: 20px;
			text-align: center;
			height: 25px;
			div {
				width: 90px;
				height: 100%;
				color: #001e50;
				border-radius: 20px 20px;
				border: 2px solid #001e50;
				margin-left: calc(50% - 45px);
				font-size: 14px;
				cursor: pointer;
				span {
					margin-top: 2px;
					display: block;
				}
			}
		}
	
		.wenjuan {
			min-width: 900px;
			width: 90%;
			/*height: 600px;*/
			/*overflow-y: auto;*/
			/*border-top: 1px solid #00437a;*/
			margin-left: 18px;
			margin-top: 20px;
			.title {
				background: #fff;
			    position: absolute;
			    /*padding-top: 10px;*/
			    padding-right: 10px;
			    text-align: center;
			    font-size: 18px;
			    color: #00437a;
			}
			.list {
				padding-top: 40px;
				ul {
					list-style: none;
					width: 100%;
					li {
						width: 100%;
						border-top: 1px solid #dcdddd;
						.item {
							.cccc {
								position: relative;
								.des {
									height: 30px;
									width: 80%;
									color: #00437a;
									display: inline-block;
									margin-top: 10px;
									.type {
										color: #333;
									}
									span:nth-child(1) {
										margin-right: 6px;
									}
									span:nth-child(2) {
										font-weight: bold;
									}
								}
								.progress{
									position: absolute;
									left: 120px;
									top: 50px;
									color: #000;
									.line{
										display: inline-block;
										height: 8px;
										background-color: #00437a;
									}
									.nums{
										display: inline-block;

									}
								}
								.preview {
									width: 200px;
								    height: 158px;
								    float: right;
								    margin-top: -35px;
								    display: none;
								}
								.contents {
									margin-top: 10px;
									margin-left: 20px;
									width: 600px;
									display: inline-block;
									.textarea {
										width: 100%;
										height: 100px;
										padding: 15px;
										border-radius: 5px 5px;
										color: #000;
									}
									.input {
										width: 100%;
										height: 15px;
										padding: 10px;
										color: #000;
									}
									.upload {
										color: #00437a;
										width: 90px;
										border: 2px solid #00437a;
										border-radius: 10px 10px;
										cursor: pointer;
										float: left;
										margin-left: -90px;
									}
									.upload_h {
										width: 90px;
										opacity: 0;
										cursor: pointer;
    									
										float: left;
									}
									.uploadinfo {
										display: none;
									    height: 59px;
									    width: 700px;
									    margin-top: 30px;
									    color: #28426c;
									    div {
									    	height: 20px;
									    	float: left;
									    	width: 90%;
									    }
									    img {
									    	float: right;
									    }
									    .download {
									    	margin-left: 80px;
									    	a {
									        margin-left: 10px;
										    text-decoration: none;
										    color: #00437a;
										    padding: 3px 7px;
										    border: 2px solid #00437a;
										    border-radius: 10px 10px;
										    cursor: pointer;
										    }
									    }
									}
								}
								padding-bottom: 20px;
							}
						}
					}
				}
			}
		}
	}

	input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
	  color: gray;
	}

	input:-moz-placeholder, textarea:-moz-placeholder {
	  color: gray;
	}

	input::-moz-placeholder, textarea::-moz-placeholder {
	  color: gray;
	}

	input:-ms-input-placeholder, textarea:-ms-input-placeholder {
	  color: gray;
	}
</style>