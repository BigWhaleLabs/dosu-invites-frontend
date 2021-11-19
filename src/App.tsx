import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
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
              <Route exact path="/" component={Main} />
              <Route
                path="/privacy"
                render={() => <Redirect to="/p/dosu/2" />}
              />
              <Route path="/terms" render={() => <Redirect to="/p/dosu/1" />} />
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
