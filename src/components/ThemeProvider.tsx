import { FC } from 'react'
import {
  backgroundColor,
  classnames,
  height,
  transitionProperty,
} from 'classnames/tailwind'
import AppStore from 'stores/AppStore'
import Theme from 'models/Theme'

const background = classnames(
  transitionProperty('transition-colors'),
  backgroundColor('bg-background'),
  height('h-full')
)

const ThemeProvider: FC = ({ children }) => {
  const root = window.document.documentElement
  root.classList.remove(
    AppStore.theme === Theme.dark ? Theme.light : Theme.dark
  )
  root.classList.add(AppStore.theme)
  return <div className={`${AppStore.theme} ${background}`}>{children}</div>
}

export default ThemeProvider
