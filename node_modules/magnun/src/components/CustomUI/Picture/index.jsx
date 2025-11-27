import React from 'react'

import './style.scss'

export default function Picture({
  width,
  minWidth,
  heigth,
  image,
  name,
  className,
}) {
  return (
    <div
      className={`picture-container ${className}`}
      style={{
        ...(width && { width: width }),
        ...(heigth && { heigth: heigth }),
        ...(minWidth && { minWidth: minWidth }),
      }}
    >
      <img src={image} alt={name} />
    </div>
  )
}
