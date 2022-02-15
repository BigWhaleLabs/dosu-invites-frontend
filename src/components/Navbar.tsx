import { Button } from 'components/Button'
import { UserAgent, mobileCheck, userAgent } from 'helpers/userAgent'
import {
  alignItems,
  backgroundColor,
  classnames,
  display,
  flex,
  flexDirection,
  inset,
  justifyContent,
  margin,
  padding,
  position,
  space,
  transitionProperty,
  zIndex,
} from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import { useSnapshot } from 'valtio'
import CryptoWallet from 'icons/CryptoWallet'
import EthStore from 'stores/EthStore'
import Logo from 'components/Logo'
import Popup from 'components/Popup'
import ThemeToggle from 'components/ThemeToggle'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'

const flexGrowRow = (row?: boolean) =>
  classnames(
    display('flex'),
    flex('flex-1'),
    flexDirection(row ? 'flex-row' : 'flex-col')
  )
const navbar = classnames(
  transitionProperty('transition-colors'),
  position('sticky'),
  inset('top-0'),
  display('flex'),
  alignItems('items-center'),
  zIndex('z-50'),
  backgroundColor('bg-background'),
  margin('my-4'),
  padding('py-2')
)

const themeToggleBox = classnames(
  flexGrowRow(true),
  space('space-x-2'),
  justifyContent('justify-end'),
  alignItems('items-center')
)

const buttonBox = classnames(margin('xl:ml-10', 'ml-3'))

function Navbar() {
  const { userAddress } = useSnapshot(EthStore)
  const { md } = useBreakpoints()
  const isSafari = userAgent() === UserAgent.Safari
  const isNotSupportedMobile = mobileCheck() && !EthStore.userAddress

  return (
    <nav className={navbar}>
      <Logo />

      <div className={themeToggleBox}>
        <ThemeToggle />
      </div>

      <div className={buttonBox}>
        {userAddress ? (
          <Button circle outlined>
            {md ? userAddress : truncateMiddle(userAddress)}
          </Button>
        ) : (
          <Popup
            activator={
              <Button
                circle
                onClick={async () => await EthStore.connectBlockchain()}
                outlined={!md}
              >
                {md ? (
                  'Connect Eth Wallet to claim your invite'
                ) : (
                  <CryptoWallet />
                )}
              </Button>
            }
            title={
              isNotSupportedMobile
                ? 'Please use the app, that supports Crypto Wallets'
                : isSafari
                ? 'Eth Wallets are not supported'
                : 'Eth Wallet is not installed'
            }
            body={
              isNotSupportedMobile
                ? 'To use Web3 technologies, please use a browser with the Eth Wallet extension'
                : isSafari
                ? 'Safari does not support Eth Wallets, please, use another browser'
                : 'To use Web3 technologies, please, install Eth Wallet extension for your browser'
            }
            confirmTitle="Okay, thanks"
          />
        )}
      </div>
    </nav>
  )
}

export default observer(Navbar)
