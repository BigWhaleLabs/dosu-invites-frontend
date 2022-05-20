import { useSnapshot } from 'valtio'
import Button from 'components/Button'
import CryptoWallet from 'icons/CryptoWallet'
import WalletStore from 'stores/WalletStore'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'

export default function () {
  const { userAddress, loading } = useSnapshot(WalletStore)
  const { sm, md } = useBreakpoints()

  return (
    <Button
      circle
      onClick={() => WalletStore.connect()}
      outlined={!!userAddress}
      loading={loading}
      disabledColor={!!userAddress}
    >
      {userAddress ? (
        md ? (
          userAddress
        ) : sm ? (
          truncateMiddle(userAddress)
        ) : (
          <CryptoWallet />
        )
      ) : md || sm ? (
        'Connect ETH Wallet'
      ) : (
        <CryptoWallet />
      )}
    </Button>
  )
}
