import { LogoDot, LogoText } from 'components/Text'
import { useNavigate } from 'react-router-dom'

interface LogoProps {
  large?: boolean
}

export default function ({ large = false }: LogoProps) {
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
