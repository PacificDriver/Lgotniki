import React from 'react'

import styles from './ImageView.module.scss'

export default function ImageView({ file, className }) {
  const isBlob = value => {
    return value instanceof Blob
  }

  return (
    <div
      className={`${styles['image-view-container']} ${className && className}`}
    >
      <img
        src={isBlob(file) ? URL.createObjectURL(file) : file}
        alt={file?.name}
      />
    </div>
  )
}
