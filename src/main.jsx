import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';
import './index.css';
import { TranslationProvider } from './contexts/TranslationContext';
import { DarkModeProvider } from './contexts/DarkModeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <DarkModeProvider>
        <TranslationProvider>
      <App />
      </TranslationProvider>
      </DarkModeProvider>
      
      
    </Provider>
  </React.StrictMode>
);