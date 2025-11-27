import React from 'react'

import { useFormatValue } from '../../hooks/useFormatValue'

import CardContainer from '../../components/CustomUI/CardContainer'
import ChangeIndicator from '../../components/CustomUI/ChangeIndicator'

import styles from './TopListOverview.module.scss'

export default function TopListOverview({
  title = '',
  description = '',
  dataset = {},
  colors = [],
  values = {},
}) {
  const formatValue = useFormatValue

  const handleWidthPercentage = (value, values) => {
    const total = values?.reduce((acc, value) => acc + value, 0)

    if (total === 0) return 0

    return (value / total) * 100
  }

  return (
    <CardContainer title={title} className={styles['top-list-overview']}>
      <div className={styles['top-list-overview__header']}>
        <div
          className={`${styles['value']} ${values?.typeOfInformation === 'money' && styles['value--money']}`}
        >
          <div className={styles['value__label']}>
            {formatValue(values?.current, values?.typeOfInformation)}
          </div>
          <ChangeIndicator
            value={formatValue(15241, values?.typeOfInformation)}
            change={values?.current - values?.previous}
          />
        </div>
        <p className={styles['description']}>{description}</p>
      </div>

      <div className="d-flex flex-column gap-1">
        {dataset?.data?.map((item, index) => (
          <div key={index} className={styles['top-list-overview__content']}>
            <div className={styles['labels']}>
              <img src={item?.image} alt="" width={20} />
              <span>{item?.label}</span>
            </div>

            <div className={styles['bars']}>
              {item?.values?.map((value, index) => {
                const width = handleWidthPercentage(value, item.values)

                return (
                  <div
                    key={index}
                    style={{
                      width: `${width}%`,
                      backgroundColor: colors[index],
                    }}
                    className={styles['bars__bar']}
                  >
                    <div className={styles['tooltip']}>
                      <span>{dataset.categories[index]}</span>
                      <span>{formatValue(value, 'money', 2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </CardContainer>
  )
}
