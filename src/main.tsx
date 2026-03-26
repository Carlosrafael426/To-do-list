import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applyTheme, getInitialTheme } from './utils/theme'

// Definição imediata do tema antes de renderizar
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
