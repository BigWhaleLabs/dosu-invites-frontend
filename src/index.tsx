/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import '@vime/core/themes/default.css'
import './index.css'
import { render } from 'preact'
import App from './App'

render(<App />, document.getElementById('root') as Element)
