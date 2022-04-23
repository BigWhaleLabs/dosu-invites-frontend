import { Idea, Moon } from 'icons'
import {
  alignItems,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  display,
  height,
  justifyContent,
  margin,
  outlineStyle,
  padding,
  transformOrigin,
  transitionDuration,
  transitionProperty,
  transitionTimingFunction,
  width,
} from 'classnames/tailwind'
import { animated, useSpring } from 'react-spring'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'
import Theme from 'models/Theme'

const toggleContainer = classnames(
  transitionProperty('transition-colors'),
  display('flex'),
  justifyContent('justify-between'),
  alignItems('items-center'),
  padding('py-0.5', 'px-2'),
  borderWidth('border'),
  borderColor('border-accent'),
  borderRadius('rounded-3xl'),
  width('w-20'),
  height('h-10'),
  outlineStyle('focus:outline-none')
)
const toggleButton = classnames(
  transformOrigin('origin-center'),
  transitionDuration('duration-100'),
  transitionProperty('transition-transform'),
  transitionTimingFunction('ease-linear')
)
const iconDiv = classnames(width('w-7'), height('h-7'), toggleButton)

function ThemeToggle() {
  const { theme } = useSnapshot(AppStore)

  const moonAnimation = useSpring({
    transform: theme === Theme.light ? 'rotate(360deg)' : 'rotate(0deg)',
    config: { mass: 1, tension: 210, friction: 30 },
  })

  const ideaAnimation = useSpring({
    transform: theme === Theme.light ? 'rotate(0deg)' : 'rotate(360deg)',
    config: { mass: 1, tension: 210, friction: 30 },
  })

  const sharedProps = {
    theme,
    className: classnames(margin('m-auto'), height('h-full')),
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

export default ThemeToggle
