import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

// Fallback for iOS PWA standalone mode where interactive-widget isn't honored
function onViewportResize() {
  const vv = window.visualViewport
  if (!vv) return
  const root = document.getElementById('root')
  root.style.bottom = `${window.innerHeight - vv.offsetTop - vv.height}px`
}
window.visualViewport?.addEventListener('resize', onViewportResize)
window.visualViewport?.addEventListener('scroll', onViewportResize)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
