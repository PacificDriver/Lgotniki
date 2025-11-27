import React from 'react'

import { MediaView } from '../MediaView'

import './style.scss'

export default function Files({ files }) {
  return (
    <div className="files-container">
      <div className="grid-container">
        {files?.map((file, index) => (
          <div key={index} className="sm-4 md-4 xl-4">
            <MediaView file={file} />
          </div>
        ))}
      </div>
    </div>
  )
}
