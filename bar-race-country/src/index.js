import * as echarts from 'echarts';
import axios from 'axios';

let ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';

let chartDom = document.getElementById('chart-panel');
let myChart = echarts.init(chartDom);
let option;

let updateFrequency = 2000;
let dimension = 0;

let countryColors = { "Australia": "#00008b", "Canada": "#f00", "China": "#ffde00", "Cuba": "#002a8f", "Finland": "#003580", "France": "#ed2939", "Germany": "#000", "Iceland": "#003897", "India": "#f93", "Japan": "#bc002d", "North Korea": "#024fa2", "South Korea": "#000", "New Zealand": "#00247d", "Norway": "#ef2b2d", "Poland": "#dc143c", "Russia": "#d52b1e", "Turkey": "#e30a17", "United Kingdom": "#00247d", "United States": "#b22234" };

axios.all([
    axios.get('https://cdn.jsdelivr.net/npm/emoji-flags@1.3.0/data.json'),
    axios.get(ROOT_PATH + '/data/asset/data/life-expectancy-table.json')
]).then(function ([res0, res1]) {
    let flags = res0.data; console.log(flags);
    let data = res1.data; console.log(data);
    let years = [];
    for (let i = 0; i < data.length; ++i) {
        if (years.length === 0 || years[years.length - 1] !== data[i][4]) {
            years.push(data[i][4]);
        }
    }

    // ?
    let startIndex = 10;
    let startYear = years[startIndex];

    /**
     * @type {echarts.EChartsOption}
     */
    let option = {
        xAxis: {},
        dataset: {
            source: data.slice(1).filter(function (d) {
                return d[4] === startYear;
            })
        },
        yAxis: {
            type: "category",
            inverse: true,
            // max: 10,
            axisLabel: {
                show: true,
                fontSize: 14,
                rich: {
                    flag: {
                        fontSize: 25,
                        padding: 5
                    }
                }
            }
        },
        series: [{
            realtimeSort: true,
            seriesLayoutBy: 'column',
            type: 'bar',
            itemStyle: {
                color: function (param) {
                    return countryColors[param.value[3]] || '#5470c6'
                }
            },
            // label: {
            //     show: true,
            //     position: 'right'
            // }
        }]
    }

    myChart.setOption(option)
})
