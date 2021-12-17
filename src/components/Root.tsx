import { FC } from 'react'
import { classnames } from 'classnames/tailwind'
import CookieNotification from 'components/CookieNotification'

const root = classnames(
  'flex',
  'flex-col',
  'container',
  'mx-auto',
  'pb-10',
  'max-w-4xl',
  'pt-4',
  'px-4',
  'h-screen'
)
const Root: FC = ({ children }) => {
  return (
    <div className={root}>
      {children}
      {/* <CookieNotification /> */}
    </div>
  )
}

export default Root
