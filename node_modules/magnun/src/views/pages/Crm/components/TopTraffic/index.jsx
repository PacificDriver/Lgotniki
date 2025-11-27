import React from 'react'

import Progress from '../../../../../components/BaseUI/Progress'

import styles from './TopTraffic.module.scss'

export default function TopTraffic({ categories = [], dataset = [] }) {
  return (
    <div className={styles['top-traffic']}>
      {categories?.map(({ name, image, color }, index) => (
        <div key={index} className={styles['top-traffic__items']}>
          <span className={styles['top-traffic__items__image']}>
            <img src={image} alt={name} />
          </span>

          <Progress
            label={name}
            height={8}
            progress={dataset[index]}
            color={color}
            className={styles['progress']}
          />
        </div>
      ))}
    </div>
  )
}
