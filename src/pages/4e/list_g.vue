<!--广告素材提报管理页面-->
<template>
<div class="g-list" v-cloak>
	<div class="cond" v-if="userManage==1">
		<div class="year">
			<span>{{'年份'|dz}}</span>
			<div class="cc" >
				<select class="year" v-model="cond.year">
					<option value="0">{{'全部'|dz}}</option>
					<option v-for="(item,index) in years" v-bind:value="index" v-if="item!=null && index!=0">{{index.split(".")[1]}}</option>
				</select>
			</div>
		</div>
		<div class="select">
			<span>{{'批次'|dz}}</span>
			<div class="cc" >
				<select class="batch" v-model="cond.batch">
					<option value="0">{{'全部'|dz}}</option>
					<option v-for="(item,index) in years[cond.year]" v-bind:value="item.id">{{item.name}}</option>
				</select>
			</div>
		</div>
		<div class="dq" v-if="bigCommunityList.length>1">
			<span>{{'大区'|dz}}</span>
			<div class="cc">
			<select v-model.trim="cond.dq" @change="getCommunityList(cond.dq)">
				<option value="0">{{'全部'|dz}}</option>
				<option  v-for="item in bigCommunityList" v-bind:value="item.id">{{item.name}}</option>
			</select>
			</div>
		</div>
		<div class="dq" v-if="bigCommunityList.length==1">
			<span>{{'大区'|dz}}</span>
			<div class="cc">
			<select style="background:lightgray" disabled=disabled v-model.trim="cond.dq" @change="getCommunityList(cond.dq)">
				<option v-for="item in bigCommunityList" v-bind:value="item.id">{{item.name}}</option>
			</select>
			</div>
		</div>
		<div class="xq" v-if="bigCommunityList.length==1 && smallCommunityList.length==1">
			<span>{{'小区'|dz}}</span>
			<div class="cc">
			<select style="background:lightgray" disabled=disabled v-model.trim="cond.xq" @change="getDealerList(cond.xq)">
				<option selected="selected" v-for="item in smallCommunityList" v-bind:value="item.id">{{item.name}}</option>
			</select>
			</div>
		</div>
		<div class="xq" v-else>
			<span>{{'小区'|dz}}</span>
			<div class="cc">
			<select v-model.trim="cond.xq" @change="getDealerList(cond.xq)">
				<option  value="0">{{'全部'|dz}}</option>
				<option v-for="item in smallCommunityList" v-bind:value="item.id">{{item.name}}</option>
			</select>
			</div>
		</div>
		<div class="dealer">
			<span>经销商</span>
			<div class="cc">
			<select v-model.trim="cond.dealer">
				<option value="0">全部</option>
				<option v-for="item in dealerList" v-bind:value="item.codeNumber">{{item.name}}</option>
			</select>
			</div>
		</div>
		<div class="status">
			<span>状态</span>
			<div class="cc">
			<select v-model.trim="cond.status">
				<option value="0">全部</option>
				<option value="1">已提交</option>
				<option value="-1">未提交</option>
				<option value="3">待审核</option>
				<option value="2">已审核</option>
				<option value="-2">已驳回</option>
			</select>
			</div>
		</div>
		<div class="search_btn" @click="search">
			<span>搜索</span>
		</div>
	</div>
	<div class="cond" v-else style="min-width: auto">
		<div class="year">
			<span>{{'年份'|dz}}</span>
			<div class="cc" >
				<select class="year" v-model="cond.year">
					<option value="0">{{'全部'|dz}}</option>
					<option v-for="(item,index) in years" v-bind:value="index" v-if="item!=null && index!=0">{{index.split(".")[1]}}</option>
				</select>
			</div>
		</div>
		<div class="select">
			<span>{{'批次'|dz}}</span>
			<div class="cc" >
				<select class="batch" v-model="cond.batch">
					<option value="0">{{'全部'|dz}}</option>
					<option v-for="(item,index) in years[cond.year]" v-bind:value="item.id">{{item.name}}</option>
				</select>
			</div>
		</div>
		<div class="dealer" :dealer="codeNumber" style="display: none" ></div>
		<div class="status">
			<span>状态</span>
			<div class="cc">
				<select v-model.trim="cond.status">
					<option value="0">全部</option>
					<option value="1">已提交</option>
					<option value="-1">未提交</option>
					<option value="3">待审核</option>
					<option value="2">已审核</option>
					<option value="-2">已驳回</option>
				</select>
			</div>
		</div>
		<div class="search_btn" @click="search">
			<span>搜索</span>
		</div>
	</div>
	<div class="list">
		<table>
			<thead>
				<tr>
				<th>提交批次<img src='../../assets/4e/img/list.png'></th>
				<th>经销商
				<img src='../../assets/4e/img/sort.png' @click="sort" v-if="cond.sort=='1'" class="rotate">
				<img src='../../assets/4e/img/sort.png' @click="sort" v-if="cond.sort=='0'"></th>
				<th>大区</th>
				<th>销售代码</th>
				<th>提交状态</th>
				<th>审批状态</th>
				<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item,index) in data.list">
					<td>{{item.name}}</td>
					<td>{{item.dealername}}</td>
					<td>{{item.bigCommunityName}}</td>
					<td>{{item.saleNumber}}</td>

					<td class="waiting" v-if="item.count==0">未提交</td>
					<td class="pass" v-if="item.count>0">已提交</td>

					<td class="active" v-if="item.count>0 && item.verifystate==0">待审核</td>
					<td class="pass" v-if="item.count>0 && item.verifystate==1">已通过</td>
					<td class="deny" v-if="item.count>0 && item.verifystate==2">已驳回</td>
					<td v-if="item.count==0"></td>
					
					<td class="active" v-if="item.count>0 && item.verifystate==0 && userManage==1" @click="verify(item.dealerid, item.batchid)">审核</td>
					<td class="active" v-else-if="item.count>0" @click="show(item.dealerid, item.batchid)">查看</td>
					<td class="active" v-else-if="item.count==0 && userManage==0 && item.dealerid==user.dealerId" @click="edit(item.dealerid, item.batchid)">提报</td>
					<td v-else></td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="paging" v-if="data!=null && data.pagination">
		<span class="total">共 {{data.pagination.totalPages}} 页 - 共 {{data.pagination.totalCount}} 条 数据</span>
		<ul class="numbers">
			<li class="li-first-last" @click="go2page(0)">首页</li>
			<li><div class="prev" @click="go2prev"></div></li>
			<li v-for="(item,index) in data.pagination.slider" :class="item==data.pagination.pageNumber?'current':''" @click="go2page(item)">
				<div><span>{{item}}</span></div>
			</li>
			<li><div class="next" @click="go2next"></div></li>
			<li  class="li-first-last" @click="go2page(data.pagination.totalPages)">末页</li>
		</ul>
        <span class="limit">{{'每页显示'|dz}}
		 <select v-model.trim="pageSize">
			  <option selected value="20">20{{'条'|dz}}</option>
			  <option value="40">40{{'条'|dz}}</option>
			  <option value="60">60{{'条'|dz}}</option>
		  </select>
		</span>
		<div class="submit" @click="go2pagesize"><span>确认</span></div>
	</div>
