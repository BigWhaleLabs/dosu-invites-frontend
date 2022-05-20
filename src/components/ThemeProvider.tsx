import {
  backgroundColor,
  classnames,
  height,
  transitionProperty,
} from 'classnames/tailwind'
import AppStore from 'stores/AppStore'
import ChildrenProp from 'models/ChildrenProp'
import Theme from 'models/Theme'

const background = classnames(
  transitionProperty('transition-colors'),
  backgroundColor('bg-background'),
  height('h-full')
)
export default function ({ children }: ChildrenProp) {
  const root = window.document.documentElement
  root.classList.remove(
    AppStore.theme === Theme.dark ? Theme.light : Theme.dark
  )
  root.classList.add(AppStore.theme)
  return <div className={`${AppStore.theme} ${background}`}>{children}</div>
}
