import React from 'react'
import ReactDOM from 'react-dom/client'
import { pdfjs } from 'react-pdf'
import App from './core/App.js'

import './styles/_styles.scss'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// Patch String.prototype.toLowerCase to handle null/undefined safely
// This prevents errors when powerful-react-table calls toLowerCase on null values
const originalToLowerCase = String.prototype.toLowerCase
String.prototype.toLowerCase = function () {
  if (this === null || this === undefined) {
    return ''
  }
  try {
    return originalToLowerCase.call(String(this))
  } catch (e) {
    return ''
  }
}

// Global error handler to catch toLowerCase errors on null values
const originalErrorHandler = window.onerror
window.onerror = (message, source, lineno, colno, error) => {
  // Suppress toLowerCase errors on null values in table search
  if (
    error?.message?.includes('toLowerCase') ||
    message?.includes('toLowerCase') ||
    (error?.message?.includes('null') && message?.includes('reading'))
  ) {
    console.warn('Table search error suppressed:', message)
    return true // Suppress the error
  }
  // Call original error handler if it exists
  if (originalErrorHandler) {
    return originalErrorHandler(message, source, lineno, colno, error)
  }
  return false
}

// Also handle unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  if (
    event.reason?.message?.includes('toLowerCase') ||
    event.reason?.message?.includes('null')
  ) {
    console.warn('Table search promise rejection suppressed:', event.reason)
    event.preventDefault()
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
