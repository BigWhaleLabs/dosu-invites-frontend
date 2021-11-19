import { classnames } from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import AppStore from 'stores/AppStore'

const whale = classnames('mx-auto')
const Whale = observer(() => {
  const theme = AppStore.theme
  return <img className={whale} src={`/img/whale-${theme}.svg`} alt="whale" />
})

export default Whale
