// React application entry point that mounts the root component.
// This comment clarifies the file's purpose for future maintainers.

// React application entry point that mounts the root component.
// This comment clarifies the file's purpose for future maintainers.

// React application bootstrap and root rendering.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

