import { FC } from 'react'
import {
  classnames,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  margin,
  padding,
  textAlign,
  textColor,
  transitionProperty,
  wordBreak,
} from 'classnames/tailwind'

const transitionColors = classnames(transitionProperty('transition-colors'))
export const primaryText = classnames(
  transitionColors,
  textColor('text-primary')
)

const headerText = (h1?: boolean) =>
  classnames(
    transitionColors,
    textAlign(h1 ? undefined : 'text-center'),
    textColor('text-accent'),
    fontFamily('font-primary'),
    fontWeight('font-bold'),
    fontSize('text-5xl', 'md:text-6xl'),
    margin('mt-3', 'mb-3')
  )
export const HeaderText: FC<{ h1?: boolean }> = ({ children, h1 }) => (
  <p className={headerText(h1)}>{children}</p>
)

const dimmedSubheaderText = classnames(
  transitionColors,
  textColor('text-primary-text-dimmed'),
  textAlign('text-center'),
  wordBreak('break-words'),
  fontWeight('font-medium'),
  fontFamily('font-primary'),
  fontSize('text-xl', 'md:text-2xl'),
  lineHeight('md:leading-8')
)
export const DimmedSubheaderText: FC = ({ children }) => (
  <div className={dimmedSubheaderText}>{children}</div>
)

const subheaderText = (centered?: boolean) =>
  classnames(
    primaryText,
    fontWeight('font-bold'),
    padding('py-3'),
    textAlign(centered ? 'text-center' : undefined),
    fontSize('text-xl')
  )
export const SubheaderText: FC<{
  centered?: boolean
}> = ({ children, centered }) => (
  <p className={subheaderText(centered)}>{children}</p>
)

const footerText = classnames(
  transitionColors,
  textColor('text-primary-text-dimmed'),
  fontSize('text-xs'),
  fontFamily('font-primary')
)
export const FooterText: FC = ({ children }) => {
  return <div className={footerText}>{children}</div>
}

const logoDot = classnames(textColor('text-accent'))
export const LogoDot: FC = ({ children }) => {
  return <span className={logoDot}>{children}</span>
}

const logoText = (large?: boolean) =>
  classnames(
    transitionColors,
    textColor('text-primary'),
    fontFamily('font-logo'),
    fontSize(large ? 'text-5xl' : 'text-3xl'),
    fontWeight('font-semibold')
  )
export const LogoText: FC<{ large?: boolean }> = ({ large, children }) => {
  return <span className={logoText(large)}>{children}</span>
}

const linkText = (centered?: boolean) =>
  classnames(
    textAlign(centered ? 'text-center' : 'text-left'),
    transitionColors,
    textColor('text-primary-dimmed')
  )
export const LinkText: FC<{
  href?: string | undefined
  centered?: boolean
}> = ({ children, href, centered }) => (
  <a
    className={linkText(centered)}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {children}
  </a>
)

const errorText = textColor('text-red-500')
export const ErrorText: FC = ({ children }) => {
  return <p className={errorText}>{children}</p>
}
