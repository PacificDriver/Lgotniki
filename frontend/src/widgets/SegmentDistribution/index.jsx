import React, { useCallback, useEffect, useState } from 'react'

import { useFormatValue } from '../../hooks/useFormatValue'
import { calculatePercentageChange } from '../../utils/utils'

import CardContainer from '../../components/CustomUI/CardContainer'
import ApexChart from '../../components/CustomUI/Charts/ApexChart'

import ChangeIndicator from '../../components/CustomUI/ChangeIndicator'
import styles from './SegmentDistribution.module.scss'

export default function SegmentDistribution({
  title = '',
  dataset = {},
  colors = [],
}) {
  const [chartData, setChartData] = useState([])

  const formatValue = useFormatValue

  const processDataset = useCallback(() => {
    const data = []
    const { currentValue = [], previousValue = [] } =
      dataset?.series?.data || {}

    dataset?.categories?.forEach((category, index) => {
      data.push({
        label: category,
        currentValue: currentValue[index] || 0,
        previousValue: previousValue[index] || 0,
      })
    })

    return data
  }, [dataset])

  useEffect(() => {
    setChartData(processDataset())
  }, [dataset, processDataset])

  return (
    <CardContainer title={title} className={styles['segment-distribution']}>
      <ApexChart
        type="donut"
        categories={dataset.categories}
        labels={dataset.categories}
        series={dataset.series?.data?.currentValue}
        height={180}
        colors={colors}
        className={styles['segment-distribution__chart']}
        options={{
          plotOptions: {
            pie: {
              donut: {
                size: '75%',
              },
            },
          },
        }}
        typeOfInformation={dataset.typeOfInformation || ''}
      />

      <div className={styles['segment-distribution__data']}>
        {chartData?.map((data, index) => {
          const percentageChange = calculatePercentageChange(
            data.currentValue,
            data.previousValue
          )
          const isNegative = percentageChange < 0

          return (
            <div key={index} className={styles['items']}>
              <div className={styles['items__label']}>
                <div
                  className={styles['rectangle']}
                  style={{ backgroundColor: colors[index] }}
                ></div>
                <div className={styles['value']}>{data?.label}</div>
              </div>

              <div className={styles['items__value']}>
                {formatValue(data?.currentValue, 'number')}

                <ChangeIndicator
                  value={formatValue(percentageChange, 'percentage', 1)}
                  change={isNegative ? -1 : 1}
                  compact
                />
              </div>
            </div>
          )
        })}
      </div>
    </CardContainer>
  )
}