</div>
</template>

<script>
	import Vue from 'vue'
	var base = localStorage.getItem("base")
	import util_js from '@/assets/4e/js/util.js'
	import font_css from '@/assets/4e/css/font.css'
	import global_css from '@/assets/4e/css/global.css'
	Vue.use(util_js)
	export default {
		data: function(){
			return {
				base: base,
				data: {},
				pageSize: 20,
				pageNumber: 1,
				pageCount: 1,
				cond: {
					year: '0',
					batch: '0',
					dq: '0',
					xq: '0',
					dealer: '0',
					status: '0',
					enable: false,
					sort: '0'
				},
				user: {},
				userManage: 0,
				years: [],
				bigCommunityList: [],
				smallCommunityList: [],
				dealerList: [],
                codeNumber:0
			}
		},
		created: function() {
			var that = this;
			this.get(this.base+"/api/user/islogin", null, function(data){
				if (data.code==0) {
					parent.window.location = "/login";
					return;
				}
				that.user = data.data;
				if ($.inArray(that.user.roleId, [1, 5, 8, 9, 11, 13, 15] )!=-1) {
					that.userManage = 1;
				}else{
					that.userManage = 0;
					if (that.user.dealerId!=0) {
						that.get(that.base+"/api/dealer/code?dealerId="+that.user.dealerId, null, function(data){
							if (data.code==200 && data.data != null) {
								that.cond.dealer = data.data.codeNumber;
                                that.codeNumber = data.data.codeNumber;
                                that.cond.enable = true;
							}
						}, false);
					}
				}
			}, false);
            //返回一个promise对象
            return new Promise(async resolve => {
                await that.getFawvwMaterialBatchList();
                await that.getCommunityList(0);
                resolve();
            });

        },
		methods: {
            sortByKey(obj) {
                const newkey = Object.keys(obj).sort().reverse();
                var newObj = {};//创建一个新的对象，用于存放排好序的键值对
                for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
                    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
                }
                return newObj;
            },
			getFawvwMaterialBatchList: async function() {
				var that = this;
                that.dealerList=[];
				this.get(this.base + "/api/fawvwmaterial/batch/list", {status:1}, function(data){
					if (data.code==200) {
						var years = [];
						for(var key in data.data) {
                            data.data[key].createAtStr="."+data.data[key].createAtStr;
                            var tmp = data.data[key];
							if (years[0]==null) {
								years[0] = [];
							}
							if (years[tmp.createAtStr]==null) {
								years[tmp.createAtStr] = [];
							}
							years[tmp.createAtStr].push(tmp);
							years[0].push(tmp);
						}
                        that.years = that.sortByKey(years);
                        if (data.data.length>0) {
                            if (that.userManage==1) {
                                that.cond.batch = data.data[0].id.toString();
                            }else{
                                that.cond.batch = 0;//默认选中全部
                            }
                            //返回一个promise对象
                            return new Promise(async resolve => {
                              await that.getData();
                                resolve();
                            });


                            that.cond.xq = 0;//默认选中全部
                            that.cond.dealer = 0;//默认选中全部
						}
					}
				})
			},
			getCommunityList:async function(parentId) {
				let that = this;
                that.dealerList=[];
                that.smallCommunityList=[];
				this.get(this.base + "/api/dealer/community/list", {parentId: parentId}, function(data){
					if (data.code==200) {
						if (parentId==0) {
							that.bigCommunityList = data.data;
							if (that.bigCommunityList.length==1) {
								that.cond.dq = that.bigCommunityList[0].id;
								that.getCommunityList(that.cond.dq);
							}else{
								that.cond.dq = 0;//默认选中全部
							}
						}else{
							that.smallCommunityList = data.data;
							if (that.smallCommunityList.length==1) {
								that.cond.xq = that.smallCommunityList[0].id;
								that.getDealerList(that.cond.xq);
							}else{
								that.cond.xq = 0;//默认选中全部
							}
						}
                        
                        that.cond.dealer = 0;//默认选中全部
					}
				})
			},
			getDealerList: function(smallCommunityId) {
				var that = this;
				this.get(this.base + "/api/dealer/list", {type:2,batchId :that.cond.batch,smallCommunityId: smallCommunityId}, function(data){
					if (data.code==200) {
						that.dealerList = data.data;
                        that.cond.dealer = 0;//默认选中全部
					}
				})
			},
			getData: async function() {
				var that = this;
				var params = {};
				params.pageSize = this.pageSize;
				params.pageNumber = this.pageNumber;
                params.addtime = that.cond.year.split(".")[1];
                params.batchId = that.cond.batch;
				params.orderBy = that.cond.sort;
				if (this.cond.enable == true) {
					if (that.cond.dq!=0) {
						params.bigCommunityId = that.cond.dq;
					}
					if (that.cond.xq!=0) {
						params.smallCommunityId = that.cond.xq;
					}
					if (that.cond.dealer!=0)  {
						params.dealerCode = that.cond.dealer;
					}else if(that.codeNumber!=0){
                        params.dealerCode = that.codeNumber;
                    }
					if (that.cond.status!=0) {
						params.status = that.cond.status;
					}
				}
				this.get(this.base + "/api/fawvwad/list", params, function(data){
					if (data.code==200) {
						that.data = data.data;
						for(var key in that.data.list) {
							var item = that.data.list[key];
							if (item.verifystate!=null) {
								var state = item.verifystate.split(",");
								for(var i in state) {
									if (state[i]==0) {
										that.data.list[key].verifystate = 0;
										break;
									}
									if (state[i]==2) {
										that.data.list[key].verifystate = 2;
										break;
									}
									that.data.list[key].verifystate = state[i];
								}
							}
						}
						that.pageCount = data.data.pagination.totalPages;
						that.pageNumber = data.data.pagination.pageNumber;
						that.$nextTick(function(){
							that.parentHeight();
						})
					}
				});
			},
			edit: function(dealerid, batch) {
				window.location = "/list_g_edit?dealerid="+dealerid+"&batch="+batch;
			},
			show: function(dealerid, batch) {
				window.location = "/list_g_show?dealerid="+dealerid+"&batch="+batch+"&show=1";
			},
			verify: function(dealerid, batch) {
				window.location = "/list_g_verify?dealerid="+dealerid+"&batch="+batch;
			},
			go2page: function(page) {
				this.pageNumber = page;
				this.getData();
			},
			go2prev: function() {
				this.pageNumber = this.pageNumber - 1;
				if (this.pageNumber < 1) {
					this.pageNumber = 1;
				}
				this.getData();
			},
			go2next: function() {
				this.pageNumber = this.pageNumber + 1;
				if (this.pageNumber > this.pageCount) {
					this.pageNumber = this.pageCount;
				}
				this.getData();
			},
			go2pagesize: function() {
				this.getData();
			},
			parentHeight: function() {
				$(window.parent.document).find("iframe").height(($(".list").height()+200)+'px');
			},
			search: function() {
				this.cond.enable = true;
				this.getData();
			},
			sort: function() {
				if (this.cond.sort=='0') {
					this.cond.sort='1';
				}else{
					this.cond.sort='0';
				}
				this.getData();
			}
		}
	}

