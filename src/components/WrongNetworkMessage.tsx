import { SubheaderText } from 'components/Text'
import { useSnapshot } from 'valtio'
import WalletStore from 'stores/WalletStore'
import env from 'helpers/env'

export default function WrongNetworkMessage() {
  const { networkName } = useSnapshot(WalletStore)
  return (
    <SubheaderText>
      You're using {networkName} network. Please, switch to{' '}
      {env.VITE_ETH_NETWORK} network.
    </SubheaderText>
  )
}
