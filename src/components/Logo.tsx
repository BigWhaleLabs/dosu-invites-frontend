import { FC } from 'react'
import { LogoDot, LogoText } from 'components/Text'
import { useHistory } from 'react-router-dom'

interface LogoProps {
  large?: boolean
}

const Logo: FC<LogoProps> = ({ large = false }) => {
  const history = useHistory()

  return (
    <button
      onClick={() => {
        history.push('/')
      }}
    >
      <LogoText large={large}>
        Dosu
        <LogoDot>.</LogoDot>
      </LogoText>
    </button>
  )
}

export default Logo
