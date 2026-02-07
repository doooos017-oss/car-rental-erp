import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Add error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
})

const root = createRoot(document.getElementById('root'))

if (!document.getElementById('root')) {
  document.body.innerHTML = '<div style="padding:20px;color:red;">ERROR: Root element not found!</div>'
} else {
  try {
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Failed to render app:', error)
    document.body.innerHTML = `<div style="padding:20px;color:red;">ERROR: ${error.message}</div>`
  }
}
