import { FC } from 'react'
import { classnames } from 'classnames/tailwind'

export const primaryText = classnames('text-primary', 'transition-colors')

const headerText = (h1?: boolean) =>
  classnames(
    h1 ? undefined : 'text-center',
    'font-primary',
    'text-accent',
    'transition-colors',
    'text-5xl',
    'md:text-6xl',
    'font-bold',
    'mt-3',
    'mb-3'
  )
export const HeaderText: FC<{ h1?: boolean }> = ({ children, h1 }) => (
  <p className={headerText(h1)}>{children}</p>
)

const dimmedSubheaderText = classnames(
  'text-primary-text-dimmed',
  'transition-colors',
  'text-center',
  'break-words',
  'font-medium',
  'font-primary',
  'text-xl',
  'md:leading-8',
  'md:text-2xl'
)
export const DimmedSubheaderText: FC = ({ children }) => (
  <div className={dimmedSubheaderText}>{children}</div>
)

const bodyText = classnames(primaryText, 'text-lg')
export const BodyText: FC = ({ children }) => (
  <div className={bodyText}>{children}</div>
)

const secondaryText = classnames(
  'text-primary-text-dimmed',
  'transition-colors'
)
export const SecondaryText: FC = ({ children }) => (
  <div className={secondaryText}>{children}</div>
)

const tinyText = classnames('text-xs')
export const TinyText: FC = ({ children }) => (
  <div className={classnames(tinyText, secondaryText)}>{children}</div>
)

const footerText = classnames('text-xs', secondaryText, 'font-primary')
export const FooterText: FC = ({ children }) => {
  return <div className={footerText}>{children}</div>
}

const logoDot = classnames('text-accent')
export const LogoDot: FC = ({ children }) => {
  return <span className={logoDot}>{children}</span>
}

const logoText = (large?: boolean) =>
  classnames(
    'font-logo',
    'text-primary',
    'transition-colors',
    large ? 'text-5xl' : 'text-3xl',
    'font-semibold'
  )
export const LogoText: FC<{ large?: boolean }> = ({ large, children }) => {
  return <span className={logoText(large)}>{children}</span>
}
