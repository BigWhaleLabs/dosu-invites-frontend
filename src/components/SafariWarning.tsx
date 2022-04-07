import { BodyText } from 'components/Text'
import { Button } from 'components/Button'
import {
  alignItems,
  backgroundColor,
  borderColor,
  borderRadius,
  borderWidth,
  classnames,
  container,
  display,
  flexDirection,
  inset,
  justifyContent,
  margin,
  maxWidth,
  padding,
  position,
  space,
  transitionProperty,
  zIndex,
} from 'classnames/tailwind'
import { animated, useSpring } from 'react-spring'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'

const wrapper = classnames(
  position('sticky'),
  display('flex'),
  flexDirection('flex-col', 'md:flex-row'),
  alignItems('items-center'),
  justifyContent('justify-between'),
  container('container'),

  maxWidth('max-w-4xl'),
  margin('mx-auto'),
  inset('bottom-4'),
  padding('py-3', 'px-4'),

  borderWidth('border'),
  borderRadius('rounded-2xl'),
  borderColor('border-border'),
  backgroundColor('bg-background'),

  transitionProperty('transition-colors'),
  space('space-y-2', 'md:space-y-0'),
  zIndex('z-50')
)

const SafariWarning = () => {
  const { warningAccepted } = useSnapshot(AppStore)

  const notifyAnimation = useSpring({
    transform: warningAccepted
      ? 'translate(0px, 110px)'
      : 'translate(0px, 0px)',
    config: { mass: 1, tension: 210, friction: 30 },
  })

  return (
    <>
      {!warningAccepted && (
        <animated.div className={wrapper} style={notifyAnimation}>
          <BodyText center>
            🍺 Safari and web3 don't mix well. Please, use a different browser.
          </BodyText>
          <Button
            onClick={() => {
              AppStore.warningAccepted = true
            }}
          >
            Close
          </Button>
        </animated.div>
      )}
    </>
  )
}

export default SafariWarning
