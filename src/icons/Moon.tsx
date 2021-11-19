import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import AppStore from 'stores/AppStore'
import ISVGIcon from 'models/ISVGIcon'
import classNamesToString from 'helpers/classNamesToString'
import classnames from 'classnames/tailwind'

const Moon: FC<ISVGIcon> = ({
  theme,
  title = 'Moon icon',
  height = 24,
  width = 24,
  className,
}) => {
  const themeSheme = theme || AppStore.theme
  const colors = {
    svg: themeSheme === 'light' ? 'none' : 'var(--accent)',
    path: themeSheme === 'light' ? 'var(--border)' : 'var(--background)',
  }
  const commonProps = { className: classnames('transition-colors') }
  const classes = classnames('transition-colors')
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill={colors.svg}
      className={classNamesToString([classes, className])}
    >
      <title>{title}</title>
      <circle cx="12" cy="12" r="12" />
      <path
        d="M17.6 13.8C17.0667 13.9333 16.5333 14 16 14C12.6667 14 10 11.3333 10 8.00001C10 7.46668 10.0667 6.93335 10.2 6.40001C10.2667 6.20001 10.2 5.93335 10 5.73335C9.8 5.53335 9.6 5.46668 9.33333 5.53335C6.2 6.46668 4 9.40001 4 12.6667C4 16.7333 7.26667 20 11.3333 20C14.6 20 17.5333 17.8 18.4 14.6C18.4667 14.4 18.4 14.1333 18.2 13.9333C18.0667 13.8 17.8 13.7333 17.6 13.8Z"
        fill={colors.path}
        {...commonProps}
      />
      <path
        d="M12.6667 6.66667H13.3333V7.33333C13.3333 7.73333 13.6 8 14 8C14.4 8 14.6667 7.73333 14.6667 7.33333V6.66667H15.3333C15.7333 6.66667 16 6.4 16 6C16 5.6 15.7333 5.33333 15.3333 5.33333H14.6667V4.66667C14.6667 4.26667 14.4 4 14 4C13.6 4 13.3333 4.26667 13.3333 4.66667V5.33333H12.6667C12.2667 5.33333 12 5.6 12 6C12 6.4 12.2667 6.66667 12.6667 6.66667Z"
        fill={colors.path}
        {...commonProps}
      />
      <path
        d="M19.3333 9.33333H18.6667V8.66667C18.6667 8.26667 18.4 8 18 8C17.6 8 17.3333 8.26667 17.3333 8.66667V9.33333H16.6667C16.2667 9.33333 16 9.6 16 10C16 10.4 16.2667 10.6667 16.6667 10.6667H17.3333V11.3333C17.3333 11.7333 17.6 12 18 12C18.4 12 18.6667 11.7333 18.6667 11.3333V10.6667H19.3333C19.7333 10.6667 20 10.4 20 10C20 9.6 19.7333 9.33333 19.3333 9.33333Z"
        fill={colors.path}
        {...commonProps}
      />
    </svg>
  )
}

export default observer(Moon)
