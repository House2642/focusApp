import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

function onViewportResize() {
  const vv = window.visualViewport
  if (!vv) return
  const bottom = window.innerHeight - vv.offsetTop - vv.height
  document.getElementById('root').style.bottom = `${bottom}px`
}
window.visualViewport?.addEventListener('resize', onViewportResize)
window.visualViewport?.addEventListener('scroll', onViewportResize)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
