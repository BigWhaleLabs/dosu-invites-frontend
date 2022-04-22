import {
  alignItems,
  classnames,
  display,
  flexDirection,
  justifyContent,
  zIndex,
} from 'classnames/tailwind'
import { useSnapshot } from 'valtio'
import Footer from 'components/Footer'
import MintingBlock from 'components/MintingBlock'
import NFTPicture from 'components/NFTPicture'
import NoAddressMessage from 'components/NoAddressMessage'
import WalletStore from 'stores/WalletStore'
import WrongNetworkMessage from 'components/WrongNetworkMessage'

const mainBox = classnames(
  display('flex'),
  flexDirection('flex-col'),
  justifyContent('justify-center'),
  alignItems('items-center'),
  zIndex('z-10')
)

function Main() {
  const { userAddress, isCorrectNetwork } = useSnapshot(WalletStore)

  return (
    <div className={mainBox}>
      <NFTPicture />
      {/* {!userAddress && <NoAddressMessage />}
      {userAddress && !isCorrectNetwork && <WrongNetworkMessage />}
      {userAddress && isCorrectNetwork && <MintingBlock />} */}

      <Footer />
    </div>
  )
}

export default Main
