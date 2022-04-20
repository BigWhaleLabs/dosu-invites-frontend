import { FC } from 'react'
import {
  backgroundColor,
  classnames,
  height,
  transitionProperty,
} from 'classnames/tailwind'
import AppStore from 'stores/AppStore'
import Theme from 'models/Theme'

const ThemeProvider: FC = ({ children }) => {
  const backgroundStyle = classnames(
    transitionProperty('transition-colors'),
    backgroundColor('bg-background'),
    height('h-full')
  )
  const root = window.document.documentElement
  root.classList.remove(
    AppStore.theme === Theme.dark ? Theme.light : Theme.dark
  )
  root.classList.add(AppStore.theme)
  return (
    <div className={`${AppStore.theme} ${backgroundStyle}`}>{children}</div>
  )
}

export default ThemeProvider
