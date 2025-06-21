import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import applicationStore from './applicationStore';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={applicationStore}>
      <App />
    </Provider>
  </StrictMode>,
)
