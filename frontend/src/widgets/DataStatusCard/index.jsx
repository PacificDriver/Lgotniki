import React from 'react'

import { useFormatValue } from '../../hooks/useFormatValue'

import CardContainer from '../../components/CustomUI/CardContainer'

import { FaSquare } from 'react-icons/fa6'

import styles from './DataStatusCard.module.scss'

export default function DataStatusCard({
  title = '',
  subtitles = {},
  dataset = [],
}) {
  const formatValue = useFormatValue

  const total = dataset?.values?.reduce((acc, value) => acc + value, 0)

  const handleWidthPercentage = value => {
    const percentage = (value / total) * 100

    return percentage?.toFixed(2)
  }

  return (
    <CardContainer className={styles['data-status-card']} title={title}>
      <div className={styles['data-status-card__header']}>
        <div className={styles['info']}>
          <div className={styles['info__title']}>{subtitles?.labels?.[0]}</div>
          <div className={styles['info__value']}>
            {formatValue(
              subtitles.values[0]?.value,
              subtitles?.values[0]?.typeOfInformation,
              subtitles?.values?.[0]?.precision
            )}
          </div>
        </div>

        <div className={styles['info']}>
          <div className={styles['info__title']}>{subtitles?.labels?.[1]}</div>
          <div className={styles['info__value']}>
            {formatValue(
              subtitles.values[1]?.value,
              subtitles?.values[1]?.typeOfInformation,
              subtitles?.values?.[1]?.precision
            )}
          </div>
        </div>
      </div>

      <div className={styles['data-status-card__chart']}>
        <div className={styles['bars']}>
          {dataset?.values?.map((value, index) => (
            <div
              key={index}
              style={{
                width: `${handleWidthPercentage(value)}%`,
                backgroundColor: `${dataset?.colors[index]}`,
              }}
              className={styles['bars__bar']}
            >
              <div className={styles['tooltip']}>
                <span>{dataset.categories[index]}</span>
                <span>{formatValue(value, dataset?.typeOfInformation)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles['labels']}>
          {dataset?.categories?.map((value, index) => (
            <div key={index} className={styles['labels__label']}>
              <FaSquare style={{ color: dataset?.colors[index] }} />

              {value}
            </div>
          ))}
        </div>
      </div>
    </CardContainer>
  )
}
