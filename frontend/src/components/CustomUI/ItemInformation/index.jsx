import React from 'react'

import './style.scss'

export default function ItemInformation(props) {
  const { title, color, size } = props

  return (
    <div className="item-information-container">
      <div className="item-information-container__content">
        {color && (
          <div
            className="box__info"
            style={{ backgroundColor: color || 'transparent' }}
          ></div>
        )}
        <div style={{ fontSize: size || '14px' }}>{title}</div>
      </div>
    </div>
  )
}
