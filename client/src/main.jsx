import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PassModalProvider } from './context/PassModalContext.jsx'
import { SoundProvider } from './context/SoundContext.jsx'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SoundProvider>
            <PassModalProvider>
              <App />
              <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#0d0d13',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
                  fontSize: '13px',
                },
                success: { iconTheme: { primary: '#ffffff', secondary: '#050508' } },
              }}
            />
          </PassModalProvider>
        </SoundProvider>
      </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
