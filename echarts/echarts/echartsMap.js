import echarts from 'echarts'
import './Bmap'

import './echartsMap.scss'

function init(data, id = 'echarts-container') {
  const myChart = getChart(id)
  const option = getOptions(data)
  myChart.setOption(option)
}

function getOptions(echartsData) {
  return {
    title: {
      text: '地图',
      subtext: '别忘了请吃饭',
      sublink: '', // todo
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 5,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': {
              'color': '#044161'
            }
          },
          {
            'featureType': 'land',
            'elementType': 'all',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'boundary',
            'elementType': 'geometry',
            'stylers': {
              'color': '#064f85'
            }
          },
          {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'geometry',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#005b96',
              'lightness': 1
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'geometry',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#00508b'
            }
          },
          {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'green',
            'elementType': 'all',
            'stylers': {
              'color': '#056197',
              'visibility': 'off'
            }
          },
          {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'manmade',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'local',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'boundary',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#029fd4'
            }
          },
          {
            'featureType': 'building',
            'elementType': 'all',
            'stylers': {
              'color': '#1a5787'
            }
          },
          {
            'featureType': 'label',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }
        ]
      }
    },
    series: [
      {
        name: 'pm2.5',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: echartsData,
        symbolSize: function () {
          return 4
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: '#ddb926',
            shadowBlur: 10,
          }
        },
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke'
        }
      },
    ]
  }
}

function getChart(id) {
  let container = document.getElementById(id)
  if (!container) {
    container = document.createElement('div')
    container.id = id
    document.body.appendChild(container)
  }
  return echarts.init(container)
}

export default {
  init
}
