<template>
    <div class="bi_kanban">
        <div class="nav">
            <!--<div class="back" @click="back()">-->
                <!--<img src="../../assets/4e/img/back.png"/>-->
                <!--<span>返回</span>-->
            <!--</div>-->
            <div class="menu">
                <div class="item">时间维度：</div>
                <div class="item radio"><span class="img active"></span><span class="desc" :data-t="yesterday">昨天</span></div>
                <div class="item radio"><span class="img"></span><span class="desc" :data-t="lastWeek">最近7天</span></div>
                <div class="item radio"><span class="img"></span><span class="desc" :data-t="lastMonth">最近一个月</span></div>
                <!--<div class="item">-->
                    <!--<span>{{'时间段'|dz}}</span>-->
                    <!--<div class="cc">-->
                        <!--<input type="text" class="startdate" v-model="start"/>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="item">-->
                    <!--<span>{{'至'|dz}}</span>-->
                    <!--<div class="cc">-->
                        <!--<input type="text" class="enddate" v-model="end"/>-->
                    <!--</div>-->
                <!--</div>-->
                <div class="item">
                    <span>{{'时间段'|dz}}</span>
                    <el-date-picker
                            size="mini"
                            v-model="datepickerValue"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @change="changeData"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <!--<div class="search_btn" @click="searchData">-->
                    <!--<span>查询</span>-->
                <!--</div>-->
            </div>
        </div>
        <div class="loadding" v-show="isLoading">
            <div>数据加载中</div>
        </div>
        <div class="title">
            <div class="item"><div class="top">浏览量（PV）</div><div class="bottom">{{data.base.pv}}</div></div>
            <div class="item"><div class="top">独立访客(UV)</div><div class="bottom">{{data.base.uv}}</div></div>
            <div class="item"><div class="top">访客次数</div><div class="bottom">{{data.base.visitCount}}</div></div>
            <div class="item"><div class="top">平均页面停留时长</div><div class="bottom">{{data.base.avgVisitTime}}</div></div>
            <div class="item"><div class="top">跳出率</div><div class="bottom">{{data.base.avgExitRate}}</div></div>
        </div>
        <div class="echarts-row" style="margin-top: 50px;">
            <div class="echarts-row2" style="width: 48%;float: left;position: relative">
                <div class="echarts-title" style="position: absolute"><span class="desc">登录情况分析</span><span class="line"></span></div>
                <div class="" id="drawEcharts1" :style="{width: '100%', height: '400px'}">
                </div>
            </div>
            <div class="echarts-row2" style="width: 48%;float: right;position: relative">
                <div class="echarts-title" style="position: absolute"><span class="desc">流量情况分析</span><span class="line"></span></div>
                <!--<div class="" id="drawEcharts2" :style="{width: '100%', height: '400px'}"> </div>-->
                <ul class="traffic-analysis">
                    <li><div class="circle">{{data.kssCdnStat.maxBandWidth}}</div><div class="desc">最高峰值</div></li>
                    <li><div class="circle">{{data.kssCdnStat.avgBandWidth}}</div><div class="desc">平均峰值</div></li>
                    <li><div class="circle">{{data.kssCdnStat.totalFlowData}}</div><div class="desc">总流量</div></li>
                    <li><div class="circle">{{data.kssCdnStat.avgFlowData}}</div><div class="desc">平均流量</div></li>
                </ul>

            </div>
        </div>
        <div class="echarts-row">
            <div class="echarts-title" style="width: 100%"><span class="desc">素材情况分析</span><span class="line"></span></div>
            <div class="" id="drawEcharts3" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="echarts-row"  style="margin-top: 50px">
            <div class="echarts-title" style="width: 100%"><span class="desc" style="width: 180px">素材上传分析-区域事业部</span><span class="line"></span></div>
            <div class="" id="drawEcharts4" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="div-table" style="margin-top: 50px">
            <div class="table-title" style="width: 100%"><span class="desc" style="width: 150px;font-weight: bold">素材下载TOP10</span><span class="line"></span></div>
            <div class="btn-export" @click="exportClick">导出</div>
            <div class="list">
                <table>
                    <thead>
                    <tr>
                        <th>{{'一级栏目'|dz}}</th>
                        <th>{{'二级栏目'|dz}}</th>
                        <th>{{'素材名称'|dz}}</th>
                        <th>{{'素材代码'|dz}}</th>
                        <th>{{'下载量'|dz}}</th>

                    </tr>
                    </thead>
                    <tbody id="topList">
                        <tr v-for="(item,index) in data.top10List">
                            <td>{{item.first_name}}</td>
                            <td>{{item.second_name}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.fileCode}}</td>
                            <td>{{item.download_times}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    var base = localStorage.getItem("base")
    import util_js from '@/assets/4e/js/util.js'
    import {BASE} from '@/assets/4e/js/common.js'
    import font_css from '@/assets/4e/css/font.css'
    import global_css from '@/assets/4e/css/global.css'
    Vue.use(util_js)
    export default {
        name: "bi_kanban",
        data: function(){
            return {
                isLoading : false,
                base: base,
                imgsrc:'nocheck1',
                yesterday: '',
                lastWeek: '',
                lastMonth: '',
                start: '2019-10-01',
                end: '2019-11-01',
                datepickerValue:[],
                data: {
                    base: {
                        pv: 0,
                        uv: 0,
                        visitCount: 0,
                        avgVisitTime: 0,
                        avgExitRate: 0
                    },
                    kssCdnStat: {
                        maxBandWidth: '0M',
                        avgBandWidth: '0M',
                        totalFlowData: '0M',
                        avgFlowData: '0M'
                    },
                    userLoginStat: {
                        names: [''],
                        login_counts: ['0'],
                        dealer_counts: ['0']
                    },
                    materialStat: {
                        names: [],
                        view_times: [''],
                        download_times: [],
                        upload_counts: [],
                        avgFileSize:[]
                    },
                    sybMaterialStat: {
                        names: [],
                        upload_counts: []
                    },
                    top10List: [],
                    export:false,
                }
            }
        },
        created: function() {
            //昨天
            var yesterday = new Date();
            yesterday.setTime(yesterday.getTime()-24*60*60*1000);
            yesterday = yesterday.getFullYear()+"-" + (yesterday.getMonth()+1) + "-" + yesterday.getDate();
            this.yesterday = yesterday+":"+yesterday;
            //近7天
            var lastWeek = new Date();
            lastWeek.setTime(lastWeek.getTime()-7*24*60*60*1000);
            lastWeek = lastWeek.getFullYear()+"-" + (lastWeek.getMonth()+1) + "-" + lastWeek.getDate();
            this.lastWeek = lastWeek+":"+yesterday;
            //近一个月
            var lastMonth = new Date();
            lastMonth.setTime(lastMonth.getTime()-30*24*60*60*1000);
            lastMonth = lastMonth.getFullYear()+"-" + (lastMonth.getMonth()+1) + "-" + lastMonth.getDate();
            this.lastMonth = lastMonth+":"+yesterday;
            var that=this;
            var yesterdayFormat =that.getDay(-1, '-');//获取昨天的日期，num就是-1， 前天的就是-2，依次类推。
            that.datepickerValue=[yesterdayFormat,yesterdayFormat];
            $("body").on("click",'.radio',function () {

                if(!$(this).find(".img").hasClass("active")){
                    $(this).find(".img").addClass("active");
                    $(this).siblings(".radio").find(".img").removeClass("active");
                    var date = $(this).find(".img").next('span').data('t').split(':');
                    that.start = date[0];
                    that.end = date[1];
                    that.datepickerValue=[that.start,that.end];
                    that.getData();
                }
            });

            //设置加载动画
            var timer = 1;
            setInterval(function(){
                var html = "数据加载中";
                if (timer%5==0) {
                    timer = 0;
                }
                var tmp = html;
                for(var i=0;i<timer;i++) {
                    tmp += ".";
                }
                $(".loadding div").html(tmp);
                timer ++;
            }, 500);

            //默认加载昨天数据
            var date = this.yesterday.split(':');
            this.start = date[0];
            this.end = date[1];
            this.getData();

        },
        watch: {
            // datepickerValue(newValue, oldValue) {
            //     var that=this;
            //     if(newValue!=oldValue){
            //     }
            //
            // },
        },
        methods: {
            exportClick(){
                var that=this;
                that.export=true;
                var url=this.base + "/api/ga/analytics?start="+this.start+"&end="+this.end+'&export='+this.export;
                window.open(url);
            },
            changeData(){
                var that=this;
                console.log(that.datepickerValue);
                if(that.datepickerValue!=null){
                    $("body").find(".radio").each(function () {
                        $(this).find(".img").removeClass("active");
                        $(this).attr("disabled",true);
                    });
                    that.start = that.datepickerValue[0];
                    that.end = that.datepickerValue[1];
                    that.getData();
                }else{
                    that.showMsg("请选择时间段");
                    return;
                }
            },
            searchData(){
                var that=this;
                if(!that.datepickerValue){
                    that.showMsg("请选择时间段");
                    return;
                }
                that.start = that.datepickerValue[0];
                that.end = that.datepickerValue[1];
                that.getData();
            },
            getDay(num, str) {
                var today = new Date();
                var nowTime = today.getTime();
                var ms = 24*3600*1000*num;
                today.setTime(parseInt(nowTime + ms));
                var oYear = today.getFullYear();
                var oMoth = (today.getMonth() + 1).toString();
                if (oMoth.length <= 1) oMoth = '0' + oMoth;
                var oDay = today.getDate().toString();
                if (oDay.length <= 1) oDay = '0' + oDay;
                return oYear + str + oMoth + str + oDay;
            },
                getData() {
                this.isLoading = true;
                var that = this;

                this.get(this.base + "/api/ga/analytics?start="+this.start+"&end="+this.end+'&exprot='+this.exprot, null, function(data){
                    if (data.code == 200) {
                        that.isLoading = false;
                        that.data = data.data;
                        that.drawLine1();
                        that.drawLine3();
                        that.drawLine4();
                        setTimeout(function(){
                            that.parentHeight();
                        }, 300);
                    }else{
                        that.showMsg("获取分析数据失败");
                    }
                })
            },

            drawLine1(){
                var that = this;
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts1'));
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['登录次数', '用户量'],
                        x: 'right', //居右显示
                        top:0,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: that.data.userLoginStat.names
                    },
                    series: [
                        {
                            name: '登录次数',
                            type: 'bar',
                            barGap:0,
                            barWidth: 20,//柱图宽度
                            data: that.data.userLoginStat.login_counts,
                            itemStyle: {
                                normal: {
                                    color: '#00437A',
                                    label : {
                                        show: true,
                                        position: 'right',
                                    }
                                }
                            },
                        },
                        {
                            name: '用户量',
                            type: 'bar',
                            barWidth: 20,//柱图宽度
                            data: that.data.userLoginStat.dealer_counts,
                            itemStyle: {
                                normal: {
                                    color: '#00B1F1',
                                    label : {
                                        show: true,
                                        position: 'right',
                                    }
                                }
                            },
                        }
                    ]
                });
            },

            drawLine3(){
                var that = this;
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts3'));
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b0}<br/>{a1}: {c1}<br />{a3}:{c3}',
                        extraCssText:'border-radius:20px;text-align: center;',
                        // axisPointer: {
                        //     type: 'cross',
                        //     crossStyle: {
                        //         color: '#999'
                        //     }
                        // }
                    },
                    grid: {
                        left: '2.5%',
                        right: '-20',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                    },
                    legend: {
                      x:'right',
                        data:['浏览量','上传量','下载量']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: that.data.materialStat.names,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                        },
                        {
                            type: 'value',
                            "show": false,
                        },
                        {
                            type: 'value',
                            "show": false,
                        }
                    ],
                    series: [
                        {
                            name:'浏览量',
                            type:'bar',
                            barWidth: 30,//柱图宽度
                            data:that.data.materialStat.view_times,
                            itemStyle: {
                                normal: {
                                    color: '#00437A',
                                    label : {
                                        show: true,
                                        position: 'top',
                                    }
                                }
                            },
                        },
                        {
                            name:'上传量',
                            type:'line',
                            data:that.data.materialStat.upload_counts,
                            itemStyle: {
                                normal: {
                                    color: '#C2CACF',
                                    label : {
                                        show: true,
                                        position: 'top',
                                    }
                                }
                            },
                        },
                        {
                            name:'下载量',
                            type:'line',
                            yAxisIndex: 1,
                            data:that.data.materialStat.download_times,
                            itemStyle: {
                                normal: {
                                    color: '#00B1F1',
                                    label : {
                                        show: true,
                                        position: 'top',
                                    }
                                }
                            },
                        },
                        {
                            name:'平均文件大小',
                            type: 'line',
                            symbolSize: 0, // symbol的大小设置为0
                            showSymbol: false, // 不显示symbol
                            lineStyle: {
                                width: 0, // 线宽是0
                                color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
                            },
                            data:that.data.materialStat.avgFileSize,
                        }
                    ]
                });
            },

            drawLine4(){
                var that = this;
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts4'));
                // 绘制图表
                myChart.setOption({
                    color: ['#00437A'],
                    tooltip : {
                        trigger: 'axis',
                        extraCssText:'border-radius:20px;text-align: center;',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        x:'right',
                        data:['上传量']
                    },
                    grid: {
                        left: '2.7%',
                        right: '0',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : that.data.sybMaterialStat.names,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'上传量',
                            type:'bar',
                            barWidth: 37,//柱图宽度
                            data:that.data.sybMaterialStat.upload_counts,
                            itemStyle: {
                                normal: {
                                    color: '#00437A',
                                    label : {
                                        show: true,
                                        position: 'top',
                                    }
                                }
                            },
                        }
                    ]
                });
            },

            drawList() {
                var html = "";
                for(var i=0;i<this.data.top10List;i++) {
                    var item = this.data.top10List[i];
                    html += "<tr>";
                    html += "<td>"+item.first_name+"</td>";
                    html += "<td>"+item.second_name+"</td>";
                    html += "<td>"+item.name+"</td>";
                    html += "<td>"+item.fileCode+"</td>";
                    html += "<td>"+item.download_times+"</td>";
                    html += "</tr>";
                }
                $("#topList").html(html);
            },
            back: function() {
                this.$router.go(-1);//返回上一层
            },
            parentHeight: function() {
                $(window.parent.document).find("iframe").height(($(".bi_kanban").height())+'px');
            },
        }
    }

