<template>
    <div class="wj-dialog">
        <div class="dialog">
            <div class="mask">
                <img class="dialog-close" src='../../assets/4e/img/icon-delete.png'>
                <div class="title">数据汇总表说明</div>
                 <ul class="table">
                        <li class="head">
                            <div class="d0">序号</div>
                            <div class="d1">指标名称</div>
                            <div class="d2">计算逻辑</div>
                            <div class="d3">数据来源</div>
                        </li>
                        <li class="body">
                            <div class="d0">1</div>
                            <div class="d1">执行加数</div>
                            <div class="d2">各家总和</div>
                            <div class="d3">经销商提报</div>
                        </li>

                     <li class="body">
                         <div class="d0">2</div>
                         <div class="d1">执行率</div>
                         <div class="d2">执行家数/所辖经销商总数</div>
                         <div class="d3">计算</div>
                     </li>
                     <li class="body">
                         <div class="d0">3</div>
                         <div class="d1">邀约量</div>
                         <div class="d2">各家总和</div>
                         <div class="d3">经销商提报</div>
                     </li>
                     <li class="body">
                         <div class="d0">4</div>
                         <div class="d1">店均邀约量</div>
                         <div class="d2">邀约量/所辖经销商执行家数</div>
                         <div class="d3">计算</div>
                     </li>
                     <li class="body">
                         <div class="d0">5</div>
                         <div class="d1">到店量</div>
                         <div class="d2">各家总和</div>
                         <div class="d3">经销商提报</div>
                     </li>
                     <li class="body">
                         <div class="d0">6</div>
                         <div class="d1">店均到店量</div>
                         <div class="d2">到店量/所辖经销商执行家数</div>
                         <div class="d3">计算</div>
                     </li>
                     <li class="body">
                         <div class="d0">7</div>
                         <div class="d1">到店率</div>
                         <div class="d2">到店量/邀约量</div>
                         <div class="d3">计算</div>
                     </li>
                     <li class="body">
                         <div class="d0">8</div>
                         <div class="d1">订单量</div>
                         <div class="d2">各家订单量累计（分车型,整体）</div>
                         <div class="d3">经销商提报</div>
                     </li>
                     <!--<li class="body">-->
                         <!--<div class="d0">9</div>-->
                         <!--<div class="d1">累计未交车数</div>-->
                         <!--<div class="d2">各家未交车订单量累计（分车型,整体）</div>-->
                         <!--<div class="d3">经销商提报</div>-->
                     <!--</li>-->
                     <li class="body">
                         <div class="d0">9</div>
                         <div class="d1">数据环比与同比</div>
                         <div class="d2">上述所有指标预留进行环比及同比的计算逻辑</div>
                         <div class="d3" style="opacity: 0;">0</div>
                     </li>
                 </ul>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "wenjuan-dialog"
    }
</script>

<style scoped lang="scss">
    $borderColor:1px solid #e4e4e4;
  .wj-dialog{
      width: 100%;
      height: 100%;
      .dialog{
          top:0;
          width: 100%;
          height: 100%;
          position: absolute;
          background-color: rgba(0,0,0,0.5);
          .mask{
              width: 600px;
              height: 430px;
              background-color:#ffffff ;
              border-radius: 2px;
              position: absolute;
              left: 0;
              right: 0;
              top: 50px;
              margin: auto;
              .dialog-close{
                  width: 20px;
                  cursor: pointer;
                  position: absolute;
                  right: 10px;
                  top: 5px;
              }
              .title{
                  width: 100%;
                  height: 20px;
                  text-align: center;
                  border-bottom: 1px solid #F1F2F4;
                  line-height: 3;
              }
              .table{
                  width: 90%;
                  margin: auto;
                  margin-top: 10px;
                  .head{
                      width: 100%;
                      list-style: none;
                      background-color: #F2F2F2;
                      border: $borderColor;
                      border-bottom: none;
                      height: 35px;
                      .d0{
                          width: 6%;
                          display: inline-block;
                          border-right: $borderColor;
                          height: 34px;
                          line-height: 34px;
                          text-align: center;
                      }
                      .d1{
                          width: 20%;
                          display: inline-block;
                          height: 34px;
                          line-height: 34px;
                          padding-left: 10px;
                          border-right: $borderColor;
                      }
                      .d2{
                          width: 50%;
                          display: inline-block;
                          border-right: $borderColor;
                          height: 34px;
                          line-height: 34px;

                      }
                      .d3{
                          width: 15%;
                          display: inline-block;
                          height: 34px;
                          line-height: 34px;
                          padding-left: 10px;
                      }
                  }
                  .body{
                      width: 100%;
                      list-style: none;
                      border: $borderColor;
                      border-top: none;
                      .d0{
                          width: 6%;
                          display: inline-block;
                          border-right: $borderColor;
                          height: 34px;
                          line-height: 34px;
                          text-align: center;


                      }
                      .d1{
                          width: 20%;
                          display: inline-block;
                          height: 34px;
                          line-height: 34px;
                          padding-left: 10px;
                          border-right: $borderColor;
                      }
                      .d2{
                          width: 50%;
                          display: inline-block;
                          border-right: $borderColor;
                          height: 34px;
                          line-height: 34px;


                      }
                      .d3{
                          width: 15%;
                          display: inline-block;
                          height: 34px;
                          line-height: 34px;
                          padding-left: 10px;
                      }
                  }
              }
          }

      }
  }
</style>