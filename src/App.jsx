import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RoutesPage from './routes/RoutesPage'
import { loadUserThunk } from './services/Slice/auth/auth'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  // Global fix for mobile scrolling issues
  useEffect(() => {
    const fixMobileScrolling = () => {
      // Ensure body is scrollable
      document.body.style.overflow = 'auto';
      document.body.style.webkitOverflowScrolling = 'touch';
      
      // Remove any fixed positioning that might interfere
      const fixedElements = document.querySelectorAll('*[style*="position: fixed"]');
      fixedElements.forEach(el => {
        if (!el.classList.contains('home-bg-animated') || !document.body.classList.contains('home-page')) {
          el.style.position = 'absolute';
        }
      });
    };

    // Apply fix immediately
    fixMobileScrolling();
    
    // Apply fix on window load
    window.addEventListener('load', fixMobileScrolling);
    
    // Apply fix on route changes
    const handleRouteChange = () => {
      setTimeout(fixMobileScrolling, 100);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('load', fixMobileScrolling);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RoutesPage />
    </>
  )
}

export default App
