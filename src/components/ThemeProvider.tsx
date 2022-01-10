import { FC } from 'react'
import {
  backgroundColor,
  classnames,
  height,
  transitionProperty,
} from 'classnames/tailwind'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'

const ThemeProvider: FC = ({ children }) => {
  const backgroundStyle = classnames(
    transitionProperty('transition-colors'),
    backgroundColor('bg-background'),
    height('h-full')
  )
  const root = window.document.documentElement
  const { theme } = useSnapshot(AppStore)
  root.classList.remove(theme === 'dark' ? 'light' : 'dark')
  root.classList.add(theme)
  return <div className={`${theme} ${backgroundStyle}`}>{children}</div>
}

export default ThemeProvider
