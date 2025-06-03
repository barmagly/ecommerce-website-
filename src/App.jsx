import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import RoutesPage from './routes/RoutesPage'
import Store from './services/Slice/Store'

function App() {
  return (
    <>
      <Provider store={Store}>
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
          limit={3}
        />
        <RoutesPage />
      </Provider>
    </>
  )
}

export default App
