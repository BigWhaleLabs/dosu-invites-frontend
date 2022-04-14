import 'react-toastify/dist/ReactToastify.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import LocalizationProvider from 'localization/LocalizationProvider'
import Main from 'pages/Main'
import Navbar from 'components/Navbar'
import NotFound from 'pages/NotFound'
import Root from 'components/Root'
import ThemeProvider from 'components/ThemeProvider'

const App = () => {
  const { theme } = useSnapshot(AppStore)

  return (
    <ThemeProvider>
      <Root>
        <LocalizationProvider>
          <Router>
            <ToastContainer position="bottom-right" theme={theme} />
            <Navbar />
            <Routes>
              <Route path="/*" element={<Main />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </Root>
    </ThemeProvider>
  )
}

export default App
