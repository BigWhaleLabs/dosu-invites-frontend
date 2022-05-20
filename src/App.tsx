import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import Main from 'pages/Main'
import Navbar from 'components/Navbar'
import NotFound from 'pages/NotFound'
import Root from 'components/Root'
import ThemeProvider from 'components/ThemeProvider'

export default function () {
  const { theme } = useSnapshot(AppStore)

  return (
    <ThemeProvider>
      <Root>
        <Router>
          <ToastContainer position="bottom-right" theme={theme} />
          <Navbar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/:id" element={<Main />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Root>
    </ThemeProvider>
  )
}
