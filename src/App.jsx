
import { Provider } from 'react-redux'
import './App.css'
import RoutesPage from './routes/RoutesPage'
import Store from './services/Slice/Store'

function App() {


  return (
    <>
      <Provider store={Store}>
        <RoutesPage />
      </Provider>
    </>
  )
}

export default App
