import { FC } from 'react'
import { WaveTopBottomLoading } from 'react-loadingg'
import { classnames } from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import classNamesToString from 'helpers/classNamesToString'

interface LoaderProps {
  overlay?: boolean
  color?: string
  size?: 'small' | 'default' | 'large'
  speed?: number
  className?: string
}

const Loader: FC<LoaderProps> = ({
  color,
  overlay,
  size,
  speed,
  className,
}) => {
  const wrapperStyles = classnames(
    'flex',
    'left-0',
    'top-0',
    'w-full',
    'h-full',
    'justify-center',
    'align-middle',
    'flex-row',
    'items-center',
    overlay ? 'absolute' : 'static',
    overlay ? 'opacity-80' : 'opacity-100',
    overlay ? 'bg-background' : 'bg-transparent',
    overlay ? 'z-50' : 'z-auto'
  )

  return (
    <div className={classNamesToString([wrapperStyles, className])}>
      <WaveTopBottomLoading
        color={color || 'var(--accent)'}
        size={size}
        speed={speed}
        style={{ position: 'relative', margin: 'auto' }}
      />
    </div>
  )
}

export default observer(Loader)
