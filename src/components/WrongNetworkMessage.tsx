import { SubheaderText } from 'components/Text'
import { useSnapshot } from 'valtio'
import Button from 'components/Button'
import WalletStore from 'stores/WalletStore'
import env from 'helpers/env'

export default function () {
  const { networkName } = useSnapshot(WalletStore)
  return (
    <>
      <SubheaderText centered>
        You're using {networkName} network. Please, switch to{' '}
        {env.VITE_ETH_NETWORK} network.
      </SubheaderText>
      <Button
        title="Switch"
        onClick={() => WalletStore.changeNetworkToDefault()}
      />
    </>
  )
}