</script>


<style lang="scss" scope>
	.g-list {
		/*min-height: 600px;*/
		.cond {
			width: 90%;
			margin-left: calc(5% - 80px);
			min-width: 1100px;
			height: 50px;
			margin-top: 30px;
			color: #2e3e4d;
			text-align: center;
			font-size: 14px;
			font-family: 'font-hy-55';
			.year {
				display: inline-block;
				width: 124px;
			    text-align: left;
			    margin-right: 10px;
				.cc {
					width: 70%;
					display: inline-block;
					border-bottom: 1px solid #2e3e4d;
					select {
						border: none;
						font-size: 14px;
						width: 100%;
						text-indent: 10px;
					}
					select:focus {
						outline: none;
					}
				}
				
			}
			.select {
				display: inline-block;
				width: 200px;
				text-align: left;
				.cc {
					width: 70%;
					display: inline-block;
					border-bottom: 1px solid #2e3e4d;
					select {
						border: unset;
						font-size: 14px;
						width: 100%;
						text-indent: 10px;
					}
					select:focus {
						outline: none;
					}
				}
				
			}
			.dq {
				display: inline-block;
				width: 120px;
				text-align: left;
				.cc {
					width: 70%;
					display: inline-block;
					border-bottom: 1px solid #2e3e4d;
					select {
						border: unset;
						font-size: 14px;
						width: 100%;
						text-indent: 10px;
					}
					select:focus {
						outline: none;
					}
				}
			}
			.xq {
				display: inline-block;
				width: 180px;
				text-align: left;
				.cc {
					width: 70%;
					display: inline-block;
					border-bottom: 1px solid #2e3e4d;
					select {
						border: unset;
						font-size: 14px;
						width: 100%;
						text-indent: 10px;
					}
					select:focus {
						outline: none;
					}
				}
			}
			.dealer {
				display: inline-block;
				width: 180px;
				text-align: left;
				.cc {
					width: 70%;
					display: inline-block;
					border-bottom: 1px solid #2e3e4d;
					select {
						border: unset;
						font-size: 14px;
						width: 100%;
						text-indent: 10px;
					}
					select:focus {
						outline: none;
					}
				}
			}
			.status {
				display: inline-block;
				width: 120px;
				text-align: left;
				.cc {
					width: 70%;
					display: inline-block;
					border-bottom: 1px solid #2e3e4d;
					select {
						border: unset;
						font-size: 14px;
						width: 100%;
						text-indent: 10px;
					}
					select:focus {
						outline: none;
					}
				}
			}
			.search_btn {
			    width: 60px;
			    height: 30px;
			    display: inline-block;
			    margin-left: 27px;
			    background: #001e50;
			    border-radius: 20px;
			    color: #fff;
			    vertical-align: middle;
			    cursor: pointer;
			    span {
			    	margin-top: 5px;
			    	display: inline-block;
			    }
			}

		}

		.list {
			padding-bottom: 30px;
			width: 90%;
			margin-top: 20px;
			margin-left: calc(10% - 100px);
			table {
				width: 100%;
				thead {
					tr {
						height: 30px;

						th:nth-child(1) {
							width: 15%;
							img {
								margin-left: 10px;
							}
							
						}
						th:nth-child(2) {
							width: 25%;
							img {
								margin-left: 10px;
								margin-bottom: -5px;
							}
							.rotate {
								margin-bottom: -4px;
    							transform: rotateZ(180deg);
							}
						}
						th:nth-child(3) {
							width: 8%;
						}
						th:nth-child(4) {
							width: 12%;
						}
						th:nth-child(5) {
							width: 8%;
						}
						th:nth-child(6) {
							width: 8%;
						}
						th {
							border-bottom: 1px solid #e7eaec;
							border-right: 1px solid #e7eaec;
							width: 15%;
							text-align: center;
							color: #b4c3ce;
							
						}
					}

				}
				tbody {
					tr {
						height: 50px;

						td:nth-child(1) {
							width: 15%;

						}
						td:nth-child(2) {
							width: 25%;
						}
						td:nth-child(3) {
							width: 8%;
						}
						td:nth-child(4) {
							width: 12%;
						}
						td:nth-child(5) {
							width: 8%;
						}
						td:nth-child(6) {
							width: 8%;
						}
						td {
							border-bottom: 1px solid #e7eaec;
							width: 15%;
							text-align: center;
							color: #000;
						}
						.waiting {
							color: #c2cacf;
						}
						.pass {
							color: #4cc7f4;
						}
						.deny {
							color: #3c484d;
						}
						.active {
							color: #3b557c;
							cursor: pointer;
						}
					}
				}
			}
		}


        .paging {
            margin-top: 20px;
            margin-left: -100px;
            text-align: center;
            .total {
                font-size: 14px;
                color: #778288;
                height: 25px;
                margin-right: 10px;
                vertical-align: top;
                line-height: 30px;
            }
            .numbers {
                list-style: none;
                display: inline-block;
                li {
                    float: left;
                    display: inline-block;
                    div {
                        width: 25px;
                        height: 25px;
                        margin-right: 8px;
                        border: 1px solid #072455;
                        border-radius: 50%;
                        color: #6a767d;
                        span {
                            display: inline-block;
                            font-size: 12px;
                            line-height: 25px;
                        }
                        cursor: pointer;
                    }
                }
                .prev {
                    background: url(../../assets/4e/img/prev.png) no-repeat;
                    background-size: 100%;
                }
                .next {
                    background: url(../../assets/4e/img/next.png) no-repeat;
                    background-size: 100%;
                }
                .current {
                    div {
                        background: #001e50;
                        color: #fff;
                    }
                }
            }
            .limit {
                font-size: 14px;
                color: #778288;
                vertical-align: bottom;
                margin-left: 5px;
                select {
                    margin-left: 5px;
                    width: 55px;
                    border: 1px solid #001e50;
                }
                margin-right: 10px;
                display: inline-block;
            }
            .submit {
                display: inline-block;
                width: 50px;
                height: 25px;
                line-height: 25px;
                background: #001e50;
                border: 1px solid #001e50;
                color: #fff;
                vertical-align: top;
                border-radius: 15px;
                font-size: 12px;
                cursor: pointer;
                span {
                    display: inline-block;

                }
            }

        }
	}
</style>