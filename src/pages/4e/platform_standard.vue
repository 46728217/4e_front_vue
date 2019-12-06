<!--新标准展厅平面图例-->
<template>
	<div class="platform-standard">
		<div class="annotation-notes">
			<p>标注说明:</p>
			<p>鼠标滚轮放大缩小图片，左键按住可拖动，右键添加标记</p>
		</div>
		<div id="container" style="border:1px solid #aaa;">
			<img class="platform" src="/static/4e/platform_2.jpg" >
			<button id="reset" class="lipButton">还原</button>

		</div>


		<div class="setting" v-show="isShowSetting==true">
			<div class="block">
				<span>物料种类:</span>
				<div class="cc">
					<select class="component cctype" v-model="cctype">
						<option value="0">请选择</option>
						<option v-for="(item,index) in typeList" :value="item.tid">{{item.typename}}</option>
					</select>
				</div>
			</div>
			<div class="block">
				<span>物料名称:</span>
				<div class="cc">
					<select class="component ccmaterial" v-model="ccmaterial">
						<option value="0">请选择</option>
						<option v-for="(item,index) in materialList" :value="item.id">{{item.materialname}}</option>
					</select>
				</div>
			</div>
			<div class="block">
				<span>尺寸规划:</span>
				<div class="cc">
					<span class="component ccsize"></span>
				</div>
			</div>
			<div class="block">
				<span>安装位置:</span>
				<div class="cc">
					<span class="component cclocation"></span>
				</div>
			</div>
			<div class="block">
				<span>开始时间:</span>
				<div class="cc">
					<input class="component ccstarttime" type="text"/>
				</div>
			</div>
			<div class="block">
				<span>物料代码:</span>
				<div class="cc">
					<span class="component ccmaterialcode"></span>
				</div>
			</div>
			<div class="block">
				<span>物料图示:</span>
				<div class="bg"></div>
			</div>
			<div class="block btnopt">
				<div class="btn submit" v-show="isAdd==true">设置该物料</div>
				<div class="btn cancel" v-show="isAdd==true">取消</div>
				<div class="btn delete" v-show="isAdd==false && userManage==1">删除</div>
				<div class="btn close" v-show="isAdd==false">关闭</div>
			</div>
		</div>
		<PlatformList :usettype="3"></PlatformList>
		<div style="color:#96a3a8;font-size: 14px;text-align: center;width: 100%;padding:40px 0 0 0">©一汽-大众汽车有限公司 版权所有</div>
	</div>

</template>

