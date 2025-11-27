import React from 'react'
import ReactDOM from 'react-dom/client'
import { pdfjs } from 'react-pdf'
import App from './core/App.js'

import './styles/_styles.scss'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
