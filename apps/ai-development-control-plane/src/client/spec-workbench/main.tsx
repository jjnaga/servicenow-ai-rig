import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const framed = window.self !== window.top
document.title = framed ? 'AI control · ServiceNow' : 'AI Development Control Plane'
createRoot(document.getElementById('root')!).render(<App />)
