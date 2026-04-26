import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import posthog from 'posthog-js'

posthog.init('phc_AUyXoh3TkLqY7e7AqWd3LnHQN4wvjFEkxi9qAhokrMXJ', {
  api_host: 'https://eu.i.posthog.com',
  person_profiles: 'identified_only',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
