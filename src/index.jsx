import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Store from './services/Slice/Store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <HelmetProvider>
    <Provider store={Store}>
      <GoogleOAuthProvider clientId="812727128915-pjdracpnf7dalh7ppeagmtfhkea0vf3s.apps.googleusercontent.com">
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  </HelmetProvider>
  // </React.StrictMode>
); 