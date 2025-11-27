import React from 'react'
import CardContainer from '../../components/CustomUI/CardContainer'
import styles from './MetricOverview.module.scss'
import { useFormatValue } from '../../hooks/useFormatValue'

const BarChart = ({ dataset = [], color, maxValue, formatValue }) => {
  const handleHeightPercentage = value => {
    if (!value || maxValue === 0) return 0
    return ((value / maxValue) * 100).toFixed(2)
  }

  return (
    <div className={styles['metric-overview__chart']}>
      <div className={styles['bars']}>
        {dataset?.values?.data?.map((value, index) => (
          <div
            key={index}
            style={{
              height: `${handleHeightPercentage(value)}%`,
              backgroundColor: color,
            }}
            className={styles['bars__bar']}
          >
            {handleHeightPercentage(value) > 1 && (
              <div className={styles['tooltip']}>
                <span>{dataset.categories[index]}</span>
                <span>
                  {formatValue(value, dataset?.values?.typeOfInformation, 2)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles['labels']}>
        {dataset?.categories?.map((category, index) => (
          <div key={index} className={styles['labels__label']}>
            {category}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MetricOverview({
  title = '',
  description,
  value = 0,
  dataset = [],
  color = '',
}) {
  const formatValue = useFormatValue

  const maxValue = Math.max(...(dataset?.values?.data || [0]))

  const formattedValue = formatValue(value?.amount, value?.typeOfInformation)

  return (
    <CardContainer title={title} className={styles['metric-overview']}>
      <div className={styles['metric-overview__infos']}>
        <div
          className={`${styles['metric-overview__infos__value']} ${
            value?.typeOfInformation === 'money' &&
            styles['metric-overview__infos__value--money']
          }`}
        >
          {formattedValue}
        </div>
        <div
          className={styles['metric-overview__infos__description']}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <BarChart
        dataset={dataset}
        color={color}
        maxValue={maxValue}
        formatValue={formatValue}
      />
    </CardContainer>
  )
}
