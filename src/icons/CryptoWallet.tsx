import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import ISVGIcon from 'models/ISVGIcon'
import classNamesToString from 'helpers/classNamesToString'
import classnames, { transitionProperty } from 'classnames/tailwind'

const CryptoWallet: FC<ISVGIcon> = ({
  title = 'Crypto wallet icon',
  height = 24,
  width = 24,
  className,
}) => {
  const commonProps = {
    className: classnames(transitionProperty('transition-colors')),
  }
  const classes = classnames(transitionProperty('transition-colors'))

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classNamesToString([classes, className])}
    >
      <title>{title}</title>
      <path
        d="M8 13v4H6v2h3v2h2v-2h2v2h2v-2.051c1.968-.249 3.5-1.915 3.5-3.949 0-1.32-.65-2.484-1.64-3.213A3.982 3.982 0 0 0 18 9c0-1.858-1.279-3.411-3-3.858V3h-2v2h-2V3H9v2H6v2h2v6zm6.5 4H10v-4h4.5c1.103 0 2 .897 2 2s-.897 2-2 2zM10 7h4c1.103 0 2 .897 2 2s-.897 2-2 2h-4V7z"
        {...commonProps}
      />
    </svg>
  )
}

export default observer(CryptoWallet)
