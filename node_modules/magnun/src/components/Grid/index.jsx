import React from 'react'
import './Grid.scss'

const GridContainer = ({ fluid, children }) => (
  <div className={fluid ? 'grid-container-fluid' : 'grid-container'}>
    {children}
  </div>
)

const GridItem = ({ xs, sm, md, lg, xl, children, style }) => {
  const getClasses = () => {
    let classes = []

    if (xs) classes.push(`grid-xs-${xs}`)
    if (sm) classes.push(`grid-sm-${sm}`)
    if (md) classes.push(`grid-md-${md}`)
    if (lg) classes.push(`grid-lg-${lg}`)
    if (xl) classes.push(`grid-xl-${xl}`)

    return classes.join(' ')
  }

  return (
    <div className={`grid-item ${getClasses()}`} style={style}>
      {children}
    </div>
  )
}

export { GridContainer, GridItem }
