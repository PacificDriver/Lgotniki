import React, { useEffect, useState } from 'react'

import useCSSVariables from '../../hooks/useCSSVariables'
import { useFormatValue } from '../../hooks/useFormatValue'

import CardContainer from '../../components/CustomUI/CardContainer'
import ApexChart from '../../components/CustomUI/Charts/ApexChart'

import ChangeIndicator from '../../components/CustomUI/ChangeIndicator'
import { calculatePercentageChange } from '../../utils/utils'
import styles from './StatisticalOverviewCard.module.scss'

export default function StatisticalOverviewCard({
  title = '',
  subtitles = {},
  dataset = [],
  chartHeight = null,
}) {
  useCSSVariables({
    'first-label-color': subtitles?.colors?.[0],
    'second-label-color': subtitles?.colors?.[1],
  })

  const [percentages, setPercentages] = useState({})
  const [chartData, setChartData] = useState({})

  const formatValue = useFormatValue

  useEffect(() => {
    const { currentValue, previousValue } = subtitles?.values ?? {}

    setPercentages({
      first: calculatePercentageChange(currentValue?.[0], previousValue?.[0]),
      second: calculatePercentageChange(currentValue?.[1], previousValue?.[1]),
    })
  }, [subtitles])

  useEffect(() => {
    const typeOfInformation = dataset.series.every(
      item => item?.typeOfInformation === dataset.series[0]?.typeOfInformation
    )

    setChartData({
      categories: dataset?.categories,
      series: dataset.series,
      colors: subtitles?.colors,
      typeOfInformation: typeOfInformation
        ? dataset.series[0]?.typeOfInformation
        : '',
    })
  }, [subtitles, dataset])

  return (
    <CardContainer
      title={title}
      className={styles['statistical-overview-card']}
    >
      <div className={styles['statistical-overview-card__header']}>
        <div className={styles['info']}>
          <div className={styles['info__label']}>{subtitles?.labels?.[0]}</div>
          <div className={styles['info__value']}>
            <span>
              {formatValue(
                subtitles?.values?.currentValue?.[0],
                dataset?.series?.[0]?.typeOfInformation
              )}
            </span>

            <ChangeIndicator
              value={formatValue(percentages?.first, 'percentage', 1)}
              change={percentages?.first}
            />
          </div>
        </div>

        <div className={styles['info']}>
          <div className={styles['info__label']}>{subtitles?.labels?.[1]}</div>
          <div className={styles['info__value']}>
            <span>
              {formatValue(
                subtitles?.values?.currentValue?.[1],
                dataset?.series?.[1]?.typeOfInformation
              )}
            </span>
            <ChangeIndicator
              value={formatValue(percentages?.second, 'percentage', 1)}
              change={percentages?.second}
            />
          </div>
        </div>
      </div>

      <div>
        <ApexChart
          type="basicBar"
          categories={chartData?.categories}
          series={chartData?.series}
          colors={['#89cc93', '#ffb713']}
          height={chartHeight ? chartHeight : 215}
          className={styles['statistical-overview-card__chart']}
          typeOfInformation={chartData?.typeOfInformation}
        />
      </div>
    </CardContainer>
  )
}
