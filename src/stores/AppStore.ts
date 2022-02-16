import { Theme } from 'models/Theme'
import { proxy } from 'valtio'
import Language from 'models/Language'
import PersistableStore from 'stores/persistence/PersistableStore'
import configuredModal from 'helpers/configuredModal'
import usePreferredTheme from 'helpers/usePreferredTheme'

class AppStore extends PersistableStore {
  language: Language = Language.en
  theme: Theme = usePreferredTheme()
  cookieAccepted = false

  async updateModalTheme() {
    await configuredModal.updateTheme(this.theme as string)
  }

  toggleDark() {
    this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark
    void this.updateModalTheme()
  }

  acceptCookie() {
    this.cookieAccepted = true
  }
}

export default proxy(new AppStore()).makePersistent()
