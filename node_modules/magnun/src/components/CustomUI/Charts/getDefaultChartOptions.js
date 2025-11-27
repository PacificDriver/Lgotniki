export function getDefaultChartOptions(theme) {
  return {
    dataLabel: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      gradient: {
        enabled: true,
        opacityFrom: 0.95,
        opacityTo: 0,
      },
    },
    dataLabels: { enabled: false },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '14px',
          colors: theme === 'dark' ? '#a6b0cf' : '#42516D',
        },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          fontSize: '14px',
          colors: theme === 'dark' ? '#a6b0cf' : '#42516D',
        },
      },
    },
    tooltip: { theme: theme },
    legend: {
      labels: {
        colors: theme === 'dark' ? '#a6b0cf' : '#475467',
      },
    },
  }
}
