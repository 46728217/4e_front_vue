<!--e-shop-->
<template>
	<div class="e-shop">
		<app-header :page_tab="page_tab"></app-header>
		<!--tab-->
		<div class="tab">
			<div class="search_code">
				<input :placeholder="search_placeholder" />
				<div><img src="../../assets/4e/img/find.png"/></div>
			</div>
			<div class="submenu">
				<ul v-if="current_left_menu_id!=481">
					<li v-for="(item,index) in submenu_s" :class="item.active==1?'active':''" :data-id="item.id" @click="changeSubMenu(item.id, item.permissionCode, item.pageUrl)">
						<div><span>{{item.name|dz}}</span></div>
					</li>
				</ul>
				<ul v-else>
					<li v-for="(it,i) in platformsubmenu_s" :class="it.active==1?'active':''"  :data-id="it.type" @click="changePlatformSubMenu(i,it.type,it.url,it.width,it.height)">
						<div><span>{{it.name|dz}}</span></div>
					</li>
				</ul>
			</div>
		</div>

		<!--left-->
		<div class="left">
			<ul>
				<li v-for="(item,index) in menu" :class="item.active==1?'active':''" :data-id="item.id" @click="changeLeftMenu(item.id)">
					<img :src="item.active==1?item.icoblue:item.ico"/>
					<span>{{item.name|dz}}</span>
				</li>

			</ul>
		</div>
		<!--split-->
		<div class="frame_split">
			<img src="../../assets/jieda/img/frame_split.png" />
		</div>
		<div class="frame_main">
			<iframe  v-if="current_left_menu_id!=481"  id="main_frame" :src="main_url" scrolling="no" style="width: 100%;" frameborder="0"></iframe>
			<div class="platform" v-else >
				<Platform @changePlatformSubMenu="changePlatformSubMenu(platform_curr_index,platform_type,platform_url,platformimg_width,platformimg_height)"  :key="timer" :platform_type="platform_type" :platform_url="platform_url" :platformimg_width="platformimg_width" :platformimg_height="platformimg_height"></Platform>
			</div>

		</div>
	</div>
</template>

