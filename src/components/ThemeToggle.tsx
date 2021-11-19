import { Idea, Moon } from 'icons'
import { animated, useSpring } from 'react-spring'
import { classnames } from 'classnames/tailwind'
import { observer } from 'mobx-react-lite'
import AppStore from 'stores/AppStore'

const toggleContainer = classnames(
  'flex',
  'justify-center',
  'items-center',
  'justify-between',
  'py-0.5',
  'px-2',
  'border',
  'border-accent',
  'rounded-3xl',
  'transition-colors',
  'w-20',
  'h-10',
  'focus:outline-none'
)
const toggleButton = classnames(
  'origin-center',
  'duration-100',
  'transition-transform',
  'ease-linear'
)
const iconDiv = classnames('w-7', 'h-7', toggleButton)

const ThemeToggle = () => {
  const theme = AppStore.theme

  const moonAnimation = useSpring({
    transform: theme === 'light' ? 'rotate(360deg)' : 'rotate(0deg)',
    config: { mass: 1, tension: 210, friction: 30 },
  })

  const ideaAnimation = useSpring({
    transform: theme === 'light' ? 'rotate(0deg)' : 'rotate(360deg)',
    config: { mass: 1, tension: 210, friction: 30 },
  })

  const sharedProps = {
    theme,
    className: classnames('m-auto', 'h-full'),
  }

  return (
    <button
      className={toggleContainer}
      onClick={() => {
        AppStore.toggleDark()
      }}
    >
      <animated.div className={iconDiv} style={moonAnimation}>
        <Moon {...sharedProps} />
      </animated.div>
      <animated.div className={iconDiv} style={ideaAnimation}>
        <Idea {...sharedProps} />
      </animated.div>
    </button>
  )
}

export default observer(ThemeToggle)
