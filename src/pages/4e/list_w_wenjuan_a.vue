<!--分析-->
<template>
    <div class="wenjuan_analytics">
        <div class="title">
            <span>问卷数据汇总表</span>
        </div>
        <div class="first">
            <ul class="table">
                <li class="head">
                    <ul class="tr">
                        <li class="th">
                            <span>大区</span>
                        </li>
                        <li class="th">
                            <span>执行家数</span>
                        </li>
                        <li class="th">
                            <span>邀约总数</span>
                        </li>
                        <li class="th">
                            <span>进店总数</span>
                        </li>
                        <li class="th">
                            <span>邀约进店率</span>
                        </li>
                        <li class="th">
                            <span>订单总数</span>
                        </li>
                        <li class="th">
                            <span>未交车总数</span>
                        </li>
                    </ul>
                </li>
                <li class="body">
					<span v-for="(item,index) in tableDataList">
					  <ul class="tr onul">
						<li class="td li1"><img class="icon" src="../../assets/4e/img/wenjuan-table-open.png"></img><span>{{item.name}}</span></li>
						<li class="td"><span>{{item.execute_count }}</span></li>
						<li class="td"><span>{{item.invite_count  }}</span></li>
						<li class="td"><span>{{item.coming_count  }}</span></li>
						<li class="td"><span>{{item.coming_rate|addZero}}%</span></li>
						<li class="td"><span style="color: #00B1F1">{{item.order_count }}</span></li>
						<li class="td"><span style="color: #00B1F1">{{item.unfinished_count }}</span></li>
					  </ul>
				    	<div class="children" style="display: none">
					    	<div class="wrap">
							<div class="box top" style="color: #96A3A8">
								<div class="item">车型</div>
								<div class="item">车型订单数</div>
								<div class="item">车型未交付数</div>
						  	</div>
								<span  v-for="(ii,indexss) in item.carList" >
									<div class="box bottom">
								     <div class="item" style="border-bottom: 1px solid #dfe4e8">{{ii.name}}</div>
								     <div class="item" style="border-bottom: 1px solid #dfe4e8;border-left: 1px solid #dfe4e8;border-right: 1px solid #dfe4e8">{{ii.car_order_count}}</div>
								     <div class="item" style="border-bottom: 1px solid #dfe4e8">{{ii.car_unfinished_count}}</div>
							        </div>
                                </span>
						</div>
					  </div>
					</span>

                </li>
            </ul>
        </div>
        <div class="echarts-row">
            <div class="echarts-title"><span class="desc">执行情况</span><span class="line"></span></div>
            <div class="" id="drawEcharts1" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="echarts-row">
            <div class="echarts-row2" style="width: 45%;float: left">
                <div class="echarts-title"><span class="desc">邀约进店量</span><span class="line"></span></div>
                <div class="" id="drawEcharts2" :style="{width: '100%', height: '400px'}">
                </div>
            </div>
            <div class="echarts-row2" style="width: 45%;float: right">
                <div class="echarts-title"><span class="desc">店均邀约进店量</span><span class="line"></span></div>
                <div class="" id="drawEcharts3" :style="{width: '100%', height: '400px'}">
                </div>
            </div>
        </div>
        <div class="echarts-row">
            <div class="echarts-title"><span class="desc">邀约进店率</span><span class="line"></span></div>
            <div class="" id="drawEcharts4" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="echarts-row">
            <div class="echarts-title"><span class="desc">分车型订单量</span><span class="line"></span></div>
            <div class="" id="drawEcharts5" :style="{width: '90%', height: '400px',marginLeft:'5%'}">
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
    Vue.use(util_js)
    export default {
        data: function () {
            return {
                base: base,
                data: {},
                pageSize: 12,
                pageNumber: 1,
                pageCount: 1,
                user: {},
                userManage: 0,
                list: [],
                qaId: 0,
                tableDataList: [],
            }
        },
        created: function(){
            this.qaId = this.$route.query.id;
            $("body").on("click",'.wenjuan_analytics .first .onul',function () {
                $(this).siblings('.children').slideToggle("slow");
            })
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                var that = this;
                this.get(this.base + "/api/policy/data/list?qaId=" + this.qaId, null, function (data) {
                    console.log(data);
                    if (data.code == 200) {
                        that.tableDataList = data.data;
                        that.drawLine1(data.data);
                        that.drawLine2(data.data);
                        that.drawLine3(data.data);
                        that.drawLine4(data.data);
                        that.drawLine5(data.data);
                    }
                }, false);
                this.parentHeight();
            },
            drawLine1(data) {
                let xAxisName=[],seriesData_dealer_count=[],seriesData_execute_count=[];
                for (var i=0;i<data.length;i++){
                    xAxisName.push(data[i].name);
                    seriesData_dealer_count.push(data[i].dealer_count);
                    if(data[i].execute_count==0){
                        seriesData_execute_count.push("0");
                    }else{
                        seriesData_execute_count.push((data[i].dealer_count/data[i].execute_count).toFixed(2));
                    }
                }
                console.log(seriesData_execute_count)
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts1'));
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b0}<br/>{a0}: {c0}<br />{a1}: {c1}%'
                    },
                    legend: {
                        data: ['提报经销商数', '执行比例'],
                        x: 'right' //居右显示
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: xAxisName,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            // "show": false,
                        },
                        {
                            // "show": false,
                        }
                    ],
                    series: [
                        {
                            name: '提报经销商数',
                            type: 'bar',
                            data: seriesData_dealer_count,
                            barWidth: 30,//柱图宽度
                            itemStyle: {
                                normal: {
                                    color: '#00437A',
                                    label : {show: true}
                                }
                            }
                        },
                        {
                            name: '执行比例',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesData_execute_count,
                            itemStyle: {
                                normal: {
                                    color: '#7A7A79',
                                    label : {show: true}
                                }
                            },
                        }
                    ]
                });
            },
            drawLine2(data) {
                let arr=[];
                for (var i=0;i<data.length;i++){
                    arr.push({product:data[i].name,"邀约量":data[i].invite_count,"进店量":data[i].coming_count});
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart2 = this.$echarts.init(document.getElementById('drawEcharts2'));
                // 绘制图表
                myChart2.setOption({
                    legend: {
                        x: 'right' //居右显示
                    },
                    tooltip: {},
                    dataset: {
                        dimensions: ['product', '邀约量', '进店量'],
                        source: arr
                    },
                    xAxis: {type: 'category'},
                    yAxis: {
                        // show:false
                    },
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {   type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#00437A',
                                    label : {show: true}
                                }
                            },
                        },
                        {type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#00B1F1',
                                    label : {show: true}
                                }
                            },
                        }
                    ]
                });
            },
            drawLine3(data) {
                let arr=[];
                for (var i=0;i<data.length;i++){
                    arr.push({product:data[i].name,"店均邀约量":(data[i].invite_count/data[i].dealer_count),"店均进店量":(data[i].coming_count/data[i].dealer_count)});
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart3 = this.$echarts.init(document.getElementById('drawEcharts3'));
                // 绘制图表
                myChart3.setOption({
                    legend: {
                        x: 'right' //居右显示
                    },
                    tooltip: {},
                    dataset: {
                        dimensions: ['product', '店均邀约量', '店均进店量'],
                        source: arr
                    },
                    xAxis: {type: 'category'},
                    yAxis: {
                        // show:false
                    },
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {   type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#00437A',
                                    label : {show: true}
                                }
                            },
                        },
                        {
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#00B1F1',
                                    label : {show: true}
                                }
                            },
                        }
                    ]
                });
            },
            drawLine4(data) {
                let xAxisData=[],seriesData=[];
                for (var i=0;i<data.length;i++){
                    xAxisData.push(data[i].name);
                    seriesData.push(data[i].coming_rate.toFixed(2));
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart4 = this.$echarts.init(document.getElementById('drawEcharts4'));
                // 绘制图表
                myChart4.setOption({
                    legend: {
                        x: 'right' //居右显示
                    },
                    tooltip: {
                        trigger: 'axis',
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value',
                        // show:false
                    },
                    series: [{
                        data:seriesData,
                        type: 'line',
                        itemStyle: {
                            normal: {
                                color: '#00B1F1',
                                label : {show: true}
                            }
                        },
                    }]
                });
            },
            drawLine5(data) {
                let xAxisData=[],legendData=[],series=[];
                var colorList=['#001E50','#00437A','#3C484D','#00B1F1','#637077','#96A3A8','#96A3A8','#DFE4E8'];
                var newCarList0=[],newCarList1=[],newCarList2=[],newCarList3=[],newCarList4=[],newCarList5=[];
                for (var i=0;i<data.length;i++){
                    xAxisData.push(data[i].name);
                    newCarList0.push(data[i].carList[0].car_order_count);
                    newCarList1.push(data[i].carList[1].car_order_count);
                    newCarList2.push(data[i].carList[2].car_order_count);
                    newCarList3.push(data[i].carList[3].car_order_count);
                    newCarList4.push(data[i].carList[4].car_order_count);
                    newCarList5.push(data[i].carList[5].car_order_count);
                    for(var k=0;k<data[i].carList.length;k++) {
                        if(i<1){
                            legendData.push(data[i].carList[k].name);
                            series.push({
                                name: data[i].carList[k].name,
                                type: 'bar',
                                stack: '总量',
                                barWidth: 50,//柱图宽度
                                itemStyle: {
                                    normal: {
                                        color: colorList[k],
                                    }
                                },
                                idss:data[i].carList[k].id
                            })
                        }
                    }
                }
                series[0].data=newCarList0;
                series[1].data=newCarList1;
                series[2].data=newCarList2;
                series[3].data=newCarList3;
                series[4].data=newCarList4;
                series[5].data=newCarList5;
                // 基于准备好的dom，初始化echarts实例
                let myChart5 = this.$echarts.init(document.getElementById('drawEcharts5'));
                // 绘制图表
                myChart5.setOption({
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        x: 'right', //居左显示
                        data: legendData
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'category',
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series:series
                });
            },
            parentHeight: function() {
                $(window.parent.document).find("iframe").height(($(".wenjuan_analytics").height()+400)+'px');
            },
        }
    }
