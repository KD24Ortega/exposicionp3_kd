import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

// Apply persisted theme early (prevents flash on load)
try {
  const t = localStorage.getItem('theme_pref_v1')
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-bs-theme', t)
} catch {
  // ignore
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
