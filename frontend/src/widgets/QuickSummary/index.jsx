import React from 'react'

import CardContainer from '../../components/CustomUI/CardContainer'
import Progress from '../../components/BaseUI/Progress'

import styles from './QuickSummary.module.scss'

export default function QuickSummary({
  title = '',
  filters = [],
  categories = [],
  dataset = [],
  onFiltered,
  isBold = true,
}) {
  return (
    <CardContainer
      title={title}
      filters={filters}
      onFiltered={value => onFiltered?.(value)}
      className={styles['quick-summary']}
    >
      {categories?.map(({ name, image, color }, index) => (
        <div key={index} className={styles['quick-summary__items']}>
          <span className={styles['quick-summary__items__image']}>
            <img src={image} alt={name} />
          </span>

          <Progress
            label={name}
            height={8}
            progress={dataset[index]}
            color={color}
            className={`${styles['progress']} ${isBold && styles['progress--bold']}`}
          />
        </div>
      ))}
    </CardContainer>
  )
}
