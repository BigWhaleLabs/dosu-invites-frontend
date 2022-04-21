import { Button } from 'components/Button'
import WalletStore from 'stores/WalletStore'
import env from 'helpers/env'

const CustomError = () => {
  return (
    <div>
      Looks like you're using {WalletStore.networkName} network, please, switch
      to {env.VITE_ETH_NETWORK}`
      <Button
        outlined
        fullWidth
        title="Switch"
        onClick={() => WalletStore.changeNetwork()}
      />
    </div>
  )
}

export default CustomError
