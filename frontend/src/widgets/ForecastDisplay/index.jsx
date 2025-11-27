import React from 'react'

import { useFormatValue } from '../../hooks/useFormatValue'

import CardContainer from '../../components/CustomUI/CardContainer'
import ApexChart from '../../components/CustomUI/Charts/ApexChart'

import styles from './ForecastDisplay.module.scss'

export default function ForecastDisplay({
  title = '',
  description,
  value = 0,
  dataset = [],
}) {
  const formatValue = useFormatValue

  const formattedValue = formatValue(value?.amount, value?.typeOfInformation)

  const typeOfInformation = dataset.series.every(
    item => item?.typeOfInformation === dataset.series[0]?.typeOfInformation
  )

  return (
    <CardContainer title={title} className={styles['forecast-display']}>
      <div className={styles['forecast-display__infos']}>
        <div
          className={`${styles['forecast-display__infos__value']} ${
            value?.typeOfInformation === 'money' &&
            styles['forecast-display__infos__value--money']
          }`}
        >
          {formattedValue}
        </div>
        <div
          className={styles['forecast-display__infos__description']}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <ApexChart
        type="basicBar"
        categories={dataset?.categories}
        series={dataset?.series}
        colors={['#89cc93', '#ffb713']}
        height={200}
        className={styles['forecast-display__chart']}
        typeOfInformation={
          typeOfInformation ? dataset.series[0]?.typeOfInformation : ''
        }
      />
    </CardContainer>
  )
}
