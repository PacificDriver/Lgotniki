import React, { useEffect, useState } from 'react'

import AvatarGroup from '../../components/BaseUI/AvatarGroup'
import CardContainer from '../../components/CustomUI/CardContainer'

import ChangeIndicator from '../../components/CustomUI/ChangeIndicator'
import { useFormatValue } from '../../hooks/useFormatValue'
import { calculatePercentageChange } from '../../utils/utils'
import styles from './ProgressIndicator.module.scss'

export default function ProgressIndicator({
  title = '',
  description = '',
  currentValue = 0,
  previousValue = 0,
  color = '',
  users = [],
  userLimit = 2,
}) {
  const [percentage, setPercentage] = useState({
    textValue: '0%',
    value: 0,
  })

  const formatValue = useFormatValue

  useEffect(() => {
    const percentage = calculatePercentageChange(currentValue, previousValue)

    setPercentage({
      textValue: formatValue(percentage, 'percentage'),
      value: percentage,
    })
  }, [currentValue, previousValue])

  return (
    <CardContainer title={title} className={styles['progress-indicator']}>
      <div className={styles['progress-indicator__header']}>
        <div className={styles['info']}>
          <span className={styles['info__value']}>
            {formatValue(currentValue, 'percentage')}
          </span>

          <ChangeIndicator
            value={percentage.textValue}
            change={percentage.value}
          />
        </div>

        <AvatarGroup data={users} max={userLimit} />
      </div>

      <div className={styles['progress-indicator__bars']}>
        <div
          className={styles['bar']}
          style={{ backgroundColor: color, width: `${currentValue}%` }}
        ></div>
      </div>

      <div className={styles['progress-indicator__description']}>
        {description}
      </div>
    </CardContainer>
  )
}
