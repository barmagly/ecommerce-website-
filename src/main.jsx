import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Boxicons
import 'boxicons/css/boxicons.min.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={Store}>
    <GoogleOAuthProvider clientId="812727128915-pjdracpnf7dalh7ppeagmtfhkea0vf3s.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>
</React.StrictMode>
)
