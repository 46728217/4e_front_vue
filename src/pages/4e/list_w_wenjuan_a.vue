<!--分析-->
<template>
    <div class="wenjuan_analytics"  id="wenjuan_analytics" style="margin-right: 15px">
        <div class="nav" style="margin-bottom: 20px">
            <div class="back" @click="back()" style="cursor: pointer;margin-bottom: 10px">
                <img src="../../assets/4e/img/back.png"/>
                <span>返回</span>
            </div>
        </div>
        <div class="title">
            <span>问卷数据汇总表</span><img class="question" style="    margin-left: 10px;
    width: 18px;
    vertical-align: sub;
cursor: pointer" src="../../assets/4e/img/icon-question.png">
        </div>
        <div class="first">
            <ul class="table">
                <li class="head">
                    <ul class="tr">
                        <li class="th">
                            <span style="">大区</span>
                            <!--<img style="vertical-align: middle" src="../../assets/4e/img/wenjuan-table-arrow.png">-->
                        </li>
                        <li class="th">
                            <span>经销商量</span>
                        </li>
                        <li class="th">
                            <span>执行家数</span>
                        </li>
                        <li class="th">
                            <span>未执行家数</span>
                        </li>
                        <li class="th">
                            <span>邀约量</span>
                            <!--<img style="vertical-align: "src="../../assetsmiddle/4e/img/wenjuan-table-arrow1.png">-->
                        </li>
                        <li class="th">
                            <span>到店量</span>
                        </li>
                        <li class="th">
                            <span>店均邀约量</span>
                        </li>
                        <li class="th">
                            <span>店均到店量</span>
                        </li>
                        <li class="th">
                            <span>订单量</span>
                        </li>
                    </ul>
                </li>
                <li class="body">
					<span v-for="(item,index) in tableDataList">
					  <ul class="tr onul onulclose">
						<li class="td li1"><img class="icon " src="../../assets/4e/img/wenjuan-table-open.png"></img><span>{{item.name}}</span></li>
						<li class="td"><span>{{item.dealer_total }}</span></li><!--大区经销商量-->
                        <li class="td"><span>{{item.execute_count }}</span></li>
                        <li class="td"><span>{{item.un_execute_count }}</span></li>
						<li class="td"><span>{{item.invite_count  }}</span></li>
						<li class="td"><span>{{item.coming_count}}</span></li>
						<li class="td"><span>{{(item.execute_count==0?0:item.invite_count/item.execute_count)|addZero}}</span></li>
						<li class="td"><span>{{(item.execute_count==0?0:item.coming_count/item.execute_count)|addZero }}</span></li>
                        <li class="td"><span style="color: #00B1F1">{{item.order_count }}</span></li>
					  </ul>
				    	<div class="children" style="display: none">
					    	<div class="wrap">
							<div class="box top" style="color: #96A3A8;padding: 0 !important;">
								<div class="item" style="border: 1px solid #dfe4e8;border-bottom: none;border-right: none">车型</div>
								<div class="item" style="border: 1px solid #dfe4e8;border-bottom: none">车型订单数</div>
								<!--<div class="item">车型未交付数</div>-->
						  	</div>
								<span  v-for="(ii,indexss) in item.carList" >
									<div class="box bottom" style=";padding: 0 !important;">
								     <div class="item" style="border-bottom: 1px solid #dfe4e8;border-left: 1px solid #dfe4e8;">{{ii.name}}</div>
								     <div class="item" style="border-bottom: 1px solid #dfe4e8;border-left: 1px solid #dfe4e8;border-right: 1px solid #dfe4e8">{{ii.car_order_count}}</div>
								     <!--<div class="item" style="border-bottom: 1px solid #dfe4e8">{{ii.car_unfinished_count}}</div>-->
							        </div>
                                </span>
						</div>
					  </div>
					</span>

                </li>
            </ul>
        </div>
        <div class="echarts-row" style="margin-top: 20px">
            <div class="echarts-title"><span class="desc">执行情况</span><span class="line"></span></div>
            <div class="" id="drawEcharts1" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="echarts-row" style="margin-top: 50px;">
            <div class="echarts-row2" style="width: 48%;float: left;position: relative">
                <div class="echarts-title" style="position: absolute"><span class="desc">邀约进店量</span><span class="line"></span></div>
                <div class="" id="drawEcharts2" :style="{width: '100%', height: '400px'}">
                </div>
            </div>
            <div class="echarts-row2" style="width: 48%;float: right;position: relative">
                <div class="echarts-title" style="position: absolute"><span class="desc">店均邀约进店量</span><span class="line"></span></div>
                <div class="" id="drawEcharts3" :style="{width: '100%', height: '400px'}">
                </div>
            </div>
        </div>
        <div class="echarts-row" style="position: relative">
            <div class="echarts-title" style="position: absolute;width: 100%"><span class="desc">到店率</span><span class="line"></span></div>
            <div class="" id="drawEcharts4" :style="{width: '100%', height: '400px'}">
            </div>
        </div>
        <div class="echarts-row">
            <div class="echarts-title"><span class="desc">分车型订单量</span><span class="line"></span></div>
            <div class="" id="drawEcharts5" :style="{width: '90%', height: '400px',marginLeft:'5%'}">
            </div>
        </div>
        <wenjuana-dialog class="wenjuana-dialog" style="display: none"></wenjuana-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import WenjuanaDialog from './WenjuanaDialog'
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
                carListlen:0
            }
        },
        components:{
            WenjuanaDialog:WenjuanaDialog,
        },
        created: function(){
            var that=this;
            this.qaId = this.$route.query.id;

            $("body").on("click",'.wenjuan_analytics .first .onul',function () {
                $(this).siblings('.children').slideToggle("slow");
                var o = document.getElementById("wenjuan_analytics");
                var h = o.clientHeight||o.offsetHeight;
                var childrenLen=that.carListlen*55;//获取子类的总高度
                console.log(childrenLen+"========");

                if($(this).hasClass("onulclose")){
                    $(this).removeClass("onulclose");
                    $(this).children(".li1").children("img").attr("src",require("../../assets/4e/img/wenjuan-table-close.png"))
                    setTimeout(function(){
                        $("#main_frame" , parent.parent.document).css('height', (h+childrenLen)+"px");
                    }, 1000);
                }else{
                    $(this).addClass("onulclose");
                    $(this).children(".li1").children("img").attr("src",require("../../assets/4e/img/wenjuan-table-open.png"))
                    setTimeout(function(){
                        $("#main_frame" , parent.parent.document).css('height', (h-childrenLen+200)+"px");
                    }, 1000);
                }

            });

            that.$nextTick(function(){
                that.init();
            });

            $("body").on("click",'.wenjuan_analytics .question',function () {
                if($('body').find(".wenjuana-dialog").hasClass("active")){
                    $('body').find(".wenjuana-dialog").removeClass("active");
                    $("body").find(".wenjuana-dialog").hide();
                }else{
                    $("body").find(".wenjuana-dialog").show();
                }
            });
            $("body").on("click",'.dialog .dialog-close',function () {
                $("body").find(".wenjuana-dialog").hide();
            });

        },
        methods: {

            init() {
                var that = this;
                this.get(this.base + "/api/policy/data/list?qaId=" + this.qaId, null, function (data) {
                    if (data.code == 200) {
                        that.tableDataList = data.data;
                        that.carListlen=data.data[0].carList.length;
                        that.drawLine1(data.data);
                        that.drawLine2(data.data);
                        that.drawLine3(data.data);
                        that.drawLine4(data.data);
                        that.drawLine5(data.data);
                    }
                }, false);
                this.parentHeight();
            },
            formatData(v){
                if(v.toString().indexOf('.')>-1){
                  return  v.toFixed(2);
                }
                return v;
            },
            drawLine1(data) {
                let xAxisName=[],seriesData_dealer_count=[],seriesData_execute_count=[];
                for (var i=0;i<data.length;i++){
                    xAxisName.push(data[i].name);
                    seriesData_dealer_count.push(data[i].dealer_count);
                    if(data[i].dealer_count==0){
                        seriesData_execute_count.push("0");
                    }else{
                        seriesData_execute_count.push((data[i].execute_count/(data[i].dealer_total||1)*100).toFixed(2));//少个dealer_total字段
                    }
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('drawEcharts1'));
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b0}<br/>{a0}: {c0}<br />{a1}: {c1}%',
                        textStyle:{
                            fontSize:11
                        }
                    },
                    legend: {
                        data: ['提报经销商数', '执行率'],
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
                            "show": true,
                        },

                        {
                            "show": false,
                        }
                    ],
                    series: [
                        {
                            name: '提报经销商数',
                            type: 'bar',
                            data: seriesData_dealer_count,
                            barWidth: 37,//柱图宽度
                            itemStyle: {
                                normal: {
                                    color: '#00437A',
                                    label : {
                                        show: true,
                                         position: 'top',
                                    }
                                }
                            }
                        },
                        {
                            name: '执行率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: seriesData_execute_count,
                            itemStyle: {
                                normal: {
                                    color: '#7A7A79',
                                    label : {
                                        show: true,
                                        formatter: '{c0}%',
                                         position: 'right',
                                        color:'#333'
                                        }
                                }
                            },
                        }
                    ]
                });
            },
            drawLine2(data) {
                let arr=[];
                var that=this;
                for (var i=0;i<data.length;i++){
                    arr.push({product:data[i].name,"邀约量":that.formatData(data[i].invite_count),"进店量":that.formatData(data[i].coming_count)});
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart2 = this.$echarts.init(document.getElementById('drawEcharts2'));
                // 绘制图表
                myChart2.setOption({
                    grid: {
                        left: '15%', //grid 组件离容器左侧的距离。默认值是10%。
                        top:90
                    },
                    legend: {
                        x: 'right', //居右显示
                        top:0,
                    },
                    tooltip: {
                        textStyle:{
                            fontSize:11
                        }
                    },
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
                            barWidth: 20,//柱图宽度
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
                        {type: 'bar',
                            barWidth: 20,//柱图宽度
                            itemStyle: {
                                normal: {
                                    color: '#00B1F1',
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
            drawLine3(data) {
                let arr=[];
                var that=this;
                for (var i=0;i<data.length;i++){
                    arr.push({product:data[i].name,"店均邀约量":that.formatData(data[i].invite_count/data[i].execute_count),"店均进店量":that.formatData(data[i].coming_count/data[i].execute_count)});
                }
                // 基于准备好的dom，初始化echarts实例
                let myChart3 = this.$echarts.init(document.getElementById('drawEcharts3'));
                // 绘制图表
                myChart3.setOption({
                    grid: {
                        left: '15%', //grid 组件离容器左侧的距离。默认值是10%。
                        top:90
                    },
                    legend: {
                        x: 'right' //居右显示
                    },
                    tooltip: {
                        textStyle:{
                            fontSize:11
                        }
                    },
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
                            barWidth: 20,//柱图宽度
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
                            type: 'bar',
                            barWidth: 20,//柱图宽度
                            itemStyle: {
                                normal: {
                                    color: '#00B1F1',
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
                    grid: {
                        top:90
                    },
                    legend: {
                        data: ['邀约进店率'],
                        right:10
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b0}<br/>{c0}%',
                        textStyle:{
                            fontSize:11
                        }
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
                        name:'邀约进店率',
                        itemStyle: {
                            normal: {
                                color: '#00B1F1',
                                label : {show: true,
                                    formatter: '{c0}%'
                                },

                            }
                        },
                    }]
                });
            },
            drawLine5(data) {
                if(data.length>0){
                    let xAxisData=[],legendData=[],series=[];
                    var colorList=['#001E50','#00437A','#3C484D','#00B1F1','#637077','#96A3A8','#000066','#003333','#006666','#006699','#999966','#999999 ','#CCCC99','#CCCCCC','#0099CC','#003300','#660099','#660066','#669900','#000099'];
                    var ListArr=[];
                    var carList=[];
                    for (var n=0; n<data[0].carList.length;n++ ) {
                        ListArr.push(new Array());
                    };
                    for (var i=0;i<data.length;i++){
                        xAxisData.push(data[i].name);
                        carList.push(data[i].carList);
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
                    for(var p=0;p<carList.length;p++){
                        var arr=carList[p];
                        for(var r=0;r<arr.length;r++){
                            ListArr[r].push(arr[r].car_order_count);
                        }
                    }
                    for(var nn=0;nn<ListArr.length;nn++){
                        series[nn].data=ListArr[nn];
                    }
                    // 基于准备好的dom，初始化echarts实例
                    let myChart5 = this.$echarts.init(document.getElementById('drawEcharts5'));
                    // 绘制图表
                    myChart5.setOption({
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            textStyle:{
                                fontSize:11
                            }
                        },
                        legend: {
                            x: 'right', //居左显示
                            data: legendData,
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
                }

            },
            parentHeight: function() {
                $(window.parent.document).find("iframe").height(($(".wenjuan_analytics").height()+300)+'px');
            },
            back(){
                this.$router.go(-1);//返回上一层
            }
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
                            width: 10%;
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
                            width: 10%;
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
                                height: 40%;
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
                                    line-height: 30px !important;
                                    color: #001E50 !important;
                                }
                                .item:nth-child(2) {
                                    border-left: 1px solid #dfe4e8;
                                  //  border-right: 1px solid #dfe4e8;
                                }
                            }
                            .box.top {
                                border-bottom: 1px solid #dfe4e8;
                                border-radius: 0 !important;

                            }
                            .box.top .item{
                                color:#9CA7AC !important
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
            height: 400px;
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
        }
    }
</style>