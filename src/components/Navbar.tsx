import { Button } from 'components/Button'
import { classnames } from 'classnames/tailwind'
import { ethers } from 'ethers'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import Logo from 'components/Logo'
import ThemeToggle from 'components/ThemeToggle'

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

const buttonBox = classnames('ml-10')

function Navbar() {
  const { ethAddress } = useSnapshot(AppStore)

  async function connectMetaMask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    await provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    await signer.getAddress()

    if (!ethAddress) {
      const accounts = await provider.listAccounts()
      AppStore.setEthAddress(accounts[0])
    }
  }

  return (
    <nav className={navbar}>
      <Logo />

      <div className={themeToggleBox}>
        <ThemeToggle />
      </div>

      <div className={buttonBox}>
        {ethAddress ? (
          <Button circle outlined>
            {ethAddress}
          </Button>
        ) : (
          <Button circle onClick={async () => await connectMetaMask()}>
            Connect MetaMask to claim your invite
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
