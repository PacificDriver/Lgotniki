import React from 'react'
import useCurrency from '../../../hooks/useCurrency'

export default function Money({ value, styles, className }) {
  return (
    <div style={styles} className={className}>
      {useCurrency(value)}
    </div>
  )
}
