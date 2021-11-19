import { classnames } from 'classnames/tailwind'
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

function Navbar() {
  return (
    <nav className={navbar}>
      <Logo />

      <div className={themeToggleBox}>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar
