import { proxy } from 'valtio'
import Language from 'models/Language'
import PersistableStore from 'stores/persistence/PersistableStore'

export enum Theme {
  dark = 'dark',
  light = 'light',
}

class AppStore extends PersistableStore {
  language: Language = Language.en
  theme: Theme = this.usePreferredTheme()
  cookieAccepted = false

  usePreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? Theme.dark
      : Theme.light
  }

  toggleDark() {
    this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark
  }

  acceptCookie() {
    this.cookieAccepted = true
  }
}

export default proxy(new AppStore()).makePersistent()
