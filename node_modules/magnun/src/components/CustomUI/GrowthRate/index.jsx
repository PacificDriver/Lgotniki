import React, { useState, useEffect } from 'react'

import { MdOutlineTrendingDown } from 'react-icons/md'
import { MdOutlineTrendingUp } from 'react-icons/md'

import './style.scss'

export default function GrowthRate({ currentValue, previousValue }) {
  const [percentage, setPercentage] = useState(0)

  const calculatePercentage = (currentValue, previousValue) => {
    const profit = currentValue - previousValue

    const percentage = ((profit / currentValue) * 100).toFixed(2)

    return {
      textPercentage: percentage > 0 ? `+${percentage}%` : `${percentage}%`,
      percentage: parseFloat(percentage),
    }
  }

  useEffect(() => {
    setPercentage(calculatePercentage(currentValue, previousValue).percentage)
  }, [currentValue, previousValue])

  return (
    <div className="growth-rate-container">
      <div className="growth-rate-container__rate">
        <span
          className={`${percentage > 0 ? 'growth-rate-container__rate--positive' : 'growth-rate-container__rate--negative'} d-flex align-items-center`}
        >
          <span className="d-flex">
            {percentage < 0 ? (
              <MdOutlineTrendingDown />
            ) : (
              <MdOutlineTrendingUp />
            )}
          </span>
          <span className="ml-2">{percentage}%</span>
        </span>
      </div>
    </div>
  )
}
