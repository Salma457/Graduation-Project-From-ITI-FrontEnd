import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import { AuthProvider } from './Posts/context/AuthContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
=======
import { Provider } from 'react-redux';
import applicationStore from './applicationStore';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={applicationStore}>
      <App />
    </Provider>
>>>>>>> 47e7ce1a7ab91060f7dd0ee1066b24cf0fa13d8d
  </StrictMode>,
)
