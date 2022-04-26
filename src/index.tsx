/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import 'index.css'

import { render } from 'preact'
import App from 'App'
import { injectStyle } from 'react-toastify/dist/inject-style'

injectStyle()

render(<App />, document.getElementById('root') as Element)
