import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { Web3Provider } from './contexts/web3-context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Web3Provider>
        <main className='dark text-foreground bg-background'>
          <App />
        </main>
      </Web3Provider>
    </NextUIProvider>
  </React.StrictMode>
)
