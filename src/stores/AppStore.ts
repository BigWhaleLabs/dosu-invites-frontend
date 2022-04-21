import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'
import Theme from 'models/Theme'
import usePreferredTheme from 'helpers/usePreferredTheme'

class AppStore extends PersistableStore {
  theme = usePreferredTheme()

  toggleDark() {
    this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark
  }
}

export default proxy(new AppStore()).makePersistent()
