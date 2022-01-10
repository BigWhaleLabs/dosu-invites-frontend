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
  zIndex,
} from 'classnames/tailwind'
import { animated, useSpring } from 'react-spring'
import { useSnapshot } from 'valtio'
import AppStore from 'stores/AppStore'

const CookieNotification = () => {
  const { cookieAccepted } = useSnapshot(AppStore)

  const cookieContainer = classnames(
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
    backgroundColor('bg-background'),
    borderWidth('border'),
    borderColor('border-border'),
    borderRadius('rounded-2xl'),
    space('space-y-2', 'md:space-y-0'),
    zIndex('z-50')
  )

  const notifyAnimation = useSpring({
    transform: cookieAccepted ? 'translate(0px, 110px)' : 'translate(0px, 0px)',
    config: { mass: 1, tension: 210, friction: 30 },
  })

  return !cookieAccepted ? (
    <animated.div className={cookieContainer} style={notifyAnimation}>
      <BodyText>🍪 This website uses cookies</BodyText>
      <Button onClick={() => AppStore.acceptCookie()}>Got it!</Button>
    </animated.div>
  ) : null
}

export default CookieNotification
