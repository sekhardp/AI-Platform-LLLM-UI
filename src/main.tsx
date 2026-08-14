import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initConfig } from './config'

// Load runtime config from /config.json before rendering.
// In Docker, this file is written by docker-entrypoint.sh from env vars.
initConfig().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
