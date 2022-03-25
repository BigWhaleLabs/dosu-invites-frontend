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

export const primaryText = classnames(
  transitionProperty('transition-colors'),
  textColor('text-primary')
)

const headerText = (h1?: boolean) =>
  classnames(
    transitionProperty('transition-colors'),
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
  transitionProperty('transition-colors'),
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

const bodyText = classnames(primaryText, fontSize('text-lg'))
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
    primaryText,
    fontWeight('font-bold'),
    padding('py-3'),
    textAlign(centered ? 'text-center' : undefined),
    fontSize(
      h2 ? { 'md:text-5xl': true, 'text-4xl': true } : 'text-xl',
      h3 ? { 'md:text-4xl': true, 'text-3xl': true } : undefined,
      h4 ? { 'md:text-3xl': true, 'text-2xl': true } : undefined,
      h5 ? { 'md:text-2xl': true, 'text-xl': true } : undefined,
      h6 ? { 'md:text-2xl': true, 'text-xl': true } : undefined
    )
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
  transitionProperty('transition-colors'),
  textColor('text-primary-text-dimmed')
)
export const SecondaryText: FC = ({ children }) => (
  <div className={secondaryText}>{children}</div>
)

const tinyText = classnames(fontSize('text-xs'))
export const TinyText: FC = ({ children }) => (
  <div className={classnames(tinyText, secondaryText)}>{children}</div>
)

const footerText = classnames(
  secondaryText,
  fontSize('text-xs'),
  fontFamily('font-primary')
)
export const FooterText: FC = ({ children }) => {
  return <div className={footerText}>{children}</div>
}

export const PopupBodyText: FC = ({ children }) => {
  return <div className={primaryText}>{children}</div>
}

const logoDot = classnames(textColor('text-accent'))
export const LogoDot: FC = ({ children }) => {
  return <span className={logoDot}>{children}</span>
}

const logoText = (large?: boolean) =>
  classnames(
    transitionProperty('transition-colors'),
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
    transitionProperty('transition-colors'),
    textColor('text-primary-dimmed')
  )
export const LinkText: FC<{
  href?: string | undefined
  centered?: boolean
}> = ({ children, href, centered }) => (
  <a className={linkText(centered)} href={href} rel="noopener noreferrer">
    {children}
  </a>
)
