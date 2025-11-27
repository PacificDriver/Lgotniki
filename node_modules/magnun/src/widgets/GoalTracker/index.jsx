import React from 'react'

import { useFormatValue } from '../../hooks/useFormatValue'

import CardContainer from '../../components/CustomUI/CardContainer'
import ApexChart from '../../components/CustomUI/Charts/ApexChart'

import styles from './GoalTracker.module.scss'

export default function GoalTracker({
  title = '',
  description = '',
  dataset = {},
  colors = '',
}) {
  const formatValue = useFormatValue

  const getProgress = () => {
    const progress = (dataset.series?.values[0] / dataset.series?.target) * 100

    return formatValue(progress, 'percentage')
  }

  return (
    <CardContainer title={title} className={styles['goal-tracker']}>
      <div>
        <ApexChart
          type="donut"
          categories={dataset.categories}
          labels={dataset.categories}
          series={dataset.series?.values}
          height={110}
          colors={colors}
          options={{
            plotOptions: {
              pie: {
                donut: {
                  size: '80%',
                  labels: {
                    total: {
                      fontSize: '11px',
                      fontWeight: '500',
                      formatter: () => {
                        return `${getProgress()}`
                      },
                    },
                    value: {
                      fontSize: '16px',
                      offsetY: -4,
                    },
                  },
                },
              },
            },
          }}
          className={styles['goal-tracker__chart']}
        />
      </div>

      <div className={styles['goal-tracker__infos']}>
        <div>
          <span className={styles['value']}>
            {formatValue(dataset.series.values[0], 'number')}
          </span>
          <span className={styles['target']}>
            / {formatValue(dataset.series.target, 'number')}
          </span>
        </div>

        <div className={styles['description']}>{description}</div>
      </div>
    </CardContainer>
  )
}
