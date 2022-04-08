import { proxy } from 'valtio'
import Language from 'models/Language'
import PersistableStore from 'stores/persistence/PersistableStore'
import Theme from 'models/Theme'
import usePreferredTheme from 'helpers/usePreferredTheme'

class AppStore extends PersistableStore {
  language: Language = Language.en
  theme: Theme = usePreferredTheme()
  warningAccepted = false

  toggleDark() {
    this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark
  }
}

export default proxy(new AppStore()).makePersistent()
