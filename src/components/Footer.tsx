import { FooterText } from 'components/Text'
import { Link } from 'react-router-dom'
import { classnames } from 'classnames/tailwind'

const footerContainer = classnames(
  'flex',
  'justify-center',
  'items-center',
  'mt-auto',
  'pt-3',
  'align-middle',
  'text-center'
)
const dotPadding = classnames('px-3')

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
