<template>
  <i-content class="main-content-con">
    <p class="statisticsTitle">业务动态</p>
    <div class="statistics">
      <div class="content">
        <div class="item">
          <!--预约统计-->
          <span class="statisticsETitle">预约统计</span>
          <div class="pieBorder"></div>
          <div ref="appointmentStatistics" class="appointmentStatistics" style="width:100%;height: 100%"></div>
        </div>
        <div class="item">
          <!--预约趋势-->
          <span class="statisticsETitle">预约趋势</span>
          <div style="position:absolute;right: 26px;z-index: 1;top: 9px;">
            <span  class="searchItemText">时间:</span>
            <i-date-picker v-model="orderTime1" type="date" @on-change="setAppointmentDate" format="yyyy-MM-dd" placeholder="请输入日期"></i-date-picker>
          </div>
          <div ref="appointmentTrend" class="appointmentTrend" style="height: 100%"></div>
        </div>
      </div>
      <div class="content">
        <div class="item">
          <!--会见统计-->
          <span class="statisticsETitle">提讯情况统计</span>
          <div style="position:absolute;right: 26px;z-index: 1;top: 9px;">
            <span class="searchItemText">时间:</span>
            <i-date-picker v-model="orderTime2" type="date" @on-change="setMeetStatisticsDate" format="yyyy-MM-dd" placeholder="请输入日期"></i-date-picker>
          </div>
          <div ref="meetStatistics" class="meetStatistics" style="height: 100%"></div>
        </div>
        <div class="item">
          <span class="statisticsETitle">提讯室使用情况</span>
          <div style="position:absolute;right: 26px;z-index: 1;top: 9px;">
            <span class="searchItemText">时间:</span>
            <i-date-picker v-model="orderTime" type="date" @on-change="setGrantDateStart" format="yyyy-MM-dd" placeholder="请输入日期"></i-date-picker>
          </div>
          <!--律师房间使用情况-->
          <div ref="lawyerRoomDetail" class="lawyerRoomDetail" style="height: 100%;"></div>
        </div>
      </div>
    </div>
  </i-content>
</template>

