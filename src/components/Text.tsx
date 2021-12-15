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

const subheaderText = (
  centered?: boolean,
  h2?: boolean,
  h3?: boolean,
  h4?: boolean,
  h5?: boolean,
  h6?: boolean
) =>
  classnames(
    'font-bold',
    'py-3',
    primaryText,
    centered ? 'text-center' : undefined,
    h2 ? { 'md:text-5xl': true, 'text-4xl': true } : 'text-xl',
    h3 ? { 'md:text-4xl': true, 'text-3xl': true } : undefined,
    h4 ? { 'md:text-3xl': true, 'text-2xl': true } : undefined,
    h5 ? { 'md:text-2xl': true, 'text-xl': true } : undefined,
    h6 ? { 'md:text-2xl': true, 'text-xl': true } : undefined
  )
export const SubheaderText: FC<{
  centered?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean
}> = ({ children, centered, h2, h3, h4, h5, h6 }) =>
  h2 ? (
    <h2 className={subheaderText(centered, h2, h3, h4, h5, h6)}>{children}</h2>
  ) : h3 ? (
    <h3 className={subheaderText(centered, h2, h3, h4, h5, h6)}>{children}</h3>
  ) : h4 ? (
    <h4 className={subheaderText(centered, h2, h3, h4, h5, h6)}>{children}</h4>
  ) : h5 ? (
    <h5 className={subheaderText(centered, h2, h3, h4, h5, h6)}>{children}</h5>
  ) : h6 ? (
    <h6 className={subheaderText(centered, h2, h3, h4, h5, h6)}>{children}</h6>
  ) : (
    <p className={subheaderText(centered)}>{children}</p>
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

export const PopupBodyText: FC = ({ children }) => {
  return <div className={primaryText}>{children}</div>
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

const linkText = classnames('text-primary-dimmed', 'transition-colors')
export const LinkText: FC<{
  href?: string | undefined
  target?: React.HTMLAttributeAnchorTarget
}> = ({ children, href, target }) => (
  <a className={linkText} href={href} target={target}>
    {children}
  </a>
)
