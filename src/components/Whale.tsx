import { classnames } from 'classnames/tailwind'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'

const whale = classnames('mx-auto')
const Whale = () => {
  const { theme } = useSnapshot(AppStore)
  return <img className={whale} src={`/img/whale-${theme}.svg`} alt="whale" />
}

export default Whale