<script>
import echarts from 'echarts';
import { getAppointmentStatistics, getAppointTrendData, getRoomDetail } from '@/api/bg-manage/statistics/statistics';
import { formatDateToStr } from '@/libs/tools';
export default {
  name: 'statistics',
  data () {
    return {
      colorList: ['#027CFF', '#F9523E'],
      colorList1: ['#027CFF', '#F9523E', '#69F957', '#3af9f6'],
      orderTime: new Date(),
      orderTime1: new Date(),
      orderTime2: new Date()
    };
  },
  mounted () {
    this.initMeetStatistics();
    this.initAppointmentStatistics();
    this.initAppointmentTrend();
    this.initLawyerRoomDetail();
    this.init();
  },
  methods: {
    init () {
      const that = this;
      setTimeout(() => {
        window.onresize = function () {
          echarts.init(that.$refs.appointmentStatistics).resize();
          echarts.init(that.$refs.meetStatistics).resize();
          echarts.init(that.$refs.appointmentTrend).resize();
          echarts.init(that.$refs.lawyerRoomDetail).resize();
        };
      }, 20);
    },
    initMeetStatistics () {
      let myChart = echarts.init(this.$refs.meetStatistics);
      let data = {
        date: formatDateToStr(this.orderTime2),
        type: 'meetStatistics'
      };
      getAppointTrendData(data).then(res => {
        let option = {
          color: this.colorList,
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.name + '：' + params.value + '人';
            },
            backgroundColor: '#0B2047',
            borderColor: 'rgba(53, 255, 250, 0.8)',
            borderWidth: 1,
            borderRadius: 0,
            padding: 10
          },
          grid: {
            left: '20%',
            bottom: '10%',
            top: '28%',
            containLabel: true
          },
          xAxis: [
            {
              name: '日期',
              type: 'category',
              data: res.data.data.date,
              axisPointer: {
                type: 'shadow'
              },
              nameTextStyle: {
                color: '#fff'
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  width: 1,
                  color: '#519DCC'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#FFFFFF'
                }
              }
            }
          ],
          yAxis: [
            {
              name: '提讯人数',
              nameTextStyle: {
                color: '#FFFFFF' // 白 */
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  width: 1,
                  color: '#519DCC'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#FFFFFF'
                }
              },
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: 'solid',
                  color: 'rgba(81,157,204,0.3)'
                }
              }
            }
          ],
          series: [
            {
              data: res.data.data.data,
              type: 'bar',
              barWidth: 20,
              label: {
                color: '#14B6F3', // 柱状图标签字体
                show: true,
                position: 'top',
                fontWeight: 'bold'
              },
              color: new echarts.graphic.LinearGradient(
                1, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(119,255,255,1)' }, // 代表颜色坐标为0的颜色
                  { offset: 1, color: 'rgba(0,122,255,1)' }
                ]
              )
            },
            {
              data: res.data.data.data,
              type: 'line',
              color: 'rgba(0,122,255,1)',
              smooth: true,
              symbolSize: 8,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(0,122,255,1)' }, // 代表颜色坐标为0的颜色
                    { offset: 1, color: 'rgba(0,0,0,0.2)' }
                  ]
                )
              }
            }
          ]
        };
        myChart.setOption(option);
      });
    },
    initAppointmentStatistics () {
      let myChart = echarts.init(this.$refs.appointmentStatistics);
      getAppointmentStatistics().then(res => {
        let keepData = res.data.data;
        let data = [];
        let arr = [];
        for (let i = 0; i < res.data.data.length; i++) {
          data.push({ name: res.data.data[i].name + `    ` + res.data.data[i].value, value: res.data.data[i].value });
          arr.push(data[i].name);
        }
        let option = {
          color: this.colorList1,
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return keepData[params.dataIndex].name + '：' + keepData[params.dataIndex].value + '人';
            },
            backgroundColor: '#0B2047',
            borderColor: 'rgba(53, 255, 250, 0.8)',
            borderWidth: 1,
            borderRadius: 0,
            padding: 10
          },
          legend: {
            data: arr,
            orient: 'vertical',
            itemWidth: 15,
            itemHeight: 15,
            right: 60,
            top: 60,
            icon: 'star4',
            textStyle: {
              color: '#FFFFFF'
            }
          },
          series: [
            {
              name: '预约统计',
              type: 'pie',
              avoidLabelOverlap: false,
              center: ['50%', '50%'],
              radius: ['15%', '52%'],
              label: {
                normal: {
                  show: false
                }
              },
              data: data
            }
          ]
        };
        myChart.setOption(option);
      });
    },
    initAppointmentTrend () {
      let myChart = echarts.init(this.$refs.appointmentTrend);
      let data = {
        date: formatDateToStr(this.orderTime1),
        type: 'appointmentTrend'
      };
      getAppointTrendData(data).then(res => {
        let option = {
          color: this.colorList,
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.name + '：' + params.value + '人';
            },
            backgroundColor: '#0B2047',
            borderColor: 'rgba(53, 255, 250, 0.8)',
            borderWidth: 1,
            borderRadius: 0,
            padding: 10
          },
          grid: {
            left: '20%',
            bottom: '10%',
            top: '28%',
            containLabel: true
          },
          xAxis: [
            {
              name: '日期',
              type: 'category',
              data: res.data.data.date,
              axisPointer: {
                type: 'shadow'
              },
              nameTextStyle: {
                color: '#fff'
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  width: 1,
                  color: '#519DCC'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#FFFFFF'
                }
              }
            }
          ],
          yAxis: [
            {
              name: '预约人数',
              nameTextStyle: {
                color: '#FFFFFF' // 白 */
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  width: 1,
                  color: '#519DCC'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#FFFFFF'
                }
              },
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: 'solid',
                  color: 'rgba(81,157,204,0.3)'
                }
              }
            }
          ],
          series: [
            {
              data: res.data.data.data,
              type: 'bar',
              barWidth: 20,
              label: {
                color: '#14B6F3', // 柱状图标签字体
                show: true,
                position: 'top',
                fontWeight: 'bold'
              },
              color: new echarts.graphic.LinearGradient(
                1, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(119,255,255,1)' }, // 代表颜色坐标为0的颜色
                  { offset: 1, color: 'rgba(0,122,255,1)' }
                ]
              )
            },
            {
              data: res.data.data.data,
              type: 'line',
              color: 'rgba(0,122,255,1)',
              smooth: true,
              symbolSize: 8,
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(0,122,255,1)' }, // 代表颜色坐标为0的颜色
                    { offset: 1, color: 'rgba(0,0,0,0.2)' }
                  ]
                )
              }
            }
          ]
        };
        myChart.setOption(option);
      });
    },
    initLawyerRoomDetail () {
      let myChart = echarts.init(this.$refs.lawyerRoomDetail);
      let queryData = {
        date: formatDateToStr(this.orderTime)
      };
      let dataZoom = [
        {
          id: 'dataZoomX',
          show: true,
          backgroundColor: 'rgba(47,69,84,0)',
          type: 'slider',
          fillerColor: 'rgba(167,183,204,0.4)',
          borderColor: '#ddd',
          filterMode: 'filter',
          xAxisIndex: 0,
          start: 0,
          end: 37,
          orient: 'horizontal',
          zoomLock: true,
          left: '23%',
          bottom: '5%',
          height: 15
        }
      ];
      getRoomDetail(queryData).then(res => {
        let date = res.data.data.date;
        let data = res.data.data.data;
        let option = {
          dataZoom: dataZoom,
          color: this.colorList,
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              return params.name + '：' + params.value + '间';
            },
            backgroundColor: '#0B2047',
            borderColor: 'rgba(53, 255, 250, 0.8)',
            borderWidth: 1,
            borderRadius: 0,
            padding: 10
          },
          grid: {
            left: '20%',
            bottom: '10%',
            top: '28%',
            containLabel: true
          },
          xAxis: [
            { name: '时间',
              nameTextStyle: {
                color: '#FFFFFF' // 白 */
              },
              type: 'category',
              data: date,
              axisPointer: {
                type: 'shadow'
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  width: 1,
                  color: '#519DCC'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#FFFFFF'
                }
              }
            }
          ],
          yAxis: [
            {
              name: '预约房间数量',
              nameTextStyle: {
                color: '#FFFFFF' // 白 */
              },
              type: 'value',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  width: 1,
                  color: '#519DCC'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#FFFFFF'
                }
              },
              minInterval: 1,
              splitLine: {
                lineStyle: {
                  type: 'solid',
                  color: 'rgba(81,157,204,0.3)'
                }
              }
            }
          ],
          series: [{
            data: data,
            type: 'bar',
            barWidth: 20,
            label: {
              color: '#14B6F3', // 柱状图标签字体
              show: true,
              position: 'top',
              fontWeight: 'bold'
            },
            color: new echarts.graphic.LinearGradient(
              1, 0, 0, 1,
              [
                { offset: 0, color: 'rgba(119,255,255,1)' }, // 代表颜色坐标为0的颜色
                { offset: 1, color: 'rgba(0,122,255,1)' }
              ]
            )
          }, {
            data: data,
            type: 'line',
            color: 'rgba(0,122,255,1)',
            smooth: true,
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(0,122,255,1)' }, // 代表颜色坐标为0的颜色
                  { offset: 1, color: 'rgba(0,0,0,0.2)' }
                ]
              )
            }
          }]
        };
        myChart.setOption(option);
      });
    },
    setGrantDateStart () {
      this.initLawyerRoomDetail();
    },
    setAppointmentDate () {
      this.initAppointmentTrend();
    },
    setMeetStatisticsDate () {
      this.initMeetStatistics();
    }
  }
};
</script>

<style lang="less" scoped>
  .statistics{
    padding:20px;
    height: calc(~"100% - 178px");
    .statisticsETitle{
      display: inline-block;
      width: 60px;
      height: 290px;
      color:rgba(255,255,255,1);
      font:bold 26px/26px Microsoft YaHei;
      background: url("../../assets/images/common/titleBox.png") no-repeat;
      background-size: 100% 100%;
      writing-mode: vertical-lr;
      text-align: center;
      padding-left: 16px;
      margin: 0 50px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .content{
      display: inline-block;
      width: 50%;
      height: 100%;
      vertical-align: top;
      .item{
        height: calc(~"50% - 16px");
        width: calc(~"100% - 8px");
        background: url("../../assets/images/common/stasticBdBox.png") no-repeat;
        background-size:100% 100%;
        margin: 8px 4px;
        position: relative;
        .pieBorder{
          position: absolute;
          left:50%;
          top:50%;
          transform: translate(-50%,-50%);
          width: 270px;
          height: 270px;
          border: 1px solid #519DCC;
          border-radius: 50%;
        }
      }
    }
  }
</style>