<script>
    import font_css from '@/assets/4e/css/font.css'
    import global_css from '@/assets/4e/css/global.css'
    import Header from './header_s.vue';
    import Footer from './footer.vue';
    import Platform from './Platform.vue';
    var base = localStorage.getItem("base")
    export default {
        data: function(){
            var that = this;
            return {
                search_placeholder: this.dz("输入素材编码搜索"),
                page_tab: "shop",
                base: base,
                menu: {},
                current_left_menu_id : 0,
                submenu: {},
                submenu_s: [],
                current_sub_menu_id : 0,
                main_url: "",
                changeLeft: false,
                platformsubmenu_s:[],
                timer:'',
                platform_curr_index:0,
                platform_type:1,//默认第一个
                platform_url:'/static/4e/plat_1.jpg',//图片下标
                platformimg_width:'1030px',
                platformimg_height:'542px'
            }
        },

        components : {
            "app-header": Header,
            "app-footer": Footer,
			"Platform":Platform
        },
        methods: {
            init: function() {
                var menu_id = this.$route.params.menu_id;
                if (menu_id) {
                    this.current_left_menu_id = menu_id;
                }
                this.submenu = this.menu[this.current_left_menu_id].children;
                var tmp = [];
                var active = 1;
                for(var key in this.submenu) {
                    var item = this.submenu[key];
                    if (this.changeLeft==false && this.current_sub_menu_id==0) {
                        if (active==1) {
                            item.active = active;
                            this.current_sub_menu_id = item.id;
                            active = 0;
                        }else {
                            item.active = active;
                        }
                    }else if(this.changeLeft==false && this.current_sub_menu_id!=0){
                        if (this.current_sub_menu_id == item.id) {
                            item.active = active;
                            active = 0;
                        }else{
                            item.active = 0;
                        }
                    }else{
                        if (active==1) {
                            item.active = active;
                            this.current_sub_menu_id = item.id;
                            active = 0;
                        }else {
                            item.active = active;
                        }
                    }
                    this.submenu[key] = item;
                    tmp.push(item);
                }
                this.submenu_s = tmp.sort(function(a, b){
                    if (a.sortId>b.sortId) return 1;
                    if (a.sortId<b.sortId) return -1;
                    return 0;
                });
                this.changeSubMenu(this.current_sub_menu_id, this.submenu[this.current_sub_menu_id].permissionCode, this.submenu[this.current_sub_menu_id].pageUrl);
                this.title('一汽-大众营销支持中心 '+this.menu[this.current_left_menu_id].name+"|"+this.submenu[this.current_sub_menu_id].name);
            },
            changeLeftMenu: function(id) {
                var that=this;
                this.menu[id].active = 1;
                this.menu[this.current_left_menu_id].active = 0;
                this.current_left_menu_id = id;
                this.changeLeft = true;
                this.init();
                if(this.current_left_menu_id==481){//展厅
                    var arr=[
                        {"type":"1","url":"/static/4e/plat_1.jpg","name":"1型","width":"1030px","height":"542px"},
                        {"type":"2","url":"/static/4e/plat_2.jpg","name":"2型","width":"1030px","height":"656px"},
                        {"type":"7","url":"/static/4e/plat_7.jpg","name":"3/4型","width":"1030px","height":"695px"},
                        {"type":"3","url":"/static/4e/plat_3.jpg","name":"1伞","width":"1030px","height":"971px"},
                        {"type":"4","url":"/static/4e/plat_4.jpg","name":"2大伞","width":"1030px","height":"746px"},
                        {"type":"5","url":"/static/4e/plat_5.jpg","name":"2小伞","width":"1030px","height":"591px"},
                        {"type":"6","url":"/static/4e/plat_6.jpg","name":"4伞","width":"1030px","height":"1000px"}];
                    for(var i=0;i<arr.length;i++){
                        if(i==0){
                            that.platform_type= arr[i].type;
                            arr[i].active=1;
                        }else{
                            arr[i].active=0;
                        }
                    }
                    that.platformsubmenu_s=arr;
                }
            },
            changePlatformSubMenu(i,type,url,width,height){

                var that=this;
                this.timer = new Date().getTime();
                var list=this.platformsubmenu_s;
                for(var n=0;n<list.length;n++){
                    if(i==n){
                        this.platformsubmenu_s[n].active = 1;
                    }else{
                        this.platformsubmenu_s[n].active = 0;
                    }
                }
                that.platform_curr_index=i;
                that.platform_type=type;
                that.platform_url=url;
                that.platformimg_width=width;
                that.platformimg_height=height;
            },
            changeSubMenu: function(id, code, pageUrl) {
                this.submenu[id].active = 1;
                if (this.current_sub_menu_id != id) {
                    this.submenu[this.current_sub_menu_id].active = 0;
                    this.current_sub_menu_id = id;
                }
                var cat_id = this.getNumber(code);
                //this.main_url = "/list?second_cat_id="+cat_id;
                this.main_url = this.base + pageUrl;
                if ($(".submenu li[class=active]").data("id")==634) {
                    $(".submenu li[class=active]").click(function(){
                        window.location = "/jsp/pc/interface/faw/do.jsp?method=doLogin2019";
                    });
                }
                // if (this.current_sub_menu_id==482) {
                //     this.main_url = "/platform_standard";
                //     return;
                // }
                // if (this.current_sub_menu_id==483) {
                //     this.main_url = "/platform_best";
                //     return;
                // }
                // if (this.current_sub_menu_id==484) {
                //     this.main_url = "/platform_notbest";
                //     return;
                // }
            }
        },
        created: function(){
            if (this.$route.query.leftId!=null) {
                this.current_left_menu_id = this.$route.query.leftId;
            }
            if (this.$route.query.subId!=null) {
                this.current_sub_menu_id = this.$route.query.subId;
            }
            var that = this;
            this.get(this.base+"/api/user/islogin", null, function(data){
                if (data.code==0) {
                    window.location = "/login";
                    return;
                }
            });
            $.ajax({
                url: this.base+"/api/menu/left",
                data: {topName: 'e-shop'},
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function(data){
                    if (data.code==200) {
                        var menu = {};
                        var active = 1;
                        for(var key in data.data) {
                            var item = data.data[key];
                            item.ico = that.base+"/static/pc/adminStyles/images/ico_dark/ico"+item.id+".png";
                            item.icoblue = that.base+"/static/pc/adminStyles/images/ico_blue/ico"+item.id+".png";

                            switch(item['level']) {
                                case 2:
                                    if (menu[item['id']]==null) {
                                        item.children = {};
                                        if (active==1 && that.current_left_menu_id==0) {
                                            that.current_left_menu_id = item['id'];
                                            item.active = active;
                                            active = 0;
                                        }else if(that.current_left_menu_id!=0 && item['id']==that.current_left_menu_id){
                                            item.active = active;
                                            active = 0;
                                        }
                                        menu[item['id']] = item;
                                    }
                                    break;
                                case 3:
                                    if (menu[item['parentId']]!=null) {
                                        item.children = {};
                                        menu[item['parentId']].children[item['id']] = item;
                                    }
                                    break;
                                case 4:
                                    var idPath = item['idPath'].split(",");
                                    var first = idPath[1];
                                    var second = idPath[2];
                                    if (menu[first]!=null && menu[first].children[second]!=null) {
                                        menu[first].children[second].children[item['id']] = item;
                                    }
                                    break;
                            }
                        }
                        that.menu = menu;
                        that.$nextTick(function(){
                            that.init();
                        })
                    }
                }
            });
        }
    }
