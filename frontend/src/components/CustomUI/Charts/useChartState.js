import { useState, useEffect } from 'react'

const useChartState = (props, theme) => {
  const [state, setState] = useState({
    type: props.type,
    width: props.width,
    height: props.height,
    orientation: props.orientation,
    hideYaxisLabel: props.hideYaxisLabel,
    fontSize: props.fontSize,
    title: props.title,
    filter: props.filter,
    defaultFilter: props.defaultFilter || 'UI.TODAY',
    className: props.className,
    direction: props.direction,
    alignment: props.alignment,
    verticalMargin: props.verticalMargin,
    options: {
      chart: {
        id: 'app-charts',
        toolbar: { show: false },
        offsetX: props.offsetX || 0,
        offsetY: props.offsetY || 0,
        parentHeightOffset: 0,
        sparkline: { enabled: !!props.sparkline },
      },
      grid: {
        xaxis: { lines: { show: false } },
        yaxis: {
          lines: { show: false },
          labels: { show: false },
        },
        padding: {
          top: props?.padding?.top || 0,
          right: props?.padding?.right || 0,
          bottom: props?.padding?.bottom || 0,
          left: props?.padding?.left || 0,
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
        show: props.legend || false,
        position: props.direction || 'bottom',
        horizontalAlign: props.alignment || 'center',
        markers: {
          width: props.roundedMarkers ? 10 : 14,
          height: props.roundedMarkers ? 10 : 14,
          radius: props.roundedMarkers ? 14 : 0,
          offsetX: -2,
          offsetY:
            !props.roundedMarkers &&
            (props.alignment === 'left' ||
              props.alignment === 'right' ||
              props.direction === 'left' ||
              props.direction === 'right')
              ? 2.5
              : props.roundedMarkers
                ? 1
                : -1,
        },
      },
      colors: props.colors || ['#403bfc'],
      labels: props.labels || [],
      tooltip: { theme },
      ...props.options,
    },
    series: Array.isArray(props.series) ? [...props.series] : [],
  })

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      options: {
        ...prevState.options,
        tooltip: { theme },
      },
    }))
  }, [theme])

  return [state, setState]
}

export default useChartState
