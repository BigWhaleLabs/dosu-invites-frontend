import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import AppStore from 'stores/AppStore'
import ISVGIcon from 'models/ISVGIcon'
import classNamesToString from 'helpers/classNamesToString'
import classnames from 'classnames/tailwind'

const Play: FC<ISVGIcon> = ({
  theme,
  title = 'Play icon',
  height = 24,
  width = 24,
  className,
}) => {
  const themeSheme = theme || AppStore.theme
  const colors = {
    svg: 'none',
    path: themeSheme === 'light' ? 'var(--background)' : 'var(--border)',
    circule: themeSheme === 'light' ? 'var(--accent)' : undefined,
  }
  const commonProps = { className: classnames('transition-colors') }
  const classes = classnames('transition-colors')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31 36"
      width={width}
      height={height}
      fill={colors.svg}
      className={classNamesToString([classes, className])}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={colors.path}
        {...commonProps}
        d="M0.166687 5.30939C0.166687 1.39184 4.46751 -1.00396 7.79846 1.05806L28.2992 13.749C31.4568 15.7037 31.4568 20.2969 28.2992 22.2516L7.79846 34.9425C4.46751 37.0046 0.166687 34.6088 0.166687 30.6912V5.30939Z"
      />
    </svg>
  )
}

export default observer(Play)
