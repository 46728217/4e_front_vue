<template>
    <div class="ranking-list">
        <div class="cond">
            <div class="name">
                <span>{{'销售代码'|dz}}</span>
                <input v-model="names" type="text" placeholder=""/>
            </div>

            <div class="search_btn" @click="searchClick">
                <span>{{'搜索'|dz}}</span>
            </div>
        </div>

        <div class="list">
            <table>
                <thead>
                <tr>
                    <th v-for="(it,i) in titleData">{{it}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in data">
                      <td v-for="(its,i) in item">{{its}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="paging" v-if="dataPagination">
            <span class="total">{{'共'|dz}} {{dataPagination.totalPages}} {{'页'|dz}} - {{'共'|dz}}{{dataPagination.totalCount}} {{'条'|dz}} {{'数据'|dz}}</span>
            <ul class="numbers">
                <li class="li-first-last" @click="go2page(0)">首页</li>
                <li><div class="prev" @click="go2prev"></div></li>
                <li v-for="(item,index) in dataPagination.slider" :class="item==dataPagination.pageNumber?'current':''" @click="go2page(item)">
                    <div><span>{{item}}</span></div>
                </li>
                <li><div class="next" @click="go2next"></div></li>
                <li  class="li-first-last" @click="go2page(dataPagination.totalPages)">末页</li>

            </ul>
            <span class="limit">{{'每页显示'|dz}}
		      <select v-model.trim="pageSize">
			    <option selected value="20">20{{'条'|dz}}</option>
			    <option value="40">40{{'条'|dz}}</option>
			    <option value="60">60{{'条'|dz}}</option>
		      </select>
	    </span>
            <div class="platform-list-submit" @click="go2pagesize"><span>{{'确认'|dz}}</span></div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    var base = localStorage.getItem("base");
    import util_js from '@/assets/4e/js/util.js'
    import {BASE} from '@/assets/4e/js/common.js'
    import font_css from '@/assets/4e/css/font.css'
    import global_css from '@/assets/4e/css/global.css'
    Vue.use(util_js)
    export default {
        name: "ranking-list", //排行榜
        data: function(){
            return {
                base: base,
                data:[],
                pageSize: 20,
                pageNumber: 1,
                pageCount: 1,
                sub_menu_id:0,
                titleData:[],
                dataPagination:{},
                names:''
            }
        },
        watch: {
            rank_id(newValue, oldValue) {
                if(newValue!=oldValue){
                    this.dataPagination={};
                    this.pageSize=20;
                    this.pageNumber=1;
                    this.pageCount=1;
                    this.getData();
                }

            },
        },
        props: ["rank_id"],
        created: function() {
            this.getData();

        },
        methods: {
            searchClick(){
                var that=this;
                console.log(that.names);
                var params = {};
                params.delName = this.names;
                this.get(this.base + "/api/rankingFu/search/del", params, function(data){
                    if(data){
                        var params = {};
                        params.pageSize = that.pageSize;
                        params.pageNumber = that.pageNumber;
                        params.id=that.rank_id;
                        params.delName = that.names;
                        that.get(that.base + "/api/rankingFu/search", params, function(data){
                            if (data.code==200) {
                                var titleList=[];
                                that.$nextTick(function(){
                                    for(var key in data.data[0]){
                                        titleList.push(key);
                                    }
                                    that.titleData=titleList;
                                    that.data=[];
                                    for(var k=0;k<data.data.list.length;k++){
                                        var item=data.data.list[k];
                                        var values= Object.values(item);
                                        that.data.push(values);
                                    }
                                    that.parentHeight();
                                });
                                that.dataPagination=data.data.pagination;
                                that.pageCount = data.data.pagination.totalPages;
                                that.pageNumber = data.data.pagination.pageNumber;
                            }
                        });
                    }else {
                        if(that.names.toString().trim()==""){
                            that.getData();
                        }else{
                            that.showMsg("没有该销售代码！");
                        }
                    }
                });

            },
            getData(){
                let that = this;
                var params = {};
                params.pageSize = this.pageSize;
                params.pageNumber = this.pageNumber;
                 params.id=that.rank_id;
                this.get(this.base + "/api/rankingFu/search", params, function(data){
                    if (data.code==200) {
                        var titleList=[];
                        that.$nextTick(function(){
                            for(var key in data.data[0]){
                              titleList.push(key);
                            }
                            that.titleData=titleList;
                            that.data=[];
                            for(var k=0;k<data.data.list.length;k++){
                                var item=data.data.list[k];
                                var values= Object.values(item);
                                that.data.push(values);
                            }
                            that.parentHeight();
                        })

                            // that.data= that.formatData(data.data);
                            // for(var i=0;i<that.data[0].length;i++){
                            //     for(var key in that.data[0][i]){
                            //         that.titleData.push(key);
                            //     }
                            // }
                       that.dataPagination=data.data.pagination;
                       that.pageCount = data.data.pagination.totalPages;
                       that.pageNumber = data.data.pagination.pageNumber;

                    }
                });
            },
            formatData(arr){
                if(!arr)return;
                console.log(arr);
                var map = {},
                    dest = [];
                for(var i = 0; i < arr.length; i++){
                    var ai = arr[i];
                    if(!map[ai.rowid]){
                        dest.push({
                            rowid: ai.rowid,
                            data: [ai],
                        });
                        map[ai.rowid] = ai;
                    }else{
                        for(var j = 0; j < dest.length; j++){
                            var dj = dest[j];
                            if(dj.rowid == ai.rowid){
                                dj.data.push(ai);
                                break;
                            }
                        }
                    }
                }

                for(var n=0;n<dest.length;n++){
                    var len=dest[n].data.length;
                    dest[n].sort=len;
                }
               // console.log('之后');
                var sortArr=dest.sort(BASE.compare('sort'));
                var lastArr=[];
                for(var m=0;m<sortArr.length;m++){
                    var d=sortArr[m].data;
                    var arr=[];
                    for(var l=0;l<d.length;l++){
                        var keys=d[l].columnname;
                        var value=d[l].valuecent;
                        var  obj={[keys]:value};
                        arr.push(obj)
                    }
                    lastArr.push(arr);
                }
                    console.log(lastArr);
                    return lastArr;
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

<style scoped lang="scss">
    .ranking-list{
        .cond {
            color: #2e3e4d;
            font-size: 14px;
            margin-right: 20px;
            margin-bottom: 20px;
            text-align: center;
            font-family: 'font-hy-55';
            float: right;
            .name {
                margin-left: 20px;
                color: #000000;
                display: inline-block;
                input {
                    background: transparent;
                    border: unset;
                    color: #000000;
                    border-bottom: 1px solid #2e3e4d;
                    border-top: none \9;/*IE6.7.8.9.10都生效*/
                    border-left: none \9;
                    border-right: none \9;
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
            width: 100%;
            margin-top: 20px;
            overflow-x: auto;
            table {
                width: 100%;
                thead {
                    tr {
                        height: 30px;
                        th {
                            border-bottom: 1px solid #e7eaec;
                            border-right: 1px solid #e7eaec;
                            /*width: 15%;*/
                            min-width: 100px;
                            text-align: center;
                            color: #b4c3ce;

                        }
                    }

                }
                tbody {
                    tr {
                        height: 50px;
                        td {
                            border-bottom: 1px solid #e7eaec;
                            /*width: 15%;*/
                            min-width: 100px;

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
    input::-webkit-input-placeholder {
        text-align: center;
        color: #ccc;
    }

</style>