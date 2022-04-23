import { Button } from 'components/Button'
import { useSnapshot } from 'valtio'
import CryptoWallet from 'icons/CryptoWallet'
import WalletStore from 'stores/WalletStore'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'

export default function ConnectWalletButton() {
  const { userAddress, loading } = useSnapshot(WalletStore)
  const { md } = useBreakpoints()

  return (
    <Button
      circle
      onClick={() => WalletStore.connect()}
      outlined
      loading={loading}
      disabledColor={!!userAddress}
    >
      {userAddress ? (
        md ? (
          userAddress
        ) : (
          truncateMiddle(userAddress)
        )
      ) : md ? (
        'Connect ETH Wallet'
      ) : (
        <CryptoWallet />
      )}
    </Button>
  )
}
