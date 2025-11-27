import React from 'react'

import { useFormatValue } from '../../hooks/useFormatValue'

import CardContainer from '../../components/CustomUI/CardContainer'
import ChangeIndicator from '../../components/CustomUI/ChangeIndicator'

import styles from './FunnelConversion.module.scss'

export default function FunnelConversion({ title = '', metrics = [] }) {
  const formatValue = useFormatValue

  const total = metrics?.reduce((acc, metric) => acc + metric.currentValue, 0)

  const handleWidthPercentage = value => {
    if (total === 0) return 0
    return (value / total) * 100
  }

  const calculateChange = (currentValue, previousValue) => {
    return currentValue - previousValue
  }

  return (
    <CardContainer className={styles['funnel-conversion']} title={title}>
      <div className={styles['funnel-conversion__bars']}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            style={{
              width: `${handleWidthPercentage(metric.currentValue)}%`,
              backgroundColor: `${metric.color}`,
            }}
            className={styles['funnel-conversion__bars__bar']}
          ></div>
        ))}
      </div>

      <div className={styles['funnel-conversion__legend']}>
        {metrics.map((metric, index) => {
          const percentageOfTotal = handleWidthPercentage(metric.currentValue)
          const changeInValue = calculateChange(
            metric.currentValue,
            metric.previousValue
          )

          return (
            <div key={index} className={styles['metric']}>
              <div className={styles['metric__data']}>
                <span className={styles['conversion-rate']}>
                  <span
                    className={styles['conversion-rate__rectangle']}
                    style={{ backgroundColor: metric.color }}
                  ></span>
                  <span className={styles['conversion-rate__value']}>
                    {formatValue(percentageOfTotal, 'percentage', 1)}
                  </span>
                </span>

                <ChangeIndicator
                  value={formatValue(Math.abs(changeInValue), 'number', 0)}
                  change={changeInValue}
                  compact
                />
              </div>

              <div className={styles['metric__label']}>
                <span>{formatValue(metric.currentValue, 'number', 0)}</span>
                <span>{metric.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </CardContainer>
  )
}
