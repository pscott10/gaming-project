import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ReportsProvider } from './components/ReportsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ReportsProvider>
        <App />
      </ReportsProvider>
    </BrowserRouter>
  </StrictMode>
);