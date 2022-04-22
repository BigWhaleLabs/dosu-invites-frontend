import { FC } from 'react'
import { WaveTopBottomLoading } from 'react-loadingg'
import {
  alignItems,
  backgroundColor,
  classnames,
  display,
  flexDirection,
  height,
  inset,
  justifyContent,
  opacity,
  position,
  verticalAlign,
  width,
  zIndex,
} from 'classnames/tailwind'
import classNamesToString from 'helpers/classNamesToString'

interface LoaderProps {
  overlay?: boolean
  size?: 'small' | 'default' | 'large'
  className?: string
}

const Loader: FC<LoaderProps> = ({ overlay, size, className }) => {
  const wrapperStyles = classnames(
    display('flex'),
    flexDirection('flex-row'),
    inset('left-0', 'top-0'),
    width('w-full'),
    height('h-full'),
    justifyContent('justify-center'),
    verticalAlign('align-middle'),
    alignItems('items-center'),
    position(overlay ? 'absolute' : 'static'),
    opacity(overlay ? 'opacity-80' : 'opacity-100'),
    backgroundColor(overlay ? 'bg-background' : 'bg-transparent'),
    zIndex(overlay ? 'z-50' : 'z-auto')
  )

  return (
    <div className={classNamesToString([wrapperStyles, className])}>
      <WaveTopBottomLoading
        color="var(--accent)"
        size={size}
        style={{ position: 'relative', margin: 'auto' }}
      />
    </div>
  )
}

export default Loader
