import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
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
            <Switch>
              <Route path="/" component={Main} />
              <Route
                path="/terms"
                component={() => {
                  location.replace('https://dosu.io/p/dosu/1')
                  return null
                }}
              />
              <Route
                path="/privacy"
                component={() => {
                  location.replace('https://dosu.io/p/dosu/2')
                  return null
                }}
              />
              <Route exact path="/404" component={NotFound} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Router>
        </LocalizationProvider>
      </Root>
    </ThemeProvider>
  )
}

export default App
