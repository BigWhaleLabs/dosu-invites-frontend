import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
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
} from 'classnames/tailwind'
import ChildrenProp from 'models/ChildrenProp'
import Loading from 'icons/Loading'

interface ButtonProps {
  onClick?: () => void
  title?: string
  disabled?: boolean
  disabledColor?: boolean
  outlined?: boolean
  circle?: boolean
  loading?: boolean
}

const buttonHover = (outlined?: boolean) =>
  classnames(
    backgroundColor(outlined ? 'hover:bg-accent' : 'hover:bg-primary-dimmed'),
    textColor(outlined ? 'hover:text-white' : undefined)
  )

const buttonDisabled = (disabled?: boolean, outlined?: boolean) =>
  classnames(
    backgroundColor(
      disabled
        ? outlined
          ? 'bg-transparent'
          : 'bg-primary-disabled'
        : outlined
        ? 'bg-transparent'
        : 'bg-accent'
    ),
    textColor(
      disabled
        ? 'text-primary-disabled-text'
        : outlined
        ? 'text-accent'
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
  loading?: boolean
) =>
  classnames(
    transitionProperty('transition-all'),
    pointerEvents('pointer-events-auto'),
    buttonDisabled(loading || disabled, outlined),
    borderWidth(outlined ? 'border' : undefined),
    borderRadius(
      outlined ? 'rounded-3xl' : circle ? 'rounded-full' : 'rounded'
    ),
    padding(
      outlined && !circle ? 'py-2' : 'py-3',
      outlined && !circle ? 'md:py-2' : 'md:py-2',
      circle ? 'px-3' : 'px-4',
      circle ? 'md:px-4' : 'md:px-6'
    ),
    disabled || loading || disabledColor ? undefined : buttonHover(outlined),
    display('flex'),
    justifyContent('justify-center'),
    alignItems('items-center'),
    outlineStyle('focus:outline-none'),
    fontFamily('font-primary'),
    fontSize('text-sm', 'md:text-base'),
    fontWeight('font-bold')
  )

const loadingMargin = classnames(margin('mr-1', 'md:mr-3'))

export default function ({
  onClick,
  title,
  children,
  disabled,
  disabledColor,
  outlined,
  circle,
  loading,
}: ChildrenProp & ButtonProps) {
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
      className={button(disabled, disabledColor, outlined, circle, loading)}
      onClick={onClick}
      disabled={disabled || loading || disabledColor}
    >
      {children ? loadingStateChildren : loadingStateLeft(false)}
    </button>
  )
}
