import React from 'react'

export default function ContainerItem({
  children,
  sm,
  md,
  xl,
  padding,
  margin,
  className = '',
  onClick,
  onDoubleClick,
}) {
  const classes = [
    sm && `sm-${sm}`,
    md && `md-${md}`,
    xl && `xl-${xl}`,
    padding && padding,
    margin && margin,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={classes}
      onClick={() => onClick?.()}
      onDoubleClick={() => onDoubleClick?.()}
    >
      {children}
    </div>
  )
}
