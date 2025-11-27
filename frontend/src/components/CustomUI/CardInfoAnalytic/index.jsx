import React, { useState, useEffect } from 'react'
import { useFormatValue } from '../../../hooks/useFormatValue'

import ApexChart from '../Charts/ApexChart'

import styles from './CardInfoAnalytic.module.scss'
import ChangeIndicator from '../ChangeIndicator'

export default function CardInfoAnalytic({ values }) {
  const formatValue = useFormatValue

  const [percentage, setPercentage] = useState({
    textPercentage: '0%',
    value: 0,
  })

  useEffect(() => {
    calculatePercentage()
  }, [values])

  const calculatePercentage = () => {
    const profit = values.currentValue - values.previousValue
    const percentage = ((profit / values.currentValue) * 100).toFixed(2)

    setPercentage({
      textPercentage: formatValue(parseFloat(percentage), 'percentage', 2),
      value: percentage,
    })
  }

  return (
    <div className={styles['card-info-container']}>
      <div className={styles['card-info-container__analytic']}>
        <div className={styles['card-info-container__analytic__header']}>
          <div
            className={styles['card-info-container__analytic__header--title']}
            title={values.title}
          >
            {values.title}
          </div>

          <ChangeIndicator
            value={percentage.textPercentage}
            change={percentage.value}
            compact
          />
        </div>

        <div className={styles['card-info-container__analytic__chart']}>
          <div
            className={styles['card-info-container__analytic__chart--value']}
          >
            {formatValue(values?.currentValue, values?.type)}
          </div>

          <ApexChart
            type={values?.chart || 'basicBar'}
            options={values.values}
            series={values.series}
            legend={false}
            hideYaxisLabel={true}
            height={90}
            colors={values.colors}
            sparkline={true}
            offsetY={55}
            className={
              styles['card-info-container__analytic__chart--reset-style']
            }
            padding={{ left: 0, right: 0 }}
          />
        </div>
      </div>
    </div>
  )
}
