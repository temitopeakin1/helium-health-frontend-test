import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { api } from './mock-api-client'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    workplaceApi: typeof api
  }
}

window.workplaceApi = api

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
