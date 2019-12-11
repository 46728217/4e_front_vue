<template>
    <div class="bi_kanban">
        <div class="nav">
            <!--<div class="back" @click="back()">-->
                <!--<img src="../../assets/4e/img/back.png"/>-->
                <!--<span>返回</span>-->
            <!--</div>-->
            <div class="menu">
                <div class="item">时间维度：</div>
                <div class="item radio"><span class="img"></span><span class="desc">昨天</span></div>
                <div class="item radio"><span class="img"></span><span class="desc">最近7天</span></div>
                <div class="item radio"><span class="img"></span><span class="desc">最近一个月</span></div>
                <div class="item">
                    <span>{{'时间段'|dz}}</span>
                    <div class="cc">
                        <select>
                            <option value="1">{{'2019-10-10'|dz}}</option>
                        </select>
                    </div>
                </div>
                <div class="item">
                    <span>{{'至'|dz}}</span>
                    <div class="cc">
                        <select>
                            <option value="1">{{'2019-10-12'|dz}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="title">
            <div class="item"><div class="top">浏览量（PV）</div><div class="bottom">4407</div></div>
            <div class="item"><div class="top">独立访客(UV)</div><div class="bottom">2966</div></div>
            <div class="item"><div class="top">访客次数</div><div class="bottom">1704</div></div>
            <div class="item"><div class="top">平均页面停留时长</div><div class="bottom">55.21</div></div>
            <div class="item"><div class="top">跳出率</div><div class="bottom">27.70%</div></div>
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
                    <li><div class="circle">300M</div><div class="desc">最高峰值</div></li>
                    <li><div class="circle">100M</div><div class="desc">平均峰值</div></li>
                    <li><div class="circle">100G</div><div class="desc">总流量</div></li>
                    <li><div class="circle">60G</div><div class="desc">平均流量</div></li>
                </ul>

            </div>
        </div>
        <div class="echarts-row">
            <div class="echarts-title" style="width: 100%"><span class="desc">素材情况分析</span><span class="line"></span></div>
            <div class="" id="drawEcharts3" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="echarts-row">
            <div class="echarts-title" style="width: 100%"><span class="desc" style="width: 180px">素材上传分析-区域事业部</span><span class="line"></span></div>
            <div class="" id="drawEcharts4" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="div-table">
            <div class="table-title" style="width: 100%"><span class="desc" style="width: 150px">素材下载TOP10</span><span class="line"></span></div>
            <div class="btn-export">导出</div>
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
                    <tbody>
                    <tr v-for="(item,index) in [1,2,3,4,5,7]">
                        <td>{{index}}</td>
                        <td>{{index}}</td>
                        <td>{{index}}</td>
                        <td>{{index}}</td>
                        <td style="cursor: pointer;color:#00B1F1;">{{index}}</td>
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
                imgsrc:'nocheck1'
            }
        },
        created: function() {
            var that=this;
            $("body").on("click",'.radio',function () {
                if(!$(this).find(".img").hasClass("active")){
                    $(this).find(".img").addClass("active");
                    $(this).siblings(".radio").find(".img").removeClass("active");
                }
            })

            that.$nextTick(function(){
                that.drawLine1();
               // that.drawLine2();
                that.drawLine3();
                that.drawLine4();
                that.parentHeight();

            });

        },
        methods: {

            drawLine1(){
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
                        data: ['用户次数', '用户量'],
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
                        data: ['RSD1','RSD2','RSD3','RSD4','RSD5','RSD6','总部']
                    },
                    series: [
                        {
                            name: '用户次数',
                            type: 'bar',
                            data: [132, 29, 24, 10, 144, 630,944],
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
                            data: [319, 28, 31, 124, 114, 687,944],
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
            drawLine2(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts2'));
                // 绘制图表
                myChart.setOption({
                    color: ['#001E50', '#00437A', '#637077','#96A3A8','#C2CACF','#DFE4E8','#00B0F0'],
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        top:'50',
                        orient: 'vertical',
                        x: 'right',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawLine3(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts3'));
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    grid: {
                        left: '2.5%',
                        right: '4%',
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
                            data: ['产品与品牌','CRM营销','服务营销','汽车金融','其他业务','区域事业部','二手车营销','企业标识','全民打CALL','电商专区','捷达品牌物料','活动专区'],
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            //name: '水量',
                            min: 0,
                            max: 250,
                            // interval: 50,
                            // axisLabel: {
                            //     formatter: '{value} ml'
                            // }
                        },
                        {
                           //  type: 'value',
                          //  name: '温度',
                          //   min: 0,
                          //   max: 25,
                          //   interval: 5,
                            // axisLabel: {
                            //     formatter: '{value} °C'
                            // }
                        }
                    ],
                    series: [
                        {
                            name:'浏览量',
                            type:'bar',
                            barWidth: 30,//柱图宽度
                            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
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
                            name:'上传量',
                            type:'line',
                            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                            itemStyle: {
                                normal: {
                                    color: '#C2CACF',
                                    label : {
                                        show: true,
                                        position: 'right',
                                    }
                                }
                            },
                        },
                        {
                            name:'下载量',
                            type:'line',
                            yAxisIndex: 1,
                            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
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
            drawLine4(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts4'));
                // 绘制图表
                myChart.setOption({
                    color: ['#00437A'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        x:'right',
                        data:['上传量']
                    },
                    grid: {
                        left: '2.5%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : ['RSD1', 'RSD2', 'RSD3', 'RSD4', 'RSD5', 'RSD6'],
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
                            data:[10, 52, 200, 334, 390, 330]
                        }
                    ]
                });
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
                    .cc {
                        width: 124px;
                        display: inline-block;
                        border-bottom: 1px solid #2e3e4d;
                        select {
                            border: none;
                            width: 100%;
                            text-indent: 10px;
                            color: #2e3e4d;
                            font-size: 14px;
                            font-family: 'font-hy-55';
                        }
                        select:focus {
                            outline: none;
                        }
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
            border-top: 2px solid #D2D2D2;
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
                    color: #D2D2D2;
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
                        width: 110px;
                        height:110px;
                        line-height: 110px;
                        text-align: center;
                        border-radius: 100%;
                        color: #42B3F0;
                        font-size: 24px;
                        letter-spacing:2px;
                        border: 1px solid #42B3F0;
                    }
                    .desc{
                        margin-top: 10px;
                        text-align: center;
                        font-weight: bold;
                        font-size: 16px;
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
                width: 95%;
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
                                color: #b4c3ce;
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

</style>