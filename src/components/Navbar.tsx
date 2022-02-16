import { Button } from 'components/Button'
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
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import CryptoWallet from 'icons/CryptoWallet'
import EthStore from 'stores/EthStore'
import Logo from 'components/Logo'
import ThemeToggle from 'components/ThemeToggle'
import configuredModal from 'helpers/configuredModal'
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

  useEffect(() => {
    if (configuredModal.cachedProvider) {
      void EthStore.onConnect()
    }
  }, [])

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
          <Button
            circle
            onClick={async () => await EthStore.onConnect()}
            outlined={!md}
          >
            {md ? 'Connect Eth Wallet to claim your invite' : <CryptoWallet />}
          </Button>
        )}
      </div>
    </nav>
  )
}

export default observer(Navbar)
