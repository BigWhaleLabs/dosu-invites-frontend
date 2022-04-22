import { ButtonHTMLAttributes, FC } from 'react'
import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  boxShadow,
  classnames,
  cursor,
  display,
  fontFamily,
  fontSize,
  fontWeight,
  justifyContent,
  margin,
  outlineStyle,
  padding,
  pointerEvents,
  textColor,
  transitionProperty,
  width,
} from 'classnames/tailwind'
import Loading from 'icons/Loading'

export enum ButtonType {
  primary = 'primary',
  accent = 'accent',
  error = 'error',
  success = 'success',
  primaryDimmed = 'primary-dimmed',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  title?: string
  disabled?: boolean
  disabledColor?: boolean
  outlined?: boolean
  circle?: boolean
  transparent?: boolean
  shadow?: boolean
  fullWidth?: boolean
  loading?: boolean
}

const buttonHover = (outlined?: boolean, transparent?: boolean) =>
  classnames(
    backgroundColor(
      transparent
        ? undefined
        : outlined
        ? 'hover:bg-accent'
        : 'hover:bg-primary-dimmed'
    ),
    textColor(outlined ? 'hover:text-white' : undefined)
  )

const buttonDisabled = (
  disabled?: boolean,
  outlined?: boolean,
  transparent?: boolean
) =>
  classnames(
    backgroundColor(
      disabled && !transparent
        ? outlined
          ? 'bg-transparent'
          : 'bg-primary-disabled'
        : outlined
        ? 'bg-transparent'
        : transparent
        ? 'bg-transparent'
        : 'bg-accent'
    ),
    textColor(
      disabled
        ? 'text-primary-disabled-text'
        : outlined
        ? 'text-accent'
        : transparent
        ? 'text-primary'
        : 'text-white'
    ),
    cursor(disabled ? 'cursor-not-allowed' : undefined),
    borderColor(
      outlined
        ? disabled
          ? 'border-primary-disabled-text'
          : 'border-accent'
        : undefined
    )
  )

const button = (
  disabled?: boolean,
  disabledColor?: boolean,
  outlined?: boolean,
  circle?: boolean,
  transparent?: boolean,
  shadow?: boolean,
  fullWidth?: boolean,
  loading?: boolean
) =>
  classnames(
    transitionProperty('transition-all'),
    pointerEvents('pointer-events-auto'),
    buttonDisabled(loading || disabled, outlined, transparent),
    borderWidth(outlined ? 'border' : undefined),
    borderRadius(
      outlined
        ? 'rounded-3xl'
        : circle
        ? 'rounded-full'
        : transparent
        ? undefined
        : 'rounded'
    ),
    width(fullWidth ? 'w-full' : undefined),
    padding(
      outlined && !circle ? 'py-2' : transparent ? undefined : 'py-3',
      outlined && !circle ? 'md:py-2' : transparent ? undefined : 'md:py-2',
      circle ? 'px-3' : transparent ? undefined : 'px-4',
      circle ? 'md:px-4' : transparent ? undefined : 'md:px-6'
    ),
    boxShadow(
      shadow ? 'md:shadow-lg' : undefined,
      shadow ? 'shadow-lg' : undefined
    ),
    disabled || loading || disabledColor
      ? undefined
      : buttonHover(outlined, transparent),
    display('flex'),
    justifyContent('justify-center'),
    alignItems('items-center'),
    outlineStyle('focus:outline-none'),
    fontFamily('font-primary'),
    fontSize('text-sm', 'md:text-base'),
    fontWeight('font-bold')
  )

const loadingMargin = classnames(margin('mr-1', 'md:mr-3'))

export const Button: FC<ButtonProps> = ({
  onClick,
  title,
  children,
  disabled,
  disabledColor,
  outlined,
  circle,
  fullWidth,
  transparent,
  shadow,
  loading,
}) => {
  const childBlock = loading ? <Loading /> : children
  const loadingStateLeft = (child?: boolean) => (
    <>
      {loading && (
        <div className={loadingMargin}>
          <Loading />
        </div>
      )}
      {child ? children : title}
    </>
  )
  const loadingStateChildren =
    children && typeof children !== 'string'
      ? childBlock
      : loadingStateLeft(true)

  return (
    <button
      className={button(
        disabled,
        disabledColor,
        outlined,
        circle,
        transparent,
        shadow,
        fullWidth,
        loading
      )}
      onClick={onClick}
      disabled={disabled || loading || disabledColor}
    >
      {children ? loadingStateChildren : loadingStateLeft(false)}
    </button>
  )
}
