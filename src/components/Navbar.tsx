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
import ConnectWalletButton from 'components/ConnectWalletButton'
import Logo from 'components/Logo'
import ThemeToggle from 'components/ThemeToggle'

const navbar = classnames(
  transitionProperty('transition-colors'),
  position('sticky'),
  inset('top-0'),
  display('flex'),
  alignItems('items-center'),
  backgroundColor('bg-background'),
  margin('my-4'),
  padding('py-2'),
  zIndex('z-50')
)

const flexGrowRow = (row?: boolean) =>
  classnames(
    display('flex'),
    flex('flex-1'),
    flexDirection(row ? 'flex-row' : 'flex-col')
  )

const themeToggleBox = classnames(
  flexGrowRow(true),
  space('space-x-2'),
  justifyContent('justify-end'),
  alignItems('items-center')
)

const buttonBox = classnames(margin('xl:ml-10', 'ml-3'))

function Navbar() {
  return (
    <nav className={navbar}>
      <Logo />
      <div className={themeToggleBox}>
        <ThemeToggle />
      </div>
      <div className={buttonBox}>
        <ConnectWalletButton />
      </div>
    </nav>
  )
}

export default Navbar
