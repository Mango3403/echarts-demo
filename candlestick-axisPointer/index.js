import * as echarts from 'echarts';
import axios from 'axios';

let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';

let chartDom = document.getElementById('main');
let myChart = echarts.init(chartDom);
let option;

function splitData(rawData) {
  let categoryData = [];
  let values = [];
  let volumns = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
    volumns.push(rawData[i][4]);
  }
  return {
    categoryData: categoryData,
    values: values,
    volumns: volumns,
  }
}

function calculateMA(dayCount, data) {
  let result = [];
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

axios.get(ROOT_PATH + '/data/asset/data/stock-DJI.json').then(function (res) {
  let rawData = res.data;
  console.log(rawData);
  let data = splitData(rawData);
  console.log(data);

  option = {
    animation: false,
    legend: {
      bottom: 10,
      left: 'center',
      data: ['MA5', 'MA10']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      position: function (pos, params, el, elRect, size) {
        let obj = { top: 10, left: 10 };
        // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
      extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: {
        xAxisIndex: 'all'
      },
      label: {
        backgroundColor: '#777'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false
        },
        brush: {
          type: ['clear']
        }
      }
    },
    // brush: {
    //   xAxisIndex: 'all',
    //   brushLink: 'all',
    //   outOfBrush: {
    //     colorAlpha: 0.1
    //   }
    // },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '50%'
      },
      {
        left: '10%',
        right: '8%',
        bottom: '20%',
        height: '15%'
      }
    ],
    // visualMap: [{
    //   type: 'continuous',
    //   seriesIndex: 0,
    //   min: 6000,
    //   max: 20000,
    // }],
    xAxis: [
      {
        type: 'category',
        data: data.categoryData,
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
        }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: data.categoryData,
        scale: true,
        boundaryGap: false,
        axisLabel: { show: false },
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax',
        // 磁吸值功能
        // axisPointer: {
        //   label: {
        //     formatter: function (params) {
        //       var seriesValue = (params.seriesData[0] || {}).value;
        //       return params.value
        //         + (seriesValue != null
        //           ? '\n' + echarts.format.addCommas(seriesValue)
        //           : ''
        //         );
        //     }
        //   }
        // }
      }
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
        }
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 98,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        xAxisIndex: [0, 1],
        top: '85%',
        start: 98,
        end: 100
      }
    ],
    series: [
      // {
      //   type: 'candlestick',
      //   data: data.values,
      //   itemStyle: {
      //     normal: {
      //       color: '#06B800',
      //       color0: '#FA0000',
      //       borderColor: null,
      //       borderColor0: null
      //     }
      //   },
      //   tooltip: {
      //     formatter: function (param) {
      //       param = param[0];
      //       return [
      //         'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
      //         'Open: ' + param.data[0] + '<br/>',
      //         'Close: ' + param.data[1] + '<br/>',
      //         'Lowest: ' + param.data[2] + '<br/>',
      //         'Highest: ' + param.data[3] + '<br/>'
      //       ].join('');
      //     }
      //   }
      // },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5
        }
      },
      {
        name: 'Volumn',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumns
      }
    ]
  };

  myChart.setOption(option);
});
