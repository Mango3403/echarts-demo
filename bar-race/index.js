import * as echarts from 'echarts';

let themeEC4 = {
  color: [
      '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83',
      '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'
  ]
};

let myDom = document.getElementById('main');
let myChart = echarts.init(myDom, themeEC4);
let option;

let data = [];
for (let i = 0; i < 5; ++i) {
  data.push(Math.round(Math.random() * 200));
}

option = {
  xAxis: {
    max: 'dataMax'
  },
  yAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E'],
    inverse: true,
    animationDuration: 300,
    animationDurationUpdate: 300,
    max: 2 // only the largest 4 bars will be displayed
  },
  series: [{
    realtimeSort: true, // transition animation
    type: 'bar',
    data: data,
    name: 'X',
    label: {
      show: true,
      position: 'right',
      valueAnimation: true // transition animation
    }
  }],
  // legend: {
  //   show: true
  // },
  animationDuration: 0,
  animationDurationUpdate: 3000,
  animationEasing: 'linear',
  animationEasingUpdate: 'linear',
}

function run() {
  if (option) {
    let data = option.series[0].data;
    for (let i = 0; i < data.length; ++i) {
      if (Math.random() > 0.9) {
        data[i] += Math.round(Math.random() * 2000)
      } else {
        data[i] += Math.round(Math.random() * 200)
      }
    }
    console.log(data);
    myChart.setOption(option);
  }
}

setTimeout(function () {
  run();
}, 0);
setInterval(function () {
  run();
}, 3000)

option && myChart.setOption(option);
