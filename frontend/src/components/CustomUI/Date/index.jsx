import React from 'react'

import useDateFormat from '../../../hooks/useDateFormat'

export default function Date({ value }) {
  return <>{useDateFormat(value)}</>
}