</script>

<style lang="scss" scope>
    .wenjuan_analytics {
        .title {
            height: 30px;
            span {
                color: #3c484d;
                font-size: 18px;
            }
            padding-bottom: 10px;
            border-bottom: 2px solid #dfe4e8;
        }
        .first {
            width: 100%;
            margin-top: 10px;
            .table {
                width: 100%;
                .head {
                    width: 100%;
                    .tr {
                        width: 100%;
                        list-style: none;
                        border-bottom: 1px solid #dfe4e8;
                        .th {
                            width: 13.3%;
                            height: 50px;
                            line-height: 50px;
                            display: inline-block;
                            text-align: center;
                            color: #001E50;
                            font-weight: bold;
                        }
                    }
                }
                .body {
                    width: 100%;
                    .tr {
                        cursor: pointer;
                        width: 100%;
                        list-style: none;
                        border-bottom: 1px solid #dfe4e8;
                        .td {
                            position: relative;
                            width: 13.3%;
                            height: 40px;
                            line-height: 40px;
                            display: inline-block;
                            text-align: center;
                            .icon {
                                position: absolute;
                                left: 0;
                                top: 0;
                                bottom: 0;
                                margin: auto;
                                height: 80%;
                            }
                        }
                    }
                    .children {
                        width: 100%;
                        background-color: #EFF1F3;
                        position: relative;
                        .wrap {
                            margin: auto;
                            padding-top: 20px;
                            padding-bottom: 20px;
                            width: 400px;
                            height: auto;
                            .box {
                                display: -webkit-flex;
                                display: flex;
                                background-color: #ffffff;
                                margin: auto;
                                .item {
                                    -webkit-flex: 1;
                                    flex: 1;
                                    text-align: center;
                                    padding: 3px;
                                    height: 30px !important;
                                }
                                .item:nth-child(2) {
                                    border-left: 1px solid #dfe4e8;
                                    border-right: 1px solid #dfe4e8;
                                }
                            }
                            .box.top {
                                border-bottom: 1px solid #dfe4e8;
                                border-radius: 0 !important;
                            }
                            .box.bottom{
                                border-radius: 0 !important;

                            }
                        }
                    }
                }
            }
        }
        .echarts-row {
            padding: 40px;
            height: 400px;
            margin-top: 40px;
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
                    border-bottom: 1px solid #00B1F1;
                }
                .line {
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                    border-bottom: 1px solid #DFE4E8;
                }
            }
        }
    }
</style>