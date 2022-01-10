import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LocalizationProvider from 'localization/LocalizationProvider'
import Main from 'pages/Main'
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
              <Route path="/" element={<Main />} />
              <Route
                path="/terms"
                element={() => {
                  location.replace('https://dosu.io/privacy')
                  return null
                }}
              />
              <Route
                path="/privacy"
                element={() => {
                  location.replace('https://dosu.io/terms')
                  return null
                }}
              />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </LocalizationProvider>
      </Root>
    </ThemeProvider>
  )
}

export default App
