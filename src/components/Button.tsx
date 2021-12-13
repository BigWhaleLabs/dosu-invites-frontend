import { ButtonHTMLAttributes, FC } from 'react'
import { classnames } from 'classnames/tailwind'
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
  outlined?: boolean
  circle?: boolean
  transparent?: boolean
  shadow?: boolean
  fullWidth?: boolean
  loading?: boolean
}

const buttonHover = (outlined?: boolean, transparent?: boolean) =>
  classnames(
    transparent
      ? undefined
      : outlined
      ? 'hover:bg-accent'
      : 'hover:bg-primary-dimmed',
    outlined ? 'hover:text-white' : undefined
  )

const buttonDisabled = (
  disabled?: boolean,
  outlined?: boolean,
  transparent?: boolean
) =>
  classnames(
    disabled && !transparent
      ? outlined
        ? 'bg-transparent'
        : 'bg-primary-disabled'
      : outlined
      ? 'bg-transparent'
      : transparent
      ? 'bg-transparent'
      : 'bg-accent',
    disabled
      ? 'text-primary-disabled-text'
      : outlined
      ? 'text-accent'
      : transparent
      ? 'text-primary'
      : 'text-white',
    disabled ? 'cursor-not-allowed' : undefined,
    outlined
      ? disabled
        ? 'border-primary-disabled-text'
        : 'border-accent'
      : undefined
  )

const button = (
  disabled?: boolean,
  outlined?: boolean,
  circle?: boolean,
  transparent?: boolean,
  shadow?: boolean,
  fullWidth?: boolean,
  loading?: boolean
) =>
  classnames(
    'pointer-events-auto',
    buttonDisabled(loading || disabled, outlined, transparent),
    outlined ? 'border' : undefined,
    outlined
      ? 'rounded-3xl'
      : circle
      ? 'rounded-full'
      : transparent
      ? undefined
      : 'rounded',
    fullWidth ? 'w-full' : undefined,
    // Small
    'text-sm',
    outlined && !circle ? 'py-2' : transparent ? undefined : 'py-3',
    circle ? 'px-3' : transparent ? undefined : 'px-4',
    shadow ? 'shadow-md' : undefined,
    // Desktop
    'md:text-base',
    outlined && !circle ? 'md:py-2' : transparent ? undefined : 'md:py-2',
    circle ? 'md:px-4' : transparent ? undefined : 'md:px-6',
    shadow ? 'md:shadow-lg' : undefined,
    // Hover
    disabled || loading ? undefined : buttonHover(outlined, transparent),
    shadow ? 'shadow-lg' : undefined,
    'flex',
    'justify-center',
    'items-center',
    'font-primary',
    'transition-all',
    'focus:outline-none',
    'font-bold'
  )

const loadingMargin = classnames('mr-1', 'md:mr-3')

export const Button: FC<ButtonProps> = ({
  onClick,
  title,
  children,
  disabled,
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
        outlined,
        circle,
        transparent,
        shadow,
        fullWidth,
        loading
      )}
      onClick={!loading && !disabled ? onClick : undefined}
      disabled={disabled}
    >
      {children ? loadingStateChildren : loadingStateLeft(false)}
    </button>
  )
}
