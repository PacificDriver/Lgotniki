import React, { useEffect, useRef, useState } from 'react'
import Chart from 'react-apexcharts'

import { translate } from '../../../../hooks/translate'
import { useFormatValue } from '../../../../hooks/useFormatValue'
import { useTheme } from '../../../../hooks/useTheme'

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
} from '../../../BaseUI/Dropdown'

import { formatLabels, formatTooltip } from './utils'

import { MdExpandMore } from 'react-icons/md'

import styles from './ApexChart.module.scss'

export default function ApexChart({
  type = '',
  width = 0,
  height = 0,
  orientation = '',
  hideYaxisLabel = false,
  fontSize,
  title = '',
  filter = [],
  defaultFilter = '',
  className = '',
  direction = 'bottom',
  alignment = 'center',
  verticalMargin = false,
  series = [],
  categories = [],
  offsetX = 0,
  offsetY = 0,
  sparkline = false,
  colors = [],
  labels = [],
  legend = false,
  roundedMarkers = false,
  padding = {},
  onSelected,
  options = {},
  typeOfInformation = '',
  placement = 'right',
}) {
  const theme = useTheme()
  const format = useFormatValue

  const chartRef = useRef(null)

  const [state, setState] = useState({
    type: type,
    width: width,
    height: height,
    orientation: orientation,
    hideYaxisLabel: hideYaxisLabel,
    fontSize: fontSize,
    title: title,
    filter: filter,
    defaultFilter: defaultFilter || translate('UI.TODAY'),
    className: className,
    direction: direction,
    alignment: alignment,
    verticalMargin: verticalMargin,
    options: {
      dataLabel: {
        enabled: false,
      },
      dataLabels: {
        enabled: false,
      },
      chart: {
        toolbar: {
          show: false,
        },
        offsetX: offsetX,
        offsetY: offsetY,
        parentHeightOffset: 0,
        sparkline: {
          enabled: sparkline,
        },
        height: '100%',
        width: '100%',
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
          labels: {
            show: false,
          },
        },
        padding: {
          top: padding?.top || 0,
          right: padding?.right !== undefined ? padding.right : 10,
          bottom: padding?.bottom || 0,
          left: padding?.left !== undefined ? padding.left : 10,
          ...options?.grid?.padding,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      legend: {
        show: legend,
        position: direction,
        horizontalAlign: alignment,
        markers: {
          width: roundedMarkers ? 10 : 12,
          height: roundedMarkers ? 10 : 12,
          radius: roundedMarkers ? 14 : 0,
          offsetX: -2,
          offsetY:
            !roundedMarkers &&
            (alignment === 'left' ||
              alignment === 'right' ||
              direction === 'left' ||
              direction === 'right')
              ? 2.5
              : roundedMarkers
                ? 1
                : -1,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      xaxis: {
        categories: categories,
        tooltip: {
          enabled: false,
        },
      },
      colors: colors || ['#403bfc'],
      ...(labels?.length && { labels: labels }),
      tooltip: {
        theme: theme,
      },
      plotOptions: {},
    },
    series: [...series],
    categories: categories,
    typeOfInformation: typeOfInformation || '',
    placement: placement,
  })

  const typesOfGraphics = {
    area: 'area',
    splineArea: 'area',
    bar: 'bar',
    barStacked: 'bar',
    basicBar: 'bar',
    multiBar: 'bar',
    line: 'line',
    pie: 'pie',
    donut: 'donut',
    scatter: 'scatter',
    bubble: 'bubble',
    heatmap: 'heatmap',
    radialBar: 'radialBar',
    basicRadial: 'radialBar',
    strokedGauge: 'radialBar',
    semiCircleGauge: 'radialBar',
  }

  const seriesTypeMap = series.reduce((acc, curr) => {
    acc[curr.name] = curr.typeOfInformation
    return acc
  }, {})

  useEffect(() => {
    setState(state => ({
      ...state,
      series: [...series],
      options: {
        ...state.options,
        xaxis: {
          ...state.options.xaxis,
          categories: categories,
        },
        yaxis: {
          ...state.options.yaxis,
          labels: {
            ...state?.options?.yaxis?.labels,
            ...formatLabels(typeOfInformation),
          },
        },
        ...formatTooltip(theme, series, seriesTypeMap),
      },
    }))
  }, [series])

  useEffect(() => {
    getOptions()

    if (
      chartRef?.current?.chart &&
      chartRef?.current?.chart?.opts?.chart?.type !== 'line'
    ) {
      chartRef.current.chart.updateOptions(
        {
          stroke: {
            colors: [theme === 'dark' ? '#293042' : '#fff'],
          },
        },
        false
      )
    }
  }, [theme])

  const getOptions = () => {
    switch (state.type) {
      case 'area':
        setState({
          ...state,
          options: { ...state.options, ...setOptionsAreaChart() },
        })
        break
      case 'splineArea':
        setState({
          ...state,
          options: { ...state.options, ...setSplineAreaChartOptions(state) },
        })
        break
      case 'bar':
        setState({
          ...state,
          options: { ...state.options, ...setBarChartOptions(state) },
        })
        break
      case 'barStacked':
        setState({
          ...state,
          options: { ...state.options, ...setStackedBarChartOptions() },
        })
        break
      case 'basicBar':
        setState({
          ...state,
          options: { ...state.options, ...setBasicBarChartOptions() },
        })
        break
      case 'multiBar':
        setState({
          ...state,
          options: { ...state.options, ...setMultiBarChartOptions() },
        })
        break
      case 'pie':
        setState({
          ...state,
          options: { ...state.options, ...setPieChartOptions() },
        })
        break
      case 'donut':
        setState({
          ...state,
          options: { ...state.options, ...setDonutChartOptions(options) },
        })
        break
      case 'strokedGauge':
        setState({
          ...state,
          options: { ...state.options, ...setStrokedGaugeChartOptions() },
        })
        break
      case 'basicRadial':
        setState({
          ...state,
          options: { ...state.options, ...setBasicRadialChartOptions(state) },
        })
        break
      case 'radialBar':
        setState({
          ...state,
          options: { ...state.options, ...setRadialChartOptions(state) },
        })
        break
      case 'semiCircleGauge':
        setState({
          ...state,
          options: {
            ...state.options,
            ...setSemiCircleGaugeChartOptions(state),
          },
        })
        break
      case 'line':
        setState({
          ...state,
          options: { ...state.options, ...setLineChartOptions(state) },
        })
        break

      default:
        break
    }
  }

  const setOptionsAreaChart = () => {
    return {
      dataLabel: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        gradient: {
          enabled: true,
          opacityFrom: 0.95,
          opacityTo: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
    }
  }

  const setSplineAreaChartOptions = state => {
    return {
      dataLabel: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      fill: {
        gradient: {
          enabled: false,
          opacityFrom: 0,
          opacityTo: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
        labels: {
          show: !state.hideYaxisLabel ? true : false,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      tooltip: {
        theme: theme,
      },
    }
  }

  const setStackedBarChartOptions = () => {
    return {
      chart: {
        stacked: true,
        stackType: 'normal',
      },
      dataLabel: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['transparent'],
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
          ...formatLabels(typeOfInformation),
        },
        forceNiceScale: true,
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
      ...formatTooltip(theme, series, seriesTypeMap),
    }
  }

  const setBasicBarChartOptions = () => {
    return {
      plotOptions: {
        bar: {
          horizontal: state.orientation === 'horizontal',
          columnWidth: '60%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      dataLabel: {
        enabled: false,
      },
      yaxis: {
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          show: true,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
          ...formatLabels(typeOfInformation),
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
    }
  }

  const setMultiBarChartOptions = () => {
    return {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      dataLabel: {
        enabled: false,
      },
      yaxis: {
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          show: true,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
    }
  }

  const setBarChartOptions = state => {
    return {
      chart: {},
      dataLabel: {
        enabled: false,
      },

      dataLabels: {
        enabled: false,
      },
      colors: ['#7860fd'],
      plotOptions: {
        bar: {
          columnWidth: '30%',
          horizontal: state?.orientation === 'horizontal' ? true : false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          show: false,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
    }
  }

  const setPieChartOptions = () => {
    return {
      chart: {},
      dataLabel: {
        enabled: false,
      },

      dataLabels: {
        enabled: false,
      },
      colors: ['#7860fd', '#85d9fe', '#e6edf8'],
      plotOptions: {},
      yaxis: {
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          show: false,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
    }
  }

  const setDonutChartOptions = options => {
    return {
      dataLabel: {
        enabled: false,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        ...options?.plotOptions,
        pie: {
          ...options?.plotOptions?.pie,
          expandOnClick: false,
          donut: {
            ...options?.plotOptions?.pie?.donut,
            labels: {
              show: true,
              value: {
                show: true,
                fontSize: '18px',
                color: theme === 'dark' ? '#a6b0cf' : '#162949',
                offsetY: 0,
                fontWeight: '600',
                formatter: value => {
                  return typeOfInformation
                    ? format(value, typeOfInformation)
                    : value
                },
                ...options?.plotOptions?.pie?.donut?.labels?.value,
              },
              total: {
                show: true,
                label: 'Total',
                color: '#6A768B',
                fontSize: '13px',
                formatter: w => {
                  const total = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)

                  return format(total, 'number')
                },
                ...options?.plotOptions?.pie?.donut?.labels?.total,
              },
            },
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          show: false,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
      },
      tooltip: {
        theme: theme,
        enabled: false,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
        ...(state?.direction === 'right' &&
          state?.alignment === 'center' && { offsetY: 30, offsetX: -20 }),
        ...(verticalMargin && {
          itemMargin: {
            vertical: verticalMargin,
          },
        }),
      },
      stroke: {
        ...options.stroke,
      },
    }
  }

  const setStrokedGaugeChartOptions = () => {
    return {
      chart: {
        offsetY: -10,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '14px',
              color: '#66718F',
              offsetY: 70,
              show: false,
            },
            value: {
              offsetY: 5,
              fontSize: '22px',
              color: '#66718F',
              formatter: function (val) {
                return val + '%'
              },
            },
          },
          hollow: {
            size: '60%',
          },
          track: {
            margin: 0,
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
      grid: {
        padding: {
          top: -5, // Reduz o espaçamento superior
          bottom: -20, // Reduz o espaçamento inferior
        },
      },
    }
  }

  const setBasicRadialChartOptions = state => {
    return {
      chart: {
        type: 'radialBar',
        offsetY: -10,
      },
      plotOptions: {
        radialBar: {
          startAngle: -180,
          endAngle: 180,
          dataLabels: {
            name: {
              fontSize: '14px',
              color: '#42516D',
              offsetY: 70,
              show: false,
            },
            value: {
              offsetY: 5,
              fontSize: state.fontSize || '22px',
              color: state.textColor || '#403bfc',
              formatter: function (val) {
                return val + '%'
              },
            },
          },
        },
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
    }
  }

  const setRadialChartOptions = () => {
    return {
      chart: {
        type: 'radialBar',
        offsetY: -10,
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function (options) {
                return options.config?.series.reduce(
                  (acumulador, valorAtual) => {
                    return acumulador + valorAtual
                  },
                  0
                )
              },
            },
          },
        },
      },
      tooltip: {
        theme: theme,
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
    }
  }

  const setSemiCircleGaugeChartOptions = () => {
    return {
      chart: {
        type: 'radialBar',
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: '#eeecff',
            strokeWidth: '97%',
            margin: 5,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: '20px',
              fontWeight: '600',
              color: theme === 'dark' ? '#a6b0cf' : '#42516D',
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      legend: {
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
      yaxis: {
        labels: {
          ...formatLabels(),
        },
      },
      ...formatTooltip(theme, series, seriesTypeMap),
    }
  }

  const setLineChartOptions = state => {
    return {
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      legend: {
        show: state.legend ? true : false,
        labels: {
          colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
        },
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
        },
        categories: state.categories,
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: !state.hideYaxisLabel,
          style: {
            fontSize: '12px',
            colors: theme === 'dark' ? '#a6b0cf' : '#66718F',
          },
          ...formatLabels(typeOfInformation),
        },
      },
      tooltip: {
        theme: theme,
        y: {
          formatter: (value, { seriesIndex }) => {
            const seriesName = series[seriesIndex].name
            const typeOfInformation = seriesTypeMap[seriesName]
            return format(value, typeOfInformation)
          },
        },
      },
    }
  }

  const handleSelection = option => {
    setState({ ...state, defaultFilter: option.name })
    onSelected?.(option.value)
  }

  return (
    <div className={`${styles['app-chart-container']} ${state.className}`}>
      {state?.title && (
        <div className={styles['app-chart-container__header']}>
          <span className={styles['title']}>{state?.title}</span>

          {state?.filter?.length > 0 && (
            <Dropdown
              trigger={
                <div className={styles['filter__dropdown']}>
                  <span>{state.defaultFilter}</span>
                  <MdExpandMore />
                </div>
              }
              placement={state?.placement}
              hideDropdownIcon={true}
            >
              <DropdownContent>
                {state.filter.map((option, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => handleSelection(option)}
                  >
                    {option.name}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          )}
        </div>
      )}

      <Chart
        ref={chartRef}
        type={typesOfGraphics[state?.type]}
        options={state?.options}
        series={state?.series}
        height={state?.height}
      />
    </div>
  )
}