<script>
	import Vue from 'vue'
	var base = localStorage.getItem("base");
    import PlatformList from './PlatformList'

    import util_js from '@/assets/4e/js/util.js'
	import font_css from '@/assets/4e/css/font.css'
	import global_css from '@/assets/4e/css/global.css'
    import * as zoomMark from '@/assets/4e/js/zoomMark.js';
    Vue.use(zoomMark)
	Vue.use(util_js)
	export default {
		data: function(){
			return {
				base: base,
				user: {},
				typeList: [],
				materialList: [],
				inPlatform: false,
				type: 3,
				isShowSetting: false,
				isAdd: false,
				userManage: 0,
                cctype:0,
                ccmaterial:0,
			}
		},
        components:{
            PlatformList:PlatformList,
        },
        mounted(){
        },
		created: function() {
			var that = this;
			this.get(this.base+"/api/user/islogin", null, function(data){
				if (data.code==0) {
					parent.window.location = "/login";
					return;
				}
				that.user = data.data;
				console.log(that.user);
				if (that.user.roleId == "1") {
					that.userManage = 1;
				}
			}, false);
			this.getMaterialTypeList();
			this.getData();
            setInterval(function(){that.parentHeight();}, 1000);
			$("body").on('change', '.cctype', function(){
				var tid = that.cctype;
				that.getFawvwmaterialLocationList(tid);
                that.materialList = [];
                that.ccmaterial= 0;
                $(".ccsize").text('');
                $(".cclocation").text('');
                $(".ccstarttime").text('');
                $(".ccmaterialcode").text('');
                $(".bg").removeAttr('style');
			});
			$("body").on('change', '.ccmaterial', function(){
				var id = that.ccmaterial;
				var item = null;
				for(var key in that.materialList) {
					var tmp = that.materialList[key];
					if (tmp.id == id) {
						item = tmp;
						break;
					}
				}
				if (item != null) {
					$(".ccsize").text(item.imgsize);
					$(".cclocation").text(item.installposition);
					$(".ccstarttime").text(item.startdescribe);
					$(".ccmaterialcode").text(item.id);
					$(".bg").css({backgroundImage: 'url(\'' + item.thumb1 + '\')', backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center center'});
				}
			});
			$("body").on('click', '.cancel', function(){
                var id=($('.setting').attr('markid').replace("mark_",""));
                $('#container').ZoomMark('deleteMark',id);
				that.isShowSetting = false;
                $('.setting').removeAttr('markid');
				that.materialList = [];
				$(".ccsize").text('');
				$(".cclocation").text('');
				$(".ccstarttime").text('');
				$(".ccmaterialcode").text('');
				$(".bg").removeAttr('style');
			});
			$("body").on('click', '.close', function(){
				that.isShowSetting = false;
				$('.setting').removeAttr('markid');
				that.materialList = [];
				$(".ccsize").text('');
				$(".cclocation").text('');
				$(".ccstarttime").text('');
				$(".ccmaterialcode").text('');
				$(".bg").removeAttr('style');
			});
			$("body").on('click', '.delete', function(){
				that.isShowSetting = false;
                var id=($('.setting').attr('markid').replace("mark_",""));
                var unid=$("body").find("#"+$('.setting').attr('markid')).attr("unid");
                $('#container').ZoomMark('deleteMark',id);

                that.get(that.base+"/api/location/deletes?id="+unid, null, function(data){
                    if (data.code==200) {
                        history.go(0);
                        // $('.setting').removeAttr('markid');
                        // that.materialList = [];
                        // $(".cctype").val('0');
                        // $(".ccsize").text('');
                        // $(".cclocation").text('');
                        // $(".ccstarttime").text('');
                        // $(".ccmaterialcode").text('');
                        // $(".bg").removeAttr('style');
                    }
                })


			});
			$("body").on('click', '.submit', function(){
			    if(that.cctype==0){
                    that.showMsg("请选择物料种类");
			        return;
                }
                if(that.ccmaterial==0){
                    that.showMsg("请选择物料名称");
                    return;
                }
              $('#container').ZoomMark('reset');//获取默认坐标值
				var params = {};
				params.tid = $('.ccmaterial').val();
				var markid=$('.setting').attr('markid');
				params.x = ($('#'+markid).css('left').replace("px",""));
				params.y = ($('#'+markid).css('top').replace("px",""));
				params.type = that.type;
				that.json(that.base+'/api/location/submit', that.cc(params), function(data){
					if (data.code==200) {
                        $("body").find("#"+markid).attr("unid",data.id).attr("tid",params.tid).attr("type",that.type);
                        that.showMsg("添加标注点成功");
						that.isShowSetting = false;
                        history.go(0);
					}else{
						that.showMsg("添加标注点失败");
					}
				});
				$('.setting').removeAttr('markid');
				that.materialList = [];
				$(".ccsize").text('');
				$(".cclocation").text('');
				$(".ccstarttime").text('');
				$(".ccmaterialcode").text('');
				$(".bg").removeAttr('style');
			});

			$("body").on("click", ".mark", function(){
                var tid = $(this).attr('tid');
                that.isShowSetting = true;
               $(".setting").attr("markid",$(this).attr('id'));
                if(tid){
                    that.isAdd = false;
                    that.get(that.base+"/api/fawvwmaterial/detail?tid="+tid, null, function(data){
                        if (data.code==200) {
                            var materialtype = data.data.materialtype;
                            var marerialid = data.data.id;
                          //  $(".cctype").val(materialtype);
                            that.cctype=materialtype;
                            that.get(that.base+"/api/fawvwmaterial/location/list?usetype="+that.type+"&tid="+materialtype, null, function(data){
                                if (data.code==200) {
                                    that.materialList = data.data;
                                    that.ccmaterial= marerialid;
                                    $(".ccmaterial").change();
                                    $(".cctype").attr("disabled",true);
                                    $(".ccmaterial").attr("disabled",true);

                                }

                            });
                        }
                    })
				}else{//新增标记点 弹窗打开
                    that.isAdd = true;
                    that.cctype=0;
                    that.ccmaterial= 0;
                    $(".cctype").attr("disabled",false);
                    $(".ccmaterial").attr("disabled",false);

				}

			});
            $("body").on("click",'#reset',function(){
                $('#container').ZoomMark('reset');
            });
			setTimeout(function () {
                $('#container').ZoomMark({
                    'markColor':'transparent',
                });
            },1000);
		},
		methods: {
			getData: function() {
				var that = this;
				localStorage.removeItem("mMarks");
				this.get(this.base+"/api/location/list?type="+this.type, null, function(data){
					if (data.code==200) {
						that.data = data.data;
						var mMarks=[];
						for(var key in that.data) {
							var tmp = that.data[key];
                            var d = JSON.parse(tmp.data);
                            mMarks.push({
                                'id':Number(key)+1,
                                'x': Number(d.x),
                                'y': Number(d.y),
                                'name':'',
								'unid':tmp.id,
								'tid':d.tid,
								'type':that.type,
                                'content':'',
                                'color': "transparent",
                                'available':true
                            });
						}
                        localStorage.setItem("mMarks",JSON.stringify(mMarks));
					}
				})
			},
			getMaterialTypeList: function() {
				var that = this;
				this.get(this.base+"/api/fawvwmaterial/type/list?type="+this.type, null, function(data){
					if (data.code==200) {
						that.typeList = data.data;
					}
				});
			},
			getFawvwmaterialLocationList: function(tid) {
				var that = this;
				this.get(this.base+"/api/fawvwmaterial/location/list?usetype="+this.type+"&tid="+tid, null, function(data){
					if (data.code==200) {
						that.materialList = data.data;
					}
				});
			},
			parentHeight: function() {
				$(window.parent.document).find("iframe").height(($(".platform-standard").height()+100)+'px');
			}
		}
	}
</script>


<style lang="scss" scope>
	.platform-standard {
		width: 100%;
		min-height: 400px;
		/*.operations {*/
			/*.addbtn {*/
				/*width: 85px;*/
				/*height: 20px;*/
				/*text-align: center;*/
				/*display: block;*/
				/*font-size: 14px;*/
				/*margin-left: 50px;*/
				/*margin-top: 0px;*/
				/*border: 1px solid #00b0f0;*/
				/*border-radius: 5px 5px;*/
				/*color: #00b0f0;*/
				/*cursor: pointer;*/
			/*}*/
		/*}*/
		/*.background {*/
			/*width: 100%;*/
			/*!*height: 800px;*!*/
			/*.platform {*/
				/*background: url(/static/4e/platform_2.jpg) no-repeat;*/
			    /*background-size: contain;*/
			    /*height: 500px;*/
			    /*width: 837px;*/
			    /*text-align: center;*/
			    /*margin-left: 80px;*/
			    /*margin-top: 50px;*/
			/*}*/
		/*}*/
		.annotation-notes{
			display: inline-block;
			vertical-align: top;
			width:350px;
			height: 50px;
			line-height: 2;
			border: 1px solid white;
			margin: 10px 20px;
		}
		#container{
			display: inline-block;
			width: 750px;
			height: 475px;
			background-image: url('../../assets/4e/img/transparent.png');
			.platform{
				width: 100%;
			}
			.lipButton{
				width:50px;
				height: 60px;
				background-color: rgba(9,7,35,0.9);
				position: absolute;

				color:#FFF;
				border-width: 0px;
				border-radius: 10px;
				font-size: 10px;
				z-index: 999;
			}

			#reset{
				top:5px;
				right: 5px;
			}
			#reset:before{
				background-image: url(../../assets/4e/img/reset.png);
				content: '';
				width: 36px;
				height: 36px;
				display: block;
			}
			.mark:hover{
				cursor: pointer;
			}
		}
		.setting {
			width: 500px;
			height: 550px;
			background: #fff;
			border: 1px solid #e3e3e3;
			color: #001c4c;
			position: absolute;
			top: 10%;
			left: calc(50% - 250px);

			.block {
				width: 90%;
				margin-left: 5%;
				margin-top: 15px;
				text-align: center;
				.cc {
					display: inline-block;
					width: 300px;
					border: unset;
					margin-left: 3%;
					border-bottom: 1px solid #00437a;
					.component {
						border: unset;
						width: 100%;
						display: inline-block;
					}
				}
				.bg {
					height: 200px;
					width: 66%;
					background: #6bc8f4;
					display: inline-block;
    				vertical-align: top;
    				margin-top: 2px;
    				margin-left: 3%;
				}


			}
			.btnopt {
				width: 80%;
				height: 30px;
				margin-left: 10%;
				margin-top: 20px;
				display: inline-block;
				.btn {
					color: #fff;
					display: inline-block;
					margin: 10px;
					background: #6bc8f4;
					width: 80px;
					height: 20px;
					border-radius: 5px 5px;
					cursor: pointer;
				}
			}
			
		}
	}

</style>