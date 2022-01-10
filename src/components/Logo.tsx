import { FC } from 'react'
import { LogoDot, LogoText } from 'components/Text'
import { useNavigate } from 'react-router-dom'

interface LogoProps {
  large?: boolean
}

const Logo: FC<LogoProps> = ({ large = false }) => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => {
        navigate('/')
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
