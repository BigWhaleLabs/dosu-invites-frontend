import { Button } from 'components/Button'
import { UserAgent, userAgent } from 'helpers/userAgent'
import { classnames } from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'preact/hooks'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import Logo from 'components/Logo'
import MetaMask from 'icons/MetaMask'
import Popup from 'components/Popup'
import ThemeToggle from 'components/ThemeToggle'
import truncateMiddle from 'helpers/truncateMiddle'
import useBreakpoints from 'helpers/useBreakpoints'

const flexGrowRow = (row?: boolean) =>
  classnames('flex', 'flex-1', row ? 'flex-row' : 'flex-col')
const navbar = classnames(
  'sticky',
  'top-0',
  'flex',
  'items-center',
  'my-4',
  'z-50',
  'bg-background',
  'transition-colors',
  'py-2'
)

const themeToggleBox = classnames(
  'space-x-2',
  flexGrowRow(true),
  'justify-end',
  'items-center'
)

const buttonBox = classnames('xl:ml-10', 'ml-3')

function Navbar() {
  const { userAddress } = useSnapshot(AppStore)
  const { md } = useBreakpoints()
  const isSafari = userAgent() === UserAgent.Safari

  useEffect(() => {
    void AppStore.isMetaMaskConnected()
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
          <Popup
            activator={
              <Button
                circle
                onClick={async () => await AppStore.connectMetaMask()}
                outlined={!md}
              >
                {md ? 'Connect MetaMask to claim your invite' : <MetaMask />}
              </Button>
            }
            title={'MetaMask is not installed'}
            body={
              isSafari
                ? 'Safari does not support MetaMask, please use other browser'
                : 'To use Web3 technologies, please install MetaMask extension for your browser'
            }
            confirmTitle="Okay, thanks"
          />
        )}
      </div>
    </nav>
  )
}

export default observer(Navbar)
