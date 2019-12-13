<template>
    <div class="platform-list">
        <div class="list">
            <table>
                <thead>
                <tr>
                    <th>{{'物料种类'|dz}}</th>
                    <th>{{'物料名称'|dz}}</th>
                    <th>{{'尺寸规划'|dz}}</th>
                    <th>{{'安装位置'|dz}}</th>
                    <th>{{'开始时间'|dz}}</th>
                    <th>{{'物料代码'|dz}}</th>
                    <th>{{'物料图示'|dz}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in list">
                    <td>{{item.typename}}</td>
                    <td>{{item.materialname}}</td>
                    <td>{{item.imgsize}}</td>
                    <td>{{item.installposition}}</td>
                    <td>{{item.startdescribe}}</td>
                    <td>{{item.code}}</td>
                    <td style="cursor: pointer;color:#06c;" :style="{backgroundImage: 'url(\'' + item.thumb1 + '\')', backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center center'}"  @click="libdetails(item.code)"></td>
                </tr>
                </tbody>
            </table>
        </div>
        <!--<div class="paging" v-if="data.pagination">-->
            <!--<span class="total">{{'共'|dz}} {{data.pagination.totalPages}} {{'页'|dz}} - {{'共'|dz}}{{data.pagination.totalCount}} {{'条'|dz}} {{'数据'|dz}}</span>-->
            <!--<ul class="numbers">-->
                <!--<li class="li-first-last" @click="go2page(0)">首页</li>-->
                <!--<li><div class="prev" @click="go2prev"></div></li>-->
                <!--<li v-for="(item,index) in data.pagination.slider" :class="item==data.pagination.pageNumber?'current':''" @click="go2page(item)">-->
                    <!--<div><span>{{item}}</span></div>-->
                <!--</li>-->
                <!--<li><div class="next" @click="go2next"></div></li>-->
                <!--<li  class="li-first-last" @click="go2page(data.pagination.totalPages)">末页</li>-->

            <!--</ul>-->
            <!--<span class="limit">{{'每页显示'|dz}}-->
		      <!--<select v-model.trim="pageSize">-->
			    <!--<option selected value="20">20{{'条'|dz}}</option>-->
			    <!--<option value="40">40{{'条'|dz}}</option>-->
			    <!--<option value="60">60{{'条'|dz}}</option>-->
		      <!--</select>-->
	    <!--</span>-->
            <!--<div class="platform-list-submit" @click="go2pagesize"><span>{{'确认'|dz}}</span></div>-->
        <!--</div>-->
    </div>
</template>

<script>
    import Vue from 'vue'
    var base = localStorage.getItem("base")
    import {BASE} from '@/assets/4e/js/common.js'
    import util_js from '@/assets/4e/js/util.js'
    import font_css from '@/assets/4e/css/font.css'
    import global_css from '@/assets/4e/css/global.css'
    Vue.use(util_js)
    export default {
        name: "platform-list", //展厅物料列表
        data: function(){
            return {
                base: base,
                data:[],
                list:[],
                pageSize: 20,
                pageNumber: 1,
                pageCount: 1,
            }
        },
        props: ["usettype"],
        created: function() {
            var that=this;
              this.getData();
        },
        methods: {
            test(){
                alert(1);
            },
            libdetails(code){
             //   code=code||'1110000YH33VT';
                var that=this;
                if (code=='') {
                    this.showMsg('暂无素材关联');
                    return;
                }
                this.get(this.base+"/api/search/code?filecode="+code, null, function(data){
                    if(data.code==0) {
                        that.showMsg("未找到您输入编码对应的素材");
                        return;
                    }
                    var material = data.data;
                    that.detail(material.id);
                });
            },
            detail: function(id, activity_id) {
                this.get(this.base+"/api/cate/change?materialId="+id, null, function(data){
                    if (data.code==200) {
                        var url = "/library?id="+id;
                        if (activity_id!=null) {
                            url += "&activityId="+activity_id;
                        }
                        //top.window.location.href=url;
                        top.window.open(url,'_blank');
                    }
                });
            },
            getData(){
                let that = this;
                var params = {};
                // params.pageSize = this.pageSize;
                // params.pageNumber = this.pageNumber;
                params.usettype = this.usettype;
                this.get(this.base + "/api/fawvwmaterial/detail/list", params, function(data){
                    if (data.code==200) {
                        for(var i=0;i<data.data.list.length;i++){
                            data.data.list[i].index=i;
                        }
                        data.data.list.sort(BASE.compare('index'));
                        that.list=data.data.list;
                     //  that.pageCount = data.data.pagination.totalPages;
                     //  that.pageNumber = data.data.pagination.pageNumber;
                    }
                });
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

<style scoped lang="scss">
.platform-list{
    margin-top: 20px;
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
                    th {
                        border-bottom: 1px solid #e7eaec;
                        border-right: 1px solid #e7eaec;
                        width: 12%;
                        text-indent:10px;
                        text-align: left;
                        color: #b4c3ce;
                    }
                    th:nth-child(2) {
                    width: 15%;
                    }
                    th:nth-child(3) {
                        width: 15%;
                    }
                    th:nth-child(4) {
                        width: 25%;
                    }

                }

            }
            tbody {
                tr {
                    height: 50px;

                    /*td:nth-child(1) {*/
                        /*width: 15%;*/
                    /*}*/
                    /*td:nth-child(2) {*/
                        /*width: 25%;*/
                    /*}*/
                    /*td:nth-child(3) {*/
                        /*width: 8%;*/
                    /*}*/
                    /*td:nth-child(4) {*/
                        /*width: 18%;*/
                    /*}*/
                    /*td:nth-child(5) {*/
                        /*width: 8%;*/
                    /*}*/
                    /*td:nth-child(6) {*/
                        /*width: 8%;*/
                    /*}*/
                    td {
                        border-bottom: 1px solid #e7eaec;
                        /*width: 15%;*/
                        text-indent:0px;
                        text-align: left;
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
        }
        .platform-list-submit {
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