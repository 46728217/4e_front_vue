<!--新标准展厅平面图例-->
<template>
	<div class="platform-standard" style="position: relative;">
		<div class="annotation-notes" style="width:80%;">
			<p>标注说明:</p>
			<p>鼠标滚轮放大缩小图片，左键按住可拖动，右键添加标记</p>
		</div>
		<div id="container" style="padding: 1px;;border:1px solid #aaa;position: relative" :style="{width: imgWidth, height: imgHeight}" >
			<img  class="platform" :src="platformimg" :style="{width: imgWidth, height: imgHeight}"  >
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
					<span class="component ccstarttime"></span>
				</div>
			</div>
			<div class="block">
				<span>素材编码:</span>
				<div class="cc">
					<span class="component ccmaterialcode"></span>
				</div>
			</div>
			<div class="block">
				<span>物料图示:</span>
				<div class="bg"></div>
			</div>
			<div class="block btnopt">
				<div class="btn submit" @click="submit_updateClick" v-show="isAdd==true">设置该物料</div>
				<div class="btn cancel" @click="cancelClick" v-show="isAdd==true">取消</div>
				<div class="btn update" @click="submit_updateClick"v-show="isAdd==false && userManage==1">修改</div>
				<div class="btn delete" @click="deleteClick" v-show="isAdd==false && userManage==1">删除</div>
				<div class="btn close"  @click="closeClick"v-show="isAdd==false">关闭</div>
				<div class="btn detail"  v-show="isAdd==false" >素材详情</div>

			</div>
		</div>
		<PlatformList ref="child" :usettype="type"></PlatformList>
		<div style="color:#96a3a8;font-size: 14px;text-align: center;width: 100%;padding:40px 0 20px 0">©一汽-大众汽车有限公司 版权所有</div>
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
				type: 0,
				isShowSetting: false,
				isAdd: false,
				userManage: 0,
                cctype:0,
                ccmaterial:0,
				code:'',
                platformimg:'',
                imgWidth:'',
                imgHeight:''
			}
		},
        props: ["platform_type","platform_url","platformimg_width","platformimg_height"],
        components:{
            PlatformList:PlatformList,
        },
        mounted(){
        },
		created: function() {
			var that = this;
            that.platformimg=that.platform_url;
            that.type=that.platform_type;
            that.imgWidth=that.platformimg_width;
            that.imgHeight=that.platformimg_height;
			localStorage.setItem("userManage",0);
			this.get(this.base+"/api/user/islogin", null, function(data){
				if (data.code==0) {
					parent.window.location = "/login";
					return;
				}
				that.user = data.data;
				console.log(that.user);
				if (that.user.roleId == "1") {
					that.userManage = 1;
					localStorage.setItem("userManage",1);
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
					$(".ccmaterialcode").text(item.code);
					$(".bg").css({backgroundImage: 'url(\'' + item.thumb1 + '\')', backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center center'});
				}
			});

            $("body").on('click', '.detail', function(){
                var code=that.code;
                if (code=="") {
                    that.showMsg('暂无素材关联');
                    return;
                }
                that.get(that.base+"/api/search/code?filecode="+code, null, function(data){
                    if(data.code==0) {
                        that.showMsg("未找到您输入编码对应的素材");
                        return;
                    }
                    var material = data.data;
                    that.detail(material.id);
                });
            });

			$("body").unbind('click',".mark").on("click", ".mark", function(){
                var tid = $(this).attr('tid');
                that.isShowSetting = true;
               $(".setting").attr("markid",$(this).attr('id'));
                if(that.userManage!=1){
                    $(".cctype").attr("disabled",true);
                    $(".ccmaterial").attr("disabled",true);
                }
                if(tid){
                    that.isAdd = false;
                    that.get(that.base+"/api/fawvwmaterial/detail?tid="+tid, null, function(data){
                        if (data.code==200) {
                            var materialtype = data.data.materialtype;
                            var marerialid = data.data.id;
                          //  $(".cctype").val(materialtype);
                            that.cctype=materialtype;
                            that.code=data.data.code;
                            that.get(that.base+"/api/fawvwmaterial/location/list?usetype="+that.type+"&tid="+materialtype, null, function(data){
                                if (data.code==200) {
                                    that.materialList = data.data;
                                    that.ccmaterial= marerialid;
                                    $(".ccmaterial").change();
                                }

                            });
                        }
                    })
				}else{//新增标记点 弹窗打开
                    that.isAdd = true;
                    that.cctype=0;
                    that.ccmaterial= 0;
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
            parentFun(){
                this.$refs.child.test();//父组件调用子组件方法
            },
            detail: function(id, activity_id) {
                this.get(this.base+"/api/cate/change?materialId="+id, null, function(data){
                    if (data.code==200) {
                        var url = "/library?id="+id;
                        if (activity_id!=null) {
                            url += "&activityId="+activity_id;
                        }
                        top.window.open(url,'_blank')
                    }
                });
            },
            submit_updateClick(){
                var that=this;
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
                var unid= $('#'+markid).attr("unid");
                if(unid!=""){//表示修改
                    params.id=unid;
                }
                params.x = ($('#'+markid).css('left').replace("px",""));
                params.y = ($('#'+markid).css('top').replace("px",""));
                params.type = that.type;
                that.json(that.base+'/api/location/submit', that.cc(params), function(data){
                    if (data.code==200) {
                        $("body").find("#"+markid).attr("unid",data.id).attr("tid",params.tid).attr("type",that.type);
                        if(unid!=""){//表示修改
                            that.showMsg("修改标注点成功");
                        }else{
                            that.showMsg("添加标注点成功");
                        }
                        that.isShowSetting = false;

                       that.$emit("changePlatformSubMenu");
                    }else{
                        if(unid!=""){//表示修改
                            that.showMsg("修改标注点失败");
                        }else{
                            that.showMsg("添加标注点失败");
                        }
                    }
                });
                $('.setting').removeAttr('markid');
                that.materialList = [];
                $(".ccsize").text('');
                $(".cclocation").text('');
                $(".ccstarttime").text('');
                $(".ccmaterialcode").text('');
                $(".bg").removeAttr('style');
			},
            closeClick(){
                var that=this;
                that.isShowSetting = false;
                $('.setting').removeAttr('markid');
                that.materialList = [];
                $(".ccsize").text('');
                $(".cclocation").text('');
                $(".ccstarttime").text('');
                $(".ccmaterialcode").text('');
                $(".bg").removeAttr('style');
			},
            deleteClick(){
                var that=this;
                that.isShowSetting = false;
                var id=($('.setting').attr('markid').replace("mark_",""));
                var unid=$("body").find("#"+$('.setting').attr('markid')).attr("unid");
                $('#container').ZoomMark('deleteMark',id);

                that.get(that.base+"/api/location/deletes?id="+unid, null, function(data){
                    if (data.code==200) {
                        that.$emit("changePlatformSubMenu");
                    }
                })
			},
            cancelClick(){
                var that=this;
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
			},
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
				$(window.parent.document).find("iframe").height(($(".platform").height()+200)+'px');
			}
		}
	}
</script>


<style lang="scss" scope>
	.platform-standard {
		position: relative;
		width: 100%;
		min-height: 400px;
		.annotation-notes{
			display: inline-block;
			vertical-align: top;

			height: 50px;
			line-height: 2;
			border: 1px solid white;
			margin: 10px 20px;
		}
		#container{
			display: inline-block;
			/*width: 750px;*/
			/*height: 475px;*/
			/*width: 875px;*/
			/*height: 417.5px;*/
			/*background-image: url('../../assets/4e/img/transparent.png');*/
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
			top: 5.8%;
			left: calc(30% - 250px);

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
				width: 90%;
				height: 30px;
				margin-left: 5%;
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

	/*ie11 css hack*/
	@media all and (-ms-high-contrast:none) {
		*::-ms-backdrop, select{
			border: none;
		}
	}
</style>