import { FooterText } from 'components/Text'
import { Link } from 'react-router-dom'
import {
  alignItems,
  classnames,
  display,
  justifyContent,
  margin,
  padding,
  textAlign,
  verticalAlign,
} from 'classnames/tailwind'

const footerContainer = classnames(
  display('flex'),
  justifyContent('justify-center'),
  alignItems('items-center'),
  margin('mt-auto'),
  padding('pt-3'),
  verticalAlign('align-middle'),
  textAlign('text-center')
)
const dotPadding = classnames(padding('px-3'))

const Footer = () => {
  return (
    <div className={footerContainer}>
      <FooterText>
        <Link to={{ pathname: 'https://dosu.io/p/dosu/2' }} target="_blank">
          Privacy
        </Link>
        <span className={dotPadding}>{'•'}</span>
        <Link to={{ pathname: 'https://dosu.io/p/dosu/1' }} target="_blank">
          Terms
        </Link>
      </FooterText>
    </div>
  )
}

export default Footer
