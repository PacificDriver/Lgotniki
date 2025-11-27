import React from 'react'

import './style.scss'

export default function Banner({ appearance, icon, children }) {
  return (
    <div className="banner-container">
      <div
        className={`banner-container__content banner-container__content--${appearance || 'default'}`}
      >
        <span className="banner-container__content--icon">{icon}</span>
        <p className="banner-container__content--text">{children}</p>
      </div>
    </div>
  )
}