</script>

<style scoped lang="scss">
    .bi_kanban{
        margin: 20px;
        .loadding {
            width: 100%;
            height: 50px;
            text-align: center;
            div {
                display: inline-block;
                font-size: 16px;
                margin-top: 30px;
            }
        }
        .nav {
            height: 30px;
            width: 100%;
            display: inline-block;
            .back {
                display: inline-block;
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
            .menu{
                font-size: 14px;
                width: 100%;
                text-align: right;
                display: inline-block;
                color: #2e3e4d;
                font-size: 14px;
                font-family: 'font-hy-55';
                .item{
                    display: inline-block;
                    height: 19px;
                    .cc {
                        width: 124px;
                        height: 100%;
                        display: inline-block;
                        border-bottom: 1px solid #2e3e4d;
                        input {
                            border: none;
                            width: 100%;
                            text-align: center;
                            color: #2e3e4d;
                            font-size: 14px;
                            font-family: 'font-hy-55';
                        }
                        input:focus {
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
                    text-align: center;
                    span {
                        margin-top: 5px;
                        display: inline-block;
                    }
                }
                .radio{
                    cursor: pointer;
                    padding: 0 10px;

                    .img{
                        width: 15px;
                        height: 15px;
                        display: inline-block;
                        vertical-align: sub;
                        background: url(../../assets/4e/img/nocheck1.png) no-repeat;
                        background-size: 100% 100%;
                    }
                    .img.active{
                        width: 15px;
                        height:15px;
                        display: inline-block;
                        vertical-align: sub;
                        background: url(../../assets/4e/img/checkin1.png) no-repeat;
                        background-size: 100% 100%;
                    }
                    .desc{
                        padding-left: 5px;
                    }
                }
            }
        }
        .title{
            margin-top: 40px;
            border-top: 1px solid #969696;
            border-bottom: 2px solid #42B3F0;
            display: -webkit-flex;
            display: flex;
            padding: 10px 0;
            .item{
                -webkit-flex: 1;
                flex: 1;
                text-align: center;
                height: 70px;
                .top{
                    height: 40%;
                    color: #969696;
                    font-weight: bold;
                    letter-spacing:1px;
                }
                .bottom{
                    height: 60%;
                    color: #42B3F0;
                    font-size: 28px;
                    letter-spacing:2px;
                }
                border-right: 1px solid #D5D5D5;
            }
            .item:nth-child(5){
                border-right: none;

            }
        }
        .echarts-row {
            height: 450px;
            .echarts-title {
                width: 100%;
                position: relative;
                height: 30px;
                margin-bottom: 20px;
                .desc {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100px;
                    text-align: center;
                    height: 100%;
                    border-bottom: 3px solid #00B1F1;
                    font-weight: bold;
                }
                .line {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    border-bottom: 3px solid #DFE4E8;
                }
            }
            .traffic-analysis{
                margin-top: 50px;
                list-style:none;
                width: 100%;
                li{
                    margin: 10px;
                    display: inline-block;
                    width: 40%;
                    height: 150px;
                    .circle{
                        margin: auto;
                        width: 100px;
                        height:100px;
                        padding: 10px;
                        line-height: 100px;
                        text-align: center;
                        border-radius: 100%;
                        color: #42B3F0;
                        font-size: 18px;
                        border: 2px solid #42B3F0;
                    }
                    .desc{
                        margin-top: 10px;
                        text-align: center;
                        font-weight: bold;
                        /*font-size: 16px;*/
                    }
                }
            }
        }
        .div-table{
            minn-height: 450px;
            position: relative;
            .btn-export{
                position: absolute;
                cursor: pointer;
                top: 0;
                right: 0;
                width: 50px;
                height: 25px;
                background-color:#00437A ;
                border-radius: 10px;
                text-align: center;
                line-height: 25px;
                color: white;
            }
            .table-title {
                width: 100%;
                position: relative;
                height: 30px;
                margin-bottom: 20px;
                .desc {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100px;
                    text-align: center;
                    height: 100%;
                    border-bottom: 3px solid #00B1F1;
                }
                .line {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    border-bottom: 3px solid #DFE4E8;
                }
            }
            .list {
                padding-bottom: 30px;
                width: 100%;
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
                                text-align: center;
                                color: #00437A;
                            }

                        }

                    }
                    tbody {
                        tr {
                            height: 50px;
                            td {
                                border-bottom: 1px solid #e7eaec;
                                width: 15%;
                                text-indent:10px;
                                text-align: center;
                                color: #000;
                            }
                            td:nth(5) {
                                cursor: pointer;
                                color:#00B1F1;
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
        }
    }
    /*ie11 css hack*/
    @media all and (-ms-high-contrast:none) {
        *::-ms-backdrop, select{
            border: none;
        }
    }
</style>