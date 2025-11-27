import React from 'react'

import styles from './Image.module.scss'

export default function Image({ src, alt, testId, className }) {
  return (
    <div className={`${styles['image-container']} ${className}`}>
      <img src={src} alt={alt} id={testId} />
    </div>
  )
}
