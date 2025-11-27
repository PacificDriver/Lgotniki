import React from 'react'

import { useFormatValue } from '../../../hooks/useFormatValue'

import styles from './CardInfo.module.scss'
import ChangeIndicator from '../ChangeIndicator'

export default function CardInfo({ card, appearance }) {
  const format = useFormatValue

  return (
    <div className={styles['card-info-container']}>
      <div className={styles['card-info-container__item']}>
        <div className="d-flex align-items-center">
          {card.icon && (
            <div
              className={`${styles['card-info-container__item--icon']} ${styles[`card-info-container__item--icon--${appearance || 'primary'}`]}`}
            >
              {card.icon}
            </div>
          )}

          <div
            className={styles['card-info-container__item--title']}
            title={card?.title}
          >
            {card.title}
          </div>
        </div>

        <div className={styles['card-info-container__item__content']}>
          <div className={styles['card-info-container__item__content--value']}>
            {format(card?.value, card?.type, card?.decimals)}
          </div>

          {card?.percentage && (
            <ChangeIndicator
              value={format(card.percentage, 'percentage', 1)}
              change={card.percentage}
            />
          )}
        </div>
      </div>
    </div>
  )
}
