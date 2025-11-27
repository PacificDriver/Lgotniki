import React from 'react'

export default function ButtonGroup({
  placement,
  children,
  reverse,
  appearance,
}) {
  const reversedChildren =
    Array.isArray(children) && reverse ? [...children].reverse() : children

  const childrenWithProps = React.Children.map(reversedChildren, child =>
    React.cloneElement(child, {
      appearance: appearance || child.props.appearance,
    })
  )

  return (
    <div
      className="d-flex align-items-center"
      style={{
        gap: '8px',
        ...(placement && { justifyContent: `flex-${placement}` }),
      }}
    >
      {childrenWithProps}
    </div>
  )
}
