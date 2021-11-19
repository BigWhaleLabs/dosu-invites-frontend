import { BodyText } from 'components/Text'
import { Button } from 'components/Button'
import { animated, useSpring } from 'react-spring'
import { classnames } from 'classnames/tailwind'
import AppStore from 'stores/AppStore'

const CookieNotification = () => {
  const hasCookie = AppStore.cookieAccepted

  const cookieContainer = classnames(
    'sticky',
    'flex',
    'flex-col',
    'md:flex-row',
    'items-center',
    'justify-between',
    'container',
    'max-w-4xl',
    'mx-auto',
    'bottom-4',
    'py-3',
    'px-4',
    'bg-background',
    'border',
    'border-border',
    'rounded-2xl',
    'space-y-2',
    'md:space-y-0'
  )

  const notifyAnimation = useSpring({
    transform: hasCookie ? 'translate(0px, 110px)' : 'translate(0px, 0px)',
    config: { mass: 1, tension: 210, friction: 30 },
  })

  return !hasCookie ? (
    <animated.div className={cookieContainer} style={notifyAnimation}>
      <BodyText>🍪 This website uses cookies</BodyText>
      <Button onClick={() => AppStore.acceptCookie()}>Got it!</Button>
    </animated.div>
  ) : null
}

export default CookieNotification