</script>

<style lang="scss" scope>
	.e-shop {
		letter-spacing: 1px;
		width: 100%;
		min-width: 1280px;
		height: 100%;
		.tab {
			height: 50px;
			width: 100%;
			background: transparent;
			margin-top: -50px;
			.search_code {
				width: 320px;
				height: 100%;
				float: left;
				font-family: 'font-hy-55';
				input {
					height: 34px;
					margin-top: 6px;
					margin-left: 60px;
					width: 60%;
					font-size: 14px;
					background: transparent;
					border: unset;
					color: #fff;
					background: transparent \9;
					border: none \9;
				}

				div {
					display: inline-block;
					height: 30px;
					margin-top: 14px;
					float: right;
					margin-right: 23px;
				}
			}
			.submenu {
				width: 70%;
				height: 100%;
				display:inline-block;
				margin-left: 15px;

				ul {
					list-style: none;
					height: 100%;
					font-size: 14px;
					color: #fff;
					font-family: 'font-hy-55';
					li {
						float: left;
						line-height: 100%;
						height: 100%;
						padding-left: 20px;
						cursor: pointer;
						div {
							height: 100%;
							span {
								display: inline-block;
								margin-top: 18px;
							}
						}
					}
					.active {
						color: #00b0f0;
					}
				}
			}
		}
		.left {
			width: 320px;
			height: 80%;
			display: inline-block;
			position: absolute;
			ul {
				width: 80%;
				height: 90%;
				margin-left: 20%;
				padding-top: 10%;
				list-style: none;
				font-size: 16px;
				color: rgb(46, 62, 77);
				font-family: "font-hy";
				font-weight: 500;
				display: inline-block;
				overflow: hidden;
				li {
					width: 100%;
					height: 40px;
					padding-top: 20px;
					font-family: 'font-hy-55';
					color: #2e2e2e;
					cursor: pointer;
					img {
						opacity: 0.3;
						width: 20px;
						height: 20px;
						//<!--margin-left: -20px;-->
					//	<!--margin-right: 20px;-->
						//<!--filter: drop-shadow(20px 0px 0rem gray);-->
					}
					span {
						margin-left: 15px;
						vertical-align: top;
						line-height: 20px;
						display: inline-block;
					}
				}
				li:hover {
					color: #00b0f0;
					font-family: 'font-hy-75';
					img {
						opacity: 1;
						width: 20px;
						height: 20px;
						//<!--margin-left: -20px;-->
						//<!--margin-right: 20px;-->
						//<!--filter: drop-shadow(20px 0px 0rem #00b0f0);-->
					}
				}
				.active {
					color: #00b0f0;
					font-family: 'font-hy-75';
					img {
						opacity: 1;
						width: 20px;
						height: 20px;
						//margin-left: -20px;
						//margin-right: 20px;
						//filter: drop-shadow(20px 0px 0rem #00b0f0);
					}
				}
			}
		}
		.frame_split {
			width:5px;
			height: 100%;
			display: inline-block;
			position: absolute;
			margin-top: -35px;
			left: 320px;
			img {
				height: 100%;
			}
		}
		.frame_main {
			margin-top: 35px;
			display: block;
			margin-left: 340px;
			width: calc(100% - 340px);
		}
	}
	/*ie11 css hack*/
	@media all and (-ms-high-contrast:none) {
		*::-ms-backdrop, .e-shop .tab .search_code input{
			background: transparent;
			border: none;
		}
	}
</style>
