import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Suspense } from 'react'
import LocalizationProvider from 'localization/LocalizationProvider'
import Main from 'pages/Main'
import Loader from 'components/Loader'
import Navbar from 'components/Navbar'
import NotFound from 'pages/NotFound'
import Root from 'components/Root'
import ThemeProvider from 'components/ThemeProvider'

const App = () => {
  return (
    <ThemeProvider>
      <Root>
        <LocalizationProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route
                path="/*"
                element={
                  <Suspense fallback={<Loader size="small" />}>
                    <Main />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </Root>
    </ThemeProvider>
  )
}

export default App
