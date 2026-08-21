import type { ChartConfiguration } from 'chart.js';

export const CHART_CONFIG: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: new Date().getFullYear().toString(),
        backgroundColor: '#ed64a6',
        borderColor: '#ed64a6',
        data: [30, 78, 56, 34, 100, 45, 13],
        fill: false,
        barThickness: 8
      },
      {
        label: (new Date().getFullYear() - 1).toString(),
        fill: false,
        backgroundColor: '#4c51bf',
        borderColor: '#4c51bf',
        data: [27, 68, 86, 74, 10, 4, 87],
        barThickness: 8
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Orders Chart'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      legend: {
        title: {
          color: 'rgba(0,0,0,.4)'
        },
        align: 'end',
        position: 'bottom'
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        display: false,
        title: {
          display: true,
          text: 'Month'
        },
        grid: {
          borderDash: [2],
          borderDashOffset: 2,
          color: 'rgba(33, 37, 41, 0.3)',
          tickColor: 'rgba(33, 37, 41, 0.3)',
          tickBorderDash: [2],
          tickBorderDashOffset: 2
        }
      },
      y: {
        display: true,
        title: {
          display: false,
          text: 'Value'
        },
        grid: {
          borderDash: [2],
          drawTicks: false,
          borderDashOffset: 2,
          color: 'rgba(33, 37, 41, 0.2)',
          tickColor: 'rgba(33, 37, 41, 0.15)',
          tickBorderDash: [2],
          tickBorderDashOffset: 2
        }
      }
    }
  }
};
