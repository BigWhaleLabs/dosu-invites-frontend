import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import AppStore from 'stores/AppStore'
import ISVGIcon from 'models/ISVGIcon'
import classNamesToString from 'helpers/classNamesToString'
import classnames, { transitionProperty } from 'classnames/tailwind'

const Idea: FC<ISVGIcon> = ({
  theme,
  title = 'Idea icon',
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
  const commonProps = {
    className: classnames(transitionProperty('transition-colors')),
  }
  const classes = classnames(transitionProperty('transition-colors'))

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={classNamesToString([classes, className])}
      fill={colors.svg}
    >
      <title>{title}</title>
      {colors.circule && (
        <circle cx="12" cy="12" r="12" fill={colors.circule} {...commonProps} />
      )}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={colors.path}
        {...commonProps}
        d="M14 17C14.552 17 15 17.448 15 18C15 18.552 14.552 19 14 19C14 19.552 13.552 20 13 20H11C10.448 20 10 19.552 10 19C9.448 19 9 18.552 9 18C9 17.448 9.448 17 10 17H14ZM14.316 16H9.684C9.231 16 8.848 15.698 8.725 15.284C8.654 15.056 8.535 14.914 8.335 14.75C6.915 13.652 6 11.932 6 10C6 6.689 8.689 4 12 4C15.311 4 18 6.689 18 10C18 11.932 17.085 13.652 15.665 14.75C15.465 14.914 15.346 15.056 15.275 15.284C15.152 15.698 14.769 16 14.316 16ZM14 10C14 10.552 14.448 11 15 11C15.552 11 16 10.552 16 10C16 7.792 14.208 6 12 6C11.448 6 11 6.448 11 7C11 7.552 11.448 8 12 8C13.104 8 14 8.896 14 10Z"
      />
    </svg>
  )
}

export default observer(Idea)
